// pkgEAC replay and plants: Panel Tokens on all 13 exports, live s148 vs package; plants on run 35296
const fs=require('fs');const {LV,PK,run,mask}=require('./replay_nodes.cjs');
const wrap=items=>({isExecuted:true,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:{}});
const NX={isExecuted:false,first:()=>{throw new Error('not run')},all:()=>{throw new Error('not run')},params:{}};
const go=async(W,rd,over)=>{const n='Panel Tokens';const sc=rd[n][0].source[0];const inp=rd[sc.previousNode][sc.previousNodeRun||0].data.main[sc.previousNodeOutput||0]||[];return (await run(W,rd,n,inp,over))[0].json;};
const sum=o=>{const c=o.calls;return c.length+' rows, '+c.filter(x=>/Early/.test(x.n)).map(x=>x.n+' '+x.m+' $'+x.b).join('; ');};
(async()=>{let eq=0,tot=0;
for(const f of fs.readdirSync('/mnt/project-files/wall2024').filter(f=>/^ex\d+_full\.json$/.test(f))){const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8')).data.resultData.runData;if(!rd['Panel Tokens'])continue;tot++;
 const a=await go(LV,rd),b=await go(PK,rd);if(mask(a)===mask(b)){eq++;continue;}console.log(f.slice(2,7),'live:',sum(a),'\n      pkg: ',sum(b));
 const ex=new Set(a.calls.map(x=>JSON.stringify(x)));console.log('      added rows:',JSON.stringify(b.calls.filter(x=>!ex.has(JSON.stringify(x)))),'| other fields equal:',mask({...a,calls:0})===mask({...b,calls:0}));}
console.log('Panel Tokens runs',tot,'equal',eq);
const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35296_full.json','utf8')).data.resultData.runData;const G=rd['Get Early Alternate'][0].data.main[0];
const P=[['P1 all early: Early Alternate Reply also ran with the same reply',{'Early Alternate Reply':wrap(G.map(x=>({json:x.json.reply})))}],
 ['P2 the stored row carries an error and no reply',{'Get Early Alternate':wrap([{json:{...G[0].json,reply:null,error:'aborted'}}])}],
 ['P3 Get Early Alternate did not run',{'Get Early Alternate':NX}],
 ['P4 two stored replies (luna and sol)',{'Get Early Alternate':wrap([G[0],{json:{...G[0].json,seat_for:'sol',reply:{...G[0].json.reply,id:'gen-plant-2'}}}])}],
 ['P5 stored reply with no usage',{'Get Early Alternate':wrap([{json:{...G[0].json,reply:{...G[0].json.reply,usage:undefined}}}])}]];
for(const [k,o] of P){const a=await go(LV,rd,o),b=await go(PK,rd,o);console.log(k,'\n  live:',sum(a),'\n  pkg: ',sum(b));}})();
