const fs=require('fs');const {A,B}=require('./bsb_mod.cjs');
const run=(file,bsb,extra)=>{const s=fs.readFileSync(file,'utf8');const M={'Build Save Body':bsb,'Init Seats':{run_token:'T',panel_expected:['chatgpt','luna','sol']},'Final Output':bsb,...extra};
 const $=n=>M[n]?{isExecuted:true,first:()=>({json:M[n]}),all:()=>[{json:M[n]}]}:{isExecuted:false,first:()=>{throw new Error('not executed: '+n)},all:()=>{throw new Error('not executed: '+n)}};
 try{const r=new Function('$','$input',s)($,{all:()=>[],first:()=>({json:{}})});return 'returned '+JSON.stringify(r).slice(0,200);}catch(e){return 'THROWS '+e.message.slice(0,200);}};
for(const f of ['Panel_Payloads.js','Alternate_Payloads.js','R2_Alternate_Payloads.js'])console.log(f,'\n old:',run(f,A[0].json,{}),'\n new:',run(f,B[0].json,{}));
// direct: the SJ object and sameModelMarks guard on the new item
const b=B[0].json;const SJ=b.saveBody?Object.assign({},b.saveBody,b.sj_values||{}):null;console.log('new SJ.judge_model',SJ&&SJ.judge_model,'independent_verdict_raw',SJ&&SJ.independent_verdict_raw);
