// W2 grade plants for pkgTWC on s175 (new forms; W1's T1-T9 not reused).
const fs=require('fs');const f=process.argv[2];const raw=JSON.parse(fs.readFileSync(f));const W=(raw.data||raw).workflow||(raw.data||raw);
const REC=W.nodes.find(n=>n.name==='Close Enforcer Record').parameters.jsCode;
const F={cr1:'DECLARED CHAIN\nD1. a\nD2. b\nD3. c\nD4. d',cr2:'x',cr3:'I drop the claim that the feminine pronoun by itself excludes a father.\nWe say the prophet spoke of a sign to the house.',
 cr4:'## D4 the sign\nI narrow and concede nothing at all here.\nThe prophet spoke of no sign to any house.\n## D2 the word\nThe word names a virgin in every place it stands.',gr1:'x',gr2:'x',dr3:'I withdraw Galatians 4:4 as an exclusion witness here.',dr4:'Galatians 4:4 shows the exclusion of a father here.'};
const run=(BA,replies)=>{const $=n=>({all:()=>n==='Close Enforcer Build'?BA.map(j=>({json:j})):[],first:()=>({json:n==='Final Output'?F:BA[0]}),isExecuted:false});
 return new Function('$','$input',REC)($,{all:()=>replies.map(t=>({json:t==null?{error:{message:'timeout'}}:{choices:[{message:{content:t}}]}}))})[0].json;};
const b=(side,copy,cands)=>({cec_skip:false,side,links:{DEFENDER:[1,2,3,4],CHALLENGER:[1,2,3]},cands:cands||[],model:'ds',run_token:'ODV1-99999-T',copy,body:{messages:[{},{content:'P '+side}]}});
const L=(id,sd,lk,ans,e,c,er,cr)=>'CLOSE-CONTRADICTION: '+id+' -- '+sd+' -- LINK '+lk+' -- '+ans+' -- EARLIER ['+(er||'CR3')+'] "'+e+'" -- CLOSING ['+(cr||'CR4')+'] "'+c+'" -- why';
const E1='I drop the claim that the feminine pronoun by itself excludes a father.',C1='I narrow and concede nothing at all here.';
const E2='We say the prophet spoke of a sign to the house.',C2='The prophet spoke of no sign to any house.';
const NONE='CLOSE-CONTRADICTION: NONE';const CH=L('NEW','CHALLENGER',2,'CONFIRMED','I withdraw Galatians 4:4 as an exclusion witness here.','Galatians 4:4 shows the exclusion of a father here.','DR3','DR4');
const two=c=>[b('DEFENDER',1,c),b('DEFENDER',2,c),b('CHALLENGER',1,c),b('CHALLENGER',2,c)];
// dfl_counted as on live (prosrc read 11-12 22:xx CST)
const counted=r=>r.kind==='enforcer_check'&&r.rule==='E-CLOSECON'&&/^ODV1-\d+-/.test(r.run_token)&&/^(?:[XJ]\d+|NEW) (DEFENDER|CHALLENGER) LINK \d+$/.test(r.item||'')&&/^CONFIRMED( --|$)/.test(r.cure_reason||'');
let ok=0,bad=0;const t=(nm,o,want,wantLedger)=>{const got=o.cec.confirmed.map(x=>x.side[0]+x.link).sort().join(',');const led=o.cec_log.filter(counted).length;const p=got===want&&(wantLedger==null||led===wantLedger);p?ok++:bad++;
 console.log((p?'PASS ':'FAIL ')+nm+' -> confirmed ['+got+'] want ['+want+']; ledger rows '+led+(wantLedger!=null?' want '+wantLedger:'')+(p?'':' rows '+JSON.stringify(o.cec.rows.map(r=>[r.copy,r.side,r.link,r.status]))));return o;};
t('P1 two copies confirm the same link on DIFFERENT pairs (E1/C1 vs E2/C2)',run(two(),[L('NEW','DEFENDER',4,'CONFIRMED',E1,C1),L('NEW','DEFENDER',4,'CONFIRMED',E2,C2),NONE,NONE]),'D4',1);
t('P2 copy 2 confirms with a quote not in the transcript (form refusal)',run(two(),[L('NEW','DEFENDER',4,'CONFIRMED',E1,C1),L('NEW','DEFENDER',4,'CONFIRMED',E1,'I concede nothing and narrow it all.'),NONE,NONE]),'',0);
t('P3 pkgCLK: copy 1 names LINK 3, copy 2 LINK 4; block heads D4',run(two(),[L('NEW','DEFENDER',3,'CONFIRMED',E1,C1),L('NEW','DEFENDER',4,'CONFIRMED',E1,C1),NONE,NONE]),'D4',1);
t('P4 copy 1 confirms two lines of one link, copy 2 none',run(two(),[L('NEW','DEFENDER',4,'CONFIRMED',E1,C1)+'\n'+L('NEW','DEFENDER',4,'CONFIRMED',E2,C2),NONE,NONE,NONE]),'',0);
t('P5 same link confirmed on both copies by candidate X1 (both answer X1)',run(two([{id:'X1',side:'DEFENDER',by:'judge sol'}]),[L('X1','DEFENDER',4,'CONFIRMED',E1,C1),L('X1','DEFENDER',4,'CONFIRMED',E1,C1),NONE,NONE]),'D4',1);
t('P6 copies agree on side but different links (D4 vs D2)',run(two(),[L('NEW','DEFENDER',4,'CONFIRMED',E1,C1),L('NEW','DEFENDER',2,'CONFIRMED',E1,'The word names a virgin in every place it stands.'),NONE,NONE]),'',0);
t('P7 a challenger copy-2 confirmation cannot pair with a defender copy-1 one',run(two(),[L('NEW','DEFENDER',4,'CONFIRMED',E1,C1),NONE,NONE,CH]),'',0);
t('P8 copy 1 CONFIRMED, copy 2 lines are lower-case markdown (bold) and still read',run(two(),[L('NEW','DEFENDER',4,'CONFIRMED',E1,C1),'**'+L('NEW','DEFENDER',4,'CONFIRMED',E1,C1)+'**',NONE,NONE]),'D4',1);
t('P9 both sides both copies confirm (ledger one row per side)',run(two(),[L('NEW','DEFENDER',4,'CONFIRMED',E1,C1),L('NEW','DEFENDER',4,'CONFIRMED',E1,C1),CH,CH]),'C2,D4',2);
const o=run(two(),[L('NEW','DEFENDER',4,'CONFIRMED',E1,C1),L('NEW','DEFENDER',4,'CONFIRMED',E1,C1),NONE,null]);
console.log('   P10 errors: '+JSON.stringify(o.cec.errors)+' | log items: '+o.cec_log.map(r=>r.item+'='+(r.cure_status||(r.cure_reason||'').slice(0,40))).join(' ; '));
console.log(ok+' of '+(ok+bad)+' pass');
