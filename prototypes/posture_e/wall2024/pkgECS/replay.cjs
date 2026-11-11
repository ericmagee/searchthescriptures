// pkgECS replay: run the old (s140) and new rebuilt Judge Enforcer Build / Alt Judge Enforcer Build on a stored export's node outputs; compare.
const fs=require('fs');const [,,exF]=process.argv;const ex=JSON.parse(fs.readFileSync(exF,'utf8'));const rd=ex.data.resultData.runData;const WD=ex.workflowData;
const P=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/parent_s141_ECS.json','utf8'));
const mk=(name)=>{const r=rd[name];const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];const node=(P.nodes.find(n=>n.name===name)||{});return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:node.parameters||{}};};
const $=n=>mk(n);
const run=async(src,node)=>{const r=rd[node];if(!r)return null;const srcNode=r[0].source&&r[0].source[0]&&r[0].source[0].previousNode;const inp=mk(srcNode);const $input={all:()=>inp.all(),first:()=>inp.first(),item:inp.first()};
 return await new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,$input);};
(async()=>{for(const node of ['Judge Enforcer Build','Alt Judge Enforcer Build']){if(!rd[node]){console.log(node,'NOT RUN in this export');continue;}
 const f='pkgECS/src/'+node.replace(/ /g,'_');let o,n;try{o=await run(fs.readFileSync(f+'.old.js','utf8'),node);n=await run(fs.readFileSync(f+'.new.js','utf8'),node);}catch(e){console.log(node,'ERROR',e.message);continue;}
 const stored=rd[node][0].data.main.flat().map(x=>x.json);
 const bodyLen=x=>x.reduce((s,i)=>s+JSON.stringify(i.json.body||'').length,0);const ids=x=>x.flatMap(i=>i.json.ids||[]);const cr=x=>x.flatMap(i=>i.json.code_rows||[]);
 console.log('==',node,'| old replay equals stored output:',JSON.stringify(o.map(i=>i.json.ids))===JSON.stringify(stored.map(i=>i.ids)));
 const oc=ids(o).filter(x=>x.rule==='E-COL'),nc=ids(n).filter(x=>x.rule==='E-COL');
 console.log(' calls old',o.length,'new',n.length,'| E-COL ids old',oc.length,'new',nc.length,'| other ids old',ids(o).length-oc.length,'new',ids(n).length-nc.length,'| request body chars old',bodyLen(o),'new',bodyLen(n),'diff',bodyLen(n)-bodyLen(o));
 const gone=oc.filter(x=>!nc.some(y=>y.seat===x.seat&&y.flagged_line===x.flagged_line));
 const newRows=cr(n).filter(r=>/pkgECS/.test(r.cure_reason||''));
 console.log(' E-COL ids no longer asked',gone.length,'| NOT ASKED code rows',newRows.length,'| every one has its row',gone.every(x=>newRows.some(r=>r.seat===x.seat&&r.flagged_line===x.flagged_line)));
 const E=[...(rd['Judge Enforcer Record']?rd['Judge Enforcer Record'][0].data.main.flat()[0].json.enf428_rows:[]),...(rd['Alt Judge Enforcer Record']?rd['Alt Judge Enforcer Record'][0].data.main.flat()[0].json.enf428_rows:[])];
 for(const x of gone){const s=E.find(r=>r.rule==='E-COL'&&r.seat===x.seat&&r.flagged_line===x.flagged_line);console.log('  ',x.seat,x.item,'| stored verdict:',s?(s.cure_reason||'').slice(0,60):'(no stored row)');}
 const keepNon=ids(o).filter(x=>x.rule!=='E-COL').every(x=>ids(n).some(y=>y.id===x.id||(y.seat===x.seat&&y.flagged_line===x.flagged_line&&y.rule===x.rule)));console.log(' every non-E-COL item still asked:',keepNon);
}})();
