const fs=require('fs');const P=fs.readFileSync('pkgK/patched/Panel_Payloads.js','utf8');
const i0=P.indexOf('// ======== WALL-2024 Commitment 12');const i1=P.indexOf('\nfunction kconLines2024(',i0);eval(P.slice(i0,i1));
const I=[{book:'Galatians',chapter:4,verse:4,text:'But when the fulness of the time was come, God sent forth his Son, made of a woman, made under the law,'},
{book:'Isaiah',chapter:7,verse:14,text:'Therefore the Lord himself shall give you a sign; Behold, a virgin shall conceive, and bear a son, and shall call his name Immanuel. [shall call: or, thou, O virgin, shalt call]'},
{book:'Luke',chapter:3,verse:23,text:'And Jesus himself began to be about thirty years of age, being (as was supposed) the son of Joseph, which was [the son] of Heli,'},
{book:'Matthew',chapter:1,verse:19,text:'Then Joseph her husband, being a just [man], and not willing to make her a publick example, was minded to put her away privily.'}];
let bad=0;const T=(n,c,exp,ok,extra)=>{const r=kkjvLines2024(c,I);const g=ok(r);console.log((g?'OK  ':'FAIL')+' '+n+' items='+r.items.length+(extra?' '+extra(r):''));if(!g)bad++;};
T('K4a ESV-style Isaiah 7:14','Isaiah 7:14 "the young woman shall conceive and bear a son"',1,r=>r.items.length===1&&/virgin/.test(r.items[0].line));
T('K4b NIV-style Matthew 1:19','Matthew 1:19 "Joseph her husband was faithful to the law"',1,r=>r.items.length===1);
T('K5a exact Matthew 1:19 with [man]','Matthew 1:19 "being a just [man], and not willing to make her a publick example"',0,r=>r.items.length===0);
T('K5b exact without italics bracket','Matthew 1:19 "being a just man, and not willing to make her a publick example"',0,r=>r.items.length===0);
T('K5c Luke 3:23 parenthesis','Luke 3:23 "being (as was supposed) the son of Joseph"',0,r=>r.items.length===0);
T('K6a NIV named','The NIV renders it otherwise; I rule that out.',0,r=>r.items.length===0&&r.report.some(x=>/OTHER VERSION/.test(x)),r=>JSON.stringify(r.report));
T('K6b LXX named','The LXX parthenos is not footing.',0,r=>r.items.length===0&&r.report.some(x=>/OTHER VERSION/.test(x)),r=>JSON.stringify(r.report));
T('Z2a case and punctuation','galatians 4:4 "MADE OF A WOMAN; made under the law"',0,r=>r.items.length===0);
T('Z2b ellipsis join','Isaiah 7:14 "Behold, a virgin shall conceive ... Immanuel"',0,r=>r.items.length===0);
T('NC not served','Romans 1:3 "made of the seed of David according to the flesh"',0,r=>r.items.length===0&&r.report.some(x=>/NOT CHECKED/.test(x)),r=>JSON.stringify(r.report));
T('one wrong word','Galatians 4:4 "God sent forth his Son, born of a woman"',1,r=>r.items.length===1);
console.log(bad?'FAILS '+bad:'ALL OK');
