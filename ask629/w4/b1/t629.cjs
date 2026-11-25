// ASK 629 tests (W4). node t629.cjs base_eng.json target_engine_629.json fxdir
const fs=require('fs'),path=require('path');
const [,,BF,TF,FX]=process.argv;
const B=JSON.parse(fs.readFileSync(BF,'utf8')),T=JSON.parse(fs.readFileSync(TF,'utf8'));
const lib=require('/mnt/project-files/standing/lib.cjs');
let fail=0,pass=0;const ok=(c,m)=>{if(c){pass++;console.log('PASS '+m);}else{fail++;console.log('FAIL '+m);}};
const code=(W,n)=>W.nodes.find(x=>x.name===n).parameters.jsCode;
const mk=(rd,W,over)=>{over=over||{};return n=>{const items=(over[n]||rd[n]||null);if(n==='Shared Library')return {params:W.nodes.find(x=>x.name==='Shared Library').parameters,isExecuted:true};
  if(!items)return {isExecuted:false,first:()=>{throw new Error('node '+n+' did not run');},all:()=>{throw new Error('node '+n+' did not run');}};
  return {isExecuted:true,first:()=>({json:items[0]}),all:()=>items.map(j=>({json:j})),item:{json:items[0]}};};};
const run=async(W,n,rd,inputNode,over,exid)=>{const $=mk(rd,W,over);const inp=(over&&over[inputNode])||rd[inputNode]||[];
  const $input={first:()=>({json:inp[0]}),all:()=>inp.map(j=>({json:j}))};const $execution={id:exid||'0',customData:{set(){}}};
  const f=new Function('$','$input','$execution','return (async()=>{\n'+code(W,n)+'\n})();');return f($,$input,$execution);};
