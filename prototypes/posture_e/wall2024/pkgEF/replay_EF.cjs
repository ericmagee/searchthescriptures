// pkgEF replay: Judge Enforcer Build, pkgEP vs pkgEF, on the six saved runs. Prints code-row and item differences. Run from wall2024/.
const {run}=require('./replay_JE.cjs');
const R=[32998,33014,33020,33021,33025,33040];const out={};
for(const r of R){const agg=o=>({code_rows:o[0].json.code_rows,ids:o.flatMap(x=>x.json.ids||[]),not_checked:o[0].json.not_checked,calls:o.length,body:o.map(x=>x.json.body).join('\n')});const a=agg(run('pkgEP',r)),b=agg(run('pkgEF',r));
 const cr=o=>(o.code_rows||[]).filter(x=>x.rule==='E-RES').map(x=>x.seat+' '+x.item+' '+x.cure_reason.slice(0,90));
 const items=o=>{const t=String(o.body||'');return t;};
 const ca=cr(a),cb=cr(b);
 const ids=o=>(o.ids||[]).map(x=>x.rule+' '+x.seat+' '+x.item+' '+(x.grade||''));
 const ia=ids(a),ib=ids(b);
 out[r]={code_removed:ca.filter(x=>!cb.includes(x)),code_added:cb.filter(x=>!ca.includes(x)),ids_removed:ia.filter(x=>!ib.includes(x)),ids_added:ib.filter(x=>!ia.includes(x)),nA:ia.length,nB:ib.length,calls:[a.calls,b.calls],not_checked:[a.not_checked.length,b.not_checked.length]};
 console.log(r,JSON.stringify(out[r]));}
module.exports=out;
