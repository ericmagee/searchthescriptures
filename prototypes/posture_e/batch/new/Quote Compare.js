// Quote Compare: score each quotation against the KJV text of the verses it cites; build one read to locate mismatched wording.
const S=$('Citation Scan').first().json;const rows=$('Cited Verses').all().map(i=>i.json).filter(r=>r&&r.book);
// judge_fix5 G7 (run 32284: "Maher-shalal-hash-baz" against the KJV's "Mahershalalhashbaz"): ONE SWITCH, default OFF until the operator rules. When true,
// a hyphen inside a word is removed before matching, on the quotation and the verse alike, both sides.
const HYPHEN_JOIN=false;
const hj=s=>HYPHEN_JOIN?String(s==null?'':s).replace(/([A-Za-z])-(?=[A-Za-z])/g,'$1'):String(s==null?'':s);
// judge_fix5 G5: a reference of several parts ("Isaiah 7:11, 7:14") is read part by part; the cited text is the parts' verses in order.
const PARTS=i=>Array.isArray(i.parts)&&i.parts.length?i.parts:[{chapter:i.chapter,v1:i.v1,v2:i.v2}];
const words=s=>[...new Set(hj(s).toLowerCase().replace(/[^a-z ]/g,' ').split(/\s+/).filter(w=>w.length>2))];
// ORDER (BB-6805, BB-6830): words a side puts in square brackets or parentheses inside a quotation are its own gloss: set aside, not checked,
// not [L1] evidence. Both sides alike.
// Item 7 (2), WALL-1844: the KJV prints its own parentheses and [italics] (Luke 3:23 "(as was supposed)"); such a span is kept when its words
// stand in the cited verse, and set aside as the side's gloss only when they do not.
const fold=s=>hj(s).toLowerCase().replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim();
// Item 7 (A), WALL-1864/1865: margin notes in the stored verse ("[sabbath: Gr. sabbath day]") are not the verse's words.
const noMargin=s=>String(s||'').replace(/\[[^\]]*:[^\]]*\]/g,' ');
const unGloss=(s,cited)=>{const cv=' '+fold(noMargin(cited))+' ';return String(s||'').replace(/\[([^\]]*)\]|\(([^)]*)\)/g,(all,a,b)=>{const inner=fold(a!==undefined?a:b);return inner&&cv.includes(' '+inner+' ')?' '+inner+' ':' ';});};
// Item 7 (A): every segment of the quotation, folded, stands contiguous in the folded cited text, the segments in order.
const contig=(i,cited)=>{if(!cited)return false;const cv=' '+fold(noMargin(cited))+' ';const segs=(Array.isArray(i.segs)&&i.segs.length?i.segs:[i.quote]).map(x=>fold(unGloss(x,cited))).filter(Boolean);
 if(!segs.length)return false;let at=0;for(const g of segs){const k=cv.indexOf(' '+g+' ',at);if(k<0)return false;at=k+g.length+1;}return true;};
// judge_fix4 F10 (operator ruling 376, ruling 3): ONE SWITCH. The operator has since ruled (2026-11-02): "as long as the verse if properly cited,
// writing partial of okay", so a partial quotation counts and the switch stays OFF. When true, a quotation that matches but is a
// strict part of the verse (or range) it cites is marked SHORTENED and is NOT COUNTED, for both sides alike. Default false: no change.
const SHORTENED_CHECK=false;
// judge_fix4 F7 (run 32266, item 103: the challenger's "or, thou, O virgin, shalt call" was marked WORDING DIFFERS FROM Isaiah 7:14, though the
// stored verse carries the 1611 margin "[shall call: or, thou, O virgin, shalt call]"): a quotation that fails against the verse text is
// matched against its bracketed margin notes: inside a note's reading (after its colon, with or without its "or,"), or in the verse with the
// note's keyed words read as that reading. Found, it is MATCHES (MARGIN).
const margins=s=>[...String(s||'').matchAll(/\[([^\]:]*):([^\]]*)\]/g)].map(m=>({key:m[1],alt:m[2]}));
const inMargin=(i,cited)=>{const ms=margins(cited);if(!ms.length)return false;const segs=(Array.isArray(i.segs)&&i.segs.length?i.segs:[i.quote]).map(x=>fold(x)).filter(Boolean);if(!segs.length)return false;
 const hit=txt=>{const cv=' '+fold(txt)+' ';let at=0;for(const g of segs){const k=cv.indexOf(' '+g+' ',at);if(k<0)return false;at=k+g.length+1;}return true;};
 const base=noMargin(cited);return ms.some(m=>{if(hit(m.key+' '+m.alt))return true; /* run 32595 (Genesis 46:26 "loins: Heb. thigh"): the whole note, key and reading, quoted as printed */ const alt=String(m.alt).replace(/^\s*(?:or|Heb|Gr|Chald|that is)\b[.,:]*\s*/i,'');if(hit(m.alt)||hit(alt))return true;
  const kf=fold(m.key);if(!kf)return false;const bv=' '+fold(base)+' ';return bv.includes(' '+kf+' ')&&hit(bv.replace(' '+kf+' ',' '+fold(alt)+' '));});};
