// ASK 585 test: run Alternate Merge (live and patched) with mocked node outputs.
const fs=require('fs');
const REAL={debate_id:'d-real',substitution:{seat:'x'},enforcer_log:[]};
const AM1={debate_id:'d-am1',substitution:{seat:'y'},enforcer_log:[]};
const PH={isArtificialRecoveredEventItem:true};
function mk(nodes){return n=>{const v=nodes[n];return {isExecuted:v!==undefined,first:()=>{if(v===undefined)throw new Error('node '+n+' not executed');return {json:v};},all:()=>v===undefined?[]:[{json:v}]};};}
function run(code,nodes){const $=mk(nodes);const $input={first:()=>({json:AM1}),all:()=>[{json:AM1}]};const $execution={id:1,mode:'retry',customData:{set(){}}};
 try{const o=new Function('$','$input','$execution',code)($,$input,$execution);const j=o[0].json;return 'debate_id='+j.debate_id+' substitution='+JSON.stringify(j.substitution);}catch(e){return 'THREW '+e.message;}}
const cases=[['normal: Pass Accumulate real',{'Pass Accumulate':REAL,'Alternate Merge 1':AM1}],
 ['no Pass Accumulate: Alternate Merge 1 only',{'Alternate Merge 1':AM1}],
 ['41147 retry: Pass Accumulate = recovered placeholder',{'Pass Accumulate':PH,'Alternate Merge 1':AM1}]];
for(const f of process.argv.slice(2)){const c=fs.readFileSync(f,'utf8');for(const [nm,nodes] of cases)console.log(f+' | '+nm+' | '+run(c,nodes));}
