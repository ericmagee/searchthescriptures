// W2: per answer id, Judge Enforcer and Alt Judge Enforcer: ids with no line read by a live s108 pattern, split into "a line names the id" and "no line".
const fs=require('fs');const D='/mnt/project-files/wall2024/inputs/';
const saved=(run,n)=>{const f=D+run+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return null;const d=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(d)?d[0]:d;const m=(r.data&&r.data.main)||r.main;return (m&&m[0])||[];};
const txt=j=>{try{return String(j.choices[0].message.content||'');}catch(e){return '';}};
const src=fs.readFileSync(__dirname+'/scan_jer.cjs','utf8');const P=eval('['+src.split('const P=[')[1].split('];')[0]+']');
const runs=fs.readdirSync(D).filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]).sort();
for(const pre of ['Judge Enforcer','Alt Judge Enforcer']){let n=0,read=0,named=[],none=0;const byRun={};
 for(const run of runs){const B=saved(run,pre+' Build');if(!B)continue;const ids=B.flatMap(b=>b.json.ids||[]);if(!ids.length)continue;
  const reps=[...(saved(run,pre+' Call deepseek')||[]),...(saved(run,pre+' Retry Call deepseek')||[])].map(i=>txt(i.json)).join('\n').split('\n').map(l=>l.replace(/[*_`]+/g,'').trim());
  const got=new Set();for(const u of reps){for(const p of P){const m=u.match(p);if(m){got.add(String(/^[BVKYHZPRS]\d/i.test(m[1])?m[1]:m[2]).toUpperCase());break;}}}
  for(const it of ids){n++;const id=String(it.id).toUpperCase();if(got.has(id)){read++;continue;}const ls=reps.filter(l=>new RegExp('\\b'+id.replace('.','\\.')+'\\b','i').test(l));
   if(ls.length)named.push(run+' '+id+' ('+it.seat+', '+it.rule+')\n     '+ls.map(l=>l.slice(0,300)).join('\n     '));else{none++;byRun[run]=(byRun[run]||0)+1;}}}
 console.log(pre+': ids '+n+', read '+read+', unread with a line naming the id '+named.length+', no line at all '+none+' '+JSON.stringify(byRun));for(const z of named)console.log('  '+z);console.log('');}
