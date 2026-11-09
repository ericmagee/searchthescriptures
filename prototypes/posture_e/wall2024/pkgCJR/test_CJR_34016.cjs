// pkgCJR on run 34016: Haiku (alternate for luna) cure items, live s75 library (strip_WLG) vs pkgCJR (strip_CJR) and pkgKNL+pkgCJR stacked, through Alternate Merge Seat.
// Reads the AUDIT v21 report lines (SEAT: haiku) the node writes. Run from wall2024/: node pkgCJR/test_CJR_34016.cjs
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const W='/mnt/project-files/wall2024/fetchback_live_s75.json';
const nm='Alternate Merge Seat',f='Alternate_Merge_Seat.js';
const rep=o=>{const s=JSON.stringify(o).replace(/\\\\n|\\n/g,'\n');const m=[...s.matchAll(/\[AUDIT v21: DEBATE RULE VIOLATION REPORT -- SEAT: haiku; ITEM: ([^;]*); RULE: ([^;]*); RESULT: (CURED|UNCURED); WHY: ([^;\]]*)/g)].map(x=>x[2]+' | '+x[1]+' | '+x[3]+' | '+x[4].slice(0,90));return [...new Set(m)];};
let ok=0,bad=0;const T=(c,m)=>{c?ok++:bad++;console.log((c?'OK   ':'FAIL ')+m);};
const fe='Alternate Cure Normalize';const H=harness('34016');
const run=p=>rep(H(fs.readFileSync(p+'/patched/'+f,'utf8'),fe));
const a=run('pkgLIB/strip_WLG'),b=run('pkgLIB/strip_CJR');
const cnt=(L,s)=>L.filter(x=>x.includes('| '+s+' |')).length;
console.log('live s75: '+a.length+' Haiku items, cured '+cnt(a,'CURED'));a.forEach(x=>console.log('   '+x));
console.log('pkgCJR: '+b.length+' Haiku items, cured '+cnt(b,'CURED'));b.forEach(x=>console.log('   '+x));
T(a.length===17&&cnt(a,'CURED')===0,'live s75 reproduces the run: 17 Haiku items, none cured');
T(b.length===17&&b.filter(x=>/no written response/i.test(x)).every(x=>/^K-F \| FORCED/.test(x)),'pkgCJR: every Haiku RESPONSE is read; only K-F FORCED (raised on "FORCED: none graded.", removed upstream by pkgKNL) has none');
T(cnt(b,'CURED')===7,'pkgCJR: 7 items cure (K-W #2, #5, #7 conceded; K-W #9, #10 NOT HELD quoting the sentence; K-CMT; K-CMTL line 1)');
T(b.filter(x=>/^K-W .*\| UNCURED \|/.test(x)).length===7,'pkgCJR: 7 K-W items read and still uncured on content: NOT HELD with a reason that does not quote the flagged sentence (a judge form failure, W3 to rule)');
if(fs.existsSync('pkgLIB/strip_KNLCJR')){const c=run('pkgLIB/strip_KNLCJR');console.log('pkgKNL + pkgCJR: '+c.length+' Haiku items, cured '+cnt(c,'CURED'));c.forEach(x=>console.log('   '+x));
 T(JSON.stringify(c)===JSON.stringify(b),'pkgKNL + pkgCJR: the same at this node (the K-F and K-CMT items are raised upstream; probe_KNL covers them)');}
console.log('TOTAL '+ok+' OK, '+bad+' FAIL');
