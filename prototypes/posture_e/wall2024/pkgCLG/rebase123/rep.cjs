const fs=require('fs');const run=require('../../pkgKSR/run_node.cjs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const P='/mnt/project-files/wall2024/';
const V={s123:L(P+'fetchback_live_s123.json'),CLG:L(P+'parent_s123_CLG.json'),CDX:L(P+'parent_s123_CLG_CDX.json')};const R='Close Enforcer Record';
const ex=fs.readdirSync(P).filter(x=>/^ex\d+_full\.json$/.test(x));
(async()=>{for(const e of ex){const RD=JSON.parse(fs.readFileSync(P+e,'utf8')).data.resultData.runData;if(!RD[R]){console.log(e,'record NOT REACHED');continue;}
 const o={};for(const k in V){try{o[k]=JSON.stringify(await run(V[k].code(R),R,RD));}catch(x){o[k]='ERR '+x.message;}}
 const st=JSON.stringify(RD[R][0].data.main[0].map(i=>i.json));
 console.log(e,'| s123==stored',o.s123===JSON.stringify(JSON.parse(o.s123).map(i=>i.json||i))||o.s123.includes('ERR')?'?':'', '| CLG==s123',o.CLG===o.s123,'| CDX==CLG',o.CDX===o.CLG,'|',o.s123.slice(0,40));}})();
