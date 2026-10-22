// F3a harness (Worker_A3): drvLedger cut from the node's own source; judge texts and the sent text from report27665.md (7f22d279).
const fs=require('fs');const [node,rep]=process.argv.slice(2);const s=fs.readFileSync(node,'utf8');
const a=s.indexOf('function drvPromptText(');const b=s.indexOf('function drvCheck(');
const F=new Function(s.slice(a,b)+';return {drvLedger,drvPromptText};')();
const md=fs.readFileSync(rep,'utf8');
const sec=(h)=>{const i=md.indexOf(h);const j=md.indexOf('\n## ',i+5);return md.slice(i,j);};
const sent=md.slice(md.indexOf('## What the judges were sent'));
// each Text section whole (system and user messages), as the node reads the request body whole
const T1=sent.slice(sent.indexOf('### Text 1'),sent.indexOf('### Text 2'));const T2=sent.slice(sent.indexOf('### Text 2'),sent.indexOf('### Cure call'));
const texts=[{to:'single judge',t:T1},{to:'panel',t:T2}];
const sys=(who)=>({messages:[{role:'user',content:(who==='DeepSeek'?T1:T2)}]});
const J=[['Panel judge 1: Gemini','Gemini'],['Panel judge 2: Grok','Grok'],['Panel judge 3: GLM','GLM'],['Single judge: DeepSeek','DeepSeek']];
const hdr=t=>({d:+(t.match(/\*\*Defense standing:\*\* [A-Z-]+, (\d+)/)||[0,0])[1],c:+(t.match(/\*\*Challenge standing:\*\* [A-Z-]+, (\d+)/)||[0,0])[1]});
for(const [h,w] of J){const t=sec('## '+h);const n=hdr(t);const r=F.drvLedger(t,F.drvPromptText(sys(w)),n.d,n.c,'X','Y');
 console.log(w.padEnd(9),'items:',r.items.map(x=>x.link).join(', ')||'none');}
console.log('sent texts read:',texts.length,'| sent to:',texts.map(x=>x.to.slice(0,60)).join(' || '));
