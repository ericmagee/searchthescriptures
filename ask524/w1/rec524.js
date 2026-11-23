// ASK 524/525: run Assume Check Record (old and new) on 41418's Build output with a fixed test reply; no model call.
const fs=require('fs');const [,,oldF,newF,...parts]=process.argv;
const rd={};for(const p of parts){const d=JSON.parse(fs.readFileSync(p,'utf8'));const f=o=>{if(o&&typeof o==='object'){if(o.runData)return o.runData;for(const v of Object.values(o)){const r=f(v);if(r)return r;}}return null;};Object.assign(rd,f(d)||{});}
const out=n=>{const r=rd[n];return r?r[0].data.main[0].map(x=>x.json):null;};
const REPLY=[
'ASSUME-CHECK: DEFENDER PREMISE 5 -- FACT 1 "the flesh runs from David to the child through Joseph" -- STATED -- John 6:42 "the son of Joseph, whose father and mother we know" -- read with Romans 1:3.',
'ASSUME-CHECK: DEFENDER PREMISE 2 -- FACT 1 "Mary\'s question concerned the throne" -- STATED -- Luke 1:34 "Mary was of the house of David by her own line" -- invented words.',
'ASSUME-CHECK: CHALLENGER PREMISE 91 -- FACT 1 "Mary is of David\'s line" -- NOT STATED -- no quoted verse gives it.'].join('\n');
const go=f=>{const e=JSON.parse(fs.readFileSync(f,'utf8'));const nd=(e.nodes||e.data.nodes);
 const bc=nd.find(n=>n.name==='Assume Check Build').parameters.jsCode;const rc=nd.find(n=>n.name==='Assume Check Record').parameters.jsCode;
 const $b=n=>{const a=out(n);return {isExecuted:!!a,first:()=>({json:a?a[0]:undefined})};};
 const B=new Function('$',bc)($b)[0].json;
 const $r=n=>{if(n==='Assume Check Build')return {isExecuted:true,first:()=>({json:B})};if(n==='Judge Contradiction Record')return {isExecuted:true,first:()=>({json:{}})};const a=out(n);return {isExecuted:!!a,first:()=>({json:a?a[0]:undefined})};};
 const $input={first:()=>({json:{choices:[{message:{content:REPLY}}]}})};
 const R=new Function('$','$input',rc)($r,$input)[0].json.acx;
 return R.facts.filter(f=>f.k===1&&((f.side==='DEFENDER'&&(f.n===5||f.n===2))||f.n===91)).map(f=>({side:f.side,n:f.n,r2:f.r2,answer:f.deepseek,code:f.code,both_not_stated:f.both_not_stated,grades:f.grades.length}));};
console.log('OLD',JSON.stringify(go(oldF),null,0));console.log('NEW',JSON.stringify(go(newF),null,0));
