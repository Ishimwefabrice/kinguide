# KinGuide — Development Plan

Source: Master Development Prompt (AUCA).  
Repo: https://github.com/Ishimwefabrice/kinguide

## Inspection summary (baseline → now)

| Area | Before | Now |
| --- | --- | --- |
| Single-page MVP | Yes | Replaced by multi-route app |
| Rule engine | In `guidelines/` | `src/engine/` + demo rules labelled NON-CLINICAL |
| Persistence | None | Dexie IndexedDB |
| Visual tree | None | React Flow |
| Router / shell | None | 9 real pages |
| Tests | 4 old | 2 engine tests (sample + empty history) |
| i18n / PWA / Playwright / full docs | Missing | Still missing (Phase 7–8) |

## Phase checklist

### Phase 1 — Foundation
- [x] Inspect workspace
- [x] DEVELOPMENT_PLAN.md
- [x] Tailwind + navy/teal tokens
- [x] React Router + app shell
- [x] Folder architecture
- [x] Engine fold + demonstration rules
- [x] Zustand + Dexie skeleton
- [x] Zod schemas (person / history)
- [x] App boots on all routes

### Phase 2 — Core data + family tree
- [x] Dexie tables
- [x] Person CRUD
- [x] Relationship cycle check (parent_of)
- [x] React Flow tree bound to DB
- [x] Persist across refresh

### Phase 3 — Medical history
- [x] Condition catalogue
- [x] Evidence statuses
- [x] Missing-information page
- [ ] Timeline UI polish
- [ ] Import validation UI

### Phase 4 — Rule engine upgrade
- [x] rule-types, evidence, evaluator, registry
- [x] reviewStatus = demonstration
- [ ] Deeper decision-table tests
- [ ] outcome-classifier module file

### Phase 5 — Assessments + findings
- [x] Assessment run + history
- [x] Step-by-step findings
- [x] Outdated flag after data change
- [ ] Progress UI during assessment

### Phase 6 — Reports + settings
- [x] Report preview / copy / print
- [x] JSON export + delete-all
- [ ] JSON import with Zod reject path
- [ ] Full privacy doc page

### Phase 7 — i18n + PWA
- [ ] en / rw / fr
- [ ] vite-plugin-pwa

### Phase 8 — QA + docs
- [ ] Playwright e2e
- [ ] docs/ academic pack + Mermaid
- [ ] ESLint

## Current focus

Continue **Phase 6 import + Phase 7 i18n** next session. See `NEXT_STEPS.md`.
