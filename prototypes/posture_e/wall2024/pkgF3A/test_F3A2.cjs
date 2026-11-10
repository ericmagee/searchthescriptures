// pkgF3A rev 2 tests (labels pkgF3A/labels_F3A.md "Rev 2", commit b043c2fa), execution 34626, offline on s110.
const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');const {rebuild}=require('../pkgLIB/unpack.cjs');
const L=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const W={s110:L('/mnt/project-files/wall2024/fetchback_live_s110.json')};for(const s of ['G1','RETRY','ALL'])W[s]=L('pkgF3A/parent_s110_F3A2_'+s+'.json');
const src=(set,n)=>{const w=W[set];const c=w.nodes.find(x=>x.name===n).parameters.jsCode;return /^\/\/ pkgLIB stub/.test(c)?rebuild(c,w.nodes.find(x=>x.name==='Shared Library').parameters.jsCode):c;};
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34626_full.json','utf8'));const RD=(X.data||X).resultData.runData;const cl=x=>JSON.parse(JSON.stringify(x));const W2=a=>[a.map(j=>({json:j}))];
let ok=0,bad=0;const T=(c,m)=>{c?ok++:bad++;console.log((c?'OK   ':'FAIL ')+m);};const SA='Second Alternate?',R2='R2 Alternate Build',AM='Alternate Merge';
const fake=(rd,n,prev)=>{rd[n]=[{startTime:RD['Alternate Build'][0].startTime,source:[{previousNode:prev,previousNodeOutput:0}],data:{main:[[]]}}];};
(async()=>{
 // R2: Second Alternate? on 34626
 const a=await run(src('ALL',SA),SA,RD);const z=a[0].a2r;console.log('   ALL a2r',JSON.stringify(z));
 T(z.run&&z.tried.join()==='anthropic/claude-haiku-5.5'&&z.retry.join()==='anthropic/claude-haiku-5.5'&&z.retry_for['anthropic/claude-haiku-5.5']==='luna'&&z.free.join()==='haiku','R2 a2r.tried still names haiku; retry and retry_for name haiku for luna; round 2 runs');
 // R2 Alternate Build offers haiku to luna under G5 rev 2
 const R=cl(RD);fake(R,R2,'Second Alternate Needed?');const b=await run(src('ALL',R2),R2,R,{[SA]:W2(a),'Second Alternate Needed?':W2(a)});
 const al=(b.err?[]:b).map(j=>j.alt||{});console.log('   R2 build',b.err||JSON.stringify(al.map(x=>({r:x.removed_seat,s:x.seat,skip:x.skip,why:String(x.why||'').slice(0,90)}))));
 T(!b.err&&al.some(x=>x.removed_seat==='luna'&&x.seat==='haiku'&&!x.skip&&x.body),'R2 R2 Alternate Build builds haiku for luna');
 // R3: two removed seats (luna, sol), haiku's unusable reply was sol's: offered to sol only, luna refused with G5 (pkgF3A)
 const R3=cl(RD);fake(R3,R2,'Second Alternate Needed?');const g=R3['Gate Record'][0].data.main[0][0].json;g.bodies=g.bodies.map(s=>{const o=JSON.parse(s);if(o.payload.judge_seat==='sol')o.payload.drv_uncured=1;return JSON.stringify(o);});
 const a3=cl(a);a3[0].a2r={...a3[0].a2r,seats:['luna','sol'],retry_for:{'anthropic/claude-haiku-5.5':'sol'}};a3[0].bodies=g.bodies;
 const b3=await run(src('ALL',R2),R2,R3,{[SA]:W2(a3),'Second Alternate Needed?':W2(a3),'Gate Record':W2([g])});const al3=(b3.err?[]:b3).map(j=>j.alt||{});
 console.log('   R3 skips',JSON.stringify((b3[0]||{}).skips).slice(0,400));console.log('   R3 build',b3.err||JSON.stringify(al3.map(x=>({r:x.removed_seat,s:x.seat,skip:x.skip,why:String(x.why||'').slice(0,110)}))));
 T(!b3.err&&al3.some(x=>x.removed_seat==='sol'&&x.seat==='haiku'&&x.body&&!x.skip)&&JSON.stringify((b3[0]||{}).skips||[]).match(/luna[^}]*G5 \(pkgF3A\)|G5 \(pkgF3A\)[^}]*luna/),'R3 haiku offered to sol (its failed seat) only; luna refused with G5 (pkgF3A)');
 // R1: Alternate Merge keeps a round 2 line equal to round 1's (plant: R2 Alternate Merge = round 1's output, so luna's round 2 row repeats the same ALTERNATE TRIED line)
 const r1=RD['Alternate Merge 1'][0].data.main[0][0].json;const R4=cl(RD);const line=String(JSON.parse(r1.bodies.find(b=>JSON.parse(b).payload.judge_seat==='luna')).payload.verdict_raw).split('\n').find(l=>/ALTERNATE TRIED -- SEAT: luna/.test(l));const r2m=cl(a[0]);r2m.bodies=r2m.bodies.map(b=>{const o=JSON.parse(b);if(o.payload.judge_seat==='luna')o.payload.verdict_raw=String(o.payload.verdict_raw)+'\n'+line;return JSON.stringify(o);});r2m.alternates_tried=cl(r1.alternates_tried);r2m.alternates_seated=[];r2m.drv_removed=[];fake(R4,'R2 Alternate Merge','R2 Alternate Payloads');R4['R2 Alternate Merge'][0].data.main=[[{json:cl(r1)}]];fake(R4,AM,'Second Alternate Needed?');
 const cnt=o=>{const b=o[0].bodies.find(s=>JSON.parse(s).payload.judge_seat==='luna');return String(JSON.parse(b).payload.verdict_raw).split('\n').filter(l=>/^\[AUDIT v(?:21|39): ALTERNATE TRIED -- SEAT: luna/.test(l.trim())).length;};
 for(const s of ['s110','ALL']){const sa=s==='s110'?await run(src('s110',SA),SA,RD):a;sa[0].a2r.run=true;const m=await run(src(s,AM),AM,R4,{[SA]:W2(sa),'R2 Alternate Merge':[[{json:r2m}]]});
  if(m.err){T(false,'R1 '+s+' error '+m.err);continue;}console.log('   R1',s,'luna ALTERNATE TRIED lines',cnt(m),'alternate_round2',JSON.stringify(m[0].alternate_round2).slice(0,240));
  if(s==='s110')T(cnt(m)===1,'R1 s110 keeps one line (the finding)');else T(cnt(m)===2&&m[0].alternate_round2.retry.join()==='anthropic/claude-haiku-5.5'&&m[0].alternate_round2.tried.join()==='anthropic/claude-haiku-5.5','R1 rev 2 writes the retry line again (2 lines) and the record names the retry and the tried model');}
 // R4 split cases and no-retry cases still hold
 const plant=(why,model,seat)=>{const r=cl(RD);const t=r['Alternate Merge 1'][0].data.main[0][0].json.alternates_tried[0];t.why=why;t.api_model=model;t.alternate=seat;
  r['Resolve Seats'][0].data.main[0][0].json.alternates=[{seat:'glm',fam:'openrouter',api_model:'z-ai/glm-5.3',max_tokens:64000,family:'z-ai'},{seat:'haiku',fam:'openrouter',api_model:'anthropic/claude-haiku-5.5',max_tokens:64000,family:'anthropic'}];return r;};
 const cases=[['C1 34626 as stored',RD,{s110:'-',G1:'-',RETRY:'-',ALL:'haiku'}],['C2 glm content null',plant('seat "glm" returned content null (finish_reason length).','z-ai/glm-5.3','glm'),{s110:'-',G1:'haiku',RETRY:'glm',ALL:'glm,haiku'}],['C3 glm uncured',plant('unseated after its enforcer send-back and gate: 2 uncured item(s)','z-ai/glm-5.3','glm'),{s110:'-',G1:'haiku',RETRY:'-',ALL:'haiku'}]];
 for(const [tag,Rx,exp] of cases)for(const s of ['s110','G1','RETRY','ALL']){const o=await run(src(s,SA),SA,Rx);const q=o[0].a2r;const got=q.run?q.free.join(','):'-';T(got===exp[s],'R4 '+tag+' | '+s+': '+got+' (expected '+exp[s]+')');}
 console.log(ok+' OK, '+bad+' FAIL');})();
