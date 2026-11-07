// pkgUNXS: the K-UNX reader unxSegs reads bare numbered entries and ends an entry at "Spared". Run from wall2024/: node pkgUNXS/build_UNXS.cjs
// Bases: the 6 gate-library nodes on pkgGSL2/patched, the other 16 on pkgASM/patched (chain s16 + GSL + PSG + UNXA + ASM + GSL2). One anchor: the unxSegs function.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const LIB=fs.readFileSync('pkgUNXS/unxs_lib.js','utf8');const OLD=/function unxSegs\(sec\)\{[^\n]*\n[^\n]*\n/g;
const SIX=['Gate Build','Gate Record','Alt Gate Build','Alt Gate Record','Alternate Merge Seat','Alternate Merge'];const asm=JSON.parse(fs.readFileSync('pkgASM/plan_ASM.json','utf8')).nodes;
const plan={source:'W2 (reader gap found in the pkgUNXA reconciliation, Wall 2730 item 4)',base6:'pkgGSL2/patched',base16:'pkgASM/patched',nodes:[]};fs.mkdirSync('pkgUNXS/patched',{recursive:true});
for(const n of asm){const six=SIX.includes(n.name);const b=six?'pkgGSL2/patched':'pkgASM/patched';const s0=fs.readFileSync(b+'/'+n.file,'utf8');const c=(s0.match(OLD)||[]).length;if(c!==1)throw new Error(n.name+': unxSegs x'+c);
 const s=s0.replace(OLD,()=>LIB+'\n');new Function('$','$input','$json','$execution',s);fs.writeFileSync('pkgUNXS/patched/'+n.file,s);plan.nodes.push({name:n.name,file:n.file,base:b,base_sha:sha(s0),final_sha:sha(s)});
 console.log(n.name.padEnd(28),b.padEnd(16),sha(s0),'->',sha(s));}
fs.writeFileSync('pkgUNXS/plan_UNXS.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes');
