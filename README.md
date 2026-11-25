# KinGuide

**Family history → educational referral patterns → a conversation sheet for the clinic.**

KinGuide is an AUCA final-year style prototype: build a family tree, run deterministic guideline-inspired rules, and copy a one-page sheet to discuss with a clinician.

It is **not a medical device**. It does not output risk percentages or diagnoses. Unknown facts stay unknown — they are never treated as “healthy.”

## Problem

Family history is useful screening input, but short appointments rarely leave time to walk a full tree. People often do not know which relatives and ages matter.

## Solution

- Family tree editor (relations, sex, living status, conditions, ages)
- Three educational rule packs (breast/ovarian, bowel clustering, early heart / FH-style)
- Findings: **meets** / **discuss** / **none**, with yes / no / unknown steps
- “What we don’t know” panel
- Copyable clinician conversation sheet
- Fully client-side (no accounts, no API keys in v1)

## Stack

React 19 · TypeScript · Vite · Vitest · CSS

## Run

```bash
npm install
npm run dev
```

```bash
npm test
npm run build
```

## Architecture

```
src/
  types.ts
  tree.ts                 # relations, sample family, gaps
  guidelines/*.ts         # only place decisions are made
  report.ts               # clinician sheet
  App.tsx                 # UI only
```

**Rule:** the UI never decides. Pure functions return findings so every result can be defended in a thesis.

## Ethics

Educational prototype. Real clinical guidelines are more complex. Do not collect patient data on a server in v1.

## License

MIT
