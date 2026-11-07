// pkgMIM (Eric 10:34 CST 11-07, "yes ... add mimo"): mimo joins the alternate pool as the second model after grok, so pkgODD's reserve rule has a
// free pool model to seat. Not a DeepSeek fix.
// (1) Init Seats: ORDER0 gains 'mimo' after 'grok' (after the three panel places and the reserve, so the panel, reserve and single judge are
//     unchanged); the ALT_ORDER filter no longer drops mimo (its 2026-11-03 removal is lifted by the operator's word).
// (2) Accept Build: mimo is asked the posture like every judge seat (its xiaomi/ body already exists there); a refusal keeps it out (AGREE_OUT).
// (3) Alternate Build: mimo's OpenRouter body carries reasoning {enabled:false}: the record shows mimo with thinking on did not answer within 900 s
//     at 65,536 tokens (exec 25738) and spent the whole limit as reserve (32471, 32482); thinking off answered in 57 s (exec 25753). The Gate,
//     Send Back and Cure calls spread this body, so they inherit it. Accept Build's xiaomi/ body gets the same flag.
// Base: live s44. Run from wall2024/: node pkgMIM/build_MIM.cjs [--base file] [--out dir]
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};const SRC=arg('--base','/mnt/project-files/wall2024/fetchback_live_s44.json');
const W=JSON.parse(fs.readFileSync(SRC,'utf8'));const L=(W.data||W);const OUT=arg('--out',__dirname+'/patched');fs.mkdirSync(OUT,{recursive:true});
const E={
 'Init Seats':[["const ORDER0=['gemini','chatgpt','qwen','sol','grok'];","const ORDER0=['gemini','chatgpt','qwen','sol','grok','mimo']; /* pkgMIM (Eric 10:34 CST 11-07, \"yes ... add mimo\"): mimo is the second alternate after grok */"],
  ["s=>JFAM_I[s]==='openrouter'&&s!=='mimo'&&JUDGE_TIME_REMOVED.indexOf(s)<0);","s=>JFAM_I[s]==='openrouter'&&JUDGE_TIME_REMOVED.indexOf(s)<0); /* pkgMIM: mimo no longer dropped */"]],
 'Accept Build':[["const ORDER=['gemini','chatgpt','qwen','sol','grok'];","const ORDER=['gemini','chatgpt','qwen','sol','grok','mimo']; /* pkgMIM: mimo is asked the posture */"],
  ["/^xiaomi\\//.test(x.api_model)?{model:x.api_model,max_tokens:Math.max(mt,65536),messages:m}","/^xiaomi\\//.test(x.api_model)?{model:x.api_model,max_tokens:Math.max(mt,65536),messages:m,reasoning:{enabled:false}}"]],
 'Alternate Build':[[":a.seat==='qwen'?{model:a.api_model,max_tokens:a.max_tokens,messages:msgs,response_format:{type:'json_object'}}:{model:a.api_model,max_tokens:a.max_tokens,messages:msgs};",
  ":a.seat==='qwen'?{model:a.api_model,max_tokens:a.max_tokens,messages:msgs,response_format:{type:'json_object'}}:/^xiaomi\\//.test(a.api_model)?{model:a.api_model,max_tokens:a.max_tokens,messages:msgs,reasoning:{enabled:false}}:{model:a.api_model,max_tokens:a.max_tokens,messages:msgs}; /* pkgMIM: mimo answers with thinking off (exec 25753: 57 s; thinking on, exec 25738: no answer in 900 s) */"]]};
const plan={source:'W2 pkgMIM, Eric 10:34 CST 11-07 (add mimo to the alternate pool)',live:L.versionId,base:SRC,nodes:[]};
for(const [name,eds] of Object.entries(E)){const node=L.nodes.find(z=>z.name===name);const s0=node.parameters.jsCode;let s=s0;
 for(const [a,b] of eds){const c=s.split(a).length-1;if(c!==1)throw new Error(name+' anchor x'+c+': '+a.slice(0,60));s=s.replace(a,()=>b);}
 new Function('$','$input','$json','$execution','$workflow',s);const f=name.replace(/ /g,'_')+'.js';fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({name,file:f,base_sha:sha(s0),final_sha:sha(s),bytes:[s0.length,s.length]});}
fs.writeFileSync(OUT+'.plan.json',JSON.stringify(plan,null,1));console.log(JSON.stringify(plan.nodes));
