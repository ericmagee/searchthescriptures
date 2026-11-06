const __AGR_TXT=c=>typeof c==='string'?c:Array.isArray(c)?c.map(p=>p&&typeof p.text==='string'?p.text:'').join(''):'';
function __agrTail(msgs){if(!Array.isArray(msgs))return '';let acc=null;
 for(let i=0;i+1<msgs.length;i++){const m=msgs[i],r=msgs[i+1];if(!m||!r)continue;const ut=m.role==='user'?__AGR_TXT(m.content!==undefined?m.content:m.parts):'';
  if(/^POSTURE (FOR ACCEPTANCE|RETURNED)/.test(ut)&&(r.role==='assistant'||r.role==='model'))acc=__AGR_TXT(r.content!==undefined?r.content:r.parts);}
 if(!acc||!acc.trim())return '';
 return '\n\nTHE AGREEMENT YOU ACCEPTED, shown back before this decision. Your own words when you accepted the posture:\n'+acc.trim().split('\n').map(l=>'> '+l).join('\n')
  +'\nEach contested grade you write (BROKEN, FORCED, MISSES, VOID, UNPROVEN) names the commitment it applies, as "(Commitment N)".\nThe reply form given above is unchanged; answer in it.';}
