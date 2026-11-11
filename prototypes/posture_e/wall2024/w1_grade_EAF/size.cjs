const fs=require('fs');const {run,V,P}=require('./g.cjs');
(async()=>{for(const r of ['34852','34726','34703','34780']){const rd=JSON.parse(fs.readFileSync(P+'ex'+r+'_full.json')).data.resultData.runData;const o={};
 for(const v of ['live','SU','AU']){const out=await run(V[v],'Judge Enforcer Build',rd);let n=0,calls=0;for(const it of out){const b=it.body;if(!b||!b.messages)continue;calls++;n+=b.messages.reduce((s,m)=>s+String(m.content).length,0);}o[v]={n,calls};}
 console.log(r,'prompt chars live',o.live.n,'calls',o.live.calls,'| SU',o.SU.n-o.live.n,'calls',o.SU.calls,'| AU',o.AU.n-o.live.n,'calls',o.AU.calls);}})();
