// pkgGD (W3 2315; built by W2). Run from wall2024/: node pkgGD/build_GD.cjs
// (a) One drvCheck text. The cure library's drvCheck (19 nodes) was older than the Payloads drvCheck (Panel Payloads, Alternate Payloads, EIV):
//     it lacked the ruling 398 branch (a BROKEN line resting only on UNPROVEN presses raises no K-G1/K-G4) and the ruling 411 branch (a BROKEN
//     line with a FORCED line for its link raises no K-G1/K-G4). The gate re-read (gateNewK2024) calls the library drvCheck, so the gate could
//     raise K-G4 on a line the panel exempts. The library drvCheck is replaced with the Payloads text, and __kfHas (its helper) is added.
// (b) When a gate FORCED line cures a RULE K-G4 item (gateForced2024, pkgGF), that FORCED line is added as a gate change (sid G<n>F,
//     forced_add) and E-APPLY writes it after its collision line, so the stored judgment carries it (ruling 411's form). A CHANGE TO that is
//     itself a FORCED line on a RULE K-G4 item no longer replaces the collision line; the FORCED path writes it beside the line instead.
// Bases: pkgGF/patched for the 6 gate-library nodes, pkgGK/patched for the other 13; pkgKIND/final/Panel_Payloads.js for the drvCheck text.
const fs=require('fs');const crypto=require('crypto');const {fnText}=require('./fn.cjs');
const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const rep=(s,a,b,name)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(name+': anchor count '+n+' for '+a.slice(0,70));return s.split(a).join(b);};
const PAY=rd('pkgKIND/final/Panel_Payloads.js');const DRV=fnText(PAY,'drvCheck');const KF=fnText(PAY,'__kfHas');
for(const n of ['Alternate_Payloads','Extract_Independent_Verdict']){const s=rd('pkgKIND/final/'+n+'.js');if(fnText(s,'drvCheck')!==DRV||fnText(s,'__kfHas')!==KF)throw new Error('Payloads drvCheck differs in '+n);}
const GATE=['Gate_Build','Alt_Gate_Build','Gate_Record','Alt_Gate_Record','Alternate_Merge','Alternate_Merge_Seat'];
const CURE=['Alternate_Build','Alternate_Cure_Build','Alternate_Cure_Normalize','Cure_Build','Cure_Check','Cure_Normalize','Panel_Cure_Build_1','Panel_Cure_Build_2','Panel_Cure_Build_3','Panel_Cure_Check','Panel_Cure_Normalize_1','Panel_Cure_Normalize_2','Panel_Cure_Normalize_3'];
// (b) gateCure2024: the FORCED add, and a FORCED CHANGE TO is not a line replacement
const GC_A="for(const x of G){const a=A[x.gid];if(a&&a.ans==='CHANGE'&&a.to)add.push(";
const GC_B="for(const x of G){const a=A[x.gid];if(a&&a.ans==='CHANGE'&&a.to&&!(x.kind==='RULE K-G4'&&gateIsForced2024(a.to)))add.push(";
const GC2_A=" const wd2299=";
const GC2_B=" for(const x of G){if(x.kind!=='RULE K-G4'||!A[x.gid])continue;const g=gateForced2024(x,A[x.gid],ctx);if(g&&g.cured)add.push({seat,sid:x.gid+'F',rule:'E-GATE',item:'FORCED',line:(x.lines||[])[0]||'',ans:'CHANGE',to:g.line,why:'the FORCED line that cured '+x.gid+', written after its collision line (ruling 411)',forced_add:true});} /* pkgGD (W3 2315 b) */\n const wd2299=";
const HELP="// pkgGD (W3 2315 b): a GATE answer that is itself a FORCED line (ruling 411's form)\nfunction gateIsForced2024(s){return KF_LINE.test(String(s==null?'':s).replace(/\\\\+\"/g,'\"').replace(/[*_`]+/g,'').trim());}\n";
// (b) sbApply2024: a forced_add change is written after its collision line, which keeps its grade
const SA_A="for(const x of ch){const to=one(";
const SA_B="for(const x of ch){if(x.forced_add){ /* pkgGD (W3 2315 b): the gate FORCED line goes after its collision line; the collision line stays */\n"
 +"  const toF=one(String(x.to==null?'':x.to).replace(/\\\\+\"/g,'\"')).replace(/[*_`]+/g,'');const kf=toF.match(KF_LINE);const lk=kf?kf[1].toUpperCase().replace(/\\s+VS\\.?\\s+/,' VS '):null;const cur=l=>map.has(l)?map.get(l).to:l;const top=l=>String(cur(l)).split('\\n')[0];\n"
 +"  let o=find(x.line);if(!o){const n=nrm(x.line);for(const [o2,c2] of map){if(n&&nrm(c2.to)===n){o=o2;break;}}}if(!o&&lk)o=lines.find(l=>sbLabel(top(l))===lk)||null;\n"
 +"  if(!kf||!o||sbLabel(top(o))!==lk){items.push({sid:x.sid,kind:'NOT APPLIED',why:kf?'the collision line of '+kf[1]+' for the FORCED line is not in the judge text':'the FORCED line is not in the FORCED form',to:x.to});continue;}\n"
 +"  const c0=cur(o);if(nrm(c0).includes(nrm(toF)))continue;const pre=(String(o).match(/^\\s*(?:[-\\u2022]\\s+|\\d+[.)]\\s+)?/)||[''])[0];const p=map.get(o);map.set(o,{sid:p?p.sid:x.sid,to:c0+'\\n'+pre+toF,over:p?p.over:[],forced:((p&&p.forced)||[]).concat(x.sid)});continue;}\n"
 +"  const to=one(";
const SID_A="const sids=[...new Set([...map.values()].map(z=>z.sid))];";
const SID_B="const sids=[...new Set([...map.values()].flatMap(z=>[z.sid].concat(z.forced||[])))];";
fs.mkdirSync('pkgGD/patched',{recursive:true});
const plan={base:{gate:'pkgGF/patched (4b5f1af)',cure:'pkgGK/patched (0485e2b)',drvCheck:'pkgKIND/final/Panel_Payloads.js'},drvCheck_sha:sha(DRV),kfHas_sha:sha(KF),nodes:[]};
for(const n of GATE.concat(CURE)){const base=(GATE.includes(n)?'pkgGF':'pkgGK')+'/patched/'+n+'.js';const b=rd(base);let s=b;
 const old=fnText(s,'drvCheck');if(!old||s.split(old).length!==2)throw new Error(n+': drvCheck not found once');if(s.includes('function __kfHas('))throw new Error(n+': __kfHas already present');
 s=s.replace(old,()=>KF+'\n'+DRV);
 if(GATE.includes(n)){s=rep(s,GC_A,GC_B,n+' gc');s=rep(s,GC2_A,GC2_B,n+' gc2');s=rep(s,'function gateCure2024(',HELP+'function gateCure2024(',n+' help');s=rep(s,SA_A,SA_B,n+' sa');s=rep(s,SID_A,SID_B,n+' sid');}
 fs.writeFileSync('pkgGD/patched/'+n+'.js',s);plan.nodes.push({file:n+'.js',name:n.replace(/_/g,' '),base,base_sha:sha(b),final_sha:sha(s),old_drvCheck_sha:sha(old)});}
fs.writeFileSync('pkgGD/plan_GD.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes');plan.nodes.forEach(x=>console.log('  '+x.name+' '+x.base_sha+' -> '+x.final_sha));
