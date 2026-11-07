/* pkgEAH (W3 2856): the E-HOLD item shows DeepSeek the judge's own ANSWER CHECK lines, whose ANSWER is the judge's quotation ("I grant the address and the
   ground."), so DeepSeek called a grant followed by [L2]-[L4] lines "a bare grant" (33311 13300, 13301, 13305, 13310; 33345 14031, 14033). Each such ANSWER
   CHECK line now carries THE ANSWER IN FULL from the round (eawBlock, the same gate as pkgEAW: a grant or a quoted answer under 60 characters, and the
   round says more). The blocks found go on the item's id (eah_blk, an array) for the record check. */
/* The challenger's rounds also use a third form: a header "**MEANS [CR3] P5.4: "<the press meaning>"**", a blank line, then the answer's bullets
   (33345 [DR3], "I grant the voice."). eawBlockMeans finds the header by the press meaning and takes the bullets up to the next blank line. */
function eawBlockMeans(R,rks,means,answer){const NN=s=>String(s||'').toLowerCase().replace(/[\u201c\u201d"\u2019\u2018'*_`\[\]]/g,'').replace(/\s+/g,' ').trim();
 const mk=NN(means).slice(0,60);const aw=NN(answer).split(' ').slice(0,6).join(' ');if(mk.length<12)return null;
 for(const rk of rks){const t=R&&R[rk];if(typeof t!=='string')continue;const L=t.split('\n');
  for(let i=0;i<L.length;i++){if(!/\bMEANS\b/.test(L[i])||!NN(L[i]).includes(mk))continue;let j=i+1;while(j<L.length&&!L[j].trim())j++;const out=[];
   for(;j<L.length;j++){const l=L[j];if(!l.trim())break;if(/^\s*(?:#{1,6}\s|\*\*LINK\b|LINK\s+\d|---)/i.test(l)||/\bMEANS\b/.test(l)&&/^\s*\*\*/.test(l))break;out.push(l);}
   const b=out.join('\n');if(!b||(aw&&!NN(b).includes(aw)))continue;return {rk,t:b};}}return null;}
const eahFull=a=>{const m=String(a).match(AC);if(!m)return null;const ans=m[4];if(!(/^\s*(?:i\s+grant|i\s+concede|i\s+accept|granted)\b/i.test(N(ans))||N(ans).length<60))return null;
 const __rk=m[2].split(/\s*[;,]\s*/);const b=eawBlock(R,__rk,m[1],ans)||eawBlockMeans(R,__rk,m[3],ans);if(!b||N(b.t).length<=N(ans).length+60)return null;return b;};
const eahLine=(a,acc)=>{const b=eahFull(a);if(!b)return '';acc.push(b.t.slice(0,3000));const L=b.t.split('\n');return '\n  THE ANSWER IN FULL, FROM ['+b.rk+'] (every line under that pressed verse, its layers included): "'+cut((L.length>1&&/The press\b/i.test(L[0])?L.slice(1):L).join('\n'),900)+'"';};
