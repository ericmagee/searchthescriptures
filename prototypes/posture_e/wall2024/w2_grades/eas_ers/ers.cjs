// W2: pkgERS on run 35296: Resend Build picks; each Record on the joint (no resend) equals stored; Alt Judge Enforcer Record with the aborted half resent as a planted good reply and as a second abort
const fs=require('fs');const {ld}=require('./src.cjs');const D='/mnt/project-files/wall2024/';
const rd=JSON.parse(fs.readFileSync(D+'ex35296_full.json','utf8')).data.resultData.runData;const J=ld('parent_s146_JOINT_ESS_ERS.json');
const items=n=>rd[n]?rd[n].slice(-1)[0].data.main.flat().filter(Boolean):[];
async function run(name,inp,over={}){const node=J.nodes.find(n=>n.name===name);const mk=n=>{const it=over[n]||items(n);const nd=J.nodes.find(x=>x.name===n)||{};return {isExecuted:!!(over[n]||rd[n]),first:()=>it[0],last:()=>it[it.length-1],all:()=>it,item:it[0],params:nd.parameters||{}};};
 return await new Function('$','$input','return (async()=>{\n'+node.parameters.jsCode+'\n})();')(mk,{all:()=>inp,first:()=>inp[0],item:inp[0]});}
const mask=o=>JSON.stringify(o).replace(/"(at|created_at|recorded_at|ts)":"[^"]*"/g,'"$1":0').replace(/20\d\d-\d\d-\d\dT[\d:.]+Z/g,'T');
(async()=>{
 for(const P of ['Enforcer','Judge Enforcer','Alt Judge Enforcer','R2 Alt Judge Enforcer']){const rec=P+' Record';if(!rd[rec]){console.log(rec,'not run');continue;}
  const prev=rd[rec][0].source[0].previousNode;const o=await run(rec,items(prev));console.log(rec,'(input from',prev+')','equals stored:',mask(o.map(x=>x.json))===mask(items(rec).map(x=>x.json)));
  if(rd[P+' Retry Call deepseek']){const sb=await run(P+' Resend Build',items(P+' Retry Call deepseek'));console.log('  Resend Build:',sb.map(x=>x.json.ers_resend?('k='+x.json.ers_k+' body '+JSON.stringify(x.json.body).length):'none').join(', '));
   const rc=items(P+' Retry Call deepseek');rc.forEach((x,k)=>console.log('   retry half',k,x.json.error?'ERROR '+JSON.stringify(x.json.error).slice(0,40):('ok finish '+(x.json.choices&&x.json.choices[0].finish_reason))));
   if(sb[0].json.ers_resend){const RBi=items(P+' Retry Build').map(x=>x.json);const base=rc.find(x=>!x.json.error).json;const good={json:{...base,choices:[{...base.choices[0],message:{...base.choices[0].message,content:RBi[sb[0].json.ers_k].ids.map(x=>'ENFORCER: '+x.id+' -- AGREE -- planted line for the replay.').join('\n')}}]}};
    for(const [lab,rep] of [['second abort',{json:{error:'aborted'}}],['planted reply (AGREE for each id of the aborted half)',good]]){const o2=await run(rec,items(prev),{[P+' Resend Build']:sb,[P+' Resend Call deepseek']:sb.map(()=>rep)});const j=o2[0].json;
     const s=JSON.stringify(j);console.log('  with',lab+':','NO VERDICT count',(s.match(/NO VERDICT/g)||[]).length,'esr',JSON.stringify(j.esr||(j.enforcer&&j.enforcer.esr)||'').slice(0,160));}
    console.log('  stored NO VERDICT count',(JSON.stringify(items(rec)[0].json).match(/NO VERDICT/g)||[]).length);}}}
})().catch(e=>console.log('ERR',e.stack.slice(0,400)));
