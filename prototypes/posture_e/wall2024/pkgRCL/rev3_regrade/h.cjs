const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');
const W=f=>{let w=JSON.parse(fs.readFileSync(f,'utf8'));w=w.data||w;return w.workflow||w;};
const node=(f,n)=>W(f).nodes.find(z=>z.name===n).parameters.jsCode;
const LIVE='/mnt/project-files/wall2024/fetchback_live_s119.json',RCL='/mnt/project-files/wall2024/parent_s120_RCL3.json',CLK3='/mnt/project-files/wall2024/parent_s119_CLK3.json';
const load=r=>JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex'+r+'_full.json','utf8')).data.resultData.runData;
const build=async(f,rd)=>{const o=await run(node(f,'Close Enforcer Build'),'Close Enforcer Build',rd);if(o.err)return {err:o.err};return o[0].json||o[0];};
const record=async(f,rd,bj,reply)=>{const r=JSON.parse(JSON.stringify(rd));r['Close Enforcer Build'][0].data.main[0][0].json=bj;if(reply!==undefined){const c=r['Close Enforcer Call deepseek'][0].data.main[0][0].json;c.choices[0].message.content=reply;}
 const o=await run(node(f,'Close Enforcer Record'),'Close Enforcer Record',r);if(o.err)return {err:o.err};const j=o[0].json||o[0];const c=j.cec||j;return {rows:(c.rows||[]).map(x=>[x.id,x.side,x.link,x.status,x.link_named||''].join('|')),confirmed:(c.confirmed||[]).map(x=>x.side+' '+x.link)};};
const confirmAll=(bj,base)=>base+'\n'+(bj.cands||[]).filter(c=>/pkgRCL/.test(c.by||'')).map(c=>'CLOSE-CONTRADICTION: '+c.id+' -- '+c.side+' -- LINK '+c.n+' -- CONFIRMED -- EARLIER ['+c.earlier_round+'] "'+c.earlier_q+'" -- CLOSING ['+c.closing_round+'] "'+c.closing_q+'" -- planted.').join('\n');
module.exports={LIVE,RCL,CLK3,load,build,record,confirmAll};
