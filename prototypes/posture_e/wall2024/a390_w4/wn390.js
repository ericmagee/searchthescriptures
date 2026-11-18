/* pkgWN (ASK 390, option C MARK ONLY, ruling 22:09 CST 11-17): a debater's working note to itself is marked, never removed. Quoted text is masked first. */
function wn390(text){const t=String(text==null?'':text);
 const unm=(()=>{let o=t,i=-1;while((i=o.indexOf('[working note: ',i+1))>=0){let d=0,j=i;for(;j<o.length;j++){if(o[j]==='[')d++;else if(o[j]===']'&&--d===0)break;}o=o.slice(0,i)+' '.repeat(Math.min(j+1,o.length)-i)+o.slice(j+1);}return o;})(); /* brackets balanced, so a "[L1]" inside a mark does not end it */
 const mask=unm.replace(/"[^"\n]*"|“[^”\n]*”/g,m=>' '.repeat(m.length)); /* a mark already in the text (a round echoed back) is masked too, so a second pass marks nothing */
 const M1=/(?<=\S)[ \t]*(?:[\u2014\u2013]|-{1,2}|[,;])[ \t]*(?:wait|hmm+|oops|scratch that|no,? wait|correction)[ \t]*[,:;\u2014\u2013-]/gi; /* a mid-sentence self-correction: the separator follows text on the same line, so a list item "- Correction:" is not one */
 const M2=/\bnot (?:on|in) (?:the |my )?(?:verse )?sheet\b|\bto stay safe\b|\bthis is challenged\?|\b(?:will|would|might|could)(?: not)? (?:be|get) flagged\b|\bto avoid (?:a |the |being )?(?:flag|flagged|gate|penalty|strike)\b|\bsafer? to quote\b|\bI (?:must|should|can) (?:only )?quote only\b/gi; /* talk to itself about the engine's own machinery */
 const hits=[];for(const [re,k] of [[M1,'M1'],[M2,'M2']]){re.lastIndex=0;let m;while((m=re.exec(mask)))hits.push({at:m.index,end:m.index+m[0].length,marker:k,word:m[0].trim()});}
 if(!hits.length)return {text:t,notes:[]};
 /* clause span (W1 8304): clauses end at a dash, a semicolon, a sentence end or a line end, read on the masked text so a quotation is never cut.
    M1 marks the clause the hit opens; M2 marks its own clause (W3 8305, W1 8306). */
 const SEP=/[\u2014\u2013;.!?\n]|\s--?\s/g;const seps=[];{let m;SEP.lastIndex=0;while((m=SEP.exec(mask)))seps.push([m.index,m.index+m[0].length,m[0]]);}
 const back=x=>{let s=0;for(const q of seps){if(q[1]<=x)s=q[1];else break;}return s;};
 const fwd=x=>{for(const q of seps)if(q[0]>=x)return /[.!?]/.test(q[2])?q[1]:q[0];return mask.length;};
 const endsSep=h=>/[\u2014\u2013;.!?]$/.test(mask.slice(h.at,h.end).trim());
 const trim=(s,e)=>{while(s<e&&/\s/.test(t[s]))s++;while(e>s&&/\s/.test(t[e-1]))e--;return [s,e];};
 const spans=[];for(const h of hits){let s,e;
  if(h.marker==='M1'){s=h.at;while(s<h.end&&/[\s,;\u2014\u2013-]/.test(mask[s]))s++;e=endsSep(h)?h.end:fwd(h.end);} /* M1: the clause the hit opens, from the interjection on */
  else{s=back(h.at);e=endsSep(h)?h.end:fwd(h.end);} /* M2: its own clause */
  const [s2,e2]=trim(s,e);spans.push({s:s2,e:e2,marker:h.marker,word:h.word});}
 spans.sort((a,b)=>a.s-b.s);const mg=[];for(const x of spans){const l=mg[mg.length-1];if(l&&(x.s<=l.e||/^\s*$/.test(t.slice(l.e,x.s)))){l.e=Math.max(l.e,x.e);l.markers.push(x.marker+':'+x.word);}else mg.push({s:x.s,e:x.e,markers:[x.marker+':'+x.word]});}
 let out='',p=0;for(const x of mg){out+=t.slice(p,x.s)+'[working note: '+t.slice(x.s,x.e)+']';p=x.e;}out+=t.slice(p);
 return {text:out,notes:mg.map(x=>({span:[x.s,x.e],marker:x.markers.join(', ')}))};}
