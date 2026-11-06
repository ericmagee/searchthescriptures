function cureLines(text){text=cureUnwrap(text);const o={restated:[],withdrawn:[],result:[],count:[],standing:[],pressed:[],short:[],statement:[],response:[],malformed:[],prose:[],cited:[]};
 /* pkgCK (reader phase 2, CURE_KEY; W3 spec sections 2, 7 G12, 0.6): each keyed line is read with the shared reader (__RL.readLine) and mapped to the
    fields the cure checks read. Kept from the old reader until W3 rules (Wall): a rule name before the RETRACTED pair (judge_fix4 F3), the cure PRESSED
    and SHORT forms with "|" separators (the cure prompt's own forms; the reader's PRESSED uses "--" and SHORT has no fields), and NOT PRESSED / ledger
    PRESSED through ciForm. */
 const LAB=/^(KEYSTONE|RESULT|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK)\s*[:\-–—]+\s*/i;
 const pid=p=>{const m=String(p||'').match(/^D(\d+)\s+vs\.?\s+C(\d+)$/i);return m?cureId(m[1],m[2]):null;};
 for(const raw of String(text||'').split('\n')){const l=raw.trim().replace(/^[*`]+|[*`]+$/g,'').trim();if(!l)continue;const k=l.match(CURE_KEY);if(!k){o.prose.push(l);continue;}
  const r=k[2].trim();let m;
  if(k[1]==='RETRACTED'){const R=__RL.readLine('RETRACTED: '+r.replace(/^K-[A-Z]+\d*\s+/,''));const rest=R.form==='RETRACTED'?String(R.f.reason||''):'';
   if(R.form==='RETRACTED'&&!/\bLINK\s+BROKEN\b/i.test(rest.replace(/\bnot\s+(?:a\s+)?(?:\S+\s+)?LINK\s+BROKEN\b/ig,'').replace(/\b(?:(?:DEFENDER|CHALLENGER)\s+)?LINK\s+BROKEN\s+(?:grade|ruling|mark|label|line|verdict)s?\b/ig,''))){
    const g=(rest.match(/\b(UNDERDETERMINED|STANDS)\b/)||[])[1]||null; /* spec 0.6: the regrade word is upper case */
    o.withdrawn.push({link:pid(R.f.pair),line:l,regrade:g,reason:rest.replace(/^\([^)]*\)\s*/,'').replace(/^(?:--|—|-|:)\s*/,'').replace(/^(?:re)?grade[sd]?\s+(?:to\s+)?(?:UNDERDETERMINED|STANDS)\s*(?:--|—|-|:)?\s*/i,'').trim()||null});}
   else o.malformed.push(l);continue;}
  if((k[1]==='PRESSED'||k[1]==='NOT PRESSED')&&ciForm(k[1],r)){for(const z of ciRulings(l))o.cited.push(z);continue;} // judge_fix5 G2: a K-G9 ruling line (ciForm reader, unchanged)
  if(k[1]==='PRESSED'&&(m=r.match(/^D(\d+)\s+vs\.?\s+C(\d+)\s*\|\s*\[(DR1|DR2|CR1|CR2|CR3)\]\s*\|\s*["“](.+)["”]$/i))){o.pressed.push({link:cureId(m[1],m[2]),round:m[3].toUpperCase(),q:m[4],line:l});continue;} /* the cure's "|" form, unchanged */
  if(k[1]==='SHORT'&&(m=r.match(/^D(\d+)\s+vs\.?\s+C(\d+)\s*\|\s*\[(CR2|CR3|CR4|DR1|DR2|DR3)\]\s*\|\s*["“](.+?)["”]\s*\|\s*(\S.{9,})$/i))){o.short.push({link:cureId(m[1],m[2]),round:m[3].toUpperCase(),q:m[4],why:m[5],line:l});continue;} /* unchanged */
  const R=__RL.readLine(l);const f=R.f||{};
  if(k[1]==='CORRECTED RESULT'&&R.form==='CORRECTED RESULT'){o.result.push({tag:f.tag,word:f.tag.split('-')[0],line:l});continue;}
  if(k[1]==='CORRECTED COUNT'&&R.form==='CORRECTED COUNT'){o.count.push({side:f.side,n:f.n,line:l});continue;}
  if(k[1]==='CORRECTED STANDING'&&R.form==='CORRECTED STANDING'){o.standing.push({side:f.side,st:f.standing,line:l});continue;}
  if((k[1]==='STATEMENT'||k[1]==='RESPONSE')&&R.form==='STATEMENT'&&f.item&&String(f.text||'').trim()){const at=r.indexOf('|');(k[1]==='STATEMENT'?o.statement:o.response).push({label:String(f.item).trim(),text:r.slice(at+1).trim(),line:l});continue;}
  if(k[1]==='RESTATED'&&R.form&&f.restated){
   if(R.form==='COLLISION'){o.restated.push({link:pid(f.pair),grade:f.grade,text:r,line:l});continue;}
   if(R.form==='LINK STATE'){o.restated.push({link:String(f.link).toUpperCase(),grade:/^(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS)$/.test(f.grade)?f.grade:null,text:r,line:l});continue;}
   if((m=r.match(LAB))){o.restated.push({link:m[1].toUpperCase(),grade:null,text:r.slice(m[0].length),line:l});continue;} // BB-8327 D1: a restated KEYSTONE, RESULT, STANDING, CONCEDED or CHAIN MARK line
  }
  o.malformed.push(l);}
 return o;}
