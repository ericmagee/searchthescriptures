// ASK 399 pre-build: for every retracted link (seat's v21 RETRACTED lists), the restated markers in the stored text, and col's current grade.
const J=require('../a384/judgments_all.json');const E=require('../a400/ev.cjs')(__dirname+'/../rdf/fetchback_w394s11.json');
const K=x=>String(x||'').toUpperCase().replace(/\s+VS\.?\s+/,' VS ').replace(/\s+/g,' ').trim();const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const out=[];
for(const j of J){const v=String(j.v||'');const R=[];
 for(const m of v.matchAll(/\[AUDIT v21: CORRECTED RESULT -- SEAT: ([^;\]]*); ORIGINAL: \w+; COUNTED: \w+ \([A-Z]+-\d\)(?:; RETRACTED: ([^\]]*))?\]/g)){if(m[1]!==j.seat||!m[2])continue;for(const x of m[2].split(/\s*,\s*/))if(/^D\d+\s+vs\.?\s+C\d+$/i.test(x.trim())&&!R.includes(K(x)))R.push(K(x));}
 if(!R.length)continue;const col=E.rcLines(E.cureJText(v,true)).col;
 for(const k of R){const lk=k.replace(' VS ',' vs ');const z=col.find(c=>K(c.link)===k);
  // v25: chain of (X to Y) for this link, across this seat's v25 tags, in order
  const ch=[];for(const t of v.matchAll(/\[AUDIT v25: RECOMPUTED AFTER CURE -- SEAT: ([^;]*); TRIGGER: ([^;]*);/g)){if(t[1]!==j.seat)continue;for(const e of t[2].matchAll(/([A-Z][A-Z -]*?) (D\d+ vs\.? C\d+) \(([A-Z ]+) to ([A-Z ]+)\)/g))if(K(e[2])===k)ch.push(e[1].trim()+':'+e[3]+'>'+e[4]);}
  const rs=[...v.matchAll(new RegExp('SEAT: '+esc(j.seat)+'; ITEM: '+esc(lk)+';[^\\]]*?STATEMENT: RESTATED: '+esc(lk)+'(?: \\([^)]*\\))?: ([A-Z ]+?) --','gi'))].map(m=>m[1]);
  const v27=[...v.matchAll(new RegExp('\\[AUDIT v27: SUPERSEDED LINE -- SEAT: '+esc(j.seat)+'; LABEL: '+esc(k)+';','g'))].length;
  out.push({id:j.id,seat:j.seat,link:lk,col:z?z.grade:'(not in col)',v25:ch,restated:rs,v27});}}
const cls=o=>o.v25.some(c=>/^RETRACTED:/.test(c))?'V25':o.restated.length?'JUDGE-RESTATED':o.v27?'V27-ONLY':'NONE';
const g={};for(const o of out){const c=cls(o)+' | col '+(/LINK BROKEN$/.test(o.col)?'LINK BROKEN':o.col);g[c]=(g[c]||0)+1;}
console.log('retracted links',out.length,'in judgments',new Set(out.map(o=>o.id)).size);console.log(g);
const S=new Set([793,796,801,804,810,811,812,820,826,832,836,865,887,894,973,1036,1150,1153,1174]);
for(const o of out)if(S.has(o.id)&&/LINK BROKEN$/.test(o.col))console.log(o.id,o.seat,o.link,'|col',o.col,'|',cls(o),'|v25',o.v25.join(' ; '),'|rs',o.restated.join(','),'|v27',o.v27);
for(const o of out)if(cls(o)!=='V25'&&cls(o)!=='NONE')console.log('MARK',o.id,o.seat,o.link,'|col',o.col,'|',cls(o),'|rs',o.restated.join(','),'|v27',o.v27);
require('fs').writeFileSync(__dirname+'/markers_out.json',JSON.stringify(out,null,1));
