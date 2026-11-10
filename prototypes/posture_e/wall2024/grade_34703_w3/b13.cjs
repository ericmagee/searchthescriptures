const {RD,out}=require('./x.cjs');
const el=out('Alternate Merge')[0].json.enforcer_log||[];
const c={};for(const r of el.filter(r=>r.kind==='cure'&&r.rule==='K-S3')){const k=String(r.cure_reason).slice(0,95);c[k]=(c[k]||0)+1}console.log(JSON.stringify(c,null,1));
