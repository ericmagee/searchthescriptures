const fs=require('fs');let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++;};
// 1. the agreement: 8 headings, an 8-heading reply passes, a 7-heading reply is returned
const ac=fs.readFileSync('new/Accept Check.js','utf8');const a=ac.indexOf('const POSTURE=(()=>{');const b=ac.indexOf(' // the reply envelope of a chat call',a);
const P=new Function(ac.slice(a+'const POSTURE=(()=>{'.length,b)+'\nreturn {HEADS,check,PROMPT};')();
const rep=n=>P.HEADS.slice(0,n).map(x=>x+'\nI hold to this.').join('\n')+'\nI ACCEPT THIS POSTURE AND WILL BE HELD TO IT.';
ok(P.HEADS.length===8&&P.HEADS[7]==='Commitment 8. The method is Isaiah 28:10.','agreement: 8 headings, the 8th is the method');
ok(P.check(rep(8)).status==='ACCEPT','agreement: an 8-heading reply is ACCEPT');ok(/heading 8 missing/.test(P.check(rep(7)).faults.join()),'agreement: a 7-heading reply is returned, heading 8 missing');
ok(/For precept must be upon precept/.test(P.PROMPT)&&/and the defender shows no fit \(Commitment 3\)/.test(P.PROMPT)&&!/says the opposite/.test(P.PROMPT),'agreement: method text sent, break sentence in the meaning form, no words test');
// 2. the final request: the method at the top of every judge body's last user message, once
const pb=fs.readFileSync('new/Panel Build.js','utf8');const mt=pb.slice(pb.indexOf('const __METHOD_TOP='),pb.indexOf('const __R=await'));
const MT=new Function(mt+'return __MT;')();
const body=()=>({model:'m',messages:[{role:'system',content:'s'},{role:'user',content:'POSTURE'},{role:'assistant',content:'ok'},{role:'user',content:'DEBATE judge now'}]});
const items=[{json:{judges:[{body:body()},{body:body()},{body:body()}]}}];MT(items);MT(items);
ok(items[0].json.judges.every(j=>j.body.messages[3].content.startsWith('THE METHOD (Isaiah 28:10)')&&j.body.messages[3].content.endsWith('DEBATE judge now')&&j.body.messages[1].content==='POSTURE'),'final request: method prepended to the last user message of all three panel bodies');
ok(items[0].json.judges[0].body.messages[3].content.split('THE METHOD (Isaiah 28:10)').length===2,'final request: applied once even when run twice');
const biv=[{json:{body_deepseek:{model:'d',messages:[{role:'user',content:[{type:'text',text:'DEBATE'}]}]}}}];MT(biv);ok(/^THE METHOD/.test(biv[0].json.body_deepseek.messages[0].content[0].text),'final request: array content (single judge form) gets the method too');
for(const nm of ['Reserve Build','Alternate Build','Build Independent Verdict']){const c=fs.readFileSync('new/'+nm+'.js','utf8');ok(c.includes('const __R=await (async()=>{')&&c.trim().endsWith('return __MT(__R);'),nm+': wrapped');}
// 3. the trial ask: its own turn, then a system reminder
const qa=fs.readFileSync('new/QR Ask Build.js','utf8');ok(qa.includes("m.push({role:'assistant',content:'I will not judge yet.")&&qa.includes('Commitment 9. I ask only for explanation.')&&!qa.includes('Commitment 8. I ask'),'trial: ask as its own turn; trial commitment renumbered 9');
console.log(fail?'FAIL ('+fail+')':'ALL PASS');
