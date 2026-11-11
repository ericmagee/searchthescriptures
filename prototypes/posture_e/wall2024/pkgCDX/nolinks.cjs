// Plant: Close Enforcer Build item with no links (never seen in stored runs): pkgCLG rebuilds links; pkgCDX leaves them empty, so rows fail the declared-link check, visibly.
const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const rec=f=>g(f).nodes.find(x=>x.name==='Close Enforcer Record').parameters.jsCode;
const RD=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34852_full.json','utf8')).data.resultData.runData;
const b=RD['Close Enforcer Build'][0].data.main[0].map(i=>{const j=JSON.parse(JSON.stringify(i.json));delete j.links;return {json:j};});
(async()=>{for(const [k,f] of [['pkgCLG','parent_s120_CLG.json'],['pkgCDX','parent_s120_CLG_CDX.json']]){const o=await run(rec('/mnt/project-files/wall2024/'+f),'Close Enforcer Record',RD,{'Close Enforcer Build':[b]});
 const j=o.err?{err:o.err}:(o[0].json||o[0]);const c=j.cec||j;console.log(k,o.err?'ERR '+o.err:JSON.stringify((c.rows||[]).map(r=>r.id+'|'+r.link+'|'+r.status+'|'+(r.note||'').slice(0,90)))+' confirmed '+JSON.stringify((c.confirmed||[]).map(x=>x.side+' '+x.link)));}})();
