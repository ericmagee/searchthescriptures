// W2: which send-back items lose "A KEEP does not cure this item." under pkgEHF rev 2, and does the item still carry it elsewhere?
const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');
const W=f=>JSON.parse(fs.readFileSync(f,'utf8'));const eff=(P,n)=>{const l=P.nodes.find(x=>x.name==='Shared Library').parameters.jsCode;return rebuild(P.nodes.find(x=>x.name===n).parameters.jsCode,l);};
const A=W('/mnt/project-files/wall2024/fetchback_live_s120.json'),B=W(process.argv[3]||'/mnt/project-files/wall2024/parent_s120_EHF2.json');
const K='A KEEP does not cure this item.';
(async()=>{for(const f of (process.argv[2]||'ex33149_full.json').split(',')){const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8')).data.resultData.runData;const n='Send Back Build';if(!rd[n])continue;
 const oa=await run('$execution.customData={set(){}};'+eff(A,n),n,rd),ob=await run('$execution.customData={set(){}};'+eff(B,n),n,rd);
 const msgs=o=>JSON.stringify(o);const ca=msgs(oa).split(K).length-1,cb=msgs(ob).split(K).length-1;console.log(f,'KEEP sentence count s120',ca,'cand',cb);
 // per item
 const items=o=>{const t=[];for(const x of o){const s=JSON.stringify(x);for(const m of s.split('ITEM ').slice(1))t.push(m);}return t;};
 const ia=items(oa),ib=items(ob);for(let i=0;i<Math.min(ia.length,ib.length);i++){const a=ia[i].split(K).length-1,b=ib[i].split(K).length-1;if(a!==b||(a>0&&b===0))console.log('  item',ia[i].slice(0,40),'| KEEP count',a,'->',b,'| cut marks',ia[i].split('[...]').length-1,'->',ib[i].split('[...]').length-1,'| has COLLISION RULE block',/THE COLLISION RULE/.test(ib[i]));}}})();
