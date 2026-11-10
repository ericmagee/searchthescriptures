// W2: Judge Enforcer and Alt Judge Enforcer, live s108 record output (run_records.cjs): each NO VERDICT or NO ANSWER answer, with any reply line naming its id.
// Rows (form notes and ruling 443 rows left out) align with the Build ids by index (checked on every stored run).
const fs=require('fs');const D='/mnt/project-files/wall2024/inputs/';const O=process.argv[2];
const saved=(run,n)=>{const f=D+run+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return null;const d=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(d)?d[0]:d;const m=(r.data&&r.data.main)||r.main;return (m&&m[0])||[];};
const txt=j=>{try{return String(j.choices[0].message.content||'');}catch(e){return '';}};
for(const [node,pre] of [['Judge_Enforcer_Record','Judge Enforcer'],['Alt_Judge_Enforcer_Record','Alt Judge Enforcer']]){let tot=0,nv=0,named=[],none={},err={};
 for(const f of fs.readdirSync(O).filter(f=>f.endsWith('_'+node+'.json')&&(pre.startsWith('Alt')||!/_Alt_/.test(f))).sort()){const x=JSON.parse(fs.readFileSync(O+'/'+f));if(!x.ok)continue;
  const rows=(x.out[0].json.enf428_rows||[]).filter(r=>!/^form note/.test(r.cure_reason)&&!/ruling 443/.test(r.cure_reason));const ids=(saved(x.run,pre+' Build')||[]).flatMap(b=>b.json.ids||[]);
  const calls=[...(saved(x.run,pre+' Call deepseek')||[]),...(saved(x.run,pre+' Retry Call deepseek')||[])];const reps=calls.map(i=>txt(i.json)).join('\n').split('\n');
  rows.forEach((r,k)=>{tot++;if(!/^ENFORCER NO VERDICT/.test(r.cure_reason))return;nv++;const id=String(ids[k].id);
   const ls=reps.filter(l=>new RegExp('\\b'+id.replace('.','\\.')+'\\b','i').test(l));
   if(ls.length)named.push(x.run+' '+id+' ('+r.seat+', '+r.rule+'; judge '+(ids[k].grade||'?')+')\n     '+ls.map(l=>l.trim().slice(0,320)).join('\n     '));
   else{none[x.run]=(none[x.run]||0)+1;if(r.reply_error)err[x.run]=String(r.reply_error).slice(0,80);}});}
 console.log(pre+': answers '+tot+', NO VERDICT '+nv+'; a reply line names the id: '+named.length+'; no line: '+Object.values(none).reduce((a,b)=>a+b,0)+' by run '+JSON.stringify(none)+' errors '+JSON.stringify(err));
 for(const z of named)console.log('  '+z);console.log('');}
