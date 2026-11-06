// WALL-2024 package B (operator 2026-11-05: the agreement shown back before every decision; B1 amended to the walker form, W3 2121).
// The seat's own acceptance reply is read from the head exchange of its own conversation (the assistant turn after "POSTURE FOR
// ACCEPTANCE" or "POSTURE RETURNED") and shown back at the END of the final user message. The system message and the head exchange,
// the cached prefix, are not touched. A body with no accepted exchange is left as it is.
const __AGR_TXT=c=>typeof c==='string'?c:Array.isArray(c)?c.map(p=>p&&typeof p.text==='string'?p.text:'').join(''):'';
function __agrTail(msgs){if(!Array.isArray(msgs))return '';let acc=null;
 for(let i=0;i+1<msgs.length;i++){const m=msgs[i],r=msgs[i+1];if(!m||!r)continue;const ut=m.role==='user'?__AGR_TXT(m.content!==undefined?m.content:m.parts):'';
  if(/^POSTURE (FOR ACCEPTANCE|RETURNED)/.test(ut)&&(r.role==='assistant'||r.role==='model'))acc=__AGR_TXT(r.content!==undefined?r.content:r.parts);}
 if(!acc||!acc.trim())return '';
 return '\n\nTHE AGREEMENT YOU ACCEPTED, shown back before this decision. Your own words when you accepted the posture:\n'+acc.trim().split('\n').map(l=>'> '+l).join('\n')
  +'\nEach contested grade you write (BROKEN, FORCED, MISSES, VOID, UNPROVEN) names the commitment it applies, as "(Commitment N)".\nThe reply form given above is unchanged; answer in it.';}
const __AGR_SB=(items)=>{const seen=new WeakSet();const walk=(o,d)=>{if(!o||typeof o!=='object'||d>7||seen.has(o))return;seen.add(o);
 if(Array.isArray(o.messages)&&typeof o.model==='string'){const m=o.messages;const tail=__agrTail(m);if(tail){for(let i=m.length-1;i>=0;i--){if(m[i]&&m[i].role==='user'){const c=m[i].content;if(typeof c==='string'){if(!c.includes('THE AGREEMENT YOU ACCEPTED, shown back'))m[i].content=c+tail;}else if(Array.isArray(c)){if(!c.some(p=>String(p&&p.text||'').includes('THE AGREEMENT YOU ACCEPTED, shown back')))c.push({type:'text',text:tail});}break;}}}}
 else if(Array.isArray(o.contents)&&o.systemInstruction){const m=o.contents;const tail=__agrTail(m);if(tail){for(let i=m.length-1;i>=0;i--){if(m[i]&&m[i].role==='user'&&Array.isArray(m[i].parts)){if(!m[i].parts.some(p=>String(p&&p.text||'').includes('THE AGREEMENT YOU ACCEPTED, shown back')))m[i].parts.push({text:tail});break;}}}}
 for(const k of Object.keys(o))walk(o[k],d+1);};(items||[]).forEach(it=>walk(it&&it.json,0));return items;};
