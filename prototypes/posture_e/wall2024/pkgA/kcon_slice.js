// WALL-2024 package A, K-CON (Commitment 10, TRIAL): each WITHDRAWN PREMISE REASSERTED mark (K-W, AUDIT v31, check 2) must be captured
// in the judge's own text: a CONTRADICTION line, a NOT HELD line, or a REASSERTED IN line that quotes the later sentence (6 or more
// consecutive words of it). A mark not captured is recorded against the seat. It removes no seat and changes no count.
function kconLines2024(text,wpItems){const items=[],marks=[];if(typeof text!=='string'||!text.trim()||!wpItems||!wpItems.length)return {items,marks};
 let T=text;{const s=T.trim();if(s[0]==='{'){const i=s.lastIndexOf('}');try{const j=JSON.parse(s.slice(0,i+1));if(j&&typeof j.reasoning==='string')T=j.reasoning;}catch(e){}}}
 const nw=s=>String(s||'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(Boolean);
 const lines=T.replace(/[*_`]+/g,'').split('\n').filter(l=>/^\s*(?:[-•>]|\d+[.)])?\s*(CONTRADICTION\b|NOT HELD\b|REASSERTED IN\b|CONTRADICTIONS:\s*NONE FOUND)/i.test(l));
 const none=lines.some(l=>/CONTRADICTIONS:\s*NONE FOUND/i.test(l));
 for(const x of wpItems){const m=String(x.line||'').match(/^\[(\w+)\][^"]*"([^"]*)"/);if(!m)continue;const rk=m[1],w=nw(m[2]);
  const runs=[];for(let i=0;i+6<=w.length;i++)runs.push(w.slice(i,i+6).join(' '));
  const cap=lines.some(l=>{if(/CONTRADICTIONS:\s*NONE FOUND/i.test(l))return false;const lw=' '+nw(l).join(' ')+' ';return runs.some(r=>lw.includes(' '+r+' '));});
  if(cap)continue;const id=x.link||'';
  items.push({rule:'K-CON',side:x.side,link:id,line:'['+rk+'] '+(none?'CONTRADICTIONS: NONE FOUND was written, but ':'')+'the engine marked a withdrawn premise reasserted, and no CONTRADICTION, NOT HELD or REASSERTED IN line of this judge quotes it: "'+m[2].slice(0,200)+'"'});
  marks.push('[AUDIT v32: CONTRADICTION NOT CAPTURED (K-CON; Commitment 10) -- '+id+': '+(none?'NONE FOUND written where the engine found one; ':'')+'"'+m[2].replace(/[\[\]"]/g,'').slice(0,200)+'"; the judge answers CONTRADICTION, NOT HELD with a quote, or REASSERTED IN with the quote. TRIAL rule: it removes no seat. REVIEW THIS ROW.]');}
 return {items,marks};}
