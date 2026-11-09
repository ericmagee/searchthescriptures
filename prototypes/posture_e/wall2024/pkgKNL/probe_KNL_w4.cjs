// W4 adversarial probe for knlNone2024. usage: node probe_w4.cjs <strip dir>   (true = skipped as grading nothing)
const fs=require('fs');const s=fs.readFileSync(process.argv[2]+'/patched/Panel_Cure_Check.js','utf8');const i=s.indexOf('function knlNone2024');const j=s.indexOf('function kfLines',i);
const f=new Function(s.slice(i,j)+';return knlNone2024;')();
const SKIP=['FORCED: none graded.','FORCED: None.','FORCED: none','**FORCED:** None','1. FORCED (Commitment 2): n/a','FORCED: no link is forced.','FORCED: nothing','FORCED: 0','FORCED: zero','FORCED: nil.','- FORCED: None graded'];
const CHECK=['FORCED: No. The D1 link is forced by Heb 7:14','FORCED: zero-sum reading of D1','FORCED: no (the challenger\'s reading is forced at CR2)','FORCED: none, apart from link three','FORCED: zero links; premise 4 is forced','FORCED: none; C2 forced by the challenger','FORCED: nothing, though LINK 4 strains','FORCED: none, see "took unto him"','FORCED: none at [CR3]','FORCED: none, except LINK 3','FORCED: nothing ‘quoted’',
 'FORCED: none other than the keystone','FORCED: no, but the second link is forced','FORCED: none graded, yet Luke 3:23 forces the reading','FORCED: nothing beyond premise two','FORCED: none save the first link','FORCED: no other link; the defender\'s first link is forced','FORCED: none graded. The tribe link is forced.','FORCED: zero, except the genealogy step','FORCED: None -- Matthew 1:16 is forced','FORCED: no link is forced except D3','FORCED: none graded (keystone forced)'];
let ok=0,bad=0;for(const l of SKIP){const r=f(l);(r===true?ok++:bad++);console.log((r===true?'OK  ':'FAIL')+' skip  | '+l);}
for(const l of CHECK){const r=f(l);(r===false?ok++:bad++);console.log((r===false?'OK  ':'FAIL')+' check | '+l);}
console.log('TOTAL '+ok+' OK, '+bad+' FAIL');
