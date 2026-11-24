// ASK 571 build (W4, DRAFT): one stored copy of the L2C sheet code in the Shared Library, served to the 30 engine nodes that hold it.
// node build571.js <base_engine> <base_child> <out_engine> <out_child>
// 1. Each of the 7 L2C texts becomes a MAP entry "L2C <variant>" over LIB lines. Existing LIB lines are reused where a line is identical; new lines are APPENDED (gate entries address lines by index).
// 2. The Build text carries ASK 565 (cited-first pass) and ASK 568 (CAPC 130000), as graded in ask565/w4/build/patch565_568.js.
// 3. In each node, the block const L2C=(()=>{...})(); is replaced by a loader in the pkgREFP shape. $ is passed; REFP is passed lazily (it is declared after L2C in most nodes).
//    Where the text holds $('L2 Count Plan'), the node keeps that literal in an if(false){} line so the node text still names it.
// 4. The child's Shared Library gets the same LIB and MAP (the child's Library Check compares both).
const fs=require('fs'),crypto=require('crypto');const md5=s=>crypto.createHash('md5').update(s).digest('hex');
const {cut}=require('./cutl2c.js');
const [,,BE,BC,OE,OC]=process.argv;const E=JSON.parse(fs.readFileSync(BE,'utf8')),C=JSON.parse(fs.readFileSync(BC,'utf8'));
const s565=fs.readFileSync('/mnt/project-files/ask565/w4/build/patch565_568.js','utf8');const A565=eval(s565.match(/const A=(".*?");\n/)[1]),INS565=eval(s565.match(/const INS=(".*?");\n/)[1]);
const once=(s,a,b,w)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(w+': anchor occurs '+k);return s.replace(a,()=>b);};
const VAR={b299e365:'Extract','38744bf8':'Build','7f615d73':'Lexicon Plan','3885b8ed':'L2 Lexicon Plan','8eac181f':'Count Plan',dc5c8420:'Citation Scan',c8bd04c5:'Quote Report'};
// collect texts
const texts={},nodesOf={};
for(const n of E.nodes){const s=n.parameters&&n.parameters.jsCode;if(!s||n.name==='Shared Library')continue;const c=cut(s);if(!c)continue;const h=md5(c.st).slice(0,8);const v=VAR[h];if(!v)throw new Error('unknown L2C text '+h+' in '+n.name);
 if(texts[v]!==undefined&&texts[v]!==c.st)throw new Error('variant mismatch '+v);texts[v]=c.st;(nodesOf[v]=nodesOf[v]||[]).push(n.name);}
if(Object.keys(texts).length!==7)throw new Error('expected 7 texts, got '+Object.keys(texts).length);
// 565 + 568 on the Build text only
let tb=texts['Build'];tb=once(tb,A565,INS565+A565,'565');tb=once(tb,'const CAPC=26000;','const CAPC=130000;','568');const BUILD_SERVED=tb;
const served={...texts,Build:BUILD_SERVED};
// library
function lib(W){const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;const a=T.indexOf('\n/*LIB*/')+8,b=T.lastIndexOf('\n/*MAP*/'),c0=b+8,e=T.lastIndexOf('\n/*END*/');return {N,T,a,b,c0,e,L:JSON.parse(T.slice(a,b)),M:JSON.parse(T.slice(c0,e))};}
const LS=fs.readFileSync('/mnt/project-files/ask519/w4/libcheck/libcheck.js','utf8');const SHA=new Function(LS.slice(0,LS.indexOf('const __LIBSHA422'))+'\nreturn __SHA422;')();
function addEntries(W){const X=lib(W);const L=X.L,M=X.M;const L0n=L.length;const idx=new Map();L.forEach((l,i)=>{if(!idx.has(l))idx.set(l,i);});
 const keys={};
 for(const [v,t] of Object.entries(served)){const key='L2C '+v;if(M[key])throw new Error('MAP already has '+key);
  const ix=t.split('\n').map(l=>{if(!idx.has(l)){idx.set(l,L.length);L.push(l);}return idx.get(l);});
  const p=[];for(let k=0;k<ix.length;){let j=k;while(j+1<ix.length&&ix[j+1]===ix[j]+1)j++;p.push(j>k?[ix[k],ix[j]]:ix[k]);k=j+1;}
  const S=p.map(e=>typeof e==='number'?L[e]:L.slice(e[0],e[1]+1).join('\n')).join('\n');if(S!==t)throw new Error('rebuild mismatch '+key);
  M[key]={n:t.length,p};keys[key]={n:t.length,parts:p.length};}
 let head=X.T.slice(0,X.a);const LIBJ=JSON.stringify(L);const sha=SHA(LIBJ).slice(0,16);const hm=head.match(/library sha [0-9a-f]{16}/g);if(!hm||hm.length!==1)throw new Error('header sha count');
 const old=hm[0].slice(12);head=head.replace(/library sha [0-9a-f]{16}/,'library sha '+sha);
 X.N.parameters.jsCode=head+LIBJ+X.T.slice(X.b,X.c0)+JSON.stringify(M)+X.T.slice(X.e);
 return {old,sha,lines_before:L0n,lines_after:L.length,appended:L.length-L0n,keys};}
// loader
const NEEDS_REFP=v=>/\bREFP\b/.test(served[v]);
const loader=v=>{const key='L2C '+v;const body=NEEDS_REFP(v)
 ?"return new Function('$','__RF',\"const REFP=new Proxy({},{get:(o,k)=>{const r=__RF();const x=r[k];return typeof x==='function'?x.bind(r):x;}});\\n\"+S+'\\nreturn L2C;')($,()=>REFP);"
 :"return new Function('$',S+'\\nreturn L2C;')($);";
 return (/\$\('L2 Count Plan'\)/.test(served[v])?"if(false){$('L2 Count Plan');}\n":'')+
 "const L2C=(T=>{const L=JSON.parse(T.slice(T.indexOf('\\n/*LIB*/')+8,T.lastIndexOf('\\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\\n/*MAP*/')+8,T.lastIndexOf('\\n/*END*/')))["+JSON.stringify(key)+"];if(!M)throw new Error('pkgL2C: the Shared Library holds no "+key+" entry');const S=M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\\n')).join('\\n');if(S.length!==M.n)throw new Error('pkgL2C: rebuilt "+key+" is '+S.length+', expected '+M.n);"+body+"})($('Shared Library').params.jsCode);";};
const rep=[];
for(const [v,ns] of Object.entries(nodesOf))for(const name of ns){const n=E.nodes.find(x=>x.name===name);const s=n.parameters.jsCode;const c=cut(s);
 const s2=s.slice(0,c.i)+loader(v)+s.slice(c.e);n.parameters.jsCode=s2;rep.push({node:name,variant:v,before:s.length,after:s2.length,md5:md5(s).slice(0,8)+'->'+md5(s2).slice(0,8)});}
const le=addEntries(E),lc=addEntries(C);
if(le.sha!==lc.sha)throw new Error('engine and child library sha differ: '+le.sha+' '+lc.sha);
fs.writeFileSync(OE,JSON.stringify(E));fs.writeFileSync(OC,JSON.stringify(C));
fs.writeFileSync('served571.json',JSON.stringify(served));
console.log(JSON.stringify({engine_lib:le,child_lib:{old:lc.old,sha:lc.sha,appended:lc.appended},nodes:rep.length,variants:Object.fromEntries(Object.entries(nodesOf).map(([k,v])=>[k,v.length]))},null,1));
console.log('node chars before',rep.reduce((a,r)=>a+r.before,0),'after',rep.reduce((a,r)=>a+r.after,0));
