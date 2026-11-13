const live=require('./live_un.json'),nw=require('./new_un.json');
const code=(j,n)=>j.nodes.find(x=>x.name===n).parameters.jsCode;
const run=(src,D,input)=>{const $=n=>{if(!(n in D))return {isExecuted:false,all:()=>{throw new Error('not executed '+n)}};return {isExecuted:true,all:()=>D[n].map(json=>({json}))};};
 const $input={all:()=>input.map(json=>({json}))};return new Function('$','$input',src)($,$input);};
// 6 batch items: C0,C1,A0,A1,S0,S1 (bt letters per reader)
const RD={C:'Close Enforcer Call deepseek',A:'Anticheat Call deepseek',S:'Assume Check Call deepseek'};
const bts=Object.keys(RD).map(r=>{const c=code(nw,RD[r]);return [r,c.match(/p\.bt==='(\w+)'/)[1]];});
const P=[];bts.forEach(([r,bt])=>{for(let k=0;k<2;k++)P.push({bt,k,body:{model:'deepseek',messages:[{role:'user',content:bt+k}]}});});
const ok=i=>({choices:[{message:{content:'reply '+i}}]});
function chain(J,R,retry){const D={'Close Group Batch Build':P,'Close Group Batch Call deepseek':R};let calls=0;
 if(J===nw){const out=run(code(nw,'Close Group Retry Build'),D,R).map(x=>x.json);D['Close Group Retry Build']=out;
  if(out[0].rt_skip!==true){D['Close Group Retry Call deepseek']=out.map(o=>{calls++;return retry(o);});}}
 const res={};for(const [r] of bts)res[r]=run(code(J,RD[r]),D,[{},{}]).map(x=>x.json);return {res,calls,D};}
// (1) no error: byte-equal to live, no retry call
const R1=P.map((_,i)=>ok(i));const a=chain(live,R1),b=chain(nw,R1,()=>{throw 1});
console.log('no error: byte-equal',JSON.stringify(a.res)===JSON.stringify(b.res),'| retry calls',b.calls,'| Retry Build out',JSON.stringify(b.D['Close Group Retry Build']));
// (2) planted error at index 0
const R2=R1.map((x,i)=>i===0?{error:{message:'idle body 300 s'}}:x);let sent=null;
const c=chain(nw,R2,o=>{sent=o;return {choices:[{message:{content:'RETRY reply for '+o.rt}}]};}),d=chain(live,R2);
console.log('planted index 0: retry calls',c.calls,'| body sent equals P[0].body',JSON.stringify(sent.body)===JSON.stringify(P[0].body),'| rt',sent.rt);
console.log('  new',bts[0][1],'item 0:',JSON.stringify(c.res[bts[0][0]][0]),'| live:',JSON.stringify(d.res[bts[0][0]][0]));
const others=JSON.stringify({...c.res,[bts[0][0]]:c.res[bts[0][0]].slice(1)})===JSON.stringify({...d.res,[bts[0][0]]:d.res[bts[0][0]].slice(1)});console.log('  every other item equal to live',others);
// (3) retry also fails: error stays
const e=chain(nw,R2,()=>({error:{message:'again'}}));console.log('retry fails too: item 0',JSON.stringify(e.res[bts[0][0]][0]));
// (4) errors at 0 and 4
const R4=R1.map((x,i)=>i===0||i===4?{error:{message:'x'}}:x);const f=chain(nw,R4,o=>({choices:[{message:{content:'RETRY '+o.rt}}]}));console.log('errors at 0 and 4: calls',f.calls,'|',JSON.stringify(Object.values(f.res).flat().map(x=>x.choices?x.choices[0].message.content:'ERR')));
