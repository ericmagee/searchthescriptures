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
const cdrObj=s=>{const W=[];let t=String(s).replace(/[*_`]+/g,'').replace(/^\s*(?:(?:[-•>]|\d{1,2}[.)])\s*)+/,'');for(let i=0;i<4;i++){const u=t.replace(/^\s*[A-Z][A-Za-z0-9 ,'’-]{0,40}:\s+/,'');if(u===t)break;t=u;}
 const m=t.match(/^\s*I\s+(?:now\s+|also\s+|therefore\s+|hereby\s+)?(?:drop|withdraw|retract|give\s+up|abandon)\s+(?:(?:now|also|hereby|therefore)\s+)?(?:(?:the|my|this|that|any)\s+(?:wording|word|words|phrase|claim|limb|sentence|reading|premise|step)\s+)?(?:"([^"\n]+)"|“([^”\n]+)”|that\s+((?:[^,;:\n]|:(?=\d))+?)(?:[,;]|:(?!\d)|\.\s*$|$))/i);
 if(!m)return W;{const tm=m[3]!=null?m[0].slice(-1):'';const rest=(tm===','?', ':tm===';'?'; ':'')+cdrUnq(t.slice(m.index+m[0].length));if(cdrAfter.test(rest))return W;}if(m[1]||m[2]){const q=cecN(m[1]||m[2]);if(q.split(' ').length>=3&&cdrCore(q)>=2)W.push(q);}else if(m[3]&&/^\s*I\s+(?:now\s+|also\s+|therefore\s+|hereby\s+)?(?:drop|withdraw|retract|give\s+up|abandon)\s+(?:(?:now|also|hereby|therefore)\s+)?(?:the|my|this|that|any)\s+/i.test(t)){const q=cecN(m[3]);if(q.split(' ').length>=5&&cdrCore(q)>=2)W.push(q);}return W;};
/* rev 4 (W3 grade of rev 3): a drop sentence that ends in "?" (markup and closing quotes aside) is a question, not a drop.
   rev 6 (W3 grade of rev 5: words anywhere in the clause hid true drops): a condition counts only where it governs the drop. Before the drop verb
   it already does (the verb must open the sentence or clause). After it, only a condition STARTING directly after the dropped wording (the quoted
   span or the "that" clause), with an optional comma and an optional "but" / "and" / "only" / "except" before it. The family at that position: if (not "even
   if", "as if", "if only"), unless, provided/providing, in case / in the case / in the event, on (a / one / the / this) condition, on the understanding,
   supposing, assuming, (only) when, once, the day, so long as / as long as, contingent or conditional on/upon, barring, should / were / had +
   subject; and the drop made for argument's sake: for the sake of argument, for argument's sake, arguendo, hypothetically. Not in the family:
   until, pending, subject to, granted that, on ... terms, the bare nouns condition / proviso. */
const cdrCond=ds=>{const u=cdrUnq(String(ds)).replace(/[*_`]+/g,'').trim();return /\?["”’')\]]*\s*$/.test(u);};
const CDR_SUBJ='(?:the|he|she|it|they|we|you|i|this|that|these|those|my|his|her|their|our|its|any|no)';
const cdrAfter=new RegExp('^\\s*(?:,\\s*)?(?:(?:but|and)\\s+)?(?:only\\s+|except\\s+)?(?:if\\b(?!\\s+(?:only|just|merely|nothing\\s+else)\\b)|unless\\b|provid(?:ed|ing)\\b|in\\s+(?:the\\s+)?(?:case|event)\\b|on\\s+(?:a\\s+|one\\s+|the\\s+|this\\s+)?condition\\b|on\\s+the\\s+understanding\\b|supposing\\b|assuming\\b|when\\b|once\\b|the\\s+day\\b|(?:so|as)\\s+long\\s+as\\b|(?:contingent|conditional)\\s+(?:on|upon)\\b|barring\\b|(?:should|were|had)\\s+'+CDR_SUBJ+'\\b|for\\s+the\\s+sake\\s+of\\s+argument\\b|for\\s+argument[\'’]s\\s+sake\\b|arguendo\\b|hypothetically\\b)','i');
const cdrLinkAt=(raw,sent)=>{const t=String(raw||'');const i=t.indexOf(sent);if(i<0)return null;let n=null;for(const h of t.slice(0,i).matchAll(/\bLINK\s+(\d+)\b/gi))n=+h[1];return n;};
const cecDropped=F=>{const out=[];const SD=[['DEFENDER',[['CR1','cr1'],['CR2','cr2'],['CR3','cr3']],['CR4','cr4']],['CHALLENGER',[['DR1','gr1'],['DR2','gr2'],['DR3','dr3']],['DR4','dr4']]];
 for(const [side,early,[cr,ck]] of SD){const close=cdrSentsRaw(F[ck]).filter(z=>!cdrSelf.test(z));let k=0;
  for(const [er,ek] of early)for(const ds of cdrSentsRaw(F[ek]).filter(z=>!cdrCond(z)))for(const w of [...new Set(ds.split(/;\s+|,\s+(?:but|and)\s+(?=I\s)/).flatMap(cdrObj))])for(const cs of close){
   if(!cecN(cdrUnq(cs)).includes(w))continue;if(out.some(o=>o.side===side&&o.closing_q===cs&&o.earlier_q===ds))continue;if(++k>12)break;
   out.push({id:'P'+(out.length+1),side,by:'the code check (wording the side dropped, found again in its closing round)',kind:'LINK',n:cdrLinkAt(F[ek],ds)||'?',earlier_round:er,earlier_q:ds.replace(/^(?:[-•>]\s+|\d{1,2}[.)]\s+)/,''),closing_round:cr,closing_q:cs.replace(/^(?:[-•>]\s+|\d{1,2}[.)]\s+)/,''),why:'the closing sentence holds the dropped wording "'+w+'"'});}}
 return out;};
