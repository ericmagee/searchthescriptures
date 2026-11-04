const fs=require('fs');const c=fs.readFileSync(process.argv[2],'utf8');
const fnText=name=>{const i=c.indexOf('function '+name+'(');let d=0,j=c.indexOf('{',i);for(let k=j;k<c.length;k++){if(c[k]==='{')d++;else if(c[k]==='}'&&--d===0)return c.slice(i,k+1);}};
const f=new Function(fnText('selfLines421')+';return selfLines421;')();
const ex=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));const pc=ex.data.resultData.runData['Panel Payloads'][0].data.main[0][0].json;
pc.bodies.forEach(b=>{const p=JSON.parse(b).payload;console.log(p.judge_seat,JSON.stringify(f(p.verdict_raw)));});
const syn='CHALLENGER CONCEDED LINKS: 1 -- Premise 1, UNEXHIBITED (Matthew 1:19 was not answered); premise 2 spared.\nANSWER CHECK: Matthew 1:19 -- [DR3] -- MEANS: \"x\" -- ANSWER: \"y\" -- MEETS -- ok';
console.log('synthetic',JSON.stringify(f(syn)));
console.log('synthetic escaped',JSON.stringify(f(JSON.stringify({reasoning:syn}))));
pc.bodies.forEach(b=>{const p=JSON.parse(b).payload;if(p.judge_seat!=='chatgpt')return;const r2=p.verdict_raw.replace('MISSES -- That absence','MEETS -- That absence');console.log('control (ChatGPT 1:19 [DR3] set to MEETS):',JSON.stringify(f(r2)));});
