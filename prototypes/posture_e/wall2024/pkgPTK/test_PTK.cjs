// pkgPTK test: no computed $() is left; each node gives the same output as its base on the same stand-in data; and every name the base
// asks for by a computed name is in the literal table. Run from wall2024/ after build_PTK.cjs: node pkgPTK/test_PTK.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const rd=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(rd('pkgPTK/plan_PTK.json'));const P=require('./scan.cjs');
T('plan shas match base and patched files',plan.nodes.every(p=>{const f=p.node.replace(/ /g,'_')+'.js';return sha(rd('pkgPTK/base/'+f))===p.base_sha&&sha(rd('pkgPTK/patched/'+f))===p.final_sha;}));
for(const p of plan.nodes){const s=rd('pkgPTK/patched/'+p.node.replace(/ /g,'_')+'.js');T(p.node+': every $() call names its node literally (scanner reads each call to its closing paren; $(\'lit\'+x) counts as computed)',P.COMPN(s).length===0&&P.COMPN("$('A '+x)").length===1&&P.COMPN("$('A')").length===0);}
// stand-in data: every node answers with usage of both forms; some are not executed
const usage=(n,i)=>i%3===0?{usageMetadata:{promptTokenCount:100+i,candidatesTokenCount:10+i,thoughtsTokenCount:1,cachedContentTokenCount:i}}:{usage:{prompt_tokens:200+i,completion_tokens:20+i,prompt_tokens_details:{cache_write_tokens:i,cached_tokens:2*i}},raw:'r'+i,cache_diag:'[CACHE DIAG '+n+']',round_fix:i%2?{placeholder:true}:null};
const mk=(n,i)=>({isExecuted:true,first:()=>({json:usage(n,i)}),all:()=>[{json:usage(n,i)},{json:usage(n,i+1)}]});
const runWith=(code,skip)=>{const asked=[];let i=0;const seen={};const $=n=>{asked.push(n);if(n==='Init Seats')return {isExecuted:true,first:()=>({json:{run_token:'t',regrade:false,dry:false,panel_expected:['gemini','chatgpt','sol']}})};
  if(n==='Build Save Body')return {isExecuted:true,first:()=>({json:{saveBody:{input_tokens:1,output_tokens:2,cache_write_tokens:3,cache_read_tokens:4}}})};
  if(skip.test(n))return {isExecuted:false,first:()=>{throw new Error('not run');},all:()=>[]};if(!(n in seen))seen[n]=++i;return mk(n,seen[n]);};
 let out,err=null;try{out=new Function('$','$input','$json',code)($,{first:()=>({json:{}}),all:()=>[]},{});}catch(e){err=String(e.message);}return {out:JSON.stringify(out),err,asked};};
{const b=rd('pkgPTK/base/Panel_Tokens.js'),p=rd('pkgPTK/patched/Panel_Tokens.js');
 for(const skip of [/^$/,/Judge 2|Reserve|Cure Call 3/,/./]){const x=runWith(b,skip),y=runWith(p,skip);T('Panel Tokens: same output as the base (skipped: '+skip+')',x.out===y.out&&x.err===y.err&&x.out&&x.out.length>20,y.out&&y.out.slice(0,160));}
 const x=runWith(b,/^$/),y=runWith(p,/^$/);T('Panel Tokens: asks for the same nodes in the same order',JSON.stringify(x.asked)===JSON.stringify(y.asked),x.asked.length+' asks');}
{const b=rd('pkgPTK/base/Build_Save_Body.js'),p=rd('pkgPTK/patched/Build_Save_Body.js');const T0=p.match(/const __L=\{([^\n]*)\}; \/\* pkgPTK/)[1];const names=[...T0.matchAll(/"([^"]+)":/g)].map(m=>m[1]);
 const need=['D1','C1','D2','C2','D3','C3','D4','C4'].map(r=>r+' Extract').concat(['Synthesis Normalizer','Verdict Normalizer','Diagnostic Normalizer'],['deepseek','openai','gemini','grok','mimo','openrouter'].map(f=>'Cure Call '+f));
 T('Build Save Body: the table holds the 8 round Extracts, the 3 Normalizers and the 6 Cure Calls',need.every(n=>names.includes(n))&&names.length===17);
 const x=runWith(b,/^$/),y=runWith(p,/^$/);T('Build Save Body on stand-in data: same result or same error as the base, and the same nodes asked for',x.out===y.out&&x.err===y.err&&JSON.stringify(x.asked)===JSON.stringify(y.asked),'err: '+x.err+' | asks '+x.asked.length);}
console.log('\n'+ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
