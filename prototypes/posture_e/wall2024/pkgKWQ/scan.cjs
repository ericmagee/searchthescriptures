// every stored line holding REASSERTED IN: live kwRe against candidate
const fs=require('fs');const o=t=>/\bREASSERTED\s+IN\s+\[?[CD]R\d+\]?\s*(?:[:,]|--|—)?\s*["“][^"”]{6,}["”]/i.test(t);
const n=t=>/\bREASSERTED\s+IN\s+\[?[CD]R\d+\]?\s*(?:[:,]|--|—)?\s*["“'‘][^"”]{6,}["”'’]/i.test(t);
let k=0,a=0,b=0;const d=[];const seen=new Set();
const add=(id,t)=>{for(const l of String(t||'').split(/\\n|\n/)){if(!/REASSERTED\s+IN/i.test(l))continue;const key=l.trim();if(seen.has(key))continue;seen.add(key);k++;const x=o(l),y=n(l);a+=x;b+=y;if(x!==y)d.push(id+': '+l.slice(0,300));}};
for(const l of fs.readFileSync('corpus/texts.jsonl','utf8').split('\n'))if(l.trim()){const r=JSON.parse(l);add(r.run+' '+r.seat+' '+r.src,r.jtext||r.text);}
for(const e of '33149 33371 33490 34299 34626 34703 34726'.split(' ')){const s=fs.readFileSync('/mnt/project-files/wall2024/ex'+e+'_full.json','utf8').replace(/\\\\+"/g,'"').replace(/\\\\+n/g,'\n');add(e,s);}
console.log('distinct REASSERTED IN lines',k,'read live',a,'read candidate',b,'differ',d.length);d.forEach(x=>console.log(' ',x));
