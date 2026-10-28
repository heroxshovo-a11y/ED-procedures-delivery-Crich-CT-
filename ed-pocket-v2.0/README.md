# ED Pocket v2.0 — Private clinical training preview

**Build date:** October 28, 2026. **Release status:** Private preview / not cleared for bedside clinical use. **Outside specialist approvals:** 0.

## Improvements made

- The v1.9 Emergency Mode, neonatal manual timeline, PPH thresholds, visual atlas, and original seven rapid guides remain.
- **No-OB delivery team brief:** a three-phase (Prepare, Birth, Handoff), two-patient staffing and communication flow with distinct maternal and newborn leads. All steps are rehearsal/preparation prompts, not automated orders.
- **24-topic source/risk triage:** `TOPIC-BY-TOPIC-AUDIT.md` and `CLINICAL-TOPIC-REGISTER.json` list review urgency, primary sources to reconcile and critical open items for every handbook topic; the in-app register shows 0 approvals pending credentialed specialist signoff. Triage is AI-assisted, *not* clinical validation.
- **Newborn hepatitis B policy-difference callout:** the 2025 CDC change for confirmed HBsAg-negative birth parents is visibly distinguished from AAP's still-universal birth-dose recommendation; positive/unknown HBsAg status and local policy remain critical.
- **On-device site planning:** 11 gear checklist items, optional site labels, and five editable planning statuses (on-site OB, neonatal specialist support, emergency blood, OR/surgery, transfer). These are remembered only locally and are not real-time capability checks.
- **Offline diagnostics:** service worker core-asset audit plus **cache-only decode** of the five original images packaged with the app. An Airplane Mode trial on the actual iPhone is still required.
- **Post-shift rehearsal:** seven scenario-specific prompts; local due dates of one or seven days, no free-text notes and no patient identifiers or clinical observations. The schedule is stored only in localStorage.
- **Unmodified high-risk medication doses:** existing reference tables carried forward; independent dose and concentration review remains a release gate.

## Privacy and security

The app has no analytics backend or user accounts and does not send patient information to its developer. Newborn and PPH *measurements* remain in-memory while the tab is open, and are cleared on leaving/reloading. Only theme, favorites, training scenario due dates and site planning selections persist in browser storage. **Do not enter patient names, dates, identifiers, or PHI in site labels.** Remote Wikimedia images and external reference links load only when chosen/viewed and can disclose network/browser metadata to those external sites.

## Testing

From the project root (Node.js, Python, Playwright and Chromium installed where applicable):

```sh
node --check rapid.js && node --check main.js && node --check review-index.js && node --check tools.js && node --check sw.js
python tests/verify_release.py
python tests/boundary_test.py
python tests/v19_smoke.py
python tests/v20_smoke.py
```

The Playwright smoke tests inject the frontend directly into an isolated browser viewport. **They are not tests of the installed service worker**; the current development environment blocks localhost/browser network navigation. Browser storage is simulated in the new v2.0 interaction test because `about:blank` denies access to localStorage. Run the private HTTPS preview on an actual iPhone, install to Home Screen, and complete `IPHONE-DEVICE-TEST.md` before any clinical deployment.

## Review gates

No version is authorized as hospital clinical decision support merely because it is deployed. Review requires named ABEM/OB/GYN/neonatal/pharmacy/clinical safety signoffs as applicable, reconciliation to current institutional formulary and procedures, simulation testing, real-device offline checks and version-pinned release evidence. See `SPECIALIST-SIGNOFF-TEMPLATE.md` and `TOPIC-BY-TOPIC-AUDIT.md`.

## Primary source anchors

- AHA/AAP 2025 neonatal: https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/neonatal-resuscitation
- WHO 2025 PPH: https://www.ncbi.nlm.nih.gov/books/NBK619233/
- RCOG 2026 shoulder dystocia: https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/shoulder-dystocia-green-top-guideline-no-42/
- DAS 2025 airway: https://doi.org/10.1016/j.bja.2025.10.006
- CDC Dec 2025 HBV statement: https://www.cdc.gov/media/releases/2025/fact-sheet-hepatitis-b-immunization.html
- AAP 2026 HBV statement: https://www.aap.org/en/patient-care/hepatitis-b/
