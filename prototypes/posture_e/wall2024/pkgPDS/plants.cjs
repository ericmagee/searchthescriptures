// pkgPDS plants on run 35296: (a) one batch reply is an error: only that member's Call output carries it, in its place;
// (b) Anticheat skipped: the batch leaves it out and the other members' Call outputs are unchanged; (c) every member skipped: Batch Build
// gives one bt_skip item (Batch Needed? false -> Resume -> each Needed? false -> Record, as today). Usage: node plants.cjs <pkg json>
const fs=require('fs');let W=JSON.parse(fs.readFileSync(process.argv[2]));W=W.data||W;
const wrap=items=>({isExecuted:true,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:{}});
const mk=(rd,over)=>name=>{if(over&&name in over)return over[name];const r=rd[name];const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:{}};};
const run=async(rd,name,over,inp)=>{const $input={all:()=>inp,first:()=>inp[0],last:()=>inp[inp.length-1],item:inp[0]};return await new Function('$','$input','return (async()=>{\n'+W.nodes.find(n=>n.name===name).parameters.jsCode+'\n})();')(mk(rd,over),$input);};
const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35296_full.json','utf8')).data.resultData.runData;
const M=[['Close Enforcer','cec_skip','C'],['Anticheat','acx_skip','A'],['Assume Check','acx_skip','S']];const g='Close Group';
const st=X=>rd[X+' Call deepseek'][0].data.main[0].map(x=>x.json);const inp=X=>rd[X+' Needed?'][0].data.main[0];
const batch=async(over)=>{const BB=await run(rd,g+' Batch Build',over,[]);const rep=BB.filter(x=>!x.json.bt_skip).map(x=>{const m=M.find(z=>z[2]===x.json.bt);return {json:st(m[0])[x.json.k]};});return {BB,rep};};
(async()=>{
 // (a)
 let {BB,rep}=await batch({});const k=BB.findIndex(x=>x.json.bt==='A'&&x.json.k===2);rep[k]={json:{error:'aborted'}};
 const ov={[g+' Batch Build']:wrap(BB),[g+' Batch Call deepseek']:wrap(rep)};
 const a=await run(rd,'Anticheat Call deepseek',ov,inp('Anticheat')),c=await run(rd,'Close Enforcer Call deepseek',ov,inp('Close Enforcer')),s=await run(rd,'Assume Check Call deepseek',ov,inp('Assume Check'));
 const exp=st('Anticheat').map((x,i)=>i===2?{error:'aborted'}:x);
 console.log('(a) error lands only in Anticheat item 3:',JSON.stringify(a.map(x=>x.json))===JSON.stringify(exp),'| Close Enforcer unchanged:',JSON.stringify(c.map(x=>x.json))===JSON.stringify(st('Close Enforcer')),'| Assume Check unchanged:',JSON.stringify(s.map(x=>x.json))===JSON.stringify(st('Assume Check')));
 // (b)
 const AB=rd['Anticheat Build'][0].data.main[0].map(x=>({json:{...x.json,acx_skip:true}}));const b=await batch({'Anticheat Build':wrap(AB)});
 const ov2={'Anticheat Build':wrap(AB),[g+' Batch Build']:wrap(b.BB),[g+' Batch Call deepseek']:wrap(b.rep)};
 const c2=await run(rd,'Close Enforcer Call deepseek',ov2,inp('Close Enforcer')),s2=await run(rd,'Assume Check Call deepseek',ov2,inp('Assume Check'));
 console.log('(b) Anticheat skipped: batch tags',JSON.stringify(b.BB.map(x=>x.json.bt)),'| Close Enforcer unchanged:',JSON.stringify(c2.map(x=>x.json))===JSON.stringify(st('Close Enforcer')),'| Assume Check unchanged:',JSON.stringify(s2.map(x=>x.json))===JSON.stringify(st('Assume Check')));
 // (c)
 const sk=(X,key)=>wrap([{json:{[key]:true}}]);const c3=await run(rd,g+' Batch Build',{'Close Enforcer Build':sk('Close Enforcer','cec_skip'),'Anticheat Build':sk('Anticheat','acx_skip'),'Assume Check Build':sk('Assume Check','acx_skip')},[]);
 console.log('(c) all skipped: Batch Build output',JSON.stringify(c3.map(x=>x.json)));
 // (d) Enforcer group: a member Call with the batch call not run gives error items, never another member's reply
 const d=await run(rd,'Judge Enforcer Call deepseek',{'Enforcer Group Batch Call deepseek':{isExecuted:false,all:()=>[],first:()=>undefined}},inp('Judge Enforcer'));
 console.log('(d) batch call not run: Judge Enforcer Call gives',d.length,'error items:',d.every(x=>/no reply in the batch/.test(x.json.error)));
})().catch(e=>{console.error(e);process.exit(1);});
