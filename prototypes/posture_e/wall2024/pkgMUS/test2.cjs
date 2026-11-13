// pkgMUS rev 2 test: as rev 1, plus gemini 3.8 flash effort low except debater keys (:defender, :challenger).
// rev 1: every __orc copy adds effort low for hydrogen, meta/muse-ember and meta/muse-spark-1.3 only.
const fs=require('fs');const raw=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const srcs=[];for(const n of W.nodes){const s=n.parameters?.jsCode;if(typeof s!=='string')continue;
 if(n.name==='Shared Library'){const T=s,a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/');JSON.parse(T.slice(a+8,b)).forEach(l=>{if(/const __orc=\(/.test(l))srcs.push(['Shared Library',l]);});continue;}
 const m=s.match(/const __orc=\([^\n]*?return o;\};/);if(m)srcs.push([n.name,m[0]]);}
let pass=0,fail=0;const msgs=[{role:'system',content:'S'},{role:'user',content:'U'}];
for(const [nm,src] of srcs){const f=new Function('return (()=>{'+src.match(/const __orc=\([^\n]*?return o;\};/)[0]+'return __orc;})()')();const three=f.length===3;
 const call=(model,b,key='k')=>three?f(b,model,key):f(b,'openrouter',model,key);
 const cases=[['google/gemini-4-hydrogen',{model:'x',max_tokens:64000,messages:msgs},{effort:'low'},64000],
  ['google/gemini-4-argon',{model:'x',max_tokens:64000,messages:msgs},undefined,64000],
  ['x-ai/grok-4.7',{model:'x',max_tokens:100,messages:msgs},undefined,100],
  ['google/gemini-4-hydrogen',{model:'x',max_tokens:64000,messages:msgs,reasoning:{effort:'high'}},{effort:'high'},64000],
  ['google/gemini-4-hydrogen-x',{model:'x',max_tokens:64000,messages:msgs},undefined,64000],
  ['meta/muse-ember',{model:'x',max_tokens:64000,messages:msgs},{effort:'low'},64000],
  ['meta/muse-spark-1.3',{model:'x',max_tokens:64000,messages:msgs},{effort:'low'},64000],
  ['meta/muse-spark-1x3',{model:'x',max_tokens:64000,messages:msgs},undefined,64000],
  ['meta/muse-spark-1.2',{model:'x',max_tokens:64000,messages:msgs},undefined,64000],
  ['meta/muse-ember',{model:'x',max_tokens:64000,messages:msgs,reasoning:{effort:'medium'}},{effort:'medium'},64000]];
 cases.push(['google/gemini-3.8-flash',{model:'x',max_tokens:64000,messages:msgs},{effort:'low'},64000,'T:panel:gemini'],['google/gemini-3.8-flash',{model:'x',max_tokens:64000,messages:msgs},{effort:'low'},64000,'T:alternate:gemini'],['google/gemini-3.8-flash',{model:'x',max_tokens:64000,messages:msgs},{effort:'low'},64000,'E:accept:gemini'],['google/gemini-3.8-flash',{model:'x',max_tokens:64000,messages:msgs},undefined,64000,'T:defender'],['google/gemini-3.8-flash',{model:'x',max_tokens:64000,messages:msgs},undefined,64000,'T:challenger'],['google/gemini-3.8-flash',{model:'x',max_tokens:64000,messages:msgs,reasoning:{effort:'high'}},{effort:'high'},64000,'T:panel:gemini'],['google/gemini-3.8-flash-lite',{model:'x',max_tokens:64000,messages:msgs},undefined,64000,'T:panel:gemini']);
 for(const [m,b,want,mt,key] of cases){const o=call(m,b,key);const ok=JSON.stringify(o.reasoning)===JSON.stringify(want)&&o.max_tokens===mt;ok?pass++:fail++;if(!ok)console.log('FAIL',nm,m,JSON.stringify(o.reasoning));}
 if(!three){const o=f({messages:msgs},'anthropic','google/gemini-4-hydrogen','k');if(o.reasoning){fail++;console.log('FAIL non-openrouter',nm);}else pass++;}}
console.log('copies',srcs.length,'pass',pass,'fail',fail);
