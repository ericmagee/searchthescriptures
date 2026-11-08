// test_E4 (W2): on every saved run with an alternate call, replay the E4 path offline with the real node code.
// 1 Early Alternate Build (stub + LIB v24_RMR Shared Library) on Panel Cure Check's saved output.
// 2 The sub-workflow's stored reply is simulated as the run's saved Alternate Call openrouter output (same request => same kind of reply).
// 3 Patched Alternate Build with those rows: every call must match (early_all) when Early Alternate Build covered every removed seat;
//   with no rows its output must equal the unpatched stub's output byte for byte.
// 4 Early Alternate Reply's output fed to Alternate Payloads (v24 rebuilt) must give the same output as the saved call output.
const fs=require('fs');const {harness,D}=require('../pkgGSL/harness.cjs');
const SL=fs.readFileSync('pkgLIB_v26_A2R/patched/Shared_Library.js','utf8');const N=JSON.parse(fs.readFileSync('pkgA2R/e4_on_v26/main_nodes_new.json'));
const P=JSON.parse(fs.readFileSync('pkgA2R/e4_on_v26/main_nodes_patched.json'));const code=n=>(N.find(x=>x.name===n)||P.find(x=>x.name===n)).parameters.jsCode;
const STUB0=fs.readFileSync('pkgLIB_v26_A2R/patched/Alternate_Build.js','utf8');const APAY=fs.readFileSync('pkgLIB/strip_A2R/patched/Alternate_Payloads.js','utf8');
const wrap=c=>'return (async()=>{\n'+c+'\n})();';const ld=(R,n)=>{const f=D+R+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return null;const d=JSON.parse(fs.readFileSync(f));const r=d[0];return ((r.data&&r.data.main)||r.main)[0];};
const SLI=[{json:{}}];let ok=0,bad=0,used=0,notCovered=0;const log=[];const T=(c,m)=>{if(c)ok++;else{bad++;log.push('FAIL '+m);}};
(async()=>{for(const R of fs.readdirSync(D).filter(f=>/^\d+_Alternate_Call_openrouter\.json$/.test(f)).map(f=>f.split('_')[0]).sort()){
 const callOut=ld(R,'Alternate Call openrouter');const an=ld(R,'Alternate Needed?');const pcc=ld(R,'Panel Cure Check');if(!callOut||!an||!pcc||!callOut.length)continue;
 const base={'Shared Library':SLI};const H=o=>{const h=harness(R,{...base,...o});return h;};
 // Shared Library params: patch the harness accessor
 const run=async(c,inp,o)=>{const g=global;const hh=harness(R,{...o});return hh(c.replace("$('Shared Library').params.jsCode","__SLTEXT"),inp);};
 global.__SLTEXT=SL;
 let eab;try{eab=await run(wrap(code('Early Alternate Build').replace(/\$execution\.id/g,'"'+R+'"')),'Panel Cure Check',{});}catch(e){log.push(R+' EAB error '+e.message.slice(0,120));continue;}
 let ab0;try{ab0=await run(wrap(STUB0),'Alternate Needed?',{});}catch(e){log.push(R+' today\'s Alternate Build also fails on the saved inputs: skipped');continue;}const calls0=(ab0||[]).filter(x=>x.json.alt&&!x.json.alt.skip);
 if(!calls0.length)continue;
 // with no stored rows: patched == unpatched
 const abN=await run(wrap(code('Alternate Build')),'Alternate Needed?',{'Get Early Alternate':[{json:{}}]});
 T(JSON.stringify(abN)===JSON.stringify(ab0),R+' no rows: patched Alternate Build equals today');
 // stored rows from the early build, reply = saved call output (index aligned with today's calls by removed seat)
 const rows=(eab||[]).map(x=>{const k=calls0.findIndex(c=>c.json.alt.removed_seat===x.json.early.seat_for);return {seat_for:x.json.early.seat_for,payload_sha:x.json.early.payload_sha,reply:k>=0?callOut[k].json:null,error:null,ms:1};});
 const abE=await run(wrap(code('Alternate Build')),'Alternate Needed?',{'Get Early Alternate':rows.map(r=>({json:r}))});
 const covered=calls0.every(c=>(eab||[]).some(x=>x.json.early.seat_for===c.json.alt.removed_seat));
 const all=abE.filter(x=>x.json.alt&&!x.json.alt.skip).every(x=>x.json.early_all===true);
 if(!covered){notCovered++;T(JSON.stringify(abE)===JSON.stringify(ab0),R+' not every removed seat was a candidate: output equals today');log.push(R+' early not used (a removed seat was not a candidate)');continue;}
 T(all,R+' every call matched a stored reply');if(!all)continue;used++;
 const ear=await run(wrap(code('Early Alternate Reply')),'Alternate Build',{'Alternate Build':abE});
 T(JSON.stringify(ear.map(x=>x.json))===JSON.stringify(callOut.map(x=>x.json)),R+' Early Alternate Reply equals the call output');
 const p0=await run(wrap(APAY),'Alternate Call openrouter',{'Alternate Build':ab0}),p1=await run(wrap(APAY),'Alternate Call openrouter',{'Alternate Build':abE,'Alternate Call openrouter':ear});
 T(JSON.stringify(p0)===JSON.stringify(p1),R+' Alternate Payloads output is identical');log.push(R+' early used: '+calls0.map(c=>c.json.alt.removed_seat+'->'+c.json.alt.seat).join(', '));}
 log.forEach(l=>console.log(l));console.log('used',used,'not covered',notCovered,'| TOTAL',ok,'OK,',bad,'FAIL');})();
