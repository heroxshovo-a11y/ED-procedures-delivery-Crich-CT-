# ED Pocket v1.8 — five-perspective safety review (AI-assisted, not clinical sign-off)

**Date:** 28 October 2026. **Source:** v1.7 verified offline bundle.

These are five deliberately separated model-review perspectives. They were **not five independent licensed clinicians**. No board certification or external medical approval is claimed. No images were generated.

## Five passes

1. **ED resuscitation & safety — High:** In the newborn HR ≥100 branch, the old card suggested supporting spontaneous breathing without clearly saying what to do if the baby was still apneic. Corrected to **continue assisted ventilation while apnea/gasping persists, even with HR ≥100**. Avoid equating HR response with adequate spontaneous respirations. [AHA/AAP 2025]
2. **Neonatal emergencies — Moderate:** Added guideline starting oxygen fractions by gestational age with preductal saturation titration. Kept epinephrine dose unchanged. [AHA/AAP 2025]
3. **Airway & procedures — Moderate:** Reworded thoracostomy finger confirmation to prohibit blind adhesion disruption and excessive force. Kept surgical eFONA material without dose or equipment changes. [Original guide; DAS 2025]
4. **Obstetrics — Moderate:** Made PPH hemodynamic triggers explicit; improved reassessment, medication-timing and dystocia documentation reminders. [WHO 2025; RCOG 2026]
5. **Human factors — Moderate:** Added one-tap emergency transitions and larger phone touch targets; removed a misleading 'reviewed' claim from the dashboard. Retained the v1.7 optional-artwork cache name so existing downloads survive the upgrade.

## Verification

`python3 tests/verify_release.py` checks clinical safety invariants, all local assets against SHA-256 manifests, file presence, and source references. `node --check` validates both scripts. Browser smoke tests should cover rapid-guide navigation, step resets, links, library, atlas and offline app shell.

## Boundaries and unresolved questions

- **Not clinician-approved.** Have an ABEM-certified ED attending, OB/GYN, neonatal resuscitation instructor and local pharmacy review before bedside reliance.
- Detailed 24-topic handbook remains dated 18 Sep 2026; **not all content was revalidated** in this pass.
- Hospital-specific medication, contraindication, equipment, procedural training and escalation protocols require local reconciliation.
- Need real iPhone offline testing. Five images are bundled; four are optional online/cache.

## Sources

- AHA/AAP 2025 neonatal resuscitation: https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/neonatal-resuscitation
- WHO 2025 postpartum hemorrhage: https://www.ncbi.nlm.nih.gov/books/NBK619233/
- RCOG shoulder dystocia Green-top 42 (2026): https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/shoulder-dystocia-green-top-guideline-no-42/
- DAS 2025 difficult airway guideline: https://doi.org/10.1016/j.bja.2025.10.006
