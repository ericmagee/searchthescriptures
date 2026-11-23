const f=require(process.argv[2]||'./uaf.js');
const T=[
'ANSWER CHECK: Luke 1:34 -- [CR4; defender premise 2] -- MEANS: "x" -- ANSWER: "y" -- MISSES (Commitments 3 and 8) -- z',
'ANSWER CHECK: Matthew 1:20 -- [CR4; defender premise 1] -- MEANS: "x" -- ANSWER: "y" -- MEETS -- z',
'ANSWER CHECK: Matthew 1:20 -- [CR4; defender premise 3] -- MEANS: "x" -- ANSWER: "y" -- MISSES -- z',
'ANSWER CHECK: Matthew 1:16 -- [CR2; defender premise 3] -- MEANS: "x" -- ANSWER: "y" -- MISSES -- z',
'ANSWER CHECK: Acts 2:30 -- [CR3] -- MEANS: "x" -- ANSWER: "y" -- MISSES -- z',
'ANSWER CHECK: Acts 2:30 -- [CR4] -- MEANS: "x" -- ANSWER: "y" -- MEETS -- z',
'ANSWER CHECK: Luke 2:4 -- [CR40] -- MEANS: "x" -- ANSWER: "y" -- MISSES -- z',
].join('\n');
const nw=(r)=>f(T,r,'CR3')||f(T,r,'CR3'.slice(0,2)+'[2-4]');
for(const r of ['Luke 1:34','Matthew 1:20','Matthew 1:16','Acts 2:30','Luke 2:4'])console.log(r,'OLD',f(T,r,'CR3'),'NEW',nw(r));
