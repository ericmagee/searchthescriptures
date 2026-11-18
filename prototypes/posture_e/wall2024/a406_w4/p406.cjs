// ASK 406 patch to L2 Gloss Plan PART B (record-only): read a quoted gloss after word (Gnnnn) when the parentheses hold the number alone, and word Gnnnn "gloss" with no parentheses.
// Today's glosses are kept first and whole, with their own de-duplication. A new-form gloss is added after them only while the list stays within 60 glosses
// and every number it names is among the 30 numbers that are read, so the caps never drop or starve one of today's glosses.
const once=(s,a,b,tag)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(tag+' count '+k);return s.replace(a,()=>b);};
module.exports=function(src){let s=src;
 s=once(s,` const gl=[],seen=new Set();`,` const gl=[],seen=new Set();const gl406=[],seen406=new Set(); /* ASK 406 (record-only; Wall 8722, 8725): glosses read only by the new forms, kept apart from today's */
 const Q406=/^\\s*[,:=]?\\s*(?:(?:meaning|means|i\\.e\\.)\\s*[,:]?\\s*)?["“]([^"”]{2,200})["”]/i;`,'A');
 s=once(s,`   if(b0){nums=[b0[1]+b0[2]];body=body.slice(b0[0].length);}`,`   let f406=false;if(b0){nums=[b0[1]+b0[2]];body=body.slice(b0[0].length);if(!body.trim()){const q=seg.slice(m.index+m[0].length).match(Q406);if(q){body=q[1].replace(/[()]/g,' ');f406=true;}}}`,'B');
 s=once(s,`   if(!parts.length||!nums.length)continue;const k=t.side+'|'+t.round+'|'+nums.join(',')+'|'+parts.join(',');if(seen.has(k))continue;seen.add(k);
   gl.push({side:t.side,round:t.round,word:left,nums,parts,seg:seg.slice(Math.max(0,m.index-20),m.index+m[0].length+10).slice(0,200)});}}`,
`   if(!parts.length||!nums.length)continue;const k=t.side+'|'+t.round+'|'+nums.join(',')+'|'+parts.join(',');const SN=f406?seen406:seen;if(SN.has(k))continue;SN.add(k);
   (f406?gl406:gl).push({side:t.side,round:t.round,word:left,nums,parts,seg:seg.slice(Math.max(0,m.index-20),m.index+m[0].length+10).slice(0,200),...(f406?{k}:{})});}
  for(const m of seg.matchAll(/([A-Za-zÀ-ɏḀ-ỿʻʼ][A-Za-zÀ-ɏḀ-ỿʻʼ'’-]{1,39})[*_]*\\s+([GH])0*(\\d{1,5})\\b[*_]*(?=\\s*[,:=]?\\s*(?:(?:meaning|means|i\\.e\\.)\\s*[,:]?\\s*)?["“])/g)){ /* ASK 406: word Gnnnn "gloss", no parentheses */
   const q=seg.slice(m.index+m[0].length).match(Q406);if(!q)continue;const left=m[1];const nums=[m[2]+m[3]];
   const parts=[...new Set(q[1].replace(/[()]/g,' ').split(/[,;\\/]|\\s+or\\s+/).map(p=>p.replace(/["“”‘’*_]/g,'').replace(/\\s+/g,' ').trim().toLowerCase().replace(/^(?:a|an|the|to)\\s+(?=\\S)/,'')).filter(p=>p&&/^[a-z][a-z' -]*[a-z]$|^[a-z]$/.test(p)&&p.split(' ').length<=4&&!GR.test(p)))];
   const FW=/^(?:a|an|the|of|to|in|on|at|by|for|from|with|into|upon|unto|out|up|down|over|under|was|were|is|are|be|been|being|he|she|it|they|him|her|his|its|their|one|oneself|self|also|therefore|and|or|as|that|which|who|whom|whose|this|these|those|own|not|no)$/;const P2=parts.filter(p=>p.split(' ').some(w=>!FW.test(w)));
   if(!P2.length)continue;const k=t.side+'|'+t.round+'|'+nums.join(',')+'|'+P2.join(',');if(seen406.has(k))continue;seen406.add(k);
   gl406.push({side:t.side,round:t.round,word:left,nums,parts:P2,seg:seg.slice(Math.max(0,m.index-20),m.index+m[0].length+q[0].length+10).slice(0,200),k});}}`,'C');
 s=once(s,` return {cand:[...cand].slice(0,40),gloss:gl.slice(0,60)};}`,` const G=gl.slice(0,60);let a406=0,d406=0;for(const g of gl406){if(seen.has(g.k))continue;const {k,...g2}=g;const N=[...new Set(G.concat([g2]).flatMap(x=>x.nums))].slice(0,30);if(G.length<60&&g2.nums.every(n=>N.includes(n))){G.push(g2);a406++;}else d406++;} /* ASK 406: the caps drop only new-form glosses */
 return {cand:[...cand].slice(0,40),gloss:G,n406:a406,d406};}`,'D');
 return s;};
