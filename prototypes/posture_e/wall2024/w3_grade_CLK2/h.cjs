const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');
const mk=f=>{let w=JSON.parse(fs.readFileSync(f,'utf8'));w=w.data||w;w=w.workflow||w;const T=w.nodes.find(x=>x.name=="Shared Library").parameters.jsCode;const M=JSON.parse(T.slice(T.lastIndexOf("\n/*MAP*/")+8,T.lastIndexOf("\n/*END*/")));const Lb=JSON.parse(T.slice(T.indexOf("\n/*LIB*/")+8,T.lastIndexOf("\n/*MAP*/")));
 return n=>M[n]?M[n].p.map(e=>typeof e==="number"?Lb[e]:typeof e[0]==="string"?e[0]:Lb.slice(e[0],e[1]+1).join("\n")).join("\n"):w.nodes.find(z=>z.name===n).parameters.jsCode;};
const LIVE=mk('/mnt/project-files/wall2024/fetchback_live_s119.json'),CAND=mk('/mnt/project-files/wall2024/parent_s119_CLK2.json');
const load=f=>JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8')).data.resultData.runData;
const rec=async(code,rd)=>{const o=await run(code('Close Enforcer Record'),'Close Enforcer Record',rd);if(o.err)return {err:o.err};const j=o[0]||{};const c=j.cec||j;return {rows:(c.rows||[]).map(r=>[r.id,r.side,r.link,r.status,r.link_named||'',(r.note||'').slice(0,90)].join('|')),confirmed:(c.confirmed||[]).map(x=>x.side+' '+x.link)};};
module.exports={LIVE,CAND,load,rec,run};
