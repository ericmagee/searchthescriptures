const fs=require('fs');const J=require('./judall.json');const P=require('./pop394all.json');
const txt=raw=>{const s=String(raw||'');const a=s.indexOf('{'),b=s.lastIndexOf('}');try{const o=JSON.parse(s.slice(a,b+1));return {o,r:String(o.reasoning||o.reason||'')};}catch(e){return null;}};
const RX=/^[\s>*_\-•\d.)]*\**\s*D\d+\s+vs\.?\s+C\d+\b[^\n]*?:\s*\**\s*STANDS\b/i;
const inR=new Set(P.stands.map(x=>x.id+'|'+x.l));let rx=[],raw=[],unp=[];
for(const j of J){const t=txt(j.verdict_raw);
 const all=String(j.verdict_raw||'').replace(/\\n/g,'\n').split('\n');
 for(const l of all)if(RX.test(l))raw.push({id:j.id,l});
 if(!t){unp.push(j.id);continue;}
 for(const l of t.r.split('\n'))if(RX.test(l))rx.push({id:j.id,l,inReader:inR.has(j.id+'|'+l)});
}
const u=a=>new Set(a.map(x=>x.id)).size;
console.log('unparsed ids',unp.join(','));
console.log('regex over reasoning: lines',rx.length,'judgments',u(rx));
console.log('regex over whole raw: lines',raw.length,'judgments',u(raw));
console.log('reader STANDS',P.stands.length,u(P.stands));
rx.filter(x=>!x.inReader).forEach(x=>console.log(' regex-not-reader',x.id,x.l.slice(0,160)));
const rset=new Set(rx.map(x=>x.id));const extra=raw.filter(x=>!rset.has(x.id));console.log('raw-only judgments',[...new Set(extra.map(x=>x.id))].join(','));
extra.slice(0,6).forEach(x=>console.log(' raw-only',x.id,x.l.slice(0,140)));
// where in raw do raw-only lines sit (field names)
for(const id of [...new Set(extra.map(x=>x.id))].slice(0,8)){const j=J.find(x=>x.id===id);const t=txt(j.verdict_raw);console.log(id,'parsed',!!t,t?Object.keys(t.o).join(','):'');}
