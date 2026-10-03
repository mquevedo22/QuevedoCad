const V='songbook-v2';
const LIBS=['https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js','https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js','https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js','https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.2/Sortable.min.js'];
self.addEventListener('install',e=>{
 e.waitUntil(caches.open(V).then(c=>Promise.all([...['./','./index.html','./manifest.json','./icon-180.png','./icon-192.png','./icon-512.png'].map(u=>c.add(u).catch(()=>{})),...LIBS.map(u=>c.add(new Request(u,{mode:'cors'})).catch(()=>{}))])).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
 e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url);
 if(u.origin===self.location.origin){
  e.respondWith((async()=>{
   const c=await caches.open(V);
   const net=fetch(r,{cache:'no-cache'}).then(res=>{if(res.ok)c.put(r,res.clone());return res});
   try{return await Promise.race([net,new Promise((_,no)=>setTimeout(no,4000))])}
   catch(_){const m=(await c.match(r,{ignoreSearch:true}))||(await c.match('./index.html'));return m||net}
  })());
  return;
 }
 if(LIBS.includes(r.url)||u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res})));
 }
});
