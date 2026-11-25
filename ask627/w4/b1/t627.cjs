// ASK 627 tests C1, C2, C4, C5 (offline). Usage: node t627.cjs base_eng base_child target_eng target_child qr_fixture
const fs=require('fs');const [,,BE,BC,TE,TC,QF]=process.argv;const J=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const be=J(BE),bc=J(BC),te=J(TE),tc=J(TC),QR=J(QF);let fails=0;
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fails++;};
const P=d=>Object.fromEntries(d.nodes.map(n=>[n.name,JSON.stringify(n.parameters)]));
const node=(d,n)=>d.nodes.find(k=>k.name===n);
// C5 scope
const ch=(a,b)=>Object.keys(P(b)).filter(k=>P(a)[k]!==P(b)[k]).concat(Object.keys(P(a)).filter(k=>!(k in P(b))));
ok(JSON.stringify(ch(be,te))==='["Panel Tokens"]','C5 engine: only Panel Tokens changed '+JSON.stringify(ch(be,te)));
ok(JSON.stringify(ch(bc,tc))==='["Alternate Pass Out"]','C5 child: only Alternate Pass Out changed '+JSON.stringify(ch(bc,tc)));
ok(JSON.stringify(be.connections)===JSON.stringify(te.connections)&&JSON.stringify(bc.connections)===JSON.stringify(tc.connections),'C5 connections unchanged');
for(const [d,n] of [[te,'Panel Tokens'],[tc,'Alternate Pass Out']]){let e=null;try{new Function('$','$input',node(d,n).parameters.jsCode);}catch(x){e=x.message;}ok(!e,'C5 compiles: '+n+(e?' '+e:''));}
ok((node(te,'Panel Tokens').parameters.jsCode.match(/ASK 627/g)||[]).length===1&&(node(tc,'Alternate Pass Out').parameters.jsCode.match(/ASK 627/g)||[]).length===1,'C5 ASK 599: one ASK 627 tag per changed node');
// C1 coverage
const api=n=>n.type.endsWith('httpRequest')&&/openrouter\.ai|api\.anthropic\.com|api\.deepseek\.com|generativelanguage|api\.openai\.com|api\.x\.ai/.test(JSON.stringify(n.parameters.url||''));
const pt=node(te,'Panel Tokens').parameters.jsCode;const clS=pt.slice(pt.indexOf('const __CL'),pt.indexOf('const __N='));
const CL=new Set([...clS.matchAll(/\$\('([^']+)'\)/g)].map(m=>m[1])),A3=new Set([...clS.matchAll(/__A379\('([^']+)'\)/g)].map(m=>m[1]));
const REASON={'Close Group Batch Call openrouter':'C3: its 5 replies carry the same ids as Close Enforcer Call (4) and Assume Check Call (1)','Enforcer Group Batch Call openrouter':'C3: its 11 replies carry the same ids as Enforcer Call (1) and Judge Enforcer Call (10)'};
const engMiss=te.nodes.filter(api).map(n=>n.name).filter(n=>!CL.has(n)&&!REASON[n]);
ok(engMiss.length===0,'C1 engine: every model-API node priced or out with a reason; missing '+JSON.stringify(engMiss)+'; out by reason: '+Object.keys(REASON).join(', '));
const ap=node(tc,'Alternate Pass Out').parameters.jsCode;const NM=JSON.parse(ap.slice(ap.indexOf('const NM=')+9,ap.indexOf('];',ap.indexOf('const NM='))+1));
const chMiss=tc.nodes.filter(api).map(n=>n.name).filter(n=>!(NM.includes(n)&&A3.has(n)));
ok(chMiss.length===0,'C1 child: every model-API node carried back and priced through __A379; missing '+JSON.stringify(chMiss)+' ('+tc.nodes.filter(api).length+' nodes)');
// harness for Panel Tokens
function runPT(code,ran,passNodes){const mk=items=>({isExecuted:true,all:()=>items.map(json=>({json})),first:()=>({json:items[0]})});
 const fixed={'Init Seats':[{run_token:'T627',regrade:false,dry:false}],'Build Save Body':[{saveBody:{input_tokens:0,output_tokens:0,cache_write_tokens:0,cache_read_tokens:0}}]};
 const $=n=>{if(n==='Pass Accumulate'){if(!passNodes)return {isExecuted:false,first:()=>{throw new Error('no run');},all:()=>[]};const pa={passes:[{pass:2}],nodes:passNodes};return {isExecuted:true,first:()=>({json:{__a379:pa}}),all:()=>[{json:{__a379:pa}}]};}
  if(fixed[n])return mk(fixed[n]);if(ran[n])return mk(ran[n]);return {isExecuted:false,first:()=>{throw new Error('Node '+n+' has not run');},all:()=>{throw new Error('not run');}};};
 return new Function('$','$input',code)($,{first:()=>({json:{}}),all:()=>[]})[0].json;}
