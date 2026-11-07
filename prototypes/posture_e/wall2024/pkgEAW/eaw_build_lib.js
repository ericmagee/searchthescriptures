/* pkgEAW (W3 2844; Eric 08:19 CST 11-07): the whole answer to a pressed verse, read from the round itself. The E-ANS item gave DeepSeek only the judge's
   quotation of the answer ("I grant it."), so DeepSeek graded the opening grant and never saw the [L2]/[L4] lines under it (33311: 47 "says only" pushes).
   eawBlock finds the pressed verse's answer block in the listed round: the line that opens with the verse (or a "- **verse**" bullet, or a paragraph
   that starts there), and every line after it up to a blank line, a LINK heading, or the next bullet at the same indent (when the block opens on a bullet; otherwise the next "- **" press bullet). The block is used
   only when the judge-quoted answer's opening words are inside it; otherwise the item is built as before. */
function eawBlock(R,rks,verse,answer){if(!R||!verse)return null;const NN=s=>String(s||'').toLowerCase().replace(/[\u201c\u201d"\u2019\u2018'*_`\[\]]/g,'').replace(/\s+/g,' ').trim();
 const m0=String(verse).trim().match(/^((?:[1-3]\s)?[A-Za-z][A-Za-z ]*?\s\d+:\d+)/);if(!m0)return null;
 const esc=m0[1].replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/ /g,'\\s+');const re=new RegExp('(?:^|[^0-9:A-Za-z])'+esc+'(?![0-9])');const reHead=new RegExp('^\\s*(?:[-*]\\s+)?\\**\\s*'+esc+'(?![0-9])');
 const aw=NN(answer).split(' ').slice(0,6).join(' ');
 for(const rk of rks){const t=R[rk];if(typeof t!=='string')continue;const L=t.split('\n');
  for(let i=0;i<L.length;i++){if(!re.test(L[i]))continue;const bul=/^\s*[-*]\s+\*\*/.test(L[i]);if(!(bul||reHead.test(L[i])||i===0||!L[i-1].trim()))continue;
   const ind=(L[i].match(/^\s*/)||[''])[0].length;const sb=/^\s*[-*]\s+/.test(L[i]); /* a block that opens on a bullet ends at the next bullet at its indent */const out=[L[i]];
   for(let j=i+1;j<L.length;j++){const l=L[j];if(!l.trim())break;if((sb?/^\s*[-*]\s+/:/^\s*[-*]\s+\*\*/).test(l)&&(l.match(/^\s*/)||[''])[0].length<=ind)break;if(/^\s*(?:#{1,6}\s|\*\*LINK\b|LINK\s+\d)/i.test(l))break;out.push(l);}
   const b=out.join('\n');if(aw&&!NN(b).includes(aw))continue;return {rk,t:b};}}return null;}
