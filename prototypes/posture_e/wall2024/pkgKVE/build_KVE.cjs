// pkgKVE (W3, 33160 chatgpt K-V DEFENDER premise 5): a VOID ruling quoting charge words that hold an embedded quotation was not read as
// quoting the charge. The charge 'The keystone requires seed "according to the flesh" through a line the rows do not name.' is read with its
// quoted passages removed ("... requires seed | through a line ..."), so the judge's quote "requires seed 'according to the flesh' through a
// line the rows do not name" matched nothing. Fix: a quote also counts when it stands in the whole charge text (quotes kept) and is not wholly
// inside one of the charge's own quoted passages (a judge quoting only the debater's quote still does not count).
// Base: pkgUAP/patched for its 6 gate nodes, pkgKWC/patched for the other 13 library nodes (= live 98daac9e + pkgUAP), and pkgKVE/live for the 3 K-V nodes pkgKWC does not touch
// (Panel Payloads, Alternate Payloads, Extract Independent Verdict, copied from prewrite_ogs_57c7fffd.json = live). Run from wall2024/.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const OUT='pkgKVE/patched';fs.mkdirSync(OUT,{recursive:true});const plan={base:'pkgUAP/patched (6 gate nodes) + pkgKWC/patched (13) + live 57c7fffd (3)',nodes:[]};
const E=[["return {n:k+1,charge:' '+kvNorm(ch)+' '};});}","return {n:k+1,charge:' '+kvNorm(ch)+' ',full:' '+kvNorm(pre)+' ',qs:kvQuotes(pre).map(kvNorm)};});} /* pkgKVE */"],
 ["const q=c?kvQuotes(seg).find(q=>c.charge.includes(' '+kvNorm(q)+' ')):null;","const q=c?kvQuotes(seg).find(q=>c.charge.includes(' '+kvNorm(q)+' ')||(c.full&&c.full.includes(' '+kvNorm(q)+' ')&&!(c.qs||[]).some(z=>(' '+z+' ').includes(' '+kvNorm(q)+' ')))):null; /* pkgKVE (33160 chatgpt premise 5): charge words holding an embedded quote */"]];
for(const f of fs.readdirSync('pkgKWC/patched').filter(f=>f.endsWith('.js')).concat(fs.readdirSync('pkgKVE/live'))){const base=fs.existsSync('pkgUAP/patched/'+f)?'pkgUAP/patched':fs.existsSync('pkgKWC/patched/'+f)?'pkgKWC/patched':'pkgKVE/live';const s0=fs.readFileSync(base+'/'+f,'utf8');let s=s0;
 for(const [a,b] of E){const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor '+n+': '+a.slice(0,50));s=s.replace(a,()=>b);}
 new Function('$','$input','$json',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base,base_sha:sha(s0),final_sha:sha(s),edits:E.length});console.log(f.padEnd(30),base.padEnd(16),sha(s0),'->',sha(s));}
fs.writeFileSync('pkgKVE/plan_KVE.json',JSON.stringify(plan,null,1));
