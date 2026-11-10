// W2 form-loss scan, Judge Enforcer Record and Alt Judge Enforcer Record (live s108 outputs from run_records.cjs). Usage: node study_form_loss/scan_jer.cjs <out dir>
const fs=require('fs');const O=process.argv[2];const D='/mnt/project-files/wall2024/inputs/';
const saved=(run,n)=>{const f=D+run+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return null;const d=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(d)?d[0]:d;const m=(r.data&&r.data.main)||r.main;return (m&&m[0])||[];};
const txt=j=>{try{return String(j.choices[0].message.content||'');}catch(e){return '';}};
// the three ENFORCER line patterns of live s108 Judge Enforcer Record (copied from the node)
const P=[/^ENFORCER\s*:\s*(?:(?:JUDGE|SEAT)\s+)?([A-Za-z][\w.-]*)\s*\(\s*(?:(?:ITEM|ANSWER|ID)\s+)?([BVKYHZPRS]\d+(?:\.\d+)?)\s*\)\s*((?:--|—|–|-)[\s\S]*)$/i,
/^ENFORCER\s*:\s*(?:(?:ITEM|ANSWER|ID)\s+)?([BVKYHZPRS]\d+(?:\.\d+)?)(?:\s*(?:\(\s*[A-Za-z][\w.-]*\s*\)|,\s*[A-Za-z][\w.-]*))?\s*(?:--|—|–|-)\s*(AGREE|DISAGREE|NO ANSWER)\s*(?:--|—|–|-)?\s*(?:RIGHT\s*:\s*(MEETS|MISSES|NOT VOID|VOID|BROKEN|STANDS|UNDERDETERMINED|COUNTED|SPARED|DOES NOT FOLLOW|FOLLOWS|TRUE|OVERSTATED|SAME GROUND|DIFFERENT GROUND)\s*(?:--|—|–|-)?)?\s*(.*)$/i,
/^ENFORCER\s*:\s*(?:(?:JUDGE|SEAT)\s+)?([A-Za-z][\w.-]*)\s*(?:--|—|–|-)\s*(AGREE|DISAGREE|NO ANSWER)\s*(?:--|—|–|-)?\s*(?:RIGHT\s*:\s*(MEETS|MISSES|NOT VOID|VOID|BROKEN|STANDS|UNDERDETERMINED|COUNTED|SPARED|DOES NOT FOLLOW|FOLLOWS|TRUE|OVERSTATED|SAME GROUND|DIFFERENT GROUND)\s*(?:--|—|–|-)?)?\s*(.*)$/i];
for(const [node,pre] of [['Judge Enforcer Record','Judge Enforcer'],['Alt Judge Enforcer Record','Alt Judge Enforcer']]){
 let runs=0,rowsN=0,nv=0,nvLine=[],nvNone=0,lines=0,unread=[];
 for(const f of fs.readdirSync(O).filter(f=>f.endsWith('_'+node.replace(/ /g,'_')+'.json')&&(node.startsWith('Alt')||!/_Alt_/.test(f))).sort()){const x=JSON.parse(fs.readFileSync(O+'/'+f));if(!x.ok)continue;
  const rows=x.out[0].json.enf428_rows||[];if(!rows.length)continue;runs++;rowsN+=rows.length;
  const reps=[...(saved(x.run,pre+' Call deepseek')||[]),...(saved(x.run,pre+' Retry Call deepseek')||[])].map(i=>txt(i.json)).join('\n').split('\n');
  for(const l of reps){const u=l.replace(/[*_`]+/g,'').trim();if(!/^ENFORCER\s*:/i.test(u))continue;lines++;if(!P.some(p=>p.test(u)))unread.push(x.run+' '+u.slice(0,260));}
  const ids=(saved(x.run,pre+' Build')||[]).flatMap(b=>b.json.ids||[]);
  for(const r of rows){if(!/^ENFORCER NO VERDICT/.test(r.cure_reason))continue;nv++;const mine=ids.filter(i=>i.flagged_line===r.flagged_line&&i.seat===r.seat).map(i=>i.id);
   const ls=reps.filter(l=>mine.some(id=>new RegExp('\\b'+id.replace('.','\\.')+'\\b').test(l))).map(l=>l.trim().slice(0,300));
   if(ls.length)nvLine.push(x.run+' '+mine.join('/')+' ('+r.seat+', '+r.rule+')\n     '+ls.join('\n     '));else nvNone++;}}
 console.log(node+': runs '+runs+', rows '+rowsN+', NO VERDICT '+nv+' (reply line naming the id: '+nvLine.length+'; none: '+nvNone+'); ENFORCER lines '+lines+', not read by any live pattern: '+unread.length);
 for(const z of nvLine)console.log('  NV '+z);for(const z of unread)console.log('  UNREAD '+z);console.log('');}
