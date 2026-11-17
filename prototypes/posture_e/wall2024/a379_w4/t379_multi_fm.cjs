// ASK 379 multi-pass check of the TARGET's own engine code (Second Alternate?, Pass Accumulate, Alternate Merge, Format Markdown, Panel Tokens)
// on 38450: pass 2 = the recorded pass (ernie, content null); pass 3 = synthetic (ernie retried once, content null again); pass 4 = the sub-workflow errors; the cap (3 for this check) ends the loop.
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

const ER='baidu/ernie-5.5-flash-preview:free';
(async()=>{
 let sa=await run('Second Alternate?',stored('Alternate Merge 1')[0]);let d=sa[0].json.a2r;chk('pass 2 decision equals the record',js(d)===js(stored('Second Alternate?')[0][0].json.a2r),js(d));
 let acc=await run('Pass Accumulate',[{json:{...R2s,__a379_nodes:nodes2}}]);
 sa=await run('Second Alternate?',acc);d=sa[0].json.a2r;chk('pass 3 decision: ernie retried once',d.run&&js(d.retry)===js([ER])&&sa[0].json.__a379.pass===3,js(d));
 const nodes3=JSON.parse(js(nodes2));for(const n of Object.keys(nodes3))nodes3[n].items=nodes3[n].items.map(x=>x&&x.id?{...x,id:String(x.id)+'-pass3'}:x);
 acc=await run('Pass Accumulate',[{json:{...R2s,__a379_nodes:nodes3}}]);
 sa=await run('Second Alternate?',acc);d=sa[0].json.a2r;chk('pass 4 decision: no third try of ernie; sonnet',d.run&&d.retry.length===0&&js(d.free)===js(['sonnet']),js(d));
 acc=await run('Pass Accumulate',[{json:{error:{message:'synthetic sub-workflow failure'}}}]);
 sa=await run('Second Alternate?',acc);d=sa[0].json.a2r;chk('pass 5 decision: pool spent, no run (before the cap)',d.run===false&&/no pool model is left/.test(d.why)&&d.free.length===0,js(d));
 const am=await run('Alternate Merge',[]);const A=am[0].json;chk('Alternate Merge output has no __a379',!('__a379' in A));
 const T=A.alternates_tried.filter(x=>x.removed_seat==='chatgpt');console.log('   chatgpt tried:',T.map(x=>x.alternate+':'+x.why.slice(0,45)));
 chk('chatgpt tried: haiku, ernie x2, sonnet (error); no none line when the pool is spent',js(T.map(x=>x.alternate))===js(['haiku','ernie','ernie','sonnet']));
 for(const b of A.bodies){const q=JSON.parse(b).payload;const L=String(q.verdict_raw||'').split('\n').filter(l=>/ALTERNATE TRIED/.test(l));if(L.length){console.log('   body',q.judge_seat,L.length);L.forEach(l=>console.log('      ',l.slice(0,140)));}}
 console.log('   drv_removed',js(A.drv_removed).slice(0,300));
 RUNS['Alternate Merge']=[am];
 {const GJ=stored('Get Judgments')[0];const byS={};for(const b of A.bodies){const q=JSON.parse(b).payload;byS[q.judge_seat]=q.verdict_raw;}RUNS['Get Judgments']=[GJ.map(i=>({json:(i.json&&byS[i.json.judge_seat]!=null)?{...i.json,verdict_raw:byS[i.json.judge_seat]}:i.json}))];console.log('   Get Judgments rows given the new bodies:',GJ.filter(i=>i.json&&byS[i.json.judge_seat]!=null).length);} /* the rows the write would hold */
 const fm=(await run('Format Markdown',stored('Format Markdown')?stored('Format Markdown')[0]:[]))[0].json.md;
 const fl=fm.split('\n').filter(l=>/(ernie|sonnet|haiku)/.test(l)&&/(chatgpt|tried|TRIED|NOT SEATED|not counted|sub-workflow)/i.test(l));console.log('   Format Markdown chatgpt alternate lines:');fl.forEach(l=>console.log('     ',l.slice(0,190)));
 const low=fm.split('\n').filter(l=>/^- ChatGPT: alternate /.test(l));const hdr=fm.split('\n').find(l=>/seat stayed empty: ChatGPT/.test(l))||'';console.log('   header:',hdr);
 chk('Format Markdown: four tried lines (haiku, ernie, ernie retried, sonnet error); header names haiku, ernie, sonnet',low.length===4&&/sub-workflow error/.test(low[3])&&/Haiku/.test(hdr)&&/ernie/.test(hdr)&&/sonnet/i.test(hdr),low.length);
 const pt=(await run('Panel Tokens',[]))[0].json;chk('Panel Tokens: both ernie passes costed',pt.calls.filter(c=>c.n==='R2 Alternate Call openrouter').length===2,js(pt.calls.filter(c=>/R2/.test(c.n))));
 console.log('pass',ok,'fail',bad);})().catch(e=>{console.log('ERROR',e.stack);});
