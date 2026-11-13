// pkgAJN replay. node replay.cjs <parent workflow json> <target workflow json> [data dir]
// Loads ABS and ECL from the rebuilt "Send Back Record" (cure) and "Send Back Build" (check) sources of each workflow,
// and replays the full stored population: every E-ANS MEETS line the absence check reads (enforcer_check) and every
// send-back cured under "ABSENCE CHECK ENFORCED". Reports old-vs-stored fidelity and every old-vs-new difference.
const fs=require('fs');const {load}=require(__dirname+'/mods.cjs');
const [,,P,T,DD]=process.argv;const D=(DD||'/mnt/project-files/wall2024/pkgAJN')+'/';
const wf=f=>{const W=JSON.parse(fs.readFileSync(f,'utf8'));return (W.nodes||W.workflow.nodes).find(n=>n.name==='Shared Library').parameters.jsCode;};
const OLD={cure:load(wf(P),'Send Back Record'),check:load(wf(P),'Send Back Build')},NEW={cure:load(wf(T),'Send Back Record'),check:load(wf(T),'Send Back Build')};
const ctx={rows:JSON.parse(fs.readFileSync(D+'kjv_rows.json','utf8')),ow:[],lex:[]};
const chk=JSON.parse(fs.readFileSync(D+'pop_check.json','utf8')),cur=JSON.parse(fs.readFileSync(D+'pop_cure.json','utf8'));
// check side
let nC=0,nullC=0;const dC=[];
for(const r of chk){if(r.fl==null){nullC++;continue;}nC++;const id={rule:'E-ANS',grade:'MEETS',flagged_line:r.fl};const a=OLD.check.ABS.check(id,ctx),b=NEW.check.ABS.check(id,ctx);
 if(a.raise!==b.raise||a.fit!==b.fit||a.absence!==b.absence)dC.push({id:r.id,run:r.run,seat:r.seat,old:{raise:a.raise,fit:a.fit,abs:a.absence},new:{raise:b.raise,fit:b.fit,abs:b.absence}});}
// cure side
const parse=resp=>{let s=String(resp||'').replace(/^\s*\[FORM NOTE:[^\]]*\]\s*/,'');const parts=s.split(' || ');const h=(parts[1]||'').trim();
 if(/^CHANGE TO:/i.test(h))return {ans:'CHANGE',to:h.replace(/^CHANGE TO:\s*/i,''),why:parts.slice(2).join(' || ')};if(/^KEEP\b/i.test(h))return {ans:'KEEP',why:parts.slice(2).join(' || ')};return {ans:'NO ANSWER'};};
let nU=0,nullU=0,fidOk=0;const fid=[],dU=[];
for(const r of cur){if(r.resp==null){nullU++;continue;}nU++;const it={rule:r.rule};const a=parse(r.resp);const o=OLD.cure.ABS.cure(it,a,ctx),n=NEW.cure.ABS.cure(it,a,ctx);
 const stored=(String(r.cr||'').match(/CURE \(ABSENCE CHECK ENFORCED, pkgABS\): (CURED|UNCURED)/)||[])[1]||'?';
 if(o.status===stored)fidOk++;else fid.push({id:r.id,run:r.run,seat:r.seat,stored,old:o.status,why:o.why.slice(0,160)});
 if(o.status!==n.status||o.why!==n.why)dU.push({id:r.id,run:r.run,seat:r.seat,rule:r.rule,old:o.status+' -- '+o.why.slice(0,140),new:n.status+' -- '+n.why.slice(0,140)});}
console.log('CHECK SIDE: E-ANS MEETS lines read',nC,'| NULL lines',nullC,'| old/new differences',dC.length);dC.forEach(x=>console.log('  ',JSON.stringify(x)));
console.log('CURE SIDE: absence-cure send-backs read',nU,'| NULL replies',nullU,'| old-code replay = stored status',fidOk+'/'+nU);fid.forEach(x=>console.log('   FIDELITY MISMATCH',JSON.stringify(x)));
console.log('CURE SIDE old/new differences',dU.length);dU.forEach(x=>console.log('  ',JSON.stringify(x)));
