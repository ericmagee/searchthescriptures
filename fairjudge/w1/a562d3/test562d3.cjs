// ASK 562 draft 3 test (W1): BASE_E = 581 target, TARGET_E = 581 + 562 draft 3 target. Stored KJV rows (rows.json).
const fs=require('fs');const {B,A}=require(__dirname+'/../a581/mk.cjs');const rows=JSON.parse(fs.readFileSync(__dirname+'/rows.json','utf8'));let fail=0;
const n=(L,t)=>L.check(t,rows).items.length;
const T=(name,t,eb,ea)=>{const b=n(B,t),a=n(A,t);const ok=b===eb&&a===ea;if(!ok)fail++;console.log((ok?'PASS ':'FAIL ')+name+' -- items before '+b+', after '+a+' (expected '+eb+', '+ea+')');};
const ABS='The defender quotes Luke 1:35 and Matthew 1:20 and builds on them; neither verse is laid beside a second verse here, and the point is pressed on the words alone.';
const FOOT='[L1] Luke 1:35: "The Holy Ghost shall come upon thee"\n[L3] Acts 1:8: "after that the Holy Ghost is come upon you"';
T('H1 "## Against D1:" over an unfooted block','## Against D1: the source\n'+ABS,0,1);
T('H2 "**Against D1.**" over an unfooted block','**Against D1.**\n'+ABS,0,1);
T('H3 "D3 against C5:" over an unfooted block','D3 against C5:\n'+ABS,0,1);
T('H4 "## Against the answer to D1" over an unfooted block','## Against the answer to D1\n'+ABS,0,1);
T('F1 a footed block under an against head passes','## Against D1: the source\n'+FOOT,0,0);
T('X1 a prose line beginning "Against D1 the challenger" is no head','**PRESS 1.** The press.\n'+FOOT+'\nAgainst D1 the challenger sets Matthew 1:16, and the words are read above.',0,0);
T('E1 a title-only against head over PRESS heads opens no block (#10)','### Against D5 (the keystone) and the defender\'s chapter six\n\n**PRESS 13.** The press on D5.\n'+FOOT+'\n**PRESS 14.** The next press.\n'+FOOT,0,0);
T('E2 a bold against head with its point on the same line still opens a block','**Against D6.** D6 stands on D1 to D5, and it falls with them, though no verse is laid beside another here at all.\n**PRESS 2.** The next press.\n'+FOOT,0,1);
T('E3 a title-only bold against head with no body opens no block','**Against D4 (Luke 3:23).**\n**PRESS 2.** The next press.\n'+FOOT,0,0);
console.log(fail?'FAIL '+fail:'ALL PASS');
