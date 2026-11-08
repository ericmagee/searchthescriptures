// pkgRMR (W1; W3 rulings 2026-11-07 item 10 "Show the removal rule in drv_removed", outside review D7; Eric 16:42Z: no judge issue is low priority).
// Record only, 1 node (Alternate Merge Seat). Each drv_removed entry gains removed_rules (rule and count), removed_rules_total and removed_rules_match
// (total equals drv_uncured), read from the removed seat's own stored lines (rmr_lib.js). Every ALTERNATE TRIED audit line gains "; REMOVED FOR: ...",
// so a seat left uncounted with no alternate seated (33345 sol) shows its rule too. No count, verdict or seat changes.
// Run from wall2024/: node pkgRMR/build_RMR.cjs [--base dir] [--out dir]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};
const BASE=arg('--base','pkgRMR/base'),OUT=arg('--out','pkgRMR/patched');const F='Alternate_Merge_Seat.js';
const LIB=fs.readFileSync(__dirname+'/rmr_lib.js','utf8');
const rep=(s,a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('anchor x'+n+': '+a.slice(0,60));return s.split(a).join(b);};
let s=fs.readFileSync(BASE+'/'+F,'utf8');const s0=s;
const A1="const bodies=PP.bodies.slice();const summary=(PP.summary||[]).map(s=>({...s}));const removed=[];";
s=rep(s,A1,LIB+"const __rmrLive=r=>enfStatus(r)==='LIVE';const __rmrTxt=x=>'drv_uncured '+(x.drv||0)+': '+(x.rules.join('; ')||'no counted line read')+(x.match?'':' (read '+x.total+', count differs)');\n"+A1);
const A2=" removed.push({seat:old.judge_seat,api_model:old.judge_api_model,";
s=rep(s,A2," const __rm=rmrOf(old.verdict_raw,old.drv_uncured,__rmrLive); /* pkgRMR */\n removed.push({removed_rules:__rm.rules,removed_rules_total:__rm.total,removed_rules_match:__rm.match,seat:old.judge_seat,api_model:old.judge_api_model,");
const A3="tried.forEach(x=>{if(!x.removed_seat)return;";
s=rep(s,A3,A3+"const __rf=(()=>{try{const rm0=removed.find(r=>r.seat===x.removed_seat);if(rm0)return __rmrTxt({...rmrOf(rm0.verdict_raw,rm0.drv_uncured,__rmrLive),drv:rm0.drv_uncured});const k0=bodies.findIndex(b=>{try{return JSON.parse(b).payload.judge_seat===x.removed_seat;}catch(e){return false;}});if(k0<0)return null;const p0=JSON.parse(bodies[k0]).payload;return __rmrTxt({...rmrOf(p0.verdict_raw,p0.drv_uncured,__rmrLive),drv:p0.drv_uncured});}catch(e){return null;}})(); /* pkgRMR */");
const A4="(x.why?'; WHY: '+altSafe(String(x.why).slice(0,300)):'')+']';";
s=rep(s,A4,"(x.why?'; WHY: '+altSafe(String(x.why).slice(0,300)):'')+(__rf?(x.why?'; ':'; WHY: ')+'REMOVED FOR: '+altSafe(__rf.slice(0,400)):'')+']';"); /* v2 (W3 2897): with no WHY, REMOVED FOR is written as the WHY so Format Markdown's ALTERNATE TRIED reader still matches a SEATED line */
fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(OUT+'/'+F,s);
const plan={base:BASE,nodes:[{file:F,node:'Alternate Merge Seat',base_sha:sha(s0),final_sha:sha(s)}]};fs.writeFileSync(OUT+'.plan.json',JSON.stringify(plan,null,1));
console.log(F.padEnd(30),sha(s0),'->',sha(s),'->',OUT);
