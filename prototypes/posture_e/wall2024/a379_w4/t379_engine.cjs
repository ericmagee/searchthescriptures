// ASK 379 engine-side check on a stored pass-2 run: the new Second Alternate?, Pass Accumulate, Alternate Merge, Format Markdown and Panel Tokens,
// fed with the run's own stored R2 outputs as the sub-workflow's result, must give what live s259 code gives on the same stored inputs.
const fs=require('fs');const [BASE,TGT,EX]=process.argv.slice(2);
const L=JSON.parse(fs.readFileSync(BASE)),T=JSON.parse(fs.readFileSync(TGT));const code=(w,n)=>w.nodes.find(x=>x.name===n).parameters.jsCode;
const E=JSON.parse(fs.readFileSync(EX));const RD=E.data.resultData.runData;
const items=(nm,over)=>{if(over&&nm in over)return over[nm];const r=RD[nm];if(!r)return null;const last=r[r.length-1];return ((last.data&&last.data.main&&last.data.main[0])||[]);};
const mk$=over=>nm=>{const it=items(nm,over);if(!it)return {isExecuted:false,first:()=>{throw new Error('not run '+nm)},all:()=>{throw new Error('not run '+nm)},params:{}};return {isExecuted:true,first:()=>it[0]||{json:{}},all:()=>it,params:{}};};
const exe={id:String(E.id),customData:{set(){},get(){}}};
const run=(c,over,input)=>new Function('$','$input','require','$execution',c)(mk$(over),{all:()=>input||[],first:()=>(input||[{json:{}}])[0]},require,exe);
const js=JSON.stringify;let ok=0,bad=0;const chk=(n,a,b,show)=>{if(js(a)===js(b)){ok++;console.log('PASS',n);}else{bad++;console.log('FAIL',n);if(show)show();}};
const diffKeys=(a,b)=>()=>{for(const k of new Set([...Object.keys(a||{}),...Object.keys(b||{})]))if(js(a[k])!==js(b[k]))console.log('   differs:',k,js(a[k]).slice(0,160),'|',js(b[k]).slice(0,160));};
// 1. decision on the first entry
const AM1=items('Alternate Merge 1');const saL=run(code(L,'Second Alternate?'),{},AM1)[0].json;const saN=run(code(T,'Second Alternate?'),{},AM1)[0].json;
chk('Second Alternate? a2r (first entry)',saL.a2r,saN.a2r);const {__a379:_x,...saN0}=saN;chk('Second Alternate? item apart from __a379',saL,saN0);
// 2. the sub-workflow result, as the stored R2 nodes gave it
const BACK=['R2 Alternate Build','R2 Alternate Cure Build','R2 Alternate Cure Normalize','R2 Alternate Call openrouter','R2 Alternate Cure Call openrouter','R2 Alt Judge Enforcer Call deepseek','R2 Alt Judge Enforcer Retry Call deepseek','R2 Alt Send Back Call openrouter','R2 Alt Gate Call openrouter','R2 Alt Late Gate Call openrouter','R2 Alt Reread Call deepseek','FUM Call R2 Alternate openrouter'];
const nodes={};for(const n of BACK){const it=items(n);nodes[n]=it?{ran:true,items:it.map(i=>i.json)}:{ran:false,items:[]};}
const child=[{json:{...items('R2 Alternate Merge')[0].json,__a379_nodes:nodes}}];
const acc=run(code(T,'Pass Accumulate'),{'Second Alternate?':[{json:saN}]},child)[0].json;
console.log('   passes recorded',acc.__a379.passes.length,'pass',acc.__a379.passes[0].pass,'error',acc.__a379.passes[0].error);
// 3. Alternate Merge: with the stored decision as the last Second Alternate? run, the new merge equals live
const amL=items('Alternate Merge')[0].json;const amLive=run(code(L,'Alternate Merge'),{})[0].json;chk('live code reproduces the stored Alternate Merge',amLive,amL);
const amN=run(code(T,'Alternate Merge'),{'Pass Accumulate':[{json:acc}],'Second Alternate?':[{json:saN}]})[0].json;chk('Alternate Merge (fold) == live',amN,amLive,diffKeys(amLive,amN));
// 4. Panel Tokens and Format Markdown, reading the pass record
for(const n of ['Panel Tokens','Format Markdown']){let a,b;const inp=items(n)?null:null;
 const fin=n==='Format Markdown'?(items('Format Markdown')||[]):(items(n)?RD[n][RD[n].length-1].inputOverride:null);
 try{a=run(code(L,n),{},n==='Format Markdown'?items('Format Markdown'):(items(Object.keys(RD).find(k=>(E.data.resultData.runData[k]||[]).length&&false))||[]));}catch(e){a={err:e.message};}
 try{b=run(code(T,n),{'Pass Accumulate':[{json:acc}]},n==='Format Markdown'?items('Format Markdown'):[]);}catch(e){b={err:e.message};}
 const sa=js(a),sb=js(b);if(n==='Format Markdown'){const A=a[0].json.md.split('\n'),B=b[0].json.md.split('\n');const d=A.filter((l,i)=>l!==B[i]).length;chk(n+' markdown == live ('+A.length+' lines)',A.length===B.length&&d===0,true,()=>{A.forEach((l,i)=>{if(l!==B[i])console.log('   -',l.slice(0,160),'\n   +',String(B[i]).slice(0,160));});});}
 else chk(n+' output == live',sa,sb,()=>console.log('   live',sa.slice(0,300),'\n   new ',sb.slice(0,300)));}
console.log('pass',ok,'fail',bad);
{const a=run(code(L,'Panel Tokens'),{},[])[0].json,b=run(code(T,'Panel Tokens'),{'Pass Accumulate':[{json:acc}]},[])[0].json;for(const k of new Set([...Object.keys(a),...Object.keys(b)]))if(js(a[k])!==js(b[k]))console.log('PT differs',k,'\n live',js(a[k]).slice(0,400),'\n new ',js(b[k]).slice(0,400));}
{const a=run(code(L,'Panel Tokens'),{},[])[0].json.calls,b=run(code(T,'Panel Tokens'),{'Pass Accumulate':[{json:acc}]},[])[0].json.calls;console.log('calls',a.length,b.length);const sa=new Set(a.map(js)),sb=new Set(b.map(js));a.forEach(x=>{if(!sb.has(js(x)))console.log(' only live',js(x));});b.forEach(x=>{if(!sa.has(js(x)))console.log(' only new',js(x));});}
