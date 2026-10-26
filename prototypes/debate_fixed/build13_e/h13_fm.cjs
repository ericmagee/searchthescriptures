// Rev 9 harness (Worker_E, BB-7397): Format Markdown then Plain Rule Lines of a node dir on run 28269 (row fd6a5ca9) as stored.
// Usage: node h13_fm.cjs <node dir> [out.md] [judgments override json]. Inputs (each md5-equal to the database, FIXTURES.txt): fx/row28269_small.json,
// fx/rounds28269.json, fx/drv_removed.json, fx/vr_<seat>.txt; the synthesis is a stub (no changed line reads it). Quote Report: qr_<dir>.json from
// h_qr.cjs on fx/rounds28269_h.json and fx/kjv28269.json. Sent texts: parsed from fx/report28269.md (each block's length checked against its
// printed count). Panel Build order deepseek, gemini, grok (as the report's Text 1 heading); Reserve Build and Alternate Cure Build not executed.
const fs=require('fs');const {execFileSync}=require('child_process');const [,,dir,outF,jOver]=process.argv;
const R6=JSON.parse(fs.readFileSync('fx/rounds28269.json','utf8'));
const row=Object.assign(JSON.parse(fs.readFileSync('fx/row28269_small.json','utf8')),{claude_r1:R6.CR1,engine_r1:R6.DR1,claude_r2:R6.CR2,engine_r2:R6.DR2,engine_r3:R6.CR3,challenger_r3:R6.DR3,
 drv_removed:JSON.parse(fs.readFileSync('fx/drv_removed.json','utf8')),synthesis:'(synthesis stub, harness)',independent_verdict_raw:null});
const JM={glm:[795,'z-ai/glm-5.3','stop'],gemini:[796,'gemini-3.1-pro-preview','STOP'],grok:[797,'grok-4.7','stop']};
let J=['glm','gemini','grok'].map(s=>({id:JM[s][0],debate_id:row.id,truncated:false,judge_seat:s,drv_uncured:0,verdict_raw:fs.readFileSync('fx/vr_'+s+'.txt','utf8'),verdict_tag:'HELD',finish_reason:JM[s][2],conceded_links:0,judge_api_model:JM[s][1],defense_standing:'SELF-SUPPORTED',challenge_standing:'SELF-SUPPORTED',challenger_conceded_links:0}));
if(jOver)J=JSON.parse(fs.readFileSync(jOver,'utf8'));
const G=JSON.parse(fs.readFileSync('fx/guards.json','utf8'));
const QR=JSON.parse(execFileSync('node',['h_qr.cjs',dir,'fx/rounds28269_h.json','fx/kjv28269.json'],{maxBuffer:1<<26}).toString());
const rep=fs.readFileSync('fx/report28269.md','utf8').split('\n');
const blocks=(a,b)=>{const out=[];for(let i=a;i<b;i++){const m=rep[i].match(/^\*\*(\w+) message\*\* \((\d+) characters\)$/)||rep[i].match(/^\*\*(reply) to the cure request\*\* \((\d+) characters\)$/);if(!m)continue;
 const f=rep[i+2].replace(/text$/,'');let k=i+3;const L=[];while(rep[k]!==f){L.push(rep[k]);k++;}const text=L.join('\n');if(text.length!==+m[2])throw new Error('length '+m[1]+' at '+(i+1)+': '+text.length+' vs '+m[2]);out.push({role:m[1],text});i=k;}return out;};
const at=s=>rep.findIndex(l=>l.startsWith(s));
const T1=blocks(at('### Text 1,'),at('### Cure call, DeepSeek'));const CD=blocks(at('### Cure call, DeepSeek'),at('### Cure call, Gemini'));const CG=blocks(at('### Cure call, Gemini'),rep.length);
const body=ms=>({messages:ms.map(x=>({role:x.role,content:x.text}))});
const PB={judges:[['deepseek','deepseek-flash'],['gemini','gemini-3.1-pro-preview'],['grok','grok-4.7']].map(([seat,api_model])=>({seat,api_model,body:body(T1)}))};
const ALT={idx:0,removed_seat:'deepseek',removed_api_model:'deepseek-flash',qualify:true,seat:'glm',pool_seat:'glm',api_model:'z-ai/glm-5.3',body:body(T1)};
const cure=(seat,model,ms)=>({seat,model,who:'panel',body:body(T1.concat(ms.filter(x=>x.role!=='reply')))});const rp=ms=>({ok:true,text:ms.find(x=>x.role==='reply').text});
const CB={'Panel Cure Build 1':cure('deepseek','deepseek-flash',CD),'Panel Cure Build 2':cure('gemini','gemini-3.1-pro-preview',CG),'Panel Cure Build 3':{skip:true}};
const CN={'Panel Cure Normalize 1':{cure:CB['Panel Cure Build 1'],reply:rp(CD)},'Panel Cure Normalize 2':{cure:CB['Panel Cure Build 2'],reply:rp(CG)}};
const V={text:'For precept [must be] upon precept, precept upon precept; line upon line, line upon line; here a little, [and] there a little: [must be: or, hath been]'};
const NOT=n=>{throw new Error("Node '"+n+"' hasn't been executed");};
const node=n=>{switch(n){
 case 'Get Row':return {first:()=>({json:row})};
 case 'Get Judgments':return {all:()=>J.map(j=>({json:j}))};
 case 'Get Verse':return {first:()=>({json:V})};
 case 'Get Guards':return {all:()=>G.map(g=>({json:g}))};
 case 'Init Seats':return {first:()=>({json:{single_judge:'deepseek',t0:'2026-10-26T07:30:00.000Z',run_token:row.run_token}})};
 case 'Panel Failure Note':return {isExecuted:false,first:()=>NOT(n)};
 case 'Quote Report':return {first:()=>({json:QR})};
 case 'Panel Build':return {isExecuted:true,first:()=>({json:PB})};
 case 'Alternate Build':return {isExecuted:true,first:()=>({json:{alt:ALT,skips:[]}}),all:()=>[{json:{alt:ALT,skips:[]}}]};
 default:if(CB[n])return {isExecuted:true,all:()=>[{json:{cure:CB[n]}}]};if(CN[n])return {isExecuted:true,all:()=>[{json:CN[n]}]};return {isExecuted:false,first:()=>NOT(n),all:()=>NOT(n)};}};
const out=new Function('$',fs.readFileSync(dir+'/Format_Markdown.js','utf8'))(node)[0].json;
const pl=new Function('$input',fs.readFileSync(dir+'/Plain_Rule_Lines.js','utf8'))({first:()=>({json:out})})[0].json;
fs.writeFileSync(outF||('fm28269_'+dir.replace(/\W/g,'')+'.md'),pl.md);console.log('chars',pl.md.length,'codes_left',pl.codes_left);
