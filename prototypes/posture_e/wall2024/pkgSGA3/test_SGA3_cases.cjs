// pkgSGA3 case test: runs sga3Append2024 from the patched Gate Build on the 33798/33490 cases and four must-refuse cases. Run from wall2024/.
const fs=require('fs');const {harness,feeder}=require(process.cwd()+'/pkgGSL/harness.cjs');
const IN=feeder('/mnt/project-files/wall2024/fetchback_live_s61.json','Gate Build')[0];
const src=fs.readFileSync('pkgLIB/strip_SGA3/patched/Gate_Build.js','utf8');
const cases=JSON.stringify([
 ['gem 33798 seq','CHALLENGER CONCEDED LINKS: 0',[[1,'Premise 1: VOID -- charge goes beyond quote'],[2,'Premise 2: VOID -- charge goes beyond quote'],[5,'Premise 5: VOID -- charge goes beyond quote'],[6,'Premise 6: VOID -- charge goes beyond quote']]],
 ['sol 33490 seq','CHALLENGER CONCEDED LINKS: 0 -- Premises 1, 2, 3, 4, 5 and 6 are spared in their retained forms. Premise 1 no longer asserts awe as the stated cause of Joseph\'s purpose, and premise 4 no longer identifies the child of Isaiah 8:4 with Immanuel; their remaining constructions are footed. All six quotations are found in [DR2]; none is VOID.',[[2,'Premise 2 against the challenger: VOID (Commitment 6) -- The charge "in place of a begetting" asserts an exclusion'],[5,'Premise 5 against the challenger: VOID (Commitment 6) -- The charge "reverses Jeremiah 22:30" asserts'],[6,'Premise 6 against the challenger: VOID (Commitment 6) -- The charge "the house of the fathers means" asserts']]],
 ['terra S14 (count change, must refuse)','CHALLENGER CONCEDED LINKS: 1 -- Premise 4: UNEXHIBITED (pressed witness left unanswered). Premises 1 and 3 are spared.',[[4,'Premise 4: SPARED -- Its link-round block exhibits footing']]],
 ['to counted premise (must refuse)','CHALLENGER CONCEDED LINKS: 0',[[3,'Premise 3: UNEXHIBITED -- no footing']]],
 ['wrong premise number (must refuse)','CHALLENGER CONCEDED LINKS: 0',[[3,'Premise 4: VOID -- x']]],
 ['ambiguous two joint sentences (must refuse)','CHALLENGER CONCEDED LINKS: 0 -- Premises 1 and 2 are spared. Premises 2 and 3 are spared.',[[2,'Premise 2: VOID -- x']]]
]);
const test=`const C=${cases};return C.map(([n,cur,ch])=>{let c=cur;const out=[];for(const [pn,to] of ch){const r=sga3Append2024(c,pn,to);out.push(r===null?'REFUSED':'ok');if(r!==null)c=r;}return n+' :: '+out.join(',')+'\\n   => '+c;}).join('\\n');`;
(async()=>{const o=await harness('33798')('return (async()=>{'+test+'\n'+src+'\n})()',IN);console.log(o);})();
