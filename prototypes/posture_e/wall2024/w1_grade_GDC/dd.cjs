const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const LV=load('/mnt/project-files/wall2024/fetchback_live_s147.json'),PK=load('/mnt/project-files/wall2024/parent_s147_GDC.json');
const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35296_full.json','utf8')).data.resultData.runData;
const mk=(W)=>name=>{const r=rd[name];const nd=W.nodes.find(n=>n.name===name)||{};const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:nd.parameters||{}};};
const run=async(W,name,input)=>{const src=W.nodes.find(n=>n.name===name).parameters.jsCode;const $input={all:()=>input,first:()=>input[0],last:()=>input[input.length-1],item:input[0]};return await new Function('$','$input','return (async()=>{\n'+src+'\n})();')(mk(W),$input);};
(async()=>{const n='Send Back Record';const sc=rd[n][0].source[0];const inp=rd[sc.previousNode][0].data.main[0];
const A=(await run(LV,n,inp))[0].json,B=(await run(PK,n,inp))[0].json;
const r0=A.sb_rows.find(r=>r.seat==='luna');const r1=B.sb_rows.find(r=>r.seat==='luna');for(const k in r0)if(JSON.stringify(r0[k])!==JSON.stringify(r1[k]))console.log('luna field',k,'\n OLD',JSON.stringify(r0[k]).slice(0,400),'\n NEW',JSON.stringify(r1[k]).slice(0,400));
const st=rd[n][0].data.main[0][0].json;console.log('live equals stored run output (masked):',JSON.stringify(A).replace(/\d{4}-\d\d-\d\dT[\d:.]+Z/g,'')===JSON.stringify(st).replace(/\d{4}-\d\d-\d\dT[\d:.]+Z/g,''));
console.log('bodies len',JSON.stringify(A.bodies).length,JSON.stringify(B.bodies).length,'sb_items',JSON.stringify(A.sb_items).length,JSON.stringify(B.sb_items).length);
console.log('sendback keys',Object.keys(A.sendback||{}));
})();
(async()=>{const n='Send Back Record';const sc=rd[n][0].source[0];const inp=rd[sc.previousNode][0].data.main[0];
const A=(await run(LV,n,inp))[0].json,B=(await run(PK,n,inp))[0].json;
for(const k in A.sendback)if(JSON.stringify(A.sendback[k])!==JSON.stringify(B.sendback[k]))console.log('sendback.'+k,JSON.stringify(A.sendback[k]).slice(0,300),'=>',JSON.stringify(B.sendback[k]).slice(0,300));
const ks=Object.keys(A.bodies);for(const k of ks)if(JSON.stringify(A.bodies[k])!==JSON.stringify(B.bodies[k])){const a=String(A.bodies[k].text||JSON.stringify(A.bodies[k])),b=String(B.bodies[k].text||JSON.stringify(B.bodies[k]));const al=a.split('\n'),bl=b.split('\n');console.log('body',k,al.length,bl.length);al.forEach((l,i)=>{if(l!==bl[i])console.log(' OLD',l.slice(0,250),'\n NEW',String(bl[i]).slice(0,250));});}
})();
