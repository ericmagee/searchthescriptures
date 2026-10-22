// Format Markdown harness (Worker_E): runs a Format Markdown file on 27795's stored row and judgments, the Quote Report of the citation chain,
// the guards and Isaiah 28:10. Sent-text nodes: as the stored report's reads gave (Panel Build failed, Reserve and Alternate Cure Build not
// executed); Build Independent Verdict, Alternate Build and the cure builds are not stubbed (their bodies are not stored), so section 8 is
// out of the comparison. Prints the markdown to stdout.
const fs=require('fs');const {execFileSync}=require('child_process');const [,,dir,qrDir,kjv]=process.argv;
const row=JSON.parse(fs.readFileSync('fx/row_27795.json','utf8'));const J=JSON.parse(fs.readFileSync('fx/judgments_27795.json','utf8'));
const G=JSON.parse(fs.readFileSync('fx/guards.json','utf8'));
// Quote Report output for 27795 from the chain harness of the given dir
const QR=JSON.parse(execFileSync('node',['h_qr.cjs',qrDir,'fx/rounds_27795.json',kjv]).toString());
const V={text:'For precept [must be] upon precept, precept upon precept; line upon line, line upon line; here a little, [and] there a little: [must be: or, hath been]'};
const NOT=n=>{throw new Error("Node '"+n+"' hasn't been executed");};
const node=(n)=>{switch(n){
 case 'Get Row':return {first:()=>({json:row})};
 case 'Get Judgments':return {all:()=>J.map(j=>({json:j}))};
 case 'Get Verse':return {first:()=>({json:V})};
 case 'Get Guards':return {all:()=>G.map(g=>({json:g}))};
 case 'Init Seats':return {first:()=>({json:{single_judge:'deepseek',t0:'2026-10-22T04:27:21.506Z',run_token:row.run_token}})};
 case 'Panel Failure Note':return {isExecuted:false,first:()=>NOT(n)};
 case 'Quote Report':return {first:()=>({json:QR})};
 case 'Panel Build':return {first:()=>undefined,all:()=>[]};
 default:return {isExecuted:false,first:()=>NOT(n),all:()=>NOT(n)};}};
const out=new Function('$',fs.readFileSync(dir+'/Format_Markdown.js','utf8'))(node)[0].json;
// Plain Rule Lines (the next node) as the stored report was written
const pl=new Function('$input',fs.readFileSync(dir+'/Plain_Rule_Lines.js','utf8'))({first:()=>({json:out})})[0].json;
process.stdout.write(pl.md);
