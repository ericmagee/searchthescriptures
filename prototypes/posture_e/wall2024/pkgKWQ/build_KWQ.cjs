// pkgKWQ (W1, 11-08; 33774 engine fault, coordinator 18:18Z): the K-W NOT HELD quote check strips verse references like "(1:18)" (KWR_REF) from the
// flagged sentence before it builds the 6-word runs, but not from the reply. A reply that quotes the sentence WITH its references (33774 sol:
// "finding (1:18), the angel (1:20), the taking (1:24)") then matches nothing and stays UNCURED; sol was not seated.
// Fix: runs are built from the sentence both with and without its references, and each is matched against the reply both with and without its
// references. A reply that quotes either way is read as quoting. Nothing that cured before can fail: the old runs and the old reply text stay in the test.
// Base: pkgLIB/strip_RCD (v32). Out: pkgLIB/strip_KWQ. Run from wall2024/: node pkgKWQ/build_KWQ.cjs [base strip] [dest strip]
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const SRC=(process.argv[2]||'pkgLIB/strip_RCD')+'/patched/',DST=(process.argv[3]||'pkgLIB/strip_KWQ')+'/patched/';
const PLAN='pkgKWQ/plan_'+(process.argv[3]||'pkgLIB/strip_KWQ').replace(/\/$/,'').split('/').pop()+'.json';fs.rmSync(DST,{recursive:true,force:true});fs.mkdirSync(DST,{recursive:true});
const IG=String.raw`.replace(/^\s*I\s+(?:do\s+not\s+claim|no\s+longer\s+claim|withdraw|grant|concede|drop)\b/i,'')`;
const R=[
 ['runs with refs',`const runs=__rn(body).concat(...nhqFull(x.line,R).map(f=>__rn(nw(f.replace(KWR_REF,' ')${IG}))));`,
  `const runs=__rn(body).concat(...nhqFull(x.line,R).map(f=>__rn(nw(f.replace(KWR_REF,' ')${IG}))),__rn(nw((a>=0&&b>a?q.slice(a+1,b):q)${IG})),...nhqFull(x.line,R).map(f=>__rn(nw(f${IG})))); /* pkgKWQ: also the runs with the verse references kept */`],
 ['reply with and without refs',`const T=' '+nw(t).join(' ')+' ';if(runs.some(r=>r&&T.includes(' '+r+' ')))`,
  `const T=' '+nw(t).join(' ')+' ',T2=' '+nw(String(t).replace(KWR_REF,' ')).join(' ')+' ';if(runs.some(r=>r&&(T.includes(' '+r+' ')||T2.includes(' '+r+' ')))) /* pkgKWQ */`]];
const plan={base:SRC,nodes:{}};
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(SRC+f,'utf8');let s=s0;const hits=[];
 for(const [k,a,r] of R){const n=s.split(a).length-1;if(!n)continue;if(n!==1)throw new Error(f+' '+k+' x'+n);s=s.replace(a,()=>r);hits.push(k);}
 if(hits.length){if(hits.length!==R.length)throw new Error(f+' partial');new Function('$','$input','return (async()=>{\n'+s+'\n})();');plan.nodes[f]={base:h(s0),patched:h(s),anchors:hits};}
 fs.writeFileSync(DST+f,s);}
console.log(Object.keys(plan.nodes).length+' nodes patched');fs.writeFileSync(PLAN,JSON.stringify(plan,null,1));
