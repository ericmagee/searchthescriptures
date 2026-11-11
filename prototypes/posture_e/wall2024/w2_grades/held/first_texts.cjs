// W2 study: each judge's FIRST text (Panel Judge N) -- collision grades, verdict, keystone; per stored execution
const fs=require('fs');const W='/mnt/project-files/wall2024/';
for(const id of (process.argv[2]||'34626 34703 34726 34780').split(' ')){const d=JSON.parse(fs.readFileSync(W+'ex'+id+'_full.json','utf8'));const rd=(d.data||d).resultData.runData;
 const prep=(rd['Panel Judges Prep']||[{}])[0];const seats=prep.data?prep.data.main[0].map(x=>x.json.seat):[];
 console.log('\n######',id,'seats',seats.join(','));
 for(let i=1;i<=3;i++){const r=rd['Panel Judge '+i+' openrouter'];if(!r){console.log(' judge',i,'no run');continue;}const t=r[0].data.main[0][0].json.choices[0].message.content;fs.writeFileSync(`first_${id}_${seats[i-1]||i}.txt`,t);
  const L=t.split('\n').map(l=>l.replace(/[*_`]/g,'').trim());const col=L.filter(l=>/^D\d+\s+vs\.?\s+C\d+\b.*:\s*(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|STANDS|UNDERDETERMINED|BOTH)/i.test(l)).map(l=>{const m=l.match(/^(D\d+\s+vs\.?\s+C\d+)[^:]*:\s*([A-Z ]+?)(?:\s*[-.(;]|$)/);return m?m[1]+'='+m[2].trim():l.slice(0,40)});
  const v=L.filter(l=>/^(RESULT|VERDICT|KEYSTONE|CHAIN)/i.test(l)).map(l=>l.slice(0,110));
  console.log(' judge',i,seats[i-1],'| chars',t.length,'\n   COL:',col.join('; '),'\n   ',v.join('\n    '));}}
