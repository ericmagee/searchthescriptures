// Unit test: old vs new netLines (from Extract Independent Verdict) on fixture lines. Fixtures typed from the SQL reads of debate_judgments 876, 878 and 827.
const fs=require('fs');
const lib=f=>{const s=fs.readFileSync(f,'utf8');const a=s.indexOf('const NET_STATE');const b=s.indexOf(' return out;}',s.indexOf('function netLines'))+13;return new Function(s.slice(a,b)+';return netLines;')();};
const O=lib('base/Extract Independent Verdict.js'), N=lib('new/Extract Independent Verdict.js');
const T=[
 ['answer test (876 restated)','CONCEDED LINKS: 3 -- Premises 2, 4 and 5 are UNEXHIBITED because pressed witnesses went unanswered. For premise 2, the challenger\'s chain compares John 1:13 with 1 John 3:9, 4:7 and 5:1; the later defense does not name the three 1 John witnesses.',0],
 ['answer test (878)','CONCEDED LINKS: 1 -- premise 5 (LINK 4): UNEXHIBITED -- [DR2] premise 5 pressed Luke 1:27 against the Mary-line limb and the defender\'s [CR3] block never names Luke 1:27, quoting Luke 2:4 instead.',0],
 ['mixed (827 shape): stating ground stays','D2: STANDS -- verses on the cited-in lists that later rounds do not name, including Luke 2:27, Luke 1:27 and 1 John 5:1, do not in their own words state that Joseph begat the child, so they are not ground for BROKEN.',1],
 ['true K-C stays','D6 vs C4 (Acts 2:30): UNDERDETERMINED -- the seed rows require flesh descent but do not name Joseph as the begetter.',1],
 ['true K-C stays (no verse states)','D1: STANDS -- no verse states that Joseph begat Jesus, and the timing rows answer it.',1],
];
let bad=0;
for(const [nm,txt,expNew] of T){const o=O(txt,['C4','C6']).length,n=N(txt,['C4','C6']).length;const ok=(n>0?1:0)===expNew;bad+=!ok;console.log((ok?'OK ':'BAD')+' old '+o+' new '+n+' :: '+nm);}
console.log('bad',bad);
