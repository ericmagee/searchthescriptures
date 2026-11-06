// pkgUAP (run 33160 gemini removed by 4 uncured E-GATE items): an E-UNG send-back answer could not be applied when its flagged line is the
// placeholder "(no COLLISION POINTS line for D<n>)" (pkgUND raises E-UNG when D<n>'s only pair lines are graded STANDS, and its flagged line
// then names no line). The judge's CHANGE TO was refused "the flagged line is not in the judge text", the gate sent it back as E-APPLY,
// the judge changed again, was refused again, and each refusal counted in drv_uncured.
// Fix, in sbApply2024 (6 gate nodes): for an E-UNG item whose flagged line is not found, the CHANGE TO line replaces the judge's own line for
// the same pair (D<n> vs C<j>, by label) when there is one; when there is none, it is added after the last collision line (or after the
// COLLISION POINTS heading). Only a CHANGE TO for the item's own link D<n> is placed; anything else is refused as before.
// Base: pkgKWC/patched (= live 98daac9e for these 6 nodes; pkgOGR/pkgOGS touch none of them). Run from wall2024/: node pkgUAP/build_UAP.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const BASE='pkgKWC/patched',OUT='pkgUAP/patched';fs.mkdirSync(OUT,{recursive:true});const plan={base:BASE+' f7116fc (= live 98daac9e for these nodes)',nodes:[]};
const A="  if(!o){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the flagged line is not in the judge text',to});continue;}";
const B="  if(!o&&x.rule==='E-UNG'){const __n=(String(x.item||'').match(/\\bCOLLISION D(\\d+)\\b/)||[])[1];const __lk=sbLabel(to);if(__n&&__lk&&__lk.indexOf('D'+__n+' VS ')===0){ /* pkgUAP (33160 gemini S9, S11-S13): an E-UNG answer goes onto the judge's own line for its pair, or is added */\n"
 +"   o=lines.find(l=>sbLabel(l)===__lk)||null;if(!o){const __c=lines.filter(l=>/^D\\d+ VS C\\d+$/.test(String(sbLabel(l)||'')));const __at=__c.length?__c[__c.length-1]:(lines.find(l=>/^\\s*\\**\\s*COLLISION POINTS\\b/i.test(l))||null);\n"
 +"    if(__at){const p=map.get(__at);const c0=p?p.to:__at;map.set(__at,{sid:p?p.sid:x.sid,to:c0+'\\n'+to,over:p?p.over:[],forced:((p&&p.forced)||[]).concat(p?[x.sid]:[])});continue;}}}}\n"+A;
for(const f of ['Alternate_Merge.js','Alternate_Merge_Seat.js','Gate_Build.js','Gate_Record.js','Alt_Gate_Build.js','Alt_Gate_Record.js']){const s0=fs.readFileSync(BASE+'/'+f,'utf8');
 const n=s0.split(A).length-1;if(n!==1)throw new Error(f+': anchor '+n);const s=s0.replace(A,()=>B);new Function('$','$input','$json',s);fs.writeFileSync(OUT+'/'+f,s);
 plan.nodes.push({file:f,base_sha:sha(s0),final_sha:sha(s),edits:1});console.log(f.padEnd(26),sha(s0),'->',sha(s));}
fs.writeFileSync('pkgUAP/plan_UAP.json',JSON.stringify(plan,null,1));
