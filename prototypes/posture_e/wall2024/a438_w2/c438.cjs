// ASK 438 C2 (W2): live 2d40e6ad against target, L2 Gloss Plan replay on the stored runs (rp.cjs, shim.cjs).
const fs=require('fs');const {run}=require('./rp.cjs');const SH=require('./shim.cjs');
const LXr=JSON.parse(fs.readFileSync('lexall.json')).map(([strongs_number,original_script,transliteration,anchor_gloss])=>({strongs_number,original_script,transliteration,anchor_gloss}));
SH.setLex({get(url){const q=new URL(url).searchParams;const S=new Set(q.get('strongs_number').match(/^in\.\((.*)\)$/)[1].split(','));const sel=q.get('select').split(',');return LXr.filter(r=>S.has(r.strongs_number)).slice(0,+(q.get('limit')||1e9)).map(r=>{const o={};for(const c of sel)o[c]=r[c];return o;});}});
const [LV,TG]=process.argv.slice(2);const L=JSON.parse(fs.readFileSync(LV)),T=JSON.parse(fs.readFileSync(TG));const D=JSON.parse(fs.readFileSync('debates.json'));
const tot={runs:0,err:0,headChanged:0,candDiff:0,otherFieldDiff:0,citDiff:0,runsMore:0,glossAdded:0,numsAdded:0,readsLive:0,readsTarget:0,cut60:0,cutN:0,d406:0,maxG:0,maxN:0};const lines=[];
for(const r of D){let a,b;try{a=run(L,r,SH.get).M;b=run(T,r,SH.get).M;}catch(e){tot.err++;lines.push(r.run_token+' ERROR '+e.message);continue;}tot.runs++;
 if(JSON.stringify(a['Citation Scan'])!==JSON.stringify(b['Citation Scan']))tot.citDiff++;
 const pa=a['L2 Gloss Plan'],pb=b['L2 Gloss Plan'];const ma=(pa[0].json.meta)||{gloss:[],cand:[]},mb=(pb[0].json.meta)||{gloss:[],cand:[]};
 const ga=pa[0].json.none?[]:ma.gloss,gb=pb[0].json.none?[]:mb.gloss;
 if(JSON.stringify(ma.cand)!==JSON.stringify(mb.cand))tot.candDiff++;
 const na=[...new Set(ga.flatMap(g=>g.nums))],nb=[...new Set(gb.flatMap(g=>g.nums))];
 // today's glosses kept by live must stay at the head, same order (live G = today's first min(60) then 406 adds); compare today's part
 const ta=ga.slice(0,ga.length-(ma.n406||0)),tb=gb.slice(0,ta.length);if(JSON.stringify(ta)!==JSON.stringify(tb)){tot.headChanged++;lines.push(r.run_token+' TODAY HEAD CHANGED');}
 const ra=pa.filter(i=>i.json.k==='ren').length,rb=pb.filter(i=>i.json.k==='ren').length;tot.readsLive+=ra;tot.readsTarget+=rb;
 const ka=pa.filter(i=>i.json.k!=='ren').map(i=>JSON.stringify({...i.json,meta:undefined})),kb=pb.filter(i=>i.json.k!=='ren').map(i=>JSON.stringify({...i.json,meta:undefined}));if(JSON.stringify(ka)!==JSON.stringify(kb))tot.otherFieldDiff++;
 if(nb.length>100)tot.cutN++;if((mb.d406||0)>0)tot.d406+=mb.d406;tot.maxG=Math.max(tot.maxG,gb.length);tot.maxN=Math.max(tot.maxN,nb.length);
 if(gb.length>ga.length||nb.length>na.length){tot.runsMore++;tot.glossAdded+=gb.length-ga.length;tot.numsAdded+=nb.length-na.length;lines.push(`${r.run_token} glosses ${ga.length} -> ${gb.length} | numbers read ${na.length} -> ${nb.length} | renderings reads ${ra} -> ${rb} | 406 cut ${ma.d406||0} -> ${mb.d406||0}`);}
}
console.log(JSON.stringify(tot));lines.forEach(l=>console.log(l));
