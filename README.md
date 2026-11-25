# KinGuide

**A Family Medical History Mapping and Explainable Clinical Referral Education System**

AUCA final-year Software Engineering prototype (Rwanda).  
**Not a medical device.** No risk percentages. No diagnoses. Unknown ≠ healthy.

## Run

```bash
npm install
npm run dev
```

```bash
npm test
npm run build
```

## What works now (Phases 1–2 + core modules)

- Welcome / onboarding (empty workspace or fictional sample — only on consent)
- App shell with Dashboard, Tree, Members, History, Missing Info, Assessments, Findings, Reports, Settings
- Dexie / IndexedDB persistence
- Zustand workspace store
- React Flow family tree
- Medical history with evidence statuses
- Deterministic **demonstration** rule engine (NON-CLINICAL)
- Assessment history with outdated marking
- Print / copy clinician conversation sheet
- JSON export + delete-all

## Architecture

See `DEVELOPMENT_PLAN.md` and `src/engine/`.

## License

MIT
