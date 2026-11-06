// pkgSLA (W3 Wall 2644; run 33175 chatgpt G1 and sol G1): a CHANGE TO whose flagged line is not in the judge text is applied over the one judge
// line that carries the same label (CHALLENGER CONCEDED LINKS, CONCEDED LINKS, a STANDING line, KEYSTONE, CLAUSE, or one collision pair).
// None or more than one such line: refused as before. Every later check (line form, pkgPS, pkgCM, ...) still runs on the found line.
// Base: the 6 sbApply2024 nodes from the live fetch-back 22e92b40 (n21; pkgSLA/base/). Run from wall2024/: node pkgSLA/build_SLA.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const OUT='pkgSLA/patched';fs.mkdirSync(OUT,{recursive:true});const plan={base:'live 22e92b40 (fetchback_n21.json)',nodes:[]};
const A="  if(!o){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the flagged line is not in the judge text',to});continue;}";
const B="  if(!o){const __lk=sbLabel(to);if(__lk){const __c=lines.filter(l=>sbLabel(l)===__lk);if(__c.length===1)o=__c[0];}} /* pkgSLA (W3 2644; 33175 chatgpt G1, sol G1): the flagged line is not in the text (a K-V item flags no judge line, or its quotes are escaped once more): the change goes over the one judge line with its label */\n"+A;
for(const f of ['Gate_Build.js','Gate_Record.js','Alt_Gate_Build.js','Alt_Gate_Record.js','Alternate_Merge.js','Alternate_Merge_Seat.js']){
 const s0=fs.readFileSync('pkgSLA/base/'+f,'utf8');const n=s0.split(A).length-1;if(n!==1)throw new Error(f+': anchor '+n);const s=s0.replace(A,()=>B);
 new Function('$','$input','$json','$execution',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base_sha:sha(s0),final_sha:sha(s),edits:1});console.log(f.padEnd(26),sha(s0),'->',sha(s));}
fs.writeFileSync('pkgSLA/plan_SLA.json',JSON.stringify(plan,null,1));
