const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const lib=w=>{const T=w.nodes.find(z=>z.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));return M['Panel Payloads'].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');};
const fn=(S,name)=>{const i=S.indexOf('\nfunction '+name+'(');const j=S.indexOf('\nfunction ',i+1);return S.slice(i+1,j);};
const mk=S=>new Function('const wpLines2024=()=>({items:[],marks:[]}),kconLines2024=()=>({items:[],marks:[]}),kcmtLines2024=()=>({items:[],marks:[]});\n'+fn(S,'kwiCut2024')+'\n'+fn(S,'kwiSq2024')+'\n'+fn(S,'kwLines421')+'\nreturn kwLines421;')();
const A=mk(lib(un(process.argv[2]))),B=mk(lib(un(process.argv[3])));
const kw=(f,t)=>f('',{CR2:t}).items.filter(x=>x.rule==='K-W').length;
const old12=Array.from({length:12},(_,i)=>'I grant point '+(i+1)+' of the challenger.').join(' ');
const P=[
['quoted new form','He wrote "I also concede the verse" in his round.',0],
['If, no comma','If I also grant this the chain still holds.',0],
['If, with comma (taken)','If the verse is read so, I also grant that Joseph is named.',1],
['question','Do I now withdraw Galatians 4:4?',0],
['give up nothing','I give up nothing in D4.',0],
['also concede none','I also concede none of the six points.',0],
['adverb outside list','I gladly grant that Luke 2:48 names Joseph.',0],
['three adverbs','I also now therefore grant that Joseph is named.',0],
['bold new form','**I also grant** that Joseph is named in Luke 3:23.',1],
['heading What I also concede over plain row','## What I also concede\nThe verse names Joseph.',0],
['cap: 12 old + 1 new',old12+' I also grant that Luke 2:48 names Joseph.',11],
['cap: 12 new','Array',12],
];
P[11][1]=Array.from({length:12},(_,i)=>'I also grant point '+(i+1)+' of the challenger.').join(' ');
let ok=0;for(const [nm,t,exp] of P){const a=kw(A,t),b=kw(B,t);const r=b===exp;ok+=r;console.log((r?'PASS':'FAIL')+' '+nm+': live '+a+', new '+b+', expected '+exp);}console.log(ok+'/'+P.length);
