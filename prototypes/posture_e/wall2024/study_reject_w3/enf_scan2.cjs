// W3 scan, part 2: per debate, reply lines whose id is not in the plain form against rows the live record step leaves with NO VERDICT. Shows which odd forms the live code reads.
const {fs,IN,LIVE,saved,run}=require('./h.cjs');const txtOf=c=>{const j=c&&c.json||{};return (j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content)||'';};
const SETS=[['Enforcer Record','enf421',['Enforcer Call deepseek','Enforcer Retry Call deepseek'],'Enforcer Retry Call deepseek'],['Judge Enforcer Record','enf428',['Judge Enforcer Call deepseek','Judge Enforcer Retry Call deepseek'],'Judge Enforcer Retry Call deepseek'],['Alt Judge Enforcer Record','enf428',['Alt Judge Enforcer Call deepseek','Alt Judge Enforcer Retry Call deepseek'],'Alt Judge Enforcer Retry Call deepseek']];
const idForm=l=>{const m=l.match(/^\s*\**ENFORCER:?\**\s*(.*?)\s*--/);if(!m)return 'NO ENFORCER HEAD';return m[1].replace(/\d+/g,'n');};
(async()=>{for(const [node,key,calls,inp] of SETS){const runs=fs.readdirSync(IN).map(f=>(f.match(new RegExp('^(\\d+)_'+calls[0].replace(/ /g,'_')+'\\.json$'))||[])[1]).filter(Boolean).sort();
 const forms={};const per=[];let lastRun={};
 for(const r of runs){let o;try{o=await run(LIVE,r,node,null,inp);}catch(e){continue;}const j=o[0].json;const s=j[key];if(!s||s.skipped)continue;const R=j[key+'_rows']||[];
  const nv=R.filter(x=>/^(ENFORCER )?NO VERDICT/.test(String(x.cure_reason||''))).length;const L=[];for(const c of calls)for(const one of (saved(r,c)||[]))for(const l of txtOf(one).split('\n').filter(z=>z.trim()))L.push(l);
  const f={};for(const l of L){const k=idForm(l);f[k]=(f[k]||0)+1;if(!forms[k])forms[k]={n:0,runs:new Set(),ex:l.slice(0,120)};forms[k].n++;forms[k].runs.add(r);lastRun[k]=r;}
  const odd=Object.entries(f).filter(([k])=>!/^[A-Z]n(\.n)?$/.test(k));const empty=calls.reduce((a,c)=>a+(saved(r,c)||[]).filter(x=>!txtOf(x)).length,0);
  per.push(r+': rows '+R.length+', lines '+L.length+', NO VERDICT rows '+nv+', calls with no text '+empty+(odd.length?', odd id forms: '+odd.map(([k,v])=>v+' x "'+k+'"').join(', '):''));}
 console.log('\n===== '+node);console.log(' id forms seen (digits shown as n): ');Object.entries(forms).sort((a,b)=>b[1].n-a[1].n).forEach(([k,v])=>console.log('   '+String(v.n).padStart(5)+' x "'+k+'" in '+v.runs.size+' debates, last '+lastRun[k]+(/^[A-Z]n(\.n)?$/.test(k)?'':'   e.g. '+v.ex)));
 console.log(' per debate:');per.forEach(x=>console.log('   '+x));}})();
