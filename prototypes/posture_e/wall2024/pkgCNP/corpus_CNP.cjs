// Close Enforcer Build, live s151 vs pkgCNP, on the Final Output rounds of every stored export with node data.
const fs=require('fs');const D='/mnt/project-files/wall2024/';
const code=f=>JSON.parse(fs.readFileSync(D+f,'utf8')).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
const LIVE=code('fetchback_live_s151.json'),PAR=code((process.env.PKG||'parent_s151_CNP.json'));
const run=(js,F)=>new Function('$',js)(n=>({'Init Seats':{isExecuted:true,first:()=>({json:{run_token:'T'}})},'Resolve Seats':{isExecuted:true,first:()=>({json:{deepseek:{api_model:'deepseek-flash',max_tokens:16000}}})},'Final Output':{isExecuted:true,first:()=>({json:F})},'Regrade Load':{isExecuted:false,first:()=>{throw new Error('no')}}})[n]||{isExecuted:false,first:()=>{throw new Error('no node '+n)},all:()=>[]});
for(const f of fs.readdirSync(D).filter(f=>/^ex\d+_full\.json$/.test(f))){let F;try{const rd=JSON.parse(fs.readFileSync(D+f,'utf8')).data.resultData.runData;const r=rd['Final Output'];if(!r||!r[r.length-1].data){console.log(f,'no Final Output data');continue;}F=r[r.length-1].data.main[0][0].json;}catch(e){console.log(f,'ERR',e.message);continue;}
 const a=run(LIVE,F),b=run(PAR,F);const ca=a.flatMap(x=>x.json.cands||[]),cb=b.flatMap(x=>x.json.cands||[]);
 const strip=o=>JSON.stringify(o.map(x=>({...x.json,body:null,cands:(x.json.cands||[]).filter(c=>!/pkgCNP/.test(c.by))})));
 console.log(f,'cands live',ca.length,'CNP',cb.length,'| without the new ones identical:',strip(a)===strip(b));
 for(const c of cb.filter(c=>/pkgCNP/.test(c.by)))console.log('   +',c.id,c.side,'LINK',c.n,'| E['+c.earlier_round+']',c.earlier_q.slice(0,70),'| C',c.closing_q.slice(0,90));}
