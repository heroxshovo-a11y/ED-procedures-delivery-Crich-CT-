from pathlib import Path
import re,json,hashlib
root=Path(__file__).resolve().parents[1]
rapid=(root/'rapid.js').read_text();main=(root/'main.js').read_text();sw=(root/'sw.js').read_text();html=(root/'index.html').read_text();css=(root/'style.css').read_text()
checks={
 'seven rapid guides':rapid.count("{id:'") == 7,
 'neonatal apnea high HR warning': 'HR ≥100 but apnea/gasping: CONTINUE ventilation' in rapid,
 'neonatal oxygen by gestational age': '≥35 weeks 21%' in rapid and '32–34+6 weeks 21–30%' in rapid,
 'no blind adhesiolysis in rapid card': 'Do not blindly disrupt adhesions' in rapid,
 'WHO abnormal hemodynamics': all(x in rapid for x in ['shock index >1','SBP <100','DBP <60']),
 'one tap rapid navigation': 'function quickJumps(id)' in main and '${quickJumps(id)}' in main,
 'safety warning not falsely signed off': 'No specialist clinical validation' in main,
 'guide-checklist reset': 'done=new Set()' in main and "$('#reset').addEventListener" in main,
 'offline service worker version': 'ed-pocket-core-v2.0-preview-20261028' in sw,
 'retains optional artwork across upgrade': "const ART_CACHE='ed-pocket-optional-anatomy-v1.7'" in sw,
 'cached clinical handbook': "'./full-reference.html'" in sw,
 'five locally bundled images': len(list((root/'anatomy').iterdir()))==5,
 'all 24 library topics': 'ED_LIBRARY' in rapid and rapid.count("['",rapid.find('ED_LIBRARY'))>=24,
 'metadata audit': len(json.loads((root/'CLINICAL-REVIEW.json').read_text())['lenses'])==5,
 'all chapter safety triages': len(json.loads((root/'CLINICAL-TOPIC-REGISTER.json').read_text())['entries'])==24,
 'v1.9 visible version': 'v2.0' in html,
 'tools module present': (root/'tools.js').exists() and '<script src="tools.js"></script>' in html,
 'tools precached': "'./tools.js'" in sw,
 'review index precached': "'./review-index.js'" in sw,
 'offline core audit wired': "CORE_AUDIT" in sw and "CORE_AUDIT" in (root/'tools.js').read_text(),
 'manual emergency stepper': "function drawCrisis()" in (root/'tools.js').read_text(),
 'NRP timed review': "function newbornMessage" in (root/'tools.js').read_text(),
 'PPH threshold logic': "function hemorrhageAnalysis" in (root/'tools.js').read_text(),
 'equipment list and site profiles': "profileKey='ed:equipment-profiles-v1'" in (root/'tools.js').read_text(),
 'rapid rehearsal mode': "function practice()" in (root/'tools.js').read_text(),
 'clinical review no misleading claims': "0 clinician-approved cards" in (root/'tools.js').read_text(),
 'tap target accessibility': 'min-height:44px' in css,
}
for entry in json.loads((root/'asset-integrity.json').read_text()):
 p=root/'anatomy'/entry['filename']
 checks['SHA256 artwork '+entry['filename']]=p.exists() and len(p.read_bytes())==entry['bytes'] and hashlib.sha256(p.read_bytes()).hexdigest()==entry['sha256']
for f in ['index.html','rapid.js','main.js','tools.js','style.css','sw.js','full-reference.html','manifest.webmanifest','icon-192.png','icon-512.png']:
 checks['core file '+f]=(root/f).exists()
for f in re.findall(r"'\./(diagrams/[^']+)'",sw):
 checks['diagram '+f]=(root/f).exists()
for key,v in checks.items():print(('PASS' if v else 'FAIL'),key)
assert all(checks.values()),'release checks failed'
print(f'{len(checks)} automated static safety/integrity assertions passed')
