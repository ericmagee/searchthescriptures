// ASK 656 step 1 (W4, read only): runs with a pressed range; PRESSL today (first verse of a range) against both sides expanded through REFP. node count656.cjs
const fs=require('fs');const W4='/mnt/project-files/ask654/w4/';
const outer=JSON.parse(fs.readFileSync(__dirname+'/press_refs_raw.txt','utf8')).result;const rows=JSON.parse(outer.slice(outer.indexOf('\n[')+1,outer.lastIndexOf(']')+1));
const E=JSON.parse(fs.readFileSync(W4+'b2/tg/live_a5c3001d.json','utf8'));const T=E.nodes.find(k=>k.name==='Shared Library').parameters.jsCode;const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')));
const reb=p=>p.map(x=>typeof x==='number'?L[x]:typeof x[0]==='string'?x[0]:L.slice(x[0],x[1]+1).join('\n')).join('\n');const R=new Function(reb(M.REFP.p)+'\n;return REFP;')();
const first=s=>s.replace(/\s*[-–]\s*\d+$/,'');const exp=s=>{const k=[...new Set(R.keys(s,{cap:30}).map(x=>x.key))];return k.length?k:[first(s)];};
const nm=s=>{const k=R.keys(first(s),{cap:30});return k.length?k[0].key:first(s);};
const G={};for(const r of rows){(G[r.id+'/'+r.o]=G[r.id+'/'+r.o]||{P:[],A:[]})[r.k]=r.refs.split('|');}
let T0={runs:new Set(),sides:0,rangesP:0,headRange:0,headFirst:0,headEach:0,headNone:0,found:0,opensOld:0,opensNew:0,created:0,removed:0};const ex=[];
const SPLIT=process.argv[2];for(const [key,g] of Object.entries(G)){if(SPLIT==='with'&&!(g.A&&g.A.length))continue;if(SPLIT==='without'&&g.A&&g.A.length)continue;const rp=g.P.filter(s=>/[-–]\s*\d+$/.test(s));if(!rp.length)continue;T0.runs.add(key.split('/')[0]);T0.sides++;T0.rangesP+=rp.length;
 const A=g.A||[];const Aold=new Set(A.map(first)),Anew=new Set(A.flatMap(exp));
 for(const s of rp){const ks=exp(s);if(A.includes(s))T0.headRange++;else if(Aold.has(first(s))&&!ks.slice(1).some(k=>Aold.has(k)))T0.headFirst++;else if(ks.every(k=>Aold.has(k)))T0.headEach++;else T0.headNone++;}
 const Praw=[...new Set(g.P.map(first))],Araw=new Set(A.map(first));const oRaw=Praw.filter(k=>!Araw.has(k));const Pnm=[...new Set(g.P.map(nm))],Anm=new Set(A.map(nm));const oNm=Pnm.filter(k=>!Anm.has(k));T0.opensRaw=(T0.opensRaw||0)+oRaw.length;T0.opensNamesOnly=(T0.opensNamesOnly||0)+oNm.length;
 const Pold=Pnm,Pnew=[...new Set(g.P.flatMap(exp))];T0.found+=Pnew.filter(k=>!Pold.includes(k)).length;
 const oOld=oNm,oNew=Pnew.filter(k=>!Anew.has(k));T0.opensOld+=oOld.length;T0.opensNew+=oNew.length;
 const cr=oNew.filter(k=>!oOld.includes(k)),rm=oOld.filter(k=>!oNew.includes(k));T0.created+=cr.length;T0.removed+=rm.length;
 if(cr.length||rm.length)ex.push(key+' ranges '+rp.join('; ')+' | opens created '+cr.join('; ')+' | removed '+rm.join('; '));}
T0.runs=T0.runs.size;console.log(JSON.stringify(T0));console.log(ex.slice(0,15).join('\n'));console.log('sides with a change: '+ex.length);