const strip=o=>{const x=JSON.parse(JSON.stringify(o));for(const i of x){delete i.json.run_token;delete i.json.t0;delete i.json.sd;}return x;};
(async()=>{
// ---- A: Init Seats, old against new, on every stored run with a judge order read
const files=fs.readdirSync(FX).filter(f=>/^is_\d+\.json$/.test(f)).sort();
for(const f of files){const X=JSON.parse(fs.readFileSync(path.join(FX,f),'utf8'));const rd=X.rd;
  if(!rd['Judge Order Read']){ok(true,'A '+X.id+': no Judge Order Read stored (run before ASK 591); not replayable, skipped');continue;}
  let o,n,eo=null,en=null;try{o=await run(B,'Init Seats',rd,'Accept Final',null,X.id);}catch(e){eo=e.message;}try{n=await run(T,'Init Seats',rd,'Accept Final',null,X.id);}catch(e){en=e.message;}
  if(eo||en){ok(String(eo).replace(/run_token=\S+/,'')===String(en).replace(/run_token=\S+/,''),'A '+X.id+': both refuse alike ('+String(eo).slice(0,90)+')');continue;}
  const so=strip(o),sn=strip(n);const live=rd['Init Seats'][0];
  const pf=o[0].json;const jm=new Set(pf.jfl_moved||[]);
  const same=JSON.stringify(so)===JSON.stringify(sn);
  const oldMatchesLive=o[0].json.panel_reserve===live.panel_reserve&&JSON.stringify(o[0].json.alt_order)===JSON.stringify(live.alt_order)&&JSON.stringify(o[0].json.panel_order)===JSON.stringify(live.panel_order);
  ok(oldMatchesLive,'A '+X.id+': the base code reproduces the stored Init Seats (panel '+o[0].json.panel_order.join(',')+'; reserve '+o[0].json.panel_reserve+'; alt_order '+(o[0].json.alt_order||[]).join(',')+')');
  if(o[0].json.panel_reserve!==null){ok(same,'A '+X.id+': pfree[3] eligible ('+o[0].json.panel_reserve+'): new output byte-equal to old');}
  else{const d=Object.keys(sn[0].json).filter(k=>JSON.stringify(sn[0].json[k])!==JSON.stringify(so[0].json[k]));
    ok(d.length<=1&&(d.length===0||d[0]==='panel_reserve'),'A '+X.id+': old reserve null; new reserve '+n[0].json.panel_reserve+'; fields changed: ['+d.join(',')+'] (only panel_reserve may change); alt_order unchanged '+JSON.stringify(n[0].json.alt_order));
    if(n[0].json.panel_reserve)ok(!jm.has(n[0].json.panel_reserve)&&['qwen'].indexOf(n[0].json.panel_reserve)<0&&n[0].json.panel_order.indexOf(n[0].json.panel_reserve)<0,'A '+X.id+': the new reserve '+n[0].json.panel_reserve+' is not JFL-moved, not time-removed and not on the panel');}}
// ---- A2: constructed cases where pfree[3] is eligible (no stored run since ASK 591 has one): the 42517 inputs with every jfl_move cleared, and with only argon's cleared
{const X=JSON.parse(fs.readFileSync(path.join(FX,'is_42517.json'),'utf8')).rd;
 {const AM=X['Accept Models'].map(x=>x&&x.seat&&['argon','sonnet','neon'].includes(x.seat)?{...x,jfl_move:true}:x);const rd={...X,'Accept Models':AM};const n=await run(T,'Init Seats',rd,'Accept Final',null,'c');ok(n[0].json.panel_reserve===null,'A2 every seat after the panel JFL-moved: the new reserve is null, as before ('+n[0].json.panel_reserve+')');}
 for(const [lab,f] of [['no seat JFL-moved',x=>false],['argon not JFL-moved',x=>x.seat==='argon'?false:x.jfl_move]]){
  const AM=X['Accept Models'].map(x=>x&&x.seat?{...x,jfl_move:f(x)}:x);const rd={...X,'Accept Models':AM};
  const o=await run(B,'Init Seats',rd,'Accept Final',null,'c'),n=await run(T,'Init Seats',rd,'Accept Final',null,'c');
  ok(o[0].json.panel_reserve!==null&&JSON.stringify(strip(o))===JSON.stringify(strip(n)),'A2 '+lab+': pfree[3] '+o[0].json.panel_reserve+' is eligible; new output byte-equal to old (reserve '+n[0].json.panel_reserve+')');}}
// ---- 42517 replay: Init Seats, Resolve Seats, Panel Check
const R=JSON.parse(fs.readFileSync(path.join(FX,'r42517.json'),'utf8')).rd;
const iO=await run(B,'Init Seats',R,'Accept Final',null,'42517'),iN=await run(T,'Init Seats',R,'Accept Final',null,'42517');
ok(iO[0].json.panel_reserve===null&&iN[0].json.panel_reserve==='sonnet','C 42517 Init Seats: reserve old '+iO[0].json.panel_reserve+', new '+iN[0].json.panel_reserve+' (argon, pfree[3], is JFL-moved: '+(iN[0].json.jfl_moved||[]).includes('argon')+')');
const inRS=R['Fetch Models']?'Fetch Models':null;
const rsO=await run(B,'Resolve Seats',R,inRS,{'Init Seats':[iO[0].json]},'42517');
const rsN=await run(T,'Resolve Seats',R,inRS,{'Init Seats':[iN[0].json]},'42517');
ok(JSON.stringify(rsO[0].json.reserve)===JSON.stringify(R['Resolve Seats'][0].reserve)&&JSON.stringify(rsO[0].json.alternates)===JSON.stringify(R['Resolve Seats'][0].alternates),'C 42517 Resolve Seats (base, old Init Seats) reproduces the stored reserve (null) and alternates');
ok(rsN[0].json.reserve&&rsN[0].json.reserve.seat==='sonnet'&&rsN[0].json.reserve.api_model==='anthropic/claude-sonnet-5.5','C 42517 Resolve Seats (new Init Seats): reserve '+JSON.stringify(rsN[0].json.reserve));
ok(JSON.stringify(rsN[0].json.alternates.map(a=>a.seat))===JSON.stringify(['argon','sonnet','neon']),'C 42517 Resolve Seats: alternates unchanged ['+rsN[0].json.alternates.map(a=>a.seat).join(', ')+'] (sonnet stays in the pool as live keeps the reserve there)');
let pcO=null,eO=null;try{pcO=await run(B,'Panel Check',R,'Panel Judge 3 openrouter',{'Init Seats':[iO[0].json],'Resolve Seats':[rsO[0].json]},'42517');}catch(e){eO=e.message;}
ok(eO&&/envelope this parser does not recognise/.test(eO)&&/\[no reserve seat is free\]/.test(eO),'C 42517 Panel Check (live): throws as stored: '+String(eO).slice(0,200));
let pcN=null,eN=null;try{pcN=await run(T,'Panel Check',R,'Panel Judge 3 openrouter',{'Init Seats':[iN[0].json],'Resolve Seats':[rsN[0].json]},'42517');}catch(e){eN=e.message;}
ok(!eN&&pcN&&pcN[0].json.sub&&pcN[0].json.sub.failed_seat==='hydrogen'&&pcN[0].json.sub.substitute==='sonnet'&&pcN[0].json.sub.slot===2,'C 42517 Panel Check (new): one substitution, no throw: '+JSON.stringify(pcN&&pcN[0].json.sub&&{slot:pcN[0].json.sub.slot,failed_seat:pcN[0].json.sub.failed_seat,substitute:pcN[0].json.sub.substitute,failure_kind:pcN[0].json.sub.failure_kind,reason:pcN[0].json.sub.reason})+(eN?' ERR '+eN:''));
const EXP='returned no text: finish_reason length; output tokens 65,536 (reasoning 65,533); prompt tokens 75,848. NO ROW IS WRITTEN.';
ok(pcN&&String(pcN[0].json.sub.detail).includes(EXP.replace(' NO ROW IS WRITTEN.','')),'B 42517 failure detail (new): '+(pcN&&pcN[0].json.sub.detail));
let eB=null;try{await run(T,'Panel Check',R,'Panel Judge 3 openrouter',{'Init Seats':[iO[0].json],'Resolve Seats':[rsO[0].json]},'42517');}catch(e){eB=e.message;}
ok(eB&&eB.includes('seat "hydrogen" '+EXP)&&/\[no reserve seat is free\]/.test(eB),'B 42517 with no reserve (new Panel Check): '+String(eB).replace(/ run_token=\S+/g,'').slice(0,260));
// ---- B: envelope() on every other form, old against new
const envOf=W=>{const c=code(W,'Panel Check');const a=c.indexOf('function envelope(');const b=c.indexOf('function repairReasoning(');return new Function('RT',c.slice(a,b)+'\nreturn envelope;')(' run_token=X');};
const eo=envOf(B),en=envOf(T);const tryE=(f,s,j)=>{try{return JSON.stringify(f(s,j));}catch(e){return 'THROW '+e.message;}};
const CASES={string:{choices:[{message:{content:'{"a":1}'},finish_reason:'stop'}]},empty_string:{choices:[{message:{content:''},finish_reason:'stop'}]},gemini:{candidates:[{content:{parts:[{text:'{"x":1}'}]},finishReason:'STOP'}]},gemini_thought_only:{candidates:[{content:{parts:[{thought:true,text:'t'}]}}]},error:{error:{message:'boom'}},unknown:{foo:1},empty:{},no_message:{choices:[{finish_reason:'stop'}]},nulljson:null};
for(const [k,j] of Object.entries(CASES)){const a=tryE(eo,'s',j),b=tryE(en,'s',j);ok(a===b,'B envelope '+k+': byte-equal ('+a.slice(0,80)+')');}
{const j={choices:[{message:{content:null},finish_reason:'length'}],usage:{prompt_tokens:75848,completion_tokens:65536,completion_tokens_details:{reasoning_tokens:65533}}};ok(/^THROW FAIL-CLOSED: seat "s" returned no text: finish_reason length; output tokens 65,536 \(reasoning 65,533\); prompt tokens 75,848\. NO ROW IS WRITTEN\. run_token=X$/.test(tryE(en,'s',j)),'B content null with usage: '+tryE(en,'s',j));
 const j2={choices:[{message:{content:null}}]};ok(tryE(en,'s',j2)==='THROW FAIL-CLOSED: seat "s" returned no text: finish_reason not given; output tokens not given (reasoning not given); prompt tokens not given. NO ROW IS WRITTEN. run_token=X','B content null, no usage, no finish: '+tryE(en,'s',j2));}
// ---- R1: the alternate pool guard (LIB 3289-3293) on the 42517 replay
{const L=lib.cut(lib.load(TF)).L;const src=L.slice(3289,3294).join('\n');const mkWhy=new Function('deb','p','pay','used','QA',src+'\nreturn why;');
 const deb=rsN[0].json.debaters;const son=rsN[0].json.alternates.find(a=>a.seat==='sonnet');
 const P=R['Panel Build'][0];const panelPay=P.judges.map(j=>({judge_seat:j.seat,judge_api_model:j.api_model}));
 const after=panelPay.map(q=>q.judge_seat==='hydrogen'?{judge_seat:'sonnet',judge_api_model:son.api_model}:q);
 const w1=mkWhy(deb,after[0],after,[],null)(son);ok(/^G3: /.test(String(w1)),'R1 reserve that substituted: sonnet is refused as an alternate: '+w1);
 const w2=mkWhy(deb,panelPay[0],panelPay,[],null)(son);ok(w2===null,'R1 reserve not used: sonnet is still offered as an alternate (guard result '+w2+')');}
console.log(fail?'RESULT: '+fail+' FAIL, '+pass+' PASS':'RESULT: ALL PASS ('+pass+')');process.exit(fail?1:0);
})().catch(e=>{console.log('HARNESS ERROR '+e.stack);process.exit(2);});
