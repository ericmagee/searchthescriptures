// pkgRMT test: the body chain of Reserve Build (from "let body;" to "const jidx0") run alone, base vs patched, for every reserve family.
// No saved run reached Reserve Build (no *_Reserve_Build.json input), so the openrouter branches are run directly.
const fs=require('fs');let ok=0,bad=0;const out=[];const T=(c,m)=>{c?ok++:bad++;out.push((c?'OK ':'FAIL ')+m);};
// the openrouter branches of the body chain (x-ai, xiaomi, google, then the rest), cut from the node source and run alone
const chain=s=>{const a=s.indexOf("else if(j.fam==='openrouter'&&/^x-ai\\//");if(a<0)throw new Error('anchor');const e=s.indexOf('\n',s.indexOf("/^google\\//",a));return 'let body;if(false){}'+s.slice(a,e);};
const run=(s,j)=>new Function('j','m',chain(s)+';return body;')(j,[{role:'user',content:'x'}]);
const B=fs.readFileSync('pkgRMT/base_s53/Reserve_Build.js','utf8'),P=fs.readFileSync('pkgRMT/patched/Reserve_Build.js','utf8');
const cases=[['mimo','openrouter','xiaomi/mimo-v2.6-pro'],['glm_flash','openrouter','z-ai/glm-5.3-flash'],['qwen_flash','openrouter','qwen/qwen3.8-flash'],['grok','openrouter','x-ai/grok-4.7'],['gemini','openrouter','google/gemini-3.8-flash']];
for(const [seat,fam,api] of cases){const j={seat,fam,api_model:api,max_tokens:64000};let b0,b1;try{b0=run(B,j);b1=run(P,j);}catch(e){T(false,seat+' threw '+e.message);continue;}
 if(seat==='mimo')T(JSON.stringify(b1)===JSON.stringify({...b0,reasoning:{enabled:false}})&&b1.max_tokens===65536,'mimo: patched = base + reasoning {enabled:false}: '+JSON.stringify({...b1,messages:undefined}));
 else T(JSON.stringify(b0)===JSON.stringify(b1),seat+': body unchanged');}
out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out.join('\n'));fs.writeFileSync('pkgRMT/test_RMT.txt',out.join('\n')+'\n');
