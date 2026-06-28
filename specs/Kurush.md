# Kurush: privacy-first local document browser

## Goal

Build a 100% local, privacy‑preserving system that:

* Ingests documents from configured local folders (PDF, JPEG, PNG)
* Performs OCR in multiple languages (EN, DE, ES, RU)
    * One document could contain multiple languages
* Translates all content to English
* Generates a one-line English title and concise English summary
* Indexes content for:
  * full‑text search
  * semantic (meaning‑based) search
* Serves results to a local Astro/React frontend
* Never sends data or telemetry to the internet

## High‑level architecture

```
Local folders  →  Python backend  →  Vector/Text Index  →  Astro/React UI
                    |  |  |
                    |  |  └─ Titles + summaries
                    |  └──── Translations
                    └────── OCR
```

Backend runs continuously as a local service. Frontend is a static web app served by the backend. Available on localhost and local network.

## Platform

**Apple Silicon macOS only.** MLX, launchd scheduling, and the memory budget assume an Apple Silicon Mac. Intel Mac, Linux, and Windows are out of scope — permanently, not a temporary limitation.

## Tech stack

### Backend (Python)

* uv — package manager
* FastAPI — REST API
* PaddleOCR (PP-OCRv5) — multilingual text extraction
    * good accuracy on complex layouts and mixed-language scans, 100+ languages, fast on CPU/Apple Silicon
    * accepts JPEG, PNG, and **PDF** natively (pass the file path; pages returned with `page_index`)
    * PaddleOCR defaults to the first 10 PDF pages — raise or remove via pipeline config (`max_num_input_imgs`) for longer documents
    * Optional fallback for hard scans/handwriting: a local vision-language OCR model (e.g. dots.ocr or Qwen2.5-VL via MLX)
* MLX (via mlx-lm) — local LLM inference on Apple Silicon
    * Suggested model: Qwen3 — strong multilingual translation + summarization, Apache 2.0. Gemma 3 is a good alternative
    * On a 16 GB Mac, default to Qwen3-4B (~2.5 GB 4-bit) for headroom; Qwen3-8B (~5 GB 4-bit) is the ceiling and should only run when models are staged sequentially (see Memory budget)
* sentence-transformers with BGE-M3 — multilingual embeddings
    * BGE-M3 covers 100+ languages with cross-lingual retrieval and an 8192-token context
    * MVP hybrid search: dense vectors (sqlite-vec) + FTS5 keyword; merge with reciprocal rank fusion (RRF)
    * Post-MVP optional: BGE-M3 sparse vectors, BGE-reranker-v2-m3
* sqlite-vec — vector search embedded directly in SQLite
    * collapses the vector store into the existing SQLite database — one file, transparent storage, trivial backups
* SQLite (FTS5 + sqlite-vec) — metadata, full-text index, and vector index in a single file

### Frontend (TypeScript)

