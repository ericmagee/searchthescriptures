// Quote Report: final status per quotation. MATCHES; WORDS ARE AT <ref>; WORDING NOT FOUND IN <book>; CITED VERSE DOES NOT EXIST; NOT CHECKED.
const C=$('Quote Compare').first().json;const found=$('Find Words').all().map(i=>i.json).filter(r=>r&&r.book);
const words=s=>[...new Set(String(s||'').toLowerCase().replace(/[^a-z ]/g,' ').split(/\s+/).filter(w=>w.length>2))];
if(!C.read_ok)return [{json:{unavailable:true,items:[]}}];
const all=C.items.map(i=>{if(i.status!=='PENDING'){const {q,cited,...o}=i;return o;}
 let best=null,bs=0;for(const r of found){if(r.book!==i.book)continue;const tw=new Set(words(r.text));const s=i.q.filter(w=>tw.has(w)).length/i.q.length;if(s>bs){bs=s;best=r;}}
 const status=!i.cited?'CITED VERSE DOES NOT EXIST':(best&&bs>=0.75)?'WORDS ARE AT '+best.book+' '+best.chapter+':'+best.verse:'WORDING NOT FOUND IN '+i.book;
 const {q,cited,...o}=i;return {...o,status};});
// BB-5773: a non-matching quote not offered in citation form (Citation Scan cite_form false) is a phrase, not a quotation: left out of the report.
// DoD 14 (BB-7397 rev 7, BB-7495): a quotation of the other side's own words (Citation Scan opp_words) that the KJV check would report as
// WORDING NOT FOUND is not a scripture citation: left out of the report. MATCHES and WORDS ARE AT are reported as before.
const items=all.filter(i=>i.status==='MATCHES'||i.status==='NOT CHECKED'||(i.cite_form!==false&&!(i.opp_words&&/^WORDING NOT FOUND IN /.test(i.status))));
const n=s=>items.filter(i=>i.status===s).length;
return [{json:{checked:items.length,matches:n('MATCHES'),not_checked:n('NOT CHECKED'),mismatches:items.length-n('MATCHES')-n('NOT CHECKED'),items}}];
