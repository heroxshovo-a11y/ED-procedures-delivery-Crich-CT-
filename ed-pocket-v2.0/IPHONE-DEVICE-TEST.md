# ED Pocket v2.0 — iPhone private-preview acceptance test

**Status: NOT YET PERFORMED ON USER DEVICE.** Do not mark passed until all steps are tested on the actual iPhone (including true network isolation).

1. Open the exact private preview HTTPS URL while online; complete Vercel authentication if prompted. Confirm version says **2.0** and a training-preview disclaimer appears.
2. Open all seven rapid guides, 24 detailed library topics (including the Hepatitis B note), Visual Atlas, and the delivery team brief. Ensure no blank or broken panels.
3. Open Neonatal timeline; test timer start, pause, reset, and HR ≥100 with apnea to ensure ventilation warnings are not silently dropped. Check that leaving/reopening clears the session.
4. Open PPH measurements; test blood loss 299, 300 mL + pulse 101, and 500 mL. Confirm entering and resetting HR/BP has the intended effect, and that no entries persist after reload.
5. Open **Offline diagnostics**. Complete the core-cache audit. Run **Test 5 bundled images without network** and confirm **5/5 successfully decoded**. Optional Wikimedia plates are not included in the local bundle.
6. Add the HTTPS preview to iOS Home Screen. Open the installed app online once, let the service worker activate, and repeat offline diagnostics.
7. Turn **Airplane Mode ON**, and ensure Wi-Fi remains OFF. Force-close and reopen the Home Screen app. Open Emergency Mode, two patient guides, the complete handbook, and all five local anatomy illustrations. Re-run the five-image cache-only test. Confirm navigation and images work; online source links can fail offline.
8. Restore connectivity. Confirm the site does not display a misleading all-clear when a required cache asset is missing or not decoded.
9. Reopen the app and verify your site profile is still present but **does not claim live stock/response availability**. Verify post-shift prompts contain no patient notes or identifiers.
10. Record device, iOS build, test date, exact preview URL, results and screenshots in a private QA log. Do not use identifiable patient data.

**Clinical release gate is separate:** passing offline technical tests does not validate medical accuracy or authorize clinical use.
