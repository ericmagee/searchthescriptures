const g=require('./gate_rows.json');const REF=/((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})(?:[-–](\d{1,3}))?/g;const S=new Set();
for(const x of g)for(const t of [x.grl,x.sbrl,x.line])for(const m of String(t||'').replace(/\\+"/g,'"').matchAll(REF)){for(let v=+m[3];v<=+(m[4]||m[3]);v++)S.add(m[1]+'|'+m[2]+'|'+v);}
console.log([...S].map(s=>{const [b,c,v]=s.split('|');return "('"+b.replace(/'/g,"''")+"',"+c+","+v+")";}).join(','));
