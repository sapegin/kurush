# Kurush: local document intelligence agent

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

* FastAPI — REST API
* Tesseract OCR — text extraction
* llama.cpp (via llama-cpp-python) — local LLM inference
* sentence-transformers — embeddings
* Chroma — vector database
* SQLite — metadata

### Frontend (TypeScript)

* Astro + React
* Document browser
* Search (keyword + semantic)
* Original + translated text view

## Folder‑based ingestion

Documents are loaded from a configurable list of local directories.

### Example: `config.yaml`

```yaml
watch_folders:
  - /Users/you/Documents/payslips
  - /Users/you/Documents/contracts
  - /Users/you/Documents/scans

ocr_languages:
  - eng
  - deu
  - spa
  - rus

llm_model_path: models/mistral-7b-q4.gguf
embedding_model: all-MiniLM-L6-v2
```

The agent should:

* Recursively scan folders
* Hash files to detect changes
* Skip already‑processed documents unless modified

## Daily index refresh

Index updates run automatically once per day.

### Preferred approach: cron job

Example (runs every night at 02:00):

```bash
0 2 * * * /path/to/project/venv/bin/python ingest.py >> ingest.log 2>&1
```

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

1. File detection & checksum
2. OCR (multi‑language)
3. Language detection (optional)
4. English translation (LLM)
5. Summary generation (LLM)
6. Chunking for embeddings
7. Vector embedding
8. Store metadata + paths

### Stored fields

* file_path
* original_text
* english_text
* summary
* chunks
* embeddings
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
config.yaml # Configuration for watch folders, OCR languages, models
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

## Performance targets (M1 Mac Mini)

* OCR: <1s per page
* Summaries: 2–5s per doc
* Search: instant

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
* [ ] Daily cron ingestion

## Success definition

A private, fast, Google‑like search experience across personal documents — with instant English summaries — fully local, forever.
