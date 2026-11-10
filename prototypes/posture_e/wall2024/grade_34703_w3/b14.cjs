const {RD,out}=require('./x.cjs');const sr=out('Send Back Record')[0].json;
for(const r of sr.sb_rows.filter(r=>r.seat==='luna'&&/Luke 1:34/.test(r.item||'')))console.log(r.item,'|',String(r.cure_reason).slice(String(r.cure_reason).indexOf('ENFORCER:'),String(r.cure_reason).indexOf('ENFORCER:')+330));
