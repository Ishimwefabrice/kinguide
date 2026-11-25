# KinGuide — Project Concept Note

**Full title:** A Family Medical History Mapping and Explainable Clinical Referral Education System  

**Developer:** Ishimwe Fabrice  
**Institution:** Adventist University of Central Africa (AUCA), Rwanda  
**Type:** Final-year Software Engineering educational prototype  
**Repository:** https://github.com/Ishimwefabrice/kinguide  

---

## 1. Problem

Family medical history is useful for health education and clinical conversations, but:

- People often do not know which relatives and ages matter.
- Clinic visits are short.
- Missing information is easy to treat as “no disease,” which is unsafe.

## 2. Solution

KinGuide is a **browser-based, local-first** application that helps a user:

1. Build an interactive family tree.  
2. Record relatives and reported conditions.  
3. Flag unknown / incomplete information.  
4. Run **deterministic educational** pattern checks with step-by-step explanations.  
5. Generate a printable / copyable conversation sheet for a clinician visit.

**Findings:** MEETS / DISCUSS / NONE — with reasoning.  
**NONE never means “healthy.”** Unknown stays unknown.

## 3. Who it could help (future, after review)

- Students and educators in health / informatics.  
- Families preparing for clinic conversations.  
- Innovation programmes evaluating digital health education tools.

## 4. What it is not

- Not a medical device.  
- Not a diagnostic or risk-prediction system.  
- Not approved for clinical decision-making.  
- Not connected to hospital EHR in v1.

Current rules are labelled **demonstration / NON-CLINICAL** until professionally reviewed.

## 5. Technical approach

- React + TypeScript + Vite  
- Local persistence (IndexedDB / Dexie) — no KinGuide cloud required for core use  
- React Flow family tree  
- Deterministic rule engine separate from the UI  
- Export / delete local data  

**Privacy:** family data stays in the user’s browser. No mandatory accounts.

## 6. What we are asking partners for

At this stage we seek:

- Feedback on relevance to Rwanda’s health-education / digital-health landscape  
- Mentorship (health + technology)  
- Guidance on responsible next steps toward a supervised pilot  
- Possible sponsorship of further development (hosting, equipment, stipend) — **after** a review meeting  

We are **not** requesting a government purchase in the first contact.

## 7. Current status

| Area | Status |
| --- | --- |
| Working multi-page app | Done |
| Sample fictional family | Done |
| Tree, history, missing info | Done |
| Demo rule engine + findings + report | Done |
| Premium UI (Rwanda-inspired) | Done |
| Clinical rule validation | Not done |
| Institutional pilot | Not done |
| PWA / en–rw–fr i18n | In roadmap |

## 8. Contact

Ishimwe Fabrice  
Software Engineering Student, AUCA  
Email: *[add your email]*  
Phone: *[add your phone]*  
GitHub: https://github.com/Ishimwefabrice/kinguide  
