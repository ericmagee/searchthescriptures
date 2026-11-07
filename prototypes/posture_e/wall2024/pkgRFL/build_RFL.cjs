// pkgRFL (W1 Wall 2677; W3 approved and queued Wall 2679): a CHANGE TO "RETRACTED: Dn vs Cm" on a flagged FORCED line for the same pair removes
// that FORCED line; the pair's collision line stays. 33197: chatgpt S31 (D1 vs C1), S33 (D4 vs C5) and gemini S2 (D2 vs C1) agreed under E-COL
// that their FORCED lines were wrong and wrote this form; E-APPLY refused all three ("no line form"), so the FORCED lines stayed.
// A FORCED line stays (NOT APPLIED, named) when its pair's collision line on the corrected text is still graded LINK BROKEN (ruling 411: a
// broken link rests on its FORCED line). Bases: pkgRSA/patched (67b74ac, graded PASS W3 2676). Run from wall2024/: node pkgRFL/build_RFL.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const NODES=['Gate Build','Gate Record','Alt Gate Build','Alt Gate Record','Alternate Merge Seat','Alternate Merge'];
const E=[
 ["if(!o){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the flagged line is not in the judge text',to});continue;}",
  "if(!o){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the flagged line is not in the judge text',to});continue;}"+
  "{const __rt=nrm(to).match(/^RETRACTED\\s*:\\s*(D\\d+)\\s+VS\\.?\\s+(C\\d+)\\s*\\.?$/i);const __fo=nrm(map.has(o)?map.get(o).to:o).match(/^\\s*(?:[-\\u2022]|\\d+[.)])?\\s*FORCED(?:\\s*\\(\\s*Commitment\\s+\\d+\\s*\\))?\\s*:\\s*(D\\d+)\\s+VS\\.?\\s+(C\\d+)\\b/i); /* pkgRFL (W3 2679): RETRACTED on a FORCED line of the same pair removes the FORCED line */"+
  "if(__rt&&__fo&&(__rt[1]+' VS '+__rt[2]).toUpperCase()===(__fo[1]+' VS '+__fo[2]).toUpperCase()){const p=map.get(o);map.set(o,{sid:x.sid,to:'',over:p&&p.sid!==x.sid?(p.over||[]).concat(p.sid):(p?p.over:[]),rfl:(__fo[1]+' VS '+__fo[2]).toUpperCase()});continue;}}"],
 ["{const P0=rcLines(build(map));const km=",
  "{const P9=rcLines(build(map));for(const [o9,c9] of [...map]){if(!c9.rfl)continue;const g9=P9.col.filter(z=>U(z.link)===c9.rfl).map(z=>z.grade);if(g9.some(g=>/LINK BROKEN$/.test(String(g||'')))){map.delete(o9);items.push({sid:c9.sid,kind:'NOT APPLIED',why:'the collision line of '+c9.rfl.replace(' VS ',' vs ')+' is still graded '+g9.find(g=>/LINK BROKEN$/.test(String(g||'')))+', and a broken link keeps its FORCED line (ruling 411; pkgRFL)',to:'RETRACTED: '+c9.rfl.replace(' VS ',' vs '),lines:[o9]});}}} /* pkgRFL */"+
  "{const P0=rcLines(build(map));const km="]];
fs.mkdirSync('pkgRFL/base',{recursive:true});fs.mkdirSync('pkgRFL/patched',{recursive:true});const plan={base:'pkgRSA/patched (67b74ac)',nodes:[]};
for(const n of NODES){const f=n.replace(/ /g,'_')+'.js';const s0=fs.readFileSync('pkgRSA/patched/'+f,'utf8');let s=s0;
 for(const [a,b] of E){const k=s.split(a).length-1;if(k!==1)throw new Error(n+': anchor x'+k+': '+a.slice(0,60));s=s.replace(a,()=>b);}
 new Function('$','$input','$json','$execution',s);fs.writeFileSync('pkgRFL/base/'+f,s0);fs.writeFileSync('pkgRFL/patched/'+f,s);
 plan.nodes.push({name:n,file:f,base_sha:sha(s0),final_sha:sha(s),edits:E.length});console.log(n.padEnd(22),sha(s0),'->',sha(s));}
fs.writeFileSync('pkgRFL/plan_RFL.json',JSON.stringify(plan,null,1));
