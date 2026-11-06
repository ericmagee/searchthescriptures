// pkgCL (run 33025 chatgpt G1 to G7). Run from wall2024/: node pkgCL/build_CL.cjs
// A send-back change refused as "no line form" (or a NOT HELD written under CHANGE TO) became a gate item NOT APPLIED with lines:[], so at the
// gate gateLineFor2024 found no line and every corrected answer was refused again as "the flagged line is not in the judge text" (33025 chatgpt:
// S9, S14 to S17, S20, S21 wrote only the grade word; at the gate it wrote whole lines, all refused). The refusal now carries the line it
// refused (as pkgCP does for "drops the collision"), so a whole corrected line at the gate applies.
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const R=[["why:'a NOT HELD dispute written under CHANGE TO, not a line change',to});continue;}","why:'a NOT HELD dispute written under CHANGE TO, not a line change',to,lines:o?[o]:[]});continue;}"],
 ["why:'the CHANGE TO line has no line form the engine reads',to});continue;}","why:'the CHANGE TO line has no line form the engine reads',to,lines:[o]});continue;} /* pkgCL (33025 chatgpt): the gate item names the refused line */"]];
const NODES=['Gate_Build','Alt_Gate_Build','Gate_Record','Alt_Gate_Record','Alternate_Merge','Alternate_Merge_Seat'];
fs.mkdirSync('pkgCL/patched',{recursive:true});const plan={base:'pkgCP2/patched (90d396c)',nodes:[]};
for(const n of NODES){let s=rd('pkgCP2/patched/'+n+'.js');const b=s;for(const [a,c] of R){const k=s.split(a).length-1;if(k!==1)throw new Error(n+': anchor count '+k+' for '+a.slice(0,40));s=s.split(a).join(c);}
 fs.writeFileSync('pkgCL/patched/'+n+'.js',s);plan.nodes.push({file:n+'.js',name:n.replace(/_/g,' '),base_sha:sha(b),final_sha:sha(s)});}
fs.writeFileSync('pkgCL/plan_CL.json',JSON.stringify(plan,null,1));plan.nodes.forEach(x=>console.log(x.name,x.base_sha,'->',x.final_sha));
