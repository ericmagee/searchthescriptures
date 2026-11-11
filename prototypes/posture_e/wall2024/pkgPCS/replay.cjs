// pkgPCS replay: both psGrades copies (A: Gate/Send Back/Alternate Merge layout 1376-1383; B: Cure Check layout 1376-1380,1643,1382-1383), live s141 vs PCS.
const fs=require('fs');
const lib=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;j=j.workflow||j;const T=j.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/');return JSON.parse(T.slice(a+8,b));};
const mk=(Lb,lines)=>{const def=name=>{const i=Lb.findIndex(l=>new RegExp('function '+name+'\\b').test(l));let j=i,src='';while(j<Lb.length){src+=Lb[j]+'\n';try{new Function(src);return src;}catch(e){j++;}}};
 let src=lines.map(i=>Lb[i]).join('\n');for(let k=0;k<30;k++){try{const f=new Function(src+';return psGrades;')();f('CONCEDED LINKS: 0 -- premise 1 VOID');return f;}catch(e){const m=String(e.message).match(/(\w+) is not defined/);if(!m)throw e;src=def(m[1])+src;}}};
const R=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
const LA=[...R(1376,1383)],LB=[...R(1376,1380),1643,1382,1383];
const L0=lib(process.argv[2]),L1=lib(process.argv[3]);
const F={A0:mk(L0,LA),A1:mk(L1,LA),B0:mk(L0,LB),B1:mk(L1,LB)};
const g=(f,l)=>{const r=f(l);return r?JSON.stringify(r.g):'null';};
const H='CHALLENGER CONCEDED LINKS: 0 -- ';
const P=[
 ['sol 35173',H+'No premises counted; premises 1 and 6 remain VOID as previously charged, and premises 2 through 5 remain spared.',{1:'VOID',2:'SPARED',3:'SPARED',4:'SPARED',5:'SPARED',6:'VOID'}],
 ['33149',H+'Premises 2 and 5 UNEXHIBITED; premises 3 is spared, and premises 1, 4 and 6 remain VOID as charged.',{1:'VOID',2:'COUNTED',3:'SPARED',4:'VOID',5:'COUNTED',6:'VOID'}],
 ['while',H+'premise 2 is VOID, while premises 3 to 5 are spared.',{2:'VOID',3:'SPARED',4:'SPARED',5:'SPARED'}],
 ['but',H+'premise 1 is spared, but premise 4 is VOID.',{1:'SPARED',4:'VOID'}],
 ['list and',H+'premises 2, 3, and 5 are spared.',{2:'SPARED',3:'SPARED',5:'SPARED'}],
 ['gradeless first',H+'premises 1 and 6, and premises 2 to 5, are spared.',{1:'SPARED',6:'SPARED',2:'SPARED',3:'SPARED',4:'SPARED',5:'SPARED'}],
 ['not void',H+'premise 4 is not void, and premise 5 is VOID.',null],
 ['no comma',H+'premise 1 is VOID and premise 2 is spared.',null],
];
console.log('PLANTS (A = Gate/Send Back copy, B = Cure Check copy)');
for(const [n,l,e] of P){const E=e?JSON.stringify(Object.fromEntries(Object.entries(e).sort((x,y)=>+x[0]-+y[0]))):null;const a1=g(F.A1,l),b1=g(F.B1,l);
 console.log(n.padEnd(16),'A live',g(F.A0,l),'A new',a1,'| B live',g(F.B0,l),'B new',b1, E?((a1===E&&b1===E)?'AS EXPECTED':'NOT AS EXPECTED '+E):'(recorded)');}
// stored replay
const W='/mnt/project-files/wall2024/';const files=fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f)).sort();const seen=new Set();let n=0;const ch={A:[],B:[]};
for(const f of files){const u=fs.readFileSync(W+f,'utf8').replace(/\\\\n/g,'\n').replace(/\\n/g,'\n').replace(/\\u201[89]/g,"'").replace(/\\u201[cd]/g,'"').replace(/\\"/g,'"');
 for(const m of u.matchAll(/(?:DEFENDER |CHALLENGER )?CONCEDED LINKS\s*:[^\n]{0,800}/g)){const l=m[0];if(seen.has(l))continue;seen.add(l);n++;
  for(const k of ['A','B']){const o=g(F[k+'0'],l),w=g(F[k+'1'],l);if(o!==w)ch[k].push([f,l,o,w]);}}}
console.log('\nSTORED: files',files.length,'distinct CONCEDED LINKS strings',n,'changed in A',ch.A.length,'changed in B',ch.B.length);
for(const k of ['A','B'])for(const [f,l,o,w] of ch[k])console.log(k,f,'|',l.slice(0,300),'\n   live',o,'\n   new ',w);
