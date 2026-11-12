const fs=require('fs');const {B}=require('./bsb_mod.cjs');
for(const f of ['Panel_Payloads.js','Alternate_Payloads.js','R2_Alternate_Payloads.js']){const s=fs.readFileSync(f,'utf8');
 const a=s.indexOf('function sameModelMarks(');let d=0,i=s.indexOf('{',a);for(;i<s.length;i++){if(s[i]==='{')d++;else if(s[i]==='}'){d--;if(!d)break;}}
 const b=B[0].json;const SJ=b.saveBody?Object.assign({},b.saveBody,b.sj_values||{}):null;
 const fn=new Function('SJ','voidCounts',s.slice(a,i+1)+';return sameModelMarks;')(SJ,()=>{throw new Error('voidCounts reached')});
 let out;try{out=fn({judge_api_model:'openai/gpt-6.1-terra',judge_seat:'chatgpt',defense_standing:'X'},'text');}catch(e){out='THROWS '+e.message;}
 const ST=SJ&&typeof SJ.independent_verdict_raw==='string'?'string':null;
 console.log(f,'sameModelMarks ->',JSON.stringify(out),'| VC and kkjv single blocks run:',ST!==null);}
