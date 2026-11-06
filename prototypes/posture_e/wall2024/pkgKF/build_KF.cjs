// pkgKF (W3 2347). Run from wall2024/: node pkgKF/build_KF.cjs
// The gate K re-read (gateNewK2024) ran only drvCheck on the corrected judgment, so a FORCED line that a send-back or gate change wrote
// was never put to the K-F test. The panel K check runs kfLines (K-F): each FORCED quotation must be found in the round it names, and the
// FAILS quotation in the ANSWER round. The gate re-read now runs kfLines on the text before and after the changes, and a K-F item that only
// the corrected text raises is a new gate item. K-F is TRIAL, so the new item stays record-only (W3 2341). It is not run when the rounds
// could not be read (every quotation would fail).
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const A="const D=drvCheck(T,F.conceded_links,F.challenger_conceded_links,F.defense_standing,F.challenge_standing,!!ctx.ask,ctx.DL||[]);MK=D.marks||[];return D.items||[];};";
const B="const D=drvCheck(T,F.conceded_links,F.challenger_conceded_links,F.defense_standing,F.challenge_standing,!!ctx.ask,ctx.DL||[]);MK=D.marks||[];const its=(D.items||[]).slice();\n"
 +"  if(ctx.R&&Object.keys(ctx.R).length){const F9=kfLines(T,ctx.R);(F9.items||[]).forEach(x=>its.push(x));MK=MK.concat(F9.marks||[]);} /* pkgKF (W3 2347): the K-F test on the corrected judgment */\n"
 +"  return its;};";
const NODES=['Gate_Build','Alt_Gate_Build','Gate_Record','Alt_Gate_Record','Alternate_Merge','Alternate_Merge_Seat'];
fs.mkdirSync('pkgKF/patched',{recursive:true});const plan={base:'pkgFQ/patched (74ffe3e)',nodes:[]};
for(const n of NODES){const b=rd('pkgFQ/patched/'+n+'.js');const k=b.split(A).length-1;if(k!==1)throw new Error(n+': anchor count '+k);if(!b.includes('function kfLines('))throw new Error(n+': no kfLines');
 const s=b.split(A).join(B);fs.writeFileSync('pkgKF/patched/'+n+'.js',s);plan.nodes.push({file:n+'.js',name:n.replace(/_/g,' '),base_sha:sha(b),final_sha:sha(s)});}
fs.writeFileSync('pkgKF/plan_KF.json',JSON.stringify(plan,null,1));plan.nodes.forEach(x=>console.log(x.name,x.base_sha,'->',x.final_sha));
