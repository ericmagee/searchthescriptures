const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};const code=(W)=>W.nodes.find(x=>x.name==='Close Enforcer Build').parameters.jsCode;
const A=code(g('/mnt/project-files/wall2024/fetchback_live_s130.json')),B=code(g('/mnt/project-files/wall2024/parent_s130_RCH.json'));
const strip=o=>JSON.stringify(o).replace(/"at":"[^"]*"/g,'');let T={runs:0,eq:0,diff:0,err:0};
(async()=>{for(const f of fs.readdirSync('/mnt/project-files/wall2024/').filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){let rd;try{rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f)).data.resultData.runData;}catch(e){continue;}
 if(!rd['Close Enforcer Build'])continue;const a=await run(A,'Close Enforcer Build',rd),b=await run(B,'Close Enforcer Build',rd);
 if(a.err||b.err){T.err++;console.log(f,'ERR',a.err,b.err);continue;}T.runs++;
 if(strip(a)===strip(b)){T.eq++;continue;}T.diff++;
 const ca=a.flatMap(j=>j.cands||[]),cb=b.flatMap(j=>j.cands||[]);const ka=new Set(ca.map(c=>JSON.stringify(c)));
 const add=cb.filter(c=>!ka.has(JSON.stringify(c))),kb=new Set(cb.map(c=>JSON.stringify(c))),gone=ca.filter(c=>!kb.has(JSON.stringify(c)));
 console.log(f,'cands',ca.length,'->',cb.length);for(const c of add)console.log('  + ',c.id,c.side,'LINK',c.n,c.earlier_round,'|',c.earlier_q.slice(0,90),'|',c.closing_q.slice(0,70));for(const c of gone)console.log('  - ',c.id,c.side,'LINK',c.n,c.earlier_q.slice(0,90));
 const ha=a.map(j=>j.body?j.body.messages.map(m=>m.content).join(''):'').join('').length,hb=b.map(j=>j.body?j.body.messages.map(m=>m.content).join(''):'').join('').length;console.log('  request chars',ha,'->',hb,'(+'+(hb-ha)+')');}
console.log('TOTAL',JSON.stringify(T));})();
