// ASK 468 test: run each B Build and its Extract keep path on mocks, base vs target. Usage: node test468.cjs base.json target.json
const fs=require('fs');const L=p=>{const w=JSON.parse(fs.readFileSync(p));return w.data||w};
const RAW='I hold the verse as written.\n\nNothing more is pressed here.';
function run(code,map,input){const $=n=>({first:()=>({json:map[n]||{}}),isExecuted:!!map[n],all:()=>[{json:map[n]||{}}]});
 const f=new Function('$','$input','return (async()=>{'+code+'\n})()');return f($,{first:()=>({json:input||{}}),all:()=>[{json:input||{}}]});}
(async()=>{for(const tag of ['base','target']){const w=L(process.argv[tag==='base'?2:3]);const N=Object.fromEntries(w.nodes.map(n=>[n.name,n]));
 for(const r of ['D2B','C2B','D3B','C3B','D4B','C4B']){const prev=r.slice(0,2);
  const map={[prev+' Extract']:{raw:RAW,run_token:'t',fam:'openrouter',model:'m'},[prev+' Build']:{call:{fam:'openrouter',model:'m',body:{x:1}}}};
  let out;try{out=await run(N[r+' Build'].parameters.jsCode,map);}catch(e){console.log(tag,r,'BUILD THREW',e.message);continue;}
  const j=out[0].json;map[r+' Build']=j;
  let ex;try{ex=await run(N[r+' Extract'].parameters.jsCode,map,{});}catch(e){console.log(tag,r,'resend',j.resend,'lay_check' in j,'EXTRACT THREW',e.message.slice(0,80));continue;}
  const bar=ex[0].json.bar||{};console.log(tag,r,'resend',j.resend,'why',String(j.why).slice(0,40),'| build lay_check',j.lay_check===undefined?'ABSENT':(j.lay_check&&('items '+(j.lay_check.items||[]).length)),'| bar.layers',bar.layers===undefined?'ABSENT':JSON.stringify(bar.layers).slice(0,60));}}})();
