# Ubwoko

**Your family tree, checked against educational clinical-referral patterns.**

Ubwoko is an AUCA final-year style prototype: draw (or load) a family history, run deterministic guideline-inspired rules, and print a one-page conversation sheet for a clinician visit.

It is **not a medical device**. It does not output risk percentages or diagnoses. Unknown facts stay unknown — they are never treated as “healthy.”

## Why this project

Family history is cheap screening input, but short appointments rarely leave time to walk a full tree. Ubwoko helps a patient or student arrive already knowing which **educational** patterns their family might meet, and what information is still missing.

Inspired by the ideas behind KinTrace (DSH Hacks), rebuilt as an original product with a Rwanda / AUCA teaching framing.

## Features

- Family tree editor (relations, sex, living status, conditions, ages)
- Three educational rule packs:
  - Breast & ovarian family patterns
  - Bowel cancer clustering
  - Early heart disease / FH-style family history (shows when guidelines disagree on age cut-offs)
- Findings: **meets** / **discuss** / **none**, with step-by-step yes/no/unknown
- “What we don’t know” panel
- Copyable doctor conversation sheet
- Fully client-side (no accounts, no API keys for the MVP)

## Stack

- React 19 + TypeScript + Vite
- Vitest for rule tests
- CSS (moss / clay visual system — no purple dashboard look)

## Run locally

```bash
npm install
npm run dev
```

```bash
npm test
npm run build
```

## How it is built (architecture)

```
src/
  types.ts              # Person, Finding, Guideline contracts
  tree.ts               # Relations, helpers, sample family, gaps
  guidelines/
    breastOvarian.ts    # Deterministic rules (teaching simplification)
    colorectal.ts
    heart.ts
    index.ts            # evaluateAll()
    guidelines.test.ts  # Unit tests for rule behaviour
  report.ts             # Plain-text clinician sheet
  App.tsx               # UI only — no medical decisions in components
  styles.css
```

**Design rule:** the UI never decides. Only pure functions in `guidelines/` return findings. That makes the thesis easy to defend: every result traces to a written step.

## Ethics for your AUCA write-up

- Label every demo “educational / prototype”
- Cite that real NICE / Amsterdam / FH tools are more complex than this MVP
- Prefer clinician review of wording before any community pilot
- Do not collect patient data on a server in v1

## License

MIT
