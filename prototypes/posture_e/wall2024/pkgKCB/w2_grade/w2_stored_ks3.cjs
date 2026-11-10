// W2: every stored K-S3 RESPONSE line in stored cure calls (first call and follow-up calls): how many start with COUNTED, and what KCB would read.
const fs=require('fs');const IN='/mnt/project-files/wall2024/inputs';let n=0,c=0;const ex=[];const files=fs.readdirSync(IN).filter(f=>/Cure_Call|FUM|Send_Back_Call|Alt_Cure/.test(f));
const seen=new Set();for(const f of files){const t=fs.readFileSync(IN+'/'+f,'utf8');const re=/RESPONSE:\s*K-S3[^|\n]*\|\s*([^\n\\]*)/g;let m;while((m=re.exec(t))){const k=f.split('_')[0]+'|'+m[0];if(seen.has(k))continue;seen.add(k);n++;if(/^\W*COUNTED\b/i.test(m[1])){c++;ex.push(f+': '+m[1].slice(0,120));}}}
console.log(files.length+' stored call files; '+n+' distinct K-S3 RESPONSE lines; '+c+' open with COUNTED');ex.forEach(x=>console.log('  '+x));
