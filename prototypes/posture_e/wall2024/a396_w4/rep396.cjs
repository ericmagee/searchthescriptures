// ASK 396 replay (W2 8203/8220, W1 8217, W3 8218): every stored E-PREM send-back row (CURED and UNCURED) and every E-ANS UNCURED row,
// re-read by the live Send Back Record / Alt Send Back Record code (ASK 381 + 394 live, engine 4045990f) on each run's own stored inputs.
// Output per row: stored status vs live status. Usage: node a396/rep396.cjs EXEC.json  -> appends JSON lines to a396/rep396.jsonl
const fs=require('fs');const {unpack,rb}=require('../tools/lib.cjs');
const EXF=process.argv[2];const E=JSON.parse(fs.readFileSync(EXF));const RD=E.data.resultData.runData;
const w=JSON.parse(fs.readFileSync('rdf/fresh_eng_pre397.json'));const {L,M}=unpack(w);const sl=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const sOut=(k,i)=>{const x=RD[k]&&RD[k][i];return (x&&x.data&&x.data.main&&x.data.main[0])||[];};
const out=[];
for(const node of ['Send Back Record','Alt Send Back Record','R2 Alt Send Back Record']){if(!RD[node])continue;
 RD[node].forEach((r,ri)=>{const src0=(r.source||[])[0];const inp=src0?sOut(src0.previousNode,src0.previousNodeRun||0):[];
  const $=nm=>{if(nm==='Shared Library')return {isExecuted:false,params:{jsCode:sl},first:()=>{throw new Error('not run')},all:()=>[]};const runs=RD[nm]||[];const prior=runs.filter(x=>x.executionIndex<r.executionIndex);const last=prior[prior.length-1];const items=last?((last.data&&last.data.main&&last.data.main[0])||[]):[];
   return {isExecuted:!!last,first:(a)=>{if(!items.length)throw new Error('no items');return items[a||0];},all:()=>items,last:()=>items[items.length-1],item:items[0]};};
  const $input={all:()=>inp,first:()=>inp[0],last:()=>inp[inp.length-1],item:inp[0]};
  const NOW=new Date(r.startTime).toISOString();const T0=Date;class FD extends T0{constructor(...a){if(a.length)super(...a);else super(NOW);}static now(){return new T0(NOW).getTime();}}
  let res,err=null;try{const AF=Object.getPrototypeOf(async function(){}).constructor;const f=new AF('$','$input','Date','$execution','$json',rb(L,M[node]));res=null;
   const p=f($,$input,FD,{id:String(E.id)},inp[0]&&inp[0].json);res=p;}catch(e){err=String(e.message||e).slice(0,200);}
  out.push({node,ri,p:res,err});});}
(async()=>{const rows=[];for(const o of out){let r=null,err=o.err;try{r=o.p?await o.p:null;}catch(e){err=String(e.message||e).slice(0,200);}
 const live=(r||[]).flatMap(i=>(i.json&&i.json.sb_rows)||[]);const stored=sOut(o.node,o.ri).flatMap(i=>(i.json&&i.json.sb_rows)||[]);
 const key=x=>[x.seat,x.rule,x.item,String(x.flagged_line||'').slice(0,200)].join('|');const lv=new Map();live.forEach(x=>{const k=key(x);(lv.get(k)||lv.set(k,[]).get(k)).push(x);});
 for(const s of stored){if(!(s.kind==='send_back'&&((s.rule==='E-PREM'&&/^(CURED|UNCURED)$/.test(s.cure_status||''))||(s.rule==='E-ANS'&&s.cure_status==='UNCURED'))))continue;
  const l=(lv.get(key(s))||[]).shift();rows.push({ex:String(E.id),node:o.node,seat:s.seat,rule:s.rule,item:s.item,stored:s.cure_status,live:l?l.cure_status:(err?'ERROR':'NO ROW'),err:err||null,why:l?String(l.cure_reason||'').slice(0,300):null});}}
 fs.appendFileSync('a396/rep396.jsonl',rows.map(x=>JSON.stringify(x)).join('\n')+(rows.length?'\n':''));
 const c={};rows.forEach(x=>{const k=x.rule+' '+x.stored+'->'+x.live;c[k]=(c[k]||0)+1});console.log(E.id,JSON.stringify(c));})();
