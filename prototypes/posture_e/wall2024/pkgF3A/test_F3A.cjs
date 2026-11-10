// Tests for the pkgF3A sketch on execution 34626 (labels pkgF3A/labels_F3A.md).
const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');const {rebuild}=require('../pkgLIB/unpack.cjs');
const L=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const W={s110:L('/mnt/project-files/wall2024/fetchback_live_s110.json'),F3A:L('pkgF3A/parent_s110_F3A.json')};
const src=(set,n)=>{const w=W[set];const c=w.nodes.find(x=>x.name===n).parameters.jsCode;return /^\/\/ pkgLIB stub/.test(c)?rebuild(c,w.nodes.find(x=>x.name==='Shared Library').parameters.jsCode):c;};
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34626_full.json','utf8'));const RD=(X.data||X).resultData.runData;const cl=x=>JSON.parse(JSON.stringify(x));
let ok=0,bad=0;const T=(c,m)=>{c?ok++:bad++;console.log((c?'OK   ':'FAIL ')+m);};const W2=a=>[a.map(j=>({json:j}))];
const SA='Second Alternate?',R2='R2 Alternate Build';
const plantWhy=why=>{const r=cl(RD);r['Alternate Merge 1'][0].data.main[0][0].json.alternates_tried[0].why=why;return r;};
(async()=>{
 const a=await run(src('s110',SA),SA,RD);T(JSON.stringify(a)===JSON.stringify(RD[SA][0].data.main[0].map(x=>x.json)),'F0 s110 Second Alternate? rerun equals stored');
 const b=await run(src('F3A',SA),SA,RD);console.log('   s110 a2r',JSON.stringify(a[0].a2r));console.log('   F3A  a2r',JSON.stringify(b[0].a2r));
 T(b[0].a2r.run===true&&b[0].a2r.seats.join()==='luna'&&b[0].a2r.retry.join()==='anthropic/claude-haiku-5.5'&&b[0].a2r.free.join()==='haiku','F1 34626 haiku "did not parse": round 2 runs for luna with haiku again, recorded as retry');
 const strip=o=>{const j=cl(o[0]);delete j.a2r;return JSON.stringify(j);};T(strip(a)===strip(b),'F1 everything but a2r unchanged');
 // R2 Alternate Build on the candidate's output: it must build one haiku body for luna, not refuse it under G5
 const over={'Second Alternate?':W2(b),'Second Alternate Needed?':W2(b)};const RR=cl(RD);RR[R2]=[{startTime:RD['Alternate Build'][0].startTime,source:[{previousNode:'Second Alternate Needed?',previousNodeOutput:0}],data:{main:[[]]}}];const r2=await run(src('F3A',R2),R2,RR,over);
 const alts=(r2.err?[]:r2).map(j=>j.alt||{});console.log('   R2 Alternate Build',r2.err||JSON.stringify(alts.map(x=>({removed:x.removed_seat,seat:x.seat,skip:x.skip,why:String(x.why||'').slice(0,80),max_tokens:x.body&&x.body.max_tokens}))));
 T(!r2.err&&alts.some(x=>x.removed_seat==='luna'&&x.seat==='haiku'&&!x.skip&&x.body),'F2 R2 Alternate Build builds the haiku body for luna (same 64,000 limit)');
 for(const [tag,why,exp] of [['F3 content null','seat "haiku" returned content null (finish_reason length). NO ROW IS WRITTEN.',true],['F3 no JSON object','seat "haiku" returned no JSON object. First 200 chars: x',true],['F4 uncured items (a usable reply the rules refused)','unseated after its enforcer send-back and gate: 2 uncured item(s)',false],['F4 guards','no pool model passes the guards: haiku G4',false]]){
  const r=plantWhy(why);const s0=await run(src('s110',SA),SA,r),s1=await run(src('F3A',SA),SA,r);
  T(s0[0].a2r.run===false&&s1[0].a2r.run===exp&&(s1[0].a2r.retry.length>0)===exp,tag+': s110 run '+s0[0].a2r.run+', F3A run '+s1[0].a2r.run+' (expected '+exp+')');}
 // F5 the retry happens once: round 2 is the last round (Second Alternate? runs once, after round 1 only)
 const conn=W.F3A.connections;const toSA=Object.entries(conn).filter(([k,v])=>(v.main||[]).some(o=>(o||[]).some(x=>x.node===SA))).map(([k])=>k);
 T(toSA.length===1&&toSA[0]==='Alternate Merge 1','F5 Second Alternate? is fed only by Alternate Merge 1, so a retried reply that fails again is not retried a third time ('+toSA.join()+')');
 const nd=W.F3A.nodes.filter((x,i)=>JSON.stringify(x)!==JSON.stringify(W.s110.nodes[i])).map(x=>x.name);T(nd.join()===SA&&JSON.stringify(W.F3A.connections)===JSON.stringify(W.s110.connections),'F6 only Second Alternate? changes; connections equal');
 console.log(ok+' OK, '+bad+' FAIL');})();
