// pkgPNL (W2; Eric 18:45 CST 11-07, W3 thread): "replace 6.1 sol with qwen/qwen3.8-flash replace grok with z-ai/glm-5.3-flash as the first alternate
// make mimo the 2rd alternate make gork the last alternate". Not a DeepSeek fix; rides beside one.
// New model_config seats qwen_flash and glm_flash (sql/), so the old qwen (qwen3.8-max) and glm (glm-5.3) rows and their enforcer_log and
// special bodies stay apart (W3). n8n:
// (1) Init Seats: ORDER0 gemini, chatgpt, qwen, qwen_flash, glm_flash, mimo, grok (sol out). Panel = gemini, chatgpt, qwen_flash; reserve =
//     glm_flash; alternates in order glm_flash, mimo, grok. The 2026-11-03 mimo drop in ALT_ORDER is lifted (pkgMIM part 1, graded, never written).
//     JFAM_I knows the two new seats. qwen stays as it was (not panel, not reserve, not alternate: JUDGE_TIME_REMOVED).
// (2) Resolve Seats: JFAM knows the two new seats (else they could not be judges or alternates).
// (3) Accept Build: ENG_SEAT and ORDER as Init Seats, so the new seats and mimo are asked the posture; mimo's posture body has thinking off
//     (pkgMIM part 2).
// (4) Build Synthesis, Build Independent Verdict, Build Diagnostic Prompt: the single-judge family map knows the two new seats, as it knew sol
//     (single judge stays gemini; this only keeps a fail-closed refusal from firing when gemini and chatgpt both debate).
// Base: live s52. Run from wall2024/: node pkgPNL/build_PNL.cjs [--base file] [--out dir]
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};const SRC=arg('--base','/mnt/project-files/wall2024/fetchback_live_s52.json');
const W=JSON.parse(fs.readFileSync(SRC,'utf8'));const L=(W.data||W);const OUT=arg('--out',__dirname+'/patched');fs.mkdirSync(OUT,{recursive:true});
const JF2_A="mimo:'openrouter',glm:'openrouter',alt_minimax31:'openrouter',qwen:'openrouter',sol:'openrouter'};";
const JF2_B="mimo:'openrouter',glm:'openrouter',alt_minimax31:'openrouter',qwen:'openrouter',sol:'openrouter',qwen_flash:'openrouter',glm_flash:'openrouter'}; /* pkgPNL */";
const E={
 'Init Seats':[
  ["const ORDER0=['gemini','chatgpt','qwen','sol','grok'];","const ORDER0=['gemini','chatgpt','qwen','qwen_flash','glm_flash','mimo','grok']; /* pkgPNL (Eric 18:45 CST 11-07): qwen/qwen3.8-flash (seat qwen_flash) replaces sol on the panel; alternates glm_flash (z-ai/glm-5.3-flash), then mimo, then grok; glm_flash is also the reserve */"],
  ["s=>JFAM_I[s]==='openrouter'&&s!=='mimo'&&JUDGE_TIME_REMOVED.indexOf(s)<0);","s=>JFAM_I[s]==='openrouter'&&JUDGE_TIME_REMOVED.indexOf(s)<0); /* pkgPNL (pkgMIM part 1): mimo no longer dropped */"],
  ["qwen:'openrouter',sol:'openrouter'}; // judge_fix3 A2\n","qwen:'openrouter',sol:'openrouter',qwen_flash:'openrouter',glm_flash:'openrouter'}; // judge_fix3 A2; pkgPNL\n"]],
 'Resolve Seats':[["qwen:'openrouter',sol:'openrouter'}; // judge_fix3 A2: the added alternate","qwen:'openrouter',sol:'openrouter',qwen_flash:'openrouter',glm_flash:'openrouter'}; // judge_fix3 A2: the added alternate; pkgPNL"]],
 'Accept Build':[
  ["mimo:'mimo',qwen:'qwen',grok:'grok',sol:'sol'};","mimo:'mimo',qwen:'qwen',grok:'grok',sol:'sol',qwen_flash:'qwen_flash',glm_flash:'glm_flash'}; /* pkgPNL */"],
  ["const ORDER=['gemini','chatgpt','qwen','sol','grok'];","const ORDER=['gemini','chatgpt','qwen','qwen_flash','glm_flash','mimo','grok']; /* pkgPNL: as Init Seats ORDER0 */"],
  ["/^xiaomi\\//.test(x.api_model)?{model:x.api_model,max_tokens:Math.max(mt,65536),messages:m}","/^xiaomi\\//.test(x.api_model)?{model:x.api_model,max_tokens:Math.max(mt,65536),messages:m,reasoning:{enabled:false}}"]],
 'Build Synthesis':[[JF2_A,JF2_B]],'Build Independent Verdict':[[JF2_A,JF2_B]],'Build Diagnostic Prompt':[[JF2_A,JF2_B]]};
const plan={source:'W2 pkgPNL, Eric 18:45 CST 11-07 (panel qwen flash; alternates glm flash, mimo, grok)',live:L.versionId,base:SRC,nodes:[]};
for(const [name,eds] of Object.entries(E)){const node=L.nodes.find(z=>z.name===name);const s0=node.parameters.jsCode;let s=s0;
 for(const [a,b] of eds){const c=s.split(a).length-1;if(c!==1)throw new Error(name+' anchor x'+c+': '+a.slice(0,70));s=s.replace(a,()=>b);}
 new Function('$','$input','$json','$execution','$workflow',s);const f=name.replace(/ /g,'_')+'.js';fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({name,file:f,base_sha:sha(s0),final_sha:sha(s),bytes:[s0.length,s.length]});}
fs.writeFileSync(OUT+'.plan.json',JSON.stringify(plan,null,1));plan.nodes.forEach(n=>console.log(n.name.padEnd(26),n.base_sha,'->',n.final_sha));
