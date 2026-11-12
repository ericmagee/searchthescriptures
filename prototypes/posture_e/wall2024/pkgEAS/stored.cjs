// pkgESS: every stored export where Alternate Payloads or R2 Alternate Payloads ran: live s146 vs package, stored inputs; outputs must be equal
// (no stored run had a mixed early case except 35296, which replay.cjs covers). Usage: node stored.cjs <live> <pkg>
const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};const [LV,PK]=[load(process.argv[2]),load(process.argv[3])];
const mk=(W,rd)=>name=>{const r=rd[name];const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];const nd=W.nodes.find(n=>n.name===name)||{};return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:nd.parameters||{}};};
const run=async(W,rd,name)=>{const r=rd[name];const sn=r[0].source&&r[0].source[0]&&r[0].source[0].previousNode;const inp=sn?mk(W,rd)(sn).all():[];const $input={all:()=>inp,first:()=>inp[0],last:()=>inp[inp.length-1],item:inp[0]};
 return await new Function('$','$input','return (async()=>{\n'+W.nodes.find(n=>n.name===name).parameters.jsCode+'\n})();')(mk(W,rd),$input);};
(async()=>{const D='/mnt/project-files/wall2024/';let n=0,eq=0;for(const f of fs.readdirSync(D).filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const rd=JSON.parse(fs.readFileSync(D+f,'utf8')).data.resultData.runData;
 for(const node of ['Alternate Build','Alternate Payloads','R2 Alternate Payloads'].filter(x=>rd[x])){let a,b;try{a=await run(LV,rd,node);b=await run(PK,rd,node);}catch(e){console.log(f,node,'ERROR',e.message.slice(0,150));continue;}n++;const s=JSON.stringify(a)===JSON.stringify(b);if(s)eq++;console.log(f.slice(2,7),node.padEnd(22),'items',a.length,'equal',s);}}
 console.log('TOTAL runs',n,'equal',eq);})();
