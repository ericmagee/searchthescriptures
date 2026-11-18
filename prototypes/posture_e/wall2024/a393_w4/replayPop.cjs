// ASK 393: header lines over stored runs (a378r3 pop3_full3.json, 166 debates), s262 vs target. Stored rows carry no alt_dropped, so only the trWhy cut can change a line.
const fs=require('fs');
const src=w=>{const c=JSON.parse(fs.readFileSync(w)).nodes.find(n=>n.name==='Format Markdown').parameters.jsCode;const k=c.indexOf('const drvCell');return c.slice(0,k)+'\nreturn {md:t};';};
const mk=code=>new Function('$','$input','require',code);
const run=(f,d)=>{const $=nm=>{const M={'Get Row':[d.r],'Get Judgments':(d.J||[]),'Get Verse':[{text:''}]};if(nm in M)return {isExecuted:true,first:()=>({json:M[nm][0]}),all:()=>M[nm].map(json=>({json}))};return {isExecuted:false,first:()=>{throw new Error('not run '+nm)},all:()=>{throw new Error('not run '+nm)}};};return f($,{all:()=>[],first:()=>({json:{}})},require);};
const OLD=mk(src('../rdf/fetchback_s262.json')),NEW=mk(src('t393.json'));const pop=JSON.parse(fs.readFileSync('../a378r3/pop3_full3.json'));
let n=0,ch=0,err=0;const out=[];
for(const d of pop){d.J=(d.J||[]).map(j=>({...j,verdict_raw:j.verdict_raw||''}));d.r.drv_removed=d.r.drv_removed||null;n++;let o,w;try{o=run(OLD,d).md;w=run(NEW,d).md;}catch(e){err++;out.push('ERR '+d.r.run_token+' '+e.message);continue;}
 const a=o.split('\n'),b=w.split('\n');if(a.length!==b.length){out.push('LEN '+d.r.run_token);ch++;continue;}
 a.forEach((l,i)=>{if(l!==b[i]){ch++;out.push(d.r.run_token+' line '+i+'\n- '+l+'\n+ '+b[i]);}});}
console.log('debates',n,'errors',err,'changed lines',ch);console.log(out.join('\n'));
