// ASK 438 C2 (W2): live 2d40e6ad against target, L2 Gloss Plan replay on the stored runs (rp.cjs, shim.cjs).
const fs=require('fs');const {run}=require('./rp.cjs');const SH=require('./shim.cjs');
const LXr=JSON.parse(fs.readFileSync('lexall.json')).map(([strongs_number,original_script,transliteration,anchor_gloss])=>({strongs_number,original_script,transliteration,anchor_gloss}));
SH.setLex({get(url){const q=new URL(url).searchParams;const S=new Set(q.get('strongs_number').match(/^in\.\((.*)\)$/)[1].split(','));const sel=q.get('select').split(',');return LXr.filter(r=>S.has(r.strongs_number)).slice(0,+(q.get('limit')||1e9)).map(r=>{const o={};for(const c of sel)o[c]=r[c];return o;});}});
const [LV,TG]=process.argv.slice(2);const L=JSON.parse(fs.readFileSync(LV)),T=JSON.parse(fs.readFileSync(TG));const D=JSON.parse(fs.readFileSync('debates.json'));
// ASK 438 C3 (W2): size of the Part B gloss record (meta.gloss JSON) live vs target, on the largest runs.
const pick=new Set(['ODV1-37510-6gpyl6l8','ODV1-34108-3to8dgrt','ODV1-35173-s7fayi5e','ODV1-36916-jm52130i','ODV1-37281-70812cud']);
for(const r of D){if(!pick.has(r.run_token))continue;const a=run(L,r,SH.get).M['L2 Gloss Plan'],b=run(T,r,SH.get).M['L2 Gloss Plan'];
 const sa=JSON.stringify(a[0].json.meta||{}).length,sb=JSON.stringify(b[0].json.meta||{}).length;
 const ga=JSON.stringify((a[0].json.meta||{}).gloss||[]).length,gb=JSON.stringify((b[0].json.meta||{}).gloss||[]).length;
 console.log(r.run_token+' meta chars '+sa+' -> '+sb+' | gloss chars '+ga+' -> '+gb+' | items '+a.length+' -> '+b.length);}
