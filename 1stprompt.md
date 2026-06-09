# SNK MES Dashboard — Claude Code Prompt
**Task:** Backend + Database + Frontend Integration + systemd Service  
**Repo:** `one-pd`  
**Prepared by:** Dev Team Lead

> **How to use:** Open terminal at the root of the `one-pd` repo and paste this prompt.  
> Claude Code must re-read this file **every session** along with: `CLAUDE.md`, `roadmap.md`, `architecture.md`, `phase-a.md`, `progress.md`.

---

## 0. Role & Ironclad Rules

You are a **Senior Full-Stack/Platform Engineer** taking over from the frontend team.  
The frontend (React 18 + Vite + Tailwind + Recharts) is **100% complete** and runs using mock data from `src/data/mock.js`.  
Your job: build the real backend + database, then gradually swap mock data for the real API **without breaking the UI**.

### Non-Negotiable Rules

| # | Rule |
|---|------|
| 1 | Do **not** modify CSS strings in `src/components/layout/Sidebar.jsx` (CSS-in-JS) |
| 2 | Do **not** hardcode colors — use existing CSS variables |
| 3 | Do **not** change the chart library — use **Recharts only** |
| 4 | Do **not** use `localStorage` on the frontend — use React Context |
| 5 | Do **not** commit secrets or `.env` to git — provide `.env.example` instead |
| 6 | After every completed step → update `progress.md` |
| 7 | Work in small steps, commit frequently with meaningful messages |
| 8 | If data/schema is ambiguous → **ask first**, do not guess and write large code blocks |

---

## 1. Project Objectives

**SNK MES Dashboard** = Manufacturing Execution System for the SNK ceramic (sanitaryware) factory.  
**Users:** Production Manager / MD / C-Level  
**Business Goal** *(from `phase-a.md`)*: Reduce costs from **2,300 → 1,700 THB/Set** by reducing Defect Loss across every stage via three steps:

1. **Defect Watchdog** — immediate awareness
2. **Defect Analysis** — root cause from parameters
3. **Agentic AI** — suggest actions, human decides

### 6 Production Stages
`slip-prep` · `glaze-prep` · `casting` · `drying` · `spraying` · `firing`

### Main Pages
Dashboard overview · 6× Stage Detail · Alerts · Reports · Settings · ManualKeyIn · KPI detail pages (OEE / Takt / WIP / MTTR)

### Target Stack *(from `roadmap.md`)*
React/Vite · **FastAPI** · **TimescaleDB** · Redis · EMQX · Keycloak · Kong · Node-RED · Tailscale · Grafana

> **This phase:** Focus on **FastAPI + PostgreSQL/TimescaleDB** (+ Redis cache if needed).  
> EMQX / Keycloak / Kong / Node-RED = design-for but do not fully implement yet.

---

## 2. Source JSON Files (Schema + Seed Data)

> ⚠️ Always read the actual files to verify schema before writing models.

### (a) `casters.json`
- 148 records — caster master data
- Fields: `id`, `employee_id`, `caster_id`, `name`, `factories[]` (e.g. `["SNK1","SNK2"]`)

### (b) `gi_inspectors.json`
- 24 records — GI inspector master data
- Fields: `id`, `employee_id`, `gi_id`, `name`, `factories[]`

### (c) `slip_prop_standards.json`
- Object: `{ slip_prop_standards: { meta, spec_history[] } }`
- `spec_history` = versioned min/max specs per `effective_date` and `line`

### (d) `body_properties_SNK_2026.json`
- Object: `{ slip_prop: { meta, spec_control[], daily_records[], chart_data_vc[], chart_data_hpc[], latest_daily_report, calendar } }`
- `spec_control[]` example fields: `effective_date`, `line`, `conc{min,max}`, `v0{min,max}`, `v30{min,max}`, `yield_value{min,max}`, `thixo{min,max}`, `casting_rate{min,max}`

### (e) `slip_prop_records.json`
- Object: `{ slip_prop: { daily_records[732], latest_daily_report } }`
- `daily_records[]` — daily timeseries of Body Slip per line/tank:
  - Fields: `date`, `line_no`, `tank_no`, `type` (`"Conv"` / `"HPC"`), `conc_g200ml`, `temp_c`, `v0_sec100ml`, `v30_sec100ml`, `yield_value`, `f0`, `f5`, `thixo_f0_f5`, `casting_rate_mm20min`
  - ⚠️ Many values are `null` (not yet recorded) — schema must support nullable fields

### (f) `qrcode_snk.json` ⚠️ Large (~60 MB)
- Object: `{ SNK1: { metadata, records }, SNK2: { ... } }`
- SNK1 ≈ 122,353 records · SNK2 ≈ 2,408 records
- Record fields: `"QR Code"`, `"Export Name"`, `"Create Update"` (datetime), `"Material"`, `"Model"`, `"Caster ID"`, `"Caster Name"`, `"GI ID"`, `"GI Name"`, `"Type"`, `"Result Work"` (`"Good"`/...), `"Result"` (`"Perfect"`/...), `"Defect"`, `"Klin Key"` (`"TK1"`...), `"ZGI"`

