// Quote Compare: score each quotation against the KJV text of the verses it cites; build one read to locate mismatched wording.
const S=$('Citation Scan').first().json;const rows=$('Cited Verses').all().map(i=>i.json).filter(r=>r&&r.book);
const words=s=>[...new Set(String(s||'').toLowerCase().replace(/[^a-z ]/g,' ').split(/\s+/).filter(w=>w.length>2))];
// ORDER (BB-6805, BB-6830): words a side puts in square brackets or parentheses inside a quotation are its own gloss: set aside, not checked,
// not [L1] evidence. Both sides alike.
// Item 7 (2), WALL-1844: the KJV prints its own parentheses and [italics] (Luke 3:23 "(as was supposed)"); such a span is kept when its words
// stand in the cited verse, and set aside as the side's gloss only when they do not.
const fold=s=>String(s||'').toLowerCase().replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim();
const unGloss=(s,cited)=>{const cv=' '+fold(cited)+' ';return String(s||'').replace(/\[([^\]]*)\]|\(([^)]*)\)/g,(all,a,b)=>{const inner=fold(a!==undefined?a:b);return inner&&cv.includes(' '+inner+' ')?' '+inner+' ':' ';});};
const idx={};rows.forEach(r=>{idx[r.book+'|'+r.chapter+'|'+r.verse]=r.text;});
const items=S.items.map(i=>{
 const parts=[];for(let v=i.v1;v<=i.v2;v++){const t=idx[i.book+'|'+i.chapter+'|'+v];if(t)parts.push(t);}
 const cited=parts.join(' ');const q=words(unGloss(i.quote,cited));
 // Item 7 (1), WALL-1844: a short quotation ("made of a woman") is checked as an exact phrase; found, it MATCHES; not found, it stays NOT CHECKED.
 if(q.length<3){const ph=fold(unGloss(i.quote,cited));if(ph&&cited&&(' '+fold(cited)+' ').includes(' '+ph+' '))return {...i,q,cited,score:1,status:'MATCHES',phrase:true};return {...i,status:'NOT CHECKED'};}const tw=new Set(words(cited));const score=cited?q.filter(w=>tw.has(w)).length/q.length:0;
 // Nearer reference (operator-approved 2026-10-13, ruling 4): only when the first reference fails, try the alt reference Citation Scan kept;
 // if the quote matches it, the quote is bound to it and the first reference is kept as rebound_from.
 if(score<0.75&&i.alt){const at=idx[i.alt.book+'|'+i.alt.chapter+'|'+i.alt.verse];if(at){const aw=new Set(words(at));const sa=q.filter(w=>aw.has(w)).length/q.length;
  if(sa>=0.75)return {...i,ref:i.alt.ref,book:i.alt.book,chapter:i.alt.chapter,v1:i.alt.verse,v2:i.alt.verse,q,cited:at,score:Math.round(sa*100)/100,status:'MATCHES',rebound_from:i.ref};}}
 return {...i,q,cited,score:Math.round(score*100)/100,status:score>=0.75?'MATCHES':'PENDING'};});
const pend=items.filter(i=>i.status==='PENDING');
const pat=i=>{const ord=i.q.filter(w=>w.length>3);const top=[...ord].sort((a,b)=>b.length-a.length).slice(0,2);const two=ord.filter(w=>top.includes(w)).slice(0,2);return '*'+(two.length?two:i.q.slice(0,2)).join('*')+'*';};
const conds=[...new Set(pend.map(i=>'and(book.eq."'+i.book+'",text.ilike.'+pat(i)+')'))].slice(0,60);
const BASE='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/kjv_verses?select=book,chapter,verse,text';
const url=conds.length?BASE+'&limit=500&or='+encodeURIComponent('('+conds.join(',')+')'):BASE+'&id=eq.-1';
return [{json:{items,url_find:url,cited_rows:rows.length,read_ok:rows.length>0||S.items.length===0}}];
