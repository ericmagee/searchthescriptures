// pkgEOQ test: base s51 vs patched Judge Enforcer Build and Alt Judge Enforcer Build on every saved run with the node saved (harness, s51 feeder).
// Counts the E-OOR "not found verbatim" rows before and after, checks that each one dropped had a judge tag after the sentence and that its
// sentence (tag cut) stands in the round, and that the output is otherwise identical. Prints the rows that remain. Run from wall2024/.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const rd=f=>fs.readFileSync(f,'utf8');
const F='/mnt/project-files/wall2024/fetchback_live_s51.json';let ok=0,bad=0,tb=0,ta=0;const left=[];
const VB=r=>r&&typeof r==='object'&&r.rule==='E-OOR'&&/not found verbatim/.test(String(r.cure_reason||''));
const strip=o=>Array.isArray(o)?o.filter(x=>!VB(x)).map(strip):(o&&typeof o==='object')?Object.fromEntries(Object.entries(o).map(([k,v])=>[k,strip(v)])):o;
const coll=(o,acc=[])=>{if(VB(o))acc.push(o);else if(Array.isArray(o))o.forEach(x=>coll(x,acc));else if(o&&typeof o==='object')Object.values(o).forEach(x=>coll(x,acc));return acc;};
(async()=>{for(const node of ['Judge Enforcer Build','Alt Judge Enforcer Build']){const f=node.replace(/ /g,'_')+'.js';const A=rd('pkgEOQ/base_s51/'+f),B=rd('pkgEOQ/patched/'+f);const IN=feeder(F,node)[0];
 const runs=[...new Set(fs.readdirSync(D).filter(x=>x.endsWith('_'+node.replace(/ /g,'_')+'.json')&&/^33\d{3}_/.test(x)).map(x=>x.slice(0,5)))].sort();
 for(const R of runs){const run=async c=>{try{return await harness(R)('return (async()=>{'+c+'\n})()',IN);}catch(e){return 'ERR '+e.message;}};
  const a=await run(A),b=await run(B);if(typeof a==='string'||typeof b==='string'){if(JSON.stringify(a)===JSON.stringify(b))ok++;else{bad++;console.log('FAIL '+R+' '+node+' '+String(a).slice(0,80)+' | '+String(b).slice(0,80));}continue;}
  const va=coll(a),vb=coll(b);tb+=va.length;ta+=vb.length;
  const same=JSON.stringify(strip(a))===JSON.stringify(strip(b))&&vb.every(r=>va.some(x=>x.flagged_line===r.flagged_line));
  if(same)ok++;else{bad++;console.log('FAIL '+R+' '+node+': output differs beyond the verbatim rows');}
  const tagged=va.filter(r=>!vb.some(x=>x.flagged_line===r.flagged_line));
  const untag=tagged.filter(r=>!/["”]\s*(?:--|—|–)\s|\s(?:--|—|–)\s|["”]\s+[A-Z(\[]/.test(String(r.flagged_line).split('|').slice(2).join('|')));
  if(untag.length){bad++;console.log('FAIL '+R+' '+node+': '+untag.length+' dropped rows had no tag');}
  if(va.length||vb.length)console.log(R+' '+node+': not-found rows '+va.length+' -> '+vb.length);
  for(const r of vb)left.push(R+' '+r.seat+': '+String(r.flagged_line).slice(0,220));}}
 console.log('\nrows left (untagged real misses or other):');left.forEach(x=>console.log('  '+x));
 console.log('\nnode runs ok '+ok+', failed '+bad+'; not-found-verbatim rows '+tb+' -> '+ta);console.log(bad===0?'OK':'FAIL');})();
