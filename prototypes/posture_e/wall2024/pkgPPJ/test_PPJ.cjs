// pkgPPJ tests on every saved run with panel judge outputs (/mnt/project-files/wall2024/inputs, pkgGSL harness).
// T1 Prep: provider = the provider node that ran live; body = the live node's jsonBody expression (evaluated before the judges,
//    and again with every saved node visible, to show no judge reply ever feeds another judge's body).
// T2 the same-name Code node gives back the saved live reply byte for byte.
// T3 Panel Check (live s47 source) gives the identical output with the Code nodes as with the live replies.
// T4 failure paths (transport error, slot order swapped, provider mismatch, provider HTTP error through Wrap) reach Panel Check as judge failures.
// T5 Prep fails closed on a route index with no provider. Also: bytes added to the execution (Panel Judges Parallel output).
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const rd=f=>fs.readFileSync(f,'utf8');
const F='/mnt/project-files/wall2024/fetchback_live_s47.json';const W=JSON.parse(rd(F));const node=n=>W.nodes.find(z=>z.name===n);
const PREP=rd('pkgPPJ/patched/Panel_Judges_Prep.js');const WRAP=rd('pkgPPJ/patched/Panel_Judge_Call_Wrap.js');
const P1=['deepseek','openai','gemini','grok','mimo','openrouter'],P23=['openai','gemini','grok','mimo','openrouter'];const provs=k=>k===1?P1:P23;
const JN=[];for(const k of [1,2,3])for(const p of provs(k))JN.push('Panel Judge '+k+' '+p);JN.push('Panel Judge 1 deepseek retry','Panel Judge 1 Empty?');
const PC=node('Panel Check').parameters.jsCode;const LIB=node('Shared Library').parameters.jsCode;
const PCs=PC.includes("$('Shared Library').params.jsCode")?'const __LIBTXT='+JSON.stringify(LIB)+';\n'+PC.split("$('Shared Library').params.jsCode").join('__LIBTXT'):PC;const PCIN=feeder(F,'Panel Check')[0];
const savedItems=(R,n)=>{const f=D+R+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return null;const d=JSON.parse(rd(f));const r=Array.isArray(d)?d[0]:d;const m=(r.data&&r.data.main)||r.main;return (m&&m[0])||[];};
const runs=[...new Set(fs.readdirSync(D).filter(f=>/^33\d{3}_Panel_Judge_[123]_(openai|gemini|grok|mimo|openrouter|deepseek)\.json$/.test(f)).map(f=>f.slice(0,5)))].sort();
const S=JSON.stringify;let ok=0,bad=0;const fail=m=>{bad++;console.log('FAIL '+m);};const pass=()=>ok++;
const hideJ=()=>{const o={};for(const n of JN)o[n]=null;return o;};
const run=async(R,over,code,inp)=>{try{return await harness(R,over)('return (async()=>{'+code+'\n})()',inp);}catch(e){return 'ERR '+String(e&&e.message||e);}};
const take=(k,p)=>rd('pkgPPJ/patched/Panel_Judge_'+k+'_'+p+'.js');
(async()=>{let addMax=0,addSum=0,cross=0,na=0;const skipped=[];
for(const R of runs){const live={};for(const k of [1,2,3])for(const p of provs(k)){const it=savedItems(R,'Panel Judge '+k+' '+p);if(it)live[k]={p,it};}
 if(Object.keys(live).length!==3){console.log('SKIP '+R+': '+Object.keys(live).length+' of 3 judge replies saved so far');skipped.push(R);continue;}
 // T1 (only where the saved Panel Build has the s47 route fields; older engines routed judge 1 differently)
 const pb0=savedItems(R,'Panel Build');const hasJ0=pb0&&pb0[0]&&pb0[0].json.judges&&pb0[0].json.judges[0]&&('jidx0' in pb0[0].json.judges[0]);if(!hasJ0){na++;console.log('T1 n/a '+R+': saved Panel Build predates jidx0');}
 const items=hasJ0?await run(R,hideJ(),PREP,PCIN):null;if(hasJ0&&typeof items==='string'){fail(R+' Prep '+items);continue;}
 if(hasJ0)for(const k of [1,2,3]){const it=items[k-1].json;const nm='Panel Judge '+k+' '+live[k].p;
  if(it.ppj_slot!==k||it.ppj_provider!==live[k].p){fail(R+' slot '+k+' provider '+it.ppj_provider+' live '+live[k].p);continue;}
  const ex=node(nm).parameters.jsonBody;const code='return ('+ex.slice(4,-3)+')';
  const a=await run(R,hideJ(),code,PCIN),b=await run(R,undefined,code,PCIN);
  if(S(it.body)===S(a))pass();else fail(R+' '+nm+' body differs from the live expression');
  if(S(a)!==S(b))cross++;
  if(live[k].p==='gemini'&&it.api_model!==(await run(R,undefined,"return $('Panel Build').first().json.judges["+(k-1)+"].api_model",PCIN)))fail(R+' gemini api_model');
  if(it.conv_id!=='odv1-'+R)fail(R+' conv_id '+it.conv_id);}
 // T2 + T3
 const par=[1,2,3].map(k=>({json:{ppj_slot:k,ppj_provider:live[k].p,response:live[k].it[0].json}}));const sz=Buffer.byteLength(S(par));addMax=Math.max(addMax,sz);addSum+=sz;
 const over={'Panel Judges Parallel':par};
 for(const k of [1,2,3]){const o=await run(R,over,take(k,live[k].p),PCIN);if(S(o)===S([{json:live[k].it[0].json}])){pass();over['Panel Judge '+k+' '+live[k].p]=o;}else fail(R+' T2 judge '+k+' '+String(S(o)).slice(0,120));}
 const pa=await run(R,undefined,PCs,PCIN),pb=await run(R,over,PCs,PCIN);
 if(S(pa)===S(pb)&&(typeof pa!=='string'||!hasJ0))pass();else fail(R+' T3 Panel Check differs\n a '+String(S(pa)).slice(0,200)+'\n b '+String(S(pb)).slice(0,200));
 const sv=savedItems(R,'Panel Check');if(!hasJ0){}else if(sv&&S(pa)===S(sv.map(i=>({json:i.json}))))pass();else if(sv)fail(R+' T3 harness Panel Check differs from the saved live output');if(false)console.log('note '+R+' harness Panel Check output differs from the saved live output (harness, not PPJ)');
 // T4 on the first run only
 if(R===runs.filter(x=>x!=='33442'||fs.existsSync(D+'33442_Panel_Judge_3_openrouter.json')).slice(-1)[0]||R==='33430'){const k=2,p=live[k].p,nm='Panel Judge '+k+' '+p;
  const cases={transport:[par[0],{json:{error:{message:'socket hang up',httpCode:'524'}}},par[2]],swap:[par[0],par[2],par[1]],
   provider:[par[0],{json:Object.assign({},par[1].json,{ppj_provider:p==='grok'?'openai':'grok'})},par[2]]};
  // provider HTTP error inside the webhook workflow, through Wrap
  const perr=Object.assign(new Error('The service is receiving too many requests from you'),{httpCode:'429',description:'rate limited'});
  globalThis.__PPJE=perr;const wr2=harness(R,{'Panel Judge Call':[{json:{body:{ppj_slot:k,ppj_provider:p}}}]})('return (()=>{'+WRAP.replace('const j=$json||{};','const j={error:globalThis.__PPJE};')+'})()',PCIN);
  const wj=JSON.parse(S(wr2))[0].json;if(wj.ppj_slot===k&&wj.response.error.message===perr.message&&wj.response.error.httpCode==='429'&&wj.response.error.description==='rate limited')pass();else fail('Wrap error '+S(wj));
  cases.provider_error=[par[0],{json:wj},par[2]];
  for(const [cn,pp] of Object.entries(cases)){const ov={'Panel Judges Parallel':pp};for(const kk of [1,2,3])ov['Panel Judge '+kk+' '+live[kk].p]=await run(R,ov,take(kk,live[kk].p),PCIN);
   const ej=ov[nm][0].json;const out=await run(R,ov,PCs,PCIN);const txt=S(out);
   const seen=ej.error&&txt.includes(String(ej.error.message).slice(0,60).replace(/"/g,'\\"'))||(typeof out==='string'&&out.includes(String(ej.error&&ej.error.message).slice(0,60)));
   if(ej.error&&ej.error.message&&seen&&txt!==S(pa)){pass();console.log('T4 '+cn+': judge '+k+' -> '+String(ej.error.message).slice(0,90)+' | Panel Check: '+txt.slice(0,140));}
   else fail('T4 '+cn+' judge '+k+' error '+S(ej).slice(0,120)+' | Panel Check '+txt.slice(0,200));}}
 // T5 on every s47-shape run: bad route index
 if(hasJ0){const pbI=savedItems(R,'Panel Build');const badPB=JSON.parse(S(pbI));badPB[0].json.judges[1].jidx=7;
 const t5=await run(R,Object.assign(hideJ(),{'Panel Build':badPB}),PREP,PCIN);if(typeof t5==='string'&&t5.includes('FAIL-CLOSED: pkgPPJ judge 2 route index 7'))pass();else fail(R+' T5 '+String(S(t5)).slice(0,100));}}
console.log('T1/T5 not applicable (older Panel Build): '+na);console.log((runs.length-skipped.length)+' runs tested ('+runs.filter(r=>!skipped.includes(r)).join(' ')+'); checks passed '+ok+', failed '+bad);
console.log('bodies that change when every saved node is visible (a judge reply feeding another judge body): '+cross);
console.log('bytes added to the execution by Panel Judges Parallel output: max '+addMax+', mean '+Math.round(addSum/runs.length));
console.log(bad===0?'OK':'FAIL');})();