const idx={};rows.forEach(r=>{idx[r.book+'|'+r.chapter+'|'+r.verse]=r.text;});
let items=S.items.map(i=>{
 // judge_fix6 H6: every NOT CHECKED item carries its reason.
 if(i.over_cap)return {...i,status:'NOT CHECKED',reason:'past the citation scan\'s item cap ('+S.item_cap+' items)'};
 if(i.unread)return {...i,status:'NOT CHECKED',reason:'the cited chapter was not read: the verse read\'s address was full (7,000 characters)'}; // judge_fix2 FIX 6a: the verse was not read (URL budget), so it is not checked; never DOES NOT EXIST
 const parts=[];for(const pt of PARTS(i))for(let v=pt.v1;v<=pt.v2;v++){const t=idx[i.book+'|'+pt.chapter+'|'+v];if(t)parts.push(t);}
 const cited=parts.join(' ');const q=words(unGloss(i.quote,cited));
 // Item 7 (1), WALL-1844: a short quotation ("made of a woman") is checked as an exact phrase; found, it MATCHES; not found, it stays NOT CHECKED.
 if(q.length<3){if(contig(i,cited))return {...i,q,cited,score:1,status:'MATCHES',phrase:true};if(cited&&inMargin(i,cited))return {...i,q,cited,score:1,status:'MATCHES (MARGIN)',phrase:true};return {...i,status:'NOT CHECKED',reason:cited?'a quotation of fewer than three words of three letters is checked only as an exact phrase, and "'+String(i.quote).slice(0,60)+'" is not in the text of '+i.ref:'the cited verse '+i.ref+' is not in the KJV table'};}const tw=new Set(words(cited));const score=cited?q.filter(w=>tw.has(w)).length/q.length:0;
 // Nearer reference (operator-approved 2026-10-13, ruling 4): only when the first reference fails, try the alt reference Citation Scan kept;
 // if the quote matches it, the quote is bound to it and the first reference is kept as rebound_from.
 if(!(score>=0.75&&contig(i,cited))&&i.alt){const ap=[];for(let v=i.alt.verse;v<=(i.alt.v2||i.alt.verse);v++){const x=idx[i.alt.book+'|'+i.alt.chapter+'|'+v];if(x)ap.push(x);}const at=ap.join(' '); /* BB-8172 C1: a fallback may span verses */if(at){const aw=new Set(words(at));const sa=q.filter(w=>aw.has(w)).length/q.length;
  if(sa>=0.75&&contig(i,at))return {...i,ref:i.alt.ref,book:i.alt.book,chapter:i.alt.chapter,v1:i.alt.verse,v2:i.alt.v2||i.alt.verse,q,cited:at,score:Math.round(sa*100)/100,status:'MATCHES',rebound_from:i.ref};}}
 if(!(score>=0.75&&contig(i,cited))&&cited&&inMargin(i,cited))return {...i,q,cited,score:1,status:'MATCHES (MARGIN)'}; // judge_fix4 F7
 return {...i,q,cited,score:Math.round(score*100)/100,status:score>=0.75&&contig(i,cited)?'MATCHES':'PENDING'};});
// judge_fix4 F10: with the switch on, a MATCHES quotation with fewer words than the cited text is SHORTENED (NOT COUNTED for the judges).
if(SHORTENED_CHECK)items.forEach((i,k)=>{if(i.status!=='MATCHES'||!i.cited)return;const qw=fold(unGloss((Array.isArray(i.segs)&&i.segs.length?i.segs.join(' '):i.quote),i.cited)).split(' ').filter(Boolean).length;const cw=fold(noMargin(i.cited)).split(' ').filter(Boolean).length;if(qw<cw)items[k]={...i,status:'SHORTENED',shortened:{quoted:qw,verse:cw}};});
const pend=items.filter(i=>i.status==='PENDING');
const pat=i=>{const ord=i.q.filter(w=>w.length>3);const top=[...ord].sort((a,b)=>b.length-a.length).slice(0,2);const two=ord.filter(w=>top.includes(w)).slice(0,2);return '*'+(two.length?two:i.q.slice(0,2)).join('*')+'*';};
const conds=[...new Set(pend.map(i=>'and(book.eq."'+i.book+'",text.ilike.'+pat(i)+')'))].slice(0,60);
const BASE='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/kjv_verses?select=book,chapter,verse,text';
const url=conds.length?BASE+'&limit=500&or='+encodeURIComponent('('+conds.join(',')+')'):BASE+'&id=eq.-1';
return [{json:{items,scanned:S.scanned,item_cap:S.item_cap,url_find:url,cited_rows:rows.length,hyphen_join:HYPHEN_JOIN,read_ok:rows.length>0||S.items.length===0}}];
