// ASK 642 tests (W4). node t642.cjs base.json target.json
const fs=require('fs');const [,,BA,TG]=process.argv;const B=JSON.parse(fs.readFileSync(BA,'utf8')),T=JSON.parse(fs.readFileSync(TG,'utf8'));
let pass=0,fail=0;const ok=(c,m)=>{if(c)pass++;else{fail++;console.log('FAIL',m);}};
const N=E=>Object.fromEntries(E.nodes.map(n=>[n.name,n]));const NB=N(B),NT=N(T);
const run=(E,R1,RS,bodies)=>{const map={'Gate Record':{bodies},'Init Seats':{dry:false},'Resolve Seats':RS};const $=k=>({first:()=>({json:map[k]})});const $input={first:()=>({json:R1})};return new Function('$','$input',N(E)['Second Alternate?'].parameters.jsCode)($,$input)[0].json.a2r;};
const W54606='seat "sonnet" returned content null (finish_reason length). NO ROW IS WRITTEN. run_token=ODV1-42528-dqwbcshc';
const RS={debaters:[{model:'google/gemini-4-hydrogen',family:'google'},{model:'meta/muse-spark-1.3',family:'meta'}],alternates:[{seat:'chatgpt',api_model:'openai/gpt-6.1-terra',family:'openai'},{seat:'sonnet',api_model:'anthropic/claude-sonnet-5.5',family:'anthropic'},{seat:'luna',api_model:'openai/gpt-6-luna',family:'openai'}]};
const bodies=['qwen4max','sol','sol62'].map((s,i)=>JSON.stringify({payload:{judge_seat:s,judge_api_model:['qwen/qwen4-max','openai/gpt-6.1-sol','openai/gpt-6.2-sol'][i]}}));
const mk=why=>({alternates_seated:[],alternates_tried:[{removed_seat:'qwen4max',alternate:'chatgpt',api_model:'openai/gpt-6.1-terra',result:'NOT SEATED',why:'unseated after its enforcer send-back and gate: 3 uncured item(s)'},{removed_seat:'sol',alternate:'sonnet',api_model:'anthropic/claude-sonnet-5.5',result:'NOT SEATED',why}]});
// C1 42528
{const o=run(B,mk(W54606),RS,bodies),n=run(T,mk(W54606),RS,bodies);console.log('C1 old',JSON.stringify(o));console.log('C1 new',JSON.stringify(n));
 ok(o.retry.includes('anthropic/claude-sonnet-5.5'),'C1 old retries sonnet');ok(n.retry.length===0&&n.tried.includes('anthropic/claude-sonnet-5.5')&&!n.free.includes('sonnet'),'C1 new: sonnet tried, not retried, not free');}
// C2
for(const [why,stay] of [['seat "x" returned no JSON object. First 200 chars: {} (finish_reason stop)',true],['seat "x" returned content null (finish_reason none). NO ROW',true],['seat "x" JSON did not parse (finish_reason max_tokens)',false],['seat "x" returned content null (finish_reason length)',false]]){
 const o=run(B,mk(why),RS,bodies),n=run(T,mk(why),RS,bodies);ok(o.retry.includes('anthropic/claude-sonnet-5.5'),'C2 old retries: '+why);ok(n.retry.includes('anthropic/claude-sonnet-5.5')===stay,'C2 new '+(stay?'retries':'does not retry')+': '+why);
 if(stay)ok(JSON.stringify(o)===JSON.stringify(n),'C2 equal: '+why);}
{const R=mk(W54606);R.alternates_tried.push({removed_seat:'sol62',alternate:'sonnet',api_model:'anthropic/claude-sonnet-5.5',result:'NOT SEATED',why:'returned no JSON object (finish_reason stop)'});ok(JSON.stringify(run(B,R,RS,bodies))===JSON.stringify(run(T,R,RS,bodies)),'C2 a model tried twice: unchanged');}
// C3
const P=E=>Object.fromEntries(E.nodes.map(n=>[n.name,JSON.stringify(n.parameters)]));const pb=P(B),pt=P(T);const ch=Object.keys(pb).filter(k=>pb[k]!==pt[k]);
ok(JSON.stringify(ch)===JSON.stringify(['Second Alternate?']),'C3 changed '+ch);ok(JSON.stringify(Object.keys(pb).sort())===JSON.stringify(Object.keys(pt).sort())&&JSON.stringify(B.connections)===JSON.stringify(T.connections),'C3 nodes and connections');
try{new Function('$','$input',NT['Second Alternate?'].parameters.jsCode);ok(true);}catch(e){ok(false,'compile');}
// C4
const nt=NT['Second Alternate?'].parameters.jsCode;ok((nt.match(/ASK 642/g)||[]).length===1&&(nt.match(/catch/g)||[]).length===(NB['Second Alternate?'].parameters.jsCode.match(/catch/g)||[]).length,'C4 tag, no new catch');
console.log(pass+' pass, '+fail+' fail');console.log(fail?'FAILED':'ALL PASS');
