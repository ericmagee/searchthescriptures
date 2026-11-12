// pkgERS replay. (A) every stored export: each Record node and new Resend Build, live s146 vs package, stored inputs, no resend run (time stamps of the run moment masked):
// Record outputs must be equal. (B) run 35296 Alt Judge Enforcer: the package's Resend Build picks the aborted half; with a planted
// resend reply (ENFORCER lines for the half's 13 ids) the Record recovers them. Usage: node replay.cjs <live> <pkg>
const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};const [LV,PK]=[load(process.argv[2]),load(process.argv[3])];
const wrap=items=>({isExecuted:true,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:{}});
const mk=(W,rd,over)=>name=>{if(over&&over[name])return over[name];const r=rd[name];const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];const nd=W.nodes.find(n=>n.name===name)||{};return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:nd.parameters||{}};};
const run=async(W,rd,name,over,inp)=>{if(!inp){const r=rd[name];const sn=r&&r[0].source&&r[0].source[0]&&r[0].source[0].previousNode;inp=sn?mk(W,rd)(sn).all():[];}const $input={all:()=>inp,first:()=>inp[0],last:()=>inp[inp.length-1],item:inp[0]};
 return await new Function('$','$input','return (async()=>{\n'+W.nodes.find(n=>n.name===name).parameters.jsCode+'\n})();')(mk(W,rd,over),$input);};
const PS=['Enforcer','Judge Enforcer','Alt Judge Enforcer','R2 Alt Judge Enforcer'];
const tally=o=>{const j=o[0].json;const t=(j.enf428||j.enf||{}).tally||null;return t;};
(async()=>{const D='/mnt/project-files/wall2024/';let n=0,eq=0;
 for(const f of fs.readdirSync(D).filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const rd=JSON.parse(fs.readFileSync(D+f,'utf8')).data.resultData.runData;
  for(const P of PS){const R=P+' Record';if(!rd[R])continue;let a,b,sb='-';try{a=await run(LV,rd,R);b=await run(PK,rd,R);
    if(rd[P+' Retry Call deepseek']){const s=await run(PK,rd,P+' Resend Build',null,rd[P+' Retry Call deepseek'][0].data.main[0]);sb=JSON.stringify(s.map(x=>x.json.ers_resend?('k'+x.json.ers_k):'none'));}}
   catch(e){console.log(f,R,'ERROR',e.message.slice(0,160));continue;}n++;const Z=o=>JSON.stringify(o).replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z/g,"T");const s=Z(a)===Z(b);if(s)eq++;console.log(f.slice(2,7),R.padEnd(30),'equal',s,'| Resend Build would send:',sb);}}
 console.log('TOTAL (A) records',n,'equal',eq);
 // (B)
 const rd=JSON.parse(fs.readFileSync(D+'ex35296_full.json','utf8')).data.resultData.runData;const P='Alt Judge Enforcer';
 const RB=rd[P+' Retry Build'][0].data.main[0];const RR=rd[P+' Retry Call deepseek'][0].data.main[0];
 const SB=await run(PK,rd,P+' Resend Build',null,RR);console.log('\n(B) 35296 Resend Build output:',JSON.stringify(SB.map(x=>({ers_resend:x.json.ers_resend,ers_k:x.json.ers_k,ids:(RB[x.json.ers_k]||{json:{ids:[]}}).json.ids.length,same_body:JSON.stringify(x.json.body)===JSON.stringify((RB[x.json.ers_k]||{json:{}}).json.body)}))));
 const k=SB[0].json.ers_k;const ids=RB[k].json.ids;const txt=ids.map(x=>'ENFORCER: '+x.id+' -- AGREE -- planted line for the replay').join('\n');
 const planted=[{json:{choices:[{message:{content:txt},finish_reason:'stop'}],usage:{}}}];
 const before=await run(PK,rd,P+' Record');const after=await run(PK,rd,P+' Record',{[P+' Resend Build']:wrap(SB),[P+' Resend Call deepseek']:wrap(planted)});
 const nv=o=>{const t=o[0].json.enf428.tally;return Object.values(t).reduce((s,x)=>s+x['NO VERDICT'],0);};
 console.log('(B) NO VERDICT before',nv(before),'after planted resend',nv(after),'| esr',JSON.stringify(after[0].json.enf428.esr),'| errors after',JSON.stringify(after[0].json.enf428.errors));
 // (C) a resend that also fails: the item stays NO VERDICT, nothing breaks
 const after2=await run(PK,rd,P+' Record',{[P+' Resend Build']:wrap(SB),[P+' Resend Call deepseek']:wrap([{json:{error:'aborted'}}])});
 console.log('(C) resend also aborted: NO VERDICT',nv(after2),'| esr',JSON.stringify(after2[0].json.enf428.esr));
})().catch(e=>{console.error(e);process.exit(1);});
