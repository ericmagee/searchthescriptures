// F11 harness (Worker_E): Gemini's stored answer (27795 drv_removed[0].verdict_raw) through the dir's wt parse (Panel Cure Build 1 line
// "the worked text") and the shared library's cureBroken and cureVerdicts; the reply's cure lines rebuilt from the report table, lines 113-117.
const fs=require('fs');const [,,dir,vrFile,replyFile]=process.argv;
const libSrc0=fs.readFileSync(dir+'/Panel_Cure_Check.js','utf8').split('\n');const __e=libSrc0.findIndex(l=>l.startsWith('function cureProse'));const libSrc=libSrc0.slice(0,__e+2).join('\n');
const pcb=fs.readFileSync(dir+'/Panel_Cure_Build_1.js','utf8').split('\n');const wtLine=pcb.find(l=>/wt=\(o\.reasoning|wt=cureUnwrap\(answer\)/.test(l));if(!wtLine)throw new Error('no wt line');
const L=new Function(libSrc+'\nreturn {cureBroken,cureVerdicts,drvCheck};')();
const vr=fs.readFileSync(vrFile,'utf8');const k=vr.indexOf('\n\n[AUDIT v');const answer=k>=0?vr.slice(0,k):vr;
const wt=new Function('answer',libSrc+`\nlet wt=null;${wtLine}\nreturn wt;`)(answer);
const broken=L.cureBroken(wt);
const items=[{rule:'K-G3',side:'DEFENDER',link:null,line:null}];
const reply={ok:true,text:fs.readFileSync(replyFile,'utf8')};
const v=L.cureVerdicts(items,reply,broken,{});
console.log(JSON.stringify({wt_is_reasoning:typeof wt==='string'&&wt.startsWith('BROKEN.'),broken,verdicts:v.map(x=>({rule:x.rule,side:x.side,status:x.status,why:x.why}))}));
