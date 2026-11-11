const {load,record}=require(process.cwd()+'/pkgRCL/rev3_regrade/h.cjs');const W='/mnt/project-files/wall2024/';
(async()=>{const rd=load('34852');const B=JSON.parse(JSON.stringify(rd['Close Enforcer Build'][0].data.main[0][0].json));
for(const [nm,f] of [['C4 no links',b=>{delete b.links;}],['C5 links {DEFENDER:[]} only',b=>{b.links={DEFENDER:[],CHALLENGER:b.links.CHALLENGER};}]]){const b=JSON.parse(JSON.stringify(B));f(b);
 for(const [t,p] of [['CLG',W+'parent_s120_CLG.json'],['CDX',W+'parent_s120_CLG_CDX.json']]){const r=await record(p,rd,b);console.log(nm,t,JSON.stringify(r.confirmed),JSON.stringify(r.rows),r.err||'');}}})();
