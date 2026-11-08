// pkgJGR (W2, 11-08): gemini and grok judge no more (Eric 21:08Z/21:10Z "remove gemini and grok judges", too expensive); qwen3.8-flash
// (seat qwen_flash) takes the third panel place (Eric's choice on W3's card). Panel: terra (seat chatgpt), sol, qwen_flash.
// Run from wall2024/: node pkgJGR/build_JGR.cjs [base workflow=/mnt/project-files/wall2024/fetchback_live_s67.json]
// Base: live s68 (the 6 seat nodes are byte-equal in live s67 and staged s68. Writes pkgJGR/patched/<node>.js and pkgJGR/plan_JGR.json.
const fs=require('fs'),cr=require('crypto');const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const BASE=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s68.json';const W=JSON.parse(fs.readFileSync(BASE,'utf8'));
const TAG=" /* pkgJGR (Eric 21:10Z 11-08): gemini and grok judge no more; qwen_flash (qwen/qwen3.8-flash) is the third panel seat */";
const FAM="qwen:'openrouter',sol:'openrouter'}";const FAM2="qwen:'openrouter',sol:'openrouter',qwen_flash:'openrouter'}";
// pkgPNL3's rule (33530: qwen/qwen3.8-flash spent all 64,000 tokens on reasoning and returned no content), narrowed to qwen_flash's model only:
// every judge body builder on the panel/reserve/posture/alternate path sends qwen/qwen3.8-flash reasoning {effort:'low'} unless the body sets one.
const ORC4="const __orc=(b,fam,model,key)=>{if(fam!=='openrouter'||!b||!Array.isArray(b.messages))return b;const o={...b,session_id:String(key).slice(0,128)};";
const QFR="if(!o.reasoning&&/^qwen\\/qwen3\\.8-flash$/.test(String(model)))o.reasoning={effort:'low'}; /* pkgJGR (pkgPNL3 rule, qwen_flash only): the flash judge leaves room for the verdict (33530) */";
const ORC3="const __orc=(b,model,key)=>{if(!b||!Array.isArray(b.messages))return b;return {...b,session_id:String(key).slice(0,128)};};";
const ORC3N="const __orc=(b,model,key)=>{if(!b||!Array.isArray(b.messages))return b;const o={...b,session_id:String(key).slice(0,128)};"+QFR+"return o;};";
const EDITS={
 'Init Seats':[["const ORDER0=['gemini','chatgpt','qwen','sol','grok'];","const ORDER0=['chatgpt','sol','qwen_flash','qwen'];"+TAG],[FAM,FAM2]],
 'Resolve Seats':[[FAM,FAM2]],
 'Accept Build':[["const ORDER=['gemini','chatgpt','qwen','sol','grok'];","const ORDER=['chatgpt','sol','qwen_flash','qwen'];"+TAG],["qwen:'qwen',grok:'grok',sol:'sol'}","qwen:'qwen',grok:'grok',sol:'sol',qwen_flash:'qwen_flash'}"],[ORC3,ORC3N]],
 'Panel Build':[[ORC4,ORC4+QFR]],'Reserve Build':[[ORC4,ORC4+QFR]],
 'Build Synthesis':[[FAM,FAM2]],'Build Independent Verdict':[[FAM,FAM2]],'Build Diagnostic Prompt':[[FAM,FAM2]]};
fs.rmSync('pkgJGR/patched',{recursive:true,force:true});fs.mkdirSync('pkgJGR/patched',{recursive:true});const plan={base:BASE,nodes:{}};
for(const [nm,E] of Object.entries(EDITS)){const c0=W.nodes.find(n=>n.name===nm).parameters.jsCode;let c=c0;
 for(const [a,b] of E){const k=c.split(a).length-1;if(k!==1)throw new Error(nm+': anchor found '+k+' times: '+a.slice(0,60));c=c.replace(a,b);}
 new Function('$','$input','$execution','return (async()=>{\n'+c+'\n})();');fs.writeFileSync('pkgJGR/patched/'+nm.replace(/ /g,'_')+'.js',c);plan.nodes[nm]={before:h(c0),after:h(c),edits:E.length};}
// library: Alternate Build and R2 Alternate Build (base: the s68 library strip_RTB4_8) -> pkgLIB/strip_JGR
const LB='pkgLIB/strip_RTB4_8/patched/',LO='pkgLIB/strip_JGR/patched/';fs.rmSync('pkgLIB/strip_JGR',{recursive:true,force:true});fs.mkdirSync(LO,{recursive:true});plan.library={base:LB,nodes:{}};
for(const f of fs.readdirSync(LB)){const c0=fs.readFileSync(LB+f,'utf8');let c=c0;if(['Alternate_Build.js','R2_Alternate_Build.js'].includes(f)){const k=c.split(ORC4).length-1;if(k!==1)throw new Error(f+': ORC4 '+k);c=c.replace(ORC4,ORC4+QFR);new Function('$','$input','$execution','return (async()=>{\n'+c+'\n})();');plan.library.nodes[f]={before:h(c0),after:h(c)};}fs.writeFileSync(LO+f,c);}
fs.writeFileSync('pkgJGR/plan_JGR.json',JSON.stringify(plan,null,1)+'\n');console.log(JSON.stringify(plan.nodes),JSON.stringify(plan.library.nodes));