**FK Relationship Note — verify with actual data:**
- `qrcode."Caster Name"` appears to store `employee_id` (e.g. `"000082"`)
- `qrcode."Caster ID"` = internal `caster_id` (e.g. `"2846"`)
- GI follows the same pattern
- Mapping: `qrcode."Caster Name"` → `casters.employee_id` · `qrcode."GI Name"` → `gi_inspectors.employee_id`
- Check match % before proceeding and **report any unjoined records**

> ⚠️ Do **NOT** load the entire `qrcode_snk.json` into memory during seeding.  
> Use a **streaming parser** (e.g. `ijson`) with chunked/batch inserts.

---

## 3. Deliverables

Create a clear, separate backend folder: **`server/`** at the repo root.  
Do not modify `src/` more than necessary.

---

### 3.1 Database

- **Use PostgreSQL + TimescaleDB extension** (per roadmap)
- If TimescaleDB is difficult to install locally, start with pure PostgreSQL and add a migration to enable hypertables later — **state your approach clearly**

#### Proposed Schema

| Table | Source |
|-------|--------|
| `dim_caster` | `casters.json` |
| `dim_gi_inspector` | `gi_inspectors.json` |
| `dim_factory` | SNK1 / SNK2 |
| `dim_model` / `dim_material` | Normalize from qrcode if worthwhile |
| `fact_qr_scan` | qrcode records (hypertable on `"Create Update"`, index: factory, model, caster_id, gi_id, defect, result, time) |
| `slip_daily_record` | `slip_prop_records` daily_records (timeseries) |
| `slip_spec_control` / `slip_spec_history` | Versioned min/max specs |
| `alert`, `alert_rule`, `ai_suggestion`, `decision_log` | Future-proofing |

- Write migrations using **Alembic** (versioned, reversible)
- Write an **idempotent seed/ETL script** (re-runnable without duplicating data)
  - Support large files via streaming + batching
  - Summarize: rows inserted + rows where FK joins failed
- Write a short **data quality report** (null counts, FK match %, date ranges)

---

### 3.2 Backend API (FastAPI)

**Stack:** FastAPI + SQLAlchemy 2.x + Pydantic v2 + Alembic + uvicorn/gunicorn

**Structure:**
```
server/
└── app/
    ├── main.py
    ├── api/
    │   └── routers/
    ├── models/
    ├── schemas/
    ├── crud/
    ├── db/
    └── core/
        └── config.py
tests/
```

- Configuration via `.env` — no hardcoding. Include `.env.example`
- CORS must allow `http://localhost:5173` (Vite dev) and prod domains
- `/health` and `/docs` (OpenAPI) must be functional
- All aggregate/summary logic done **in SQL**, not by pulling raw data into Python

#### Endpoints — Must Match `mock.js` Exports

| Endpoint | Description |
|----------|-------------|
| `GET /api/pipeline` | 6 stage cards + status |
| `GET /api/overview` | oee, takt, wip, mttr |
| `GET /api/parameter-defect?stage=&defect=&param=&view=&from=&to=` | Timeseries param + defect bar + UCL/LCL |
| `GET /api/stages/{stageId}/params` | stageParams for StageDetail |
| `GET /api/yield?type=clay\|firing` | Segments (Good/Repair/Scrap) + target |
| `GET /api/metrics` | Slip in / WH in etc. |
| `GET /api/notifications` | Alert list |
| `GET /api/alerts` | Alert list |
| `PATCH /api/alerts/{id}` | Resolve alert |
| `GET /api/casters` | Master data |
| `GET /api/gi-inspectors` | Master data |
| `GET /api/qr-scans?...&page=&size=` | Piece-level query (pagination required) |
| `GET /api/defects/summary?from=&to=&factory=&stage=` | Aggregate defect rate (Pareto, by model/caster) |

- All endpoints with large lists → **pagination + filter + sort**
- Include Pydantic response models + OpenAPI examples for everything

---

### 3.3 systemd Service (Linux Production Deployment)

Create files under `deploy/systemd/`:

**`snk-mes-api.service`**
- Runs gunicorn + uvicorn workers (FastAPI)
- `Restart=always`
- `EnvironmentFile=/etc/snk-mes/api.env`
- Non-root `User`/`Group`
- `WorkingDirectory` set correctly
- `After=network.target postgresql.service`

**`snk-mes-worker.service`** *(optional)*
- For background jobs (ETL / alert evaluation)

**`deploy/README.md`** — Install instructions:
```bash
sudo cp deploy/systemd/*.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now snk-mes-api
journalctl -u snk-mes-api -f
```

**`deploy/nginx.conf.example`** *(recommended)*
- Reverse proxy `/api` → `:8000`
- Serve static build from `dist/`

