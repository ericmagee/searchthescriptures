/* pkgWN (ASK 390, option C MARK ONLY, ruling 22:09 CST 11-17): a debater's working note to itself is marked, never removed. Quoted text is masked first. */
function wn390(text){const t=String(text==null?'':text);
 const mask=t.replace(/"[^"\n]*"|“[^”\n]*”/g,m=>' '.repeat(m.length));
 const M1=/(?<=\S)[ \t]*(?:[\u2014\u2013]|-{1,2}|[,;])[ \t]*(?:wait|hmm+|oops|scratch that|no,? wait|correction)[ \t]*[,:;\u2014\u2013-]/gi; /* a mid-sentence self-correction: the separator follows text on the same line, so a list item "- Correction:" is not one */
 const M2=/\bnot (?:on|in) (?:the |my )?(?:verse )?sheet\b|\bto stay safe\b|\bthis is challenged\?|\b(?:will|would|might|could)(?: not)? (?:be|get) flagged\b|\bto avoid (?:a |the |being )?(?:flag|flagged|gate|penalty|strike)\b|\bsafer? to quote\b|\bI (?:must|should|can) (?:only )?quote only\b/gi; /* talk to itself about the engine's own machinery */
 const hits=[];for(const [re,k] of [[M1,'M1'],[M2,'M2']]){re.lastIndex=0;let m;while((m=re.exec(mask)))hits.push({at:m.index,end:m.index+m[0].length,marker:k,word:m[0].trim()});}
 if(!hits.length)return {text:t,notes:[]};
 /* sentence span around each hit, on the masked text: back to the last . ! ? or newline, forward to the next one */
 const spans=[];for(const h of hits){let s=h.at;while(s>0&&!/[.!?\n]/.test(mask[s-1]))s--;let e=h.end;while(e<mask.length&&!/[.!?\n]/.test(mask[e]))e++;if(e<mask.length&&mask[e]!=='\n')e++;while(s<e&&/\s/.test(t[s]))s++;spans.push({s,e,marker:h.marker,word:h.word});}
 spans.sort((a,b)=>a.s-b.s);const mg=[];for(const x of spans){const l=mg[mg.length-1];if(l&&x.s<=l.e+1){l.e=Math.max(l.e,x.e);l.markers.push(x.marker+':'+x.word);}else mg.push({s:x.s,e:x.e,markers:[x.marker+':'+x.word]});}
 let out='',p=0;for(const x of mg){out+=t.slice(p,x.s)+'[working note: '+t.slice(x.s,x.e)+']';p=x.e;}out+=t.slice(p);
 return {text:out,notes:mg.map(x=>({span:[x.s,x.e],marker:x.markers.join(', ')}))};}
