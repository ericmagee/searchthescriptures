// F26 harness (Worker_E, rev 9). Usage: node f26.cjs <node dir> [judgments-out.json]
// (1) Panel Build's PWL block (const PWL=(()=>{ ... })(); read from the node) on 28269's rounds: judgeBlock and, where present, cList.
// (2) Panel Payloads' and Alternate Payloads' cAudit (where present) on each stored judgment's reasoning, with the text the judges were sent
//     (fx/report28269.md Text 1, system + user, parsed as h13_fm.cjs does). Writes the judgments with the audit lines appended, for h13_fm.cjs.
const fs=require('fs');const [,,dir,jout]=process.argv;const R=JSON.parse(fs.readFileSync('fx/rounds28269.json','utf8'));
const F={cr1:R.CR1,gr1:R.DR1,cr2:R.CR2,gr2:R.DR2,cr3:R.CR3,dr3:R.DR3};
const pb=fs.readFileSync(dir+'/Panel_Build.js','utf8');const a=pb.indexOf('const PWL=(()=>{');const b=pb.indexOf('})();',a)+5;
const PWL=new Function(pb.slice(a,b)+'\nreturn PWL;')();
const JB=PWL.judgeBlock(F);console.log('(1) judgeBlock md5',require('crypto').createHash('md5').update(JB).digest('hex'),'chars',JB.length);
console.log('(1) cList:',PWL.cList?'\n'+PWL.cList({dr3:F.dr3}):'(none in this dir)');
const rep=fs.readFileSync('fx/report28269.md','utf8').split('\n');
const blocks=(x,y)=>{const out=[];for(let i=x;i<y;i++){const m=rep[i].match(/^\*\*(\w+) message\*\* \((\d+) characters\)$/);if(!m)continue;const f=rep[i+2].replace(/text$/,'');let k=i+3;const L=[];while(rep[k]!==f){L.push(rep[k]);k++;}out.push(L.join('\n'));i=k;}return out;};
const at=s=>rep.findIndex(l=>l.startsWith(s));const T1=blocks(at('### Text 1,'),at('### Cure call, DeepSeek'));const PT=T1.join('\n');
console.log('(1) the C list in the sent text (base):',PT.includes('CHALLENGER LINK NUMBERS'));
const audit=node=>{const s=fs.readFileSync(dir+'/'+node,'utf8');const i=s.indexOf('const C_BK=');if(i<0)return null;const j=s.indexOf('function drvPromptText');return new Function(s.slice(i,j)+'\nreturn cAudit;')();};
const AP=audit('Panel_Payloads.js'),AA=audit('Alternate_Payloads.js');
const J=JSON.parse(fs.readFileSync('fx/judgments28269.json','utf8'));
const WT=raw=>{const s=String(raw);const x=s.indexOf('{'),y=s.lastIndexOf('}');try{return JSON.parse(s.slice(x,y+1)).reasoning;}catch(e){return null;}};
for(const j of J){const A=j.judge_seat==='glm'?AA:AP;const lines=A?A(WT(j.verdict_raw),PT):[];console.log('(2)',j.judge_seat,'via',j.judge_seat==='glm'?'Alternate Payloads':'Panel Payloads',JSON.stringify(lines));if(lines.length)j.verdict_raw+='\n'+lines.join('\n');}
const d=JSON.parse(fs.readFileSync('fx/drv_removed.json','utf8'))[0];console.log('(2) deepseek (removed) via Panel Payloads',JSON.stringify(AP?AP(WT(d.verdict_raw),PT):[]));
if(jout)fs.writeFileSync(jout,JSON.stringify(J));
