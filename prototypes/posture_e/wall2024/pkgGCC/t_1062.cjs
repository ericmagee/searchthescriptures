// pkgGCC on stored judgment 1062 (gemini, debate f351b871): the exact G1 code from patches/G1.to run on that row's own send-back count line and gate lines (copied below from Supabase).
const fs=require('fs');const code=fs.readFileSync(__dirname+'/patches/'+(process.argv[2]||'G1')+'.to','utf8');console.log('patch '+(process.argv[2]||'G1'));
const counted="[AUDIT v41: E-COL UNCURED (pkgECF, W3 2534) -- SEAT: gemini; ITEMS: S8 (COLLISION D4 vs C6: CHANGE TO keeps the break and quotes no 6 words in a row of the answering side's own words); counted in drv_uncured. REVIEW THIS ROW.]";
const A='the gate change was applied',N='the gate change was not applied',Y='the gate change is already in the corrected text (another change wrote the same line; W3 2319)';
const gate=[['G1','S3',0,N],['G2','S4',1,A],['G3','S5',0,N],['G4','S6',1,A],['G5','S7',0,N],['G6','S8',1,A],['G7','S10',1,Y],['G8','S11',1,Y],['G9','S12',1,A]];
let res=gate.map(([gid,s,c,w])=>({gid,src:'E-APPLY '+s,cured:!!c,kind:'NOT APPLIED',ans:'CHANGE',why:w}));
const run=(drv,raw,seat)=>{const p={drv_uncured:drv,verdict_raw:raw};let any=false;const C=null,g={seat};const f=new Function('p','res','g','C','any',code+';return {p,__off};');return f(p,res,g,C,any);};
const a=run(12,'reasoning\n'+counted,'gemini');console.log('stored drv_uncured 12 -> '+a.p.drv_uncured+'; taken off: '+a.__off.join(','));
const b=run(12,'reasoning\n'+counted.replace('ITEMS: S8 (','ITEMS: S9 ('),'gemini');console.log('plant: count names S9 (not gate-cured) -> '+b.p.drv_uncured);
const c=run(12,'reasoning\n'+counted,'sol');console.log('plant: other seat -> '+c.p.drv_uncured);
const d=run(12,'reasoning\n'+counted.replace('counted in drv_uncured','RECORD-ONLY, not counted'),'gemini');console.log('plant: record-only line -> '+d.p.drv_uncured);
const e=run(0,'reasoning\n'+counted,'gemini');console.log('plant: drv 0 stays 0 -> '+e.p.drv_uncured);
const h=run(12,'reasoning\n'+counted.replace('ITEMS: S8 (','ITEMS: S18 ('),'gemini');console.log('plant: S18 is not S8 -> '+h.p.drv_uncured);

res=res.map(r=>r.src==='E-APPLY S8'?{...r,ans:'KEEP',why:'KEEP: the change stays unapplied'}:r);const k=run(12,'reasoning\n'+counted,'gemini');console.log('plant: S8 cured by a gate KEEP -> '+k.p.drv_uncured);
res=res.map(r=>r.src==='E-APPLY S8'?{...r,ans:'CHANGE',why:'the gate change is already in the corrected text (another change wrote the same line; W3 2319)'}:r);const y=run(12,'reasoning\n'+counted,'gemini');console.log('plant: S8 cured because another change wrote the line -> '+y.p.drv_uncured);
