const fs=require('fs');
for(const f of ['fixtures/r29609_gr2l.txt','fixtures/r29609_cr3l.txt']){const it=fs.readFileSync(f,'utf8');const re=/["“]([^"“”]{8,}?)["”]/g;let m;const out=[];while((m=re.exec(it)))out.push(m[1].trim());console.log(f);out.forEach(x=>console.log(JSON.stringify(x)));}
