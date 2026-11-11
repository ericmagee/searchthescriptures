// pkgEKR replay: old (joint parent) and new rebuilt enforcer builders on a stored export's node outputs; compare E-KEY and E-RES items.
const fs=require('fs');const [,,exF]=process.argv;const ex=JSON.parse(fs.readFileSync(exF,'utf8'));const rd=ex.data.resultData.runData;
const P=JSON.parse(fs.readFileSync(process.env.PARENT,'utf8'));const PW=(P.data||P).workflow||(P.data||P);
const mk=(name)=>{const r=rd[name];const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];const node=(PW.nodes.find(n=>n.name===name)||{});return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:node.parameters||{}};};
const $=n=>mk(n);
const run=async(src,node)=>{const r=rd[node];const srcNode=r[0].source&&r[0].source[0]&&r[0].source[0].previousNode;const inp=mk(srcNode);const $input={all:()=>inp.all(),first:()=>inp.first(),item:inp.first()};
 return await new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,$input);};
(async()=>{console.log('#',exF.split('/').pop());for(const node of ['Judge Enforcer Build','Alt Judge Enforcer Build']){if(!rd[node]){console.log(node,'NOT RUN');continue;}
 const f='pkgEKR/src/'+node.replace(/ /g,'_');let o,n;try{o=await run(fs.readFileSync(f+'.old.js','utf8'),node);n=await run(fs.readFileSync(f+'.new.js','utf8'),node);}catch(e){console.log(node,'ERROR',e.message);continue;}
 const bodyLen=x=>x.reduce((s,i)=>s+JSON.stringify(i.json.body||'').length,0);const ids=x=>x.flatMap(i=>i.json.ids||[]);const cr=x=>x.flatMap(i=>i.json.code_rows||[]);
 const K=r=>x=>x.rule===r;const ok=ids(o),nk=ids(n);
 const gone=ok.filter(x=>!nk.some(y=>y.rule===x.rule&&y.seat===x.seat&&y.flagged_line===x.flagged_line));const rows=cr(n).filter(r=>/pkgEKR/.test(r.cure_reason||''));
 console.log('==',node,'| calls',o.length,'->',n.length,'| E-KEY',ok.filter(K('E-KEY')).length,'->',nk.filter(K('E-KEY')).length,'| E-RES',ok.filter(K('E-RES')).length,'->',nk.filter(K('E-RES')).length,'| other ids',ok.length,'->',nk.length,'| body chars diff',bodyLen(n)-bodyLen(o));
 console.log('  not asked',gone.length,'| rows',rows.length,'| each has its row',gone.every(x=>rows.some(r=>r.seat===x.seat&&r.flagged_line===x.flagged_line&&r.rule===x.rule)),'| only E-KEY/E-RES gone',gone.every(x=>/E-KEY|E-RES/.test(x.rule)),'| roles',[...new Set(rows.map(r=>r.seat_role))].join(','));
 const E=[...(rd['Judge Enforcer Record']?rd['Judge Enforcer Record'][0].data.main.flat()[0].json.enf428_rows||[]:[]),...(rd['Alt Judge Enforcer Record']?rd['Alt Judge Enforcer Record'][0].data.main.flat()[0].json.enf428_rows||[]:[])];
 for(const x of gone){const s=E.find(r=>r.rule===x.rule&&r.seat===x.seat&&r.flagged_line===x.flagged_line);console.log('   ',x.rule,x.seat,x.flagged_line.slice(0,90),'| stored:',s?(s.cure_reason||'').slice(0,70):'(none)');}
}})();
