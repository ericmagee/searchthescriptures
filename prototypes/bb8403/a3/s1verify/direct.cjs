const fs=require('fs');const f=process.env.PWLF||__dirname+'/pwl_new.js';const LF='\n';eval(fs.readFileSync(f,'utf8').replace('const PWL=','globalThis.PWL='));
const t=x=>!!x;const R=[];
// D1 chapter end: Matthew 1 has 25 verses; Luke 1 has 80
const c1=PWL.cList({dr3:'LINK 1\nMatthew 1:31 and Matthew 1:25 and Luke 1:31\n'});R.push(['D1 past-end dropped',!c1.includes('Matthew 1:31')&&c1.includes('Matthew 1:25')&&c1.includes('Luke 1:31')]);
// D2 premise NOT NAMED with range-then-colon answer
const F={cr1:'Matthew 1:25 matters.',gr1:'x',cr2:'x',gr2:'x',cr3:"CHALLENGER'S UNSUPPORTED-L4 PREMISES\n1. Matthew 1:25 is pressed.\n",dr3:'LINK 1\n[L1] Matthew 1:24-25: "knew her not".\n'};
const j=PWL.judgeBlock(F);R.push(['D2 range-colon answers premise',/premise 1: 1 verse\(s\) carried; 1 named; NOT NAMED: none/.test(j)]);
// D3 bare reference not listed in cited-in
const F3={cr1:'Luke 2:1 then (1:31).',gr1:'x',cr2:'x',gr2:'x',cr3:'x',dr3:'LINK 1\nnothing'};const j3=PWL.judgeBlock(F3);
R.push(['D3 bare not in cited-in',/\(1 of 1\): Luke 2:1$/m.test(j3)]);
// D4 range over 12 not listed
const F4={cr1:'Matthew 1:2-15 and Luke 2:1.',gr1:'x',cr2:'x',gr2:'x',cr3:'x',dr3:'LINK 1\nnothing'};const j4=PWL.judgeBlock(F4);R.push(['D4 >12 range skipped',!/Matthew 1:2-15/.test(j4)]);
// D5 first-citation dating: CR1 cites range Luke 2:48-49, CR2 cites Luke 2:49; DR2 names 2:49 -> named (DR2 later than CR1)
const F5={cr1:'Luke 2:48-49.',gr1:'x',cr2:'x',gr2:'Luke 2:48-49 answered.',cr3:'Luke 2:49 again.',dr3:'LINK 1\nnothing'};const j5=PWL.judgeBlock(F5);R.push(['D5 first-cite dating',/\(0 of 2\): none/.test(j5)]);
console.log(R.map(([n,p])=>(p?'PASS':'FAIL')+' '+n).join(' | '));
