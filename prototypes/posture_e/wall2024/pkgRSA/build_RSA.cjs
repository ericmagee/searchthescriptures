// pkgRSA (W3 grade_33197: gemini removed on E-GATE G2 RESULT DIFFERS). sbApply2024 holds a RESULT change aside (resTo) and only checks it against
// the result derived from the corrected lines; it never counts it applied and never writes it, so the gate record reads "the gate change was not
// applied" even when the judge's RESULT equals the derived result. Fix: when they agree, the change is applied (its sid is in applied) and the
// judge's own RESULT line replaces the old one. When they differ, RESULT DIFFERS stands as before.
// Bases: pkgFCB/patched (graded PASS, W3 2667; built on live 1b49671d and pkgPTA part A). Run from wall2024/: node pkgRSA/build_RSA.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const NODES=['Gate Build','Gate Record','Alt Gate Build','Alt Gate Record','Alternate Merge Seat','Alternate Merge'];
const E=[["if(resTo){const rw=(U(resTo.to).match(/^RESULT\\s*:\\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null;if(rw!==res)items.push({sid:resTo.sid,kind:'RESULT DIFFERS',why:'the judge wrote '+(rw?'RESULT: '+rw:'a RESULT line the engine cannot read')+'; the result derived from its corrected lines is '+res,to:resTo.to});}",
 "let __rsOK=false; /* pkgRSA (W3 grade_33197): a RESULT change that agrees with the derived result is applied */if(resTo){const rw=(U(resTo.to).match(/^RESULT\\s*:\\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null;if(rw!==res)items.push({sid:resTo.sid,kind:'RESULT DIFFERS',why:'the judge wrote '+(rw?'RESULT: '+rw:'a RESULT line the engine cannot read')+'; the result derived from its corrected lines is '+res,to:resTo.to});else __rsOK=true;}"],
 ["const sids=[...new Set([...map.values()].flatMap(z=>[z.sid].concat(z.forced||[])))];","const sids=[...new Set([...map.values()].flatMap(z=>[z.sid].concat(z.forced||[])).concat(__rsOK?[resTo.sid]:[]))];"],
 ["if(P.result&&res!==res0)rp.push([P.result.raw,'RESULT: '+res+' -- '+why+': '+tag+'.']);","if(P.result&&(res!==res0||__rsOK))rp.push([P.result.raw,__rsOK?resTo.to:'RESULT: '+res+' -- '+why+': '+tag+'.']);"]];
fs.mkdirSync('pkgRSA/base',{recursive:true});fs.mkdirSync('pkgRSA/patched',{recursive:true});const plan={base:'pkgFCB/patched (7b8640b)',nodes:[]};
for(const n of NODES){const f=n.replace(/ /g,'_')+'.js';const s0=fs.readFileSync('pkgFCB/patched/'+f,'utf8');let s=s0;
 for(const [a,b] of E){const k=s.split(a).length-1;if(k!==1)throw new Error(n+': anchor x'+k+': '+a.slice(0,60));s=s.replace(a,()=>b);}
 new Function('$','$input','$json','$execution',s);fs.writeFileSync('pkgRSA/base/'+f,s0);fs.writeFileSync('pkgRSA/patched/'+f,s);
 plan.nodes.push({name:n,file:f,base_sha:sha(s0),final_sha:sha(s),edits:3});console.log(n.padEnd(22),sha(s0),'->',sha(s));}
fs.writeFileSync('pkgRSA/plan_RSA.json',JSON.stringify(plan,null,1));
