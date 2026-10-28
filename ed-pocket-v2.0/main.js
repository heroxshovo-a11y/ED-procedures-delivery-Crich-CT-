(()=>{'use strict';
const cards=window.ED_CARDS, library=window.ED_LIBRARY;
const $=(s)=>document.querySelector(s), view=$('#view');
const esc=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=(key,def)=>{try{return JSON.parse(localStorage.getItem(key))??def}catch{return def}};
let fav=new Set(read('ed:fav',[])),theme=read('ed:theme','dark'),large=read('ed:large',false),page='home',q='',done=new Set();
const fmt=v=>esc(v);
const ALIASES={delivery:'birth crowning precipitous labor delivery nuchal cord',nrp:'nrp newborn ppv bag mask hypoxia bradycardia positive pressure ventilation',shoulder:'stuck shoulders turtle sign mcroberts impaction',pph:'pph postpartum hemorrhage haemorrhage atony uterine bleeding shock index',cric:'cico front of neck airway efona cricothyrotomy',epi:'newborn neonatal epinephrine adrenaline', 'chest-tube':'chest tube thoracostomy pneumothorax hemothorax pleural drain'};
const matchesQuery=(id,blob)=>(blob+' '+(ALIASES[id]||'')).toLowerCase().includes(q.toLowerCase());
const VISUALS={
 delivery:[['Crowning / controlled head','delivery.svg','Conceptual orientation only. Support the emerging head; do not restrain or pull.'],['Nuchal cord','nuchal.svg','Loose loop: reduce gently. Tight loop: consider somersault technique with intact cord if feasible.']],
 nrp:[['NRP first decision points','nrp.svg','This is a rapid overview, not the full resuscitation algorithm.'],['Neonatal airway position','airway.svg','Neutral or slightly extended head; check seal and visible chest movement.'],['Ventilation corrective steps','nrp-ventilation.svg','Check effective chest movement and heart-rate response; airway escalation when PPV remains ineffective.'],['Two-thumb compressions','nrp-compressions.svg','3:1 compression-to-ventilation ratio during neonatal resuscitation.'],['Epinephrine safety','epi-dose.svg','Double-check concentration, route, weight and volume.']],
 shoulder:[['Shoulder dystocia','shoulder.svg','McRoberts and suprapubic pressure first; rapidly escalate if unsuccessful.'],['Maneuver escalation','shoulder-sequence.svg','Do not repeat unsuccessful external maneuvers indefinitely.']],
 cric:[['Cricothyrotomy landmarks','cric.svg','Adult anterior-neck landmarks only; use trained emergency front-of-neck airway protocol.'],['CICO action flow','cric-flow.svg','Adult CICO decision and trained emergency front-of-neck airway pathway.']],
 pph:[['Four Ts of PPH','pph-4ts.svg','Assess tone, trauma, tissue and thrombin in parallel.'],['Early hemorrhage response','pph-response.svg','Coordinate uterotonics, TXA, resuscitation and escalation; not a standalone order set.']],
 epi:[['Neonatal epinephrine double-check','epi-dose.svg','Confirm concentration, weight, route and independent calculation.']],
 'chest-tube':[['Chest drain orientation','chest.svg','Approximate surface anatomy only. Confirm site and diaphragm clinically.'],['Interspace safety','chest-interspace.svg','Schematic only: enter over rib superior border; confirm side and diaphragm.']]
};
function visuals(id){const a=VISUALS[id];if(!a)return '';return `<section class="visual-section" aria-label="Procedure diagrams"><div class="visual-header"><div><span class="eyebrow">VISUAL REFERENCE</span><h2>Procedure diagrams</h2></div><span class="visual-count">${a.length} SCHEMATIC${a.length===1?'':'S'}</span></div><p class="visual-disclaimer">Simplified educational diagrams, not to scale. Use alongside the steps and your institutional procedure training.</p><div class="visual-grid">${a.map(([title,file,caption])=>`<figure class="visual-card"><img loading="lazy" src="diagrams/${esc(file)}" alt="${esc(title)} — simplified medical training diagram"/><figcaption><strong>${esc(title)}</strong><span>${esc(caption)}</span></figcaption></figure>`).join('')}</div></section>`}

// Verified Wikimedia Commons originals. Five files are locally packaged and four remain remote until explicitly saved; source credits and licenses remain visible.
// Original-source pages and license types identified 28 October 2026; independently review the clinical suitability of each figure.
const PLATE_CATALOG={
 delivery:[
  {title:'Crowning — manual perineal support',file:'Geburtshilfe_Dammschutz_-_Obstetrics_perineal_protection.png',imageUrl:'anatomy/delivery.png',by:'Sciencia58',license:'CC0 1.0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/',source:'https://commons.wikimedia.org/wiki/File:Geburtshilfe_Dammschutz_-_Obstetrics_perineal_protection.png',note:'Anatomical illustration of perineal support during delivery of the head. Manual support approaches vary with training and circumstances.',phase:'DELIVERY • HEAD'},
 ],
 shoulder:[
  {title:'McRoberts — flex maternal hips',file:'McRoberts_maneuver.svg',imageUrl:'anatomy/mcroberts.svg',by:'Geraldbaeck',license:'CC0 1.0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/',source:'https://commons.wikimedia.org/wiki/File:McRoberts_maneuver.svg',note:'Positioning changes the maternal pelvic relationship; assign two assistants to the legs. Do not use fundal pressure.',phase:'FIRST-LINE • POSITION'},
  {title:'Suprapubic pressure — not fundal',file:'Suprapubic-pressureforSD.jpg',imageUrl:'anatomy/suprapubic.jpg',by:'Henry Lerner',license:'CC BY 4.0',licenseUrl:'https://creativecommons.org/licenses/by/4.0/',source:'https://commons.wikimedia.org/wiki/File:Suprapubic-pressureforSD.jpg',note:'Pressure is directed over the pubis to encourage adduction/rotation of the impacted anterior shoulder. Not pressure on the uterine fundus.',phase:'FIRST-LINE • ASSIST'},
  {title:'Shoulder-width mechanism',file:'WidthOfShoulders.jpg',imageUrl:'anatomy/shoulder-width.jpg',by:'N. Mottet, M. Bonneaud, A. Eckman-Lacroix, R. Ramanah, D. Riethmuller',license:'CC BY 4.0',licenseUrl:'https://creativecommons.org/licenses/by/4.0/',source:'https://commons.wikimedia.org/wiki/File:WidthOfShoulders.jpg',note:'Published illustration of the biacromial diameter; conceptual anatomic context, not a bedside measurement.',phase:'ANATOMY • MECHANISM'},
  {title:'Advanced anterior-arm approach — finger placement',file:'ShoulderDystociaFig1.jpg',imageUrl:'anatomy/shoulder-fig1.jpg',by:'Mottet et al.',license:'CC BY 4.0',licenseUrl:'https://creativecommons.org/licenses/by/4.0/',source:'https://commons.wikimedia.org/wiki/File:ShoulderDystociaFig1.jpg',note:'Image from a published anterior-arm extraction technique. It is an advanced adjunct and not the standard first response to shoulder dystocia.',phase:'ADVANCED • SELECTED CASES'},
  {title:'Advanced anterior-arm approach — humerus support',file:'ShoulderDystociaFig3.jpg',imageUrl:'https://upload.wikimedia.org/wikipedia/commons/7/73/ShoulderDystociaFig3.jpg',by:'Mottet et al.',license:'CC BY 4.0',licenseUrl:'https://creativecommons.org/licenses/by/4.0/',source:'https://commons.wikimedia.org/wiki/File:ShoulderDystociaFig3.jpg',note:'The two fingers are illustrated as a splint along the humerus in the authors’ specialized technique. Avoid traction on the humeral shaft.',phase:'ADVANCED • SELECTED CASES'},
  {title:'Advanced anterior-arm approach — arm delivery',file:'ShoulderDystociaFig4.jpg',imageUrl:'https://upload.wikimedia.org/wikipedia/commons/2/27/ShoulderDystociaFig4.jpg',by:'Mottet et al.',license:'CC BY 4.0',licenseUrl:'https://creativecommons.org/licenses/by/4.0/',source:'https://commons.wikimedia.org/wiki/File:ShoulderDystociaFig4.jpg',note:'The fetal hand emerges beneath the maternal pubic symphysis. This image illustrates the published anterior-arm technique; it does not substitute for posterior-arm delivery training.',phase:'ADVANCED • SELECTED CASES'},
 ],
 cric:[
  {title:'Laryngeal surface anatomy',file:'Cricothyrotomy.png',imageUrl:'https://upload.wikimedia.org/wikipedia/commons/0/01/Cricothyrotomy.png',by:'PhilippN',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',source:'https://commons.wikimedia.org/wiki/File:Cricothyrotomy.png',note:'Historical anatomical image; it may depict a needle approach. Not the current adult surgical front-of-neck airway protocol.',phase:'ANATOMY • LANDMARKS'},
  {title:'Cricothyrotomy procedural illustration',file:'Cricothyrotomystat.jpg',imageUrl:'https://upload.wikimedia.org/wikipedia/commons/9/95/Cricothyrotomystat.jpg',by:'S Bhimji MD',license:'CC BY 4.0',licenseUrl:'https://creativecommons.org/licenses/by/4.0/',source:'https://commons.wikimedia.org/wiki/File:Cricothyrotomystat.jpg',note:'Licensed teaching image; compare anatomy and device placement with your current local scalpel–bougie–tube protocol.',phase:'PROCEDURE • ADULT'},
 ]
};
const plateUrl=(item)=>item.imageUrl;
const bundledPlates=Object.values(PLATE_CATALOG).flat().filter(x=>x.imageUrl.startsWith('anatomy/'));
const onlinePlates=Object.values(PLATE_CATALOG).flat().filter(x=>x.imageUrl.startsWith('https:'));
const anatomyCard=(item,i)=>`<figure class="anatomy-card" id="plate-${esc(item.file.split('.')[0])}"><div class="plate-head"><span class="plate-index">${String(i+1).padStart(2,'0')}</span><span class="plate-phase">${esc(item.phase)}</span></div><button type="button" class="plate-img-link" data-zoom-image="${esc(plateUrl(item))}" data-zoom-title="${esc(item.title)}" aria-label="Enlarge clinical illustration: ${esc(item.title)}"><img src="${esc(plateUrl(item))}" alt="${esc(item.title)}" loading="lazy" referrerpolicy="no-referrer" decoding="async"/><span class="plate-alt">Illustration did not load. See its original source below while online.</span><span class="plate-zoom-hint">Tap to enlarge</span></button><figcaption><strong>${esc(item.title)}</strong><p>${esc(item.note)}</p><small>Illustration: ${esc(item.by)} · <a href="${esc(item.licenseUrl)}" target="_blank" rel="noopener noreferrer">${esc(item.license)}</a> · <a href="${esc(item.source)}" target="_blank" rel="noopener noreferrer">Original + credits ↗</a></small></figcaption></figure>`;
function anatomyPlates(id){const items=PLATE_CATALOG[id]||[];if(!items.length)return '';return `<section class="anatomy-section" id="anatomy-${esc(id)}"><div class="visual-header"><div><span class="eyebrow">SOURCED MEDICAL ARTWORK</span><h2>Anatomical plates</h2></div><span class="visual-count">${items.length} LICENSED PLATES</span></div><p class="visual-disclaimer">Anatomical illustrations from credited independent sources. Five original illustrations are packaged with ED Pocket and cached with the offline reference. Four additional advanced/procedural images are online-only until successfully saved on this device. Use the Visual Atlas to test each image without network access. Specialized maneuver images are not a prescribed clinical sequence. Clinical steps above take priority; confirm protocols and obtain hands-on training.</p><div class="anatomy-grid">${items.filter(x=>!x.phase.startsWith('ADVANCED')).map(anatomyCard).join('')}</div>${items.some(x=>x.phase.startsWith('ADVANCED'))?`<details class="advanced-anatomy"><summary>Advanced published anterior-arm technique · not first-line (${items.filter(x=>x.phase.startsWith('ADVANCED')).length} figures)</summary><p>These figures describe a published specialized anterior-arm approach, not the default sequence or posterior-arm maneuver. Refer to current training and local protocol.</p><div class="anatomy-grid">${items.filter(x=>x.phase.startsWith('ADVANCED')).map(anatomyCard).join('')}</div></details>`:''}</section>`}
const store=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}};
function setTheme(){document.body.classList.toggle('light',theme==='light');document.body.classList.toggle('large-text',!!large);$('#theme-btn').textContent=theme==='light'?'☀':'☾';$('#size-btn').style.color=large?'var(--teal)':'';}
function upNav(){document.querySelectorAll('[data-nav]').forEach(b=>{b.classList.toggle('active',b.dataset.nav===page);b.classList.toggle('selected',b.dataset.nav===page)});$('#crumb').textContent=page==='home'?'DASHBOARD':page==='library'?'FULL LIBRARY':page==='favorites'?'SAVED GUIDES':page==='atlas'?'VISUAL ATLAS':'RAPID GUIDE';$('#sidebar').classList.remove('open')}
function guideCard(c){return `<button type="button" class="guide-card ${c.color}" data-open="${esc(c.id)}" aria-label="Open ${esc(c.name)}"><span class="g-arrow">↗</span><span class="iconbox" aria-hidden="true">${c.icon}</span><span class="type">${esc(c.category)}</span><strong>${esc(c.name)}</strong><p>${esc(c.short)}</p><span class="pill">RAPID GUIDE</span></button>`}
function searchBox(ph){return `<label class="searchbox"><span aria-hidden="true">⌕</span><input type="search" id="search" autocomplete="off" placeholder="${esc(ph)}" value="${esc(q)}" aria-label="Search medical guides"/><span aria-hidden="true">⌘ K</span></label>`}
function libraryHTML(filtered){return filtered.length?filtered.map(([id,title,cat])=>`<button class="library-row" data-lib="${esc(id)}"><div><strong>${esc(title)}</strong><small>${esc(cat)}</small></div><span aria-hidden="true">↗</span></button>`).join(''):`<div class="empty">No matches. Try another term.</div>`}
function home(){page='home';upNav();const hits=cards.filter(c=>matchesQuery(c.id,c.name+' '+c.category+' '+c.short+' '+c.trigger));view.innerHTML=`<div class="hero"><div><div class="eyebrow">BUILT FOR THE MOMENTS THAT MATTER</div><h1>Think clearly.<br/>Act decisively<span style="color:var(--teal)">.</span></h1><p>Your clinical pocket reference for rare, high-stakes emergencies. Rapid actions first. Details when you need them.</p></div><div class="date-chip">BUILD <strong>2.0</strong><br/>TRAINING PREVIEW</div></div><div class="notice"><span class="symbol">✳</span><div><strong>Independent physician cognitive aid · not a substitute for training</strong><span>Not formally validated or approved by a hospital, AHA, AAP, WHO, or RCOG. Verify doses, contraindications and local protocols. No patient information is stored.</span></div></div><div class="feature-launch"><button data-tool="emergency" class="launch-primary">⚡ Start Emergency Mode <span>One step at a time →</span></button><button data-tool="tools" class="launch-secondary">⏱ Neonatal / PPH / Offline tools →</button><button data-tool="team" class="launch-secondary">👥 Two-patient delivery brief →</button></div>${searchBox('Search: NRP, CICO, shoulder, PPH, chest tube...')}<div class="section-head"><h2>${q?'Search results':'Rapid access'}</h2><small>${hits.length} action cards</small></div><div class="card-grid">${hits.length?hits.map(guideCard).join(''):'<div class="empty">No quick cards match. Search the full library for additional topics.</div>'}</div><div class="summary-strip"><div><strong>Need the full step-by-step version?</strong><p>24 detailed reference topics from your existing independently prepared procedure handbook, available offline after installation.</p></div><button class="outline-btn" data-nav="library">Explore full library →</button></div>`;bindSearch(home)}
function libraryView(){page='library';upNav();const hits=library.filter(x=>matchesQuery(x[0],x.slice(1).join(' ')));view.innerHTML=`<div class="eyebrow">DETAILED REFERENCE</div><h1 class="guide-title">Full clinical library<span style="color:var(--teal)">.</span></h1><p class="guide-sub">Original expanded ED reference: obstetrics, neonatal rescue, procedures, medication tables and handoffs.</p>${searchBox('Find a detailed procedure...')}<div class="section-head"><h2>Index</h2><small>${hits.length} topics</small></div>${libraryHTML(hits)}<p class="warning">All 24 topics completed AI-assisted risk/source triage; 0 of 24 have independent specialist sign-off. Medication and procedure details require verification before bedside use. Full references open a bundled standalone handbook. Source links in the handbook may require internet; the handbook's text is bundled for offline use. Content independently prepared; not institutionally validated.</p>`;bindSearch(libraryView)}

function atlas(){page='atlas';upNav();let groups=Object.entries(VISUALS);view.innerHTML=`<div class="eyebrow">ANATOMICAL REFERENCE • OFFLINE SAVE AVAILABLE</div><h1 class="guide-title">Visual atlas<span style="color:var(--teal)">.</span></h1><p class="guide-sub">${Object.values(VISUALS).reduce((n,a)=>n+a.length,0)} placements across ${groups.length} clinical guides. Sourced anatomical artwork is prioritized where available; legacy schematics are placed under expandable sections. Includes schematic aids and separately credited external anatomical plates. Five anatomical plates ship with this app; four additional plates need online download. Test all nine below, then recheck in Airplane Mode before a shift. No specialist validation is claimed.</p><div class="offline-manager" aria-live="polite"><div><strong>Offline anatomy plates</strong><p><span class="bundled-pill">5 bundled originals</span> Four additional plates are optional downloads.</p><p id="offline-plate-status">Checking image cache…</p></div><p id="offline-core-status" class="offline-core-status">Checking local reference…</p><div class="offline-actions"><button type="button" id="save-plates" data-offline-action="save">Save remaining 4 plates</button><button type="button" class="outline-btn" id="check-plates" data-offline-action="check">Test offline images</button><button type="button" class="outline-btn" id="clear-plates" data-offline-action="clear">Clear plates</button></div><p class="offline-note">The image test is cache-only. Five originals are shipped with the app; the remaining four may require online saving. The test never uses network access and verifies each image can decode on this device. Wikimedia artwork remains subject to local clinical review.</p><div class="offline-results" id="offline-results" aria-live="polite"></div></div>${groups.map(([id,arr])=>{let c=cards.find(x=>x.id===id);return `<section class="atlas-group"><div class="section-head"><h2>${esc(c?.name||id)}</h2><button class="outline-btn" data-open="${esc(id)}">Open guide →</button></div>${anatomyPlates(id)}<details class="supplemental-visual"><summary>Schematic orientation diagrams</summary>${visuals(id)}</details></section>`}).join('')}`;reportPlateCache()}
function favorites(){page='favorites';upNav();let list=cards.filter(c=>fav.has(c.id));view.innerHTML=`<div class="eyebrow">PERSONAL WORKSPACE</div><h1 class="guide-title">Saved guides<span style="color:var(--teal)">.</span></h1><p class="guide-sub">Pin the protocols you want within one tap. Saved only on this device.</p><div class="card-grid">${list.length?list.map(guideCard).join(''):'<div class="empty">No favorites yet. Open a guide and tap the star to save it here.</div>'}</div>`}

const QUICK_JUMPS={
 delivery:[['Apnea / HR <100','nrp'],['Stuck shoulders','shoulder'],['Heavy bleeding','pph']],
 nrp:[['Epinephrine reference','epi'],['Delivery guide','delivery']],
 shoulder:[['Newborn resuscitation','nrp'],['Hemorrhage response','pph']],
 pph:[['Delivery guide','delivery']],
 cric:[['Tube thoracostomy','chest-tube']],
 epi:[['Newborn resuscitation','nrp']],
 'chest-tube':[['Emergency airway','cric']]
};
function quickJumps(id){const a=QUICK_JUMPS[id]||[];return a.length?`<nav class="quick-jumps" aria-label="Related emergency quick guides"><strong>ONE-TAP NEXT ACTION</strong><div>${a.map(([label,to])=>`<button type="button" data-open="${esc(to)}">${esc(label)} →</button>`).join('')}</div></nav>`:'';}
function guide(id){let c=cards.find(x=>x.id===id);if(!c)return home();page='guide';done=new Set();upNav();let steps=c.steps.map(([name,body],i)=>`<label class="step" data-step="${i}"><input type="checkbox" data-check="${i}"/><span class="num">${String(i+1).padStart(2,'0')}</span><span class="content"><strong>${esc(name)}</strong><p>${esc(body)}</p></span></label>`).join('');view.innerHTML=`<button class="back" data-nav="home">← All quick guides</button><div class="guide-top"><div><div class="eyebrow">${esc(c.category)} · RAPID CLINICAL GUIDE</div><h1 class="guide-title">${c.icon} ${esc(c.name)}</h1><p class="guide-sub">${esc(c.short)}</p></div><button class="save-btn" id="fav" aria-label="${fav.has(id)?'Remove from':'Add to'} saved guides" aria-pressed="${fav.has(id)}">${fav.has(id)?'★':'☆'}</button></div><div class="review-flag"><span>Clinical review: pending</span><button data-tool="review" type="button">Review status ↗</button></div><div class="redline"><small>DO FIRST</small><strong>${esc(c.first)}</strong></div><div class="trigger-box"><small>TRIGGER / RECOGNIZE</small>${esc(c.trigger)}<br/><br/><span style="color:var(--coral);font-weight:750">STOP:</span> ${esc(c.stop)}</div><div class="feature-inline"><button data-tool="emergency">⚡ Open Emergency Mode</button>${id==='nrp'?'<button data-tool="neonatal">⏱ Timeline</button>':''}${id==='pph'?'<button data-tool="hemorrhage">🩸 PPH tracker</button>':''}</div><div class="steps-head"><strong>Action sequence <span id="counter" style="color:var(--sub);font-size:12px">0/${c.steps.length}</span></strong><button id="reset">Reset checks ↺</button></div><div class="meter"><div id="progress" class="meter-inner"></div></div><div class="step-list">${steps}</div><div class="bottomcall"><strong>NEXT / REASSESS</strong><br/>${esc(c.next)}</div>${quickJumps(id)}${anatomyPlates(id)}<details class="supplemental-visual"><summary>Open simplified orientation diagrams (not anatomical)</summary>${visuals(id)}</details><div class="source-box"><strong>Read more & source documents</strong><div class="source-list">${c.source.map(([label,href])=>`<a href="${esc(href)}" ${href.startsWith('http')?'target="_blank" rel="noopener noreferrer"':''}>${esc(label)} ↗</a>`).join('')}</div></div><p class="warning">Rapid card wording underwent AI-assisted guideline comparison on 28 Oct 2026; it has no independent clinician approval. Detailed procedure content was carried forward from the 18 Sep 2026 handbook and has not received line-by-line specialist validation. No specialist clinical validation or institutional approval. Pause and check the current local pathway where possible. Checklist resets when leaving this guide.</p>`;$('#fav').addEventListener('click',()=>{if(fav.has(id))fav.delete(id);else fav.add(id);store('ed:fav',[...fav]);$('#fav').textContent=fav.has(id)?'★':'☆';$('#fav').setAttribute('aria-pressed',String(fav.has(id)))});$('#reset').addEventListener('click',()=>{done.clear();document.querySelectorAll('[data-check]').forEach(e=>e.checked=false);update()});document.querySelectorAll('[data-check]').forEach(inp=>inp.addEventListener('change',()=>{let i=Number(inp.dataset.check);if(inp.checked)done.add(i);else done.delete(i);update()}));function update(){document.querySelectorAll('[data-step]').forEach(el=>el.classList.toggle('checked',done.has(Number(el.dataset.step))));$('#counter').textContent=`${done.size}/${c.steps.length}`;$('#progress').style.width=`${100*done.size/c.steps.length}%`} }
function bindSearch(cb){const s=$('#search');if(s){s.addEventListener('input',()=>{const pos=s.selectionStart;q=s.value;cb();let next=$('#search');next?.focus();try{next?.setSelectionRange(pos,pos)}catch{}})}}
function jump(name){window.ED_TOOLS?.leave();q='';if(name==='tools'){window.ED_TOOLS?.open('tools');return;}if(name==='home')home();else if(name==='favorites')favorites();else if(name==='library')libraryView();else if(name==='atlas')atlas();else guide(name);window.scrollTo({top:0,behavior:'instant'})}
function linkLibrary(id){window.location.href=`full-reference.html#${encodeURIComponent(id)}`}
// Display sourced artwork only after its image has loaded; otherwise retain a source-link fallback.
view.addEventListener('load',e=>{const img=e.target;if(img instanceof HTMLImageElement && img.closest('.plate-img-link')){img.style.opacity='1';if(img.nextElementSibling)img.nextElementSibling.style.display='none';}},true);
// Broken external images show a useful source-link fallback (never a blank image).
view.addEventListener('error',e=>{const img=e.target;if(img instanceof HTMLImageElement && img.closest('.plate-img-link')){img.style.display='none';const fallback=img.nextElementSibling;if(fallback)fallback.style.display='block';}},true);
// Full-screen source-image viewer; no new imagery is generated or edited.
let zoomDialog=null;let zoomFactor=1;
function openPlateZoom(src,title){
 if(!zoomDialog){
  zoomDialog=document.createElement('dialog');zoomDialog.id='plate-viewer';zoomDialog.className='plate-viewer';
  zoomDialog.innerHTML='<div class="plate-viewer-bar"><strong id="zoom-title"></strong><div class="zoom-buttons"><button type="button" data-zoom-factor="minus" aria-label="Zoom out">−</button><button type="button" data-zoom-factor="plus" aria-label="Zoom in">+</button><button type="button" data-zoom-close="1" aria-label="Close image">Close ✕</button></div></div><div class="plate-viewer-stage"><img id="zoom-photo" alt="Expanded source medical illustration" referrerpolicy="no-referrer"/></div><p>Licensed illustration unchanged. Close to return to the guide; see original-source attribution beneath the image.</p>';
  document.body.append(zoomDialog);
  zoomDialog.addEventListener('click',e=>{if(e.target===zoomDialog)zoomDialog.close();if(e.target.closest('[data-zoom-close]'))zoomDialog.close();const adjust=e.target.closest('[data-zoom-factor]');if(adjust){zoomFactor=Math.max(1,Math.min(3,zoomFactor+(adjust.dataset.zoomFactor==='plus'?.4:-.4)));zoomDialog.querySelector('#zoom-photo').style.width=`${zoomFactor*100}%`}});
 }
 zoomFactor=1;zoomDialog.querySelector('#zoom-title').textContent=title;const photo=zoomDialog.querySelector('#zoom-photo');photo.src=src;photo.style.width='100%';zoomDialog.showModal();
}
// Visual offline audit: a stored opaque response alone is NOT sufficient to call an image usable.
// The SW serves ?ed_offline_check=1 from CacheStorage only; this proves an image decodes without network, whether bundled or saved.
let plateSaveBusy=false;
let plateVerifySerial=0;
const allPlates=Object.values(PLATE_CATALOG).flat();
const plateStatus=msg=>{const el=$('#offline-plate-status');if(el)el.textContent=msg;};
function plateControlState(busy){
 plateSaveBusy=busy;
 document.querySelectorAll('[data-offline-action]').forEach(btn=>{btn.disabled=busy;});
 const btn=$('#save-plates');if(btn)btn.textContent=busy?'Saving plates…':'Save remaining 4 plates';
}
function reportPlateCache(){
 if(!navigator.serviceWorker?.controller){plateStatus('Offline check needs a service worker. Open the HTTPS app while online, then reload once.');return;}
 navigator.serviceWorker.controller.postMessage({type:'ANATOMY_STATUS'});
 navigator.serviceWorker.controller.postMessage({type:'CORE_STATUS'});
}
const checkImageOffline=(item)=>new Promise(resolve=>{
 let settled=false;const img=new Image();
 const finish=ok=>{if(settled)return;settled=true;clearTimeout(timeout);img.onload=null;img.onerror=null;resolve(ok);};
 const timeout=setTimeout(()=>finish(false),9000);
 img.onload=()=>finish(img.naturalWidth>0&&img.naturalHeight>0);
 img.onerror=()=>finish(false);
 // Every audit uses a distinct URL so memory/disk HTTP caches cannot satisfy it; the SW matches only the original allowlisted URL.
 img.src=item.imageUrl+'?ed_offline_check=1&v='+Date.now()+'-'+Math.random().toString(36).slice(2);
});
async function verifyPlates(){
 if(!navigator.serviceWorker?.controller){plateStatus('Offline test unavailable until the service worker controls this page. Reload once while online.');return;}
 const serial=++plateVerifySerial;
 plateControlState(true);
 plateStatus('Testing saved images without network access…');
 let verified=0;
 const failures=[];
 const cards=$('#offline-results');if(cards)cards.textContent='';
 for(let i=0;i<allPlates.length;i++){
  const p=allPlates[i];const good=await checkImageOffline(p);
  if(serial!==plateVerifySerial)return;
  if(good)verified++;else failures.push(p);
  plateStatus(`Offline image test: ${i+1}/${allPlates.length} checked, ${verified} displayed successfully.`);
 }
 plateControlState(false);
 const panel=$('#offline-results');
 if(panel){
  let result=`<strong class="${verified===allPlates.length?'offline-pass':'offline-partial'}">${verified}/${allPlates.length} images successfully displayed using saved data.</strong>`;
  if(failures.length)result+=`<p>Not verified: ${failures.map(x=>esc(x.title)).join('; ')}.</p><p>If the missing image is optional, reconnect and choose Save remaining 4 plates; if a bundled image is missing, reload the app while online and rerun this test. Do not rely on failed images offline.</p>`;
  else result+='<p>All nine artwork files decoded in cache-only tests on this device. Also test the entire app in Airplane Mode before on-shift reliance.</p>';
  panel.innerHTML=result;
 }
 plateStatus(`${verified}/${allPlates.length} illustrations rendered in a network-free test. This is a device-specific check, not clinical validation.`);
 navigator.serviceWorker.controller.postMessage({type:'ANATOMY_STATUS'});
}
function anatomyAction(action){
 if(!('serviceWorker' in navigator)||location.protocol==='file:'){plateStatus('Offline saving requires the HTTPS app, not a local file preview.');return;}
 if(!navigator.serviceWorker.controller){plateStatus('Service worker not active yet. Reload this page after opening it online.');return;}
 if(plateSaveBusy)return;
 if(action==='save'){
  if(!navigator.onLine){plateStatus('Connect to the internet before downloading images. To test saved images offline, use Test offline images.');return;}
  plateControlState(true);plateStatus('Requesting four remaining original image files from Wikimedia…');
  navigator.serviceWorker.controller.postMessage({type:'ANATOMY_SAVE'});
 }else if(action==='clear'){
  ++plateVerifySerial;const result=$('#offline-results');if(result)result.textContent='';
  navigator.serviceWorker.controller.postMessage({type:'ANATOMY_CLEAR'});
 }else verifyPlates();
}
if('serviceWorker' in navigator){
 navigator.serviceWorker.addEventListener('message',e=>{
  const data=e.data||{};
  if(data.type==='ANATOMY_STATUS')plateStatus(`${data.count}/${data.total} source-image responses stored. Use Test offline images to confirm they actually render.`);
  else if(data.type==='CORE_STATUS'){
   const el=$('#offline-core-status');
   if(el)el.textContent=data.cached===data.total?'Local reference files cached for offline use.':'Reference files: '+data.cached+'/'+data.total+' cached. Open this app online and reload before relying on offline access.';
  }
  else if(data.type==='ANATOMY_PROGRESS')plateStatus(`Saving source images: ${data.done}/${data.total} checked · ${data.count} stored${data.failed?` · ${data.failed} requests failed`:''}.`);
  else if(data.type==='ANATOMY_FINISH'){
   plateControlState(false);
   plateStatus(`Stored ${data.count}/${data.total} optional source-image responses${data.failed?` (${data.failed} failures)`:''}. Checking that the images really display…`);
   verifyPlates();
  }
  else if(data.type==='ANATOMY_CLEARED'){plateControlState(false);plateStatus('Optional source-image cache cleared. Five bundled anatomical plates, references and local diagrams remain unchanged.');}
 });
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(page==='atlas')reportPlateCache()});
}
document.body.addEventListener('click',e=>{const zoom=e.target.closest('[data-zoom-image]');if(zoom){openPlateZoom(zoom.dataset.zoomImage,zoom.dataset.zoomTitle);return}const offline=e.target.closest('[data-offline-action]');if(offline){anatomyAction(offline.dataset.offlineAction);return}let nav=e.target.closest('[data-nav]');if(nav){jump(nav.dataset.nav);return}let open=e.target.closest('[data-open]');if(open){jump(open.dataset.open);return}let lib=e.target.closest('[data-lib]');if(lib){linkLibrary(lib.dataset.lib);return}});
$('#theme-btn').addEventListener('click',()=>{theme=theme==='dark'?'light':'dark';store('ed:theme',theme);setTheme()});$('#size-btn').addEventListener('click',()=>{large=!large;store('ed:large',large);setTheme()});$('#menu').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(page!=='home'&&page!=='library')home();$('#search')?.focus()}if(e.key==='Escape')$('#sidebar').classList.remove('open')});$('#side-links').innerHTML=cards.slice(0,4).map(c=>`<button class="navitem" data-nav="${esc(c.id)}"><span>${c.icon}</span>${esc(c.name)}</button>`).join('');
function network(){let el=$('#network-status'),dot=$('#status-dot');let offline=!navigator.onLine;el.textContent=offline?'Offline · verify cached guides':'Network available · offline not yet verified';dot.style.background=offline?'var(--amber)':'var(--teal)'}window.addEventListener('online',network);window.addEventListener('offline',network);network();setTheme();
// PWA service worker is registered only on secure origins (or localhost), never on file://.
if('serviceWorker' in navigator && location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
const hash=decodeURIComponent(location.hash.slice(1));if(hash&&cards.some(c=>c.id===hash))guide(hash);else home();
})();
