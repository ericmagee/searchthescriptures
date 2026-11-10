// W3: where the strong check differs (candidate against live with the withheld rows deleted from the input)
const G=require('./g.cjs');const {H}=G;const run=process.argv[2],node=process.argv[3]||'Send Back Build',inp=process.argv[4]||'Judge Enforcer Record';
(async()=>{const over=/^ex/.test(run)?G.exOver('/mnt/project-files/wall2024/'+run+'_full.json'):null;const P=await G.pair(run,node,inp,over);const B=P.b;
 const ead=(B[0].sb_not_sent||[]).filter(x=>/pkgEAD/.test(x.why));const gone=new Set(ead.map(x=>x.seat+'|'+x.rule+'|'+x.item));
 const g=n=>{const v=over?over[n]:H.out(run,n);return v?G.J(v):v;};const o2={};const pi=g(inp);const pj=pi.flat().filter(Boolean)[0].json;
 const all=[].concat(pj.enf428_rows||[]);console.log('rows matching key:',all.filter(x=>gone.has(x.seat+'|'+x.rule+'|'+x.item)).map(x=>x.seat+'|'+x.rule+'|'+x.item+'|'+String(x.cure_reason).slice(0,60)));
 const f=x=>!(x&&gone.has(x.seat+'|'+x.rule+'|'+x.item)&&/^ENFORCER (?:DISAGREE|NO ANSWER)/.test(String(x.cure_reason||'')));pj.enf428_rows=(pj.enf428_rows||[]).filter(f);o2[inp]=pi;
 const ov=over?new Proxy(o2,{has:()=>true,get:(t,k)=>k in t?t[k]:over[k]}):o2;const A2=(await H.run(G.LIVE(node),run,inp,ov)).map(x=>x.json);
 for(let i=0;i<Math.max(A2.length,B.length);i++){const a=A2[i]||{},b=B[i]||{};for(const k of new Set([...Object.keys(a),...Object.keys(b)])){if(k==='sb_not_sent')continue;const x=JSON.stringify(a[k]),y=JSON.stringify(b[k]);if(x===y)continue;
   if(k==='items'){const ai=a.items||[],bi=b.items||[];console.log(a.seat,'items',ai.length,bi.length);for(let q=0;q<Math.max(ai.length,bi.length);q++)if(JSON.stringify(ai[q])!==JSON.stringify(bi[q])){for(const kk of Object.keys({...ai[q],...bi[q]}))if(JSON.stringify((ai[q]||{})[kk])!==JSON.stringify((bi[q]||{})[kk]))console.log('  item',q,kk,'\n   LIVE-DEL:',JSON.stringify((ai[q]||{})[kk]).slice(0,700),'\n   CAND    :',JSON.stringify((bi[q]||{})[kk]).slice(0,700));}}
   else{let p=0;while(p<x.length&&x[p]===y[p])p++;console.log(a.seat||b.seat,k,'differs at',p,'\n   LIVE-DEL:',x.slice(Math.max(0,p-200),p+300),'\n   CAND    :',y.slice(Math.max(0,p-200),p+300));}}}})();
