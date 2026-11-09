function knlNone2024(l){const s=String(l==null?'':l).replace(/[*_`]+/g,'').trim().replace(/^(?:[-•>]|\d+[.)])\s*/,'');const m=s.match(/^FORCED(?:\s+(?:LINES?|LINKS?))?(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:\s*(.*)$/i);if(!m)return false;let r=m[1].trim(); /* pkgKNL; rev 4 (W1 3790): the FORCED LINES / FORCED LINKS head */
 r=r.replace(/^[-–—:\s]+/,''); /* rev 4: a leading dash */
 /* rev 5 (W3 3831, W4 3829): a closing parenthesis is accepted only when the whole of it is one fixed form; anything else makes the line a checked FORCED line */
 const PAR=/^\s*(?:Commitment\s+\d+|(?:no|none|nothing|not\s+any)(?:\s+(?:of\s+the\s+)?(?:links?|lines?|collisions?|premises?))?(?:\s+(?:is|are))?(?:\s+graded)?(?:\s+(?:forced|broken|link\s+broken|graded(?:\s+(?:forced|broken))?))?)\s*\.?\s*$/i;
 for(let k=0;k<3;k++){const p=r.match(/^(.*?)\s*\(([^()]*)\)\s*\.?\s*$/);if(!p||!p[1].trim())break;if(!PAR.test(p[2]))return false;r=p[1].trim();} /* rev 4: a closing parenthesis that names no link, round or quote and only says nothing is graded */
 r=r.replace(/\s*\.\s*$/,'');
 return /^(?:none|nil|n\/a|no|nothing|zero|0)(?:\s+(?:graded|forced|links?\s+(?:is\s+|are\s+)?(?:graded\s+)?(?:graded|forced)))?$/i.test(r)
  ||/^none\s+of\s+(?:the\s+)?(?:collisions?|collision\s+(?:points?|lines?)|links?|lines?)(?:\s+(?:is|are)\s+(?:graded\s+)?forced)?$/i.test(r)
  ||/^(?:there\s+(?:are|is)\s+)?no\s+(?:forced\s+)?(?:links?|lines?|collisions?|collision\s+(?:points?|lines?))(?:\s+(?:is|are)\s+(?:graded\s+)?forced)?$/i.test(r);} /* rev 3 (W3 3576): an allow-list; rev 4 (W1 3790) adds: none of the collisions/links/lines, there are no forced links, a leading dash, a nothing-graded parenthesis, the FORCED LINES head */
