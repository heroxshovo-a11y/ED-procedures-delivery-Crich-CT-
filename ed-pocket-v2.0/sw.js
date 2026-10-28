/* ED Pocket v1.7: five bundled original anatomy plates + four optional licensed originals. */
const CORE_CACHE='ed-pocket-core-v2.0-preview-20261028';
// Keep prior optional cache name across content-only updates so previously saved licensed images are not deleted.
const ART_CACHE='ed-pocket-optional-anatomy-v1.7';
const ANATOMY_URLS=[
  "https://upload.wikimedia.org/wikipedia/commons/7/73/ShoulderDystociaFig3.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/2/27/ShoulderDystociaFig4.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/9/95/Cricothyrotomystat.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/0/01/Cricothyrotomy.png"
];
const BUNDLED_PLATES=[
  "./anatomy/delivery.png",
  "./anatomy/mcroberts.svg",
  "./anatomy/suprapubic.jpg",
  "./anatomy/shoulder-width.jpg",
  "./anatomy/shoulder-fig1.jpg"
];
const ANATOMY_SET=new Set(ANATOMY_URLS);
const ASSETS=['./','./index.html','./style.css','./rapid.js','./main.js','./tools.js','./review-index.js','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon.svg','./full-reference.html',...BUNDLED_PLATES,'./diagrams/airway.svg','./diagrams/chest-interspace.svg','./diagrams/chest.svg','./diagrams/cric-flow.svg','./diagrams/cric.svg','./diagrams/delivery.svg','./diagrams/epi-dose.svg','./diagrams/nrp-compressions.svg','./diagrams/nrp-ventilation.svg','./diagrams/nrp.svg','./diagrams/nuchal.svg','./diagrams/pph-4ts.svg','./diagrams/pph-response.svg','./diagrams/shoulder-sequence.svg','./diagrams/shoulder.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CORE_CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('ed-pocket-')&&!([CORE_CACHE,ART_CACHE].includes(k))).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
const artworkRequest=url=>new Request(url,{mode:'no-cors',credentials:'omit',referrerPolicy:'no-referrer'});
async function storedCount(){const c=await caches.open(ART_CACHE);let total=0;for(const url of ANATOMY_URLS)if(await c.match(url,{ignoreVary:true}))total++;return total}
async function saveAll(client){const c=await caches.open(ART_CACHE);let done=0,failed=0;for(const url of ANATOMY_URLS){try{
 if(!await c.match(url,{ignoreVary:true})){
  const req=artworkRequest(url);const response=await fetch(req);
  // Cross-origin images are opaque; CacheStorage accepts opaque responses, but their HTTP status cannot be inspected.
  if(response.type!=='opaque'&&!response.ok)throw Error('image request unsuccessful');
  await c.put(req,response);
 }
}catch(e){failed++}
 done++;client?.postMessage({type:'ANATOMY_PROGRESS',done,count:await storedCount(),failed,total:ANATOMY_URLS.length});
}client?.postMessage({type:'ANATOMY_FINISH',count:await storedCount(),failed,total:ANATOMY_URLS.length});}
self.addEventListener('message',event=>{const client=event.source;const type=event.data?.type;if(!client)return;
 if(type==='ANATOMY_SAVE')event.waitUntil(saveAll(client));
 else if(type==='CORE_AUDIT')event.waitUntil(caches.open(CORE_CACHE).then(async c=>{let cached=0;const missing=[];for(const a of ASSETS){if(await c.match(a))cached++;else missing.push(a)}client.postMessage({type:'CORE_AUDIT',cached,total:ASSETS.length,missing})}));
 else if(type==='CORE_STATUS')event.waitUntil(caches.open(CORE_CACHE).then(async c=>{let found=0;for(const asset of ASSETS)if(await c.match(asset))found++;client.postMessage({type:'CORE_STATUS',cached:found,total:ASSETS.length})}));
 else if(type==='ANATOMY_STATUS')event.waitUntil(storedCount().then(count=>client.postMessage({type:'ANATOMY_STATUS',count,total:ANATOMY_URLS.length})));
 else if(type==='ANATOMY_CLEAR')event.waitUntil(caches.delete(ART_CACHE).then(()=>client.postMessage({type:'ANATOMY_CLEARED'})));
});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;
 const url=new URL(req.url);
 const isCacheOnlyTest=url.searchParams.get('ed_offline_check')==='1';
 if(isCacheOnlyTest){
  const canonical=url.origin+url.pathname;
  const isBundled=url.origin===self.location.origin && BUNDLED_PLATES.some(p=>new URL(p,self.registration.scope).pathname===url.pathname);
  if(!ANATOMY_SET.has(canonical)&&!isBundled)return;
  event.respondWith((async()=>{
    const cache=await caches.open(isBundled?CORE_CACHE:ART_CACHE);
    const stored=await cache.match(isBundled?new URL(url.pathname,url.origin).href:canonical,{ignoreVary:true});
    return stored||Response.error();
  })());return;
 }
 if(ANATOMY_SET.has(url.href)){
  event.respondWith((async()=>{const cache=await caches.open(ART_CACHE);const saved=await cache.match(url.href,{ignoreVary:true});if(saved)return saved;
   const response=await fetch(req);if(response.type==='opaque'||response.ok)event.waitUntil(cache.put(req,response.clone()));return response;
  })());return;
 }
 if(url.origin!==self.location.origin)return;
 event.respondWith((async()=>{try{const response=await fetch(req);if(response.ok)event.waitUntil(caches.open(CORE_CACHE).then(c=>c.put(req,response.clone())));return response}
 catch{const cached=await caches.match(req,{ignoreVary:true});if(cached)return cached;
 // Never substitute HTML for a missing image, script or other asset.
 if(req.mode==='navigate')return await caches.match('./index.html');
 return Response.error()}})());
});
