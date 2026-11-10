// W2 unit checks C8 to C10 on the exact pkgGCC code (patches/G1.to), as W1's t_1062.cjs runs it.
const fs=require('fs');const PF=process.argv[2]||'pkgGCC/patches/G1.to';const code=fs.readFileSync(PF,'utf8');console.log('patch '+PF);
const counted='[AUDIT v42: COLLISION GRADE UNCURED (pkgUND) -- SEAT: luna; ITEMS: S10 (E-UNG COLLISION D2); counted in drv_uncured. REVIEW THIS ROW.]';
const run=(res)=>{const p={drv_uncured:3,verdict_raw:'x\n'+counted};const f=new Function('p','res','g','C','any',code+';return {p,__off};');return f(p,res,{seat:'luna'},null,false);};
const r8=run([{gid:'G1',kind:'NOT APPLIED',src:'E-APPLY S10',cured:true,ans:'CHANGE',why:'the gate change was applied'},{gid:'G6',kind:'CONTRADICTION',src:'E-APPLY S10',cured:true,ans:'CHANGE',why:'the gate change was applied'}]);
console.log((r8.p.drv_uncured===2?'OK   ':'FAIL ')+'C8 two cured gate items from S10, one counted line: drv 3 -> '+r8.p.drv_uncured+' (taken off '+r8.__off.join(',')+')');
const r9=run([{gid:'G1',kind:'CONTRADICTION',src:'E-APPLY S10',cured:true,ans:'CHANGE',why:'pkgRCT refused the gate change and the count stays at your cure value'}]);
console.log((r9.p.drv_uncured===3?'OK   ':'FAIL ')+'C9 pkgRCT path ("the count stays"): drv 3 -> '+r9.p.drv_uncured);
const r10=run([{gid:'G1',kind:'CONTRADICTION',src:'E-APPLY S10',cured:true,ans:'KEEP',why:'KEEP: change withdrawn (the refused send-back change S10 is dropped ...)'}]);
console.log((r10.p.drv_uncured===3?'OK   ':'FAIL ')+'C10 KEEP, change withdrawn (line as it was): drv 3 -> '+r10.p.drv_uncured);
const r11=run([{gid:'G1',kind:'NOT APPLIED',src:'E-APPLY S10',cured:true,ans:'CHANGE',why:'the later gate change G4 of this judge rewrote the same line (the last change wins) and was applied'}]);
console.log('REC  C11u cured because a later gate change rewrote the same line and was applied: drv 3 -> '+r11.p.drv_uncured);
const r12=run([{gid:'G1',kind:'NOT APPLIED',src:'E-APPLY S10',cured:true,ans:'CHANGE',why:'the gate change is already in the corrected text (another change wrote the same line; W3 2319)'}]);
console.log('REC  C12u cured because another change already wrote the line: drv 3 -> '+r12.p.drv_uncured);
