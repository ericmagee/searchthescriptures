// pkgSTB probe. Live s90 (stub form 2) against pkgSTB/parent_s90_STB.json (stub form 3).
// A. every library node rebuilds, through its own stub and its own Shared Library, to the same source text in live and in the candidate (the code that runs is the same, byte for byte).
// B. every library node is run whole (stub and all) on the saved inputs of the runs given, live against candidate: same output or same error.
// C. a stub whose entry is missing, or whose entry does not fit the library, stops with a named error and runs nothing.
// D. the gain: a library fix (pkgFUK rev 2, strip_FUK2) packed in form 3 changes the Shared Library only; in form 2 it changes 32 nodes.
process.chdir(require('path').resolve(__dirname,'..'));const fs=require('fs'),cp=require('child_process'),os=require('os'),path=require('path');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const LV=g('/mnt/project-files/wall2024/fetchback_live_s90.json'),PK=g(__dirname+'/parent_s90_STB.json');
const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;let ok=0,bad=0;const chk=(c,m)=>{if(c){ok++;console.log('OK   '+m);}else{bad++;console.log('FAIL '+m);}};
const LIBN=PK.nodes.filter(n=>typeof n.parameters.jsCode==='string'&&n.name!=='Shared Library'&&n.parameters.jsCode.includes("$('Shared Library')")).map(n=>n.name).sort();
const src=(W,n,lib)=>{const c=code(W,n);const i=c.indexOf('\nif(__S.length!==__N)');if(i<0)throw new Error('no length check in '+n);const j=c.indexOf('\n',i+1);
 return new Function('$',c.slice(0,j)+'\nreturn __S;')(x=>{if(x!=='Shared Library')throw new Error('read '+x);return {params:{jsCode:lib===undefined?code(W,'Shared Library'):lib}};});};
// A
{let eq=0,bytes=0;const diff=[];for(const n of LIBN){const a=src(LV,n),b=src(PK,n);if(a===b){eq++;bytes+=a.length;}else diff.push(n);}
 chk(LIBN.length===31&&eq===31,'A '+LIBN.length+' library nodes (30 stubs and Early Alternate Build): '+eq+' rebuild to the same source in live and candidate ('+bytes+' bytes of running code)'+(diff.length?'; differ: '+diff.join(', '):''));
 const other=PK.nodes.filter(n=>!LIBN.includes(n.name)&&n.name!=='Shared Library'&&JSON.stringify(n)!==JSON.stringify(LV.nodes.find(z=>z.name===n.name)));
 chk(other.length===0&&JSON.stringify(PK.connections)===JSON.stringify(LV.connections)&&PK.nodes.length===LV.nodes.length,'A no other node differs; connections equal; '+PK.nodes.length+' nodes');
 const t=n=>{const c=code(PK,n);const i=c.indexOf('\nif(__S.length!==__N)');return c.slice(c.indexOf('\n',i+1));};const tl=n=>{const c=code(LV,n);const i=c.indexOf('\nif(__S.length!==__N)');return c.slice(c.indexOf('\n',i+1));};
 chk(LIBN.every(n=>t(n)===tl(n)),'A the lines after the length check (the run line; the Early Alternate Build tail) are equal in live and candidate for all 31');}
