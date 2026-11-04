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
