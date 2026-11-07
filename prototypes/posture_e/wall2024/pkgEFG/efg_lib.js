/* pkgEFG (W3 2873 D6): a FORCED line breaks a link by meaning only when its MEANS quote is the pressing side's own words. Code check: take the MEANS
   quote, remove its inner quoted spans and any verse text the line quotes under CARRIED BY or GROUND; at least 6 consecutive words of what is left must
   stand in the named round's own prose (the round's quoted spans removed). Returns null (passes, or the line cannot be parsed) or a note. */
function efgWords(s){return String(s||'').toLowerCase().replace(/[‘’']/g,'').replace(/[^a-z0-9Ͱ-Ͽ֐-׿À-ɏ]+/g,' ').trim().split(' ').filter(Boolean);}
function efgRun(a,b){let best=0;const m=b.length;let prev=new Array(m+1).fill(0);for(let i=1;i<=a.length;i++){const cur=new Array(m+1).fill(0);for(let j=1;j<=m;j++)if(a[i-1]===b[j-1]){cur[j]=prev[j-1]+1;if(cur[j]>best)best=cur[j];}prev=cur;}return best;}
function efgCheck(line0,RR){const l=String(line0||'').replace(/\\+"/g,'"').replace(/[“”]/g,'"');if(!/^FORCED/.test(l)||!RR)return null;
 const m=l.match(/MEANS\s*\[\s*(?:([CD])R\s*(\d)|(Defender|Challenger)\s*R(?:ound)?\s*(\d))\s*\]\s*:\s*"([\s\S]*?)"\s*--\s*ANSWER/);if(!m)return null;
 const rk=(m[1]||(m[3]==='Defender'?'C':'D'))+'R'+(m[2]||m[4]);const rt=RR[rk];if(!rt)return null;
 const tail=(l.match(/--\s*CARRIED BY\s*:([\s\S]*)$/)||l.match(/--\s*GROUND\s*:([\s\S]*)$/)||[])[1]||'';const verses=[];tail.replace(/"([^"]{8,})"/g,(z,a)=>{verses.push(efgWords(a).join(' '));return z;});
 let q=' '+efgWords(m[5].replace(/"[^"]*"/g,' | ')).join(' ')+' ';for(const v of verses)if(v.split(' ').length>=3)q=q.split(' '+v+' ').join(' | ');
 const segs=q.split('|').map(s=>s.trim().split(' ').filter(Boolean)).filter(s=>s.length>=6);
 const rw=efgWords(String(rt).replace(/\\+"/g,'"').replace(/"[^"\n]*"/g,' | ').replace(/“[^”\n]*”/g,' | '));let best=0;
 for(const s of segs){best=Math.max(best,efgRun(s,rw));if(best>=6)return null;}
 return 'the MEANS quote, its verse words removed, has no run of 6 words standing in ['+rk+'] as that side\'s own words (longest '+best+'); a FORCED line whose MEANS is a verse re-quoted, not the pressing sentence of a round, breaks nothing';}
