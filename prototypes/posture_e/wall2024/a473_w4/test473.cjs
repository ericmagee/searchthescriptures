// ASK 473 test: for every caller (14 nodes, 2 library stubs), the old __orc and the new __orc (read from the target library) give byte-equal request bodies
// for every model_config api_model and family, on bodies with a string system message, an array system message, no messages and null.
// usage: node a473_w4/test473.cjs BASE_ENGINE.json TARGET_ENGINE.json
const fs=require('fs');const T=require('../tools/lib.cjs');
const [BE,TE]=process.argv.slice(2);const B=JSON.parse(fs.readFileSync(BE)),G=JSON.parse(fs.readFileSync(TE));
const SL=G.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const $=()=>({params:{jsCode:SL}});
const MODELS=['anthropic/claude-haiku-5.5','anthropic/claude-opus-5.5','anthropic/claude-sonnet-5.5','baidu/ernie-5.5-flash-preview:free','deepseek-flash','google/gemini-3.8-flash','google/gemini-4-argon','google/gemini-4-hydrogen','kimi-k3','meta/muse-ember','meta/muse-spark-1.3','minimax/minimax-m3.1-flash','minimax/minimax-m3','openai/gpt-6-luna','openai/gpt-6.1-sol','openai/gpt-6.1-terra','openai/gpt-6.2-sol','qwen/qwen3.8-flash','qwen/qwen3.8-max-0902','qwen/qwen4-max','tencent/hy4-flash','tencent/hy4','x-ai/grok-4.7','xiaomi/mimo-v2.6-pro','z-ai/glm-5.3-flash','z-ai/glm-5.3-flashx-legal','z-ai/glm-5.3','',null];
const FAMS=['openrouter','anthropic','openai','google','xai','deepseek','',null];
const BODIES=[{model:'m',messages:[{role:'system',content:'SYS'},{role:'user',content:'U'}],temperature:0},{model:'m',max_tokens:1000,messages:[{role:'system',content:[{type:'text',text:'S'}]},{role:'user',content:'U'}]},{model:'m',input:'x'},null];
const KEY='k'.repeat(200);
const grab=(src)=>{const m=src.match(/const __orc=[^\n]*/);if(!m)return null;return m[0];};
const fnFromNode=(code,withReader)=>{const line=grab(code);if(withReader){const i=code.indexOf('const __ORC=(T=>');const r=code.slice(i,code.indexOf("$('Shared Library').params.jsCode);",i)+"$('Shared Library').params.jsCode);".length);return new Function('$',r+'\n'+line+'\nreturn __orc;')($);}return new Function(line+'\nreturn __orc;')();};
const UB=T.unpack(B),UG=T.unpack(G);
const cases=[];
for(const n of B.nodes){if(n.name==='Shared Library')continue;const j=(n.parameters||{}).jsCode||'';if(!/const __orc=/.test(j))continue;const t=G.nodes.find(x=>x.name===n.name).parameters.jsCode;cases.push([n.name,fnFromNode(j,false),fnFromNode(t,true)]);}
for(const k of ['Alternate Build','R2 Alternate Build']){const sb=T.rb(UB.L,UB.M[k]),sg=T.rb(UG.L,UG.M[k]);const ob=new Function(grab(sb)+'\nreturn __orc;')();const ig=sg.indexOf('const __ORC=');const og=new Function(sg.slice(ig,sg.indexOf('\n',sg.indexOf('const __orc=',ig)))+'\nreturn __orc;')();cases.push(['lib:'+k,ob,og]);}
let n=0,bad=0;for(const [nm,o,w] of cases){const ar=o.length;let nb=0;for(const f of FAMS)for(const m of MODELS)for(const b of BODIES){const args=ar===3?[b,m,KEY]:[b,f,m,KEY];const x=JSON.stringify(o(...args.map(a=>a&&typeof a==='object'?JSON.parse(JSON.stringify(a)):a))),y=JSON.stringify(w(...args.map(a=>a&&typeof a==='object'?JSON.parse(JSON.stringify(a)):a)));n++;if(x!==y){bad++;nb++;if(nb<3)console.log('DIFF',nm,f,m,x.slice(0,160),'|',y.slice(0,160));}}
 console.log(nm.padEnd(28),'arity',ar,'cases',ar===3?MODELS.length*BODIES.length:FAMS.length*MODELS.length*BODIES.length,'diffs',nb);}
console.log('TOTAL calls compared',n,'| differing request bodies',bad,bad?'| FAIL':'| PASS');process.exit(bad?1:0);
