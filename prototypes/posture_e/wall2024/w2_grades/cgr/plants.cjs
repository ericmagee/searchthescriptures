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
const R1=P.map((_,i)=>ok(i));const txt=o=>Object.values(o.res).flat().map(x=>x.choices?x.choices[0].message.content:'ERR');
// P1 error at last index (S item 1)
let r=chain(nw,R1.map((x,i)=>i===5?{error:{message:'e'}}:x),o=>({choices:[{message:{content:'RETRY '+o.rt}}]}));console.log('P1 last index: calls',r.calls,JSON.stringify(txt(r)));
// P2 all six error, all retries succeed
r=chain(nw,R1.map(()=>({error:{message:'e'}})),o=>({choices:[{message:{content:'RETRY '+o.rt}}]}));console.log('P2 all error: calls',r.calls,JSON.stringify(txt(r)));
// P3 retry returns an object with no choices and no error
r=chain(nw,R1.map((x,i)=>i===2?{error:{message:'e'}}:x),o=>({}));const l=chain(live,R1.map((x,i)=>i===2?{error:{message:'e'}}:x));console.log('P3 empty retry reply: new A0',JSON.stringify(r.res.A[0]),'| live A0',JSON.stringify(l.res.A[0]));
// P4 retry call returns fewer items than asked (two errors, one reply back)
{const R4=R1.map((x,i)=>i===1||i===3?{error:{message:'e'}}:x);const D={'Close Group Batch Build':P,'Close Group Batch Call deepseek':R4};const out=run(code(nw,'Close Group Retry Build'),D,R4).map(x=>x.json);D['Close Group Retry Build']=out;D['Close Group Retry Call deepseek']=[{choices:[{message:{content:'RETRY first'}}]}];
 const res=Object.keys(RD).map(k=>run(code(nw,RD[k]),D,[{},{}]).map(x=>x.json));console.log('P4 short retry output:',JSON.stringify(res.flat().map(x=>x.choices?x.choices[0].message.content:'ERR')));}
// P5 batch call not run: new equals live
{const D={'Close Group Batch Build':P};const a=Object.keys(RD).map(k=>run(code(nw,RD[k]),D,[{},{}])),b=Object.keys(RD).map(k=>run(code(live,RD[k]),D,[{},{}]));console.log('P5 batch not run: equal to live',JSON.stringify(a)===JSON.stringify(b));}
// P6 error item with no body in P (malformed): Retry Build skips it
{const P2=P.map((p,i)=>i===0?{...p,body:undefined}:p);const out=run(code(nw,'Close Group Retry Build'),{'Close Group Batch Build':P2},R1.map((x,i)=>i===0?{error:{message:'e'}}:x)).map(x=>x.json);console.log('P6 no body:',JSON.stringify(out));}
// P7 error given as a string (n8n sometimes): still retried?
{const out=run(code(nw,'Close Group Retry Build'),{'Close Group Batch Build':P},R1.map((x,i)=>i===0?{error:'timeout'}:x)).map(x=>x.json);console.log('P7 string error:',JSON.stringify(out).slice(0,80));}
