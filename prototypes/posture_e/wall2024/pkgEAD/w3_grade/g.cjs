// W3 harness for pkgEAD: sources rebuilt from the two workflow files themselves (live s112 fetch-back and the write file).
const fs=require('fs');process.chdir(__dirname+'/../..');const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');const H=require(process.cwd()+'/pkgEAD/harness_clone.cjs');
const load=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;d=d.workflow||d;const by={};d.nodes.forEach(n=>by[n.name]=n);return n=>rebuild(by[n].parameters.jsCode,by['Shared Library'].parameters.jsCode);};
const LIVE=load('/mnt/project-files/wall2024/fetchback_live_s112.json'),CAND=load(process.env.W3_C||'pkgEAD/parent_s112_EAD.json');
const NODES=[['Send Back Build','Judge Enforcer Record'],['Alt Send Back Build','Alt Judge Enforcer Record'],['R2 Alt Send Back Build','R2 Alt Judge Enforcer Record']];
function exOver(file){const ex=JSON.parse(fs.readFileSync(file,'utf8'));const r=(ex.data||ex).resultData.runData;const o={};for(const [n,runs] of Object.entries(r)){const last=runs[runs.length-1];o[n]=(last&&last.data&&last.data.main)||null;}return new Proxy(o,{has:()=>true,get:(t,k)=>k in t?t[k]:null});}
const J=o=>JSON.parse(JSON.stringify(o));const sig=x=>x.seat+'|'+x.rule+'|'+x.item+'|'+(x.flagged_line||x.line||'');
async function pair(run,node,inp,over){const a=await H.run(LIVE(node),run,inp,over);const b=await H.run(CAND(node),run,inp,over);return {a:a.map(x=>x.json),b:b.map(x=>x.json)};}
// strong check: the candidate's output equals the live node's output on an input from which the withheld rows are deleted (sb_not_sent apart)
async function strong(run,node,inp,over,B){const ead=(B[0].sb_not_sent||[]).filter(x=>/pkgEAD/.test(x.why));const gone=new Set(ead.map(x=>x.seat+'|'+x.rule+'|'+x.item));
 const o2=Object.assign({},over||{});const g=n=>{const v=(over&&over[n]!==undefined&&over[n]!==null)?over[n]:H.out(run,n);return v?J(v):v;};
 const pi=g(inp);const pj=pi.flat().filter(Boolean)[0].json;let del=0;const f=x=>{const k=!(x&&gone.has(x.seat+'|'+x.rule+'|'+x.item)&&/(?:under|at|in|see)\s+(?:LINK|Link|link|premise)\s*\d|\banswered\s+(?:at|under|in)\b|\banswer(?:s|ed)?\s+it\s+fully\b|\bpointer\b|\bdefers?\b/.test(String(x.cure_reason||''))&&/^ENFORCER (?:DISAGREE|NO ANSWER)/.test(String(x.cure_reason||'')));if(!k)del++;return k;};
 pj.enf428_rows=(pj.enf428_rows||[]).filter(f);o2[inp]=pi;const er=g('Enforcer Record');if(er){const ej=er.flat().filter(Boolean)[0].json;ej.enf421_rows=(ej.enf421_rows||[]).filter(f);o2['Enforcer Record']=er;}
 const base=over&&over.__proxy?over:null;const ov=over?new Proxy(o2,{has:()=>true,get:(t,k)=>k in t?t[k]:(over[k]===undefined?null:over[k])}):o2;
 const a2=(await H.run(LIVE(node),run,inp,over?ov:o2)).map(x=>x.json);const st=j=>{const y=J(j);delete y.sb_not_sent;delete y.enf428_rows;return JSON.stringify(y);};
 const bs=j=>String(j.seat);const A3=a2.slice().sort((x,y)=>bs(x)<bs(y)?-1:1),B3=B.slice().sort((x,y)=>bs(x)<bs(y)?-1:1);const eq=A3.length===B3.length&&A3.every((j,i)=>st(j)===st(B3[i]));const order_live=B.map(bs).join(',');const nsA=JSON.stringify(a2[0].sb_not_sent||[]),nsB=JSON.stringify((B[0].sb_not_sent||[]).filter(x=>!/pkgEAD/.test(x.why)));
 return {eq,ns:nsA===nsB,del,ead:ead.length,order_cand:order_live,order_livedel:a2.map(bs).join(',')};}
module.exports={H,LIVE,CAND,NODES,exOver,pair,strong,J,sig};
