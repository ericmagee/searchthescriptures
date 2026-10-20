const fs=require('fs');const pairs=JSON.parse(fs.readFileSync('pairs.json'));
const blk=fs.readFileSync('f4_block.js','utf8').replace(/^let SJ=null;try\{.*\n/m,'');
const mk=new Function('SJ',blk+';return {sameModelMarks,voidCounts};');
function wt(vr){const s=String(vr);const a=s.indexOf('{'),b=s.lastIndexOf('}');let v;try{v=JSON.parse(s.slice(a,b+1));}catch(e){return null;}return v.reasoning==null&&v.reason!=null?v.reason:v.reasoning;}
let fire=0,bad=0;
for(const r of pairs){const {sameModelMarks,voidCounts}=mk(r.sj);const W=wt(r.vr);if(W==null){bad++;console.log('NOPARSE',r.tok,r.seat);}
 const m=sameModelMarks(r.p,W);if(m.length)fire++;
 console.log((m.length?'FIRE ':'     ')+r.tok+' '+r.seat+' '+(m[0]||'')+'  [void p='+JSON.stringify(voidCounts(W))+' s='+JSON.stringify(voidCounts(r.sj.independent_verdict_raw))+']');}
console.log('pairs',pairs.length,'fire',fire,'noparse',bad);
