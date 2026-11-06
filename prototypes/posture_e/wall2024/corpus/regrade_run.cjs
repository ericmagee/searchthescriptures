// Dry regrade of one run's panel cure stage (W3 11-06, outside feedback 2: prove the fixes by replay over stored transcripts, never a live fight).
// Usage (from wall2024/): node corpus/regrade_run.cjs <run> <base pkg> <patched pkg>. No n8n, no rows written.
// The K-V items are raised in Panel Payloads (drvVoid on each judge's verdict_raw). Panel Payloads itself cannot be re-run offline (it reads the
// judge HTTP nodes, which are not saved), so its saved output is kept and only the K-V items are recomputed with each package's drvVoid
// (as pkgKVP/test_KVP.cjs does); then Panel Cure Check of the package runs whole on that input. The judges' own texts are fixed (no LLM is re-run).
const fs=require('fs');const {load}=require('./replay_node.cjs');const [run,BP,PP]=process.argv.slice(2);const rd=f=>fs.readFileSync(f,'utf8');
const lib=p=>{const src=rd(p+'/patched/Panel_Payloads.js');globalThis.__K=null;try{new Function('$','$input','globalThis.__K={drvVoid,drvPromptText};\n'+src)(()=>({first:()=>({json:{}}),all:()=>[],isExecuted:false,params:{}}),{first:()=>({json:{}}),all:()=>[]});}catch(e){}return globalThis.__K;};
const mock=N=>name=>{const r=N.nodes[name];if(!r)return {isExecuted:false,first:()=>{throw new Error('node not saved: '+name);},all:()=>{throw new Error('node not saved: '+name);}};const it=r[r.length-1]||[];return {isExecuted:true,first:()=>({json:it[0]}),last:()=>({json:it[it.length-1]}),all:()=>it.map(j=>({json:j})),item:{json:it[0]}};};
const PB=JSON.parse(rd('corpus/raw/gate_'+run+'.json'))['Panel Build'].slice(-1)[0][0];
function regrade(pkg){const N=load(run);const K=lib(pkg);const PPo=N.nodes['Panel Payloads'].slice(-1)[0][0];const notes=[];
 for(const s of PPo.summary){const b=PPo.bodies.map(x=>JSON.parse(x).payload).find(p=>p.judge_seat===s.seat);const J=PB.judges.find(q=>q.seat===s.seat);if(!b||!J)continue;
  let t=b.verdict_raw;const i=t.indexOf('\n[AUDIT');if(i>0)t=t.slice(0,i);const kv=K.drvVoid(t,K.drvPromptText(J.body),0,0,'','',null).items||[];
  const old=(s.drv||[]).filter(d=>d.rule==='K-V');const keep=(s.drv||[]).filter(d=>d.rule!=='K-V');const nw=old.filter(d=>kv.some(k=>k.link===d.link)).concat(kv.filter(k=>!old.some(d=>d.link===k.link)).map(k=>Object.assign({rule:'K-V'},k)));
  if(JSON.stringify(nw.map(d=>d.link))!==JSON.stringify(old.map(d=>d.link)))notes.push(s.seat+' K-V ['+old.map(d=>d.link).join(', ')+'] -> ['+nw.map(d=>d.link).join(', ')+']');s.drv=keep.concat(nw);}
 const src=rd(pkg+'/patched/Panel_Cure_Check.js');const O=new Function('$','$input','$json',src)(mock(N),{first:()=>({json:{}}),all:()=>[],item:{json:{}}},{})[0].json;return {O,notes};}
const ES=new Function('return '+rd(PP+'/patched/Panel_Cure_Check.js').match(/const ENF_STATUS=(\{[\s\S]*?\})/)[1])();
const show=(lab,{O,notes})=>{console.log(lab+(notes.length?'  (Panel Payloads K-V recomputed: '+notes.join('; ')+')':'  (K-V items as stored)'));
 for(const s of O.summary){const b=O.bodies.map(x=>JSON.parse(x).payload).find(p=>p.judge_seat===s.seat)||{};const un=(s.cure||[]).filter(c=>c.status==='UNCURED');
  console.log('   '+s.seat.padEnd(8)+' '+String(s.verdict_tag).padEnd(7)+' drv_uncured '+b.drv_uncured+'  LIVE uncured '+un.filter(c=>ES[c.rule]==='LIVE').length+(un.length?'  ['+un.map(c=>c.rule+' '+c.link).join('; ')+']':''));}
 const eff=(O.panel_effective||[]).filter(seat=>{const b=O.bodies.map(x=>JSON.parse(x).payload).find(p=>p.judge_seat===seat);return b&&!(b.drv_uncured>0);});const tags=eff.map(seat=>O.summary.find(s=>s.seat===seat).verdict_tag);const n=t=>tags.filter(x=>x===t).length;
 console.log('   counted seats (drv_uncured 0): '+(eff.join(', ')||'none')+' -> '+tags.join(', ')+(eff.length?'  (BROKEN '+n('BROKEN')+', HELD '+n('HELD')+', PARTIAL '+n('PARTIAL')+')':''));};
const N0=load(run);const st=N0.nodes['Panel Cure Check'].slice(-1)[0][0];show('STORED '+run+' (engine output)',{O:st,notes:[]});
show('BASE '+BP,regrade(BP));show('PATCHED '+PP,regrade(PP));
