// pkgFRP (W1, 11-08; 33731 grok S11, W2/W3 report Wall 3238): a "RETRACTED: Dn vs Cm" send-back answer was refused "the flagged line is not
// in the judge text" when the item quoted a FORCED line the text no longer holds word for word (a second FORCED line for the same pair,
// or one an earlier item of the same reply already retracted). sbApply2024 now finds the FORCED line by its pair:
//  - the pair's FORCED line was already retracted by an earlier item of this reply: this item is recorded as covered by it (over);
//  - else exactly one FORCED line for the pair is in the text: the retraction applies to it (the existing RETRACTED path, ruling 411 and pkgRFL checks unchanged).
// Any other answer is unchanged.
// Usage (from wall2024/): node pkgFRP/build_FRP.cjs [base strip, default pkgLIB/strip_A2R_KS3Q] [out strip, default pkgLIB/strip_A2R_KS3Q_FRP]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const BASE=process.argv[2]||'pkgLIB/strip_A2R_KS3Q';const OUT=process.argv[3]||'pkgLIB/strip_A2R_KS3Q_FRP';
const A="if(!o){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the flagged line is not in the judge text',to});continue;}";
const B="if(!o){const __rt=nrm(to).match(/^RETRACTED\\s*:\\s*(D\\d+)\\s+VS\\.?\\s+(C\\d+)\\s*\\.?$/i);if(__rt){const __pk=(__rt[1]+' VS '+__rt[2]).toUpperCase();const __FO=/^\\s*(?:[-\\u2022]|\\d+[.)])?\\s*FORCED(?:\\s*\\(\\s*Commitment\\s+\\d+\\s*\\))?\\s*:\\s*(D\\d+)\\s+VS\\.?\\s+(C\\d+)\\b/i;const __pf=l=>{const m=nrm(l).match(__FO);return m?(m[1]+' VS '+m[2]).toUpperCase():null;}; /* pkgFRP */\n   const __dn=[...map.values()].find(v=>v&&v.rfl===__pk);if(__dn){__dn.over=(__dn.over||[]).concat(x.sid);continue;}const __c=lines.filter(l=>!(map.has(l)&&map.get(l).to==='')&&__pf(map.has(l)?map.get(l).to:l)===__pk);if(__c.length===1)o=__c[0];}}\n  "+A;
fs.rmSync(OUT,{recursive:true,force:true});fs.mkdirSync(OUT+'/patched',{recursive:true});const plan={base:BASE,out:OUT,patched:[],copied:[]};
for(const f of fs.readdirSync(BASE+'/patched').filter(f=>f.endsWith('.js'))){const s=fs.readFileSync(BASE+'/patched/'+f,'utf8');const k=s.split(A).length-1;
 if(k>1)throw new Error(f+': anchor x'+k);const t=k?s.replace(A,()=>B):s;fs.writeFileSync(OUT+'/patched/'+f,t);(k?plan.patched:plan.copied).push({file:f,base_sha:sha(s),sha:sha(t)});}
fs.writeFileSync('pkgFRP/plan_FRP'+(OUT.endsWith('strip_A2R_KS3Q_FRP')?'':'_'+OUT.split('/').pop())+'.json',JSON.stringify(plan,null,1));
console.log('patched',plan.patched.length,'copied',plan.copied.length);
