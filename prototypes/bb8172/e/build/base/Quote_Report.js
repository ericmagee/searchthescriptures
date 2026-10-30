// Quote Report: final status per quotation. MATCHES; WORDS ARE AT <ref>; WORDING NOT FOUND IN <book>; CITED VERSE DOES NOT EXIST; NOT CHECKED.
const C=$('Quote Compare').first().json;const found=$('Find Words').all().map(i=>i.json).filter(r=>r&&r.book);
const words=s=>[...new Set(String(s||'').toLowerCase().replace(/[^a-z ]/g,' ').split(/\s+/).filter(w=>w.length>2))];
if(!C.read_ok)return [{json:{unavailable:true,items:[]}}];
const all=C.items.map(i=>{if(i.status!=='PENDING'){const {q,cited,...o}=i;return o;}
 let best=null,bs=0;for(const r of found){if(r.book!==i.book)continue;const tw=new Set(words(r.text));const s=i.q.filter(w=>tw.has(w)).length/i.q.length;if(s>bs){bs=s;best=r;}}
 // F1, BB-7994 P2D v5a step 3 (ODV1-29199 Haggai 2:23 quoted with "Zorubbabel", a spelling no KJV verse carries): the cited verse itself is a candidate.
 // When its own word share (Quote Compare's score) is at least the bar and no found row scores higher, the quote changed the cited verse's words.
 if(i.cited&&i.score>=0.75&&i.score>=bs){bs=i.score;best={book:i.book,chapter:i.chapter,verse:i.v1};}
 // Item 7, ruling BB-8010: a best row inside the cited range means the quote changed that verse's words, not that it cited the wrong verse.
 const inRange=best&&best.book===i.book&&+best.chapter===+i.chapter&&+best.verse>=+i.v1&&+best.verse<=+i.v2;
 const status=!i.cited?'CITED VERSE DOES NOT EXIST':(best&&bs>=0.75)?(inRange?'WORDING DIFFERS FROM '+i.ref:'WORDS ARE AT '+best.book+' '+best.chapter+':'+best.verse):'WORDING NOT FOUND IN '+i.book;
 const {q,cited,...o}=i;return {...o,status};});
// BB-5773: a non-matching quote not offered in citation form (Citation Scan cite_form false) is a phrase, not a quotation: left out of the report.
// DoD 14 (BB-7397 rev 7, BB-7495; widened BB-7513): a quotation of the other side's own words (Citation Scan opp_words) is not a scripture
// citation and is not checked against the KJV text: left out of the report at every status the check would report (WORDING NOT FOUND,
// WORDS ARE AT, CITED VERSE DOES NOT EXIST). A MATCHES item is a scripture quotation and stays; NOT CHECKED stays as before.
// BB-7397 rev 9 DoD 22: a WORDING NOT FOUND item whose words are the other side's sentence shortened (Citation Scan opp_short) is left out too.
// F2, BB-7994 P2D v5a step 3 (WALL-1889; ODV1-29199 1 Chronicles 28:6): a load-bearing quotation (Citation Scan load_bearing: [L1] footing in a
// LINK block of the link round) was offered as the verse whatever words stand before it; cite_form false does not leave it out. opp_words and
// opp_short still do (the other side's own words are not a scripture citation).
const items=all.filter(i=>i.status==='MATCHES'||i.status==='NOT CHECKED'||((i.cite_form!==false||i.load_bearing===true)&&!i.opp_words&&!(i.opp_short&&/^WORDING NOT FOUND IN /.test(i.status))));
const n=s=>items.filter(i=>i.status===s).length;
return [{json:{checked:items.length,matches:n('MATCHES'),not_checked:n('NOT CHECKED'),mismatches:items.length-n('MATCHES')-n('NOT CHECKED'),items}}];
