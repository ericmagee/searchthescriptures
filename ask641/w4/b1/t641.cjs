// ASK 641 tests (W4). Usage: node t641.cjs base.json target.json fx/r42505_calls.json
const fs=require('fs');const [,,BA,TG,FX]=process.argv;
const B=JSON.parse(fs.readFileSync(BA,'utf8')),T=JSON.parse(fs.readFileSync(TG,'utf8')),F=JSON.parse(fs.readFileSync(FX,'utf8'));
let pass=0,fail=0;const ok=(c,m)=>{if(c)pass++;else{fail++;console.log('FAIL',m);}};
const N=E=>Object.fromEntries(E.nodes.map(n=>[n.name,n]));const NB=N(B),NT=N(T);
const mk=(E,map,passes)=>{const lib=N(E)['Shared Library'].parameters.jsCode;
 const $=k=>{if(k==='Shared Library')return {params:{jsCode:lib}};
  if(k==='Pass Accumulate'&&passes){return {isExecuted:true,first:()=>({json:passes[0]}),all:(o,r)=>[{json:passes[r]}]};}
  if(!(k in map))return {isExecuted:false,first:()=>{throw new Error('no '+k)},all:()=>{throw new Error('no '+k)}};
  const v=map[k];return {isExecuted:true,first:()=>({json:v[0]}),all:()=>v.map(json=>({json}))};};return $;};
const run=async(E,node,map,passes)=>{const $=mk(E,map,passes);const $input={first:()=>({json:{}}),all:()=>[]};const $execution={id:'T641',mode:'manual',customData:{set(){}}};
 const code=N(E)[node].parameters.jsCode;return await new Function('$','$input','$execution','return (async()=>{\n'+code+'\n})();')($,$input,$execution);};
