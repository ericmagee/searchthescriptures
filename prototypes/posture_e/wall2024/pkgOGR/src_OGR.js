// pkgOGR (Eric 2026-11-06 16:22 CST, W3 spec Wall 2024): the Oracle (challenger) tracks every statement of its opponent that supports the claim
// it challenges, and presents them in its close round. Oracle seat only. Code harvests the defender's grant sentences from [CR1]-[CR4]; the
// [DR4] request carries the list and asks for an OPPONENT'S GRANTS section first; a check reads that section back.
// Harvest: a sentence of a defender round that withdraws or grants footing (the K-W words: "I do not claim", "I no longer claim", "I withdraw",
// "I grant", "I concede", "I drop") or that opens with "Granted", "Conceded" or "CONCEDED". As K-W: not inside a quotation, not a heading, not
// negated ("I grant nothing"). The sentence runs from the grant words to its end (220 characters at most); a sentence the defender repeats is
// listed once, under the first round that has it.
const OGR=(()=>{
 const RX=/\bI\s+(?:do\s+not\s+claim|no\s+longer\s+claim|withdraw|grant|concede|drop)\b|(?:^|(?<=[.!?]["”')\]]?\s+)|(?<=\n[ \t>*#-]*))(?:Granted|Conceded|CONCEDED)\b/g;
 const N=s=>String(s==null?'':s).replace(/[*_`]+/g,'').replace(/[“”]/g,'"').replace(/[‘’]/g,"'");
 const W=s=>N(s).toLowerCase().replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
 function harvest(R){const out=[];const seen=new Set();
  for(const rk of ['CR1','CR2','CR3','CR4']){const t=N(R&&R[rk]);if(!t)continue;
   for(const m of t.matchAll(RX)){const ls=t.lastIndexOf('\n',m.index)+1;const le=t.indexOf('\n',m.index);const ln=t.slice(ls,le<0?t.length:le);const bf=t.slice(ls,m.index);
    if(/^\s*#/.test(ln)&&!/[.!?]["')\]]?\s*$/.test(ln))continue; /* a heading */
    if((bf.match(/"/g)||[]).length%2===1)continue; /* inside a quotation */
    if(/^\s*(?:none|nothing|no)\b/i.test(t.slice(m.index+m[0].length)))continue; /* negated */
    const ss=t.slice(m.index).split(/(?<=[.!?])["')\]]?\s|\n/);let s=ss[0];if(s.split(/\s+/).length<7&&ss[1])s=s+' '+ss[1]; /* a short grant ("I concede three points.") carries the sentence after it */s=s.slice(0,260).trim();const k=W(s);if(k.split(' ').length<3||seen.has(k))continue;seen.add(k);
    out.push({g:out.length+1,round:rk,text:s});}}
  return out;}
 // the list as the [DR4] request gives it
 function block(G){if(!G.length)return '';return "THE DEFENDER'S GRANTS -- computed by the system from the transcript, not by a model: every sentence of the defender's rounds [CR1] to [CR4] that grants, concedes, withdraws or drops footing, word for word with its round:\n"
  +G.map(x=>'G'+x.g+' ['+x.round+'] "'+x.text+'"').join('\n')
  +"\n\nOPEN YOUR CLOSE ROUND WITH THIS SECTION, before anything else, one line for each grant above, in this form:\nOPPONENT'S GRANTS:\nG<n> [<round>] \"<the grant, word for word as listed>\" -- SUPPORTS: <the claim you challenge that this grant supports, in one line, with the verse it rests on>\n"
  +"Every grant listed must have its line; quote it word for word as listed and keep its round. If a grant supports none of your claims, write SUPPORTS: none -- <why, in one line>. "
  +"Then add, as G+ lines in the same form, any other sentence of the defender's rounds that supports a claim you challenge (for example a statement that no row names a point the defender's case needs), each quoted word for word with its round. "
  +"This section presses nothing new: it quotes only the defender's own words, and the verses you name in it must be verses you cited before. The system checks every quotation in it against the round named.";}
 // the check of a [DR4] text against the harvested list and the defender's rounds
 function check(dr4,G,R){const T=N(dr4);const i=T.search(/OPPONENT'?S GRANTS\s*:/i);const res={section:i>=0,missing:[],misquoted:[],ok:[]};if(!G.length)return {...res,applies:false};
  const sec=i<0?'':T.slice(i).split(/\n\s*\n(?!\s*G\d)/)[0];const lines=sec.split('\n').filter(l=>/^\s*[-*]?\s*G(?:\d+\b|\+)/.test(l));res.extra=[];
  for(const l of lines.filter(z=>/^\s*[-*]?\s*G\+/.test(z))){const q=(l.match(/\]\s*"(.{6,})"\s*(?:--|\u2014|\u2013)\s*SUPPORTS\b/i)||l.match(/"([^"]{6,})"/)||[])[1]; /* the whole quotation: a grant may hold quotation marks of its own */const rk=(l.match(/\[(CR[1-4])\]/)||[])[1];const ok=!!(q&&rk&&W(R[rk]||'').includes(W(q)));res.extra.push({ok,round:rk||null,q:q?q.slice(0,120):null});if(!ok)res.misquoted.push('G+ ('+(q?'"'+q.slice(0,60)+'" does not stand in ['+(rk||'no round')+']':'no quotation')+')');}
  for(const x of G){const l=lines.find(z=>new RegExp('^\\s*[-*]?\\s*G'+x.g+'\\b').test(z));if(!l){res.missing.push('G'+x.g);continue;}
   const q=(l.match(/\]\s*"(.{6,})"\s*(?:--|\u2014|\u2013)\s*SUPPORTS\b/i)||l.match(/"([^"]{6,})"/)||[])[1]; /* the whole quotation: a grant may hold quotation marks of its own */const rk=(l.match(/\[(CR[1-4])\]/)||[])[1];
   if(!q||!rk){res.misquoted.push('G'+x.g+' (no quotation or no round)');continue;}
   const inRound=W(R[rk]||'').includes(W(q));const same=W(q).includes(W(x.text))||W(x.text).includes(W(q))&&W(q).split(' ').length>=6;
   if(!inRound)res.misquoted.push('G'+x.g+' (the quotation does not stand in ['+rk+'])');else if(!same)res.misquoted.push('G'+x.g+' (not the listed grant)');else res.ok.push('G'+x.g);}
  return {...res,applies:true,pass:res.section&&!res.missing.length&&!res.misquoted.length};}
 return {harvest,block,check};})();
