const fs=require('fs');const r=f=>fs.readFileSync(f,'utf8');
let src=r('pwl.js').replace('const PWL=','globalThis.PWL=');
const LF='\n';eval(src);
const F={cr1:r('claude_r1.txt'),cr2:r('claude_r2.txt'),cr3:r('engine_r3.txt'),gr1:r('engine_r1.txt'),gr2:r('engine_r2.txt'),dr3:r('challenger_r3.txt')};
console.log(PWL.judgeBlock(F));
// direct probes
