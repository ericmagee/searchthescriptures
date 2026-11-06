// pkgKGW replay over every saved run with gate inputs: Panel Cure Check whole, base pkgNHE vs pkgKGW; per seat: stored tag, drv_uncured,
// recompute trigger, uncured items. Run from wall2024/: node pkgKGW/replay_KGW.cjs
const fs=require('fs');const {load}=require('../corpus/replay_node.cjs');const rd=f=>fs.readFileSync(f,'utf8');
const runs=fs.readdirSync('corpus/raw').map(f=>(f.match(/^gate_(\d+)\.json$/)||[])[1]).filter(Boolean).sort();
const go=(run,pkg)=>{const N=load(run);const mock=name=>{const r=N.nodes[name];if(!r)return {isExecuted:false,first:()=>{throw new Error('x');},all:()=>{throw new Error('x');}};const it=r[r.length-1]||[];return {isExecuted:true,first:()=>({json:it[0]}),last:()=>({json:it[it.length-1]}),all:()=>it.map(j=>({json:j})),item:{json:it[0]}};};
 const O=new Function('$','$input','$json',rd(pkg+'/patched/Panel_Cure_Check.js'))(mock,{first:()=>({json:{}}),all:()=>[],item:{json:{}}},{})[0].json;
 return O.summary.map(s=>{const b=O.bodies.map(x=>JSON.parse(x).payload).find(p=>p.judge_seat===s.seat)||{};return {seat:s.seat,tag:b.verdict_tag,du:b.drv_uncured,trig:(s.recomputed&&s.recomputed.trigger||[]).join('; '),un:(s.cure||[]).filter(c=>c.status==='UNCURED').map(c=>c.rule+' '+c.link).join('; ')};});};
let nchg=0;for(const run of runs){const a=go(run,'pkgNHE'),b=go(run,'pkgKGW');
 for(const x of a){const y=b.find(z=>z.seat===x.seat);const d=['tag','du','trig','un'].filter(k=>String(x[k])!==String(y[k]));
  if(d.length){nchg++;console.log(run+' '+x.seat+': '+d.map(k=>k+' ['+x[k]+'] -> ['+y[k]+']').join(' | '));}else console.log(run+' '+x.seat+': unchanged ('+x.tag+', drv_uncured '+x.du+')');}}
console.log(nchg+' seat(s) changed over '+runs.join(', '));