// C2 shapes
const ADDED=['QR Answer D anthropic','QR Answer C anthropic','QR Answer C openrouter','QR Follow Ask','QR Follow D anthropic','QR Follow D openrouter','QR Follow C anthropic','QR Follow C openrouter','Enforcer Resend Call openrouter','Judge Enforcer Resend Call openrouter','Alt Judge Enforcer Resend Call openrouter','Close Group Retry Call openrouter'];
let id=0;const SH={anthropic:()=>({id:'msg_t'+(++id),model:'claude-opus-5-5',usage:{input_tokens:1000,cache_read_input_tokens:200,cache_creation_input_tokens:300,cache_creation:{ephemeral_1h_input_tokens:100},output_tokens:50}}),
 orcost:()=>({id:'gen-t'+(++id),model:'x/y',usage:{prompt_tokens:1000,completion_tokens:50,cost:0.012,is_byok:false,prompt_tokens_details:{cached_tokens:100,cache_write_tokens:0}}}),
 orbyok:()=>({id:'gen-t'+(++id),model:'x/z',usage:{prompt_tokens:1000,completion_tokens:50,cost:0.001,is_byok:true,prompt_tokens_details:{cached_tokens:0,cache_write_tokens:0},cost_details:{upstream_inference_cost:0.02}}})};
const oldPT=node(be,'Panel Tokens').parameters.jsCode;
for(const n of ADDED){for(const [k,f] of Object.entries(SH)){if(n.endsWith('anthropic')!==(k==='anthropic'))continue;const r=f();const o=runPT(pt,{[n]:[r]});const e=o.calls.filter(c=>c.n===n);
 const want=k==='anthropic'?(e[0]&&e[0].f==='anthropic'&&e[0].i===1000&&e[0].cr===200&&e[0].w1===100&&e[0].w5===200&&e[0].o===50&&e[0].b===undefined):k==='orcost'?(e[0]&&e[0].f==='openrouter'&&Math.abs(e[0].b-0.012)<1e-12):(e[0]&&e[0].f==='openrouter'&&Math.abs(e[0].b-0.021)<1e-12);
 const old=runPT(oldPT,{[n]:[r]}).calls.filter(c=>c.n===n).length;
 ok(e.length===1&&want&&old===0,'C2 '+n+' '+k+': one entry, right family and fields (live code gives '+old+')');}}
{const r=SH.orcost();const o=runPT(pt,{'R2 Alt Judge Enforcer Resend Call openrouter':[r]},{'R2 Alt Judge Enforcer Resend Call openrouter':{ran:true,items:[r]}});const e=o.calls.filter(c=>c.n==='R2 Alt Judge Enforcer Resend Call openrouter');ok(e.length===1&&Math.abs(e[0].b-0.012)<1e-12,'C2 R2 Alt Judge Enforcer Resend Call openrouter through __A379: one entry');}
{const o=runPT(pt,{});ok(o.calls.length===0,'C2 no added node ran: no entries');}
{const r=SH.orcost();const o=runPT(pt,{'QR Follow Ask':[r],'QR Follow D openrouter':[r]});ok(o.calls.length===1,'C2 same reply id in two nodes: counted once');}
{const r=SH.orcost();const o=runPT(pt,{'Close Enforcer Call openrouter':[r],'Close Group Retry Call openrouter':[r]});ok(o.calls.length===1&&o.calls[0].n==='Close Enforcer Call openrouter','C2 retry reply already counted in its call node: counted once');}
// C4: 42373 replies
const PR={'claude-opus-5-5':{i:4,cr:0.2,w5:5,w1:8,o:20},'claude-sonnet-5-5':{i:2,cr:0.1,w5:2.5,w1:4,o:10}};
const price=e=>e.b!==undefined?e.b:((p=>p?(e.i*p.i+e.cr*p.cr+e.w5*p.w5+e.w1*p.w1+e.o*p.o)/1e6:null)(PR[e.m]));
const ran={};for(const k of Object.keys(QR))if(k!=='source')ran[k]=QR[k];
const nw=runPT(pt,ran).calls,od=runPT(oldPT,ran).calls;
const by={};for(const e of nw){by[e.n]=(by[e.n]||0)+price(e);}
const tot=nw.reduce((s,e)=>s+price(e),0);
console.log('C4 per node: '+Object.entries(by).map(([k,v])=>k+' '+v.toFixed(4)).join('; '));
ok(od.length===0&&nw.length===9&&nw.every(e=>price(e)!==null),'C4 42373 QR replies: live code prices 0 of 9, new code 9 of 9');
ok(Math.abs(tot-1.3316)<0.00005,'C4 missing cost '+tot.toFixed(4)+' (stored 10.1217, true '+(10.1217+tot).toFixed(4)+')');
console.log(fails?'FAILED '+fails:'ALL PASS');
