// ASK 646 tests (W4). node t646.cjs base_eng.json target_engine_646.json fxdir (the ask629 stored-run fixtures: node outputs of each run)
const fs=require('fs'),path=require('path');const [,,BF,TF,FX]=process.argv;
const B=JSON.parse(fs.readFileSync(BF,'utf8')),T=JSON.parse(fs.readFileSync(TF,'utf8'));
let fail=0,pass=0;const ok=(c,m)=>{if(c){pass++;console.log('PASS '+m);}else{fail++;console.log('FAIL '+m);}};
const code=(W,n)=>W.nodes.find(x=>x.name===n).parameters.jsCode;
const mk=(rd,W,over)=>{over=over||{};return n=>{const items=(over[n]||rd[n]||null);if(n==='Shared Library')return {params:W.nodes.find(x=>x.name==='Shared Library').parameters,isExecuted:true};
  if(!items)return {isExecuted:false,first:()=>{throw new Error('node '+n+' did not run');},all:()=>{throw new Error('node '+n+' did not run');}};
  return {isExecuted:true,first:()=>({json:items[0]}),all:()=>items.map(j=>({json:j})),item:{json:items[0]}};};};
const run=async(W,n,rd,inputNode,over,exid)=>{const $=mk(rd,W,over);const inp=(over&&over[inputNode])||rd[inputNode]||[];
  const $input={first:()=>({json:inp[0]}),all:()=>inp.map(j=>({json:j}))};const $execution={id:exid||'0',customData:{set(){}}};
  return new Function('$','$input','$execution','return (async()=>{\n'+code(W,n)+'\n})();')($,$input,$execution);};
const strip=o=>{const x=JSON.parse(JSON.stringify(o));for(const i of x){delete i.json.run_token;delete i.json.t0;delete i.json.sd;}return x;};
// the JUDGE ORDER line, cut from Build Save Body and run on an Init Seats output
const lineFn=W=>{const c=code(W,'Build Save Body');const a=c.indexOf("(()=>{try{const I=$('Init Seats')");const e="catch(e){return '';}})()";const b=c.indexOf(e,a)+e.length;const s=c.slice(a,b);return I=>new Function('$','return '+s+';')(n=>({first:()=>({json:I})}));};
const LO=lineFn(B),LN=lineFn(T);
(async()=>{
const files=fs.readdirSync(FX).filter(f=>/^is_\d+\.json$/.test(f)).sort();
for(const f of files){const X=JSON.parse(fs.readFileSync(path.join(FX,f),'utf8'));const rd=X.rd;
  if(!rd['Judge Order Read']){ok(true,X.id+': no Judge Order Read stored (run before ASK 591); not replayable, skipped');continue;}
  let o,n,eo=null,en=null;try{o=await run(B,'Init Seats',rd,'Accept Final',null,X.id);}catch(e){eo=e.message;}try{n=await run(T,'Init Seats',rd,'Accept Final',null,X.id);}catch(e){en=e.message;}
  if(eo||en){ok(String(eo).replace(/run_token=\S+/,'')===String(en).replace(/run_token=\S+/,''),X.id+': both refuse alike');continue;}
  const so=strip(o)[0].json,sn=strip(n)[0].json;const lo=sn.seat_left_out;delete sn.seat_left_out;
  ok(JSON.stringify(so)===JSON.stringify(sn),X.id+': every old output field is equal');
  const J=rd['Judge Order Read'][0];const ord=[...new Set(J.panel.concat(J.alternate))];const I=n[0].json;
  const where=s=>[I.panel_order.indexOf(s)>=0,s===I.panel_reserve,(I.alt_order||[]).indexOf(s)>=0,lo.some(x=>x.seat===s)];
  ok(ord.every(s=>{const w=where(s);return w[3]?!(w[0]||w[1]||w[2]):(w[0]||w[1]||w[2]);}),X.id+': every order seat is seated or left out, never both');
  ok(lo.length===new Set(lo.map(x=>x.seat)).size,X.id+': no seat listed twice');
  ok(lo.every(x=>typeof x.reason==='string'&&x.reason.length),X.id+': every left-out seat has its recorded reason (no "not reached" case arises)');
  const l0=LO(o[0].json),l1=LN(n[0].json);const k=l0.lastIndexOf(']');
  ok(l1.slice(0,k)===l0.slice(0,k)&&/^; LEFT OUT: .*\]$/.test(l1.slice(k)),X.id+': the line is the old line plus the LEFT OUT part');
  console.log('   '+X.id+' '+l1.trim());}
// C2 synthetic
const I0={judge_order:{version:6,panel:['a','b','c'],alternate:['d']},panel_order:['a','b','c'],panel_reserve:null,alt_order:[],seat_left_out:[{seat:'d',reason:'did not accept the posture'}]};
ok(/LEFT OUT: d \(did not accept the posture\)\]$/.test(LN(I0)),'C2 a seat that did not accept the posture shows that reason');
ok(/LEFT OUT: d \(odd reason x\)\]$/.test(LN({...I0,seat_left_out:[{seat:'d',reason:'odd [reason] x'}]})),'C2 brackets in a reason are removed');
ok(/LEFT OUT: none\]$/.test(LN({...I0,seat_left_out:[]})),'C2 nobody left out prints none');
// C3 structure
const P=d=>Object.fromEntries(d.nodes.map(n=>[n.name,JSON.stringify(n.parameters)]));const pb=P(B),pt=P(T);const ch=Object.keys(pb).filter(k=>pb[k]!==pt[k]).sort();
ok(JSON.stringify(ch)==='["Build Save Body","Init Seats"]'&&Object.keys(pt).length===Object.keys(pb).length,'C3 only Init Seats and Build Save Body change');ok(JSON.stringify(B.connections)===JSON.stringify(T.connections),'C3 connections equal');
ok(['Init Seats','Build Save Body'].every(nm=>(code(T,nm).match(/ASK 646/g)||[]).length>=1&&(code(T,nm).match(/catch/g)||[]).length===(code(B,nm).match(/catch/g)||[]).length),'C4 tagged ASK 646; no new catch');
console.log(pass+' pass, '+fail+' fail');console.log(fail?'FAILED':'ALL PASS');})().catch(e=>{console.log('ERROR',e.stack);process.exit(1);});
