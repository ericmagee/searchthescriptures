// pkgPTA part B real-input test (W3 2653). Run from wall2024/ after build_PTA.cjs A then B: node pkgPTA/test_PTA_B_real.cjs [run]
// Each held node runs twice on run <run>'s saved outputs (inputs/<run>_<Node>.json): its base code (the code that ran in that run) and its
// part B code. $('<name>') reads the saved output of that node; a node with no saved file is unexecuted (first/all/item throw, as in n8n).
// $input is the node's main predecessor's output, read through unsaved IF nodes (connections of fetchback_live_1b49671d). Pass: base and part B give the same output (or
// the same error), and base reproduces the node's own saved output where one is saved. Timestamps are masked before comparing.
const fs=require('fs');const RUN=process.argv[2]||'33197';const D='/mnt/project-files/wall2024/inputs/';
const HELD=['Panel Done','Panel Check','Panel Payloads','Accept Final','Accept Check','Accept Build','D1 Build','C1 Build','D2 Build','C2 Build','D3 Build','C3 Build','D4 Build','C4 Build'];
let W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_1b49671d.json','utf8'));W=W.nodes?W:(W.data||W);
const TY=Object.fromEntries(W.nodes.map(n=>[n.name,String(n.type).split('.').pop()]));const pred={};for(const [src,c] of Object.entries(W.connections||{}))for(const outs of (c.main||[]))for(const e of (outs||[]))(pred[e.node]=pred[e.node]||[]).push(src);
const cache={};const saved=n=>{if(n in cache)return cache[n];const f=D+RUN+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return cache[n]=null;const d=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(d)?d[0]:d;
 const m=(r.data&&r.data.main)||r.main;return cache[n]=(m&&m[0])||[];};
const fetched=new Set();const unexec=new Set();
const mk=n=>{const it=saved(n);fetched.add(n);if(it===null){unexec.add(n);const no=()=>{throw new Error("ExpressionError: Referenced node is unexecuted: "+n);};return {isExecuted:false,first:no,last:no,all:no,get item(){return no();},itemMatching:no,params:{}};}
 const cl=x=>JSON.parse(JSON.stringify(x));return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),get item(){return cl(it[0]);},itemMatching:i=>cl(it[i]||it[0]),params:{}};};
// an unsaved IF node passes its own input on: read through it to its saved predecessor
const srcOf=name=>{for(const x of (pred[name]||[])){if(saved(x)!==null)return x;if(TY[x]==='if'){const y=srcOf(x);if(y)return y;}}return null;};
const runCode=(code,name)=>{const p=srcOf(name);const inp=p?saved(p):[];const $input={first:()=>JSON.parse(JSON.stringify(inp[0])),last:()=>JSON.parse(JSON.stringify(inp[inp.length-1])),all:()=>JSON.parse(JSON.stringify(inp)),get item(){return JSON.parse(JSON.stringify(inp[0]));}};
 const RealDate=Date;const FIX=new RealDate('2026-11-07T00:00:00Z').getTime();class FD extends RealDate{constructor(...a){a.length?super(...a):super(FIX);}static now(){return FIX;}}
 const rnd=Math.random;let seed=1;Math.random=()=>((seed=seed*16807%2147483647)/2147483647);global.Date=FD;
 try{const f=new Function('$','$input','$json','$execution','$workflow','$now','$vars','$env',code);const o=f(mk,$input,$input.first()&&$input.first().json,{id:RUN,mode:'trigger',resumeUrl:'',customData:{set:()=>{},get:()=>undefined,setAll:()=>{},getAll:()=>({})}},{id:'w',name:'w',active:true},new FD(),{},{});return {ok:true,out:o,pred:p||null};}
 catch(e){return {ok:false,err:String(e&&e.message||e),pred:p||null};}finally{global.Date=RealDate;Math.random=rnd;}};
const mask=s=>JSON.stringify(s).replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z/g,'<T>');
let ok=0,bad=0,nt=[],lines=[];const T=(n,c,d)=>{const l=(c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:'');console.log(l);lines.push(l);c?ok++:bad++;};
for(const n of HELD){const f=n.replace(/ /g,'_')+'.js';const B=fs.readFileSync('pkgPTA/base/'+f,'utf8'),P=fs.readFileSync('pkgPTA/patched/'+f,'utf8');
 fetched.clear();unexec.clear();const a=runCode(B,n);const fa=[...fetched].sort(),ua=[...unexec].sort();fetched.clear();unexec.clear();const b=runCode(P,n);const fb=[...fetched].sort();
 const own=saved(n);const same=a.ok===b.ok&&(a.ok?mask(a.out)===mask(b.out):a.err===b.err);
 const repro=own===null?'no saved output (did not run in '+RUN+')':(a.ok&&mask((a.out||[]).map(x=>x.json))===mask(own.map(x=>x.json))?'base reproduces the saved output':'base differs from the saved output');
 if(!a.ok&&own!==null&&!a.pred){const l='NOT TESTED '+n+': its input node ('+JSON.stringify(pred[n]||[])+') has no saved output in '+RUN+' (an HTTP node); base errors before any fetch: '+a.err.slice(0,80);console.log(l);lines.push(l);nt.push(n);continue;}
 T(n+': base and part B '+(same?'agree':'DIFFER')+' ('+(a.ok?'output '+(a.out||[]).length+' item(s)':'both error: '+a.err.slice(0,90))+'); '+repro+'; fetched '+fa.length+' node(s), '+ua.length+' unexecuted; same fetches: '+(JSON.stringify(fa)===JSON.stringify(fb)),same&&JSON.stringify(fa)===JSON.stringify(fb),(!same?(a.ok?'':'base: '+a.err)+' | '+(b.ok?'':'B: '+b.err):'')+(ua.length?' unexecuted: '+ua.join(', '):''));}
fs.writeFileSync('pkgPTA/test_PTA_B_real_'+RUN+'.txt',lines.join('\n')+'\n'+ok+' OK, '+bad+' FAIL, '+nt.length+' NOT TESTED ('+nt.join(', ')+')\n');console.log(ok+' OK, '+bad+' FAIL, '+nt.length+' NOT TESTED ('+nt.join(', ')+')');process.exitCode=bad?1:0;
