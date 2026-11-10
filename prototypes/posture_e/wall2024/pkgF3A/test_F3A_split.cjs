// The two parts of sketch (a) alone: G1 (haiku exemption in Second Alternate?) and RETRY (same model once after an unusable reply).
const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');
const L=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const W={s110:L('/mnt/project-files/wall2024/fetchback_live_s110.json'),G1:L('pkgF3A/parent_s110_F3A_G1.json'),RETRY:L('pkgF3A/parent_s110_F3A_RETRY.json'),ALL:L('pkgF3A/parent_s110_F3A.json')};
const SA='Second Alternate?';const src=s=>W[s].nodes.find(x=>x.name===SA).parameters.jsCode;
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34626_full.json','utf8'));const RD=(X.data||X).resultData.runData;const cl=x=>JSON.parse(JSON.stringify(x));
let ok=0,bad=0;const T=(c,m)=>{c?ok++:bad++;console.log((c?'OK   ':'FAIL ')+m);};
const plant=(why,model,seat)=>{const r=cl(RD);const t=r['Alternate Merge 1'][0].data.main[0][0].json.alternates_tried[0];t.why=why;t.api_model=model;t.alternate=seat;
 r['Resolve Seats'][0].data.main[0][0].json.alternates=[{seat:'glm',fam:'openrouter',api_model:'z-ai/glm-5.3',max_tokens:64000,family:'z-ai'},{seat:'haiku',fam:'openrouter',api_model:'anthropic/claude-haiku-5.5',max_tokens:64000,family:'anthropic'}];return r;};
const cases=[['C1 34626 as stored (haiku did not parse; pool haiku only)',RD,{s110:'-',G1:'-',RETRY:'-',ALL:'haiku'}],
 ['C2 round 1 glm, content null; pool glm, haiku',plant('seat "glm" returned content null (finish_reason length).','z-ai/glm-5.3','glm'),{s110:'-',G1:'haiku',RETRY:'glm',ALL:'glm,haiku'}],
 ['C3 round 1 glm, refused for uncured items; pool glm, haiku',plant('unseated after its enforcer send-back and gate: 2 uncured item(s)','z-ai/glm-5.3','glm'),{s110:'-',G1:'haiku',RETRY:'-',ALL:'haiku'}]];
(async()=>{for(const [tag,R,exp] of cases)for(const s of ['s110','G1','RETRY','ALL']){const o=await run(src(s),SA,R);const a=o[0].a2r;const got=a.run?a.free.join(','):'-';
  T(got===exp[s],tag+' | '+s+': round 2 '+(a.run?'runs, free '+got:'does not run')+(a.retry&&a.retry.length?', retry '+a.retry.join():'')+' (expected '+exp[s]+')');}
 console.log(ok+' OK, '+bad+' FAIL');})();
