const fs=require('fs');let c=fs.readFileSync('pwl.js','utf8');
c=c.replace("return {ledger,","globalThis.__refs=refs;return {ledger,").replace('const PWL=','globalThis.PWL=');const LF='\n';eval(c);
for(const s of ['[L1] Matthew 1:24–25: “Then Joseph','[L1] Matthew 1:24–25 “Then Joseph','[L1] Matthew 1:24-25: x','[L1] Luke 2:48–49: “And'])console.log(JSON.stringify(s),'->',__refs(s).map(r=>(r.book||'?')+' '+r.cvs.join(',')).join(' | '));
