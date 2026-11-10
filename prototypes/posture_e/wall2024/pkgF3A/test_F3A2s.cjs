// pkgF3A rev 2s tests (labels "Rev 2s", commit 59815ee6), execution 34626.
const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');
const L=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const W={s110:L('/mnt/project-files/wall2024/fetchback_live_s110.json'),RETRY:L('pkgF3A/parent_s110_F3A2s_RETRY.json'),ALL:L('pkgF3A/parent_s110_F3A2s_ALL.json'),G1:L('pkgF3A/parent_s110_F3A2_G1.json')};
const src=(s,n)=>W[s].nodes.find(x=>x.name===n).parameters.jsCode;
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34626_full.json','utf8'));const RD=(X.data||X).resultData.runData;const cl=x=>JSON.parse(JSON.stringify(x));const W2=a=>[a.map(j=>({json:j}))];
let ok=0,bad=0;const T=(c,m)=>{c?ok++:bad++;console.log((c?'OK   ':'FAIL ')+m);};const SA='Second Alternate?',AM='Alternate Merge';
const fake=(rd,n,prev)=>{rd[n]=[{startTime:RD['Alternate Build'][0].startTime,source:[{previousNode:prev,previousNodeOutput:0}],data:{main:[[]]}}];};
const lunaLines=o=>{const b=o[0].bodies.find(s=>JSON.parse(s).payload.judge_seat==='luna');return String(JSON.parse(b).payload.verdict_raw).split('\n').filter(l=>/^\[AUDIT v(?:21|39): ALTERNATE (TRIED|UNSEATED) -- SEAT: luna/.test(l.trim()));};
(async()=>{const r1=RD['Alternate Merge 1'][0].data.main[0][0].json;const line=lunaLines([r1])[0];
 const merge=async(set,l2)=>{const sa=await run(src(set==='s110'?'s110':set,SA),SA,RD);sa[0].a2r.run=true;sa[0].a2r.seats=['luna'];const r2m=cl(sa[0]);r2m.bodies=r2m.bodies.map(b=>{const o=JSON.parse(b);if(o.payload.judge_seat==='luna')o.payload.verdict_raw=String(o.payload.verdict_raw)+'\n'+l2;return JSON.stringify(o);});r2m.alternates_tried=[];r2m.alternates_seated=[];r2m.drv_removed=[];
  const R=cl(RD);fake(R,'R2 Alternate Merge','R2 Alternate Payloads');fake(R,AM,'Second Alternate Needed?');const m=await run(src(set,AM),AM,R,{[SA]:W2(sa),'R2 Alternate Merge':[[{json:r2m}]]});return m;};
 for(const s of ['s110','ALL']){const m=await merge(s,line);console.log('   S1 retry plant',s,'luna lines',lunaLines(m).length,JSON.stringify(m[0].alternate_round2||{}).slice(0,200));
  if(s==='s110')T(lunaLines(m).length===1,'S1 s110 keeps one line');else{T(lunaLines(m).length===2,'S1 2s keeps the retry line (2 lines)');T((m[0].alternate_round2.retry||[]).join()==='anthropic/claude-haiku-5.5','S2 alternate_round2.retry names haiku');}}
 const other=line.replace('ALTERNATE: haiku; MODEL: anthropic/claude-haiku-5.5','ALTERNATE: glm; MODEL: z-ai/glm-5.3');const a=await merge('s110',other),b=await merge('ALL',other);
 T(JSON.stringify(lunaLines(a))===JSON.stringify(lunaLines(b))&&lunaLines(b).length===2,'S1 control: round 2 tries a different model: same lines as s110 ('+lunaLines(b).length+')');
 const plant=(why,model,seat)=>{const r=cl(RD);const t=r['Alternate Merge 1'][0].data.main[0][0].json.alternates_tried[0];t.why=why;t.api_model=model;t.alternate=seat;
  r['Resolve Seats'][0].data.main[0][0].json.alternates=[{seat:'glm',fam:'openrouter',api_model:'z-ai/glm-5.3',max_tokens:64000,family:'z-ai'},{seat:'haiku',fam:'openrouter',api_model:'anthropic/claude-haiku-5.5',max_tokens:64000,family:'anthropic'}];return r;};
 const cases=[['C1 34626',RD,{s110:'-',G1:'-',RETRY:'-',ALL:'haiku'}],['C2 glm content null',plant('seat "glm" returned content null (finish_reason length).','z-ai/glm-5.3','glm'),{s110:'-',G1:'haiku',RETRY:'glm',ALL:'glm,haiku'}],['C3 glm uncured',plant('unseated after its enforcer send-back and gate: 2 uncured item(s)','z-ai/glm-5.3','glm'),{s110:'-',G1:'haiku',RETRY:'-',ALL:'haiku'}]];
 for(const [tag,Rx,exp] of cases)for(const s of ['s110','G1','RETRY','ALL']){const o=await run(src(s,SA),SA,Rx);const q=o[0].a2r;const got=q.run?q.free.join(','):'-';T(got===exp[s],'S3 '+tag+' | '+s+': '+got);}
 console.log(ok+' OK, '+bad+' FAIL');})();
