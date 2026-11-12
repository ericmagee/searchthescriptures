const src=require('fs').readFileSync(process.argv[2],'utf8');const pre=src.slice(0,src.indexOf('const H=['));const {L,P,ctx}=new Function('require',pre+';return {L,P,ctx};')(require);
const IT={rule:'E-UNG',item:'D2 vs C6'};const HD={rule:'E-HOLD',item:'D2'};
const LN='D2 vs C6 (Luke 1:35): UNDERDETERMINED -- shown by both sides -- GROUND: [L1] Luke 1:35 "therefore also that holy thing which shall be born of thee shall be called the Son of God"';
const LN0='D2 vs C6 (Luke 1:35): UNDERDETERMINED -- shown by both sides -- GROUND: Luke 1:35 settles nothing here';
const T=[
 ['P1 reason negates','E',LN,'The record does not leave it open; Luke 1:35 settles it.','UNCURED?'],
 ['P2 reason reports opponent','E',LN,'The challenger says the record leaves it open; I do not agree.','UNCURED?'],
 ['P3 KJV verse in reason only, no [L1] tag','E',LN0,'Luke 1:35 "that holy thing" and the record leaves open whether the reach goes back.','?'],
 ['P4 [L1] tag in reason, open in line','E',LN0+' and the record leaves open whether','[L1] Luke 1:35 "shall be called the Son of God"','CURED'],
 ['P5 open in reason, E-HOLD','H','D2 vs C6: UNDERDETERMINED -- GROUND: [L1] Luke 1:35 "shall be called the Son of God"','Both readings agree with the verse.','CURED'],
 ['P6 reason empty string','E',LN,'','UNCURED'],
 ['P7 reason is whitespace','E',LN,'   ','UNCURED'],
 ['P8 KEEP + full reason','K',LN,'[L1] Luke 1:35 "x" and the record leaves open whether','UNCURED'],
 ['P9 BROKEN grade, reason open','B','D2 vs C6 (Luke 1:35): DEFENDER LINK BROKEN -- GROUND: x','the record leaves open whether','same'],
];
for(const [nm,k,to,why,want] of T){const it=k==='H'?HD:IT;const a={ans:k==='K'?'KEEP':'CHANGE',to,why};const l=L.UND.cure(it,a,ctx),p=P.UND.cure(it,a,ctx);console.log(nm,'| want',want,'| live',l.status,'| pkg',p.status,'--',p.why.slice(0,140));}
