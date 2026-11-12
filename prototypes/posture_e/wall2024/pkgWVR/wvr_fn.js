const cecWvr=(F,prev)=>{/* pkgWVR: a verse the side withdrew or stopped resting on in round 2 or 3 is cited again in its close as a footing of a link ("layer of", "stands on", "rests on"); the enforcer decides. Manual: pkgWVR section. */
 const out=[],st=x=>x.replace(/[*_]+/g,'').replace(/^[\s>#-]+/,'').trim(),SE=/(?<=[.!?]["”’')\]]*)\s+/,nq=x=>st(x).replace(/\s+/g,' ').toLowerCase();let k=Math.max(0,...prev.map(c=>+String(c.id).slice(1)||0));
 const REF='((?:[1-3]\\s)?[A-Z][a-z]+\\s+\\d+:\\d+)',WD=new RegExp('\\b(?:I|we)\\s+(?:(?:withdraw|drop|set\\s+aside|retract)(?:\\s+(?:any|my|all)\\s+(?:reliance|rest)\\s+on)?|(?:do\\s+not|no\\s+longer)\\s+rest\\s+(?:[\\w\'’]+\\s+){0,3}?on)\\s+(?:the\\s+)?'+REF+'(?![\\d:])'),PART=/\b(?:by\s+(?:it|them)sel(?:f|ves)|alone|as\s+sufficient|on\s+its\s+own|of\s+itself|only\s+as)\b/i;
 const SUP=/\b(?:(?:\w+\s+)?layer\s+of|stands?\s+on|rests?\s+on|footing\s+(?:of|for))\b/i,NEG=/\b(?:do|does|did)\s+not\s+(?:rest|stand)|\bno\s+longer\b|\bset\s+aside\b|\bwithdr|\bnot\s+(?:rest|stand)/i,seen=new Set(prev.map(c=>nq(c.earlier_q||'')+'|'+nq(c.closing_q||'')));
 for(const [sd,P,r] of [['DEFENDER','CR',['cr2','cr3','cr4']],['CHALLENGER','DR',['gr2','dr3','dr4']]]){let cap=3;const W=[];
  r.slice(0,2).forEach((key,i)=>{for(const s of String(F[key]||'').split(/\n+/).flatMap(l=>l.split(SE)).map(st)){const m=s.match(WD);if(m&&!PART.test(s))W.push({round:P+(i+2),q:s,ref:m[1].replace(/\s+/g,' '),re:new RegExp(m[1].replace(/\s+/g,'\\s+')+'(?![\\d:])')});}});
  if(!W.length)continue;let hd='?';
  for(const line of String(F[r[2]]||'').split(/\n+/)){const h=line.match(/(?:--\s*|\bLINK\s+|^[\s>#*]*)([CD])(\d)\b/);if(h&&h[1]===sd[0]&&/^[\s>#*]*(?:#|\*\*|ANSWER|LINK|[CD]\d)/.test(line))hd=h[2];
   const L=st(line),ss=L.split(SE);
   for(const w of W){if(cap<=0)break;if(!w.re.test(L))continue;const lead=w.re.test(ss[0])&&ss[0].length<60;
    for(let j=0;j<ss.length;j++){const s=ss[j];if(!SUP.test(s)||NEG.test(s))continue;if(!w.re.test(s)&&!(lead&&j===1))continue;const cq=lead&&j===1?ss[0]+' '+s:s,key=nq(w.q)+'|'+nq(cq);if(seen.has(key))continue;seen.add(key);cap--;
     const lm=s.match(new RegExp('\\b'+sd[0]+'(\\d)\\b'));const n=lm?lm[1]:hd;
     out.push({id:'X'+(++k),side:sd,by:'the code (pkgWVR)',kind:'LINK',n,earlier_round:w.round,earlier_q:w.q,closing_round:P+'4',closing_q:cq,why:'the code found that ['+w.round+'] withdrew '+w.ref+' or stopped resting on it, and the close cites it again as a footing'+(n==='?'?' (name the link)':' of LINK '+n)+'; decide whether the close rests again on what the earlier line gave up'});break;}}}}
 return out;};
