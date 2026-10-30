const fs=require('fs');let c=fs.readFileSync('pwl.js','utf8');
c=c.replace("return {ledger,","globalThis.__refs=refs;return {ledger,").replace('const PWL=','globalThis.PWL=');const LF='\n';eval(c);
for(const f of ['claude_r1.txt','claude_r2.txt','engine_r3.txt']){const t=fs.readFileSync(f,'utf8');
 for(const r of __refs(t)){if(r.book)continue;const i=t.indexOf(r.label.split(/[-–]/)[0]);console.log(f,'| bare',r.label,'-> ctx',r.ctx,'|',JSON.stringify(t.slice(Math.max(0,i-70),i+15)));}}
