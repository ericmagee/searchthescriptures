// pkgCDR rev 11 (W1; W3 grade of rev 10: 124 of 366 hints show LINK ?, and Record could not read an answer that copies it): Record reads LINK ? (a
//   NOT A CONTRADICTION answer stands; a CONFIRMED one is NOT CONFIRMED (form), as for any undeclared link); the prompt says when to write LINK ?.
//   W2 (Wall 4028): hints capped at 30 per side again (the rounds are read in full, so the cap hides nothing; padding cannot inflate the prompt);
//   the prompt states that the differs-only-in-wording rule never covers restating what was given up.
// pkgCDR rev 10 (W1; W2 FAIL of rev 9; coordinator 04:58Z): the enforcer is told to read every earlier sentence for anything given up in any words; the code's
//   sentences are hints marked NOT COMPLETE; no cap.
// pkgCDR rev 9 (W1; W2 Wall 4014 and W3 grade_CDR8_w3.md FAIL rev 8; option (b), coordinator 04:50Z): every drop-family sentence of the side's rounds 1-3 is a
//   candidate whole, with no closing sentence named; the enforcer prompt gains one sentence telling it how to answer such a candidate.
// pkgCDR rev 3 (W1; W3 FAIL of rev 2, grade_CDR2_w3.md: sentences that do not drop the wording were listed; cdrObj anchors the drop verb at the sentence start
//   with the dropped wording directly after it, and takes only that first object).
// pkgCDR rev 2 (W1; W2 FAIL of rev 1, grade_CDR_w2.md: a refused drop was read as a drop; cdrDrop now refuses "I drop nothing / none / no / neither / not").
// pkgCDR rev 1 (W1; item A countermeasure, coordinator 02:22Z and 02:29Z 11-10; W1 Wall 3950, W3 3958). NOT TO BE WRITTEN until the operator answers.
// (1) Close Enforcer Build (before the panel): wording a side dropped or withdrew in rounds 1-3 and states again as its own in its closing round is listed
//     as a candidate (cdr_fn.js). On 34108 this lists the D6 pair ([CR3] "I drop the wording "no biological father" as a bare statement." /
//     [CR4] "Christ had no biological father."), which DeepSeek missed in execution 34299 when no candidate was listed.
// (2) Judge Contradiction Build (after the panel): the pairs the two code checks already serve to the judges, the CLOSE-ROUND REVERSAL CHECK (ruling 412)
//     and the ANTI-CHEAT CHECK (ruling 427), are listed as candidates beside the judges' own (jc_feed.js). On 34108 this lists the "ordinary means" pair,
//     which reached no enforcer in 34299. The reversal check runs in Panel Build, after the closing enforcer, so it can feed only the later call.
// (3) Close Enforcer Record reads a P<n> candidate id as it reads X<n> and J<n>; every check on an answer is unchanged.
// Only these three code nodes change. No library node, no connection. Rev 10 adds one prompt passage (find any wording given up; P candidates are hints, not complete; how to answer a candidate with no closing named).
//   node pkgCDR/build_CDR.cjs <live fetch-back> <out>
const fs=require('fs');const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};const [,,FB,OUT]=process.argv;if(!FB||!OUT)die('usage: build_CDR.cjs <base> <out>');
let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;if(d.nodes.length!==418)die('base has '+d.nodes.length+' nodes');
const FN=fs.readFileSync(__dirname+'/cdr_fn.js','utf8'),JF=fs.readFileSync(__dirname+'/jc_feed.js','utf8');
const E={'Close Enforcer Build':[
  ["const S=$('Init Seats').first().json;",FN+"const S=$('Init Seats').first().json;"],
  ["const links=cecLinks(F);const cands=cecOracle(F);","const links=cecLinks(F);const cands=cecOracle(F).concat(cecDropped(F)); /* pkgCDR: the Oracle's candidates, then the code check's */"],
  [" -- CLOSING ['+c.closing_round+'] \"'+c.closing_q+'\" -- named by "," -- CLOSING ['+c.closing_round+'] '+(c.closing_q==null?'(not named)':'\"'+c.closing_q+'\"')+' -- named by "],
  ["Reply with one line per contradiction and one line per candidate, and nothing else:","Read every sentence of each side's rounds 1 to 3 for anything that side gave up (dropped, withdrew, retracted, set aside, conceded away, or gave up in any other words, with or without such a verb, and wherever the wording stands: in the same sentence, the next sentence, or a list below it). Each thing given up that the same side's closing round asserts again as its own, in the same words or in other words, is a contradiction: report it as NEW when it is not among the candidates. The rule above on a closing sentence that differs only in wording covers a restatement of what the side still holds; it never covers a restatement of what the side gave up. The P candidates are HINTS from a code check (earlier sentences with a verb of giving up); they are NOT COMPLETE, and a drop that is not among them counts the same. For a P candidate, whose CLOSING is (not named), name what it gives up and read that side's closing round: answer CONFIRMED with the closing sentence quoted, or NOT A CONTRADICTION with CLOSING [<round 4>] \\\"\\\" when the closing round does not assert it again or the sentence gives nothing up. Use the link the earlier sentence belongs to; where a hint shows LINK ? and you cannot tell the link, write LINK ? (a CONFIRMED answer needs one of the side's declared links).\\nReply with one line per contradiction and one line per candidate, and nothing else:"]],
 'Close Enforcer Record':[
  [String.raw`(X\d+|J\d+|NEW\s*\d*)`,String.raw`(X\d+|J\d+|P\d+|NEW\s*\d*)`],
  [String.raw`--\s*LINK\s*(\d+)\s*--`,String.raw`--\s*LINK\s*(\d+|\?)\s*--`],
  ["link:+m[3]","link:(m[3]==='?'?'?':+m[3])"],
  ["CLOSE ENFORCER RECORD","CLOSE ENFORCER RECORD (pkgCDR: also reads the code check's P candidates)"]],
 'Judge Contradiction Build':[
  ["const cands=found.filter(",JF+"const cands=found.filter("],
  ["by:(c.by==='question'?'a judge\\'s contradiction question ('+c.seats.join(', ')+')':'the judges\\' CONTRADICTION lines ('+c.seats.join(', ')+')')",
   "by:(c.by==='question'?'a judge\\'s contradiction question ('+c.seats.join(', ')+')':c.by==='reversal'?'the CLOSE-ROUND REVERSAL CHECK served to the judges (ruling 412)':c.by==='anticheat'?'the ANTI-CHEAT CHECK served to the judges (ruling 427)':'the judges\\' CONTRADICTION lines ('+c.seats.join(', ')+')')+(c.also&&c.also.length?'; also named by '+c.also.map(x=>x==='reversal'?'the CLOSE-ROUND REVERSAL CHECK':x==='anticheat'?'the ANTI-CHEAT CHECK':x).join(' and '):'')"]]};
for(const [nm,L] of Object.entries(E)){const n=d.nodes.find(z=>z.name===nm);if(!n)die('no node '+nm);let s=n.parameters.jsCode;if(s.includes('pkgCDR'))die(nm+' already has pkgCDR');if(!s.includes('pkgCEC rev 5'))die(nm+' lacks pkgCEC rev 5');
 for(const [a,b] of L){const k=s.split(a).length-1;if(k!==1)die(nm+': '+k+' hits for '+a.slice(0,70));const i=s.indexOf(a);s=s.slice(0,i)+b+s.slice(i+a.length);}
 new Function('$','$input','return (async()=>{\n'+s+'\n})();');n.parameters.jsCode=s;}
fs.writeFileSync(OUT,JSON.stringify({nodes:d.nodes,connections:d.connections,settings:d.settings},null,1));console.log(OUT+': 418 nodes; changed '+Object.keys(E).join(', '));
