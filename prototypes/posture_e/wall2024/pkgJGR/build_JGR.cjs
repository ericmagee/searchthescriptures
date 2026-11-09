// pkgJGR (W2, 11-08): gemini and grok judge no more (Eric 21:08Z/21:10Z "remove gemini and grok judges", too expensive); qwen3.8-flash
// (seat qwen_flash) takes the third panel place (Eric's choice on W3's card). Panel: terra (seat chatgpt), sol, qwen_flash.
// Run from wall2024/: node pkgJGR/build_JGR.cjs [base workflow=/mnt/project-files/wall2024/fetchback_live_s67.json]
// Base: live s68 (the 6 seat nodes are byte-equal in live s67 and staged s68. Writes pkgJGR/patched/<node>.js and pkgJGR/plan_JGR.json.
const fs=require('fs'),cr=require('crypto');const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const BASE=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s68.json';const W=JSON.parse(fs.readFileSync(BASE,'utf8'));
const MIMO=process.env.JGR_THIRD==='mimo'; /* pkgJGR rev 3 (Eric 07:14Z 11-09 "we mimo as an alternate", after the qwen flash check failed, W4 3446): mimo (xiaomi/mimo-v2.6-pro) in qwen_flash's place */
const T3=MIMO?'mimo':'qwen_flash';
const TAG=MIMO?" /* pkgJGR (Eric 21:10Z 11-08): gemini and grok judge no more; mimo (xiaomi/mimo-v2.6-pro) is the third panel seat (Eric 07:14Z 11-09, after the qwen flash check failed) */":" /* pkgJGR (Eric 21:10Z 11-08): gemini and grok judge no more; qwen_flash (qwen/qwen3.8-flash) is the third panel seat */";
const FAM="qwen:'openrouter',sol:'openrouter'}";const FAM2="qwen:'openrouter',sol:'openrouter',qwen_flash:'openrouter'}";
// pkgPNL3's rule (33530: qwen/qwen3.8-flash spent all 64,000 tokens on reasoning and returned no content), narrowed to qwen_flash's model only:
// every judge body builder on the panel/reserve/posture/alternate path sends qwen/qwen3.8-flash reasoning {effort:'low'} unless the body sets one.
const ORC4="const __orc=(b,fam,model,key)=>{if(fam!=='openrouter'||!b||!Array.isArray(b.messages))return b;const o={...b,session_id:String(key).slice(0,128)};";
const QFR="if(!o.reasoning&&/^qwen\\/qwen3\\.8-flash$/.test(String(model)))o.reasoning={effort:'low'}; /* pkgJGR (pkgPNL3 rule, qwen_flash only): the flash judge leaves room for the verdict (33530) */";
const QFR_M="if(/^xiaomi\\/mimo-v2\\.6-pro$/.test(String(model))){o.max_tokens=131072;if(!o.reasoning)o.reasoning={effort:'medium'};} /* pkgJGR rev 5 (operator 07:46Z 11-09: \"use max tokens for mimo and use medium effort\"): mimo gets its maximum output, 131072 (Xiaomi, OpenRouter endpoints list 11-02), and medium effort; low effort still spent all 65,536 tokens (W4 3469) */";
const ORC3="const __orc=(b,model,key)=>{if(!b||!Array.isArray(b.messages))return b;return {...b,session_id:String(key).slice(0,128)};};";
const ORC3N="const __orc=(b,model,key)=>{if(!b||!Array.isArray(b.messages))return b;const o={...b,session_id:String(key).slice(0,128)};"+QFR+"return o;};";
const FILL=MIMO&&process.env.JGR_FILL==='luna'; /* pkgJGR rev 4 (operator 07:27Z 11-09 "add luna 6.1 as a judge"): panel terra, sol, luna; mimo the alternate */
const ALT=process.env.JGR_ALT||'mimo'; /* pkgJGR rev 6 (operator 08:31Z 11-09, suggestion: "for an alternative we can use Haiku... temporary"): JGR_ALT=haiku seats haiku as the alternate in mimo's place */
const TAGL=" /* pkgJGR (operator 21:10Z 11-08): gemini and grok judge no more; rev 4 (operator 07:14Z and 07:27Z 11-09): luna is a judge on the panel with terra and sol; "+(ALT==='haiku'?"rev 6 (operator 08:31Z 11-09): haiku is the alternate for now":"mimo is the alternate")+" */";
const FAML=ALT==='haiku'?"qwen:'openrouter',sol:'openrouter',luna:'openrouter',haiku:'openrouter'}":"qwen:'openrouter',sol:'openrouter',luna:'openrouter'}";
const EDITS=FILL?{
 'Init Seats':[["const ORDER0=['gemini','chatgpt','qwen','sol','grok'];","const ORDER0=['chatgpt','sol','luna','"+ALT+"','qwen'];"+TAGL],[FAM,FAML],["FAM_PANEL={chatgpt:'openai',sol:'openai'}","FAM_PANEL={chatgpt:'openai',sol:'openai',luna:'openai'}"]],
 'Resolve Seats':[[FAM,FAML]],
 'Accept Build':[["const ORDER=['gemini','chatgpt','qwen','sol','grok'];","const ORDER=['chatgpt','sol','luna','"+ALT+"','qwen'];"+TAGL],["qwen:'qwen',grok:'grok',sol:'sol'}","qwen:'qwen',grok:'grok',sol:'sol',luna:'luna'"+(ALT==='haiku'?",haiku:'haiku'":"")+"}"],[ORC3,ORC3N.replace(QFR,QFR_M)]],
 'Panel Build':[[ORC4,ORC4+QFR_M]],'Reserve Build':[[ORC4,ORC4+QFR_M]],
 'Build Synthesis':[[FAM,FAML]],'Build Independent Verdict':[[FAM,FAML]],'Build Diagnostic Prompt':[[FAM,FAML]]}:MIMO?{
 'Init Seats':[["const ORDER0=['gemini','chatgpt','qwen','sol','grok'];","const ORDER0=['chatgpt','sol','mimo','qwen'];"+TAG]],
 'Accept Build':[["const ORDER=['gemini','chatgpt','qwen','sol','grok'];","const ORDER=['chatgpt','sol','mimo','qwen'];"+TAG],[ORC3,ORC3N.replace(QFR,QFR_M)]],
 'Panel Build':[[ORC4,ORC4+QFR_M]],'Reserve Build':[[ORC4,ORC4+QFR_M]]}:{
 'Init Seats':[["const ORDER0=['gemini','chatgpt','qwen','sol','grok'];","const ORDER0=['chatgpt','sol','qwen_flash','qwen'];"+TAG],[FAM,FAM2]],
 'Resolve Seats':[[FAM,FAM2]],
 'Accept Build':[["const ORDER=['gemini','chatgpt','qwen','sol','grok'];","const ORDER=['chatgpt','sol','qwen_flash','qwen'];"+TAG],["qwen:'qwen',grok:'grok',sol:'sol'}","qwen:'qwen',grok:'grok',sol:'sol',qwen_flash:'qwen_flash'}"],[ORC3,ORC3N]],
 'Panel Build':[[ORC4,ORC4+QFR]],'Reserve Build':[[ORC4,ORC4+QFR]],
 'Build Synthesis':[[FAM,FAM2]],'Build Independent Verdict':[[FAM,FAM2]],'Build Diagnostic Prompt':[[FAM,FAM2]]};
