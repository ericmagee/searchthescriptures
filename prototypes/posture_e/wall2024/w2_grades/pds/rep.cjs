// W2: pkgPDS member Call nodes on all stored exports, batch reply = stored member replies in batch order; plus plant: batch reply order reversed within a group must change outputs (control)
const fs=require('fs');const {ld}=require('./src.cjs');const D='/mnt/project-files/wall2024/';const J=ld('parent_s146_PDS.json');
const run=(name,inp,get)=>{const node=J.nodes.find(n=>n.name===name);const mk=n=>{const it=get(n);return {isExecuted:!!it,all:()=>it||[],first:()=>(it||[])[0]};};return new Function('$','$input','return (()=>{\n'+node.parameters.jsCode+'\n})();')(mk,{all:()=>inp,first:()=>inp[0]});};
const GR={'Close Group':['Close Enforcer','Anticheat','Assume Check'],'Enforcer Group':['Enforcer','Judge Enforcer']};
let eq=0,tot=0,ctl=0;
for(const fn of fs.readdirSync(D).filter(x=>/^ex3\d+_full\.json$/.test(x))){const rd=JSON.parse(fs.readFileSync(D+fn,'utf8')).data.resultData.runData;const items=n=>rd[n]?rd[n].slice(-1)[0].data.main.flat().filter(Boolean):null;
 for(const g in GR){const bb=run(g+' Batch Build',[],n=>items(n));if(bb[0].json.bt_skip)continue;
  const tag={'Close Enforcer':'C','Anticheat':'A','Assume Check':'S','Enforcer':'E','Judge Enforcer':'J'};
  const reply=bb.map(b=>{const m=GR[g].find(x=>tag[x]===b.json.bt);const c=items(m+' Call deepseek')||[];return {json:c[b.json.k]?c[b.json.k].json:{error:'missing'}};});
  for(const m of GR[g]){const inp=items(m+' Needed?')?rd[m+' Needed?'].slice(-1)[0].data.main[0]||[]:[];if(!rd[m+' Call deepseek'])continue;tot++;
   const o=run(m+' Call deepseek',inp,n=>n===g+' Batch Build'?bb:n===g+' Batch Call deepseek'?reply:items(n));
   const same=JSON.stringify(o.map(x=>x.json))===JSON.stringify(items(m+' Call deepseek').map(x=>x.json));if(same)eq++;else console.log('DIFF',fn.slice(2,7),m);
   const o2=run(m+' Call deepseek',inp,n=>n===g+' Batch Build'?bb:n===g+' Batch Call deepseek'?[...reply].reverse():items(n));if(JSON.stringify(o2.map(x=>x.json))!==JSON.stringify(o.map(x=>x.json)))ctl++;}}}
console.log('member Call outputs equal stored',eq,'of',tot,'| reversed batch changes output in',ctl,'(control: the mapping depends on batch position)');
