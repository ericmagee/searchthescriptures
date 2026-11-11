// B3: Alternate Build (candidate parent) on stored 34852 with Resolve Seats' alternates set to the pkgALT pool (grok, argon, haiku)
const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');
const A=L('/mnt/project-files/wall2024/parent_s119_ALT.json'),S=L('/mnt/project-files/wall2024/fetchback_live_s119.json');
const RD=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34852_full.json','utf8')).data.resultData.runData;
const rs=RD['Resolve Seats'][0].data.main;const RS=rs[0][0].json;console.log('stored debaters',JSON.stringify(RS.debaters),'stored alternates',RS.alternates.map(a=>a.seat+':'+a.family).join(','));
const POOL=[{seat:'grok',fam:'openrouter',api_model:'x-ai/grok-4.7',max_tokens:64000,family:'xai'},{seat:'argon',fam:'openrouter',api_model:'google/gemini-4-argon',max_tokens:64000,family:'google'},RS.alternates.find(a=>a.seat==='haiku')];
const show=o=>(Array.isArray(o)?o:[]).filter(i=>(i.json||i).alt).map(i=>{const a=(i.json||i).alt||{};return 'removed '+a.removed_seat+' -> '+(a.skip?'SKIP: '+a.skip:(a.seat||a.alt_seat||'?')+' '+(a.api_model||a.alt_api_model||''));}).join('\n  ');
const IN=RD['Alternate Needed?'][0].data.main[0];
(async()=>{for(const [k,deb] of [['stored debaters',RS.debaters],['gemini debating',[RS.debaters[0],{engine:'gemini',model:'google/gemini-3.8-flash',family:'google'}]],['grok debating',[RS.debaters[0],{engine:'grok',model:'x-ai/grok-4.7',family:'xai'}]]]){
 const over={'Resolve Seats':[[{json:{...RS,alternates:POOL,debaters:deb}}]]};
 const o=await run(A.code('Alternate Build'),'Alternate Build',RD,over,IN);console.log('##',k,'items',Array.isArray(o)?o.length+' '+o.map(i=>Object.keys(i.json||i).join('/')).join(','):'',o.err?'ERR '+o.err:'\n  '+show(o));
 const o2=await run(S.code('Alternate Build'),'Alternate Build',RD,over,IN);console.log('  live code same input:',o2.err?'ERR '+o2.err:JSON.stringify(show(o2))===JSON.stringify(show(o)));}})();
(async()=>{await new Promise(r=>setTimeout(r,100));const over={'Resolve Seats':[[{json:{...RS,alternates:POOL,debaters:[RS.debaters[0],{engine:'gemini',model:'google/gemini-3.8-flash',family:'google'}]}}]]};
const o=await run(A.code('Alternate Build'),'Alternate Build',RD,over,IN);console.log('## gemini skips detail:',JSON.stringify(o.map(i=>(i.json||i).skips)).slice(0,600));
const c=A.code('Alternate Build');const i=c.indexOf('skips');console.log(c.slice(i-400,i+300));})();
