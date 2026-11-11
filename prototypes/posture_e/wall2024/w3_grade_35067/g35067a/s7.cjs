const L=require('./lib.cjs');
const pd=L.items('Panel Done')[0];
console.log(JSON.stringify(L.shape(pd.judgments[0],0,1)).slice(0,800));
const j=pd.judgments[1]; console.log(Object.keys(j));
const v=j.verdict_raw; console.log(typeof v, v&&v.length);
require('fs').writeFileSync('terra_final.txt',v);
for(const x of pd.judgments) require('fs').writeFileSync('final_'+x.judge_seat+'.txt',x.verdict_raw);
