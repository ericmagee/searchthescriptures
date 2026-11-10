// E4 plants (W1): the pkgECB withhold test (__cc, __ecC, __ecb from patches/E1.to) on planted lines. Confirmed set planted: DEFENDER 6, CHALLENGER 2. Run from pkgKSR/.
const fs=require('fs');const t=fs.readFileSync('patches/E1.to','utf8').split('\n').slice(0,3).join('\n');
const $=n=>({isExecuted:true,first:()=>({json:n==='Close Enforcer Record'?{cec:{confirmed:[{side:'DEFENDER',link:6},{side:'CHALLENGER',link:2}]}}:{jcc:{confirmed:[]}}})});
const said={luna:'D6 vs C5 (Romans 1:3): DEFENDER LINK BROKEN -- [AUDIT: LINK 6 BROKEN BY A CONFIRMED CLOSING CONTRADICTION -- DEFENDER -- EARLIER ...]',sol:'D6 vs C5 (Romans 1:3): STANDS -- the line holds'};
const f=new Function('$','said',t+'\nreturn __ecb;')($,said);const M='LINK 6 BROKEN BY A CONFIRMED CLOSING CONTRADICTION';let ok=0,bad=0;
const P=[['luna','D6 vs C5 (Romans 1:3): DEFENDER LINK BROKEN -- [AUDIT: '+M+' -- DEFENDER -- EARLIER ...]',true,'engine collision line, confirmed DEFENDER 6'],
['luna','FORCED: D6 vs C5 -- MEANS [DR2]: "x" -- ANSWER [CR4]: "y" -- FAILS: "z"',true,'FORCED line of a withheld pair'],
['sol','FORCED: D6 vs C5 -- MEANS [DR2]: "x" -- ANSWER [CR4]: "y"',false,'FORCED line, pair collision line not withheld in that seat'],
['luna','D2 vs C1 (Matthew 1:19): STANDS -- the defender wrote "'+M+'" in closing',false,'judge line on D2 vs C1 quoting the eight words'],
['luna','D2 vs C1 (Matthew 1:19): DEFENDER LINK BROKEN -- [AUDIT: '+M+' -- DEFENDER -- ...]',false,'the mark with link 6 on a D2 line'],
['sol','KEYSTONE: D6 -- STANDS -- the defender was told "'+M+'" but',false,'judge KEYSTONE line quoting the words'],
['luna','D3 vs C1 (Matthew 1:16): DEFENDER LINK BROKEN -- [AUDIT: LINK 3 BROKEN BY A CONFIRMED CLOSING CONTRADICTION -- DEFENDER -- ...]',false,'mark for an unconfirmed link'],
['luna','D4 vs C2 (Luke 1:35): CHALLENGER LINK BROKEN -- [AUDIT: LINK 2 BROKEN BY A CONFIRMED CLOSING CONTRADICTION -- CHALLENGER -- ...]',true,'engine collision line, confirmed CHALLENGER 2'],
['luna','D2 vs C4 (Luke 1:35): CHALLENGER LINK BROKEN -- [AUDIT: LINK 2 BROKEN BY A CONFIRMED CLOSING CONTRADICTION -- CHALLENGER -- ...]',false,'CHALLENGER mark on a pair whose C is not 2'],
['sol','KEYSTONE: D6 -- BROKEN -- '+M,true,'engine KEYSTONE line (pkgKSR), confirmed DEFENDER 6'],
['sol','**KEYSTONE: D6 -- BROKEN -- '+M+'**',true,'engine KEYSTONE line with markdown'],
['sol','KEYSTONE: D3 -- BROKEN -- LINK 3 BROKEN BY A CONFIRMED CLOSING CONTRADICTION',false,'engine-form KEYSTONE line, unconfirmed link'],
['sol','KEYSTONE: D6 -- BROKEN -- '+M+', and more by the judge',false,'judge text after the engine form'],
['sol','KEYSTONE: D6 -- BROKEN -- LINK 5 BROKEN BY A CONFIRMED CLOSING CONTRADICTION',false,'link number not the keystone number']];
for(const [s,l,w,d] of P){const g=f(s,l);const pass=g===w;pass?ok++:bad++;console.log((pass?'OK   ':'FAIL ')+(w?'withheld':'sent    ')+' | '+d);}
console.log(ok+' OK, '+bad+' FAIL');
