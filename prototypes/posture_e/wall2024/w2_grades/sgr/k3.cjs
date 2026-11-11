const fs=require('fs');const ex=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34852_full.json','utf8'));const rd=ex.data.resultData.runData;
const P=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s142.json','utf8'));const PW=(P.data||P).workflow||(P.data||P);
const mk=(name)=>{const r=rd[name];const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];const node=(PW.nodes.find(n=>n.name===name)||{});return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:node.parameters||{}};};
(async()=>{const node='Judge Enforcer Build';const src=fs.readFileSync('pkgEKR/src/Judge_Enforcer_Build.old.js','utf8');const r=rd[node];const sN=r[0].source[0].previousNode;const inp=mk(sN);
 const o=await new Function('$','$input','return (async()=>{\n'+src+'\n})();')(mk,{all:()=>inp.all(),first:()=>inp.first(),item:inp.first()});
 const body=o.map(i=>typeof i.json.body==='string'?i.json.body:JSON.stringify(i.json.body)).join('\n');
 for(const v of ['Matthew 1:25 -- [CR3]','Matthew 1:20 -- [CR3]','Luke 1:32 -- [CR3]']){let k=body.indexOf(v);while(k>=0){const s=body.lastIndexOf('ITEM ',k);const seg=body.slice(s,body.indexOf('ITEM ',k+10)>0?body.indexOf('ITEM ',k+10):s+3000);if(/sol/.test(seg)){console.log('=====',v,'\n',seg.slice(0,2600).replace(/\\n/g,'\n'));break;}k=body.indexOf(v,k+1);}}})();
