const W=require('./target.json');const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));
const l=L[3120];const i=l.indexOf("+(()=>{try{const t=a?");const body=l.slice(i+1);const fn=new Function('a','cut','return '+body+';');
const cut=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n)+'...':s;};
const d=require('./r3.json');let n=0,nd=0;const show=[];
for(const r of d)for(const k of ['cr3','dr3']){const t=String(r[k]||'');const parts=t.split(/\n(?=[ \t>#*_-]*LINK\s+\d+\s*:)/i);for(const p of parts){if(!/^[ \t>#*_-]*LINK\s+\d+\s*:\s*[*_]*\s*NARROWED/i.test(p))continue;n++;const o=fn({t:p},cut);if(/no such sentence/.test(o))nd++;if(show.length<6||r.id.startsWith('1a9a0d29'))show.push(r.id.slice(0,8)+' '+k+o);}}
console.log('narrowed blocks',n,'with no drop sentence',nd);show.forEach(x=>console.log(x+'\n'));
// a SUPPORTED block gives nothing
console.log('supported ->',JSON.stringify(fn({t:'LINK 1: SUPPORTED -- x. The link does not rest on it.'},cut)));
