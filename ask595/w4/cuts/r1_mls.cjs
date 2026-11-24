// W1 R1 (Wall 11490): on runs 37203, 41822, 42071, how many MEANS blocks the reader returns over 1,500 characters, and whether any pkgMLS result can differ.
// mlsBlock's block starts at any line holding the quotation and takes up to 7 following lines (its own stop rule). Every start line of every round is measured, so no call can return more than the largest block found.
const fs=require('fs');const R={};
for(const r of ['37203','41822'])R[r]=JSON.parse(fs.readFileSync('/mnt/project-files/ask590/w4/build/data/rounds_'+r+'.json','utf8'));
R['42071']=JSON.parse(fs.readFileSync('/mnt/project-files/ask586/w4/build/data/rounds_42071.json','utf8'));
const STOP=/^\s*(?:\d+[.)]\s|MEANS\b|LINK\s+\d|(?:[1-3] )?[A-Z][a-z]+ \d{1,3}:\d{1,3}\s*["“])/;
for(const [run,rounds] of Object.entries(R)){let n=0,over=0,max=0,meansOver=0,meansN=0;const ex=[];
 for(const [k,t] of Object.entries(rounds)){if(typeof t!=='string')continue;const L=t.split('\n');
  for(let i=0;i<L.length;i++){if(!L[i].trim())continue;const out=[L[i]];for(let j=i+1;j<L.length&&j<i+8;j++){const l=L[j];if(!l.trim()||STOP.test(l))break;out.push(l);}const b=out.join('\n');n++;if(b.length>max)max=b.length;if(b.length>1500){over++;ex.push(k+' line '+(i+1)+' ('+b.length+')');}
   if(/MEANS\s*\[/.test(L[i])||/"[^"]{8,}"/.test(L[i])){meansN++;if(b.length>1500)meansOver++;}}}
 console.log(run+': rounds '+Object.keys(rounds).length+'; start lines measured '+n+'; largest block '+max+'; blocks over 1,500: '+over+(ex.length?' ('+ex.slice(0,6).join(', ')+')':'')+'; of start lines holding a quotation: '+meansN+', over 1,500: '+meansOver);}
// Can a result differ? mlsCarried reads only the block's [L2] entries and [L3] references. A result can change only where a block over 1,500 holds an [L2] or [L3] that starts after character 1,500.
for(const [run,rounds] of Object.entries(R)){let can=0;const ex=[];for(const [k,t] of Object.entries(rounds)){if(typeof t!=='string')continue;const L=t.split('\n');
 for(let i=0;i<L.length;i++){if(!L[i].trim())continue;const out=[L[i]];for(let j=i+1;j<L.length&&j<i+8;j++){const l=L[j];if(!l.trim()||STOP.test(l))break;out.push(l);}const b=out.join('\n');if(b.length<=1500)continue;
  const tail=b.slice(1500);const head=b.slice(1490,1500);if(/\[L[23]\]/.test(head+tail)){can++;ex.push(k+' line '+(i+1));}}}
 console.log(run+': blocks over 1,500 with an [L2] or [L3] after the cut: '+can+(ex.length?' ('+ex.slice(0,8).join(', ')+')':''));}
