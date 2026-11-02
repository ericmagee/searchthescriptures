// Runs base and new D1/D2/D3 Build with mocks for a Claude-via-OpenRouter defender and a non-Claude defender; checks markers, prefixes and that non-Claude bodies are unchanged (D2's opening message excepted).
const fs=require('fs');
const run=(file,ctx)=>{const code=fs.readFileSync(file,'utf8');
 const $=n=>{if(!(n in ctx))return {first:()=>({json:new Proxy({},{get:(t,k)=>typeof k==='string'?('['+n+'.'+k+']'):undefined})}),all:()=>[]};return {first:()=>({json:ctx[n]}),all:()=>[{json:ctx[n]}],isExecuted:true};};
 return new Function('$','$input','$json','$items',code)($,{first:()=>({json:{}})},{},()=>[])[0].json;};
const meta=JSON.parse(fs.readFileSync('../ground_live/meta.json','utf8'));
const IG={topic:'Did Christ have a biological father?',dsys:'DEFENDER FRAME '.repeat(400),csys:'CHALLENGER FRAME '.repeat(400),c_served:meta.c_served,d_served:meta.d_served,c_named:[],d_named:[]};
const mk=(fam,model)=>({ 'Init with Guards':IG,'Init Seats':{run_token:'ODV1-TEST',dpos:'the standard reading',cpos:'the record reading'},
 'Resolve Seats':{defender:{fam,model,tok:32000},challenger:{fam:'openrouter',model:'xiaomi/mimo-v2.6-pro',tok:32000}},
 'D1 Extract':{raw:'D1 ROUND TEXT'},'C1 Extract':{raw:'C1 ROUND TEXT'},'C2 Extract':{raw:'C2 ROUND TEXT\n1. LINK 1: premise'} });
let bad=0;const say=(ok,m)=>{if(!ok)bad++;console.log((ok?'OK  ':'BAD ')+m);};
for(const [fam,model] of [['openrouter','anthropic/claude-sonnet-5.5'],['anthropic','claude-sonnet-5-5'],['openrouter','xiaomi/mimo-v2.6-pro'],['deepseek','deepseek-flash']]){
 const out={};for(const v of ['base','new']){const ctx=mk(fam,model);const d1=run(`${v}/D1 Build.js`,ctx);ctx['D1 Build']=d1;out[v]={d1,d2:run(`${v}/D2 Build.js`,ctx),d3:run(`${v}/D3 Build.js`,ctx)};}
 const claude=/anthropic|claude/.test(model);const B=r=>out.new[r].call.body, OB=r=>out.base[r].call.body;
 const sysOf=b=>b.system||(b.messages&&b.messages[0].role==='system'?b.messages[0].content:null);
 const msgsOf=b=>b.system?b.messages:(b.messages||[]).filter(m=>m.role!=='system');
 const txt=c=>typeof c==='string'?c:(Array.isArray(c)?c.map(x=>x.text).join(''):JSON.stringify(c));
 // D2 opening equals D1 opening, in every family
 say(txt(msgsOf(B('d2'))[0].content)===txt(msgsOf(B('d1'))[0].content),`${model}: D2 replays D1's opening message`);
 if(claude){
  const s1=sysOf(B('d1')),s2=sysOf(B('d2')),s3=sysOf(B('d3'));
  say(Array.isArray(s1)&&s1.length===2&&s1.every(x=>x.cache_control),`${model}: D1 system = 2 marked blocks`);
  say(JSON.stringify(s1)===JSON.stringify(s2),`${model}: D2 system identical to D1`);
  say(s3.length===1&&s3[0].text===s1[0].text&&s3[0].cache_control,`${model}: D3 system block = D1's first block, marked`);
  for(const r of ['d1','d2','d3']){const m=msgsOf(B(r));const last=m[m.length-1];say(Array.isArray(last.content)&&last.content[0].cache_control,`${model}: ${r} last message marked`);
   const marks=JSON.stringify(B(r)).split('cache_control').length-1;say(marks<=4,`${model}: ${r} ${marks} markers (max 4)`);
   say(txt(sysOf(B(r)))===txt(sysOf(OB(r))),`${model}: ${r} system text unchanged`);
   const mo=msgsOf(OB(r)),mn=msgsOf(B(r));say(mo.length===mn.length&&mn.slice(r==='d2'?1:0).every((x,i)=>txt(x.content)===txt(mo[i+(r==='d2'?1:0)].content)),`${model}: ${r} message texts unchanged${r==='d2'?' (opening excepted)':''}`);}
  const m1=msgsOf(B('d1')),m2=msgsOf(B('d2'));say(txt(m1[0].content)===txt(m2[0].content),`${model}: D2 prefix starts with D1's cached message`);
 } else {
  for(const r of ['d1','d3']) say(JSON.stringify(B(r))===JSON.stringify(OB(r)),`${model}: ${r} body byte-identical`);
  const a=JSON.parse(JSON.stringify(B('d2'))),b=JSON.parse(JSON.stringify(OB('d2')));const ma=msgsOf(a),mb=msgsOf(b);ma[0].content='X';mb[0].content='X';say(JSON.stringify(a)===JSON.stringify(b),`${model}: d2 body identical apart from the opening message`);
 }}
console.log('bad',bad);
