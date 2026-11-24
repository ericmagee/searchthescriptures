// W4 helper: apply LIB line edits to a workflow's Shared Library, recompute MAP n for touched keys, reset the header library sha.
// edits: [{line:<index>|null (search), a:<anchor>, b:<replacement or function>, what}]. Each anchor must occur once in its line (or once in all of LIB when line is null).
const fs=require('fs');const crypto=require('crypto');const md5=s=>crypto.createHash('md5').update(s).digest('hex');
function once(s,a,b,what){const k=s.split(a).length-1;if(k!==1)throw new Error(what+': anchor occurs '+k+' times');return s.replace(a,typeof b==='function'?b:()=>b);}
function cut(W){const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;const a=T.indexOf('\n/*LIB*/')+8,b=T.lastIndexOf('\n/*MAP*/'),c0=b+8,e=T.lastIndexOf('\n/*END*/');return {N,T,a,b,c0,e,L:JSON.parse(T.slice(a,b)),M:JSON.parse(T.slice(c0,e))};}
function src(W,key){const {L,M}=cut(W);const v=M[key];return v.p.map(x=>typeof x==='number'?L[x]:typeof x[0]==='string'?x[0]:L.slice(x[0],x[1]+1).join('\n')).join('\n');}
function apply(W,edits){const {N,T,a,b,c0,e,L,M}=cut(W);const L0=L.slice();const CH=new Set();
 const MAPCH=[];for(const ed of edits.filter(x=>x.map)){const v=M[ed.map];const hits=[];v.p.forEach((x,j)=>{if(Array.isArray(x)&&typeof x[0]==='string'){const k=x[0].split(ed.a).length-1;for(let q=0;q<k;q++)hits.push(j);}});if(hits.length!==1)throw new Error(ed.what+': anchor occurs '+hits.length+' times in MAP '+ed.map+' string parts');v.p[hits[0]][0]=once(v.p[hits[0]][0],ed.a,ed.b,ed.what);MAPCH.push(ed.map);}
 edits=edits.filter(x=>!x.map);
 for(const ed of edits){let i=ed.line;if(i==null){const hits=[];L.forEach((l,j)=>{const k=l.split(ed.a).length-1;for(let q=0;q<k;q++)hits.push(j);});if(hits.length!==1)throw new Error(ed.what+': anchor occurs '+hits.length+' times in LIB');i=hits[0];}
  L[i]=once(L[i],ed.a,ed.b,ed.what+' (LIB '+i+')');CH.add(i);ed.at=i;}
 for(let i=0;i<L.length;i++)if(L[i]!==L0[i]&&!CH.has(i))throw new Error('unexpected change at '+i);
 const cov=(p,i)=>p.some(x=>typeof x==='number'?x===i:Array.isArray(x)&&typeof x[0]==='number'&&i>=x[0]&&i<=x[1]);
 const rebuild=p=>p.map(x=>typeof x==='number'?L[x]:typeof x[0]==='string'?x[0]:L.slice(x[0],x[1]+1).join('\n')).join('\n');
 const mapT=[];for(const [k,v] of Object.entries(M)){if(!v||!Array.isArray(v.p)||(![...CH].some(i=>cov(v.p,i))&&!MAPCH.includes(k)))continue;const n=rebuild(v.p).length;if(n!==v.n){mapT.push(k+' '+v.n+'->'+n);v.n=n;}}
 let head=T.slice(0,a);const LIBJ=JSON.stringify(L);const LS=fs.readFileSync('/mnt/project-files/ask519/w4/libcheck/libcheck.js','utf8');const SHA=new Function(LS.slice(0,LS.indexOf('const __LIBSHA422'))+'\nreturn __SHA422;')();const sha=SHA(LIBJ).slice(0,16);
 const hm=head.match(/library sha [0-9a-f]{16}/g);if(!hm||hm.length!==1)throw new Error('header sha count');const oldsha=hm[0].slice(12);head=head.replace(/library sha [0-9a-f]{16}/,'library sha '+sha);
 const before=md5(T);N.parameters.jsCode=head+LIBJ+T.slice(b,c0)+JSON.stringify(M)+T.slice(e);
 return {oldsha,newsha:sha,map_touched:mapT,lib_changed:[...CH].map(i=>i+' '+md5(L0[i]).slice(0,8)+'->'+md5(L[i]).slice(0,8)),node:'Shared Library '+before.slice(0,8)+'->'+md5(N.parameters.jsCode).slice(0,8)};}
module.exports={apply,cut,src,once,md5};
