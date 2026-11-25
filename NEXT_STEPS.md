# KinGuide — Next steps

## Done in this session

- Full app shell with working routes
- IndexedDB persistence + sample family (opt-in)
- React Flow tree
- Members + medical history CRUD
- Missing-info service
- Demonstration rule engine + assessments/findings
- Reports + settings export/delete
- `npm test` and `npm run build` green

## Remaining (priority)

1. JSON **import** with Zod validation and clear errors  
2. i18next **en / rw / fr** (structure first; clinical terms pending review)  
3. PWA offline via `vite-plugin-pwa`  
4. Playwright e2e: onboarding → sample → assess → report  
5. `docs/` AUCA pack (requirements, ethics, architecture, diagrams)  
6. Relationship editor UI on the tree (add parent/child from node)  
7. Expand unit tests for cycle detection + missing-info  

## How to continue

```bash
cd "C:\Users\Think BIG\Downloads\Ubwoko"
npm run dev
```

Then implement items 1–3 before adding more UI chrome.
