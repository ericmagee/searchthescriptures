const {out,RD}=require('./x.cjs');const S=JSON.stringify;
const rr=out('Replay Rows');console.log('Replay Rows items',rr.length);rr.forEach(r=>{const j=r.json;console.log(Object.keys(j).join(','));});
const j0=rr[0].json;const rows=j0.rows||j0.judgments||[j0];
for(const r of rr){const j=r.json;for(const k of Object.keys(j)){const v=j[k];if(typeof v==='string'&&v.length>300)console.log('  '+k+': string '+v.length);else console.log('  '+k+': '+S(v).slice(0,300));}console.log('----');}
