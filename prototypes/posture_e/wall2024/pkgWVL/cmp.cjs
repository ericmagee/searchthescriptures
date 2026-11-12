const fs=require('fs');const ld=f=>{const g={};new Function('g',fs.readFileSync(f,'utf8').replace('const cecWvr','g.f'))(g);return g.f;};
const A=ld(process.argv[2]),B=ld(process.argv[3]);let runs=0,na=0,nb=0;const seen=new Set();
for(const f of process.argv.slice(4))for(const F of [].concat(JSON.parse(fs.readFileSync(f)))){if(seen.has(F.t))continue;seen.add(F.t);runs++;const a=A(F,[]),b=B(F,[]);na+=a.length;nb+=b.length;
 const ka=new Set(a.map(c=>c.earlier_q+'|'+c.closing_q));for(const c of b)if(!ka.has(c.earlier_q+'|'+c.closing_q))console.log(F.t.slice(5,10),c.side,'LINK',c.n,c.earlier_round,JSON.stringify(c.earlier_q.slice(0,160)),'\n   CLOSE',JSON.stringify(c.closing_q.slice(0,220)));}
console.log('runs',runs,'cands',na,'->',nb);
