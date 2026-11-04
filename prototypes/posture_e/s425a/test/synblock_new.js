{const SY=String(d.synthesis||'');const SL=SY.split('\n');const QF=s=>String(s||'').toLowerCase().replace(/[“”"’‘'*_`]/g,'').replace(/[^a-z0-9:\s]/g,' ').replace(/\s+/g,' ').trim();
 const DEF=QF([d.cr1,d.cr2,d.cr3,d.cr4].join('\n')),CHA=QF([d.gr1,d.gr2,d.dr3,d.dr4].join('\n')); /* judge_fix3 B3: the close rounds */const qin=(q,T)=>{const x=QF(q);return x.split(' ').length>=3&&T.includes(x);};
 const cut=s=>String(s).replace(/\s+/g,' ').trim().slice(0,200).replace(/[\[\]]/g,'');const SX=[];
 // judge_fix3 A7 (run 32255 G2: "Both use 3:38", "Both now agree" were not read): every "both" sentence (both agree, affirm, use, cite, accept,
 // hold, read, grant, now agree). It passes when it quotes words found in a defender round and in a challenger round, or, with no quotation, when
 // every verse it names is named in both sides' rounds (a bare chapter:verse is searched as written).
 const cvIn=(cv,T)=>new RegExp('(?<![0-9:])'+cv.replace(':','\\:')+'(?![0-9])').test(T);const RAWD=[d.cr1,d.cr2,d.cr3,d.cr4].join('\n'),RAWC=[d.gr1,d.gr2,d.dr3,d.dr4].join('\n');
 SL.forEach((l,i)=>{for(const s of l.split(/(?<=[.!?])\s+(?=[A-Z*_"“])/)){if(!/\bboth\s+(?:seats|sides|parties|debaters)\s+(?:now\s+)?(?:agree|state|affirm|hold|accept|grant|concede|use|cite|read)|\bboth\s+(?:now\s+)?(?:agree|affirm|use|cite|accept|hold|read|grant)\b/i.test(s))continue;
  const qs=[...[s,(/["“]/.test(s)?'':SL[i+1]||'')].join(' ').matchAll(/["“]([^"”]{8,})["”]/g)].map(m=>m[1]);const cvs=(x=>x.length?x:[...l.matchAll(/\b(\d{1,3}:\d{1,3})\b/g)].map(m=>m[1]))([...s.matchAll(/\b(\d{1,3}:\d{1,3})\b/g)].map(m=>m[1])); /* a sentence with no verse ("Both cite it.") takes the verses of its item */
  const ok=qs.length?(qs.some(q=>qin(q,DEF))&&qs.some(q=>qin(q,CHA))):(cvs.length>0&&cvs.every(cv=>cvIn(cv,RAWD)&&cvIn(cv,RAWC)));
  if(!ok)SX.push('(S-A) -- a "both" item '+(qs.length?'does not quote both sides\' own words':cvs.length?'names a verse one side never names ('+cvs.filter(cv=>!(cvIn(cv,RAWD)&&cvIn(cv,RAWC))).join(', ')+')':'quotes neither side')+': "'+cut(s)+'"');}});
 const lastAfter=(t,re)=>{t=String(t||'');let i=-1;for(const m of t.matchAll(re))i=m.index;return i<0?'':t.slice(i);};
 const LD=lastAfter(d.gr2,/UNSUPPORTED-L4 PREMISES/gi),LC=lastAfter(d.cr3,/CHALLENGER.{0,2}S UNSUPPORTED-L4 PREMISES/gi);
 const unnamed=(list,ans)=>{const A=String(ans||'');const out=[];for(const m of String(list).matchAll(/\b((?:[1-3]\s)?[A-Z][a-z]+)\.?\s+(\d{1,3}):(\d{1,3})/g)){const b3=m[1].replace(/\s/g,'').slice(0,3).toLowerCase();const cv=m[2]+':'+m[3];
  let ok=false;for(const k of A.matchAll(new RegExp('(?<![0-9:])'+cv.replace(':','\\:')+'(?![0-9])','g'))){const pre=A.slice(Math.max(0,k.index-40),k.index).replace(/\s/g,'').toLowerCase();if(pre.includes(b3)){ok=true;break;}}if(!ok)out.push(m[1]+' '+cv);}return out;};
 const UN=unnamed(LD,[d.cr2,d.cr3,d.cr4].join('\n')).concat(unnamed(LC,[d.gr2,d.dr3].join('\n'))); /* judge_fix3 B3: [CR4] answers for the defender */
 SL.forEach(l=>{if(/\b(?:every|each)\s+(?:link|premise|pressed\s+(?:row|witness|verse)|witness)\s+(?:\S+\s+){0,3}?(?:was|were|is|are|been)\s+answered\b|\ball\s+(?:the\s+)?(?:links|premises|pressed\s+(?:rows|witnesses|verses)|witnesses)\s+(?:\S+\s+){0,2}?(?:were|are|been)\s+answered\b/i.test(l)&&UN.length)
  SX.push('(S-B) -- "every link answered" while the closing lists carry verses no later round of the answering side names ('+UN.slice(0,8).join(', ')+(UN.length>8?', ...':'')+'): "'+cut(l)+'"');});
 // judge_fix3 A7 (run 32255 G3: section 1 "no charge on either side's list contests these" lists Matthew 1:16, Galatians 4:4, Matthew 1:25, Hebrews 7:14 and
 // the covenant-title rows, all carried by a premise): the heading forms widened ("no charge ... contests", "uncontested"), and an item also fires when a
 // verse it names (book and chapter:verse) is carried by either closing premise list.
 const listRefs=new Set([...(LD+'\n'+LC).matchAll(/\b((?:[1-3]\s)?[A-Z][a-z]+)\.?\s+(\d{1,3}):(\d{1,3})/g)].map(m=>m[1].replace(/\s/g,'').slice(0,3).toLowerCase()+' '+m[2]+':'+m[3]));
 {let on=false;const scRef=[];const LT=QF(LD+'\n'+LC);for(const l of SL){if(/^\s*#/.test(l)){on=/neither side|no charge\b[^\n]{0,60}\bcontests?|no charge on either|uncharged|uncontested|charges? neither/i.test(l);continue;}if(/neither side.s list charges|no charge on either side|no charge\b[^\n]{0,60}\bcontests?|charged by neither/i.test(l)){on=true;continue;}
  if(!on||!/^\s*(?:[-*•]|\d+[.)])\s+/.test(l))continue;const w=QF(l.replace(/["“][^"”\n]*["”]/g,' | ')).split(' ').filter(Boolean); /* the item's own words: a quoted verse or round stands in both places by nature */let hit=null;for(let k=0;k+5<=w.length;k++){const g=w.slice(k,k+5).join(' ');if(!/\d+:\d+|\|/.test(g)&&LT.includes(g)){hit=g;break;}}
  if(hit){SX.push('(S-C) -- an item listed as charged by neither side stands in a side\'s premise list ("'+hit+'"): "'+cut(l)+'"');continue;}
  {let lb=null;const vh=[];for(const m of l.matchAll(/\b((?:[1-3]\s)?[A-Z][a-z]+)\.?\s+(\d{1,3}):(\d{1,3})|\((\d{1,3}):(\d{1,3})\)/g)){if(m[1])lb=m[1];const b=(m[1]||lb||'');const k=b.replace(/\s/g,'').slice(0,3).toLowerCase()+' '+(m[2]||m[4])+':'+(m[3]||m[5]);if(b&&listRefs.has(k))vh.push(b+' '+(m[2]||m[4])+':'+(m[3]||m[5]));}
   if(vh.length)scRef.push(String(l).replace(/^\s*(?:[-*•]|\d+[.)])\s+/,'').replace(/[*_]/g,'').slice(0,40).trim()+' ('+[...new Set(vh)].join(', ')+')');}}
  if(scRef.length)SX.push('(S-C) -- '+scRef.length+' item(s) listed as charged by neither side name verses a closing premise list carries: '+scRef.join('; ').slice(0,700));}
 // judge_fix3 A7 (run 32255 G2: "the defender ... withdrew the Septuagint citation", where the defender wrote "I withdraw nothing"): (S-E) a sentence that
 // says a named side withdrew, conceded, retracted or dropped something, while no round of that side holds the verb affirmed (not "withdraw nothing",
 // "not concede") within 200 characters of a content word of the claim. The verbs are read in lower case or capitalised, never in capitals (the
 // synthesis's tags CONCEDED-BY-ITS-OWN-SIDE are its grades, not a claim of words).
 {const STOPW=new Set('the a an and or of in on at to for with by from this that these those its his her their our your which who what is are was were be been as it he she they not no any all every each both only also than then when while after before into upon withdrew withdrawn withdraws conceded concedes retracted retracts dropped drops outright rather instead defended defender challenger seat side link links round rounds citation'.split(' '));
  const FAM={w:/\bwithdr(?:aw|ew|awn|aws|awing)\b/i,c:/\bconce(?:de|ded|des|ding|ssion)\b/i,r:/\bretract(?:s|ed|ing)?\b/i,d:/\bdrop(?:s|ped|ping)?\b/i};
  const NEGV=/\b(?:not|never|nothing|no)\b/i;const SIDEC={DEFENDER:[d.cr1,d.cr2,d.cr3,d.cr4].join('\n'),CHALLENGER:[d.gr1,d.gr2,d.dr3,d.dr4].join('\n')};
  const affirmed=(T,fr,words)=>{for(const m of String(T).matchAll(new RegExp(fr.source,'gi'))){const a=Math.max(0,m.index-200),b=m.index+m[0].length+200;const pre=T.slice(Math.max(0,m.index-25),m.index),post=T.slice(m.index+m[0].length,m.index+m[0].length+12);
    if(NEGV.test(pre.split(/[.;,]/).pop())||/^\s*(?:nothing|none)\b/i.test(post))continue; /* "withdraw nothing" is no withdrawal; "concede no verse names" is a concession */const win=T.slice(a,b).toLowerCase();if(!words.length||words.some(w=>win.includes(w)))return true;}return false;};
  /* s425a (REVIEW_32677 item 7; A3_32643 section 8, the 5.5 flag): the claim passes when a quotation it gives (in the sentence, or in the block-quote
     lines that follow it) stands in that side's rounds with the verb (withdraw, concede, retract, drop) affirmed within 80 characters before or inside it */
  const qheld=(s,side,fr)=>{try{const qs=[...s.matchAll(/["“]([^"”\n]{12,})["”]/g)].map(m=>m[1]);const at=SY.indexOf(s);
   if(at>=0){for(const b of SY.slice(at+s.length).split('\n').slice(1)){if(!/^\s*>/.test(b))break;qs.push(b.replace(/^\s*>\s*/,'').replace(/^["“]|["”]$/g,''));}}
   const T=QF(SIDEC[side]);const F=new RegExp(fr.source,'gi');
   for(const q of qs){const x=QF(q);if(x.split(' ').length<4)continue;let p=T.indexOf(x);while(p>=0){const win=T.slice(Math.max(0,p-80),p+x.length);
    for(const m of win.matchAll(F)){const pre=win.slice(Math.max(0,m.index-25),m.index).split(' ').slice(-3).join(' ');if(!/\b(?:not|never|no)\b/.test(pre)&&!/^\s*(?:nothing|none)\b/.test(win.slice(m.index+m[0].length)))return true;}
    p=T.indexOf(x,p+1);}}return false;}catch(e){return false;}};
  for(const s of SY.split(/\n|(?<=[.!?])\s+(?=[A-Z*_"“])/)){const m=s.match(/(?<!\b(?:against|to|for|of|from|with|by|on|over|at)\s+(?:the\s+)?)\b(?:the\s+)?(defender|challenger)\b(?!['’]s)((?:(?!\b(?:judge|seat|panel|synthesis|defender|challenger)\b(?!['’]s))[^.;:]){0,60}?)\b([Ww]ithdr(?:ew|awn)|[Cc]onced(?:ed|es)|[Rr]etract(?:ed|s)|[Dd]ropped)\b|\b([Ww]ithdrawn|[Cc]onceded|[Rr]etracted|[Dd]ropped)\s+by\s+(?:the\s+)?(defender|challenger)\b/);if(!m)continue;
   if(/\b(?:no|not|never|nothing|neither|nor)\b/i.test((m[2]||'')+' '+s.slice(Math.max(0,m.index-40),m.index)))continue; // a negated claim ("No challenger link was conceded") is no claim of a withdrawal
   const side=(m[1]||m[5]).toUpperCase();const verb=(m[3]||m[4]).toLowerCase();const fr=FAM[verb[0]==='w'?'w':verb[0]==='c'?'c':verb[0]==='r'?'r':'d'];
   const objs=QF(s.slice(s.toLowerCase().indexOf(verb)+verb.length).replace(/["“][^"”]*["”]/g,' ')).split(' ').filter(w=>w.length>=5&&!STOPW.has(w)&&!/^\d/.test(w)).slice(0,6);
   /* judge_fix8 R10 (run 32306: "C3 (Galatians 4:4 says what Job 14:1 and Matthew 11:11 say) ... conceded by the defender", while the defender's close reads
      "Galatians 4:4, 'made of a woman,' says what Job 14:1 and Matthew 11:11 say of every mortal"): the claim's own references, read before the verb, standing
      together within 300 characters of a round of that side (its close included), hold the words */
   const held=(()=>{const pre=s.slice(0,s.toLowerCase().indexOf(verb));const rf=[...new Set([...pre.matchAll(/\b((?:[1-3]\s)?[A-Z][a-z]+)\.?\s+(\d{1,3}):(\d{1,3})/g)].map(m=>m[1]+' '+m[2]+':'+m[3]))];if(rf.length<2)return false;
    const T=String(SIDEC[side]||'').replace(/[*_]+/g,'');const at=rf.map(x=>{const o=[];let i=-1;while((i=T.indexOf(x,i+1))>=0)o.push(i);return o;});return at[0].some(p=>at.every(a=>a.some(q=>Math.abs(q-p)<=300)));})();
   if(!held&&!qheld(s,side,fr)&&!affirmed(SIDEC[side],fr,objs))SX.push('(S-E) -- the synthesis says the '+side.toLowerCase()+' '+verb+(objs.length?' ('+objs.slice(0,3).join(', ')+')':'')+', but no '+side.toLowerCase()+' round holds those words affirmed: "'+cut(s)+'"');}}
 SL.forEach(l=>{if(/\bguards?\b[^.\n]{0,80}\bbinds?\b[^.\n]{0,40}\bboth\s+(?:seats|sides)\b|\bbinds?\s+both\s+seats\b|\bboth\s+seats\b[^.\n]{0,40}\bbound\s+by\b[^.\n]{0,30}\bguards?\b/i.test(l))SX.push('(S-D) -- the synthesis says the guards bind both seats; the guards bind the record seat only: "'+cut(l)+'"');
  // judge_fix5 G10 (run 32284: "the defender's seat is never run against the guards ... that omission is the largest unchecked surface"; ruling 383): S-D
  // also reads a sentence that the guards bind, should bind, or should be run against the defender.
  else if(/\bguards?\b[^.\n]{0,80}\b(?:binds?|bound|should\s+bind|must\s+bind|run\s+against|tested\s+against|applied\s+to)\b[^.\n]{0,60}\bdefen(?:der|ce|se)(?:['’]s)?\b|\bdefen(?:der|ce|se)(?:['’]s)?\s+seat\b[^.\n]{0,60}\b(?:never|not)\s+(?:run|tested|checked|held)\s+against\s+the\s+guards?\b|\bshould\s+bind\s+the\s+defen(?:der|ce|se)\b|\bguard-tests?\s+the\s+challenger\s+seat\s+only\b/i.test(l))SX.push('(S-D) -- the synthesis says the guards bind, or should bind, the defender; the guards bind the Debate Oracle seat only (ruling 383): "'+cut(l)+'"');});
 // judge_fix5 G10 (run 32284: "The close round pressed nothing new" while the challenger's close graded D1 to D4): (S-F) a sentence that says a close
 // pressed nothing (new) while the C4 new-press check or the close-round grading check (G3) found a press in that close.
 {let pC=[],pD=[];try{const CG=__CGB();pC=C4P.of(d).concat(CG.C||[]);pD=CG.D||[]; /* judge_fix8 R2 */}catch(e){}
  SL.forEach(l=>{for(const s of l.split(/(?<=[.!?])\s+(?=[A-Z*_"“])/)){if(!/\bpress(?:ed|es)?\s+nothing(?:\s+new)?\b|\bno\s+new\s+press\b|\bdid\s+not\s+press\b|\bnothing\s+new\s+(?:was\s+)?pressed\b/i.test(s))continue;
   const who=/\bchallenger\b|\bDR4\b/i.test(s)?'C':/\bdefen(?:der|ce|se)\b|\bCR4\b/i.test(s)?'D':'?';const hit=who==='C'?pC:who==='D'?pD:pC.concat(pD);
   if(hit.length)SX.push('(S-F) -- the synthesis says the close pressed nothing new, while the system found '+hit.length+' press(es) in '+(who==='D'?"the defender's":who==='C'?"the challenger's":'a')+' close (first: '+String(hit[0]).slice(0,100).replace(/[\[\]"]/g,'')+'): "'+cut(s)+'"');}});}

 // S7 (journal 2044; FINAL_32510_CONSOLIDATED_v3 P7): the DG-18 rule "never quote Psalm 2:7 without its three NT occasions", counted by code over
 // the Debate Oracle seat's own rounds (the only seat the guards bind, ruling 383); a check of the synthesis's guard test, it changes no verdict.
 {const P27=/\bPs(?:a|alm|alms)?\.?\s+2\s*:\s*7(?!\d)|this\s+day\s+have\s+I\s+begotten\s+thee/i; /* journal 2059: the row's words as well as its reference (run 32643) */const NT=[['Acts 13:33',/\bActs\.?\s+13\s*:\s*33(?!\d)/i],['Hebrews 5:5',/\bHeb(?:rews)?\.?\s+5\s*:\s*5(?!\d)/i],['Hebrews 1:5',/\bHeb(?:rews)?\.?\s+1\s*:\s*5(?!\d)/i]];
  const OR=[];try{if(S.defender&&S.defender.profile==='oracle')OR.push(['defender',[d.cr1,d.cr2,d.cr3,d.cr4]]);if(S.challenger&&S.challenger.profile==='oracle')OR.push(['challenger',[d.gr1,d.gr2,d.dr3,d.dr4]]);}catch(e){}
  for(const [side,rs] of OR){const T=rs.filter(Boolean).join('\n');if(!P27.test(T))continue;const miss=NT.filter(x=>!x[1].test(T)).map(x=>x[0]);
   if(miss.length)SX.push('(S-G) -- guard DG-18: the Debate Oracle seat (the '+side+') quotes Psalm 2:7 in its rounds without its three New Testament occasions; missing: '+miss.join(', ')+'; the synthesis guard test is checked against this count');}
  // ruling 421 (B12; DG-8): the Debate Oracle seat's round that quotes Matthew 1:20's "that which is conceived in her is of the Holy Ghost" without
  // "Joseph, thou son of David" just before it (the verse cut to its clause), each quotation read on its own. A check of the synthesis's guard test; it changes no verdict.
  {const CUT=/that\s+which\s+is\s+conceived\s+in\s+her\s+is\s+of\s+the\s+Holy\s+Ghost/i,HEAD=/Joseph,?\s+thou\s+son\s+of\s+David/i;const RN={defender:['CR1','CR2','CR3','CR4'],challenger:['DR1','DR2','DR3','DR4']};
   const CUTG=new RegExp(CUT.source,'gi');const cutN=t=>{let n=0;for(const m of String(t||'').matchAll(CUTG))if(!HEAD.test(String(t).slice(Math.max(0,m.index-200),m.index)))n++;return n;}; /* each quotation on its own: the head must stand just before it */
   for(const [side,rs] of OR){const cut=rs.map((t,i)=>{const n=cutN(t);return n?RN[side][i]+(n>1?' ('+n+' times)':''):null;}).filter(Boolean);
    if(cut.length)SX.push('(S-H) -- guard DG-8: the Debate Oracle seat (the '+side+') quotes Matthew 1:20 as "that which is conceived in her is of the Holy Ghost" without "Joseph, thou son of David" just before it, in: '+cut.join(', ')+'; the synthesis guard test is checked against this count');}}}
  // s425a (ruling 425, owed item 2; reviews A3_32643 section 8 and C_32643 finding 7; REVIEW_32677 item 7):
 // (S-I) a quotation the synthesis gives to a named side stands only in the other side's rounds, or the synthesis names the round(s) and the
 //       quotation stands in none of them (R1 opening, R2, R3 link round, R4 close).
 // (S-J) a quotation the synthesis gives to a named side stands in no round of either side (guard wording is not read: the guards are not rounds).
 // (S-K) the synthesis, in its own voice (no side named, no quotation), states an absence or a count over scripture or the record
 //       (DG-63 shape), not marked UNVERIFIED. All three are review marks; nothing is removed and no seat is touched.
 {try{const RD={D:[null,d.cr1,d.cr2,d.cr3,d.cr4].map(QF),C:[null,d.gr1,d.gr2,d.dr3,d.dr4].map(QF)};
  const strip=t=>String(t).replace(/["“][^"”\n]*["”]/g,' ');
  /* the speaker is read from an explicit form only: a lead label ("*Defender's answer in R3:*", "**Challenger:**"), or, in the 80 characters before the
     quotation, "the defender conceded", "Defender's R4 answer", "the challenger:"; a side named as an object ("the defender's own concessions") is no speaker */
  const SPF=/(?:^|[.;:(|]\s*|\*+\s*|[-•]\s+)(?:the\s+)?(defend(?:er|ing)|challeng(?:er|ing)|oracle)(?:['’]s\s+(?:R[1-4]\s+|close\s+|link\s+round\s+|initial\s+|opening\s+|own\s+)?(?:answers?|words|repl(?:y|ies)|narrowing|grants?|claim|method\s+declaration|presses|R[1-4]|round|close)\b[^.;"“]{0,30}:|\s*\**\s*:)|\b(?:the\s+)?(defend(?:er|ing)|challeng(?:er|ing)|oracle)\s+(?:then\s+|explicitly\s+|also\s+)?(?:said|says|wrote|writes|states|stated|conceded|concedes|granted|grants|answered|answers|replied|replies|withdrew|withdraws|keeps|kept|held|holds|argued|argues|maintains|responds|responded|narrowed|narrows)\b/gi;
  const sideOf=x=>{let s=null;for(const m of String(x).matchAll(SPF))s=/^d/i.test(m[1]||m[2])?'D':'C';return s;};
  const roundsOf=t=>{const R=new Set();t=String(t);for(const m of t.matchAll(/\bR([1-4])\b/g))R.add(+m[1]);for(const m of t.matchAll(/\bround\s*([1-4])\b/gi))R.add(+m[1]);
   if(/\bclos(?:e|ing)\s+round\b|\bclose\b(?!\s+(?:to|of|reading))/i.test(t))R.add(4);if(/\blink\s+round\b/i.test(t))R.add(3);if(/\b(?:opening|initial)\b/i.test(t))R.add(1);return R;};
  /* each quotation is read against the plain text between it and the quotation before it (its gap): the speaker and the round(s) come from the gap,
     or from the parenthesis just after it ("(R3, LINK 5)"); a speaker is a label ("Defender:", "Defender's R4 answer:") or "the defender conceded";
     nothing carries from one quotation to the next, and the lead label ("*Defender's answer in R3 and Close:*") serves only the first quotation and
     block quotes. Quotations are split at an ellipsis. */
  const quotesOf=i=>{const L=String(SL[i]);const lead=(L.match(/^\s*(?:[-*•]|\d+[.)])?\s*\*+([^*"“]{3,80})\*+/)||[])[1]||'';const LS=sideOf(lead+':'),LR=roundsOf(lead);
   const qs=[];let last=0;for(const m of L.matchAll(/["“]([^"”\n]*)["”]/g)){const gap=L.slice(last,m.index).replace(/^\s*\([^)]{0,40}\)/,' ');const aft=(L.slice(m.index+m[0].length).match(/^\s*\(([^)]{0,30})\)/)||[])[1]||'';last=m.index+m[0].length;
    const first=!qs.length&&last===m.index+m[0].length&&L.slice(0,m.index)===gap;const sg=sideOf(gap);let R=roundsOf(gap+' '+aft);if(!R.size&&first)R=LR;
    for(const part of m[1].split(/\.\.\.|…/))if(part.trim().length>=15)qs.push({q:part,sd:sg||(first?LS:null),R,gap});}
   for(let k=i+1;k<SL.length&&/^\s*>/.test(SL[k]);k++){const bq=SL[k].replace(/^\s*>\s*/,'').replace(/^["“]|["”]$/g,'');const gap=L.slice(last);const R0=roundsOf(gap);
    for(const part of bq.split(/\.\.\.|…/))if(part.trim().length>=15)qs.push({q:part,sd:sideOf(gap)||LS,R:R0.size?R0:LR,gap});}return qs;};
  const where=q=>{const x=QF(q);const o={D:[],C:[]};if(x.split(' ').length<5)return null;for(const s of ['D','C'])for(let r=1;r<=4;r++)if(RD[s][r]&&RD[s][r].includes(x))o[s].push(r);return o;};
  const NM={D:'defender',C:'challenger'};const seen=new Set();
  SL.forEach((l,i)=>{if(/^\s*>/.test(l))return;const qs=quotesOf(i);if(!qs.length)return;
   for(const {q,sd,R,gap} of qs){const named=!!sd; /* guard wording is quoted from the guards, which are not rounds (DG-63 holds "needs MORE proof"): only words given to a side are read */const w=where(q);if(!w)continue;const key=QF(q)+'|'+sd+'|'+[...R].join();if(seen.has(key))continue;seen.add(key);
    if(!w.D.length&&!w.C.length){if(named)SX.push('(S-J) -- the synthesis quotes words that stand in no round of either side: "'+cut(q)+'" (line: "'+cut(l)+'")');continue;}
    if(!sd)continue;const ot=sd==='D'?'C':'D';
    if(!w[sd].length&&w[ot].length){SX.push('(S-I) -- the synthesis gives the '+NM[sd]+' words that stand only in the '+NM[ot]+'\'s rounds (R'+w[ot].join(', R')+'): "'+cut(q)+'"');continue;}
    if(R.size&&w[sd].length&&!w[sd].some(r=>R.has(r)))SX.push('(S-I) -- the synthesis places the '+NM[sd]+'\'s words in R'+[...R].sort().join(', R')+', but they stand in R'+w[sd].join(', R')+': "'+cut(q)+'"');}});
  for(const s of SY.split(/\n|(?<=[.!?]["”]?)\s+(?=[A-Z*_"“\[])/)){if(/\bUNVERIFIED\b/.test(s)||/^\s*>/.test(s))continue;if(((s.match(/["“”]/g)||[]).length)%2)continue; /* an unpaired mark: the sentence sits inside a quotation */const sv=strip(s);if(/\b(?:defend(?:er|ing)|challeng(?:er|ing)|oracle|judges?|seats?|panel|sides?)\b/i.test(sv))continue;
   if(/\b(?:the\s+canon|scripture|the\s+bible|the\s+record|the\s+text)\b[^.\n]{0,80}\b(?:exactly|only)\s+one\b|\b(?:exactly|only)\s+one\s+(?:verse|row|passage|text)\b|\bno\s+(?:verse|row|text|passage)\s+(?:in\s+(?:the\s+)?(?:canon|scripture|bible)\s+)?(?:names|states|says|gives|joins|places|records)\b|\bnowhere\s+(?:in|does|is)\b/i.test(sv))
    SX.push('(S-K) -- the synthesis states, in its own voice, an absence or a count over scripture, not marked UNVERIFIED (DG-63 shape): "'+cut(s)+'"');}}catch(e){SX.push('(S-I) -- the checks S-I, S-J and S-K stopped on an error and read nothing: '+String(e&&e.message||e).slice(0,120));}}
 SX.forEach(x=>FF.push('[AUDIT v23: SYNTHESIS CHECK '+x+'. REVIEW THIS ROW.]'));}