// W1 plants for pkgEAF on stored 34852: rewrite one judge's ANSWER CHECK answer text everywhere it occurs in the stored run, then build the E-ANS items on live, SU, AU.
const fs=require('fs');const {run,V,items,N,P}=require('./g.cjs');
const RAW=fs.readFileSync(P+'ex34852_full.json','utf8');
const J=s=>JSON.stringify(s).slice(1,-1);
const OLD='In 1:16 the subject is Jacob, Joseph is the object, and the one ‘of whom’ Jesus was born is Mary alone.'; // luna, Matthew 1:6 [CR3]
const PL={
 P0_control:OLD,
 P1_backslashes:'In each the father is the subject of \\\\\\"begat\\\\\\" and the mother is added in \\\\\\"of.\\\\\\"', // three backslashes before each mark
 P2_other_verse_long:'Matthew 1:16 says the descent comes down by “begat” to Joseph, as legal head, and then by “of whom was born” to Jesus.', // a Matthew 1:1 answer quoted under 1:6
 P3_fabricated_long:'The mother is a witness to the line and stands as the heir of the promise in every generation of the register.',
 P4_long_true_second_half:'Joseph is the object, and the one ‘of whom’ Jesus was born is Mary alone, while in each the father is the subject.',
 P5_elided:'In each the father is the subject of “begat” ... the one ‘of whom’ Jesus was born is Mary alone.'
};
(async()=>{const jo=J(OLD);console.log('occurrences of the luna answer in the stored run (JSON form):',RAW.split(jo).length-1);
 for(const [k,txt] of Object.entries(PL)){const rd=JSON.parse(RAW.split(jo).join(J(txt))).data.resultData.runData;
  for(const v of ['live','SU','AU']){const M=items(await run(V[v],'Judge Enforcer Build',rd));const hit=Object.entries(M).find(([id,t])=>/PRESSED VERSE: Matthew 1:6\n/.test(t)&&/\(luna\)/.test(t));
   if(!hit){console.log(k,v,'ITEM MISSING (silent drop?)');continue;}const t=hit[1];const fm=t.match(/\nTHE ANSWER IN FULL, FROM \[([^\]]*)\][^:]*:\s*"([\s\S]*?)"\nTHE JUDGES' GRADES:/);const q=(t.match(/\nTHE ANSWER: "([\s\S]*?)"\n/)||[])[1];
   console.log(k,v,hit[0],'| THE ANSWER:',(q||'').slice(0,80),'| full:',fm?('['+fm[1]+'] '+fm[2].slice(0,110).replace(/\n/g,' ')):'none','| grades:',(t.match(/- B\d+\.\d+ \((\w+)\)/g)||[]).join(','));}}})();
