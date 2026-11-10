// Sketch (b): no code. pkgA2R (live) already calls a second pool model in round 2 when one is untried and passes the guards.
// Plant: a second pool model in Resolve Seats (glm, z-ai, not a debating family) on execution 34626, live s110 code unchanged.
const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');const {rebuild}=require('../pkgLIB/unpack.cjs');
const L=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};const w=L('/mnt/project-files/wall2024/fetchback_live_s110.json');
const src=n=>{const c=w.nodes.find(x=>x.name===n).parameters.jsCode;return /^\/\/ pkgLIB stub/.test(c)?rebuild(c,w.nodes.find(x=>x.name==='Shared Library').parameters.jsCode):c;};
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34626_full.json','utf8'));const RD=(X.data||X).resultData.runData;const cl=x=>JSON.parse(JSON.stringify(x));const W2=a=>[a.map(j=>({json:j}))];
(async()=>{const R=cl(RD);R['Resolve Seats'][0].data.main[0][0].json.alternates.push({seat:'glm',fam:'openrouter',api_model:'z-ai/glm-5.3',max_tokens:64000,family:'z-ai'});
 const a=await run(src('Second Alternate?'),'Second Alternate?',R);console.log('s110 + planted pool [haiku, glm]: a2r',JSON.stringify(a[0].a2r));
 R['R2 Alternate Build']=[{startTime:RD['Alternate Build'][0].startTime,source:[{previousNode:'Second Alternate Needed?',previousNodeOutput:0}],data:{main:[[]]}}];
 const r2=await run(src('R2 Alternate Build'),'R2 Alternate Build',R,{'Second Alternate?':W2(a),'Second Alternate Needed?':W2(a)});
 console.log('R2 Alternate Build',r2.err||JSON.stringify(r2.map(j=>({removed:(j.alt||{}).removed_seat,seat:(j.alt||{}).seat,skip:(j.alt||{}).skip,max_tokens:(j.alt||{}).body&&(j.alt||{}).body.max_tokens}))));})();
