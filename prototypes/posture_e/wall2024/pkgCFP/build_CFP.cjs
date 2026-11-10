// pkgCFP rev 2 (W1; rev 1 + W2 d060adf6 Q13/Q7 and W3 d4c464be notes 1, 2, 4: no silent drop; a quote that fails the one-sentence test is passed as its longest standing part; merged label names both.
// pkgCFP rev 1 (W1; W3 enforcer gaps study, Proposal 1, anti-cheat part): Judge Contradiction Build also takes the anti-cheat check's SHOWN pairs
// (REVERSED, both quotes found) as candidates for the post-panel enforcer, which answers each and names its link; Judge Contradiction Record confirms by
// code as for any candidate, and a confirmed pair breaks the link under the operator's contradiction rule. One node; prompt text not grown.
//   node pkgCFP/build_CFP.cjs <fetch-back> <out parent>
const fs=require('fs');const [,,FB,OUT]=process.argv;const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};
let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;const n=d.nodes.find(x=>x.name==='Judge Contradiction Build');let s=n.parameters.jsCode;const s0=s;
const sub=(a,b,w)=>{const k=s.split(a).length-1;if(k!==1)die(w+': '+k+' hits');s=s.split(a).join(b);};
sub(`try{if($('QR Merge').isExecuted)`,
 `const __cfpAC='the anti-cheat check',__cfpFit=(q,ks)=>{for(const x of [q].concat(String(q).split(/\\.\\.\\.|…/).sort((a,b)=>b.length-a.length)))for(const k of ks)if(cecStands(x,F[CEC_RK[k]]))return [k,x.trim()];return null;};\ntry{if($('Anticheat Record').isExecuted){const A=($('Anticheat Record').first().json.acx||{}).reversed||{};for(const sd of ['D','C'])for(const r of A[sd]||[]){const side=sd==='D'?'DEFENDER':'CHALLENGER',P=CEC_PRE[side],e=__cfpFit(r.earlier_q,[P+'1',P+'2',P+'3']),c=__cfpFit(r.close_q,[P+'4']);if(e&&c)add(__cfpAC,side,e[0],e[1],P+'4',c[1],'code');}}}catch(e){} /* pkgCFP: anti-cheat pairs as candidates */\ntry{if($('QR Merge').isExecuted)`,'A1');
sub(`by:(c.by==='question'?`,`by:(c.by==='code'?c.seats.join(', ')+' (found by the system; both quotes checked)':c.by==='question'?`,'A2');
sub(`:'the judges\\' CONTRADICTION lines ('+c.seats.join(', ')+')'),why:''}));`,`:'the judges\\' CONTRADICTION lines ('+c.seats.filter(x=>x!==__cfpAC).join(', ')+')'+(c.seats.includes(__cfpAC)?' and '+__cfpAC+' (found by the system; both quotes checked)':'')),why:''}));`,'A5');
sub(`each was named by a judge after it read the debate.`,`each names who found it.`,'A3');
new Function('$','$input',s);n.parameters.jsCode=s;fs.writeFileSync(OUT,JSON.stringify(d));
console.log('Judge Contradiction Build '+s0.length+' -> '+s.length+' ('+(s.length-s0.length>=0?'+':'')+(s.length-s0.length)+')');
