// pkgCFP rev 1 (W1; W3 enforcer gaps study, Proposal 1, anti-cheat part): Judge Contradiction Build also takes the anti-cheat check's SHOWN pairs
// (REVERSED, both quotes found) as candidates for the post-panel enforcer, which answers each and names its link; Judge Contradiction Record confirms by
// code as for any candidate, and a confirmed pair breaks the link under the operator's contradiction rule. One node; prompt text not grown.
//   node pkgCFP/build_CFP.cjs <fetch-back> <out parent>
const fs=require('fs');const [,,FB,OUT]=process.argv;const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};
let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;const n=d.nodes.find(x=>x.name==='Judge Contradiction Build');let s=n.parameters.jsCode;const s0=s;
const sub=(a,b,w)=>{const k=s.split(a).length-1;if(k!==1)die(w+': '+k+' hits');s=s.split(a).join(b);};
sub(`try{if($('QR Merge').isExecuted)`,
 `try{if($('Anticheat Record').isExecuted){const A=($('Anticheat Record').first().json.acx||{}).reversed||{};for(const sd of ['D','C'])for(const r of A[sd]||[]){const side=sd==='D'?'DEFENDER':'CHALLENGER',er=[1,2,3].map(i=>CEC_PRE[side]+i).find(k=>cecStands(r.earlier_q,F[CEC_RK[k]]));if(er)add('the anti-cheat check',side,er,r.earlier_q,CEC_PRE[side]+'4',r.close_q,'code');}}}catch(e){} /* pkgCFP: the anti-cheat check's shown pairs are candidates */\ntry{if($('QR Merge').isExecuted)`,'A1');
sub(`by:(c.by==='question'?`,`by:(c.by==='code'?c.seats.join(', ')+' (found by the system; both quotes checked)':c.by==='question'?`,'A2');
sub(`each was named by a judge after it read the debate.`,`each names who found it.`,'A3');
new Function('$','$input',s);n.parameters.jsCode=s;fs.writeFileSync(OUT,JSON.stringify(d));
console.log('Judge Contradiction Build '+s0.length+' -> '+s.length+' ('+(s.length-s0.length>=0?'+':'')+(s.length-s0.length)+')');
