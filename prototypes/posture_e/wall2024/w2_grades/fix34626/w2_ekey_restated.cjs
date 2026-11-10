const chain=require(process.cwd()+'/w2_grades/fix34626/w2_chain.cjs');
(async()=>{for(const to of ['KEYSTONE: D6 -- STANDS','RESTATED: KEYSTONE: D6 -- STANDS','- KEYSTONE: D6 -- STANDS']){
 const mut=rd=>JSON.parse(JSON.stringify(rd).replace(/(\\+n)KEYSTONE: D6 -- STANDS/g,(a,b)=>b+to));
 const c=await chain('/mnt/project-files/wall2024/fetchback_live_s110.json',mut);const it=(c.over['Send Back Build']||[[]])[0].flatMap(x=>(x.json.items||[]).filter(i=>i.rule==='E-KEY').map(i=>x.json.seat));console.log(JSON.stringify(to),'s110 E-KEY items:',JSON.stringify(it));}})();
