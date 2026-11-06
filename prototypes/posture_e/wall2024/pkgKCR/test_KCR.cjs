// pkgKCR test (run from wall2024/): the K-CON cure reader on labelled lines, base pkgKCON vs new, plus vcCaught2024
const LIB=require('../pkgVC/lib.cjs');let ok=0,bad=0;const t=(c,m)=>{if(c){ok++;console.log('OK  ',m);}else{bad++;console.log('FAIL',m);}};
const N=['krulCure','krulText','krulNorm','kconUnlabel','vcCaught2024','kvNorm'];
const Q='the angel told Joseph that the child was conceived of the Holy Ghost';
const x={rule:'K-CON',side:'CHALLENGER',link:'K1',line:'[R3] ... no CONTRADICTION, NOT HELD or REASSERTED IN line of this judge quotes it: "'+Q+'"'};
const V=[
 ['A RESPONSE | NOT HELD, reason only','RESPONSE: K1 | NOT HELD: the later round restates the verse.','UNCURED','UNCURED'],
 ['B RESPONSE | NOT HELD, with quote','RESPONSE: K1 | NOT HELD -- K1 -- "'+Q+'" -- verse only.','UNCURED','CURED'],
 ['C bare NOT HELD, reason only','NOT HELD -- K1 -- the later round restates the verse only.','UNCURED','UNCURED'],
 ['D bare NOT HELD, with quote','NOT HELD -- K1 -- "'+Q+'" -- verse only.','CURED','CURED'],
 ['E STATEMENT NOT HELD, with quote','STATEMENT: NOT HELD -- K1 -- "'+Q+'" -- verse only.','UNCURED','CURED'],
 ['E2 **STATEMENT:** NOT HELD, with quote','- **STATEMENT:** NOT HELD -- "'+Q+'" -- verse only.','UNCURED','CURED'],
 ['G CONTRADICTION with quote','CONTRADICTION -- CHALLENGER -- EARLIER (R1, "x") -- LATER (R3, "'+Q+'")','CURED','CURED'],
 ['H RESPONSE | CONTRADICTION with quote','RESPONSE: K1 | CONTRADICTION -- CHALLENGER -- EARLIER (R1, "x") -- LATER (R3, "'+Q+'")','UNCURED','CURED'],
 ['N1 RESPONSE accepts, quote, no keyword','RESPONSE: K1 | I accept the mark: "'+Q+'"','UNCURED','UNCURED'],
 ['N2 keyword mid-sentence','RESPONSE: K1 | The mark is NOT HELD by me: "'+Q+'"','UNCURED','UNCURED'],
 ['N3 STATEMENT NONE FOUND with quote','STATEMENT: CONTRADICTIONS: NONE FOUND "'+Q+'"','UNCURED','UNCURED'],
 ['N4 STATEMENT prose then NOT HELD','STATEMENT: I hold that it is NOT HELD: "'+Q+'"','UNCURED','UNCURED'],
];
for(const [file,col] of [['pkgKCON/patched/Panel_Cure_Check.js',2],['pkgKCR/patched/Panel_Cure_Check.js',3],['pkgKCR/patched/Panel_Payloads.js',3],['pkgKCR/patched/Cure_Check.js',3]]){const L=LIB(file,N);
 for(const v of V){const r=L.krulCure(x,v[1],{},v[1].startsWith('RESPONSE')?v[1]:'');t(r.st===v[col],file.split('/')[0]+' '+file.split('/').pop()+' '+v[0]+' -> '+r.st+' (want '+v[col]+')');}}
// vcCaught2024 (Panel Payloads): a panel judge's labelled NOT HELD with the quote now counts as caught
const P=LIB('pkgKCR/patched/Panel_Payloads.js',N),B=LIB('pkgVC/patched/Panel_Payloads.js',N);
const vc={qs:[[P.kvNorm('I drop the claim that Matthew 1:25 by itself reaches back'),P.kvNorm('Matthew 1:25 denies that knowing up to the birth and more words here')]]};
const wt='STATEMENT: NOT HELD -- "Matthew 1:25 denies that knowing up to the birth" -- the narrowed span.';
t(!B.vcCaught2024(wt,vc)&&P.vcCaught2024(wt,vc),'vcCaught2024: labelled NOT HELD with the quote: base false, new true');
t(!P.vcCaught2024('STATEMENT: I accept "Matthew 1:25 denies that knowing up to the birth"',vc),'vcCaught2024: labelled line without the keyword is not caught');
console.log(ok,'OK',bad,'FAIL');process.exit(bad?1:0);
