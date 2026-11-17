 /* ASK 354 (Wall 7486): K-RUD, a RESULT or KEYSTONE that decides on words the judge's own UNDERDETERMINED collision line holds open. TRIAL and list only, as K-ML and K-SU: it asks the judge and records the reply; it accepts no withdrawal, moves no count and removes no seat. */
const RUD_OPENW=/\b(?:open|unsettled|undecided|unresolved|disputed|contested|not decided|undetermined|UNDERDETERMINED)\b|\bremains?\s+(?:in\s+)?(?:doubt|question|uncertain)\b/i; /* rev 2 (W1 7493 F1): a clause that keeps the point open decides nothing */
const RUD_REF=/((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?/g;
function rudFold(s){return ' '+String(s==null?'':s).replace(/\[[^\]]*:[^\]]*\]/g,' ').toLowerCase().replace(/[‘’']/g,'').replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim()+' ';}
function rudQuotes(s){const out=[];const re=/“([^”]{2,400})”|"([^"]{2,400})"/g;let m;while((m=re.exec(s)))out.push({q:m[1]||m[2],i:m.index});return out;}
function rudLines2024(text,ROWS){const items=[],marks=[];const T=String(kkjvText(text)||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');
 if(!T.trim()||!(ROWS&&ROWS.length))return {items,marks};const I={};ROWS.forEach(r=>{if(r&&r.book&&r.chapter!=null&&r.verse!=null)I[r.book+'|'+r.chapter+'|'+r.verse]=String(r.text||'');});
 const L=T.split('\n').map(l=>l.trim());const open=[];const seen=new Set();
 for(const l of L){const hm=l.match(/^(?:[-•]\s*|\d+[.)]\s*)?(D\d+\s+vs\.?\s+C\d+)\b[^\n]*?:\s*UNDERDETERMINED\b/i);if(!hm)continue;
  const label=hm[1].replace(/\s+vs\.?\s+/i,' vs ').toUpperCase().replace('VS','vs');const oi=l.search(/\bopen\b/i);if(oi<0)continue;
  const vs=[];for(const m of l.matchAll(RUD_REF)){const b=m[1],c=+m[2],a=+m[3],z=+(m[4]||m[3]);for(let v=a;v<=z&&v<a+20;v++)vs.push(b+'|'+c+'|'+v);}
  for(const qq of rudQuotes(l)){if(qq.i<oi)continue;const f=rudFold(qq.q).trim();if(f.split(' ').length<3)continue;
   const k=vs.find(k=>I[k]!=null&&rudFold(I[k]).includes(' '+f+' '));
   if(!k){const miss=vs.filter(k=>I[k]==null);if(miss.length&&!vs.some(k=>I[k]!=null&&rudFold(I[k]).includes(' '+f+' ')))marks.push('[AUDIT v35: RESULT ON AN OPEN LINE NOT CHECKED (K-RUD; TRIAL, list only) -- '+label+': "'+qq.q.slice(0,120)+'": a verse the line names was not read this run]');continue;}
   open.push({label,phrase:qq.q,f,ref:k.replace('|',' ').replace('|',':')});}}
 for(const l of L){const rm=l.match(/^(RESULT|KEYSTONE)\s*:\s*(.*)$/);if(!rm)continue;const kind=rm[1],body=rm[2];
  if(/\b(?:derived (?:after|by)|recomputed after)\b/i.test(body))continue;if(kind==='RESULT'&&/^\s*UNDERDETERMINED\b/i.test(body))continue; /* rev 2 (W1 7493 F1): a RESULT that is itself UNDERDETERMINED decides nothing */
  const sents=body.split(/(?<=[.;])\s+|\s+--\s+|,\s+(?=(?:while|but|whereas|though|although)\b)/i);
  for(const o of open){const s=sents.find(s=>rudFold(s).includes(' '+o.f+' ')&&!RUD_OPENW.test(s));if(!s)continue;const k=kind+'|'+o.label+'|'+o.f;if(seen.has(k))continue;seen.add(k);
   items.push({rule:'K-RUD',side:'JUDGE',link:kind+' ON '+o.label,pair:o.label,kind,ref:o.ref,phrase:o.phrase,line:'Your '+o.label+' line holds "'+o.phrase+'" ('+o.ref+') UNDERDETERMINED: the record leaves it open. Your '+kind+' decides on those words: "'+s.slice(0,400)+'". Settle one: regrade '+o.label+' on the verse\'s own words, or write the '+kind+' again on other lines.'});
   marks.push('[AUDIT v35: RESULT ON AN OPEN LINE (K-RUD; TRIAL, list only) -- '+kind+' uses "'+o.phrase.slice(0,120)+'", which '+o.label+' holds UNDERDETERMINED]');}}
 return {items,marks};}
