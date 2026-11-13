// Rebuild Judge Contradiction Build requests from stored judge-path prompts. usage: require, run(code,row)
const fs=require('fs');
const KEYS={'CR1':'cr1','CR2':'cr2','CR3':'cr3',"CR4 -- THE DEFENDER'S CLOSING ROUND":'cr4','DR1':'gr1','DR2':'gr2','DR3':'dr3',"DR4 -- THE CHALLENGER'S CLOSING ROUND":'dr4'};
function parse(p){const F={};const H=[...p.matchAll(/^=== \[([^\]]+)\] ===$/gm)];
 H.forEach((h,i)=>{const a=h.index+h[0].length+1;let b=i+1<H.length?H[i+1].index:p.length;let s=p.slice(a,b);
  s=s.replace(/\n\n######## THE CHALLENGER ########[\s\S]*$/,'');F[KEYS[h[1]]]=s.replace(/\n+$/,'');});
 const c0=p.indexOf('CANDIDATES ALREADY NAMED (answer each one by its id):\n')+'CANDIDATES ALREADY NAMED (answer each one by its id):\n'.length;const c1=p.indexOf('\n\n######## THE DEFENDER');
 const C=p.slice(c0,c1).split('\n').filter(l=>/^J\d+ -- /.test(l)).map(l=>{const m=l.match(/^J\d+ -- (\w+) -- LINK \? -- EARLIER \[(\w+)\] "(.*)" -- CLOSING \[(\w+)\] "(.*)" -- named by the judges' CONTRADICTION lines \((.*)\)$/);if(!m)throw new Error('cand '+l);return {side:m[1],er:m[2],eq:m[3],lr:m[4],lq:m[5],seats:m[6].split(', ')};});
 return {F,C};}
function run(code,row){const {F,C}=parse(row.p);const seats=[];C.forEach(c=>c.seats.forEach(s=>{if(s!=='single judge'&&!seats.includes(s))seats.push(s);}));
 const line=c=>'CONTRADICTION -- '+c.side+' -- EARLIER (['+c.er+'], "'+c.eq+'") -- LATER (['+c.lr+'], "'+c.lq+'")';
 const bodies=seats.map(s=>JSON.stringify({payload:{judge_seat:s,verdict_raw:C.filter(c=>c.seats.includes(s)).map(line).join('\n')}}));
 const sj=C.filter(c=>c.seats.includes('single judge')).map(line).join('\n');
 const nodes={'Init Seats':{run_token:row.t},'Resolve Seats':{deepseek:{api_model:'deepseek-v4-flash',max_tokens:16000}},'Final Output':F,'Panel Payloads':{bodies,summary:[]},'Extract Independent Verdict':{independent_verdict_raw:sj}};
 const $=nm=>({first:()=>({json:nodes[nm]}),isExecuted:nm==='Extract Independent Verdict'?!!sj:!!nodes[nm]});
 return new Function('$',code)($);}
module.exports={parse,run};
