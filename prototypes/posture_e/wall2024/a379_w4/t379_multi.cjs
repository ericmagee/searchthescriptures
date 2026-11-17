// ASK 379 multi-pass check of the TARGET's own engine code (Second Alternate?, Pass Accumulate, Alternate Merge, Format Markdown, Panel Tokens)
// on 37372: pass 2 = the recorded pass (hydrogen retried, no JSON); pass 3 = synthetic (gemini, content null); pass 4 = the sub-workflow errors; the cap (3 for this check) ends the loop.
const fs=require('fs');const [TGT,EX]=process.argv.slice(2);const T=JSON.parse(fs.readFileSync(TGT));const code=n=>T.nodes.find(x=>x.name===n).parameters.jsCode;
const E=JSON.parse(fs.readFileSync(EX));const RD=E.data.resultData.runData;const stored=nm=>{const r=RD[nm];return r?[(r[r.length-1].data.main[0]||[])]:null;};
const RUNS={};const runsOf=nm=>RUNS[nm]||stored(nm);
const $=nm=>{const R=runsOf(nm);if(!R||!R.length)return {isExecuted:false,first:()=>{throw new Error('not run '+nm)},all:()=>{throw new Error('not run '+nm)},params:{}};
 const last=R[R.length-1];return {isExecuted:true,params:{},first:()=>last[0],last:()=>last[last.length-1],all:(b,r)=>r==null?last:(R[r]||(()=>{throw new Error('no run '+r+' of '+nm)})()),itemMatching:i=>last[i]};};
