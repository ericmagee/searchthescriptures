// Citation-check replay, runs 32205 and 32212: Citation Scan and Quote Compare base vs new (Quote Report live), with Cited Verses and Find Words
// emulated from kjv_verses rows read by SQL (data/kjv_rows.json, data/kjv_find.json). The base replay is checked against the stored
// citation_check (data/citation_check.json). Lists every item whose status or reference changed, old -> new.
const C=require('./cite_lib.cjs');const RL=require('./replay_lib.cjs');const fs=require('fs');
const ST=JSON.parse(fs.readFileSync(__dirname+'/../data/citation_check.json','utf8'));
const key=i=>i.side+'|'+i.round+'|'+(i.link==null?'':i.link)+'|'+i.ref;const cnt=a=>{const o={};a.forEach(i=>{const s=i.status.replace(/ (FROM|AT|IN) .*/,'');o[s]=(o[s]||0)+1;});return o;};
for(const n of ['32205','32212']){const r=RL.run(n);const b=C.run('base',r).report,w=C.run('new',r).report;const st=ST.find(x=>x.run_token.startsWith('ODV1-'+n)).citation_check;
 const sm=st.items.map(i=>key(i)+'='+i.status).sort().join('\n')===b.items.map(i=>key(i)+'='+i.status).sort().join('\n');
 console.log('\n=== run',n,'| base replay equals the stored check:',sm,'| stored',JSON.stringify(cnt(st.items)),'\n    base',JSON.stringify(cnt(b.items)),'\n    new ',JSON.stringify(cnt(w.items)));
 if(!sm){const S=new Set(st.items.map(i=>key(i)+'='+i.status)),B=new Set(b.items.map(i=>key(i)+'='+i.status));console.log('    stored not in base replay:',[...S].filter(x=>!B.has(x)).join('; ')||'-');console.log('    base replay not stored:',[...B].filter(x=>!S.has(x)).join('; ')||'-');}
 const bk=b.items.map(i=>({k:key(i),s:i.status,q:i.quote})),wk=w.items.map(i=>({k:key(i),s:i.status,q:i.quote}));
 const used=new Set();
 for(const x of bk){const y=wk.findIndex((z,j)=>!used.has(j)&&z.q===x.q&&z.k.split('|').slice(0,2).join()===x.k.split('|').slice(0,2).join());if(y<0){console.log('  GONE   ',x.k,x.s);continue;}used.add(y);const z=wk[y];
  if(z.k!==x.k||z.s!==x.s)console.log('  CHANGED',x.k,x.s,'->',z.k,z.s);}
 wk.forEach((z,j)=>{if(!used.has(j))console.log('  NEW    ',z.k,z.s);});
 console.log('  true flags kept (non-MATCHES in both, same ref):',bk.filter(x=>x.s!=='MATCHES'&&x.s!=='CITED VERSE DOES NOT EXIST').filter(x=>wk.some(z=>z.k===x.k&&z.s===x.s&&z.q===x.q)).map(x=>x.k.split('|')[3]+' '+x.s).join('; '));}
