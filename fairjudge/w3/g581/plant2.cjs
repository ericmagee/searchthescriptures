const fs=require('fs');const {B,A}=require('./mk.cjs');const rows=JSON.parse(fs.readFileSync('./rows.json','utf8')).filter(r=>!(r.book==='Genesis'&&r.chapter==24&&r.verse==16));
const H='**PRESS 1.** Against D2, the point pressed here with its verses.\n';
const t='[L1] Matthew 1:22-23: "Behold, a virgin shall be with child"\n[L3] On Genesis 24: I grant that Genesis 24:43 uses the word of the virgin whom 24:16 shows to be Rebekah, "a virgin, neither had any man known her".';
console.log('P7 with the Genesis 24:16 row absent: before',B.check(H+t,rows).items.length,'after',A.check(H+t,rows).items.length);
const t2='[L1] Matthew 1:22-23: "Behold, a virgin shall be with child"\n[L3] On Genesis 24: I grant that Genesis 24:43 uses the word of the virgin whom 24:16 shows to be Rebekah, "a made up quotation that is in no verse".';
const all=JSON.parse(fs.readFileSync('./rows.json','utf8'));
console.log('P7 wrong words, row present: after',A.check(H+t2,all).items.length,'| row absent: after',A.check(H+t2,rows).items.length);