* Astro + React
* Document browser
* Search (keyword + semantic)
* Original + translated text view
* Tailwind + [Tâmia](https://github.com/sapegin/tamia/)
* Oxlint/Oxfmt + [oxlint-config-raccoon](https://github.com/sapegin/oxlint-config-raccoon/)

## Folder‑based ingestion

Documents are loaded from a configurable list of local directories.

### Example: `config.yaml`

```yaml
watch_folders:
  - /Users/you/Documents/payslips
  - /Users/you/Documents/contracts
  - /Users/you/Documents/scans

ocr_languages:
  - en
  - de
  - es
  - ru

llm_model_path: models/qwen3-4b-4bit
embedding_model: BAAI/bge-m3

schedule:
  nightly:
    hour: 4
    minute: 0
    max_documents: 10
```

The agent should:

* Recursively scan folders
* Hash files to detect changes
* Skip already‑processed documents unless modified
* Pass each PDF by exact file path (PaddleOCR does not OCR PDFs discovered only via directory batch input)
* Delete index entries immediately when a watched file is missing; if the same path reappears, ingest creates a fresh record

## Daily index refresh

Index updates run automatically once per day via a single `launchd` job (more reliable than cron — catches up after sleep). Time comes from `schedule.nightly` in `config.yaml` (default: 04:00).

The nightly job runs **two sequential phases** in one process — fast path first, then LLM — so OCR, embeddings, and MLX never load at the same time:

| Phase | Script | Purpose |
|---|---|---|
| 1. Fast path | `ingest.py` | OCR, chunk, embed, index |
| 2. LLM | same run, after phase 1 | Title, summary, translation (up to `max_documents`) |

Typical volume is 1–3 new/changed documents per night; `max_documents` (default 10) caps the LLM phase if the queue grows.

### Installing the schedule

`scripts/install_launchd.sh` reads `config.yaml`, renders one LaunchAgent plist (`com.kurush.nightly`), installs it to `~/Library/LaunchAgents/`, and runs `launchctl load`. The plist runs `ingest.py --with-llm`. Re-run after schedule changes. Absolute paths to the venv Python are resolved at install time.

### Nightly job

The nightly script should:

**Phase 1 — fast path (all new/changed files):**

1. Scan configured folders
2. OCR new/changed files
3. Chunk and embed (BGE-M3)
4. Update search + vector indexes
5. Update `file_checksum`; mark documents needing LLM if summary or translation checksums lag

**Phase 2 — LLM (same process, after phase 1 completes):**

6. Title + summary, then translation, for up to `schedule.nightly.max_documents` documents

Documents become searchable as phase 1 finishes each file. Titles, summaries, and translations for the capped batch complete before the job exits; remaining queue items wait for the next night.

Manual commands should also exist:

```bash
python ingest.py [--full-reindex]           # phase 1 only
python ingest.py --with-llm [--max-documents N]  # both phases
python llm_worker.py [--max-documents N]    # phase 2 only
```

## Processing pipeline (per document)

Two sequential phases in one nightly run. Phase 1 (fast path) indexes all new/changed files; phase 2 (LLM) runs immediately afterward in the same process, capped by `max_documents`.

**Phase 1 — fast path (makes documents searchable):**

1. File detection & checksum
2. OCR (multi‑language) — images and PDFs via PaddleOCR; concatenate pages into `original_text`
3. Language detection — sets `language` (see below); required to skip translation for English-only documents
4. Chunking — ~512 tokens (~2000 characters) per chunk, 10% overlap, split on paragraph boundaries where possible; PDF chunks carry `page_number`
5. Vector embedding (BGE-M3 dense) — one vector per chunk; same text indexed in FTS5
6. Store metadata + paths

**Phase 2 — LLM (same nightly run, after phase 1):**

7. Title + summary generation (LLM, English) — one-line title (e.g. “Job contract with BlaBlaCorp”) and short summary; runs first
8. Full English translation (LLM) — for non-English documents; fills in the English reading view once ready

**English-only documents:** when `language` is `en`, skip the LLM translation step. Set `english_text = original_text`, `translation_source_checksum = file_checksum`, and `llm_status = translated`. Title and summary still run through the LLM. When `language` is `mixed` or any non-English code, run full translation.

Each nightly run processes up to `schedule.nightly.max_documents` documents in phase 2. Queue priority (within the cap):

1. Stale titles/summaries — `summary_source_checksum != file_checksum` (title + summary step)
2. Stale translations — summary current, `translation_source_checksum != file_checksum`
3. New documents — `llm_status: pending` (title + summary, then translation if cap remains)

Within each group, oldest `updated_at` first.

When a file changes on disk, phase 1 re-runs the fast path and bumps `file_checksum`. Existing title, summary, and translation stay visible but become stale until a subsequent nightly run refreshes them in phase 2 (see Stored fields).

Because OCR, the LLM, and the embedder don't all fit comfortably in 16 GB at once, the nightly job loads **one large model at a time** — OCR, then embedder, then MLX (see Memory budget).

### Stored fields

* file_path — unique; same path updates the row; missing path → row deleted on next ingest; reappearing path → new row
* id — integer primary key (API `{id}`)
* file_checksum — SHA-256 of raw file bytes; updated on every ingest when the file changed
* language — `en`, `de`, `es`, `ru`, or `mixed`
    * single code when one language clearly dominates the OCR text
    * `mixed` when substantial content appears in two or more languages (e.g. English letterhead + German body)
* original_text
* english_text — English reading view; for `language: en`, a copy of `original_text` (no LLM translation)
* title — one-line English label (LLM), e.g. “Job contract with BlaBlaCorp”; nullable until first title+summary pass; stale when summary is stale
* summary — short English paragraph (LLM); nullable until first title+summary pass; may be stale after file change
* summary_source_checksum — `file_checksum` when title and summary were last generated
* translation_source_checksum — `file_checksum` when translation was last generated
* chunks — text segments with optional `page_number` (PDF); indexed in FTS5 and sqlite-vec
* embeddings — BGE-M3 dense vector per chunk
* llm_status — `pending` / `summarized` / `translated` (worker progress for current content)
* created_at
* updated_at

Staleness is derived: title and summary are stale when `summary_source_checksum != file_checksum`; translation is stale when `translation_source_checksum != file_checksum`. The API should expose `title_stale`, `summary_stale`, and `translation_stale` booleans (`title_stale` mirrors `summary_stale`).

## Project structure

Basic folder layout:

```
frontend/   # Astro + React UI
  └─ dist/  # Production build output served by FastAPI
backend/    # Python backend (FastAPI + ingestion + vector store)
scripts/    # CLI scripts (ingest.py, llm_worker.py, install_launchd.sh)
models/     # Local LLM & embedding models
config.yaml # Configuration for watch folders, OCR languages, models, schedule
data/       # Processed documents, OCR text, embeddings, summaries
```

During development, the Astro dev server can run separately and proxy /api calls to the Python backend, enabling hot reload and faster iteration.

## API endpoints

### Search

A single endpoint performs semantic similarity (sqlite-vec dense) and keyword matching (FTS5 on chunk text), then merges with reciprocal rank fusion (RRF).

* `GET /api/search?q=` — hybrid semantic + full-text search

### Documents

* `GET /api/documents` — list with titles and summaries
* `GET /api/documents/{id}` — full data (`id` is an opaque integer SQLite primary key; unique on `file_path`)


## Memory budget (M1 / 16 GB)

Search/serving is light (BGE-M3 + SQLite, ~2 GB) and stays responsive. Ingestion is the constraint: OCR, the LLM, and the embedder do not all fit comfortably in 16 GB at once.

* The nightly job loads **one large model at a time** — phase 1 runs OCR then embeddings; phase 2 runs MLX — freeing each before loading the next. Single process, no overlap.
* Default to **Qwen3-4B** (~2.5 GB 4-bit) for headroom; Qwen3-8B (~5 GB 4-bit) only with strict sequential staging.
* Cap LLM context at 4–8K to bound the KV cache.

## Non‑goals

* Cloud sync
* External APIs
* Telemetry
* Vendor lock‑in
* Non-Apple Silicon platforms (Intel Mac, Linux, Windows)

## Principles

* Offline first
* Transparent storage
* Reproducible pipeline
* Easy backups
* Simple over clever

## Future enhancements

* Move/rename detection (same document, new path)
* **Structured metadata** (LLM-extracted, same staleness pattern as title/summary):
  * `document_date` — date from the document, if present (nullable)
  * `document_type` — e.g. payslip, contract, invoice, receipt
  * `issuer` — organization that issued the document (nullable)
  * `category` — user-facing grouping, e.g. work, utilities, insurance, health
* Filter and browse by type, category, issuer, and date in the UI
* BGE-M3 sparse vectors and BGE-reranker for search

## MVP checklist

* [ ] OCR working for all languages
* [ ] Local LLM responding
* [ ] Titles and summaries stored
* [ ] Embeddings searchable
* [ ] Astro UI browsing
* [ ] Daily scheduled nightly job (fast path + LLM)

## Success definition

A private, fast, Google‑like search experience across personal documents — searchable after phase 1 each night, with titles, summaries, and translations completing in phase 2 of the same run (or catching up over subsequent nights if the queue exceeds `max_documents`) — fully local, forever.
