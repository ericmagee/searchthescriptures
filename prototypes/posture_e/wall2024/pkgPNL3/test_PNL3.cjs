// pkgPNL3 test (W2). Live s53 code vs patched code on saved run 33530 inputs (the failing run), plus the derived bodies and the HTTP wrapper.
// Run from wall2024/: node pkgPNL3/test_PNL3.cjs > pkgPNL3/test_PNL3.txt
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const {rebuild}=require('../pkgLIB/unpack.cjs');
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s53.json','utf8'));const ns=(W.data||W).nodes||(W.data||W).workflow.nodes;
const node=n=>ns.find(z=>z.name===n);const P=f=>fs.readFileSync('pkgPNL3/patched/'+f,'utf8'),B=f=>fs.readFileSync('pkgPNL3/base/'+f,'utf8');
let ok=0,bad=0;const out=[];const T=(c,m)=>{c?ok++:bad++;out.push((c?'OK ':'FAIL ')+m);};
const R='33530';const AW=c=>'return (async()=>{'+c+'\n})();';const H=o=>{const h=harness(R,o);return (code,inp)=>h(AW(code),inp);};
(async()=>{const strip=b=>{const o={...b};delete o.reasoning;return o;};const J=JSON.stringify;
// 1 Panel Build
const pbB=(await H()(B('Panel_Build.js'),'Anticheat Only?'))[0].json,pbP=(await H()(P('Panel_Build.js'),'Anticheat Only?'))[0].json;
const saved=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/33530_Panel_Build.json','utf8'));const sv=(Array.isArray(saved)?saved[0]:saved).data.main[0][0].json;
T(J(pbB.judges.map(j=>j.body))===J(sv.judges.map(j=>j.body)),'Panel Build base code reproduces the stored 33530 panel bodies');
for(const j of pbP.judges){const b0=pbB.judges.find(x=>x.seat===j.seat).body;
 if(/^(qwen|z-ai)\//.test(j.api_model))T(J(j.body.reasoning)===J({effort:'low'})&&J(strip(j.body))===J(b0),'Panel Build '+j.seat+' ('+j.api_model+'): base body + reasoning effort low, nothing else');
 else T(J(j.body)===J(b0),'Panel Build '+j.seat+' ('+j.api_model+'): body unchanged');}
// 2 Panel Judges Prep carries it into the dispatched request
const prep=async code=>(await H({'Panel Build':[{json:code}]})(node('Panel Judges Prep').parameters.jsCode,'QR Merge')).map(x=>x.json);
const qB=await prep(pbB),qP=await prep(pbP);
for(const s of qP){const s0=qB.find(x=>x.seat===s.seat);const isF=/^(qwen|z-ai)\//.test(s.api_model);
 T(isF?(J(s.body.reasoning)===J({effort:'low'})&&J(strip(s.body))===J(strip(s0.body))):J(s.body)===J(s0.body),'Panel Judges Prep slot '+s.ppj_slot+' '+s.seat+': '+(isF?'dispatched body carries reasoning effort low':'dispatched body unchanged'));}
// 3 Reserve Build (glm_flash was the 33530 reserve)
const rbB=(await H()(B('Reserve_Build.js'),'Reserve Needed?'))[0].json,rbP=(await H()(P('Reserve_Build.js'),'Reserve Needed?'))[0].json;
T(rbP.seat==='glm_flash'&&J(rbP.body.reasoning)===J({effort:'low'})&&J(strip(rbP.body))===J(rbB.body),'Reserve Build glm_flash: base body + reasoning effort low');
// 4 the HTTP node's own wrapper keeps the field (Panel Reserve openrouter jsonBody, run on the patched body)
const jb=node('Panel Reserve openrouter').parameters.jsonBody.replace(/^=\{\{\s*/,'').replace(/\s*\}\}$/,'');
const sent=new Function('$','return '+jb)(n=>{if(n==='Reserve Build')return {first:()=>({json:rbP})};throw new Error('unexpected '+n);});
T(J(sent.reasoning)===J({effort:'low'})&&J(sent.provider)===J({order:['z-ai'],allow_fallbacks:false}),'Panel Reserve openrouter wrapper: sent body keeps reasoning effort low and the z-ai provider pin');
// 5 Accept Build (33530 posture check of the alternates)
let aB,aP;try{aB=(await H()(B('Accept_Build.js'),'Accept Models')).map(x=>x.json);aP=(await H()(P('Accept_Build.js'),'Accept Models')).map(x=>x.json);}catch(e){aB=aP=null;out.push('   Accept Build run on saved input failed: '+e.message);}
if(aP){for(const a of aP){const a0=aB.find(x=>x.acc.seat===a.acc.seat);const m=a.acc.api_model;
 if(/^(qwen|z-ai)\//.test(m))T(J(a.acc.body.reasoning)===J({effort:'low'})&&J(strip(a.acc.body))===J(a0.acc.body),'Accept Build '+a.acc.seat+' ('+m+'): base body + reasoning effort low');
 else T(J(a.acc.body)===J(a0.acc.body),'Accept Build '+a.acc.seat+' ('+m+'): body unchanged');}}
// 6 __orc in every patched builder, direct: qwen/, z-ai/ -> effort low; xiaomi/ -> thinking off unless set; others untouched; a set reasoning kept
const orcOf=s=>{const m=s.match(/const __orc=[\s\S]*?\/\* pkgPNL3[^*]*\*\/(?:[^\n]*?return o;\};)?/);return m?m[0]:null;};
const lib=fs.readFileSync('pkgLIB_v15_PNL3/patched/Shared_Library.js','utf8');const altFull=rebuild(fs.readFileSync('pkgLIB_v15_PNL3/patched/Alternate_Build.js','utf8'),lib);
T(altFull===fs.readFileSync('pkgLIB/strip_PNL3/patched/Alternate_Build.js','utf8'),'Alternate Build stub (library v15) rebuilds byte for byte to the patched full source');
const srcs={'Panel Build':P('Panel_Build.js'),'Reserve Build':P('Reserve_Build.js'),'Alternate Build':altFull};
const mb=m=>({model:m,max_tokens:64000,messages:[{role:'user',content:'x'}]});
for(const [nm,s] of Object.entries(srcs)){const i=s.indexOf('const __orc=');const e=s.indexOf('};',s.indexOf('return o;',i))+2;const orc=new Function('return '+s.slice(i+12,e-1))();
 const r=m=>orc(mb(m),'openrouter',m,'k');
 T(J(r('qwen/qwen3.8-flash').reasoning)===J({effort:'low'})&&J(r('z-ai/glm-5.3-flash').reasoning)===J({effort:'low'})&&J(r('xiaomi/mimo-v2.6-pro').reasoning)===J({enabled:false})
  &&r('google/gemini-3.8-flash').reasoning===undefined&&r('openai/gpt-6.1-terra').reasoning===undefined&&r('x-ai/grok-4.7').reasoning===undefined
  &&J(orc({...mb('qwen/q'),reasoning:{effort:'high'}},'openrouter','qwen/q','k').reasoning)===J({effort:'high'})&&orc(mb('qwen/q'),'deepseek','qwen/q','k').reasoning===undefined,
  nm+' __orc: qwen/ and z-ai/ get effort low, xiaomi/ thinking off, google/openai/x-ai untouched, a set reasoning kept, non-openrouter untouched');}
{const s=P('Accept_Build.js');const i=s.indexOf('const __orc=');const e=s.indexOf('};',s.indexOf('return o;',i))+2;const orc=new Function('return '+s.slice(i+12,e-1))();
 T(J(orc(mb('z-ai/glm-5.3-flash'),'z-ai/glm-5.3-flash','k').reasoning)===J({effort:'low'})&&J(orc({...mb('xiaomi/m'),reasoning:{enabled:false}},'xiaomi/m','k').reasoning)===J({enabled:false})&&orc(mb('google/g'),'google/g','k').reasoning===undefined,'Accept Build __orc: same rule');}
// 7 derived bodies are deep copies: cure (library cureBody) and send-back spread keep the field
const li=JSON.parse(lib.slice(lib.indexOf('\n/*LIB*/')+8,lib.lastIndexOf('\n/*END*/')));const cs=li.findIndex(l=>l.startsWith('function cureBody('));const ce=li.findIndex((l,k)=>k>cs&&l===' return b;}');let cb=li.slice(cs,ce+1).join('\n');
const cureBody=new Function(cb+';return cureBody;')();const qb=pbP.judges.find(j=>/^qwen\//.test(j.api_model)).body;
T(J(cureBody('openrouter',qb,'ans','ask').reasoning)===J({effort:'low'}),'cure body (library cureBody) keeps reasoning effort low');
T(J({...qb,messages:[...qb.messages,{role:'assistant',content:'a'},{role:'user',content:'m'}]}.reasoning)===J({effort:'low'}),'send-back body ({...j.body, messages}) keeps reasoning effort low');
console.log(out.join('\n')+'\nTOTAL '+ok+' OK, '+bad+' FAIL');})().catch(e=>{console.log('FAIL exception '+e.stack);});
