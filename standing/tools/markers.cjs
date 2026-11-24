// W4 helper (ASK 596): for each library line index of a reference engine, find a short substring that stands once in every given engine's library.
const lp=require('/mnt/project-files/ask588/w4/build/libpatch.js');const fs=require('fs');
const [ref,...others]=process.argv[2].split(',');const idx=process.argv[3].split(',').map(Number);
const Ls=[ref,...others].map(f=>lp.cut(JSON.parse(fs.readFileSync(f,'utf8'))).L);
const once=(L,s)=>{let n=0;for(const l of L){let j=-1;while((j=l.indexOf(s,j+1))>=0){n++;if(n>1)return false;}}return n===1;};
const out={};for(const i of idx){const l=Ls[0][i];let best=null;
 for(const len of [40,60,80,120,160])for(let o=0;o+len<=l.length&&!best;o+=7){const s=l.slice(o,o+len);if(/^\s|\s$/.test(s))continue;if(Ls.every(L=>once(L,s)))best=s;}
 out[i]=best;console.error(i,best?JSON.stringify(best):'NONE');}
console.log(JSON.stringify(out));
