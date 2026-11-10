// W2: every counted tag the send-back writes (v40-v46, v48, v51) and non-counting tags, on the exact G1 patch code.
const fs=require('fs');const PF=process.argv[2]||'pkgGCC/patches/G1n3.to';const code=fs.readFileSync(PF,'utf8');console.log('patch '+PF);
const res=[{gid:'G1',kind:'NOT APPLIED',src:'E-APPLY S10',cured:true,ans:'CHANGE',why:'the gate change was applied'}];
const run=line=>{const p={drv_uncured:3,verdict_raw:'x\n'+line};const f=new Function('p','res','g','C','any',code+';return {p,__off};');return f(p,res,{seat:'luna'},null,false).p.drv_uncured;};
const L=t=>'[AUDIT '+t+' -- SEAT: luna; ITEMS: S10 (rule text); counted in drv_uncured. REVIEW THIS ROW.]';
let ok=0,bad=0;const T=(c,m)=>{c?ok++:bad++;console.log((c?'OK   ':'FAIL ')+m);};
for(const t of ['v40: SEND-BACK SILENCE','v41: E-COL UNCURED (pkgECF, W3 2534)','v42: COLLISION GRADE UNCURED (pkgUND)','v43: ABSENCE GRADE UNCURED (pkgABS; Commitment 3, ruling 421)','v44: PRESS ABSENCE UNCURED (pkgPAB)','v45: MEANS AGAINST THE LEDGER UNCURED (pkgMNP)','v46: IMPOSED REQUIREMENT UNCURED (pkgIMP)','v48: KEYSTONE CONSISTENCY UNCURED (pkgKSC, Commitment 15)','v51: SELF-CONTRADICTION UNCURED (pkgEB7, ruling 421)']){const d=run(L(t));T(d===2,'counted '+t.slice(0,4)+': 3 -> '+d);}
for(const t of ['v38: E-GATE','v21: DEBATE RULE VIOLATION REPORT','v50: COUNTED PREMISES','v52: FUTURE','v5: X','v510: X','v4: X']){const d=run(L(t));T(d===3,'not a send-back count tag '+t.slice(0,5)+': stays '+d);}
const d=run(L('v51: SELF-CONTRADICTION UNCURED (pkgEB7, ruling 421; TRIAL)').replace('counted in drv_uncured','TRIAL rule: recorded, not counted in drv_uncured; it removes no seat'));T(d===3,'v51 TRIAL not counted: stays '+d);
console.log(ok+' OK, '+bad+' FAIL');
