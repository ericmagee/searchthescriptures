/* pkgEAX (W3 grade_33389 fault 2; W1 check Wall 2900): an E-ANS DISAGREE (right: MISSES) whose reason calls the answer a grant ("only grants",
   "only says", "is only", "bare grant") (or says it gives no fit, or only restates) is HELD when the layered answer that holds the quoted words, in the round the item names, carries 3 or more
   distinct [Ln] tags, or 1 or more [Ln] tags and a fit sentence ("fits", or a "So ..." sentence) after the quoted words. A reason that names another defect (omits, ignores, nowhere, repeats or concedes the press) is never held. When the round holds the item's own "ANSWER: <verse>" block with 3+ tags, that block decides. When the block's header does not name the item's verse, the fit sentence must follow the quoted words on their own line. The quoted words must run 5+ words in that round, and the answer block must name the item's verse. Read from the round text. */
function eaxHold(why,item,RR){const w=String(why||'');
 if(!/\b(?:only|merely|bare|just)\b[^.]{0,40}\bgrant|\bgrants?\b[^.]{0,60}\b(?:only|no fit|giving no|shows no|with no)\b|\b(?:says|is)\s+only\s+["“]|\banswer is only\b|\b(?:giving|gives|shows?|with)\s+no\s+fit\b|\bno\s+fit\s+(?:is\s+)?shown\b|\bonly\s+restates\b/i.test(w))return null;
 if(/\b(?:omits?|omitted|ignores?|nowhere|leaves?\s+(?:out|unanswered)|does\s+not\s+(?:answer|address|meet|touch)|repeats?|verbatim|concedes?|withdraw(?:s|n|al)?|drops?|dropped|press(?:ed)?)\b/i.test(w))return null; /* a reason naming another defect is DeepSeek's to send */
 const rm=String(item||'').match(/\[((?:CR|DR)[1-4])\]/);if(!rm||!RR)return null;const T=String(RR[rm[1]]||'');if(!T)return null;
 const vm=String(item).match(/ANSWER CHECK (.+?) \[/);const verse=vm?vm[1].trim():'';
 const norm=s=>String(s).toLowerCase().replace(/\[[^\]]*\]/g,' ').replace(/[^a-z0-9:\s]/g,' ').split(/\s+/).filter(Boolean);
 const qs=[...w.matchAll(/["“]([^"”]{8,300})["”]/g)].map(m=>norm(m[1])).filter(q=>q.length>=5);if(!qs.length)return null;
 const L=T.split('\n');const isLay=l=>/^\s*[-*]\s*\[L[1-4]\]/.test(l);
 const blockAt=k=>{let a=k,b=k;if(isLay(L[k])){while(a>0&&isLay(L[a-1]))a--;if(a>0&&L[a-1].trim()&&!isLay(L[a-1]))a--;while(b+1<L.length&&isLay(L[b+1]))b++;}return {a,b};};
 const cands=[];
 for(let k=0;k<L.length;k++){const lw=norm(L[k]);if(!lw.length)continue;const ls=' '+lw.join(' ')+' ';
  for(const q of qs){let hit=null;for(let n=Math.min(q.length,12);n>=5;n--){for(let s=0;s+n<=q.length;s++){const run=q.slice(s,s+n).join(' ');if(ls.includes(' '+run+' ')){hit=run;break;}}if(hit)break;}
   if(hit){cands.push({k,hit});break;}}}
 const own=(()=>{const vref=verse.toLowerCase();if(!vref)return null;for(let k=0;k<L.length;k++){if(!/\banswer\s*:/i.test(L[k])||!L[k].toLowerCase().includes(vref))continue;let b=k;while(b+1<L.length&&isLay(L[b+1]))b++;const tg=new Set([...L.slice(k,b+1).join('\n').matchAll(/\[L([1-4])\]/g)].map(m=>m[1]));if(tg.size>=3)return {k,b,tg};}return null;})();
 const ownNote=o=>'the item\'s own answer block (ANSWER: '+verse+') in '+rm[1]+' carries ['+[...o.tg].sort().map(x=>'L'+x).join('], [')+'], so it is not a bare grant';
 if(!cands.length)return own?ownNote(own):null;
 const vref=verse.toLowerCase();const scored=cands.map(c=>{const {a,b}=blockAt(c.k);const head=L[a].toLowerCase();return {...c,a,b,pref:!!vref&&(head.includes('answer: '+vref)||head.includes(vref))};});
 const cv=(verse.match(/\d+:\d+/)||[''])[0];const inBlk=x=>{const t=L.slice(x.a,x.b+1).join('\n').toLowerCase();return !!vref&&(t.includes(vref)||(!!cv&&new RegExp('(^|[^0-9])'+cv.replace(':','\\:')+'([^0-9]|$)').test(t)));};const c=scored.find(x=>x.pref)||scored.find(inBlk);if(!c)return own?ownNote(own):null;
 const blk=L.slice(c.a,c.b+1).join('\n');const tags=new Set([...blk.matchAll(/\[L([1-4])\]/g)].map(m=>m[1]));
 const after=L.slice(c.k,c.b+1).join('\n');const at=after.toLowerCase().replace(/[^a-z0-9:\s]/g,' ').replace(/\s+/g,' ').indexOf(c.hit);
 const tail=at>=0?after.toLowerCase().replace(/[^a-z0-9:\s]/g,' ').replace(/\s+/g,' ').slice(at+c.hit.length):'';
 const fit=/\bfits?\b/.test(tail)||/(?:^|\s)so\s+\S+(?:\s+\S+){3,}/.test(tail);
 if(!c.pref&&own)return ownNote(own);
 if(!c.pref){const ql=L[c.k].toLowerCase().replace(/[^a-z0-9:\s]/g,' ').replace(/\s+/g,' ');const qi=ql.indexOf(c.hit);const qt=qi>=0?ql.slice(qi+c.hit.length):'';if(!(/\bfits?\b/.test(qt)||/(?:^|\s)so\s+\S+(?:\s+\S+){3,}/.test(qt)))return null;return 'the answer line holding the quoted words in '+rm[1]+' goes on with a fit sentence after them, inside a layered block of '+tags.size+' tag(s), so it is not a bare grant';}
 if(tags.size>=3||(tags.size>=1&&fit))return 'the answer holding the quoted words in '+rm[1]+' carries '+(tags.size?'['+[...tags].sort().map(x=>'L'+x).join('], [')+']':'no layer tag')+(fit?' and a fit sentence after them':'')+', so it is not a bare grant';
 return null;}
