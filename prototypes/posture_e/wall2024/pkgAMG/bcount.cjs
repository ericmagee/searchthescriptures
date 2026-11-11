// For every judge text in the exports' final merge output carrying "N collision line(s) stand graded CHALLENGER LINK BROKEN", count the collision lines in that same text graded CHALLENGER LINK BROKEN.
const fs=require('fs');const W='/mnt/project-files/wall2024/';
const strs=o=>typeof o==='string'?[o]:o&&typeof o==='object'?Object.values(o).flatMap(strs):[];
let tot=0,stale=0;const seen=new Set();
for(const f of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const rd=JSON.parse(fs.readFileSync(W+f,'utf8')).data.resultData.runData;
 for(const n of Object.keys(rd))for(const s of strs(rd[n])){const m=s.match(/(\d+) collision line\(s\) stand graded CHALLENGER LINK BROKEN/);if(!m)continue;
  const lines=s.split(/\\n|\n/).filter(l=>/^\s*[*_]*D\d+\s*vs\.?\s*C\d+\b[^\n]*?:\s*[*_]*CHALLENGER LINK BROKEN/.test(l));const key=f+'|'+s.slice(0,300)+'|'+m[1]+'|'+lines.length;if(seen.has(key))continue;seen.add(key);tot++;
  if(+m[1]!==lines.length){stale++;console.log(f.slice(2,7),n.padEnd(24),'text says',m[1],'| lines in the same text',lines.length,'|',lines.map(l=>l.trim().slice(0,30)).join(' ; '));}}}
console.log('texts',tot,'mismatch',stale);
