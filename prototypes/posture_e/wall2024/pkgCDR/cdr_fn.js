/* pkgCDR (W1): the dropped-then-restated check. Wording a side dropped or withdrew in its rounds 1-3 that the same side states again, as its own
   (not inside quote marks, not in a sentence that itself drops, withdraws or grants), in its closing round is listed as a candidate. The enforcer must
   answer each listed candidate; Close Enforcer Record checks every answer as before. The check names candidates only; it confirms nothing. */
const CDR_SW=new Set('a an the and or of to in on at by for from with as is are was were be been it its this that these those any all my his her their our your i we he she they not no nor but so if then than which who whom whose what when where there here only by itself alone also'.split(' '));
const cdrCore=x=>x.split(' ').filter(w=>w&&!CDR_SW.has(w)&&w.length>2).length;
const cdrUnq=s=>String(s).replace(/"[^"\n]*"|“[^”\n]*”|‘[^’\n]*’/g,' ');
const cdrSentsRaw=raw=>String(raw||'').split(/\n+|(?<=[.!?]["”’')\]]*)\s+/).map(x=>x.trim()).filter(Boolean);
const cdrDrop=/\bI\s+(?:now\s+|also\s+|therefore\s+)?(?:drop|withdraw|retract|give\s+up|abandon)\b(?!\s+(?:nothing|none|no\b|neither|not\b))/i; /* rev 2 (W2 grade): a refused drop (\"I drop nothing\", \"I withdraw none of\", \"I give up no part\") is not a drop */
const cdrSelf=/\b(?:drop|dropped|withdr[a-z]*|retract[a-z]*|gave\s+up|give\s+up|abandon[a-z]*|grant|granted|grants)\b/i;
const cdrWords=s=>{const W=[];for(const m of String(s).matchAll(/"([^"\n]+)"|“([^”\n]+)”|‘([^’\n]+)’/g)){const q=cecN(m[1]||m[2]||m[3]);if(q.split(' ').length>=3&&cdrCore(q)>=2)W.push(q);}
 const u=cdrUnq(s).replace(/[*_`]+/g,'');const m=u.match(/\b(?:claim|limb|wording|sentence|reading|premise|step)\s+that\s+((?:[^,;:\n]|:(?=\d))+?)(?:[,;]|:(?!\d)|\.\s*$|$)/i);
 if(m){const q=cecN(m[1]);if(q.split(' ').length>=5&&cdrCore(q)>=2)W.push(q);}return [...new Set(W)];};
/* rev 3 (W3 grade of rev 2): a drop is read only when the drop verb OPENS the sentence (after list marks, markup and labels ending in a colon) and the
   dropped thing follows it directly: a quoted span, or the/my/this/that/any + wording/word/words/phrase/claim/limb/sentence/reading/premise/step + a quoted
   span or a "that ..." clause. Only that first object is taken. A sentence is read clause by clause: a clause after ";" or after ", but I" / ", and I" opens
   like a sentence; an adverb (now, also, hereby, therefore) may stand before or after the verb. "Nor do I drop", "If I drop", "Should I withdraw", "demands that I withdraw",
   "I withdraw my objection to", "I retract only the word" and "I drop nothing" are not drops of a wording. */
/* rev 8 (W2 and W3 grades of rev 7: true drops not listed, 12 of them real forms from the stored debates). The structural rules of revs 3 to 7
   (verb opens the clause, wording directly after the verb, first object only) are removed. W3's rule:
   - a clause (a sentence, split at ";") of the side's rounds 1 to 3 is a drop clause when it holds a drop verb in any form: drop, withdraw,
     retract, abandon, relinquish, renounce, surrender, forgo, strike, give up (and give ... up), take back (and take ... back), set / put / lay
     aside, let go of, no longer hold / claim / assert / maintain / affirm / press / stand by / rely on / argue; any tense, active or passive;
   - unless at every such verb the verb is negated (not, never, nor, cannot, do not, will not, refuse to, decline to, "nor do I" ... just before
     it, or nothing / none / no / neither / not (but not "not only") just after it), the passive names the opponent as agent ("by the challenger"), or the opponent is its subject or reports it (the challenger / defender / opponent / he /
     she / they + says, demands, asks, wants, argues, would have, drops, withdrew ...);
   - and the sentence is not a question.
   From a drop clause every quoted span (3+ words, 2+ content words) and every "that ..." clause (5+ words, 2+ content words; a passive "is withdrawn" after it is cut off) is taken.
   Conditional, hypothetical and argument's-sake drops are listed: the enforcer is shown the whole earlier sentence and rules on it. */
const CDR_VF=String.raw`\b(?:drop(?:s|ped|ping)?|withdr(?:aw|aws|awn|awing|ew)|retract(?:s|ed|ing)?|abandon(?:s|ed|ing)?|relinquish(?:es|ed|ing)?|renounc(?:e|es|ed|ing)|surrender(?:s|ed|ing)?|forg(?:o|oes|one|oing)|foreg(?:o|oes|one|oing)|strik(?:e|es|ing)|struck|(?:give|gives|gave|given|giving)\s+(?:[^.;:!?\n]{0,80}?\s+)?up|(?:take|takes|took|taken|taking)\s+(?:[^.;:!?\n]{0,80}?\s+)?back|(?:set|sets|setting|put|puts|putting|lay|lays|laid|laying)\s+aside|(?:let|lets|letting)\s+go\s+of|no\s+longer\s+(?:hold|claim|assert|maintain|affirm|press|stand\s+by|rely\s+on|argue))\b`;
const cdrVerbRe=new RegExp(CDR_VF,'gi');
const cdrNegBefore=/\b(?:not|never|nor|cannot|can['’]t|won['’]t|don['’]t|didn['’]t|doesn['’]t|refuse\s+to|refused\s+to|decline\s+to|declined\s+to)\s+(?:(?:now|also|ever|yet|simply|therefore|hereby)\s+)?$|\b(?:nor|not|never)\s+(?:(?:do|did|does|will|would|shall|can|could|should)\s+)?(?:I|we)\s+(?:(?:now|also|ever|yet)\s+)?$/i;
const cdrNegAfter=/^\s+(?:nothing|none|no\b|neither|not\b(?!\s+only\b))|^\s+by\s+(?:the\s+)?(?:challenger|defender|opponent|other\s+side|him|her|them)\b/i;
const cdrOpp=/\b(?:the\s+)?(?:challenger|defender|opponent|other\s+side|he|she|they)\s+(?:\w+\s+){0,2}?(?:says?|said|demands?|demanded|asks?|asked|wants?|wanted|argues?|argued|claims?|claimed|insists?|insisted|urges?|urged|thinks?|thought|would\s+have|presses?|pressed|writes?|wrote|calls?\s+on|requires?|required|expects?|drops?|dropped|withdr\w*|retract\w*|abandon\w*|gave|gives?|took|takes?|struck|strikes?|sets?)\b/i;
const cdrObj=s=>{const t=String(s).replace(/[*_`]+/g,'');let any=false;
 for(const m of t.matchAll(cdrVerbRe)){const pre=t.slice(Math.max(0,m.index-40),m.index),post=t.slice(m.index+m[0].length);
  if(cdrNegBefore.test(pre)||cdrNegAfter.test(post))continue;if(cdrOpp.test(t.slice(0,m.index+m[0].length).slice(-160)))continue;any=true;break;}
 if(!any)return [];const W=[];
 for(const m of t.matchAll(/"([^"\n]+)"|“([^”\n]+)”/g)){const q=cecN(m[1]||m[2]);if(q.split(' ').length>=3&&cdrCore(q)>=2)W.push(q);}
 for(const m of cdrUnq(t).matchAll(/\bthat\s+((?:[^,;:\n.!?]|:(?=\d)|\.(?=\d))+)/gi)){const q=cecN(m[1].replace(/\s+(?:is|was|are|were|has\s+been|have\s+been|stands)\s+(?:now\s+|hereby\s+|therefore\s+|also\s+)?(?:withdrawn|dropped|retracted|abandoned|struck|set\s+aside|given\s+up|taken\s+back|relinquished|renounced|surrendered)\b.*$/i,''));if(q.split(' ').length>=5&&cdrCore(q)>=2)W.push(q);}
 return [...new Set(W)];};
/* rev 4 (W3 grade of rev 3): a drop sentence that ends in "?" (markup and closing quotes aside) is a question, not a drop.
   rev 7 (W3 grade of rev 6): no condition test after the drop. Revs 4 to 6 tried word lists and a position rule; each hid true drops or listed
   false ones. Only structural tests remain, which hide no true drop: the drop verb opens the sentence or clause with the wording directly after
   it (rev 3; so a condition BEFORE the drop, "If ..., I drop ...", is not read), the verb is not negated (rev 2), and the sentence is not a
   question. Every other drop is listed, conditional or not; the enforcer is shown the whole earlier sentence and rules on it, and Close
   Enforcer Record confirms a break only on a CONFIRMED answer with both quotations found word for word. */
const cdrCond=ds=>{const u=cdrUnq(String(ds)).replace(/[*_`]+/g,'').trim();return /\?["”’')\]]*\s*$/.test(u);};
const cdrLinkAt=(raw,sent)=>{const t=String(raw||'');const i=t.indexOf(sent);if(i<0)return null;let n=null;for(const h of t.slice(0,i).matchAll(/\bLINK\s+(\d+)\b/gi))n=+h[1];return n;};
const cecDropped=F=>{const out=[];const SD=[['DEFENDER',[['CR1','cr1'],['CR2','cr2'],['CR3','cr3']],['CR4','cr4']],['CHALLENGER',[['DR1','gr1'],['DR2','gr2'],['DR3','dr3']],['DR4','dr4']]];
 for(const [side,early,[cr,ck]] of SD){const close=cdrSentsRaw(F[ck]).filter(z=>!cdrSelf.test(z));let k=0;
  for(const [er,ek] of early)for(const ds of cdrSentsRaw(F[ek]).filter(z=>!cdrCond(z)))for(const w of [...new Set(ds.split(/;\s+/).flatMap(cdrObj))])for(const cs of close){
   if(!cecN(cdrUnq(cs)).includes(w))continue;if(out.some(o=>o.side===side&&o.closing_q===cs&&o.earlier_q===ds))continue;if(++k>12)break;
   out.push({id:'P'+(out.length+1),side,by:'the code check (wording the side dropped, found again in its closing round)',kind:'LINK',n:cdrLinkAt(F[ek],ds)||'?',earlier_round:er,earlier_q:ds.replace(/^(?:[-•>]\s+|\d{1,2}[.)]\s+)/,''),closing_round:cr,closing_q:cs.replace(/^(?:[-•>]\s+|\d{1,2}[.)]\s+)/,''),why:'the closing sentence holds the dropped wording "'+w+'"'});}}
 return out;};
