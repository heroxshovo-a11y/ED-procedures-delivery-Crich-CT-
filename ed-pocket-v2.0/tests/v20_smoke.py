from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text().replace('<link rel="stylesheet" href="style.css"/>','<style>'+ (root/'style.css').read_text()+'</style>')
for name in ['rapid.js','main.js','review-index.js','tools.js']:
 html=html.replace('<script src="'+name+'"></script>','<script>'+ (root/name).read_text()+'</script>')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 ctx=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 # about:blank denies Storage API. Provide an in-memory stub for test only.
 page.evaluate("""()=>Object.defineProperty(window,'localStorage',{configurable:true,value:{d:{},getItem(k){return this.d[k]??null},setItem(k,v){this.d[k]=v},removeItem(k){delete this.d[k]}}})""")
 page.set_content(html)
 def home_tools():
  page.locator('.back[data-tool="home"]').click()
 page.locator('.feature-launch [data-tool="team"]').click()
 assert 'Prepare two distinct patient teams' in page.locator('#view').inner_text()
 assert page.locator('.role-card').count()==3
 page.locator('[data-phase="1"]').first.click()
 assert 'During birth' in page.locator('#view').inner_text()
 page.locator('[data-phase="2"]').first.click()
 assert 'two-patient handoff' in page.locator('#view').inner_text().lower()
 page.screenshot(path='/mnt/data/ED_Pocket_v2.0_team_mobile.png')
 page.locator('[data-open="nrp"]').click()
 assert 'Clinical review: pending' in page.locator('#view').inner_text()
 page.locator('#quick-emergency').click();home_tools();page.locator('[data-tool="debrief"]').click()
 assert 'Do not enter patient names' in page.locator('#view').inner_text()
 page.locator('[data-training="again"]').click()
 assert 'Next scheduled local review' in page.locator('#training-result').inner_text()
 assert ctx.pages[0].evaluate("Object.keys(JSON.parse(localStorage.getItem('ed:training-review-v2')))")==['delivery']
 page.locator('[data-training="next"]').click()
 assert 'Newborn resuscitation' in page.locator('#view').inner_text()
 page.locator('[data-training="clear"]').click()
 assert ctx.pages[0].evaluate("JSON.parse(localStorage.getItem('ed:training-review-v2')).delivery") is None
 home_tools();page.locator('[data-tool="review"]').click()
 assert '24/24 topics' in page.locator('#view').inner_text()
 assert '0/24' in page.locator('#view').inner_text()
 assert page.locator('.review-list > div').count()==31
 home_tools();page.locator('[data-tool="readiness"]').click()
 assert page.locator('[data-cap]').count()==5
 page.locator('[data-cap="ob"]').select_option('no')
 assert ctx.pages[0].evaluate("JSON.parse(localStorage.getItem('ed:site-capabilities-v2')).Site1.ob")=='no'
 home_tools();page.locator('[data-tool="offline"]').click()
 assert 'Test 5 bundled images' in page.locator('#view').inner_text()
 page.locator('[data-tool-action="decode"]').click()
 assert 'Cannot verify cache-only images' in page.locator('#decode-diagnostics').inner_text()
 page.locator('.mobile-nav [data-nav="library"]').click()
 assert page.locator('.library-row').count()==24
 assert not errors, errors
 print('PASS v2.0: 3-phase two-patient briefing, local-only learning schedule, 24-topic review register, site capabilities, honest offline fallback, mobile navigation; no JS errors')
 b.close()
