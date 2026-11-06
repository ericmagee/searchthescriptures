// Cure-stage replay from the stored log. Run from wall2024/: node corpus/replay_cure.cjs <pkgDir with patched/Panel_Cure_Check.js>...
// Items: the run's kind='cure' log rows per seat (rule, link = item, line = flagged_line, side read from the line). Reply: the seat's cure full_reply.
// rounds: cureRounds(the judge's request body, from the fixture's Panel Build) when a fixture exists; broken: cureBroken(the verdict text at the gate).
// Self-check: the replay of the live library must give the log's own cure_status on every row (column "log"). LIVE uncured counts use ENF_STATUS.
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');
const mk=p=>{const s=rd(p+'/patched/Panel_Cure_Check.js');return new Function('$','$input',s.slice(0,s.indexOf("const PP=$('Panel Payloads')"))+'\nreturn {cureVerdicts,cureRounds,cureBroken,cureJText,ENF_STATUS};')(()=>{throw 0},null);};
const LAB=JSON.parse(rd('corpus/labels.json'));const pk=process.argv.slice(2);
const runs=fs.readdirSync('corpus/raw').filter(f=>/^log_\d+\.json$/.test(f)).map(f=>f.slice(4,9)).sort();
const side=l=>(String(l||'').match(/\b(DEFENDER|CHALLENGER) LINK BROKEN\b/)||[])[1]||null;
const out=[];const S={};
for(const p of pk){const M=mk(p);S[p]={rows:0,same:0,diff:[],lab:[]};
 for(const run of runs){const LG=JSON.parse(rd('corpus/raw/log_'+run+'.json')).filter(x=>x.kind==='cure').sort((a,b)=>a.id-b.id);
  const F=fs.existsSync('corpus/fix_'+run+'.json')?JSON.parse(rd('corpus/fix_'+run+'.json')):null;
  for(const seat of [...new Set(LG.map(x=>x.seat))]){const rows=LG.filter(x=>x.seat===seat);const reply=rows.find(x=>x.full_reply);
   const pool=F?[...(F.PB.judges||[]),...((F.alt&&F.alt.PB&&F.alt.PB.judges)||[])]:[];const J=pool.find(q=>q.seat===seat);
   const B=F?[...(F.bodies||[]),...((F.alt&&F.alt.bodies)||[])].find(b=>b.seat===seat):null;
   const items=rows.map(x=>({rule:x.rule,link:x.item,side:(String(x.item||'').match(/^(DEFENDER|CHALLENGER)\b/)||[])[1]||side(x.flagged_line),line:x.flagged_line}));
   let v;try{v=M.cureVerdicts(items,reply?{ok:true,text:reply.full_reply}:{ok:false,why:'no reply'},B?M.cureBroken(M.cureJText(B.verdict_raw,true)):{},J?M.cureRounds(J.body):{});}catch(e){out.push(p+' '+run+' '+seat+': ERROR '+e.message);continue;}
   let live=0;const lines=[];rows.forEach((x,i)=>{const r=v[i]||{};S[p].rows++;const same=r.status===x.cure_status;if(same)S[p].same++;else S[p].diff.push(run+' '+seat+' '+x.rule+' '+x.item+': log '+x.cure_status+', replay '+r.status);
    if(r.status==='UNCURED'&&M.ENF_STATUS[x.rule]==='LIVE')live++;lines.push('     '+x.rule+' '+x.item+': '+r.status+(same?'':' (log '+x.cure_status+')')+' -- '+String(r.why||'').slice(0,130));});
   const lab=LAB[run]&&LAB[run][seat]&&LAB[run][seat].stage==='cure'?LAB[run][seat]:null;let verdict='';if(lab){const ok=lab.removed===(live>0);verdict=' | W3: '+(lab.removed?'removed':'kept')+' '+(ok?'MATCH':'MISMATCH');S[p].lab.push(run+' '+seat+(ok?' MATCH':' MISMATCH'));}
   out.push(p+' '+run+' '+seat+': cure items '+rows.length+', LIVE uncured '+live+(J?'':' (no rounds: no fixture body)')+verdict);out.push(...lines);}}}
out.push('');for(const p of pk)out.push(p+': replay equals the log status on '+S[p].same+' of '+S[p].rows+' cure rows'+(S[p].diff.length?'; differs: '+S[p].diff.join(' | '):'')+'. W3 cure labels: '+S[p].lab.join(', '));
console.log(out.join('\n'));