fs.rmSync(process.env.JGR_NODE_OUT||'pkgJGR/patched',{recursive:true,force:true});fs.mkdirSync(process.env.JGR_NODE_OUT||'pkgJGR/patched',{recursive:true});const plan={base:BASE,nodes:{}};
const NB=process.env.JGR_NODE_DIR||'',NO=process.env.JGR_NODE_OUT||'pkgJGR/patched'; /* optional: build on node files in NB where present (e.g. pkgKWI/patched) */
for(const [nm,E] of Object.entries(EDITS)){const nf=NB?NB+'/'+nm.replace(/ /g,'_')+'.js':'';const c0=(nf&&fs.existsSync(nf))?fs.readFileSync(nf,'utf8'):W.nodes.find(n=>n.name===nm).parameters.jsCode;let c=c0;
 for(const [a,b] of E){const k=c.split(a).length-1;if(k!==1)throw new Error(nm+': anchor found '+k+' times: '+a.slice(0,60));c=c.replace(a,b);}
 new Function('$','$input','$execution','return (async()=>{\n'+c+'\n})();');fs.writeFileSync(NO+'/'+nm.replace(/ /g,'_')+'.js',c);plan.nodes[nm]={before:h(c0),after:h(c),edits:E.length};}
// library: Alternate Build and R2 Alternate Build (base: env JGR_LIB_BASE, default the s68 library strip_RTB4_8) -> pkgLIB/<JGR_LIB_OUT, default strip_JGR>
const LBD=process.env.JGR_LIB_BASE||'strip_RTB4_8',LOD=process.env.JGR_LIB_OUT||'strip_JGR';const LB='pkgLIB/'+LBD+'/patched/',LO='pkgLIB/'+LOD+'/patched/';fs.rmSync('pkgLIB/'+LOD,{recursive:true,force:true});fs.mkdirSync(LO,{recursive:true});plan.library={base:LB,nodes:{}};
for(const f of fs.readdirSync(LB)){const c0=fs.readFileSync(LB+f,'utf8');let c=c0;if(['Alternate_Build.js','R2_Alternate_Build.js'].includes(f)){const k=c.split(ORC4).length-1;if(k!==1)throw new Error(f+': ORC4 '+k);c=c.replace(ORC4,ORC4+(MIMO?QFR_M:QFR));new Function('$','$input','$execution','return (async()=>{\n'+c+'\n})();');plan.library.nodes[f]={before:h(c0),after:h(c)};}fs.writeFileSync(LO+f,c);}
fs.writeFileSync(process.env.JGR_PLAN_OUT||'pkgJGR/plan_JGR.json',JSON.stringify(plan,null,1)+'\n');console.log(JSON.stringify(plan.nodes),JSON.stringify(plan.library.nodes));
