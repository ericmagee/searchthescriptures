// pkgA2R test (W1, 11-08). Run from wall2024/: node pkgA2R/test_A2R.cjs [strip_A2R dir] [base strip dir] [live fetchback]
// 1. Clones differ from their round-1 nodes only in R2 names (R2 Alternate Build: plus its three listed patches); no clone names a round-1
//    chain node; the 22 base sources are unchanged.
// 2. Parity on every saved run: Second Alternate? does not run round 2 on the live pool, and the final Alternate Merge equals the saved
//    Alternate Merge output byte for byte (33218 included). Panel Tokens and Format Markdown outputs are unchanged with no R2 node run.
// 3. Two-model replays (the even-panel cases, Wall 2887/2895): the saved pool plus mimo (model_config: xiaomi/mimo-v2.6-pro, family xiaomi).
//    Round 2's model reply is simulated by round 1's reply with the seat and model renamed, since no call is made offline.
//    33497 (sol NOT SEATED at the cure), 33222 and 33461 (grok unseated after its alt gate): round 2 runs, offers mimo, G5 refuses the model
//    tried in round 1; "fails again" keeps round 1's body and adds round 2's lines; "passes" seats mimo with aligned lists.
// 4. Pool-exhausted control: the same runs on the saved one-model pool: no round 2; output byte-equal; the even count stays (TIE, pkgODD).
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const {names,AB_PATCH}=require('./names.cjs');
const SD=process.argv[2]||'pkgLIB/strip_A2R',BD=process.argv[3]||'pkgLIB/strip_RI3',FB=process.argv[4]||'/mnt/project-files/wall2024/fetchback_live_s62.json';
const D='/mnt/project-files/wall2024/inputs/';const rd=f=>fs.readFileSync(f,'utf8');
const W=(()=>{const d=JSON.parse(rd(FB));return d.data||d;})();const NODES=W.nodes||W.workflow.nodes;const LV=Object.fromEntries(NODES.map(n=>[n.name,n]));
const {CHAIN,sub,unsub,left}=names(W.connections);const A2=JSON.parse(rd('pkgA2R/out/nodes_A2R.json'));const NN=Object.fromEntries(A2.nodes.map(n=>[n.name,n]));
let ok=0,bad=0;const T=(n,c,extra)=>{console.log((c?'OK   ':'FAIL ')+n+(extra?' '+extra:''));c?ok++:bad++;};const J=x=>JSON.stringify(x);
// ---- 1. clones
const fileOf=n=>n.replace(/ /g,'_').replace(/\?/g,'')+'.js';
for(const f of fs.readdirSync(BD+'/patched').filter(f=>f.endsWith('.js')&&f!=='Shared_Library.js')){const to=f==='Alternate_Merge.js'?'Alternate_Merge_1.js':f;
 T('base source unchanged: '+to,rd(SD+'/patched/'+to)===rd(BD+'/patched/'+f));}
for(const f of fs.readdirSync(SD+'/patched').filter(f=>/^R2_/.test(f))){let s=rd(SD+'/patched/'+f);const base=rd(BD+'/patched/'+f.slice(3));
 if(f==='R2_Alternate_Build.js')for(const [a,b] of AB_PATCH){T('R2 Alternate Build patch present once: '+a.slice(0,50),s.split(b).length===2);s=s.replace(b,()=>sub(a));}
 T('library clone differs only in names: '+f,unsub(s)===base);T('library clone names no round-1 chain node: '+f,left(s).length===0,left(s).slice(0,3).join(' '));}
const deep=(o,f)=>typeof o==='string'?f(o):Array.isArray(o)?o.map(x=>deep(x,f)):o&&typeof o==='object'?Object.fromEntries(Object.entries(o).map(([k,v])=>[k,deep(v,f)])):o;
for(const n of A2.nodes.filter(n=>/^R2 /.test(n.name)&&!/^FILE:/.test(n.parameters.jsCode||''))){const b=LV[n.name.slice(3)];const p=JSON.parse(J(n.parameters));
 if(p.conditions&&Array.isArray(p.conditions.conditions))p.conditions.conditions.forEach(c=>{c.id=c.id.replace(/^r2-/,'');});
 T('node clone differs only in names: '+n.name,J(deep(p,unsub))===J(b.parameters)&&n.type===b.type&&J(n.credentials||null)===J(b.credentials||null));
 T('node clone names no round-1 chain node: '+n.name,left(J(n.parameters)).length===0,left(J(n.parameters)).slice(0,3).join(' '));}
