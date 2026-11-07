// pkgPSG (W3 2726 item 3): gate premise scope. A gate CHANGE over a count line answers a NOT APPLIED item whose refused send-back change was an
// E-PREM change. Until now the gate change was not held to the pkgPS test (rule 'E-GATE', not 'E-PREM'), so a gate answer could regrade a
// premise the E-PREM items never named and be applied and CURED (W3's control on 33222 grok G4: "CONCEDED LINKS: 5 -- premise 1 UNEXHIBITED").
// Fix, in the 6 gate-library nodes:
//  (1) gateCure2024: each gate change carries psrc, the sid of the send-back change its item refused (the gate item's own sid; none for K items).
//  (2) sbApply2024: a gate change whose psrc is an E-PREM change takes the pkgPS test, with the premises named by the E-PREM items on that
//      change's line. Every other gate change is applied as before.
// Base: pkgGSL/patched (graded PASS 2726, next write; = live s16 + pkgGSL). Run from wall2024/: node pkgPSG/build_PSG.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const NODES=['Gate Build','Gate Record','Alt Gate Build','Alt Gate Record','Alternate Merge Seat','Alternate Merge'];
const E=[
 ["add.push({seat,sid:x.gid,rule:'E-GATE',item:x.kind,line:gateLineFor2024(x,a.to.replace(/^[\"“]+|[\"”]+$/g,'')),ans:'CHANGE',to:a.to,why:a.why});",
  "add.push({seat,sid:x.gid,rule:'E-GATE',item:x.kind,line:gateLineFor2024(x,a.to.replace(/^[\"“]+|[\"”]+$/g,'')),ans:'CHANGE',to:a.to,why:a.why,...(x.sid?{psrc:x.sid}:{})}); /* pkgPSG: the refused send-back change */"],
 ["if(x.rule==='E-PREM'){const cu=map.has(o)?map.get(o).to:o;",
  "const __psg=x.rule==='E-GATE'&&x.psrc?ch.find(y=>y.sid===x.psrc&&y.rule==='E-PREM')||null:null; /* pkgPSG (W3 2726): a gate change for a refused E-PREM change takes the same scope test */\n  if(x.rule==='E-PREM'||__psg){const cu=map.has(o)?map.get(o).to:o;"],
 ["const nl=nrm(x.line);","const nl=nrm(__psg?__psg.line:x.line);"]];
const plan={source:'W3 2726 item 3',base:'pkgGSL/patched',nodes:[]};for(const d of ['base','patched'])fs.mkdirSync('pkgPSG/'+d,{recursive:true});
for(const n of NODES){const f=n.replace(/ /g,'_')+'.js';const s0=fs.readFileSync('pkgGSL/patched/'+f,'utf8');let s=s0;
 for(const [a,b] of E){const c=s.split(a).length-1;if(c!==1)throw new Error(n+': anchor x'+c+': '+a.slice(0,40));s=s.split(a).join(b);}
 new Function('$','$input','$json','$execution','$workflow',s);fs.writeFileSync('pkgPSG/base/'+f,s0);fs.writeFileSync('pkgPSG/patched/'+f,s);
 plan.nodes.push({name:n,file:f,base_sha:sha(s0),final_sha:sha(s)});console.log(n.padEnd(22),sha(s0),'->',sha(s));}
fs.writeFileSync('pkgPSG/plan_PSG.json',JSON.stringify(plan,null,1));
