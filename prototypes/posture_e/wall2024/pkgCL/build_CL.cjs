// pkgCL (run 33025 chatgpt G1 to G7). Run from wall2024/: node pkgCL/build_CL.cjs
// A send-back change refused as "no line form" (or a NOT HELD written under CHANGE TO) became a gate item NOT APPLIED with lines:[], so at the
// gate gateLineFor2024 found no line and every corrected answer was refused again as "the flagged line is not in the judge text" (33025 chatgpt:
// S9, S14 to S17, S20, S21 wrote only the grade word; at the gate it wrote whole lines, all refused). The refusal now carries the line it
// refused (as pkgCP does for "drops the collision"), so a whole corrected line at the gate applies.
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const R=[["why:'a NOT HELD dispute written under CHANGE TO, not a line change',to});continue;}","why:'a NOT HELD dispute written under CHANGE TO, not a line change',to,lines:o?[o]:[]});continue;}"],
 ["why:'the CHANGE TO line has no line form the engine reads',to});continue;}","why:'the CHANGE TO line has no line form the engine reads',to,lines:[o]});continue;} /* pkgCL (33025 chatgpt): the gate item names the refused line */"]];
R.push(["else if(x.kind==='NOT APPLIED'){cured=a.ans==='KEEP'||applied.has(x.gid);why=a.ans==='KEEP'?'KEEP: the change stays unapplied':(cured?'the gate change was applied':'the gate change was not applied');}",
 "else if(x.kind==='NOT APPLIED'){const dup=a.ans==='CHANGE'&&!applied.has(x.gid)&&!((R2.R1&&R2.R1.items)||[]).some(z=>z&&z.sid===x.gid)&&gateStands2024(a.to,R2.T1); /* pkgCL (33025 chatgpt G6/G7): another gate change wrote the same line (W3 2319, now for NOT APPLIED items) */cured=a.ans==='KEEP'||applied.has(x.gid)||dup;why=a.ans==='KEEP'?'KEEP: the change stays unapplied':(applied.has(x.gid)?'the gate change was applied':dup?'the gate change is already in the corrected text (another change wrote the same line; W3 2319)':'the gate change was not applied');}"]);
R.push(["'the FORCED line is not in the FORCED form',to:x.to});continue;}","'the FORCED line is not in the FORCED form',to:x.to,lines:o?[o]:[]});continue;} /* pkgCL (W3 grade_33025 s.2): every refusal with a found line carries it */"]);
const NODES=['Gate_Build','Alt_Gate_Build','Gate_Record','Alt_Gate_Record','Alternate_Merge','Alternate_Merge_Seat'];
fs.mkdirSync('pkgCL/patched',{recursive:true});const plan={base:'pkgCP2/patched (90d396c)',nodes:[]};
for(const n of NODES){let s=rd('pkgCP2/patched/'+n+'.js');const b=s;for(const [a,c] of R){const k=s.split(a).length-1;if(k!==1)throw new Error(n+': anchor count '+k+' for '+a.slice(0,40));s=s.split(a).join(c);}
 fs.writeFileSync('pkgCL/patched/'+n+'.js',s);plan.nodes.push({file:n+'.js',name:n.replace(/_/g,' '),base_sha:sha(b),final_sha:sha(s)});}
fs.writeFileSync('pkgCL/plan_CL.json',JSON.stringify(plan,null,1));plan.nodes.forEach(x=>console.log(x.name,x.base_sha,'->',x.final_sha));
