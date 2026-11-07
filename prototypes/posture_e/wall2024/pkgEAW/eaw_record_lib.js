/* pkgEAW (W3 2844) record half: an E-ANS DISAGREE with right MISSES whose reason says the answer is "only" a quoted X, where the answer block in the round
   goes on past X with a layer tag or with 12 or more words, is HELD: written "ENFORCER HELD (pkgEAW, not sent ...)", which the send-back filter
   (^ENFORCER DISAGREE|NO ANSWER) does not send. A bare "I grant it." with nothing after it is still sent. Rows of other rules are untouched. */
const EAW_STATUS='LIVE';
function eawHoldWhy(why,blk){if(!blk)return null;const m=String(why).match(/\b(?:says|states|gives|offers|grants|is)\s+only\s+["\u201c']([^"\u201d]{1,200}?)["\u201d'](?=[\s.,;:)]|$)|\bonly\s+(?:says|states|grants)\s+["\u201c']([^"\u201d]{1,200}?)["\u201d'](?=[\s.,;:)]|$)/i);if(!m)return null;
 const q=String(m[1]||m[2]).trim().replace(/[.,;:]+$/,'');if(q.length<2)return null;const lb=blk.toLowerCase();const at=lb.indexOf(q.toLowerCase());if(at<0)return null;
 const after=blk.slice(at+q.length);const lay=[...new Set(after.match(/\[L[1-4]\]/g)||[])];const words=after.replace(/[^A-Za-z\u00C0-\u024F0-9]+/g,' ').trim().split(' ').filter(Boolean).length;
 if(!lay.length&&words<12)return null;return 'the push says the answer is only "'+q+'", but the answer under the pressed verse goes on'+(lay.length?' with '+lay.join(', ')+',':'')+' '+words+' more words';}
