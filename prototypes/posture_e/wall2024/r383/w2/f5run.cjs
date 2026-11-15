const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2]));const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));
const l=L[1201];const a=l.indexOf('const kwVq2024='),b=l.indexOf('const rp=respOf');const kst=l.match(/const kwSt=t=>[^;]*;/)[0];
const CV=JSON.parse(process.argv[3]);
const f=new Function('$',l.slice(a,b)+kst+'return kwSt;')(nm=>({all:()=>nm==='Cited Verses'?CV.map(j=>({json:j})):[]}));
const C=[
['straight single quotes',"STANDS WITHOUT IT because Luke 3:23 says 'being (as was supposed) the son of Joseph'.",'?'],
['curly single quotes',"STANDS WITHOUT IT because Luke 3:23 says ‘being (as was supposed) the son of Joseph’.",1],
['three-word fragment',"STANDS WITHOUT IT because Luke 3:23 says “the son of”.",'?'],
['bad quote then good quote',"STANDS WITHOUT IT because Luke 3:23 says “he was thought the son” and Luke 1:27 says “of the house of David”.",1],
['colon after ref',"STANDS WITHOUT IT because Luke 3:23: “being (as was supposed) the son of Joseph”.",1],
['bold ref',"STANDS WITHOUT IT because **Luke 3:23** says “being (as was supposed) the son of Joseph”.",1],
['wrong verse number',"STANDS WITHOUT IT because Luke 3:24 says “being (as was supposed) the son of Joseph”.",0],
['range 1:27 served only',"STANDS WITHOUT IT because Luke 1:27-28 says “of the house of David”.",0],
['added word inside quote',"STANDS WITHOUT IT because Luke 3:23 says “being (as was supposed) the true son of Joseph”.",0],
['margin note words',"STANDS WITHOUT IT because Acts 16:13 says “sabbath Gr sabbath day”.",'?'],
['lowercase standswithout',"stands without it because Luke 3:23 says “being (as was supposed) the son of Joseph”.",1],
];for(const [nm,t,w] of C){const r=f(t);console.log((w==='?'?'?? ':(!!r)===!!w?'ok ':'BAD'),nm,'|',r);}
