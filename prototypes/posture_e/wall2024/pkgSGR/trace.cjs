// pkgSGR: trace each stored E-SYN DISAGREE row: the stored list sent, the reason, and what the new list adds or drops for that sentence.
const fs=require('fs');const W='/mnt/project-files/wall2024/';const out=fs.readFileSync(__dirname+'/replay_out.txt','utf8');
for(const f of ['ex33371_full.json','ex33490_full.json','ex33497_full.json','ex35173_full.json']){const rd=JSON.parse(fs.readFileSync(W+f,'utf8')).data.resultData.runData;const seen=new Set();
 for(const n of Object.keys(rd).filter(n=>/Judge Enforcer Record$/.test(n)))for(const r of rd[n])for(const br of r.data.main)for(const it of br||[])for(const x of it.json.enf428_rows||[]){
  if(x.rule!=='E-SYN'||!/^ENFORCER DISAGREE/.test(x.cure_reason||''))continue;const k=x.item+'|'+x.response_line;if(seen.has(k))continue;seen.add(k);
  console.log('\n####',f.slice(2,7),x.item,'\n SENTENCE:',String(x.flagged_line).slice(0,400),'\n REASON:',String(x.cure_reason).slice(0,700));
  // stored list: from the Judge Enforcer Build body of that run
  const strs=o=>typeof o==='string'?[o]:o&&typeof o==='object'?Object.values(o).flatMap(strs):[];const B=strs(rd['Judge Enforcer Build'][0].data.main.flat().map(i=>i.json)).join('\n');
  const m=[...B.matchAll(/ITEM Y\d+ \(E-SYN[^\n]*\nTHE SENTENCE: ([^\n]*)\n[\s\S]*?\nANSWER ID: (Y\d+)\.1/g)].find(m=>m[1].trim().slice(0,200)===String(x.flagged_line).trim().slice(0,200));
  console.log(' STORED ITEM:',m?m[2]:'NOT FOUND');if(m){const L=m[0].slice(m[0].indexOf('GIVE GROUND')+55,m[0].indexOf('\nANSWER ID')).split('\n');console.log(' STORED LIST ('+L.length+' entries):');for(const l of L)console.log('    | '+l.slice(0,170));}}}
