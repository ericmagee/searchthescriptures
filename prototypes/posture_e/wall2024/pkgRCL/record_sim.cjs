// W2 pkgRCL: feed the candidate Build output to live Close Enforcer Record, with planted enforcer replies to the code candidates.
const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const src=(f,n)=>g(f).nodes.find(x=>x.name===n).parameters.jsCode;const REC=f=>src(f,'Close Enforcer Record');
const CB=src('/mnt/project-files/wall2024/parent_s119_RCL.json','Close Enforcer Build');
const sim=async(ex,mkReply,recFile)=>{const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+ex,'utf8')).data.resultData.runData;
 const b=await run(CB,'Close Enforcer Build',JSON.parse(JSON.stringify(rd)));rd['Close Enforcer Build'][rd['Close Enforcer Build'].length-1].data.main[0]=b.map(x=>({json:x.json||x}));
 const cs=b.flatMap(x=>(x.json||x).cands||[]).filter(c=>/pkgRCL/.test(c.by));const call=rd['Close Enforcer Call deepseek'];const c=call[call.length-1].data.main[0][0].json.choices[0].message;c.content=mkReply(c.content,cs);
 const o=await run(REC(recFile||'/mnt/project-files/wall2024/fetchback_live_s119.json'),'Close Enforcer Record',rd);const j=(o[0]&&(o[0].json||o[0]))||{};const C=j.cec||j;
 return {rows:(C.rows||[]).map(r=>[r.id,r.side,r.link,r.status,(r.note||'').slice(0,80)].join('|')),confirmed:(C.confirmed||[]).map(x=>x.side+' '+x.link),no_answer:C.no_answer};};
const line=(c,v,why)=>'CLOSE-CONTRADICTION: '+c.id+' -- '+c.side+' -- LINK '+c.n+' -- '+v+' -- EARLIER ['+c.earlier_round+'] "'+c.earlier_q+'" -- CLOSING ['+c.closing_round+'] "'+c.closing_q+'" -- '+why;
(async()=>{for(const ex of ['ex34852_full.json','ex34626_full.json']){
 console.log('##',ex,'stored reply (code candidates unanswered)\n',JSON.stringify(await sim(ex,(r)=>r)));
 console.log('##',ex,'all code candidates CONFIRMED\n',JSON.stringify(await sim(ex,(r,cs)=>r+'\n'+cs.map(c=>line(c,'CONFIRMED','planted')).join('\n'))));
 console.log('##',ex,'all code candidates NOT A CONTRADICTION\n',JSON.stringify(await sim(ex,(r,cs)=>r+'\n'+cs.map(c=>line(c,'NOT A CONTRADICTION','planted')).join('\n'))));
 if(fs.existsSync('/mnt/project-files/wall2024/parent_s119_CLK3.json'))console.log('##',ex,'all CONFIRMED, Record of pkgCLK rev 3\n',JSON.stringify(await sim(ex,(r,cs)=>r+'\n'+cs.map(c=>line(c,'CONFIRMED','planted')).join('\n'),'/mnt/project-files/wall2024/parent_s119_CLK3.json')));}})();
if(process.env.CROSS)(async()=>{const ex='ex34852_full.json';
 const mk=(r,cs)=>{const c=cs[0];return r+'\n'+line(c,'CONFIRMED','planted')+'\n'+line({...c,id:'NEW'},'NOT A CONTRADICTION','planted');};
 console.log('## CROSS X3 CONFIRMED + NEW NOT A CONTRADICTION, same quotations, LINK 1 (live Record)\n',JSON.stringify(await sim(ex,mk)));
 console.log('## same, Record of pkgCLK rev 3\n',JSON.stringify(await sim(ex,mk,'/mnt/project-files/wall2024/parent_s119_CLK3.json')));})();