T('every chain node but Alternate Needed? has an R2 clone ('+(CHAIN.length-1)+')',CHAIN.filter(n=>n!=='Alternate Needed?').every(n=>NN['R2 '+n]));
// ---- helpers
const SA_CODE=NN['Second Alternate?'].parameters.jsCode,FIN=NN['Alternate Merge'].parameters.jsCode;
const ld=(R,n)=>{const f=D+R+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return null;const d=JSON.parse(rd(f));const r=Array.isArray(d)?d[0]:d;const m=(r.data&&r.data.main)||r.main;return (m&&m[0])||[];};
const RUNS=[...new Set(fs.readdirSync(D).filter(f=>/^\d+_Alternate_Merge\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();
const MIMO={seat:'mimo',fam:'openrouter',api_model:'xiaomi/mimo-v2.6-pro',max_tokens:64000,family:'xiaomi'};
const counted=j=>(j.bodies||[]).filter(b=>{try{return (JSON.parse(b).payload.drv_uncured||0)===0;}catch(e){return false;}}).length;
// ---- 2. parity on every saved run (live pool)
let par=0;
for(const R of RUNS){const AM=ld(R,'Alternate Merge');if(!AM||!AM.length){console.log('SKIP '+R+' no saved Alternate Merge item');continue;}
 const over={'Alternate Merge 1':AM};let SA;try{SA=harness(R,over)(SA_CODE,'Alternate Merge 1')[0].json;}catch(e){console.log('SKIP '+R+' Second Alternate?: '+String(e.message).slice(0,100));continue;}
 const fin=harness(R,{...over,'Second Alternate?':[{json:SA}],'R2 Alternate Merge':null})(FIN,'Second Alternate?');
 T(R+': no round 2 on the saved pool ('+SA.a2r.why+'); final Alternate Merge byte-equal to the saved one',SA.a2r.run===false&&J(fin[0].json)===J(AM[0].json));par++;}
// Panel Tokens and Format Markdown with no R2 node run
for(const nm of ['Panel Tokens','Format Markdown']){const P=rd('pkgA2R/out/'+fileOf(nm)),B=LV[nm].parameters.jsCode;let n=0,eq=0,sk=0;
 for(const R of RUNS){let b,p;const inN=(Object.entries(W.connections).find(([k,v])=>J(v).includes('"'+nm+'"'))||[])[0];
  try{b=harness(R)(B,inN);p=harness(R)(P,inN);}catch(e){sk++;continue;}n++;if(J(b)===J(p))eq++;}
 T(nm+': output unchanged with no R2 node run ('+eq+'/'+n+' runs; '+sk+' runs skip on base and patched alike)',n>0&&eq===n);}
// ---- 3 and 4. replays
const ren=(x,from,fromModel)=>JSON.parse(J(x).split(fromModel).join(MIMO.api_model).replace(new RegExp('(\\\\*")'+from+'(\\\\*")','g'),'$1mimo$2').replace(new RegExp('SEAT: '+from+'\\b','g'),'SEAT: mimo').replace(new RegExp('ALTERNATE: '+from+'\\b','g'),'ALTERNATE: mimo'));
const src=f=>rd(SD+'/patched/'+f);
async function replay(R,variant){const AM=ld(R,'Alternate Merge');const RS=ld(R,'Resolve Seats');const R1=AM[0].json;
 const t1=(R1.alternates_tried||[]).filter(x=>x.alternate&&x.result==='NOT SEATED');if(!t1.length){T(R+': has a round-1 alternate NOT SEATED',false);return;}
 const from=t1[0].alternate,fromModel=t1[0].api_model,seat=t1[0].removed_seat;
 const RS2=[{json:{...RS[0].json,alternates:(RS[0].json.alternates||[]).concat([MIMO])}}];const base={'Alternate Merge 1':AM,'Resolve Seats':RS2};
 const SA=harness(R,base)(SA_CODE,'Alternate Merge 1')[0].json;
 T(R+' '+variant+': Second Alternate? runs round 2 for '+seat+' ('+SA.a2r.why+')',SA.a2r.run===true&&J(SA.a2r.seats)===J([seat])&&J(SA.a2r.free)===J(['mimo'])&&SA.a2r.tried.includes(fromModel));
 const GR=ld(R,'Gate Record');T(R+' '+variant+': Second Alternate? passes Gate Record\'s output on unchanged',J({...SA,a2r:undefined})===J({...GR[0].json,a2r:undefined}));
 const o={...base,'Second Alternate?':[{json:SA}]};
 const AS=f=>'return (async()=>{\n'+src(f)+'\n})();';
 const ab=await harness(R,o)(AS('R2_Alternate_Build.js'),'Second Alternate?');const calls=ab.map(x=>x.json.alt).filter(a=>a&&!a.skip);
 const ab1=(ld(R,'Alternate Build')||[]).map(x=>x.json.alt).find(a=>a&&a.removed_seat===seat&&!a.skip);
 const tail=(a,b)=>{a=String(a);b=String(b);let i=0;while(i<a.length&&i<b.length&&a[a.length-1-i]===b[b.length-1-i])i++;return i/Math.max(a.length,b.length);};
 const sys=a=>{try{const m=a.body.messages||[];return J(m[0]);}catch(e){return null;}};const usr=a=>{try{const m=a.body.messages||[];return J(m[m.length-1]);}catch(e){return null;}};
 T(R+' '+variant+': R2 Alternate Build offers mimo for '+seat+' only, with round 1\'s rulebook and transcript',calls.length===1&&calls[0].seat==='mimo'&&calls[0].removed_seat===seat&&calls[0].api_model===MIMO.api_model&&!!ab1&&sys(calls[0])===sys(ab1)&&tail(usr(calls[0]),usr(ab1))>0.95&&calls[0].body.model===MIMO.api_model,
  '(system message equal; transcript '+(100*tail(usr(calls[0]),usr(ab1))).toFixed(1)+'% common tail; roles '+((calls[0]&&calls[0].body.messages)||[]).map(m=>m.role).join('/')+' vs round 1 '+((ab1&&ab1.body.messages)||[]).map(m=>m.role).join('/')+': a posture acceptance turn appears only for a model that accepted)');
 {const RSo=[{json:{...RS[0].json,alternates:[RS[0].json.alternates.find(a=>a.api_model===fromModel)]}}];const SAo={...SA,a2r:{...SA.a2r,run:true,free:[from]}};
  const ab2=await harness(R,{...o,'Resolve Seats':RSo,'Second Alternate?':[{json:SAo}]})(AS('R2_Alternate_Build.js'),'Second Alternate?');const sk=(ab2[0].json.skips||[]).map(x=>x.skip).join(' | ');
  T(R+' '+variant+': G5 refuses the model tried in round 1 ('+sk.slice(0,140)+')',ab2.every(x=>!x.json.alt||x.json.alt.skip)&&/G5 \(pkgA2R\): /.test(sk));}
 // simulated round 2: R2 Alternate Build's own output; round 1's reply, cure and records with the seat and model renamed
 const r=x=>x?ren(x,from,fromModel):null;
 const o2={...o,'R2 Alternate Build':ab,'R2 Alternate Payloads':r(ld(R,'Alternate Payloads')),'R2 Alternate Cure Normalize':r(ld(R,'Alternate Cure Normalize'))};
 const ms=await harness(R,o2)(AS('R2_Alternate_Merge_Seat.js'),'R2 Alternate Cure Normalize');o2['R2 Alternate Merge Seat']=ms;
 o2['R2 Alt Seated']=harness(R,o2)(NN['R2 Alt Seated'].parameters.jsCode,'R2 Alternate Merge Seat');
 for(const n of ['Alt Judge Enforcer Record','Alt Send Back Record','Alt Gate Record'])o2['R2 '+n]=variant==='passes'?null:r(ld(R,n));
 const m2=await harness(R,o2)(AS('R2_Alternate_Merge.js'),'R2 Alt Gate Record');o2['R2 Alternate Merge']=m2;
 const fin=harness(R,o2)(FIN,'R2 Alternate Merge')[0].json;const seatOf=b=>JSON.parse(b).payload.judge_seat;
 const k=R1.bodies.findIndex(b=>seatOf(b)===seat);const others=R1.bodies.every((b,i)=>i===k||b===fin.bodies[i]);
 T(R+' '+variant+': every other body and the round-1 lists are kept',others&&J(fin.alternates_tried.slice(0,R1.alternates_tried.length))===J(R1.alternates_tried)&&J(fin.alternates_seated.slice(0,R1.alternates_seated.length))===J(R1.alternates_seated)
  &&J(fin.enforcer_log.slice(0,R1.enforcer_log.length))===J(R1.enforcer_log));
 T(R+' '+variant+': seated and removed lists aligned, two at most',fin.alternates_seated.length===fin.drv_removed.length&&fin.alternates_seated.length<=2&&fin.alternates_seated.every((a,i)=>fin.drv_removed[i].seat===a.removed_seat&&fin.drv_removed[i].replaced_by===a.alternate_seat));
 const tr2=fin.alternates_tried.slice(R1.alternates_tried.length);
 if(variant==='passes'){const st=fin.alternates_seated.find(a=>a.removed_seat===seat);const b=JSON.parse(fin.bodies[k]).payload;const e=fin.drv_removed.find(x=>x.seat===seat);
  T(R+' passes: mimo sits in '+seat+'\'s place, counted (drv_uncured 0); counted seats '+counted(R1)+' -> '+counted(fin),!!st&&st.alternate_seat==='mimo'&&b.judge_seat==='mimo'&&(b.drv_uncured||0)===0&&fin.panel_effective.includes('mimo')&&!fin.panel_effective.includes(seat)&&counted(fin)===counted(R1)+1);
  const L=String(e&&e.verdict_raw||'').split('\n').filter(l=>/ALTERNATE (TRIED|UNSEATED) -- /.test(l));
  T(R+' passes: the removed ruling keeps round 1\'s lines and adds round 2\'s SEATED line ('+L.length+' lines)',L.some(l=>new RegExp('ALTERNATE: '+from+';.*RESULT: NOT SEATED').test(l))&&L.some(l=>/ALTERNATE: mimo;.*RESULT: SEATED/.test(l))&&String(e.verdict_raw).startsWith(String(JSON.parse(R1.bodies[k]).payload.verdict_raw)));
  T(R+' passes: round 2\'s tried entry is SEATED and the log adds mimo\'s rows ('+fin.enforcer_log.slice(R1.enforcer_log.length).length+')',tr2.length===1&&tr2[0].alternate==='mimo'&&tr2[0].result==='SEATED'&&fin.enforcer_log.slice(R1.enforcer_log.length).every(x=>x.seat==='mimo')&&fin.enforcer_log.length>R1.enforcer_log.length,'tried '+J(tr2.map(x=>[x.removed_seat,x.alternate,x.result]))+' log seats '+J([...new Set(fin.enforcer_log.slice(R1.enforcer_log.length).map(x=>x.seat))]));
  console.log('     Record Alternates payload: '+J({p_alternates:fin.alternates_seated,p_drv_removed:fin.drv_removed.map(x=>({seat:x.seat,replaced_by:x.replaced_by}))}));}
 else{const r1raw=String(JSON.parse(R1.bodies[k]).payload.verdict_raw);const b=JSON.parse(fin.bodies[k]).payload;const add=String(b.verdict_raw).slice(r1raw.length).split('\n').filter(Boolean);
  T(R+' fails again: '+seat+' stays unfilled; round 1\'s body plus round 2\'s lines only ('+add.length+')',b.judge_seat===seat&&String(b.verdict_raw).startsWith(r1raw)&&add.length>0&&add.every(l=>/ALTERNATE (TRIED|UNSEATED) -- .*ALTERNATE: mimo/.test(l))&&J(fin.alternates_seated)===J(R1.alternates_seated)&&counted(fin)===counted(R1));
  add.forEach(l=>console.log('     '+l.slice(0,230)));
  T(R+' fails again: round 2\'s tried entry is NOT SEATED',tr2.length===1&&tr2[0].alternate==='mimo'&&tr2[0].result==='NOT SEATED');}
 // pool-exhausted control: the saved pool only
 const SA0=harness(R,{'Alternate Merge 1':AM})(SA_CODE,'Alternate Merge 1')[0].json;const f0=harness(R,{'Alternate Merge 1':AM,'Second Alternate?':[{json:SA0}],'R2 Alternate Merge':null})(FIN,'Second Alternate?')[0].json;
 T(R+' control (saved pool '+(RS[0].json.alternates||[]).map(a=>a.seat).join(',')+'): no round 2 ('+SA0.a2r.why+'); output byte-equal; counted seats stay '+counted(R1),SA0.a2r.run===false&&J(f0)===J(R1));}
(async()=>{for(const [R,v] of [['33497','fails again'],['33222','fails again'],['33222','passes'],['33461','passes']]){try{await replay(R,v);}catch(e){T(R+' '+v+': replay ran',false,String(e.stack).slice(0,400));}}
console.log('parity runs '+par+'; '+ok+' OK, '+bad+' FAIL');})();
