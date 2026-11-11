// W2: replay Gate Record of 34852 on live s119 code; control, then luna's FORCED round label corrected ([DR2] -> [DR1]) to see whether a FORCED line inside a CHANGE TO cures the K-G4 the change raises.
const fs=require('fs');const {rebuild}=require('../../pkgLIB/unpack.cjs');const {rd}=require('./ld.cjs');
let d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s119.json','utf8'));d=d.data||d;const W=d.workflow||d;
const lib=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const node=n=>W.nodes.find(x=>x.name===n).parameters.jsCode;
const src=n=>{const s=node(n);return s.includes('\nreturn await new Function(')?rebuild(s,lib):s;};
const outOf=(name,over)=>{if(over&&name in over)return over[name];const r=rd[name];if(!r)return null;const x=r[r.length-1];return x.data&&x.data.main?x.data.main:null;};
const mk$=(over)=>name=>{if(name==='Shared Library')return {params:{jsCode:lib}};const o=outOf(name,over);const items=o?JSON.parse(JSON.stringify(o.flat().filter(Boolean))):[];return {isExecuted:!!o,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:{}};};
const run=async(n,inp,over)=>{const $=mk$(over);const I=$(inp);const $input={first:()=>I.first(),all:()=>I.all(),item:I.item};return await new Function('$','$input','return (async()=>{\n'+src(n)+'\n})();')($,$input);};
module.exports={run,outOf,rd};
if(require.main===module)(async()=>{
 const call=outOf('Gate Call openrouter');console.log('gate call items',call.flat().length);
 const show=r=>r.map(x=>x.json).map(j=>[j.seat||j.judge_key||'',j.drv_uncured,(JSON.stringify(j).match(/counted in drv_uncured/g)||[]).length].join(' ')).join(' | ');
 const a=await run('Gate Record','Gate Call openrouter',{});console.log('CONTROL:',show(a));
 const C=JSON.parse(JSON.stringify(call));let hit=0;const fix=s=>s.replace(/MEANS \[DR2\]: (“|")(Four verses later|Luke 1:32 gives the title)/g,(m,q,w)=>{hit++;return 'MEANS [DR1]: '+q+w;});
 const walk=v=>{if(typeof v==='string')return fix(v);if(Array.isArray(v))return v.map(walk);if(v&&typeof v==='object'){const o={};for(const k in v)o[k]=walk(v[k]);return o;}return v;};
 const C2=walk(C);console.log('labels changed',hit);
 const b=await run('Gate Record','Gate Call openrouter',{'Gate Call openrouter':C2});console.log('LUNA [DR1]:',show(b));
 fs.writeFileSync(__dirname+'/gate_replay_out.json',JSON.stringify({a,b}));
})();
