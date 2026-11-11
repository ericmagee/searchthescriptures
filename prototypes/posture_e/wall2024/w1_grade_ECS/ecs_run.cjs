const fs=require('fs');
const run=async(rd,src,node,P)=>{const mk=name=>{const r=rd[name];const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];const nd=(P.nodes.find(n=>n.name===name)||{});return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:nd.parameters||{}};};
 const r=rd[node];const sn=r[0].source&&r[0].source[0]&&r[0].source[0].previousNode;const inp=mk(sn);const $input={all:()=>inp.all(),first:()=>inp.first(),item:inp.first()};
 return await new Function('$','$input','return (async()=>{\n'+src+'\n})();')(mk,$input);};
const P=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/parent_s141_ECS.json','utf8'));
const ids=x=>x.flatMap(i=>i.json.ids||[]);const cr=x=>x.flatMap(i=>i.json.code_rows||[]);
async function one(rd,label){for(const node of ['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build']){if(!rd[node])continue;const f='ecs_'+node.replace(/ /g,'_');
 let o,n;try{o=await run(rd,fs.readFileSync(f+'.old.js','utf8'),node,P);n=await run(rd,fs.readFileSync(f+'.new.js','utf8'),node,P);}catch(e){console.log(label,node,'ERROR',e.message);continue;}
 const stored=rd[node][0].data.main.flat().map(x=>x.json);const eq=JSON.stringify(o.map(i=>i.json.ids))===JSON.stringify(stored.map(i=>i.ids));
 const oc=ids(o).filter(x=>x.rule==='E-COL'),nc=ids(n).filter(x=>x.rule==='E-COL');const rows=cr(n).filter(r=>/pkgECS/.test(r.cure_reason||''));
 const gone=oc.filter(x=>!nc.some(y=>y.seat===x.seat&&y.flagged_line===x.flagged_line));
 const oneRow=gone.every(x=>rows.filter(r=>r.seat===x.seat&&r.flagged_line===x.flagged_line).length===1)&&rows.length===gone.length;
 const nonE=ids(o).filter(x=>x.rule!=='E-COL');const keep=nonE.every(x=>ids(n).some(y=>y.seat===x.seat&&y.flagged_line===x.flagged_line&&y.rule===x.rule))&&ids(n).length-nc.length===nonE.length;
 console.log(label.padEnd(26),node.padEnd(28),'oldReplay=stored',eq,'| E-COL',oc.length,'->',nc.length,'| set aside',gone.length,'rows',rows.length,'one row each',oneRow,'| non-E-COL kept',keep,'| roles',[...new Set(rows.map(r=>r.seat_role))].join(','));
 for(const x of gone)console.log('    set aside:',x.seat,'|',x.flagged_line.slice(0,110));}}
module.exports={one};
if(require.main===module)(async()=>{const W='/mnt/project-files/wall2024/';for(const f of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const ex=JSON.parse(fs.readFileSync(W+f,'utf8'));await one(ex.data.resultData.runData,f);}})();
