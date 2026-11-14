const W=require('./target.json');const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));
const l=L[3120];const i=l.indexOf("+(()=>{try{const t=a?");const fn=new Function('a','cut','return '+l.slice(i+1)+';');
const cut=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n)+'...':s;};
const d=require('./r3.json');let n=0,emptyK=0,nodrop=0,longd=0,rowd=0;const all=[];
for(const r of d)for(const k of ['cr3','dr3']){const t=String(r[k]||'');for(const p of t.split(/\n(?=[ \t>#*_-]*LINK\s+\d+\s*:)/i)){if(!/^[ \t>#*_-]*LINK\s+\d+\s*:\s*[*_]*\s*NARROWED/i.test(p))continue;n++;const o=fn({t:p},cut);const K=(o.match(/THE KEPT CLAIM: "([^]*?)" \| WHAT/)||[])[1];if(!K)emptyK++;if(/no such sentence/.test(o))nodrop++;if(/\[L[1-4]\]/.test(o.split('DROPS OR DISOWNS:')[1]||''))rowd++;all.push({id:r.id.slice(0,8),k,o,p});}}
console.log('narrowed',n,'empty kept',emptyK,'no drop',nodrop,'drop list holding an [Ln] row',rowd);
for(const pat of [/as was supposed/,/The sign the angel sets beside Mary/,/states a begetting without a man/])for(const x of all.filter(x=>pat.test(x.p)).slice(0,1))console.log('\n'+x.id,x.k,x.o);
const z=all.find(x=>x.id==='1a9a0d29');console.log('\n37032',z.o);
