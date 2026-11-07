// pkgUNXW (W3 2738): (1) a K-UNX item (plain, K-UNX-A or E-ASM) CURED by a CORRECTED COUNT is written to the count line and columns, as K-G1/K-G3 are
// (cureSet); (2) the plain K-UNX STATEMENT cure reads a layer as missing only when the statement says so (unxLack). Base: pkgUNXS/patched (19 cure nodes).
// Run from wall2024/: node pkgUNXW/build_UNXW.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const LIB=fs.readFileSync('pkgUNXW/unxw_lib.js','utf8');
const E=[['lib','function unxNamed(',LIB+'function unxNamed('],
 ['cure',"if(x.rule==='K-UNX'){const st=stmtOf(x);const nm=st?unxNamed(st,x.kinds).missing:[];","if(x.rule==='K-UNX'){const st=stmtOf(x);const nm=st?unxLack(st,x.kinds).missing:[]; /* pkgUNXW: named as missing */"],
 ['write',"(x.rule==='K-V'&&x.status==='CURED'&&/^counted/.test(String(x.why||'')))||x.rule==='K-LB'));","(x.rule==='K-V'&&x.status==='CURED'&&/^counted/.test(String(x.why||'')))||x.rule==='K-LB'||(x.rule==='K-UNX'&&x.status==='CURED'&&/CORRECTED COUNT \\d+ takes the premise out/.test(String(x.why||''))))); /* pkgUNXW (W3 2738): the judge's own count withdrawal is written */"]];
const plan={source:'W3 2738 item 2',base:'pkgUNXS/patched',nodes:[]};fs.mkdirSync('pkgUNXW/patched',{recursive:true});
for(const f of fs.readdirSync('pkgUNXS/patched').sort()){const s0=fs.readFileSync('pkgUNXS/patched/'+f,'utf8');if(!s0.includes(E[1][1]))continue;let s=s0;
 for(const [k,a,b] of E){const c=s.split(a).length-1;if(c!==1)throw new Error(f+' '+k+' x'+c);s=s.replace(a,()=>b);}
 new Function('$','$input','$json','$execution',s);fs.writeFileSync('pkgUNXW/patched/'+f,s);plan.nodes.push({file:f,base_sha:sha(s0),final_sha:sha(s)});console.log(f.padEnd(30),sha(s0),'->',sha(s));}
fs.writeFileSync('pkgUNXW/plan_UNXW.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes');
