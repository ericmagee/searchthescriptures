// pkgERS plant on the non-library Enforcer Record (run 35296 stored data): a planted retry of the whole call that comes back
// {"error":"aborted"}; the package's Enforcer Resend Build picks it, and with the stored Enforcer Call reply as the resent reply the
// Record's verdicts (tally and per-row results) must equal the stored run's; without the resend they must not. Usage: node plant_enforcer.cjs <live> <pkg> [P]
const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};const [LV,PK]=[load(process.argv[2]),load(process.argv[3])];
const P=process.argv[4]||'Enforcer';
const wrap=items=>({isExecuted:true,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:{}});
const mk=(W,rd,over)=>name=>{if(over&&name in over)return over[name];const r=rd[name];const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];const nd=W.nodes.find(n=>n.name===name)||{};return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:nd.parameters||{}};};
const run=async(W,rd,name,over,inp)=>{if(!inp){const r=rd[name];const sn=r&&r[0].source&&r[0].source[0]&&r[0].source[0].previousNode;inp=sn?mk(W,rd)(sn).all():[];}const $input={all:()=>inp,first:()=>inp[0],last:()=>inp[inp.length-1],item:inp[0]};
 return await new Function('$','$input','return (async()=>{\n'+W.nodes.find(n=>n.name===name).parameters.jsCode+'\n})();')(mk(W,rd,over),$input);};
const Z=o=>JSON.stringify(o).replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z/g,'T');
(async()=>{const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35296_full.json','utf8')).data.resultData.runData;
 const B=rd[P+' Build'][0].data.main[0];const C=rd[P+' Call deepseek'][0].data.main[0];
 const RB=B.map((b,i)=>({json:{esr_retry:true,esr_of:i,esr_half:1,esr_why:'planted',ids:b.json.ids,body:b.json.body,model:b.json.model,run_token:b.json.run_token}}));
 const RR=RB.map(()=>({json:{error:'aborted'}}));
 const SB=await run(PK,rd,P+' Resend Build',{[P+' Retry Build']:wrap(RB)},RR);
 console.log(P,'calls',B.length,'| Resend Build picks',JSON.stringify(SB.map(x=>x.json.ers_k)),'| bodies equal to the stored call bodies',SB.every(x=>JSON.stringify(x.json.body)===JSON.stringify(B[x.json.ers_k].json.body)));
 const ov={[P+' Retry Build']:wrap(RB),[P+' Retry Call deepseek']:wrap(RR)};
 const live=await run(LV,rd,P+' Record');
 const noRes=await run(PK,rd,P+' Record',ov);
 const withRes=await run(PK,rd,P+' Record',{...ov,[P+' Resend Build']:wrap(SB),[P+' Resend Call deepseek']:wrap(C)});
 const K=o=>{const j=o[0].json;const e=j.enf428||j.enf||j;const t=e.tally||(j.enf421&&j.enf421.tally)||null;const rows=(j.enf428_rows||j.enf421_rows||[]).map(r=>[r.item,r.response_line||null]);return JSON.stringify({tally:t,rows});};
 const Er=o=>{const j=o[0].json;const e=j.enf428||j.enf||j;return JSON.stringify(e.errors||e.error||null).slice(0,160);};
 console.log('verdicts (tally and per-row results) with resend equal to the stored run:',K(withRes)===K(live),'| without resend equal:',K(noRes)===K(live),'| errors without resend:',Er(noRes),'| with resend:',Er(withRes));
 if(K(withRes)!==K(live))console.log('  keys',Object.keys(live[0].json).join(','));
})().catch(e=>{console.error(e);process.exit(1);});
