# Kurush: privacy-first local document browser

## Goal

Build a 100% local, privacy‑preserving system that:

* Ingests documents from configured local folders (PDF, JPEG, PNG)
* Performs OCR in multiple languages (EN, DE, ES, RU)
    * One document could contain multiple languages
* Translates all content to English
* Generates concise English summaries
* Indexes content for:
  * full‑text search
  * semantic (meaning‑based) search
* Serves results to a local Astro/React frontend
* Never sends data or telemetry to the internet

## High‑level architecture

```
Local folders  →  Python backend  →  Vector/Text Index  →  Astro/React UI
                    |  |  |
                    |  |  └─ Summaries
                    |  └──── Translations
                    └────── OCR
```

Backend runs continuously as a local service. Frontend is a static web app served by the backend. Available on localhost and local network.

## Tech stack

### Backend (Python)

* uv — package manager
* FastAPI — REST API
* PaddleOCR (PP-OCRv5) — multilingual text extraction
    * good accuracy on complex layouts and mixed-language scans, 100+ languages, fast on CPU/Apple Silicon
    * Optional fallback for hard scans/handwriting: a local vision-language OCR model (e.g. dots.ocr or Qwen2.5-VL via MLX)
* MLX (via mlx-lm) — local LLM inference on Apple Silicon
    * Suggested model: Qwen3 — strong multilingual translation + summarization, Apache 2.0. Gemma 3 is a good alternative
    * On a 16 GB Mac, default to Qwen3-4B (~2.5 GB 4-bit) for headroom; Qwen3-8B (~5 GB 4-bit) is the ceiling and should only run when models are staged sequentially (see Memory budget)
* sentence-transformers with BGE-M3 — multilingual embeddings
    * BGE-M3 covers 100+ languages with cross-lingual retrieval, an 8192-token context, and built-in dense + sparse vectors for hybrid search
    * Optional: BGE-reranker-v2-m3 to reorder top hybrid-search hits
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
  - german
  - es
  - ru

llm_model_path: models/qwen3-4b-4bit
embedding_model: BAAI/bge-m3

schedule:
  ingest:
    hour: 2
    minute: 0
```

The agent should:

* Recursively scan folders
* Hash files to detect changes
* Skip already‑processed documents unless modified

## Daily index refresh

Index updates run automatically once per day.

### Preferred approach: scheduled job

On the target Mac, a `launchd` agent is more reliable than cron (it catches up on missed runs while the machine was asleep). The run time comes from `schedule.ingest` in `config.yaml` (default: 02:00).

The ingestion script should:

1. Scan configured folders
2. OCR new/changed files
3. Translate to English
4. Generate summaries
5. Update search + vector indexes

Manual reindex command should also exist:

```bash
python ingest.py --full-reindex
```

## Processing pipeline (per document)

Two phases. The fast path makes a document searchable; the LLM work runs afterward in a background queue.

**Fast path (makes the document searchable):**

1. File detection & checksum
2. OCR (multi‑language)
3. Language detection (optional)
4. Chunking for embeddings
5. Vector embedding (BGE-M3 dense + sparse) — cross-lingual, so a German or Spanish document is searchable in English without waiting for translation
6. Store metadata + paths

**Background queue (async LLM jobs, lower priority):**

7. Summary generation (LLM, English) — short, runs first
8. Full English translation (LLM) — heavier; fills in the English reading view once ready

Because OCR, the LLM, and the embedder don't all fit comfortably in 16 GB at once, the worker processes these stages with one large model loaded at a time (see Memory budget).

### Stored fields

* file_path
* language
* original_text
* english_text — nullable until the async translation job completes
* summary — nullable until the async summary job completes
* chunks
* embeddings
* llm_status — pending / summarized / translated (drives the background queue)
* created_at
* updated_at

## Project structure

Basic folder layout:

```
frontend/   # Astro + React UI
  └─ dist/  # Production build output served by FastAPI
backend/    # Python backend (FastAPI + ingestion + vector store)
scripts/    # CLI scripts (ingestion, reindexing)
models/     # Local LLM & embedding models
config.yaml # Configuration for watch folders, OCR languages, models, schedule
data/       # Processed documents, OCR text, embeddings, summaries
```

During development, the Astro dev server can run separately and proxy /api calls to the Python backend, enabling hot reload and faster iteration.

## API endpoints

### Search

A single endpoint performs both semantic similarity and keyword matching, then merges and prioritizes results.

* `GET /api/search?q=` — hybrid semantic + full-text search

### Documents

* `GET /api/documents` — list with summaries
* `GET /api/documents/{id}` — full data


## Memory budget (M1 / 16 GB)

Search/serving is light (BGE-M3 + SQLite, ~2 GB) and stays responsive. Ingestion is the constraint: OCR, the LLM, and the embedder do not all fit comfortably in 16 GB at once.

* The ingestion worker keeps **one large model loaded at a time** — OCR, then (in the background queue) the LLM, then embeddings — freeing each before loading the next. Batch latency is irrelevant here, so staging is free.
* Default to **Qwen3-4B** (~2.5 GB 4-bit) for headroom; Qwen3-8B (~5 GB 4-bit) only with strict sequential staging.
* Cap LLM context at 4–8K to bound the KV cache.

## Non‑goals

* Cloud sync
* External APIs
* Telemetry
* Vendor lock‑in

## Principles

* Offline first
* Transparent storage
* Reproducible pipeline
* Easy backups
* Simple over clever

## Future enhancements

* Named entity extraction (people, companies, dates)
* Automatic document type detection (payslips, contracts)

## MVP checklist

* [ ] OCR working for all languages
* [ ] Local LLM responding
* [ ] Summaries stored
* [ ] Embeddings searchable
* [ ] Astro UI browsing
* [ ] Daily scheduled ingestion

## Success definition

A private, fast, Google‑like search experience across personal documents — with instant English summaries — fully local, forever.
