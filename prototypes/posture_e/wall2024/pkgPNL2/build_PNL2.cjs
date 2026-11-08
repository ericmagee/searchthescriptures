// pkgPNL2 (W2; Eric 01:58Z 11-08: "sol is expensive... that's why i wanted it move... not removed"; then 02:00Z: "place sol before grok"):
// sol returns as an alternate before grok. Order: panel gemini, terra (seat chatgpt), qwen_flash; reserve glm_flash; alternates glm_flash, mimo, sol, grok.
// (1) Init Seats: ORDER0 gains 'sol' before 'grok'. ALT_ORDER already keeps sol (JFAM_I sol openrouter; not in JUDGE_TIME_REMOVED). FAM_PANEL still
//     drops sol when an openai model (terra) debates.
//     ALT_ORDER is taken in ORDER0 order: sol's model is jfl_move (K-W in 7 runs), and pfree puts moved seats last, which would put sol after grok
//     against Eric's order. The set of alternates is unchanged (pfree0 minus the panel = pfree.slice(3)); moved seats still sit on no panel place
//     and are not the reserve while three unmoved seats remain.
// (2) Accept Build: ORDER gains 'sol' before 'grok', so sol is asked the posture like every judge seat (posture v5: alternates are seats that
//     accepted). ENG_SEAT already maps sol.
// Not changed (checked): Resolve Seats JFAM has sol; odv1_record_panel_alternates accepts provider openrouter (sol's row); odv1_record_panel_substitution
// lists sol; the single-judge maps list sol. No SQL.
// Base: live s53 1a7d5a3b. Run from wall2024/: node pkgPNL2/build_PNL2.cjs [--base file] [--out dir]
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};const SRC=arg('--base','/mnt/project-files/wall2024/fetchback_live_s53.json');
const W=JSON.parse(fs.readFileSync(SRC,'utf8'));const L=(W.data||W);const OUT=arg('--out',__dirname+'/patched');fs.mkdirSync(OUT,{recursive:true});
const E={
 'Init Seats':[["const ALT_ORDER=pfree.slice(3).filter(","const ALT_ORDER=pfree0.filter(s=>panel_order.indexOf(s)<0).filter( /* pkgPNL2: the alternates in ORDER0 order, so a seat the fault ledger moved (pkgJFL: off the panel and not the reserve) keeps its place among the alternates (Eric 02:00Z: sol before grok); same seats as pfree.slice(3) */"],["const ORDER0=['gemini','chatgpt','qwen','qwen_flash','glm_flash','mimo','grok'];","const ORDER0=['gemini','chatgpt','qwen','qwen_flash','glm_flash','mimo','sol','grok']; /* pkgPNL2 (Eric 01:58Z and 02:00Z 11-08: sol moved, not removed; place sol before grok) */"]],
 'Accept Build':[["const ORDER=['gemini','chatgpt','qwen','qwen_flash','glm_flash','mimo','grok'];","const ORDER=['gemini','chatgpt','qwen','qwen_flash','glm_flash','mimo','sol','grok']; /* pkgPNL2: as Init Seats ORDER0 */"]]};
const plan={source:'W2 pkgPNL2, Eric 01:58Z 11-08 (sol an alternate before grok)',live:L.versionId,base:SRC,nodes:[]};
for(const [name,eds] of Object.entries(E)){const node=L.nodes.find(z=>z.name===name);const s0=node.parameters.jsCode;let s=s0;
 for(const [a,b] of eds){const c=s.split(a).length-1;if(c!==1)throw new Error(name+' anchor x'+c+': '+a.slice(0,70));s=s.replace(a,()=>b);}
 new Function('$','$input','$json','$execution','$workflow',s);const f=name.replace(/ /g,'_')+'.js';fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({name,file:f,base_sha:sha(s0),final_sha:sha(s),bytes:[s0.length,s.length]});}
fs.writeFileSync(OUT+'.plan.json',JSON.stringify(plan,null,1));plan.nodes.forEach(n=>console.log(n.name.padEnd(14),n.base_sha,'->',n.final_sha));