**`docker-compose.yml`** *(dev alternative)*
- Services: `postgres/timescaledb` + `redis` + `api`

---

### 3.4 Frontend → API Connection (Safe Mock → Real Swap)

1. **Create data layer:** `src/services/api.js`  
   - Fetch wrapper reading `import.meta.env.VITE_API_BASE_URL`
   
2. **Create hooks:** `src/hooks/` (e.g. `usePipeline`, `useOverview`, ...)  
   - Each hook returns data formatted **exactly** like `mock.js`

3. **Feature flag:**  
   - If `VITE_USE_API=false` or fetch fails → fallback to original `mock.js`  
   - Prevents UI breakage while backend is pending

4. Do **NOT** change existing component props — hooks must transform payload to fit existing props

5. Add simple **loading / error / empty** states (using theme CSS variables)

6. Add proxy in `vite.config.js`: `/api` → backend (bypasses CORS in dev)

7. Swap **page by page**, starting with Dashboard

---

## 4. Gap Analysis & Fixes

Inspect and report the following gaps; propose/implement fixes (seek approval for major changes):

| # | Gap | Action |
|---|-----|--------|
| 1 | Mock fields without real data source | Flag as "derived" or "needs sensor" per `phase-a.md` |
| 2 | `Defect` field in qrcode may be free-text | Propose `dim_defect_type` normalization → map to: `pinhole`, `crack`, `discoloration`, `deformation`, `grain-size`, `surface`, `color` |
| 3 | Parameter→Defect mapping (Table §10 in `CLAUDE.md`) | Create views/endpoints to support correlation/insight |
| 4 | Datetime normalization | Normalize all `"Create Update"` / `date` strings to `timestamptz` (Asia/Bangkok) |
| 5 | Indexing on `fact_qr_scan` (125k+ rows, growing) | Define indexes upfront |
| 6 | Basic security | Secure CORS, rate-limit heavy endpoints, validate query params; prepare for Keycloak later |
| 7 | Reproducible seed | Write `Makefile` or `scripts/` for end-to-end one-command execution |

**Optional additions (if valuable, avoid scope creep):**
- Redis caching for summaries
- `POST /api/slip-records` for ManualKeyIn
- Seed-from-latest for demos
- Data validation rules (out-of-spec flags)
- pytest with small sample data

---

## 5. Workflow Steps

> **One commit per step. Update `progress.md` after each step.**

| Step | Task |
|------|------|
| **S1** | Explore repo → read `CLAUDE.md`, `roadmap.md`, `phase-a.md`, `architecture.md`, `progress.md` → inspect all 6 JSON files (stream `qrcode_snk.json`) → produce: ① ER diagram proposal, ② endpoint→mock mapping, ③ PostgreSQL vs TimescaleDB approach. **Stop and wait for review.** |
| **S2** | Scaffold `server/` (FastAPI + SQLAlchemy + Alembic) + docker-compose dev DB + `/health` passes |
| **S3** | Alembic migrations (all tables) + idempotent ETL/seed + data quality report |
| **S4** | First batch of endpoints: `pipeline`, `overview`, `notifications`, `yield`, `metrics` + test with curl/pytest |
| **S5** | Frontend data layer + hooks + feature flag + swap Dashboard to API (with mock fallback) |
| **S6** | Remaining endpoints: `parameter-defect`, `stage params`, `qr-scans`, `defects/summary`, `alerts resolve` + swap StageDetail / Alerts / Reports pages |
| **S7** | systemd units + `deploy/README` + nginx example + test `systemctl` (or simulate) |
| **S8** | Final review: lint, pytest, `npm run build`, summarize remaining gaps → update `progress.md` |

---

## 6. Acceptance Criteria

- [ ] `docker compose up` (or systemd DB) + seed → all 6 JSON files loaded, FK match % report generated
- [ ] FastAPI `/health` = ok, `/docs` functional, all endpoints return payloads matching frontend component requirements exactly
- [ ] Frontend with `VITE_USE_API=true` loads Dashboard + at least 1 Stage Detail using real API; falls back to mock when flag is disabled
- [ ] systemd `.service` installed, runs via `systemctl enable --now`, auto-restarts, logs via `journalctl`; clear `deploy/README` included
- [ ] No secrets in git, `.env.example` exists, `npm run build` and `pytest` pass
- [ ] `progress.md` updated + summary of remaining gaps/proposals documented

---

## 7. First Command (Start Here — S1)

```
Read CLAUDE.md, roadmap.md, phase-a.md, architecture.md, progress.md.

Then inspect all 6 JSON files. For qrcode_snk.json use streaming (do not load fully into memory).

Deliver:
  1. Proposed ER diagram (tables, columns, FK relationships)
  2. Endpoint → mock.js export mapping table
  3. Recommendation: PostgreSQL-only vs TimescaleDB from day one, with rationale

Stop and wait for my review before writing any code.
```
