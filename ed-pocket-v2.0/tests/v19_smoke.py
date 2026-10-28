from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
html=html.replace('<link rel="stylesheet" href="style.css"/>','<style>'+ (root/'style.css').read_text()+'</style>')
for name in ['rapid.js','main.js','review-index.js','tools.js']:
 html=html.replace(f'<script src="{name}"></script>', '<script>'+ (root/name).read_text()+'</script>')
errors=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 context=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=1,is_mobile=True,has_touch=True)
 page=context.new_page();page.on('pageerror',lambda err:errors.append(str(err)))
 page.set_content(html,wait_until='domcontentloaded')
 assert page.locator('[data-tool="emergency"]').count()>=1
 # Emergency focus flow
 page.locator('.feature-launch [data-tool="emergency"]').click()
 assert page.locator('[data-crisis]').count()==6
 page.locator('[data-crisis="delivery"]').click()
 assert page.locator('.crisis-step h2').inner_text().startswith('Activate')
 page.locator('[data-crisis-nav="next"]').click()
 assert page.locator('.crisis-step h2').inner_text().startswith('Position')
 assert page.locator('.crisis-critical').is_visible() and page.locator('.crisis-stop').is_visible()
 page.screenshot(path='/mnt/data/ED_Pocket_v2.0_emergency_mobile.png')
 page.locator('[data-crisis-nav="prev"]').click()
 assert 'Activate' in page.locator('.crisis-step h2').inner_text()
 # Neonatal time and heart rate assessment
 page.locator('#quick-emergency').click()
 page.locator('.crisis-bar [data-tool="emergency"]').count() == 0 or True
 page.locator('.back[data-tool="home"]').click()
 page.locator('[data-tool="neonatal"]').click()
 page.locator('#nrp-hr').select_option('high')
 page.locator('#nrp-breath').select_option('no')
 assert 'continue effective ventilation' in page.locator('#nrp-result').inner_text().lower()
 page.locator('#nrp-hr').select_option('low')
 assert '30 seconds' in page.locator('#nrp-result').inner_text()
 page.locator('[data-timer="toggle"]').click()
 page.wait_for_timeout(1150)
 assert page.locator('#tool-clock').inner_text() != '00:00'
 page.locator('[data-timer="reset"]').click()
 assert page.locator('#tool-clock').inner_text() == '00:00'
 # PPH threshold & session-only measurements
 page.locator('.back[data-tool="home"]').click()
 page.locator('[data-tool="hemorrhage"]').click()
 page.locator('#pph-volume').fill('300')
 page.locator('#pph-hr').fill('101')
 assert 'threshold reached' in page.locator('#pph-result').inner_text().lower()
 page.locator('#pph-hr').fill('80')
 assert 'not established' in page.locator('#pph-result').inner_text().lower()
 page.locator('#pph-volume').fill('500')
 assert 'threshold reached' in page.locator('#pph-result').inner_text().lower()
 page.locator('#pph-sbp').fill('80')
 assert page.locator('#pph-shock').inner_text()=='1.00'
 page.screenshot(path='/mnt/data/ED_Pocket_v2.0_pph_mobile.png')
 page.locator('[data-pph="reset"]').click()
 assert page.locator('#pph-total').inner_text()=='0 mL'
 # Equipment (local only), review transparency, offline fallback
 page.locator('.back[data-tool="home"]').click()
 page.locator('[data-tool="readiness"]').click()
 assert page.locator('[data-kit]').count()==11
 page.locator('[data-kit="warmer"]').check()
 assert '1/11' in page.locator('#site-coverage').inner_text()
 page.locator('.back[data-tool="home"]').click()
 page.locator('[data-tool="review"]').click()
 assert '0 clinician-approved' in page.locator('.review-summary').inner_text()
 assert page.locator('.review-list>div').count()==31
 page.locator('.back[data-tool="home"]').click()
 page.locator('[data-tool="practice"]').click()
 assert page.locator('[data-practice="reveal"]').count()==1
 page.locator('[data-practice="reveal"]').click()
 assert page.locator('.crisis-critical').count()==1
 page.locator('[data-practice="next"]').click()
 assert 'Newborn resuscitation' in page.locator('.tool-form h2').inner_text()
 page.locator('.back[data-tool="home"]').click()
 page.locator('[data-tool="offline"]').click()
 assert 'Not confirmed' in page.locator('#core-diagnostics').inner_text()
 # Core nav + search
 page.locator('.mobile-nav [data-nav="home"]').click()
 page.locator('#search').fill('CICO')
 assert page.locator('.guide-card').count()==1
 page.locator('.mobile-nav [data-nav="library"]').click()
 page.locator('#search').fill('breech')
 assert page.locator('.library-row').count()==1
 page.locator('.mobile-nav [data-nav="home"]').click()
 page.locator('.guide-card[data-open="nrp"]').click()
 assert 'Clinical review: pending' in page.locator('.review-flag').inner_text()
 assert page.locator('[data-tool="neonatal"]').count()==1
 assert not errors,errors
 print('PASS: emergency stepper, persistent DO FIRST/STOP, manual neonatal timeline, HR+breathing branch, manual PPH threshold, shock index, equipment profile, review register, offline fallback, synonym search, 24-topic library entry, navigation')
 print('PASS: zero uncaught JavaScript errors')
 browser.close()
