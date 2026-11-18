// ASK 402 plants (plan W3 8617 rev 1 = C1 W1 8620 + C2 W2 8622). t403 (base) against t402.
const EV=f=>require('./ev.cjs')(f);const E={t403:EV(__dirname+'/../a403/t403.json'),t402:EV(__dirname+'/t402.json')};
const TAG='[AUDIT v62: KEYSTONE CITES A RETRACTED LINE';const n62=s=>s.split(TAG).length-1;const v62=s=>{const i=s.indexOf(TAG);return i<0?'':s.slice(i,s.indexOf(']',i)+1);};
const strip=s=>s.split('\n').filter(l=>!l.startsWith(TAG)).join('\n');let ok=true;const out=[];
const chk=(nm,raw,seat,F,want)=>{const a=E.t403.ert386(raw,seat,F),b=E.t402.ert386(raw,seat,F);const fired=n62(b)===1;const same=strip(b)===a;const twice=E.t402.ert386(b,seat,F);const once=n62(twice)===1||(!want&&n62(twice)===0);
 const pass=fired===want&&same&&n62(a)===0&&once&&(want?true:n62(b)===0);if(!pass)ok=false;
 console.log((pass?'PASS ':'FAIL ')+nm.padEnd(46),'fires:',fired,'(want',want+')','| rest equal to t403:',same,'| run twice, v62 count:',n62(twice));if(fired)console.log('     ',v62(b));};
// stored rows (reduced: the last plain KEYSTONE line and the seat's v21 CORRECTED RESULT tags, from SQL)
for(const r of require('./rows.json'))chk('stored '+r.id+' '+r.seat,JSON.stringify({verdict_tag:r.v,reasoning:r.ks})+'\n'+r.cr,r.seat,{verdict_tag:r.v},r.want);
// 1228 whole stored text from run 39015 (the Alternate Merge output), with its live v61 tag stripped
{const R=require('../a403/run39015_records.json');for(const r of R){const i=r.raw.lastIndexOf('\n[AUDIT v61: ENGINE RESULT');const F=Object.fromEntries(Object.entries(r.F).filter(([k,v])=>v!=null));chk('run 39015 whole text, '+r.seat+(r.removed?' (removed)':''),r.raw.slice(0,i),r.seat,F,r.seat==='sonnet');}}
// synthetic
const cr='[AUDIT v21: CORRECTED RESULT -- SEAT: s1; ORIGINAL: BROKEN; COUNTED: BROKEN (BROKEN-1); RETRACTED: D4 vs C1]';
const syn=(ks)=>JSON.stringify({verdict_tag:'BROKEN',reasoning:'COLLISION POINTS:\nD4 vs C1 (Matthew 1:18): UNDERDETERMINED -- g\n'+ks})+'\n'+cr;
chk('STANDS keystone naming a retracted label',syn('KEYSTONE: D4 -- STANDS -- D4 vs C1 (Matthew 1:18) holds'),'s1',{verdict_tag:'BROKEN'},false);
chk('bracketed line naming a retracted label',syn('[KEYSTONE: D4 -- BROKEN -- D4 vs C1 fails]'),'s1',{verdict_tag:'BROKEN'},false);
chk('bare Cm, pair not retracted (D4 vs C2)',syn('KEYSTONE: D4 -- BROKEN -- the collision with C2 breaks it'),'s1',{verdict_tag:'BROKEN'},false);
chk('bare Cm, pair retracted (D4 vs C1)',syn('KEYSTONE: D4 -- BROKEN -- broken against C1'),'s1',{verdict_tag:'BROKEN'},true);
chk('label of another link, not retracted (D6 vs C1)',syn('KEYSTONE: D4 -- BROKEN -- see D6 vs C1'),'s1',{verdict_tag:'BROKEN'},false);
chk('two keystone lines, last one names nothing',syn('KEYSTONE: D4 -- BROKEN -- D4 vs C1 fails\nKEYSTONE: D4 -- BROKEN -- restated'),'s1',{verdict_tag:'BROKEN'},false);
chk('markdown bold keystone',syn('**KEYSTONE:** D4 -- BROKEN -- D4 vs. C1 fails'),'s1',{verdict_tag:'BROKEN'},true);
chk('no retraction tag at all',JSON.stringify({verdict_tag:'BROKEN',reasoning:'KEYSTONE: D4 -- BROKEN -- D4 vs C1 fails'}),'s1',{verdict_tag:'BROKEN'},false);
console.log(ok?'RESULT: PASS':'RESULT: FAIL');
