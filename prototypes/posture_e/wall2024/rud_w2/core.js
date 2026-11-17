/* ASK 354 K-RUD core (prototype). rudLines(text, ROWS) -> {items, marks} */
const RUD_REF=/((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?/g;
function rudFold(s){return ' '+String(s==null?'':s).replace(/\[[^\]]*:[^\]]*\]/g,' ').toLowerCase().replace(/[‘’']/g,'').replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim()+' ';}
function rudIdx(rows){const I={};(rows||[]).forEach(r=>{if(r&&r.book&&r.chapter!=null&&r.verse!=null)I[r.book+'|'+r.chapter+'|'+r.verse]=String(r.text||'');});return I;}
function rudQuotes(s){const out=[];const re=/“([^”]{2,400})”|"([^"]{2,400})"/g;let m;while((m=re.exec(s)))out.push({q:m[1]||m[2],i:m.index});return out;}
function rudLines(text,ROWS){const items=[],marks=[];const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');
 if(!T.trim())return {items,marks};const I=rudIdx(ROWS);const L=T.split('\n').map(l=>l.trim());const open=[];
 for(const l of L){const hm=l.match(/^(?:[-•]\s*|\d+[.)]\s*)?(D\d+\s+vs\.?\s+C\d+)\b([^\n]*?):\s*UNDERDETERMINED\b/i);if(!hm)continue;
  const label=hm[1].replace(/\s+vs\.?\s+/i,' vs ').toUpperCase().replace('VS','vs');
  const vs=[];for(const m of l.matchAll(RUD_REF)){const b=m[1],c=+m[2],a=+m[3],z=+(m[4]||m[3]);for(let v=a;v<=z;v++)vs.push(b+'|'+c+'|'+v);}
  const oi=l.search(/\bopen\b/i);if(oi<0)continue;
  for(const qq of rudQuotes(l)){if(qq.i<oi)continue;const f=rudFold(qq.q).trim();if(f.split(' ').length<3)continue;
   const k=vs.find(k=>I[k]!=null&&rudFold(I[k]).includes(' '+f+' '));if(!k){continue;}
   open.push({label,phrase:qq.q,f,ref:k.replace(/\|/,' ').replace('|',':')});}}
 for(const l of L){const rm=l.match(/^(RESULT|KEYSTONE)\s*:\s*(.*)$/);if(!rm)continue;const kind=rm[1];
  const body=rm[2];if(/\b(?:derived (?:after|by)|recomputed after)\b/i.test(body))continue;
  const sents=body.split(/(?<=[.;])\s+|\s+--\s+|,\s+(?=(?:while|but|whereas|though|although)\b)/i);
  for(const o of open){const s=sents.find(s=>rudFold(s).includes(' '+o.f+' ')&&!/\bopen\b|UNDERDETERMINED/i.test(s));if(!s)continue;
   items.push({rule:'K-RUD',side:'JUDGE',link:kind+' ON '+o.label,pair:o.label,kind,ref:o.ref,phrase:o.phrase,line:'Your '+o.label+' line holds "'+o.phrase+'" ('+o.ref+') UNDERDETERMINED: the record leaves it open. Your '+kind+' decides on those words: "'+s.slice(0,400)+'". Settle one: regrade '+o.label+' on the verse\'s own words, or write the '+kind+' again on other lines.'});
   marks.push('[AUDIT v35: RESULT ON AN OPEN LINE (K-RUD; TRIAL, list only) -- '+kind+' uses "'+o.phrase+'", which '+o.label+' holds UNDERDETERMINED]');}}
 return {items,marks,open};}
module.exports={rudLines,rudFold,rudQuotes};
