const fs=require('fs');
const c=require(process.argv[2]).nodes.find(n=>n.name==='L2 Count Plan').parameters.jsCode;const nx=c.indexOf('const S=$(\'Citation Scan\')');const i=c.indexOf('const __SPC=');
const L2C=new Function(c.slice(0,nx)+';return L2C;')();const SPC=i>0?new Function('L2C',c.slice(i,c.indexOf(' /* pkgSPC',i))+';return __SPC;')(L2C):null;
const tags=require(process.argv[3]),ow=require(process.argv[4]);
const ck=L2C.check(tags,ow,[],[...new Set(ow.map(r=>r.book+' '+r.chapter+':'+r.verse))]);
SPC(ck,ow,[]);const P=ck.filter(t=>t.place);console.log('tags',ck.length,'flagged',P.length);for(const t of P)console.log((t.id||'').slice(0,8),t.round,'|',t.seg.slice(0,110),'\n   =>',t.place.join(' ; '));
