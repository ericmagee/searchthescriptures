// W3: the three 34299 lines (" | FORCED:" inside CHANGE TO). Gate Record only, live vs candidate vs live with the FORCED part moved to the reason field.
const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');const {rebuild}=require('../pkgLIB/unpack.cjs');
const L=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const W={LIVE:L('/mnt/project-files/wall2024/fetchback_live_s110.json'),GFC:L(__dirname+'/parent_s110_GFS.json')};
const src=(s,n)=>{const w=W[s];const c=w.nodes.find(x=>x.name===n).parameters.jsCode;return /^\/\/ pkgLIB stub/.test(c)?rebuild(c,w.nodes.find(x=>x.name==='Shared Library').parameters.jsCode):c;};
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34299_full.json','utf8'));const RD=(X.data||X).resultData.runData;const cl=x=>JSON.parse(JSON.stringify(x));
const show=async(tag,s,rd)=>{const a=await run(src(s,'Gate Record'),'Gate Record',rd);if(a.err){console.log(tag,'ERR',a.err);return;}const o=a[0];console.log(tag+': '+JSON.stringify(o.gate.seats));o.gate_rows.forEach(r=>console.log('    '+r.item+' | '+r.cure_status+' | '+String(r.cure_reason).slice(0,170)));return JSON.stringify(o.gate_rows.map(r=>[r.item,r.cure_status]));};
(async()=>{const a=await show('LIVE stored','LIVE',RD);const b=await show('GFC stored','GFC',RD);
 const rd=cl(RD);const m=rd['Gate Call openrouter'][0].data.main[0][0].json.choices[0].message;m.content=m.content.split('\n').map(l=>{const x=/^(GATE: G\d+ \|\| CHANGE TO: [\s\S]*?) \| (FORCED: [\s\S]*?) \|\| [\s\S]*$/.exec(l);return x?x[1]+' || '+x[2]:l;}).join('\n');
 const c=await show('LIVE, FORCED part moved to the reason field','LIVE',rd);console.log('GFC stored equals live reason-field form (items and status): '+(b===c));})();
