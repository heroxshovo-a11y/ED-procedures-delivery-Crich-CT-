from pathlib import Path
import subprocess,time
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
server=subprocess.Popen(['python3','-m','http.server','8775','--bind','127.0.0.1'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
 time.sleep(.8)
 with sync_playwright() as p:
  b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  c=b.new_context(service_workers='allow')
  page=c.new_page();page.goto('http://127.0.0.1:8775/',wait_until='load',timeout=12000)
  page.wait_for_function('navigator.serviceWorker.controller!==null',timeout=12000)
  page.locator('[data-tool="offline"]').first.click();page.wait_for_timeout(500)
  status=page.locator('#core-diagnostics').inner_text();print('online core:',status[:250])
  assert 'All manifest assets present' in status,status
  # Confirm offline reload serves app, and local images decode from cache.
  c.set_offline(True);page.reload(wait_until='domcontentloaded',timeout=9000)
  assert page.locator('[data-tool="emergency"]').count()>0
  response=page.evaluate('''async()=>{const r=await fetch('anatomy/mcroberts.svg');return {ok:r.ok,type:r.headers.get('content-type'),length:(await r.text()).length}}''')
  assert response['ok'] and response['length']>5000,response
  page.locator('[data-tool="offline"]').first.click();page.wait_for_timeout(500)
  assert 'All manifest assets present' in page.locator('#core-diagnostics').inner_text()
  print('PASS: service worker controlled, all core files present, offline reload works, local anatomy SVG loads offline')
  b.close()
finally:
 server.terminate();server.wait(timeout=3)
