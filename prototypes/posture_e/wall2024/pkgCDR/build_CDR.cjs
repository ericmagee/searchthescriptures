// pkgCDR rev 1 (W1; item A countermeasure, coordinator 02:22Z and 02:29Z 11-10; W1 Wall 3950, W3 3958). NOT TO BE WRITTEN until the operator answers.
// (1) Close Enforcer Build (before the panel): wording a side dropped or withdrew in rounds 1-3 and states again as its own in its closing round is listed
//     as a candidate (cdr_fn.js). On 34108 this lists the D6 pair ([CR3] "I drop the wording "no biological father" as a bare statement." /
//     [CR4] "Christ had no biological father."), which DeepSeek missed in execution 34299 when no candidate was listed.
// (2) Judge Contradiction Build (after the panel): the pairs the two code checks already serve to the judges, the CLOSE-ROUND REVERSAL CHECK (ruling 412)
//     and the ANTI-CHEAT CHECK (ruling 427), are listed as candidates beside the judges' own (jc_feed.js). On 34108 this lists the "ordinary means" pair,
//     which reached no enforcer in 34299. The reversal check runs in Panel Build, after the closing enforcer, so it can feed only the later call.
// (3) Close Enforcer Record reads a P<n> candidate id as it reads X<n> and J<n>; every check on an answer is unchanged.
// Only these three code nodes change. No library node, no connection, no prompt wording, no log row shape.
//   node pkgCDR/build_CDR.cjs <live fetch-back> <out>
const fs=require('fs');const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};const [,,FB,OUT]=process.argv;if(!FB||!OUT)die('usage: build_CDR.cjs <base> <out>');
let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;if(d.nodes.length!==418)die('base has '+d.nodes.length+' nodes');
const FN=fs.readFileSync(__dirname+'/cdr_fn.js','utf8'),JF=fs.readFileSync(__dirname+'/jc_feed.js','utf8');
const E={'Close Enforcer Build':[
  ["const S=$('Init Seats').first().json;",FN+"const S=$('Init Seats').first().json;"],
  ["const links=cecLinks(F);const cands=cecOracle(F);","const links=cecLinks(F);const cands=(()=>{const o=cecOracle(F);const p=cecDropped(F).filter(c=>!o.some(x=>x.side===c.side&&cecN(x.closing_q)===cecN(c.closing_q)));return o.concat(p);})(); /* pkgCDR: the Oracle's candidates, then the code check's */"]],
 'Close Enforcer Record':[
  [String.raw`(X\d+|J\d+|NEW\s*\d*)`,String.raw`(X\d+|J\d+|P\d+|NEW\s*\d*)`],
  ["CLOSE ENFORCER RECORD","CLOSE ENFORCER RECORD (pkgCDR: also reads the code check's P candidates)"]],
 'Judge Contradiction Build':[
  ["const cands=found.filter(",JF+"const cands=found.filter("],
  ["by:(c.by==='question'?'a judge\\'s contradiction question ('+c.seats.join(', ')+')':'the judges\\' CONTRADICTION lines ('+c.seats.join(', ')+')')",
   "by:(c.by==='question'?'a judge\\'s contradiction question ('+c.seats.join(', ')+')':c.by==='reversal'?'the CLOSE-ROUND REVERSAL CHECK served to the judges (ruling 412)':c.by==='anticheat'?'the ANTI-CHEAT CHECK served to the judges (ruling 427)':'the judges\\' CONTRADICTION lines ('+c.seats.join(', ')+')')+(c.also&&c.also.length?'; also named by '+c.also.map(x=>x==='reversal'?'the CLOSE-ROUND REVERSAL CHECK':x==='anticheat'?'the ANTI-CHEAT CHECK':x).join(' and '):'')"]]};
for(const [nm,L] of Object.entries(E)){const n=d.nodes.find(z=>z.name===nm);if(!n)die('no node '+nm);let s=n.parameters.jsCode;if(s.includes('pkgCDR'))die(nm+' already has pkgCDR');if(!s.includes('pkgCEC rev 5'))die(nm+' lacks pkgCEC rev 5');
 for(const [a,b] of L){const k=s.split(a).length-1;if(k!==1)die(nm+': '+k+' hits for '+a.slice(0,70));const i=s.indexOf(a);s=s.slice(0,i)+b+s.slice(i+a.length);}
 new Function('$','$input','return (async()=>{\n'+s+'\n})();');n.parameters.jsCode=s;}
fs.writeFileSync(OUT,JSON.stringify({nodes:d.nodes,connections:d.connections,settings:d.settings},null,1));console.log(OUT+': 418 nodes; changed '+Object.keys(E).join(', '));
