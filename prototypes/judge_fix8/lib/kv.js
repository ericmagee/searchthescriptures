// judge_fix8 K6 (run 32306: ChatGPT ruled 11 of 12 listed premises VOID, e.g. "premise 6 is VOID because its [CR1] quote excludes Joseph's
// seed, not seed altogether", "premise 3 is VOID because its [CR1] quote says legal fatherhood, not a register-name"; no check read a VOID
// ruling). K-V (TRIAL): every premise a seat rules VOID for a charge stronger than its quote must, in that ruling, quote the charge words that go
// beyond the quote and name the kind (a negation, a universal, or a claim the words of the quote do not make). The ruling is read from the
// seat's count section and standing line, one segment per premise named (as K-G10 reads them). A quoted phrase counts as charge words when it
// stands in that premise's item of the list against that side, outside the item's quoted passages (the verbatim quote and any KJV words) and
// outside its PRESSED WITH: segment. A ruling that the premise has no verbatim quote (the other VOID ground) needs no charge words. A ruling
// without them is marked. Cure: the premise regraded in a RESTATED count line (SUPPORTED, NARROWED, or counted, with CORRECTED COUNT and STANDING
// when counted), or a STATEMENT for the item quoting the charge words and naming the kind.
const KV_KIND=/\bnegations?\b|\bnegative\b|\buniversals?\b|\bclaim\b[^.;]{0,60}\b(?:quote|quotation)\b[^.;]{0,40}\b(?:do(?:es)?\s+not|never)\s+make|\bclaim\b[^.;]{0,30}\bnot\s+(?:made|in)\b[^.;]{0,20}\b(?:quote|quotation)\b/i;
const KV_NOQ=/\bno\s+verbatim\s+quot|\bnot\s+(?:found\s+)?verbatim\b|\bquot(?:e|ation)\s+(?:is\s+)?not\s+found\b|\bwithout\s+a\s+verbatim\s+quot/i;
const kvNorm=s=>String(s==null?'':s).toLowerCase().replace(/[“”"‘’'`*_]/g,'').replace(/[—–-]/g,' ').replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
const kvQuotes=s=>{const t=String(s||'');const out=[];for(const m of t.matchAll(/["“]([^"”\n]{1,240})["”]/g))out.push(m[1]);for(const m of t.matchAll(/(?:^|[\s(\[:;,])['‘]([^'’\n]{2,160})['’](?=$|[\s.,;:!?)\]])/g))out.push(m[1]);return out.map(q=>q.trim()).filter(q=>kvNorm(q).length>=2);};
// the charge text of each listed premise against a side: the item before PRESSED WITH:, its quoted passages removed
function kvCharges(R,side){const t=String((R&&R[PW_ROUND[side]])||'');let i=-1;for(const m of t.matchAll(pwHead(side)))i=m.index;if(i<0)return null;
 const its=t.slice(i).split(/\n(?=\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:))/i).filter(x=>/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i.test(x));
 return its.map((x,k)=>{const j=x.search(/PRESSED WITH\s*:/i);const pre=j<0?x:x.slice(0,j);const ch=pre.replace(/["“][^"”]*["”]/g,' | ').replace(/(^|[\s(\[:;,])['‘][^'’\n]{2,}?['’](?=$|[\s.,;:!?)\]])/g,'$1 | ');return {n:k+1,charge:' '+kvNorm(ch)+' '};});}
// the VOID rulings of one side: segments of the count section and the standing line that rule premises VOID
function kvSegments(text,side){const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');const cs=ciCountSection(T,side)||'';const st=(T.match(new RegExp('^[ \\t>#-]*'+(side==='DEFENDER'?'DEFENSE':'CHALLENGE')+' STANDING[^\\n]*','mi'))||[''])[0];
 const out=[];for(const src of [cs,st]){if(!src)continue;const at=[];let m;PW_SEG.lastIndex=0;while((m=PW_SEG.exec(src)))at.push({i:m.index+m[1].length,ns:m[2].split(/\s*(?:,|and|&)\s*/).map(Number).filter(n=>n>0)});
  at.forEach((x,k)=>{const seg=src.slice(x.i,k+1<at.length?at[k+1].i:src.length);if(!/\bVOID\b/.test(seg)||/\b(?:not|never)\s+(?:be\s+)?VOID\b|\bno\s+(?:premise|charge|link)s?\s+(?:is|are|was|were)\s+VOID\b|\bnone\s+(?:is|are|of\s+them\s+(?:is|are))\s+VOID\b/i.test(seg))return; /* as lbVoid reads a denial */out.push({ns:x.ns,seg:seg.trim()});});}
 return out;}
// judge_fix8 R7 (run 32306, Worker_E A7, Worker_G1 #1): the universal test, computed in code and served to the judges as a pre-check: a negation or
// universal word in a premise's charge that none of its quoted passages holds (only, never, all, none, no, not, every, always, alone, nothing,
// nowhere, neither, nor, without, cannot, any, reversed, excludes). A VOID ruling also passes K-V when it names such a word of that premise, quoted
// ("only") or in capitals (ONLY) or after "the word", "adds" or "universal"/"negation" -- the word that makes the charge stronger.
const KV_UNI=/^(?:only|never|all|none|no|not|every|always|alone|nothing|nowhere|neither|nor|without|cannot|any|reversed|excludes?|excluded)$/;
function kvUni(R,side){const t=String((R&&R[PW_ROUND[side]])||'');let i=-1;for(const m of t.matchAll(pwHead(side)))i=m.index;if(i<0)return [];
 const its=t.slice(i).split(/\n(?=\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:))/i).filter(x=>/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i.test(x));
 return its.map((x,k)=>{const j=x.search(/PRESSED WITH\s*:/i);const pre=(j<0?x:x.slice(0,j)).replace(/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i,'');const qs=kvQuotes(pre).map(kvNorm);const qw=new Set(qs.join(' ').split(' '));
  const ch=kvNorm(pre.replace(/["“][^"”]*["”]/g,' ').replace(/(^|[\s(\[:;,])['‘][^'’\n]{2,}?['’](?=$|[\s.,;:!?)\]])/g,'$1 '));const w=[...new Set(ch.split(' ').filter(x=>KV_UNI.test(x)&&!qw.has(x)))];return {n:k+1,words:w};});}
function kvNames(seg,words){const S=String(seg);return (words||[]).find(w=>{const st=w.replace(/(?:ed|es|s)$/,'');const loose=!/^(?:no|not|any|all|nor)$/.test(w); /* a common word counts only quoted, in capitals or after adds/the word */
 return new RegExp('["“\'‘]'+w+'["”\'’]|\\b'+w.toUpperCase()+'\\b|\\b(?:the\\s+word|adds?|added|universal|negation)\\s+["“\'‘]?'+w+'\\b','').test(S)||(loose&&new RegExp('\\b'+st+'[a-z]{0,3}\\b','i').test(S));})||null;}
function kvRulingOk(seg,n,CH,UNI){if(KV_NOQ.test(seg))return {ok:true,why:'no verbatim quote'};const kind=KV_KIND.test(seg);const c=(CH||[]).find(p=>p.n===n);
 const q=c?kvQuotes(seg).find(q=>c.charge.includes(' '+kvNorm(q)+' ')):null;if(kind&&q)return {ok:true,kind,q};const u=(UNI||[]).find(p=>p.n===n);const w=u?kvNames(seg,u.words):null;
 return w?{ok:true,kind:true,q:w,why:'names the word '+w}:{ok:false,kind,q:q||null};}
function drvVoid(text,ptext,dConc,cConc,dStand,cStand,LN){const items=[],marks=[];if(typeof text!=='string'||typeof ptext!=='string')return {items,marks};const R=ciRounds(ptext);let read=0;
 for(const side of ['DEFENDER','CHALLENGER']){const CH=kvCharges(R,side);if(!CH)continue;const UNI=kvUni(R,side);const done=new Set();
  for(const sg of kvSegments(text,side))for(const n of sg.ns){if(done.has(n)||n>CH.length)continue;done.add(n);read++;const v=kvRulingOk(sg.seg,n,CH,UNI);if(v.ok)continue;
   const id=side+' premise '+n;const miss=(v.q?'':'quotes no charge words of premise '+n+' that go beyond its quote')+(!v.q&&!v.kind?' and ':'')+(v.kind?'':'names no kind (a negation, a universal, or a claim the words of the quote do not make)');
   items.push({rule:'K-V',side,link:id,premise:n,line:'premise '+n+' ruled VOID: '+sg.seg.replace(/\s+/g,' ').slice(0,400)+' -- the ruling '+miss,conc:side==='DEFENDER'?dConc:cConc,st:side==='DEFENDER'?dStand:cStand,L:(LN&&LN[side])||CH.length});
   marks.push('[AUDIT v26: DEBATE RULE VIOLATION (K-V) -- '+id+': ruled VOID, but the ruling '+miss+(()=>{const u=UNI.find(p=>p.n===n);return u&&u.words.length?' The system\'s universal test found in its charge, not in its quote: '+u.words.join(', ').toUpperCase()+'.':' The system\'s universal test found no negation or universal word in its charge that its quote lacks.';})()+' A charge is VOID as stronger than its quote only when it asserts what the quote does not; the ruling names the word that makes it stronger (as the universal test lists it) or quotes those charge words and names the kind. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');}}
 if(!items.length&&read)marks.push('[AUDIT v26: K-V PASS: '+read+' VOID ruling'+(read===1?'':'s')+' read; each quotes the charge words and names the kind; TRIAL rule]');
 return {items,marks};}
