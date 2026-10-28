# Build and release notes — v1.8

This archive already includes the five SHA-256 verified image binaries listed in `asset-integrity.json`. **No external artwork download or build script is needed for the bundled images**. Four optional source plates are remote and only usable offline if saved and verified locally.

Test: `python3 tests/verify_release.py`, `node --check rapid.js`, `node --check main.js`, `node --check sw.js`, and (where the environment permits) `python3 tests/browser_smoke.py`.

Deploy the **unpacked directory** on a static HTTPS host; verify the service worker installation and the Visual Atlas's cache-only image checks on the actual iPhone, including in Airplane Mode, before relying on offline operation. Version is intentionally not published to production without a clinician and device review.

Source and licensing metadata: `anatomy-sources.json` and in-app credits; preserve all author/license links. No clinician credential or specialist sign-off is claimed.
