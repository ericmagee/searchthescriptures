// pkgGRA (W3 feedback ruling B2; Eric 00:03Z 2026-11-07: "grok may serve as an alternate"): Init Seats drops grok from the alternate-pool filter.
// Base: live Init Seats (fetchback_live_1b49671d.json = pkgJFL/base/Init_Seats.js). Run from wall2024/: node pkgGRA/build_GRA.cjs
// Also writes patched_on_JFL/Init_Seats.js: the same edit on pkgJFL's patched Init Seats, for when pkgJFL's n8n part is written first.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const A="s=>JFAM_I[s]==='openrouter'&&s!=='grok'&&s!=='mimo'&&JUDGE_TIME_REMOVED.indexOf(s)<0);";
const Bn="/* pkgGRA (Eric 00:03Z 11-07): grok may serve as an alternate */s=>JFAM_I[s]==='openrouter'&&s!=='mimo'&&JUDGE_TIME_REMOVED.indexOf(s)<0);";
const ed=(s0,f)=>{if(s0.split(A).length!==2)throw new Error(f+': anchor');const s=s0.replace(A,()=>Bn);new Function('$','$input','$json','$execution',s);return s;};
const plan={nodes:[]};
for(const [src,out] of [['pkgGRA/base/Init_Seats.js','pkgGRA/patched/Init_Seats.js'],['pkgJFL/patched/Init_Seats.js','pkgGRA/patched_on_JFL/Init_Seats.js']]){
 const s0=fs.readFileSync(src,'utf8');const s=ed(s0,src);fs.mkdirSync(require('path').dirname(out),{recursive:true});fs.writeFileSync(out,s);
 plan.nodes.push({name:'Init Seats',base:src,out,base_sha:sha(s0),final_sha:sha(s),edits:1});console.log(out,sha(s0),'->',sha(s));}
fs.writeFileSync('pkgGRA/plan_GRA.json',JSON.stringify(plan,null,1));
