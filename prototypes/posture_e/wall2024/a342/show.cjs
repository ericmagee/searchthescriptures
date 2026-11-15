const fs=require('fs');const D=JSON.parse(fs.readFileSync('../a329/debates.json')).concat(JSON.parse(fs.readFileSync('r37510.json')));
const RM={CR1:'claude_r1',DR1:'engine_r1',CR2:'claude_r2',DR2:'engine_r2',CR3:'engine_r3',DR3:'challenger_r3',CR4:'defender_r4',DR4:'challenger_r4'};
const want=process.argv.slice(2);
for(const w of want){const [tok,rd]=w.split(':');const r=D.find(x=>x.run_token.includes(tok));const t=r[RM[rd]];
 for(const p of t.split(/\n[ \t]*\n/)){if(!/\[L2\]/.test(p.split('\n')[0]))continue;const pz=p.replace(/\b[GH]\d+/g,'');
  const hits=[...pz.matchAll(/(?<![\w:])\d{1,3}:\d{1,3}\b|(?<![\w.])(?:vv?\.|verses?\b)\s*\d{1,3}(?:\s*[–—-]\s*\d{1,3})?(?![\d:])/gi)].map(x=>x[0]);
  if(hits.length)console.log('== '+w+' hits: '+JSON.stringify(hits)+'\n'+p.slice(0,700)+'\n');}}
