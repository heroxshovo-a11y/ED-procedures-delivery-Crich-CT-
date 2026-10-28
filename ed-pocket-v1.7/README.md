# ED Pocket v1.7 — anatomy-first offline build

This branch contains a **reproducible source distribution** of ED Pocket, a physician-authored independent educational reference. It does **not** overwrite the current production application.

## What's new

- Five verified, licensed original Wikimedia medical illustrations can be bundled for offline use.
- Anatomy images are SHA-256 verified during packaging. A changed or unavailable source halts the build.
- Three additional advanced/procedural figures remain optional online images, not misrepresented as bundled.
- The application reports local/optional plate status separately, with a cache-only image decoding test.
- Existing seven rapid guides and 24-topic clinical handbook are unchanged; no image generation or medication calculations.

## Build

The source is stored as `source-archive.zip.b64` because the connected GitHub editor is text-only. Decode it, extract the source files, then run the reproducible fetch-and-package script:

```bash
base64 -d ed-pocket-v1.7/source-archive.zip.b64 > /tmp/ed-pocket-source.zip
mkdir -p /tmp/ed-pocket-v1.7
unzip -q /tmp/ed-pocket-source.zip -d /tmp/ed-pocket-v1.7
cd /tmp/ed-pocket-v1.7
python3 build_release.py
```

The build creates `/tmp/ED_Pocket_v1.7_Offline_Atlas_complete.zip` with five verified source images in `anatomy/`. If Wikimedia rate-limits a download, retry later; **do not publish a partial offline package**.

Review every illustration in a medical context before on-shift use. The guide is not institutionally endorsed or specialist validated.

## References and license compliance

See `anatomy-sources.json` and each illustration's original Commons link and licensing attribution inside the app. Preserve source authors and license notices. No patient data, logs, trackers, or accounts.
