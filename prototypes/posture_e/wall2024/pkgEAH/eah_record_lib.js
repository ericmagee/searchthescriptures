/* pkgEAH (W3 2856) record half: an E-HOLD DISAGREE with right BROKEN whose reason calls a quoted "X" a bare grant (or says the answer is only "X"), where an
   answer block given for the item goes on past X with an [Ln] tag or 12 or more words, is HELD: "ENFORCER HELD (pkgEAH, not sent ...)", which the send-back
   filter does not send. A truly bare grant is still sent. */
function eahHoldWhy(why,blks){if(!Array.isArray(blks)||!blks.length)return null;const w=String(why);
 const m=w.match(/["“]([^"”]{1,200}?)["”]\s*,?\s+is\s+(?:only\s+)?a\s+bare\s+grant/i)||w.match(/\b(?:says|states|gives|offers|grants|is)\s+only\s+["“']([^"”]{1,200}?)["”'](?=[\s.,;:)]|$)/i);if(!m)return null;
 const q=String(m[1]).trim().replace(/[.,;:]+$/,'');if(q.length<2)return null;
 for(const blk of blks){const at=String(blk).toLowerCase().indexOf(q.toLowerCase());if(at<0)continue;const after=blk.slice(at+q.length);const lay=[...new Set(after.match(/\[L[1-4]\]/g)||[])];
  const words=after.replace(/[^A-Za-zÀ-ɏ0-9]+/g,' ').trim().split(' ').filter(Boolean).length;if(!lay.length&&words<12)continue;
  return 'the push calls "'+q+'" a bare grant, but the answer under the pressed verse goes on'+(lay.length?' with '+lay.join(', ')+',':'')+' '+words+' more words';}
 return null;}
