// pkgGSL2 (W3 2731 item 4): supBy names the last APPLIED later change in a line's group, not the last change. A NOT APPLIED gate change is
// superseded when a later gate change of the same judge on the same line was applied (the last applied change wins). False uncure only; never cures more
// than an applied rewrite of the same line. Base: BASE (default pkgASM/patched = s16 + GSL + PSG + UNXA + ASM); the edit is one anchor and holds on every base.
// Run from wall2024/: node pkgGSL2/build_GSL2.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const BASE=process.env.BASE||'pkgASM/patched';
const A="const supBy=new Map();for(const z of add){if(z.forced_add)continue;const g=grpOf(z.sid);const w=g[g.length-1];if(w!==z.sid)supBy.set(z.sid,w);}";
const B="const supBy=new Map();for(const z of add){if(z.forced_add)continue;const g=grpOf(z.sid);const w=g.slice(g.indexOf(z.sid)+1).filter(s=>applied.has(s)).pop();if(w)supBy.set(z.sid,w);} /* pkgGSL2 (W3 2731 4): the last APPLIED later change of the line */";
const SIX=['Gate Build','Gate Record','Alt Gate Build','Alt Gate Record','Alternate Merge Seat','Alternate Merge'];const plan={source:'W3 2731 item 4',base:BASE,nodes:[]};
fs.mkdirSync('pkgGSL2/base',{recursive:true});fs.mkdirSync('pkgGSL2/patched',{recursive:true});
for(const n of SIX){const f=n.replace(/ /g,'_')+'.js';const s0=fs.readFileSync(BASE+'/'+f,'utf8');const c=s0.split(A).length-1;if(c!==1)throw new Error(n+': anchor x'+c);
 const i=s0.indexOf(A),j=s0.indexOf('const applied=new Set(',s0.lastIndexOf('function gateCure2024',i));if(!(j>0&&j<i))throw new Error(n+': applied is not defined before supBy');
 const s=s0.replace(A,()=>B);new Function('$','$input','$json','$execution',s);fs.writeFileSync('pkgGSL2/base/'+f,s0);fs.writeFileSync('pkgGSL2/patched/'+f,s);
 plan.nodes.push({name:n,file:f,base_sha:sha(s0),final_sha:sha(s)});console.log(n.padEnd(22),sha(s0),'->',sha(s));}
fs.writeFileSync('pkgGSL2/plan_GSL2.json',JSON.stringify(plan,null,1));
