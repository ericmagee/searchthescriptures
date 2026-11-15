// F5 test: the built kwVq2024 text from the target's LIB 1201, with Cited Verses stubbed by 4 KJV rows (kjv_verses), and the kwSt rule as built.
const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2]));const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));
const l=L[1201];const a=l.indexOf('const kwVq2024='),b=l.indexOf('const rp=respOf');const kst=l.match(/const kwSt=t=>[^;]*;/)[0];
const CV=[{book:'Luke',chapter:3,verse:23,text:"And Jesus himself began to be about thirty years of age, being (as was supposed) the son of Joseph, which was [the son] of Heli,"},{book:'Acts',chapter:16,verse:13,text:"And on the sabbath we went out of the city by a river side, where prayer was wont to be made; and we sat down, and spake unto the women which resorted [thither]. [sabbath: Gr. sabbath day]"},{book:'Matthew',chapter:1,verse:20,text:"But while he thought on these things, behold, the angel of the Lord appeared unto him in a dream, saying, Joseph, thou son of David, fear not to take unto thee Mary thy wife: for that which is conceived in her is of the Holy Ghost. [conceived: Gr. begotten]"},{book:'Luke',chapter:1,verse:27,text:"To a virgin espoused to a man whose name was Joseph, of the house of David; and the virgin's name [was] Mary."}];
const mk=cv=>new Function('$',l.slice(a,b)+kst+'return kwSt;')(nm=>({all:()=>nm==='Cited Verses'?cv.map(j=>({json:j})):[]}));
const f=mk(CV),f0=mk([]);
const C=[
['MUST 39144 luna (no tag, Luke 3:23 quoted)',"STANDS WITHOUT IT because Luke 3:23 says “being (as was supposed) the son of Joseph,” and Acts 16:13 says “where prayer was wont to be made”; the defender’s conclusion is supported by those cited rows and Luke 2:49.",1],
['CTRL tagged answer still cures',"STANDS WITHOUT IT because [L1] Luke 1:27: “a man whose name was Joseph, of the house of David.”",1],
['CTRL non-KJV words with reference',"STANDS WITHOUT IT because Luke 3:23 says “he was thought to be the son of Joseph.”",0],
['CTRL reference, no quote',"STANDS WITHOUT IT because Luke 3:23 carries it.",0],
['CTRL quote, no reference',"STANDS WITHOUT IT because the verse says “being (as was supposed) the son of Joseph.”",0],
['CTRL verse not served',"STANDS WITHOUT IT because John 1:13 says “not of blood, nor of the will of the flesh.”",0],
['CTRL two-word quote',"STANDS WITHOUT IT because Luke 3:23 says “son of”.",0],
['CTRL no STANDS WITHOUT IT',"NOT HELD because Luke 3:23 says “being (as was supposed) the son of Joseph.”",0],
['CTRL ellipsis run',"STANDS WITHOUT IT because Matthew 1:20 says “fear not to take unto thee Mary thy wife ... that which is conceived in her is of the Holy Ghost.”",1],
];let bad=0;for(const [nm,t,w] of C){const r=f(t),r0=f0(t);const ok=(!!r)===!!w&&(r0===/\[L[1-3]\]/.test(t));if(!ok)bad++;console.log(ok?'ok ':'BAD',nm,'|',r,'| no served verses:',r0);}console.log('bad',bad);
