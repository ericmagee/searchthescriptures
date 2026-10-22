// F18 harness (Worker_A3, BB-7397 rev 8 DoD 18, 7568). Usage: node f18.cjs <node dir>
// Gemini's 27893 cure exchange, extracted by script from fx/report27893.md (Drive copy, de6a7448): the FLAGGED LINES and FLAGGED ITEMS
// lines of its cure request and its reply block. broken = cureBroken of Gemini's worked text, from its stored judgment (fx/judgments_27893.json,
// the verdict_raw before the first AUDIT line, unwrapped as the panel cure build reads it). Rounds: fx/rounds27893.json.
const fs=require('fs');const crypto=require('crypto');const [,,dir]=process.argv;
const md5=s=>crypto.createHash('md5').update(s).digest('hex');
const lib0=fs.readFileSync(dir+'/Cure_Check.js','utf8').split('\n');const e=lib0.findIndex(l=>l.startsWith('function cureProse'));
const L=new Function(lib0.slice(0,e+2).join('\n')+'\nreturn {cureVerdicts,cureCorrected,cureBroken,cureUnwrap};')();
const X=JSON.parse(fs.readFileSync('fx/rounds27893.json','utf8'));const R={CR1:X.cr1,DR1:X.gr1,CR2:X.cr2,DR2:X.gr2,CR3:X.cr3,DR3:X.dr3};
const rep=fs.readFileSync('fx/report27893.md','utf8').split('\n');
const s0=rep.findIndex(l=>l.startsWith('K-G3 DEFENDER: DEFENDER STANDING SELF-SUPPORTED while these DEFENDER links are graded BROKEN: D4 vs C6, D5 vs C8, D6 vs C8'));
let fl=s0;while(!rep[fl].startsWith('FLAGGED LINES:'))fl--;
const kb=[],kg=[];for(let i=fl+1;rep[i].trim();i++)kb.push(rep[i]);let fi=fl;while(!rep[fi].startsWith('FLAGGED ITEMS:'))fi++;for(let i=fi+1;rep[i].trim();i++)kg.push(rep[i]);
const rh=rep.findIndex((l,i)=>i>s0&&l.startsWith('**reply to the cure request**'));const a=rep.findIndex((l,i)=>i>rh&&l==='```text');const b=rep.findIndex((l,i)=>i>a&&l==='```');
const reply=rep.slice(a+1,b).join('\n');fs.writeFileSync('fx/f18_gemini_reply.txt',reply);
console.log('F18 source: report lines',fl+2,'to',fi+kg.length+1,'(flagged),',a+2,'to',b,'(reply);',reply.length,'chars, md5',md5(reply));
const items=kb.map(l=>({rule:'K-B',link:l.slice(0,l.indexOf(':')),line:l.slice(l.indexOf(': ')+2)})).concat(kg.map(l=>{const lab=l.slice(0,l.indexOf(':'));
 return lab.startsWith('K-G3')?{rule:'K-G3',side:'DEFENDER',link:null,line:null}:{rule:'K-G1',side:'DEFENDER',link:lab.slice(5),line:l.slice(l.indexOf(': ')+2)};}));
const J=JSON.parse(fs.readFileSync('fx/judgments_27893.json','utf8')).find(j=>j.judge_seat==='gemini');
const raw=J.verdict_raw;const k=raw.indexOf('\n\n[AUDIT v');const broken=L.cureBroken(L.cureUnwrap(k>=0?raw.slice(0,k):raw));
console.log('items:',JSON.stringify(items.map(x=>x.rule+' '+(x.link||x.side))),'broken:',JSON.stringify(broken));
const run=(name,text)=>{const v=L.cureVerdicts(items,{ok:true,text},broken,R);const cc=L.cureCorrected({ok:true,text},v);
 console.log(name,'=>',JSON.stringify(v.map(x=>(x.rule+' '+(x.link||x.side)+' '+x.status+' ('+x.why+')'))),'| counted on:',cc?cc.tag:'its own verdict (no retraction counted)');};
const links=['D4 vs C6','D5 vs C8','D6 vs C8'];
const why={'D4 vs C6':'[CR2] answered Luke 2:44 in the words "the narrator rows (Luke 2:27, 2:41, 2:33)", so the witness was not left unanswered.',
 'D5 vs C8':'[DR1] pressed "Matthew 1:22-23" against premise 6, not premise 5, so this line has no witness of its own.',
 'D6 vs C8':'[DR1] pressed "a virgin shall be with child" against D6 by C1, so C8 adds no witness to D6.'};
run('F18 as printed',reply);
run('F18b with a reason line per link',reply+'\n'+links.map(l=>'STATEMENT: '+l+' | '+why[l]).join('\n'));
run('F18b2 same reasons placed before the RETRACTED lines',links.map(l=>'STATEMENT: '+l+' | '+why[l]).join('\n')+'\n'+reply);
run('F18d.1 a reason line naming the round only',reply+'\n'+links.map(l=>'STATEMENT: '+l+' | Retracted because [CR2] answered this line.').join('\n'));
run('F18d.2 a reason line quoting words, no round',reply+'\n'+links.map(l=>'STATEMENT: '+l+' | Retracted because "the witness was answered by the defender" holds.').join('\n'));
run('F18d.3 a reason line naming a verse, no round',reply+'\n'+links.map(l=>'STATEMENT: '+l+' | Retracted because Luke 2:44 does not carry it.').join('\n'));
