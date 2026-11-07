// test_ETC: U unit cases (DB rows verbatim), R replay of both record nodes on every saved run (base s39 vs patched), S send-back filter.
const fs=require('fs');const {harness,live}=require('../pkgGSL/harness.cjs');const F='/mnt/project-files/wall2024/fetchback_live_s40.json';
const ETC=new Function(fs.readFileSync(__dirname+'/etc_lib.js','utf8')+';return ETC;')();let ok=0,bad=0;const T=(c,m)=>{if(c){ok++;console.log('OK   '+m);}else{bad++;console.log('FAIL '+m);}};
const why=cr=>cr.replace(/^ENFORCER [A-Z ]+ \(right: [A-Z ]+\):\s*/,'');
const U=[
 [13335,'E-PREM','COUNTED',`ENFORCER DISAGREE (right: COUNTED): The line "CONCEDED LINKS: 0" is a bare count that names no ruling on premise 4, but the record's own narrowing keeps the words "was minded to put her away privily" while dropping the claim that that ground alone proves Joseph's knowledge, so the kept limb no longer asserts the dropped claim; the correct ruling is SPARED, and the judge's silence-as-spared form is not met by a bare "0".`,'SPARED'],
 [13350,'E-PREM','VOID',`ENFORCER DISAGREE (right: VOID): "CHALLENGER CONCEDED LINKS: 0 -- recomputed after the cure" gives no ruling on premise 3, but its charge, "connects back to verse 32, not forward to biological divine paternity," is what its [DR2] quote says, so it is not VOID; the right ruling is SPARED on the record's "[L2] kaleō (G2564 ...) stands in both 'shall be called' clauses."`,'SPARED'],
 [1375,'E-PREM','VOID',`ENFORCER DISAGREE (right: VOID): The line "CHALLENGER CONCEDED LINKS: 0" names no premise, so premise 5 is spared by silence, but the charge's words "run by the immediate father" are a claim stronger than the quote's "runs by the father's line."`,null],
 [7108,'E-KEY','BROKEN',`ENFORCER DISAGREE (right: BROKEN): Its own line grades "FORCED: D5 vs C5" so the keystone STANDS does not follow.`,null],
 [9765,'E-KEY','STANDS',`ENFORCER AGREE (right: STANDS): Its D6 collision lines are all "UNDERDETERMINED," so the keystone STANDS follows.`,null],
 [13353,'E-PREM','COUNTED',`ENFORCER DISAGREE (right: COUNTED): "CHALLENGER CONCEDED LINKS: 0 -- recomputed after the cure" rules nothing on premise 4, yet the record's own answer keeps "the espousal stands before the taking," which still asserts the knowing within the espousal; premise 4 is UNEXHIBITED.`,null],
 ['syn-quote','E-ANS','MISSES',`ENFORCER DISAGREE (right: MISSES): The judge wrote "so the answer meets the press" but the answer gives no layer.`,null],
 ['syn-res','E-RES','FOLLOWS',`ENFORCER DISAGREE (right: FOLLOWS): The cited line is a restatement, so the result does not follow.`,'DOES NOT FOLLOW'],
 ['syn-ans','E-ANS','MISSES',`ENFORCER DISAGREE (right: MISSES): The answer quotes [L2] and [L4] showing the fit, so it meets.`,'MEETS'],
 ['syn-unx','E-PREM','COUNTED',`ENFORCER DISAGREE (right: COUNTED): The block lacks an [L2], so premise 2 is unexhibited.`,null]];
for(const [id,r,t,cr,exp] of U){const g=ETC(r,t,why(cr));T(g===exp,'U '+id+' '+r+' right '+t+' -> '+g+' (expected '+exp+')');}
// N: the 13350 conclusion picks "so it is not VOID" first; both name a ruling other than VOID, so either is a contradiction. Recorded above as NOT VOID.
const DIS=/^ENFORCER (?:DISAGREE|NO ANSWER)\b/;T(!DIS.test('ENFORCER CONTRADICTED (right: COUNTED): x'),'S send-back filter does not match CONTRADICTED');T(DIS.test('ENFORCER DISAGREE (right: COUNTED): x'),'S send-back filter still matches DISAGREE');
const runs=fs.readdirSync('/mnt/project-files/wall2024/inputs/').filter(f=>/_Judge_Enforcer_Record\.json$/.test(f)&&!/_Alt_/.test(f)).map(f=>f.split('_')[0]).sort();
const flips=[];
const STACKS=[['live s40',null,'patched'],['pkgEPS/patched','pkgEPS/patched','patched_on_pkgEPS_patched'],['pkgEPS/patched_live','pkgEPS/patched_live','patched_on_pkgEPS_patched_live']];
for(const [lab,bdir,pdir] of STACKS)for(const RUN of runs)for(const [node,inp] of [['Judge Enforcer Record','Judge Enforcer Call deepseek'],['Alt Judge Enforcer Record','Alt Judge Enforcer Call deepseek']]){
 const fn=node.replace(/ /g,'_')+'.js';const h=harness(RUN);let b,p;try{b=h(bdir?fs.readFileSync(__dirname+'/../'+bdir+'/'+fn,'utf8'):live(F,node),inp);}catch(e){T(false,'R ['+lab+'] '+RUN+' '+node+' base threw '+e.message);continue;}
 p=h(fs.readFileSync(__dirname+'/'+pdir+'/'+fn,'utf8'),inp);
 const br=(b[0].json.enf428_rows||[]),pr=(p[0].json.enf428_rows||[]);let same=br.length===pr.length,diff=0;
 br.forEach((x,i)=>{const y=pr[i];const xs=JSON.stringify({...x,at:0}),ys=JSON.stringify({...y,at:0});if(xs!==ys){diff++;
  const ok2=/^ENFORCER CONTRADICTED /.test(y.cure_reason)&&/^ENFORCER (?:DISAGREE|NO ANSWER) /.test(x.cure_reason)&&JSON.stringify({...x,at:0,cure_reason:0})===JSON.stringify({...y,at:0,cure_reason:0});if(!ok2)same=false;
  flips.push('['+lab+'] '+RUN+' '+node+' '+y.seat+' '+y.rule+' '+y.item+' :: '+y.cure_reason.slice(0,90)+' ... '+(y.cure_reason.match(/\[pkgETC[^\]]*\]/)||[''])[0]);}});
 const bo={...b[0].json,enf428_rows:0,enf428:{...b[0].json.enf428,tally:0}},po={...p[0].json,enf428_rows:0,enf428:{...p[0].json.enf428,tally:0}};
 T(same&&JSON.stringify(bo)===JSON.stringify(po),'R ['+lab+'] '+RUN+' '+node+': '+br.length+' rows, '+diff+' changed, each a DISAGREE/NO ANSWER relabelled CONTRADICTED with nothing else changed; pass-through identical');}
console.log('\nFLIPS ('+flips.length+'):\n'+flips.join('\n'));console.log('\n'+ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
