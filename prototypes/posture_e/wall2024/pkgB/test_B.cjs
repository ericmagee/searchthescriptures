// Package B offline tests: B1 (amended: end of the final user message; cached prefix byte-identical), B2 (K-CMT on stored judgments), N1, N2, N4.
const fs=require('fs');const live=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).workflow;const LN={};live.nodes.forEach(n=>LN[n.name]=n.parameters&&n.parameters.jsCode||'');
const pat=n=>fs.readFileSync('patched/'+n.replace(/ /g,'_')+'.js','utf8');const patA=n=>fs.readFileSync('../pkgA/patched/'+n.replace(/ /g,'_')+'.js','utf8');
const pick=(c,name)=>{const i=c.indexOf('function '+name+'(');const j=c.indexOf('\nfunction ',i+10);return c.slice(i,j<0?undefined:j);};
let fail=0;const ok=(id,c,m)=>{console.log((c?'OK  ':'FAIL')+' '+id+' '+m);if(!c)fail++;};
const slice=s=>{const i=s.indexOf('const __AGR_TXT=');const j=s.indexOf('\nconst __MT=(items)=>{',i);return s.slice(i,j<0?s.indexOf('\n',s.indexOf('const __AGR_SB='))+1:j);};
const ACC='Commitment 1. The record is the only evidence. I use only the record.\nI ACCEPT THIS POSTURE AND WILL BE HELD TO IT.';
const mk=()=>[{json:{judges:[{seat:'grok',body:{model:'x-ai/grok',messages:[{role:'system',content:'SYS'},{role:'user',content:'POSTURE FOR ACCEPTANCE\n\nPART2'},{role:'assistant',content:ACC},{role:'user',content:'THE METHOD...DEBATE TRANSCRIPT\n\nT'}]}},
 {seat:'noacc',body:{model:'m',messages:[{role:'system',content:'SYS'},{role:'user',content:'DEBATE'}]}},
 {seat:'gem',body:{systemInstruction:{parts:[{text:'SYS'}]},contents:[{role:'user',parts:[{text:'POSTURE FOR ACCEPTANCE\n\nP'}]},{role:'model',parts:[{text:ACC}]},{role:'user',parts:[{text:'DEBATE'}]}]}}]}}];
for(const n of ['Panel Build','Build Independent Verdict','Reserve Build','Alternate Build']){const s=pat(n);const F=new Function(slice(s)+'\nreturn __AGR_SB;')();
 const before=mk(),after=F(mk());const b=before[0].json.judges,a=after[0].json.judges;
 const pre=JSON.stringify(a[0].body.messages.slice(0,3))===JSON.stringify(b[0].body.messages.slice(0,3));
 const last=a[0].body.messages[3].content;const tail=last.slice(b[0].body.messages[3].content.length);
 const c1=pre&&last.startsWith(b[0].body.messages[3].content)&&/THE AGREEMENT YOU ACCEPTED, shown back/.test(tail)&&tail.includes('> I ACCEPT THIS POSTURE AND WILL BE HELD TO IT.')&&tail.endsWith('The reply form given above is unchanged; answer in it.');
 const c2=JSON.stringify(a[1])===JSON.stringify(b[1]);const g=a[2].body.contents;const c3=g[2].parts.length===2&&JSON.stringify(g.slice(0,2))===JSON.stringify(b[2].body.contents.slice(0,2));
 const again=F(after);const c4=JSON.stringify(again)===JSON.stringify(after);
 const wired=s.includes('\nreturn __AGR_SB(__MT(__R));\n');
 ok('B1',c1&&c2&&c3&&c4&&wired,`${n}: system+head byte-identical; reminder at the end of the final user message; no-acceptance body untouched (${c2}); gemini form (${c3}); idempotent (${c4}); wired after THE METHOD walker (${wired})`);}
{const s=pat('Send Back Build');const T=new Function(slice(s).split('\nconst __AGR_SB=')[0]+'\nreturn __agrTail;')();const msgs=mk()[0].json.judges[0].body.messages;const t=T(msgs);
 ok('B1',t.includes('> I ACCEPT')&&s.includes("{role:'user',content:msg+__agrTail(j.body.messages)}]};"),'Send Back Build: the seat\'s own acceptance appended after the send-back request');
 const o=LN['Send Back Build'];const m0=o.slice(o.indexOf("const msg="),o.indexOf("';",o.indexOf("SENDBACK: <item id> || CHANGE TO"))+2),m1=s.slice(s.indexOf("const msg="),s.indexOf("';",s.indexOf("SENDBACK: <item id> || CHANGE TO"))+2);
 ok('N4',m0===m1&&m0.length>100,'Send Back Build: the request text and its SENDBACK reply form are byte-identical; the reminder follows them; Send Back Record untouched');
 ok('N4b',s.includes("x.rule!=='K-W'&&x.rule!=='K-CON'"),'Send Back Build: K-CON excluded from send-backs (K-W exclusion kept)');}
const pp=pat('Panel Payloads');const KW=new Function(['kwLines421','wpLines2024','kconLines2024','kcmtLines2024'].map(f=>pick(pp,f)).join('\n')+'\nreturn kwLines421;')();
const pa=patA('Panel Payloads');const KWA=new Function(['kwLines421','wpLines2024','kconLines2024'].map(f=>pick(pa,f)).join('\n')+'\nreturn kwLines421;')();
const R=f=>({CR1:f.cr1,DR1:f.gr1,CR2:f.cr2,DR2:f.gr2,CR3:f.cr3,DR3:f.dr3,CR4:f.cr4,DR4:f.dr4});
for(const id of ['32791','32905','32924']){const f=JSON.parse(fs.readFileSync(`../fixtures/${id}.json`,'utf8'));
 for(const j of JSON.parse(fs.readFileSync(`../pkgA/judgments/${id}.json`,'utf8'))){const a=KW(j.verdict_raw,R(f)),o=KWA(j.verdict_raw,R(f));const k=a.items.filter(x=>x.rule==='K-CMT');
  const n=k.length?+k[0].line.split(' ')[0]:0;
  ok('B2',k.length<=1,`${id} ${j.judge_seat}: K-CMT ${n} contested grade line(s) with no commitment${k[0]?' :: '+k[0].line.slice(0,170):''}`);
  ok('N2',JSON.stringify(a.items.filter(x=>x.rule!=='K-CMT'))===JSON.stringify(o.items)&&JSON.stringify(a.marks.filter(m=>!/K-CMT/.test(m)))===JSON.stringify(o.marks),`${id} ${j.judge_seat}: every K-W, v31 and K-CON item and mark unchanged from package A`);}}
for(const n of Object.keys(LN).filter(n=>LN[n].includes('function kwLines421('))){ok('N1',/'K-CON':'TRIAL','K-CMT':'TRIAL'\}/.test(pat(n)),`${n}: ENF_STATUS 'K-CMT':'TRIAL'`);}
console.log(fail?'FAILED '+fail:'ALL OK');