const AF=Object.getPrototypeOf(async function(){}).constructor;
const run=async(n,input)=>{const out=await new AF('$','$input','$execution','require',code(n))($,{all:()=>input,first:()=>input[0]},{id:'37372',customData:{set(){},get(){}}},require);(RUNS[n]=RUNS[n]||[]).push(out);return out;};
const js=JSON.stringify;let ok=0,bad=0;const chk=(m,c,info)=>{if(c){ok++;console.log('PASS',m);}else{bad++;console.log('FAIL',m,info||'');}};
const BACK=['R2 Alternate Build','R2 Alternate Cure Build','R2 Alternate Cure Normalize','R2 Alternate Call openrouter','R2 Alternate Cure Call openrouter','R2 Alt Judge Enforcer Call deepseek','R2 Alt Judge Enforcer Retry Call deepseek','R2 Alt Send Back Call openrouter','R2 Alt Gate Call openrouter','R2 Alt Late Gate Call openrouter','R2 Alt Reread Call deepseek','FUM Call R2 Alternate openrouter'];
const nodes2={};for(const n of BACK){const s=stored(n);nodes2[n]=s?{ran:true,items:s[0].map(i=>i.json)}:{ran:false,items:[]};}
const R2s=stored('R2 Alternate Merge')[0][0].json;const pool=stored('Resolve Seats')[0][0].json.alternates;const gem=pool.find(a=>a.seat==='gemini');
(async()=>{
 // pass 2 decision
 let sa=await run('Second Alternate?',stored('Alternate Merge 1')[0]);let d=sa[0].json.a2r;chk('pass 2 decision: hydrogen retried once',d.run&&js(d.retry)===js(['google/gemini-4-hydrogen'])&&sa[0].json.__a379.pass===2,js(d));
 let acc=await run('Pass Accumulate',[{json:{...R2s,__a379_nodes:nodes2}}]);
 // pass 3 decision: hydrogen has two tries, never a third
 sa=await run('Second Alternate?',acc);d=sa[0].json.a2r;chk('pass 3 decision: no third try of hydrogen; gemini first free',d.run&&d.retry.length===0&&d.tried.includes('google/gemini-4-hydrogen')&&d.free[0]==='gemini'&&sa[0].json.__a379.pass===3,js(d));
 const R3=JSON.parse(js(R2s).split('google/gemini-4-hydrogen').join(gem.api_model).split('"hydrogen"').join('"gemini"').split('returned no JSON object').join('returned content null'));
 const nodes3=JSON.parse(js(nodes2).split('google/gemini-4-hydrogen').join(gem.api_model));nodes3['R2 Alternate Call openrouter'].items=nodes3['R2 Alternate Call openrouter'].items.map(x=>({...x,id:String(x.id)+'-pass3'}));
 acc=await run('Pass Accumulate',[{json:{...R3,__a379_nodes:nodes3}}]);
 // pass 4 decision: gemini retried once (content null); the sub-workflow errors
 sa=await run('Second Alternate?',acc);d=sa[0].json.a2r;chk('pass 4 decision: gemini retried once',d.run&&js(d.retry)===js([gem.api_model])&&sa[0].json.__a379.pass===4,js(d));
 acc=await run('Pass Accumulate',[{json:{error:{message:'synthetic sub-workflow failure'}}}]);
 const t4=acc[0].json.alternates_tried.filter(x=>/sub-workflow error/.test(x.why));chk('errored pass recorded as NOT SEATED for sol',t4.length===1&&t4[0].removed_seat==='sol'&&t4[0].result==='NOT SEATED',js(t4));
 chk('pass list small, one entry per pass, no node items in it',js(acc[0].json.__a379.passes.map(p=>p.pass))===js([2,3,4])&&!acc[0].json.__a379.passes.some(p=>p.nodes),js(acc[0].json.__a379.passes.map(p=>Object.keys(p))));
 {const save=RUNS['Pass Accumulate'].slice();const e=await run('Pass Accumulate',[{json:{}}]);const t=e[0].json.alternates_tried.filter(x=>/the pass returned no result/.test(x.why));chk('a pass with no result (empty item) recorded as NOT SEATED',t.length===1&&t[0].result==='NOT SEATED',js(t));RUNS['Pass Accumulate']=save;}
 // pass 5 decision: the cap ends the loop
 sa=await run('Second Alternate?',acc);d=sa[0].json.a2r;chk('pass 5 decision: cap reached, no run',d.run===false&&/the cap of 3/.test(d.why),js(d));
 const am=await run('Alternate Merge',[]);const A=am[0].json;chk('Alternate Merge output has no __a379',!('__a379' in A));
 const tr=A.alternates_tried.filter(x=>x.removed_seat==='sol').map(x=>x.alternate+':'+x.result+':'+x.why.slice(0,40));console.log('   sol tried:',tr);
 chk('sol tried: hydrogen x2, gemini, error, none (cap)',A.alternates_tried.filter(x=>x.removed_seat==='sol').length===5&&/the cap of 3/.test(A.alternates_tried[A.alternates_tried.length-1].why));
 const body=A.bodies.map(b=>JSON.parse(b).payload).find(p=>p.judge_seat==='sol');const L=String(body.verdict_raw).split('\n').filter(l=>/ALTERNATE TRIED/.test(l));console.log('   sol body tried lines:');L.forEach(l=>console.log('     ',l.slice(0,150)));
 chk('sol body: no duplicate tried lines',L.length===new Set(L).size,L.length+' lines');
 RUNS['Alternate Merge']=[am];
 const pt=(await run('Panel Tokens',[]))[0].json;const pt1=pt.calls.filter(c=>/R2 Alternate Call/.test(js(c)));console.log('   Panel Tokens calls naming R2 Alternate Call:',pt1.length);
 chk('Panel Tokens reads both passes of R2 Alternate Call (two calls, two counted in panel_calls)',pt1.length===2&&pt.panel_calls.filter(n=>n==='R2 Alternate Call openrouter').length===2,js(pt1).slice(0,300));
 /* Format Markdown needs nodes not fetched for 37372; it is checked on 38450 in t379_multi_fm.cjs */
 console.log('pass',ok,'fail',bad);})().catch(e=>{console.log('ERROR',e.stack);});
