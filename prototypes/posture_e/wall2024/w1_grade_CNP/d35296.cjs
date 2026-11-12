process.env.BASE=process.env.BASE;const fs=require('fs');process.argv[2]=__dirname+'/p.json';const {LV,PK,run}=require('../replay_base.cjs');
(async()=>{const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35296_full.json','utf8')).data.resultData.runData;const n='Close Enforcer Build';
const sc=rd[n][0].source[0];const inp=rd[sc.previousNode][sc.previousNodeRun||0].data.main[sc.previousNodeOutput||0]||[];
const a=await run(LV,rd,n,inp),b=await run(PK,rd,n,inp);const A=a.map(x=>x.json),B=b.map(x=>x.json);
for(let i=0;i<B.length;i++){const ca=(A[i]&&A[i].cands)||[],cb=B[i].cands||[];console.log('item',i,'cands live',ca.length,'pkg',cb.length);for(const c of cb.filter(c=>!ca.some(x=>x.id===c.id&&x.closing_q===c.closing_q)))console.log('  NEW',c.id,c.side,'LINK',c.n,c.by,'['+c.earlier_round+']',c.earlier_q.slice(0,90),'<->',c.closing_q);
 const bl=JSON.stringify(B[i].body||'').length,al=JSON.stringify((A[i]||{}).body||'').length;console.log('  body chars live',al,'pkg',bl);}})();
