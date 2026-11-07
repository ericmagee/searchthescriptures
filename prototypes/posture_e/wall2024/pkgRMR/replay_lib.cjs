// pkgRMR replay: every saved Alternate Merge Seat output; each removed seat (drv_removed) and each body with drv_uncured>0. Does rmrOf's total equal drv_uncured?
const fs=require('fs');const {rmrOf}=new Function(fs.readFileSync(__dirname+'/rmr_lib.js','utf8')+';return {rmrOf};')();
const B=fs.readFileSync(__dirname+'/base/Alternate_Merge_Seat.js','utf8');const ES=eval('('+B.match(/const ENF_STATUS=(\{[\s\S]*?\});/)[1]+')');const live=r=>ES[r]!=='TRIAL';
const D='/mnt/project-files/wall2024/inputs/';let ok=0,bad=0;
for(const f of fs.readdirSync(D).filter(f=>/_Alternate_Merge_Seat\.json$/.test(f)).sort()){const J=JSON.parse(fs.readFileSync(D+f,"utf8"));const e0=J.find(x=>x&&((x.data&&x.data.main)||x.main));const e=e0&&(e0.data||e0);if(!e){console.log("SKIP "+f+" (no output: "+(J[0]&&J[0].executionStatus)+")");continue;}const m=e.main[0][0].json;const run=f.split('_')[0];
 const rows=(m.drv_removed||[]).map(r=>({who:'removed '+r.seat,raw:r.verdict_raw,drv:r.drv_uncured})).concat((m.bodies||[]).map(b=>JSON.parse(b).payload).filter(p=>(p.drv_uncured||0)>0).map(p=>({who:'uncounted '+p.judge_seat,raw:p.verdict_raw,drv:p.drv_uncured})));
 for(const r of rows){const x=rmrOf(r.raw,r.drv,live);console.log((x.match?'OK  ':'DIFF')+' '+run+' '+r.who+' drv '+r.drv+' read '+x.total+': '+x.rules.join('; '));x.match?ok++:bad++;}}
console.log(ok+' match, '+bad+' differ');
