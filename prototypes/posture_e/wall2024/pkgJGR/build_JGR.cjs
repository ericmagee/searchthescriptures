// pkgJGR (W2, 11-08): gemini and grok judge no more (Eric 21:08Z/21:10Z "remove gemini and grok judges", too expensive); qwen3.8-flash
// (seat qwen_flash) takes the third panel place (Eric's choice on W3's card). Panel: terra (seat chatgpt), sol, qwen_flash.
// Run from wall2024/: node pkgJGR/build_JGR.cjs [base workflow=/mnt/project-files/wall2024/fetchback_live_s67.json]
// The 6 nodes are byte-equal in live s67 and staged s68. Writes pkgJGR/patched/<node>.js and pkgJGR/plan_JGR.json.
const fs=require('fs'),cr=require('crypto');const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const BASE=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s67.json';const W=JSON.parse(fs.readFileSync(BASE,'utf8'));
const TAG=" /* pkgJGR (Eric 21:10Z 11-08): gemini and grok judge no more; qwen_flash (qwen/qwen3.8-flash) is the third panel seat */";
const FAM="qwen:'openrouter',sol:'openrouter'}";const FAM2="qwen:'openrouter',sol:'openrouter',qwen_flash:'openrouter'}";
const EDITS={
 'Init Seats':[["const ORDER0=['gemini','chatgpt','qwen','sol','grok'];","const ORDER0=['chatgpt','sol','qwen_flash','qwen'];"+TAG],[FAM,FAM2]],
 'Resolve Seats':[[FAM,FAM2]],
 'Accept Build':[["const ORDER=['gemini','chatgpt','qwen','sol','grok'];","const ORDER=['chatgpt','sol','qwen_flash','qwen'];"+TAG],["qwen:'qwen',grok:'grok',sol:'sol'}","qwen:'qwen',grok:'grok',sol:'sol',qwen_flash:'qwen_flash'}"]],
 'Build Synthesis':[[FAM,FAM2]],'Build Independent Verdict':[[FAM,FAM2]],'Build Diagnostic Prompt':[[FAM,FAM2]]};
fs.rmSync('pkgJGR/patched',{recursive:true,force:true});fs.mkdirSync('pkgJGR/patched',{recursive:true});const plan={base:BASE,nodes:{}};
for(const [nm,E] of Object.entries(EDITS)){const c0=W.nodes.find(n=>n.name===nm).parameters.jsCode;let c=c0;
 for(const [a,b] of E){const k=c.split(a).length-1;if(k!==1)throw new Error(nm+': anchor found '+k+' times: '+a.slice(0,60));c=c.replace(a,b);}
 new Function('$','$input','$execution','return (async()=>{\n'+c+'\n})();');fs.writeFileSync('pkgJGR/patched/'+nm.replace(/ /g,'_')+'.js',c);plan.nodes[nm]={before:h(c0),after:h(c),edits:E.length};}
fs.writeFileSync('pkgJGR/plan_JGR.json',JSON.stringify(plan,null,1)+'\n');console.log(JSON.stringify(plan.nodes));
