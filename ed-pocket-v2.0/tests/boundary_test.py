from pathlib import Path
from playwright.sync_api import sync_playwright
r=Path(__file__).resolve().parents[1]
html=(r/'index.html').read_text().replace('<link rel="stylesheet" href="style.css"/>','<style>'+ (r/'style.css').read_text()+'</style>')
for fn in ['rapid.js','main.js','review-index.js','tools.js']:
 html=html.replace(f'<script src="{fn}"></script>','<script>'+ (r/fn).read_text()+'</script>')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page();page.set_content(html)
 result=page.evaluate('''()=>{
 const fn=window.ED_TOOLS.hemorrhageAnalysis;
 return [fn(299,101,null,null),fn(300,100,100,60),fn(300,101,100,60),fn(500,null,null,null),fn(300,80,70,60),fn(300,80,null,null)];
 }''')
 assert not result[0]['alert']
 assert not result[1]['alert'] # exactly 100 bpm / 100 SBP / 60 DBP and SI=1
 assert result[2]['alert']
 assert result[3]['alert']
 assert result[4]['alert'] # SI above 1 and low SBP
 assert not result[5]['alert']
 for a in result:assert a['shock'] is None or isinstance(a['shock'],float|int)
 newborn=page.evaluate('''()=>[window.ED_TOOLS.newbornMessage('high','no'),window.ED_TOOLS.newbornMessage('high','yes'),window.ED_TOOLS.newbornMessage('low','no')]''')
 assert 'Continue effective ventilation' in newborn[0]
 assert 'reassess' in newborn[1]
 assert '30 seconds' in newborn[2]
 print('PASS: WHO threshold boundaries (299, 300+sign, 500, SI); newborn HR≥100 apnea edge case')
 b.close()
