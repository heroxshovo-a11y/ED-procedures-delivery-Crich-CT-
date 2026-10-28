from pathlib import Path
import subprocess,time
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
server=subprocess.Popen(['python3','-m','http.server','8769','--bind','127.0.0.1'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
errors=[]
try:
 time.sleep(.8)
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  context=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=1,is_mobile=True,has_touch=True,service_workers='allow')
  page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  content=(root/'index.html').read_text()
  content=content.replace('<link rel="stylesheet" href="style.css"/>','<style>'+ (root/'style.css').read_text()+'</style>')
  content=content.replace('<script src="rapid.js"></script>','<script>'+ (root/'rapid.js').read_text()+'</script>')
  content=content.replace('<script src="main.js"></script>','<script>'+ (root/'main.js').read_text()+'</script>')
  page.set_content(content,wait_until='domcontentloaded');page.wait_for_timeout(600)
  assert 'ED Pocket' in page.title()
  assert page.locator('[data-open="nrp"]').count()>0
  page.locator('[data-open="nrp"]').first.click()
  assert page.locator('h1.guide-title').inner_text().lower().find('newborn resuscitation')>=0
  assert 'CONTINUE ventilation' in page.locator('.step-list').inner_text()
  assert page.locator('.quick-jumps [data-open="epi"]').count()==1
  page.locator('[data-check="0"]').check(force=True)
  assert page.locator('#counter').inner_text().startswith('1/')
  page.locator('#reset').click();assert page.locator('#counter').inner_text().startswith('0/')
  page.locator('.quick-jumps [data-open="epi"]').click()
  assert 'Neonatal epinephrine' in page.locator('h1.guide-title').inner_text()
  page.locator('.mobile-nav [data-nav="atlas"]').click()
  assert 'Visual atlas' in page.locator('h1.guide-title').inner_text()
  page.screenshot(path='/mnt/data/ED_Pocket_v1.8_mobile_atlas.png',full_page=False)
  page.locator('.mobile-nav [data-nav="library"]').click();assert page.locator('.library-row').count()==24
  page.locator('.mobile-nav [data-nav="home"]').click()
  page.locator('[data-open="chest-tube"]').first.click();assert 'Do not blindly disrupt adhesions' in page.locator('.step-list').inner_text()
  assert not errors,errors
  print('PASS: iPhone viewport, rapid navigation, NRP safety language, reset, cross-links, atlas, 24 library topics, thoracostomy text, file-mode interface')
  print('PASS: No uncaught JavaScript exceptions')
  browser.close()
finally:
 server.terminate();server.wait(timeout=3)
