// W1 8247 condition 2: are all items site 2 adds TRIAL and record-only, and does any non-TRIAL item change its number, pairing or text?
const o=require(require('path').resolve(process.argv[2]));
const trial=x=>!!((x.lay&&x.lay.trial)||/\bTRIAL\b/.test(x.reason||''));
const key=x=>x.rule+'|'+x.item+'|'+x.line;
for(const k of Object.keys(o.s262)){const A=o.s262[k],Z=o.target[k]||[];
 for(let i=0;i<Math.max(A.length,Z.length);i++){const a=(A[i]||{}),z=(Z[i]||{});const ia=a.items||[],iz=z.items||[];if(!ia.length&&!iz.length)continue;
  const ma=new Map(ia.map(x=>[key(x),x])),mz=new Map(iz.map(x=>[key(x),x]));
  const added=iz.filter(x=>!ma.has(key(x))),removed=ia.filter(x=>!mz.has(key(x)));
  const nonTrialRenum=ia.filter(x=>!trial(x)&&mz.has(key(x))&&mz.get(key(x)).sid!==x.sid);
  const trialRenum=ia.filter(x=>trial(x)&&mz.has(key(x))&&mz.get(key(x)).sid!==x.sid);
  console.log(k,'#'+i,'seat',a.seat||z.seat,'| items',ia.length,'->',iz.length,'| added',added.length,'(TRIAL',added.filter(trial).length+')','| removed',removed.length,'(TRIAL',removed.filter(trial).length+')','| non-TRIAL renumbered',nonTrialRenum.length,'| TRIAL renumbered',trialRenum.length,'| msg same',a.msg===z.msg);
  for(const x of added)console.log('   + ',x.sid,x.rule,x.item,trial(x)?'TRIAL':'NOT TRIAL',String(x.reason||'').slice(0,90));
  for(const x of removed)console.log('   - ',x.sid,x.rule,x.item,trial(x)?'TRIAL':'NOT TRIAL');
  for(const x of nonTrialRenum)console.log('   # ',x.sid,'->',mz.get(key(x)).sid,x.rule,x.item);
  const order=(L)=>L.filter(x=>!trial(x)).map(x=>x.sid+':'+x.rule+':'+x.item).join(' ; ');
 }}
