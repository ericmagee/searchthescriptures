// pkgGDC replay: the 6 rebuilt record nodes on every stored export, live s147 against the package; list every differing row
const fs=require('fs');const D='/mnt/project-files/wall2024/';
const ld=f=>{const X=JSON.parse(fs.readFileSync(D+f,'utf8'));return X.data&&X.data.nodes?X.data:X;};
const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');return new Function('$',stub.slice(0,i)+'\nreturn __S;')(n=>({params:{jsCode:lib}}));};
const NODES=['Send Back Record','Gate Record','Alt Send Back Record','Alt Gate Record','R2 Alt Send Back Record','R2 Alt Gate Record'];
const mask=s=>s.replace(/20\d\d-\d\d-\d\dT[\d:.]+Z/g,'T');
(async()=>{const WL=ld('fetchback_live_s147.json'),WG=ld('parent_s147_GDC.json');const lib=w=>w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
 const S={L:{},G:{}};for(const n of NODES){S.L[n]=rebuild(WL.nodes.find(x=>x.name===n).parameters.jsCode,lib(WL));S.G[n]=rebuild(WG.nodes.find(x=>x.name===n).parameters.jsCode,lib(WG));}
 let runs=0,same=0,err=0;const only=process.argv[2];
 for(const fn of fs.readdirSync(D).filter(x=>/^ex3\d+_full\.json$/.test(x)&&(!only||x.includes(only)))){const rd=JSON.parse(fs.readFileSync(D+fn,'utf8')).data.resultData.runData;
  const mk=name=>{const r=rd[name];const it=r?r[r.length-1].data.main.flat().filter(Boolean):[];const nd=WL.nodes.find(n=>n.name===name)||{};return {isExecuted:!!r,first:()=>it[0],all:()=>it,last:()=>it[it.length-1],item:it[0],params:nd.parameters||{}};};
  for(const n of NODES){if(!rd[n])continue;const prev=mk(rd[n][0].source[0].previousNode);const $i={all:()=>prev.all(),first:()=>prev.first(),item:prev.first()};
   const go=async src=>{try{return await new Function('$','$input','return (async()=>{\n'+src+'\n})();')(mk,$i);}catch(e){return {ERR:e.message};}};
   const a=await go(S.L[n]),b=await go(S.G[n]);runs++;if(a.ERR||b.ERR){err++;console.log('ERR',fn.slice(2,7),n,a.ERR||'',b.ERR||'');continue;}
   const ja=mask(JSON.stringify(a)),jb=mask(JSON.stringify(b));if(ja===jb){same++;continue;}
   const A=a[0].json,B=b[0].json;const rows=k=>(A[k]||[]).map((r,i)=>[r,(B[k]||[])[i]]).filter(([x,y])=>JSON.stringify(x)!==JSON.stringify(y));
   console.log('DIFF',fn.slice(2,7),n);for(const k of ['sb_rows','gate_rows'])for(const [x,y] of rows(k))console.log('   ',k,x.seat,x.item,':',x.cure_status,'->',y&&y.cure_status,'|',String(y&&y.cure_reason).slice(-110));
   for(const s of (A.summary||[])){const t=(B.summary||[]).find(z=>z.seat===s.seat);const u=x=>(x.cure||[]).filter(c=>c.status!=='CURED').length;if(t&&u(s)!==u(t))console.log('    summary',s.seat,'uncured',u(s),'->',u(t));}}}
 console.log('node runs',runs,'equal',same,'errors',err);})();