(async()=>{
const base={};for(const [k,v] of Object.entries(F)){if(['Init Seats','Failure Salvage'].includes(k))continue;base[k]=v;}
const S0={run_token:'ODV1-42505-x',regrade:false,dry:false};
const pre={saveBody:{input_tokens:1000,output_tokens:2000,cache_write_tokens:30,cache_read_tokens:40}};
const orU={id:'gen-1',model:'openai/gpt-6.1-sol',usage:{prompt_tokens:500,completion_tokens:600,cost:0.01,prompt_tokens_details:{cached_tokens:20,cache_write_tokens:5}}};
const gmU={modelVersion:'gemini-3.8-flash',usageMetadata:{promptTokenCount:300,candidatesTokenCount:40,thoughtsTokenCount:7,cachedContentTokenCount:9}};
const P2=[{__a379:{passes:[1],nodes:{'R2 Alternate Call openrouter':{ran:true,items:[{...orU,id:'gen-r2'}]}}}}];
const cases=[
 ['42505 inputs, Build Save Body run',{...base,'Init Seats':[S0],'Build Save Body':[pre]}],
 ['42505 inputs, no Build Save Body',{...base,'Init Seats':[S0]}],
 ['regrade',{...base,'Init Seats':[{...S0,regrade:true}],'Build Save Body':[pre]}],
 ['dry',{...base,'Init Seats':[{...S0,dry:true}],'Build Save Body':[pre]}],
 ['panel nodes and a gemini reply',{...base,'Init Seats':[S0],'Build Save Body':[pre],'Panel Judge 1 openrouter':[orU],'Panel Judge 2 openrouter':[{...orU,id:'gen-2'}],'Panel Judge 3 openrouter':[gmU],'Alternate Call openrouter':[{...orU,id:'gen-3'}]}],
 ['round 2 alternate (Pass Accumulate)',{...base,'Init Seats':[S0],'Build Save Body':[pre]},P2],
 ['duplicate reply id counted once',{...base,'Init Seats':[S0],'Build Save Body':[pre],'Panel Judge 1 openrouter':[orU],'Panel Judge 2 openrouter':[orU]}]];
for(const [nm,map,ps] of cases){const o=JSON.stringify(await run(B,'Panel Tokens',map,ps)),n=JSON.stringify(await run(T,'Panel Tokens',map,ps)),s=JSON.stringify(await run(T,'Salvage Tokens',map,ps));
 ok(o===n,'C1 '+nm+': Panel Tokens output differs');ok(o===s,'C1 '+nm+': Salvage Tokens output differs');}
// C2: 42505 salvage
const r=(await run(T,'Salvage Tokens',{...base,'Init Seats':[S0]}))[0].json;
const billed=Object.entries(base).flatMap(([k,v])=>v.filter(j=>j.usage||j.usageMetadata).map(()=>k));
console.log('C2 42505: calls',r.calls.length,'billed node outputs',billed.length,'go',r.go);
const all=Object.values(base).reduce((a,v)=>a+v.length,0);ok(r.calls.length===all,'C2 every call output is listed ('+r.calls.length+' of '+all+')');
 const none=r.calls.filter(c=>c.f==='none').map(c=>c.n);console.log('C2 entries with no usage (priced NULL):',none.join(', '));ok(JSON.stringify(none)===JSON.stringify(Object.entries(base).flatMap(([k,v])=>v.filter(j=>!(j.usage||j.usageMetadata)).map(()=>k))),'C2 only the outputs with no usage are unpriced');
fs.writeFileSync('out_c2_calls.json',JSON.stringify(r.calls));
// C3
const wt=NT['Salvage Write Tokens'].parameters.jsonBody;ok(/p_run_token: \$\('Failure Salvage'\)\.first\(\)\.json\.run_token/.test(wt)&&/p_input: null, p_output: null, p_cache_write: null, p_cache_read: null/.test(wt)&&/p_calls: \(\$\('Salvage Tokens'\)\.first\(\)\.json\.calls \|\| null\)/.test(wt),'C3 body');
const fsv=NB['Failure Salvage'].parameters.jsCode;ok(/const TOK=TEST\?String\(S\.run_token\)\.replace\(\/\^ODV1-\/,'ODV1-TEST-'\):S\.run_token;/.test(fsv)&&/body\.run_token=TOK;/.test(fsv)&&/run_token:TOK,saveBody:body/.test(fsv),'C3 Failure Salvage gives the row token TOK in both modes');
ok(NT['Salvage Write Tokens'].parameters.url===NB['Write Tokens'].parameters.url&&JSON.stringify(NT['Salvage Write Tokens'].credentials)===JSON.stringify(NB['Write Tokens'].credentials)&&NT['Salvage Write Tokens'].onError==='continueRegularOutput','C3 same RPC, credential, onError');
// C4
const P=E=>Object.fromEntries(E.nodes.map(n=>[n.name,JSON.stringify(n.parameters)]));const pb=P(B),pt=P(T);
const ch=Object.keys(pb).filter(k=>pb[k]!==pt[k]).sort();ok(JSON.stringify(ch)===JSON.stringify(['Panel Tokens','Shared Library']),'C4 changed '+ch);
const add=Object.keys(pt).filter(k=>!(k in pb)).sort();ok(JSON.stringify(add)===JSON.stringify(['Salvage Tokens','Salvage Write Tokens','Salvage Write Tokens?']),'C4 added '+add);
const cb=B.connections,ct=T.connections;const ck=[...new Set([...Object.keys(cb),...Object.keys(ct)])].filter(k=>JSON.stringify(cb[k])!==JSON.stringify(ct[k])).sort();
ok(JSON.stringify(ck)===JSON.stringify(['Salvage Save','Salvage Tokens','Salvage Write Tokens','Salvage Write Tokens?']),'C4 connections changed '+ck);
const lib=E=>{const t=N(E)['Shared Library'].parameters.jsCode;return {L:JSON.parse(t.slice(t.indexOf('\n/*LIB*/')+8,t.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(t.slice(t.lastIndexOf('\n/*MAP*/')+8,t.lastIndexOf('\n/*END*/'))),h:t.slice(0,t.indexOf('\n/*LIB*/')),tl:t.slice(t.lastIndexOf('\n/*END*/'))};};
const lb=lib(B),lt=lib(T);const reb=(x,p)=>p.map(e=>typeof e==='number'?x.L[e]:typeof e[0]==='string'?e[0]:x.L.slice(e[0],e[1]+1).join('\n')).join('\n');
ok(lb.h===lt.h&&lb.tl===lt.tl,'C4 library header and tail kept');ok(lt.L.slice(0,lb.L.length).every((l,i)=>l===lb.L[i]),'C4 existing LIB lines unchanged');
ok(Object.keys(lb.M).every(k=>JSON.stringify(lb.M[k])===JSON.stringify(lt.M[k])&&reb(lb,lb.M[k].p)===reb(lt,lt.M[k].p)),'C4 every existing MAP entry rebuilds the same source');
ok(reb(lt,lt.M['Panel Tokens'].p)===NB['Panel Tokens'].parameters.jsCode&&lt.M['Panel Tokens'].n===NB['Panel Tokens'].parameters.jsCode.length,'C4 the entry is the old Panel Tokens body, unchanged');
const lits=s=>new Set([...s.matchAll(/\$\((['"])([^'"]+)\1\)/g)].map(m=>m[2]));const body=lits(NB['Panel Tokens'].parameters.jsCode);
for(const k of ['Panel Tokens','Salvage Tokens']){const h=NT[k].parameters.jsCode.split('\n')[0];const hs=new Set([...h.matchAll(/\$\("([^"]+)"\)/g)].map(m=>m[1]));
 ok(hs.size===body.size&&[...body].every(x=>hs.has(x)),'C4 N1: '+k+' header names = body literals ('+hs.size+' vs '+body.size+')');}
ok(NT['Panel Tokens'].parameters.jsCode===NT['Salvage Tokens'].parameters.jsCode,'C4 the two stubs are one text');
for(const k of ['Panel Tokens','Salvage Tokens'])try{new Function('$','$input','$execution','return (async()=>{\n'+NT[k].parameters.jsCode+'\n})();');ok(true);}catch(e){ok(false,'compile '+k+' '+e.message);}
// C5
ok(['Panel Tokens','Salvage Tokens'].every(k=>/ASK 641/.test(NT[k].parameters.jsCode))&&['Salvage Tokens','Salvage Write Tokens?','Salvage Write Tokens'].every(k=>/^ASK 641/.test(NT[k].notes||'')),'C5 tags');
ok(!/catch/.test(NT['Panel Tokens'].parameters.jsCode),'C5 no new catch in the stub');
console.log(pass+' pass, '+fail+' fail');console.log(fail?'FAILED':'ALL PASS');})().catch(e=>{console.log('ERROR',e.stack);console.log('FAILED');});
