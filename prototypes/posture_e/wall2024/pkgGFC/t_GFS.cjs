// W3 pkgGFC tests T1 to T7 (builder's own tests; graders W1 and W2 plant their own). Offline, stored replies of execution 34626.
const chain=require('../pkgKSR/w3_grade/chain.cjs');const rd=chain.rd;const cl=x=>JSON.parse(JSON.stringify(x));
const LIVE='/mnt/project-files/wall2024/fetchback_live_s110.json',GFC=__dirname+'/parent_s110_GFS.json';
const T0=rd['Gate Call openrouter'][0].data.main[0][0].json.choices[0].message.content;
const RX=/(GATE: G5 \|\| CHANGE TO: )([\s\S]*?); (FORCED: [\s\S]*?) \|\| ([\s\S]*)$/;const M=RX.exec(T0);if(!M)throw new Error('G5 not found');
const pre=T0.slice(0,M.index)+M[1],COL=M[2],FOR=M[3],WHY=M[4];
async function go(wf,text){const r=await chain(wf,{after:{'Gate Call openrouter':async over=>{if(text==null)return;const c=cl(rd['Gate Call openrouter'][0].data.main[0]);c[0].json.choices[0].message.content=text;over['Gate Call openrouter']=[c];}}});
 const g=(r.over['Gate Record']||r.stored('Gate Record'))[0][0].json;const row=s=>r.rows.find(w=>w.judge_seat===s);
 return {seats:JSON.stringify(g.gate.seats),g5:g.gate_rows.filter(x=>/G5|NEW RULE/.test(x.item)).map(x=>x.item+' | '+x.cure_status),gr:JSON.stringify(g.gate_rows.filter(x=>!/G5|NEW RULE/.test(x.item))),luna:row('luna'),terra:JSON.stringify(row('terra')),sol:JSON.stringify(row('sol')),rows:JSON.stringify(r.rows),du:row('luna').drv_uncured};}
const diffKeys=(a,b)=>Object.keys(a).filter(k=>JSON.stringify(a[k])!==JSON.stringify(b[k]));
let ok=0,bad=0;const say=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);c?ok++:bad++;};
(async()=>{
 const L0=await go(LIVE,null),G0=await go(GFC,null);
 const reason=pre+COL+' || '+FOR;const LR=await go(LIVE,reason),GR=await go(GFC,reason);
 console.log('LIVE stored: '+L0.seats+' luna drv_uncured '+L0.du+' | '+L0.g5.join(' ; '));
 console.log('GFC  stored: '+G0.seats+' luna drv_uncured '+G0.du+' | '+G0.g5.join(' ; '));
 console.log('LIVE reason-field: '+LR.seats+' luna drv_uncured '+LR.du+' | '+LR.g5.join(' ; '));
 say(/"cured":5,"uncured_counted":0,"fresh":0/.test(G0.seats)&&G0.du===1&&G0.g5.length===1&&/CURED$/.test(G0.g5[0])&&!/UNCURED/.test(G0.g5[0]),'T1 G5 CURED, no new item, gate 5 of 5, luna drv_uncured 1');
 const dk=diffKeys(G0.luna,LR.luna);say(G0.luna.verdict_raw===LR.luna.verdict_raw||dk.length===0,'T1 luna written row vs live reason-field form: differing keys ['+dk.join(',')+']');
 if(dk.length)for(const k of dk){const a=String(G0.luna[k]),b=String(LR.luna[k]);let i=0;while(i<a.length&&a[i]===b[i])i++;console.log('     '+k+' first difference at '+i+': GFC "'+a.slice(Math.max(0,i-80),i+160)+'" LIVE "'+b.slice(Math.max(0,i-80),i+160)+'"');}
 say(GR.rows===LR.rows&&GR.seats===LR.seats,'T2 reason-field form: candidate equals live (all rows)');
 say(G0.terra===L0.terra&&G0.sol===L0.sol,'T7 terra and sol rows unchanged (stored)');
 say(G0.rows===LR.rows,'T1 all written rows equal live with the FORCED line in the reason field');
 say(G0.gr===L0.gr,'T7 luna gate rows G1 to G4 unchanged (stored)');
 const plants={
  'T3 other pair (FORCED names D4 vs C3)':pre+COL+'; '+FOR.replace('D4 vs C2','D4 vs C3')+' || '+WHY,
  'T4 bad FORCED (quotation not in its round)':pre+COL+'; '+FOR.replace('“The ground is God\'s power, not a husband\'s seed.”','“The defender grants a husband\'s seed here.”').replace('FAILS: “not a husband\'s seed.”','FAILS: “grants a husband\'s seed.”')+' || '+WHY,
  'T5a separator " / "':pre+COL+' / '+FOR+' || '+WHY,
  'T5b separator " -- "':pre+COL+' -- '+FOR+' || '+WHY,
  'T5c separator ". " (collision line ends with its own period)':pre+COL.replace(/\.”$/,'.”')+' '+FOR+' || '+WHY,
  'T5d separator " | "':pre+COL+' | '+FOR+' || '+WHY,
  'T5e FORCED (Commitment 4):':pre+COL+'; '+FOR.replace('FORCED:','FORCED (Commitment 4):')+' || '+WHY,
  'T6a CHANGE TO is the FORCED line alone':pre+FOR+' || '+WHY,
  'T6b CHANGE TO is the collision line alone':pre+COL+' || '+WHY,
  'T6c collision line, then the word FORCED in prose, no FORCED line':pre+COL+'; the press is FORCED on the defender || '+WHY,
  'T6e collision line graded UNDERDETERMINED with a FORCED line for the pair':pre+COL.replace('DEFENDER LINK BROKEN','UNDERDETERMINED')+'; '+FOR+' || '+WHY,
  'T6f lower case "forced:"':pre+COL+'; '+FOR.replace('FORCED:','forced:')+' || '+WHY,
  'T6d two FORCED lines for the pair':pre+COL+'; '+FOR+'; '+FOR+' || '+WHY,
 };
 // reference for T4: the same bad line in the reason field on live
 const badF=FOR.replace('“The ground is God\'s power, not a husband\'s seed.”','“The defender grants a husband\'s seed here.”').replace('FAILS: “not a husband\'s seed.”','FAILS: “grants a husband\'s seed.”');
 const LB=await go(LIVE,pre+COL+' || '+badF);console.log('LIVE bad FORCED in the reason field: '+LB.seats+' drv '+LB.du+' | '+LB.g5.join(' ; '));
 for(const k in plants){const l=await go(LIVE,plants[k]),g=await go(GFC,plants[k]);
  console.log(k+'\n     LIVE '+l.seats+' drv '+l.du+' | '+l.g5.join(' ; ')+'\n     GFC  '+g.seats+' drv '+g.du+' | '+g.g5.join(' ; ')+'\n     rows equal live: '+(l.rows===g.rows)+'; terra, sol equal: '+(g.terra===L0.terra&&g.sol===L0.sol)+'; G1 to G4 equal to live for the same reply: '+(g.gr===l.gr)+'; all rows equal live with the FORCED line in the reason field: '+(g.rows===LR.rows)+(k.startsWith('T4')?'; equals live with that bad line in the reason field (seats, drv): '+(g.seats===LB.seats&&g.du===LB.du):''));}
 console.log('\n'+ok+' OK, '+bad+' FAIL (plants T3 to T6 are read by hand below)');
})().catch(e=>console.log('ERROR '+e.stack));