// B
{const D='/mnt/project-files/wall2024/inputs/';const RUNS=(process.env.RUNS||'34108,34016').split(',');
 const feed=n=>Object.entries(PK.connections).filter(([k,v])=>(v.main||[]).some(a=>(a||[]).some(c=>c.node===n))).map(e=>e[0]);
 const mkrun=(W,RUN)=>{const cache={};const saved=n=>{if(n in cache)return cache[n];const f=D+RUN+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return cache[n]=null;const d=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(d)?d[0]:d;const m=(r.data&&r.data.main)||r.main;return cache[n]=(m&&m[0])||[];};
  const cl=x=>JSON.parse(JSON.stringify(x));const $=n=>{if(n==='Shared Library')return {params:{jsCode:code(W,'Shared Library')}};const it=saved(n);if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+n);};return {isExecuted:false,first:no,last:no,all:no,itemMatching:no,get item(){return no();},params:{}};}
   return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),itemMatching:i=>cl(it[i]),get item(){return cl(it[0]);},params:{}};};
  return async(n,inNode)=>{const inp=saved(inNode)||[];const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp),get item(){return cl(inp[0]);}};
   const RD=Date,FIX=new RD('2026-11-07T03:10:18.511Z').getTime();class FD extends RD{constructor(...a){a.length?super(...a):super(FIX);}static now(){return FIX;}}global.Date=FD;
   try{return JSON.stringify(await new Function('$','$input','$json','$execution','$workflow','return (async()=>{\n'+code(W,n)+'\n})();')($,$input,inp[0]&&inp[0].json,{id:RUN,customData:{set:()=>{},get:()=>undefined}},{id:'w'}));}catch(e){return 'THROW '+String(e&&e.message||e).slice(0,200);}finally{global.Date=RD;}};};
 (async()=>{for(const RUN of RUNS){const a=mkrun(LV,RUN),b=mkrun(PK,RUN);let eq=0,out=0,thr=0;const diff=[];
   for(const n of LIBN){const f=feed(n);const inNode=f.find(x=>fs.existsSync(D+RUN+'_'+x.replace(/ /g,'_')+'.json'))||f[0];const x=await a(n,inNode),y=await b(n,inNode);if(x===y){eq++;if(/^THROW/.test(x))thr++;else out++;}else diff.push(n+' ['+x.slice(0,80)+' | '+y.slice(0,80)+']');}
   chk(eq===LIBN.length&&out>0,'B run '+RUN+': '+eq+' of '+LIBN.length+' nodes give the same result in live and candidate ('+out+' with output, '+thr+' with the same error for a missing saved input)'+(diff.length?'; differ: '+diff.join('; '):''));}
  // C
  {const lib=code(PK,'Shared Library');const noent=lib.replace('"Gate Record":','"Gate Record gone":');let e1='';try{src(PK,'Gate Record',noent);}catch(e){e1=String(e.message);}chk(/holds no entry for Gate Record/.test(e1),'C entry missing: the stub stops ('+e1+')');
   const c=code(PK,'Gate Record');const i=lib.lastIndexOf('\n/*MAP*/')+8,j=lib.lastIndexOf('\n/*END*/');const M=JSON.parse(lib.slice(i,j));M['Gate Record'].p=M['Gate Record'].p.slice(1);const badlib=lib.slice(0,i)+JSON.stringify(M)+lib.slice(j);let e2='';
   try{await new Function('$','$input','return (async()=>{\n'+c+'\n})();')(x=>{if(x==='Shared Library')return {params:{jsCode:badlib}};throw new Error('RAN: read '+x);},{});}catch(e){e2=String(e.message);}chk(/rebuilt source is \d+ bytes, expected \d+/.test(e2),'C entry not fitting the library: the stub stops before running any code ('+e2.slice(0,70)+')');
   let e3='';try{src(PK,'Gate Record',code(LV,'Shared Library'));}catch(e){e3=String(e.message);}chk(!!e3,'C a form 3 stub on the form 2 library stops ('+e3.slice(0,60)+')');
   let e4='';try{src(LV,'Gate Record',lib);}catch(e){e4=String(e.message);}chk(!!e4,'C a form 2 stub on the form 3 library stops ('+e4.slice(0,60)+'): the write must carry all 32 nodes together');}
  // D
  if(fs.existsSync('pkgLIB/strip_FUK2')){const T=fs.mkdtempSync(path.join(os.tmpdir(),'stb_'));try{const pack=(v,X)=>{fs.mkdirSync(T+'/'+v+'/pkgLIB',{recursive:true});const r=cp.spawnSync(process.execPath,[process.cwd()+'/pkgLIB/pack.cjs',process.cwd()+'/pkgLIB/'+X],{cwd:T+'/'+v,env:{...process.env,STUBV:String(v),LIB_N:'30'},encoding:'utf8',maxBuffer:64<<20});if(r.status!==0)throw new Error(r.stderr);
     const o={};for(const f of fs.readdirSync(T+'/'+v+'/pkgLIB/patched'))o[f]=fs.readFileSync(T+'/'+v+'/pkgLIB/patched/'+f,'utf8');fs.rmSync(T+'/'+v,{recursive:true});return o;};
    const d=(a,b)=>Object.keys(a).filter(f=>a[f]!==b[f]);const a3=pack(3,'strip_STB'),b3=pack(3,'strip_FUK2'),a2=pack(2,'strip_STB'),b2=pack(2,'strip_FUK2');
    const d3=d(a3,b3),d2=d(a2,b2);chk(d3.length===1&&d3[0]==='Shared_Library.js','D pkgFUK rev 2 packed in form 3: files that change = '+d3.length+' ('+d3.join(', ')+')');chk(d2.length>20,'D the same fix packed in form 2 (today): files that change = '+d2.length);
    const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');chk(Object.keys(b3).filter(f=>f!=='Shared_Library.js').every(f=>rebuild(a3[f],b3['Shared_Library.js'])===fs.readFileSync('pkgLIB/strip_FUK2/patched/'+f,'utf8')),'D the unchanged form 3 stubs, on the new Shared Library, rebuild every pkgFUK rev 2 source byte for byte');}finally{fs.rmSync(T,{recursive:true,force:true});}}
  console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);})();}
