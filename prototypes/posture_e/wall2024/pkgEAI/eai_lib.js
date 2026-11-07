/* pkgEAI (W3 grade_33389 fault 2; Eric 08:19 CST 11-07, a DeepSeek enforcer fix every run): the answer finder's last form. eawBlock finds an answer
   under the pressed verse's own line and eawBlockMeans under a MEANS header; an answer written inline in a paragraph, or under a header whose wording
   the judge did not copy, got no block, so DeepSeek again graded the judge's short quotation ("Grant the priestly setting of Ezra 2:61") as a bare
   grant. eaiBlock finds, in the listed rounds, the paragraph (lines up to a blank line) that holds the answer's opening words, and returns it from the
   line that holds them to the paragraph's end. The opening words are the answer's first 6 words; an answer of 3 to 5 words is used only when exactly
   one paragraph of the listed rounds holds it, and an answer under 3 words is never searched. */
function eaiBlock(R,rks,answer){if(!R)return null;const NN=s=>String(s||'').toLowerCase().replace(/[“”"’‘'*_`\[\]]/g,'').replace(/\s+/g,' ').trim();
 const w=NN(answer).replace(/[.,;:!?]+$/,'').split(' ').filter(Boolean);if(w.length<3)return null;const aw=w.slice(0,6).join(' ');const hits=[];
 for(const rk of rks){const t=R[rk];if(typeof t!=='string')continue;for(const p of t.split(/\n\s*\n/)){if(!NN(p).includes(aw))continue;
   const L=p.split('\n');let k=L.findIndex(l=>NN(l).includes(aw));if(k<0){k=0;}
   /* a bullet group: start at its first bullet when the opening words sit on a later bullet, so the layers above it stay with it */
   /* a verse list (each bullet opens with its own verse, as "- **Job 14:1**, ...; - Romans 1:3, ..."): the answer is its own bullet alone, since the
      bullets after it answer other verses */
   const VR=l=>((String(l).replace(/^\s*[-*]\s+/,'').replace(/^[*_\s]+/,'').match(/^((?:[1-3]\s?)?[A-Z][a-z]+\.?\s+\d+:\d+)/)||[])[1]||'').toLowerCase();
   if(/^\s*[-*]\s+/.test(L[k])&&VR(L[k])){const vs=L.filter(l=>/^\s*[-*]\s+/.test(l)).map(VR).filter(Boolean);if(new Set(vs).size>=2){hits.push({rk,t:L[k].trim()});continue;}}
   if(/^\s*[-*]\s+/.test(L[k])){while(k>0&&/^\s*[-*]\s+/.test(L[k-1]))k--;}
   hits.push({rk,t:L.slice(k).join('\n').trim()});}}
 if(!hits.length)return null;if(w.length<6&&hits.length!==1)return null;return hits[0];}
