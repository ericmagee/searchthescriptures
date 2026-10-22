// F17 harness (Worker_A3, BB-7397 rev 8 DoD 17): Format Markdown then Plain Rule Lines of a node dir on row 6b95a298 (27893) as stored.
// Usage: node f17.cjs <node dir> <kjv rows file> [judgments file]. Inputs: fx/row_27893.json (md5 87b40317), fx/judgments_27893.json
// (md5 f442649e) or the file given, fx/guards.json, the Quote Report of the chain harness on fx/rounds27893.json. Sent-text nodes: Panel
// Build and Reserve Build not executed here (their bodies are not stored); Alternate Build is stubbed with GLM's item as 27893 had it
// (pool seat glm, z-ai/glm-5.3, for grok) and a constructed two-message body, since only its sent-to line is checked.
// Prints the panel heads, Verdict and standing lines, the Alternate judges section and every Sent to line.
const fs=require('fs');const {execFileSync}=require('child_process');const [,,dir,kjv,jf]=process.argv;
const row=JSON.parse(fs.readFileSync('fx/row_27893.json','utf8'));const J=JSON.parse(fs.readFileSync(jf||'fx/judgments_27893.json','utf8'));
const G=JSON.parse(fs.readFileSync('fx/guards.json','utf8'));
const QR=JSON.parse(execFileSync('node',['h_qr.cjs',dir,'fx/rounds27893.json',kjv],{maxBuffer:1<<26}).toString());
const V={text:'For precept [must be] upon precept, precept upon precept; line upon line, line upon line; here a little, [and] there a little: [must be: or, hath been]'};
const NOT=n=>{throw new Error("Node '"+n+"' hasn't been executed");};
const ALT={idx:2,removed_seat:'grok',removed_api_model:'grok-4.7',qualify:false,seat:'glm',pool_seat:'glm',api_model:'z-ai/glm-5.3',
 body:{model:'z-ai/glm-5.3',messages:[{role:'system',content:'(constructed system text)'},{role:'user',content:'(constructed user text)'}]}};
const node=n=>{switch(n){
 case 'Get Row':return {first:()=>({json:row})};
 case 'Get Judgments':return {all:()=>J.map(j=>({json:j}))};
 case 'Get Verse':return {first:()=>({json:V})};
 case 'Get Guards':return {all:()=>G.map(g=>({json:g}))};
 case 'Init Seats':return {first:()=>({json:{single_judge:'deepseek',t0:'2026-10-22T13:34:00.000Z',run_token:row.run_token}})};
 case 'Panel Failure Note':return {isExecuted:false,first:()=>NOT(n)};
 case 'Quote Report':return {first:()=>({json:QR})};
 case 'Alternate Build':return {isExecuted:true,first:()=>({json:{alt:ALT,skips:[]}}),all:()=>[{json:{alt:ALT,skips:[]}}]};
 default:return {isExecuted:false,first:()=>NOT(n),all:()=>NOT(n)};}};
const out=new Function('$',fs.readFileSync(dir+'/Format_Markdown.js','utf8'))(node)[0].json;
const pl=new Function('$input',fs.readFileSync(dir+'/Plain_Rule_Lines.js','utf8'))({first:()=>({json:out})})[0].json;
const L=pl.md.split('\n');let inAlt=false;
L.forEach((l,i)=>{if(l.startsWith('## '))inAlt=l==='## Alternate judges';
 if(/^## Panel judge \d/.test(l)||/^\*\*Verdict:\*\*/.test(l)||/^\*\*(Defense|Challenge) standing:\*\*/.test(l)||/^Sent to:/.test(l)||inAlt&&l.trim())console.log((i+1)+': '+l.slice(0,400));});
