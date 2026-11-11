// W1 run 35067: Judge Enforcer Record tallies, NO ANSWER, and the E-ANS DISAGREE rows with whether the item carried FULL / OTHER LINES.
const fs=require('fs');const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json','utf8')).data.resultData.runData;
const r=rd['Judge Enforcer Record'][0].data.main[0][0].json;console.log('enf428',JSON.stringify(r.enf428));
const calls=rd['Judge Enforcer Call deepseek'][0].data.main[0].map(x=>x.json);calls.forEach((c,i)=>console.log('call',i+1,'finish',c.choices&&c.choices[0].finish_reason,'out tokens',c.usage&&c.usage.completion_tokens,'in tokens',c.usage&&c.usage.prompt_tokens));
const st=rd['Judge Enforcer Build'][0].data.main[0].map(x=>x.json);const due=[],got=[];
st.forEach((c,i)=>{const b=c.body.messages.map(x=>x.content).join('\n');for(const m of b.matchAll(/REPLY LINES DUE FOR THIS ITEM: ([^(]+)\(/g))due.push(...m[1].split(',').map(s=>s.trim()).filter(Boolean));const rep=(calls[i]&&calls[i].choices[0].message.content)||'';for(const m of rep.matchAll(/ENFORCER:?\s*\[?([A-Z]+\d+\.\d+)/g))got.push(m[1]);});
const g=new Set(got);console.log('reply lines due',due.length,'answered',due.filter(x=>g.has(x)).length,'missing',due.filter(x=>!g.has(x)).join(',')||'none');
const items=new Map();for(const c of st){const b=c.body.messages.map(x=>x.content).join('\n');for(const t of b.split(/(?=ITEM [A-Z]+\d+ \()/))if(/^ITEM B\d+ \(E-ANS/.test(t))items.set(t.match(/^ITEM (B\d+)/)[1],t);}
for(const row of r.enf428_rows.filter(x=>x.rule==='E-ANS'&&/DISAGREE/.test(JSON.stringify(x)))){const id=(JSON.stringify(row).match(/\b(B\d+)\.\d+/)||[])[1];const t=items.get(id)||'';
 console.log('\nDISAGREE',row.seat,id,'| FULL',/THE ANSWER IN FULL/.test(t),'| OTHER LINES',/THE SIDE'S OTHER LINES/.test(t),'\n item:',row.item,'\n reply:',(JSON.stringify(row).match(/ENFORCER[^"]{0,400}/)||[''])[0]);}
