// pkgLIB test (W3 Wall 2426: the only test that counts is byte-identical node output before and after). Run from wall2024/: node pkgLIB/test_LIB.cjs
// 1. every stub rebuilds its node's source byte for byte (sha) from the Shared Library; 2. every one of the 22 nodes, run whole on each saved run's
// inputs (corpus/raw/nodes_<run>.json.gz), gives the same output (or the same error) as the full-source node; 3. timing before and after.// pkgLIB v2 (run 33094): every node run below goes through the task-runner model (runner_model.cjs): a node gets only the upstream data its own code TEXT names.
const fs=require('fs'),zlib=require('zlib'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const rd=f=>fs.readFileSync(f,'utf8');
const {rebuild}=require('./unpack.cjs');const RM=require('./runner_model.cjs');const NC=new Map();const need=src=>{if(!NC.has(src))NC.set(src,RM.needs(src));return NC.get(src);};let ok=0,bad=0;const T=(n,c)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n);}};
const plan=JSON.parse(rd('pkgLIB/plan_LIB.json'));const B=plan.base+'/patched/';const LIB=rd('pkgLIB/patched/Shared_Library.js');
T('plan: 22 nodes, base shas match '+plan.base+'/patched, stub shas match pkgLIB/patched',plan.nodes.length===22&&plan.nodes.every(n=>sha(rd(n.src))===n.base_sha&&sha(rd('pkgLIB/patched/'+n.file))===n.stub_sha));
const bad1=plan.nodes.filter(n=>rebuild(rd('pkgLIB/patched/'+n.file),LIB)!==rd(n.src));
T('every stub rebuilds its full source byte for byte from the Shared Library (22 of 22)',!bad1.length);bad1.forEach(n=>console.log('     differs: '+n.file));
T('every stub and the Shared Library parse',['Shared_Library.js',...plan.nodes.map(n=>n.file)].every(f=>{try{new Function('$','$input','return (async()=>{'+rd('pkgLIB/patched/'+f)+'\n})()');return true;}catch(e){console.log('     '+f+': '+e.message);return false;}}));
T('the stubs read only $(\'Shared Library\') and the node\'s own $/$input (no other global)',plan.nodes.every(n=>{const s=rd('pkgLIB/patched/'+n.file);return !/\b(require|process|globalThis|eval)\b/.test(s.replace(/const __P=.*\n/,''));}));
// 1b. pkgLIB v2: the stub's own text must name, in literal $() calls, every node its rebuilt source names (and carry a non-literal $() where the source has one)
{const miss=[];for(const n of plan.nodes){const full=need(rd(n.src)),stub=need(rd('pkgLIB/patched/'+n.file));if(!full.parsed||!stub.parsed)miss.push(n.file+': does not parse for the runner');
  for(const r of full.nodes)if(!stub.nodes.has(r))miss.push(n.file+': '+r);if(full.all&&!stub.all)miss.push(n.file+': non-literal $() missing');
  for(const k of ['env','execution','prevNode','input'])if(full[k]&&!stub[k])miss.push(n.file+': $'+k);}
 const tot=plan.nodes.reduce((a,n)=>a+need(rd(n.src)).nodes.size,0),dyn=plan.nodes.filter(n=>need(rd(n.src)).all).map(n=>n.name);
 console.log('   runner refs: '+tot+' literal node refs across the 22 full sources; non-literal $() in: '+dyn.join(', '));miss.forEach(x=>console.log('     missing '+x));
 T('every $(\'X\') in each rebuilt source is named literally in its stub; the dynamic nodes carry a non-literal $()',!miss.length);
 const RJ='/mnt/project-files/wall2024/pkgLIB_stub_refs.json';if(fs.existsSync(RJ)){const R=JSON.parse(rd(RJ));const off=plan.nodes.filter(n=>{const r=R[n.file],f=need(rd(n.src));return !r||JSON.stringify([...r.refs].sort())!==JSON.stringify([...f.nodes].sort())||(r.dyn>0)!==f.all;}).map(n=>n.file);
  T('runner model refs agree with the live-test thread\'s list (pkgLIB_stub_refs.json) on 22 of 22',!off.length);off.forEach(f=>console.log('     differs: '+f));}}
// 2. whole-node runs
const runs=fs.readdirSync('corpus/raw').filter(f=>/^nodes_\d+\.json\.gz$/.test(f)).map(f=>f.slice(6,11)).sort();
const mock=(N,lib=LIB)=>name=>{if(name==='Shared Library')return {params:{jsCode:lib}};const r=N.nodes[name];if(!r)return {isExecuted:false,first:()=>{throw new Error('node not saved: '+name);},last:()=>{throw new Error('node not saved: '+name);},all:()=>{throw new Error('node not saved: '+name);},item:undefined};
 const it=r[r.length-1]||[];return {isExecuted:true,first:()=>({json:it[0]}),last:()=>({json:it[it.length-1]}),all:()=>it.map(j=>({json:j})),item:{json:it[0]}};};
const $input={first:()=>({json:{}}),last:()=>({json:{}}),all:()=>[],item:{json:{}}};const AF=Object.getPrototypeOf(async function(){}).constructor;
// the nodes stamp rows with the clock ("at"); the clock is frozen for both sides so the comparison sees only the code
{const RD=Date,FX=RD.parse('2026-11-06T16:00:00Z');global.Date=class extends RD{constructor(...a){a.length?super(...a):super(FX);}static now(){return FX;}};}
const go=async(src,$)=>{try{return 'OUT '+JSON.stringify(await new AF('$','$input',src)(RM.gate(need(src),$),$input));}catch(e){return 'ERR '+String(e&&e.message||e);}};
(async()=>{let n=0,same=0,outs=0;const diff=[];const per={};
 for(const run of runs){const N=JSON.parse(zlib.gunzipSync(fs.readFileSync('corpus/raw/nodes_'+run+'.json.gz')));
  for(const nd of plan.nodes){const a=await go(rd(nd.src),mock(N)),b=await go(rd('pkgLIB/patched/'+nd.file),mock(N));n++;per[nd.name]=per[nd.name]||{out:0,err:0,why:new Set()};if(a.startsWith('OUT'))per[nd.name].out++;else{per[nd.name].err++;per[nd.name].why.add(a.slice(4,60));}if(a===b){same++;if(a.startsWith('OUT'))outs++;}else diff.push(run+' '+nd.name+'\n        full: '+a.slice(0,200)+'\n        stub: '+b.slice(0,200));}}
 console.log('   '+runs.length+' saved runs x 22 nodes = '+n+' node runs; identical '+same+' ('+outs+' produce output, '+(same-outs)+' stop at the same missing upstream node in both)');diff.forEach(d=>console.log('     '+d));
 Object.entries(per).forEach(([k,v])=>console.log('     '+k.padEnd(30)+' real output on '+v.out+' of '+runs.length+' runs'+(v.err?'; stops in both on: '+[...v.why].join(' | '):'')));
 T('every node run gives byte-identical output (or the identical error) full vs stub',same===n);
 T('the cure path nodes produce real output on the saved runs (not only errors)',outs>=runs.length*5);
 // 2b. run 33040 with every saved node output (pkgLIB/fixtures/nodes_33040_full.json.gz: the corpus nodes, /mnt/project-files/wall2024/inputs/33040_*.json,
 //     and Send Back Record), and $input served from the node's saved upstream node where one is saved
 {const N=JSON.parse(zlib.gunzipSync(fs.readFileSync('pkgLIB/fixtures/nodes_33040_full.json.gz')));const UP={'Gate Build':'Send Back Record','Alternate Merge':'Alt Gate Record','Panel Cure Build 2':'Panel Cure Normalize 1','Panel Cure Build 3':'Panel Cure Normalize 2','Panel Cure Check':'Panel Cure Normalize 3','Alternate Merge Seat':'Alternate Cure Normalize','Panel Cure Normalize 1':'Panel Cure Build 1','Panel Cure Normalize 2':'Panel Cure Build 2','Panel Cure Normalize 3':'Panel Cure Build 3','Alternate Cure Normalize':'Alternate Cure Build','Alternate Cure Build':'Alternate Payloads','Panel Payloads':'Panel Build','Gate Record':'Gate Build','Alt Gate Build':'Alt Send Back Record'};
  const inp=nm=>{const r=N.nodes[UP[nm]];const it=r?r[r.length-1]:[];return {first:()=>({json:it[0]||{}}),last:()=>({json:it[it.length-1]||{}}),all:()=>it.map(j=>({json:j})),item:{json:it[0]||{}}};};
  const go2=async(src,$,$i)=>{try{return 'OUT '+JSON.stringify(await new AF('$','$input',src)(RM.gate(need(src),$),$i));}catch(e){return 'ERR '+String(e&&e.message||e);}};
  // a node whose upstream is one of the 22 and was not saved is fed the full-source output of that upstream, run here first (Gate Build -> Gate Record, Alternate Merge Seat -> Alternate Merge)
  for(let pass=0;pass<2;pass++)for(const nd of plan.nodes){if(N.nodes[nd.name])continue;try{const o=await new AF('$','$input',rd(nd.src))(RM.gate(need(rd(nd.src)),mock(N)),inp(nd.name));if(Array.isArray(o)&&o.length)N.nodes[nd.name]=[o.map(i=>i.json)];}catch(e){}}
  let m=0,eq=0,ro=0;const rows=[];for(const nd of plan.nodes){const a=await go2(rd(nd.src),mock(N),inp(nd.name)),b=await go2(rd('pkgLIB/patched/'+nd.file),mock(N),inp(nd.name));m++;if(a===b)eq++;if(a.startsWith('OUT'))ro++;
   rows.push('     '+nd.name.padEnd(30)+' $input '+(UP[nd.name]&&N.nodes[UP[nd.name]]?UP[nd.name]:'(none saved)').padEnd(26)+(a===b?'SAME ':'DIFF ')+(a.startsWith('OUT')?'output '+a.length+' bytes':'stops: '+a.slice(4,90)));}
  console.log('   run 33040 with all saved node outputs: '+m+' nodes, '+eq+' identical, '+ro+' with real output');rows.forEach(r=>console.log(r));
  T('run 33040, all saved node outputs: every node identical full vs stub',eq===m);
  // 2c. the harness must see the 33094 fault: the f303dc7 stubs (pkgLIB v1, live in 33094) run the same 33040 inputs through the runner model
  {const {execSync}=require('child_process');const G=p=>execSync('git show f303dc7:prototypes/posture_e/wall2024/'+p,{encoding:'utf8',maxBuffer:1e8});const L1=G('pkgLIB/patched/Shared_Library.js');
   let d1=0;const hit=[];for(const nd of plan.nodes){const st=G('pkgLIB/patched/'+nd.file);const a=await go2(rd(nd.src),mock(N),inp(nd.name)),b=await go2(st,mock(N,L1),inp(nd.name));
    if(a!==b){d1++;hit.push(nd.name+': '+b.slice(4,80));}}
   console.log('   f303dc7 (v1) stubs on the same 33040 inputs: '+d1+' of 22 differ from the full source');hit.forEach(h=>console.log('     '+h));
   T('the harness catches the 33094 fault: v1 stubs differ, and Extract Independent Verdict fails as in 33094 ("Build Independent Verdict" not executed)',d1>0&&hit.some(h=>h.startsWith("Extract Independent Verdict: Node 'Build Independent Verdict' hasn't been executed")));}}
 // 3. timing: one whole fixture (33040 Panel Cure Check), each side in a fresh process (no compile cache shared), 5 runs each
 const {execFileSync}=require('child_process');const tm=f=>{const r=[];for(let i=0;i<5;i++)r.push(+execFileSync('node',['-e',`const fs=require('fs'),zlib=require('zlib');const LIB=fs.readFileSync('pkgLIB/patched/Shared_Library.js','utf8');const N=JSON.parse(zlib.gunzipSync(fs.readFileSync('corpus/raw/nodes_33040.json.gz')));
  const $=name=>{if(name==='Shared Library')return {params:{jsCode:LIB}};const r=N.nodes[name]||[[]];const it=r[r.length-1]||[];return {isExecuted:!!N.nodes[name],first:()=>({json:it[0]}),last:()=>({json:it[it.length-1]}),all:()=>it.map(j=>({json:j})),item:{json:it[0]}};};
  const src=fs.readFileSync('${f}','utf8');const t0=process.hrtime.bigint();const AF=Object.getPrototypeOf(async function(){}).constructor;new AF('$','$input',src)($,{first:()=>({json:{}}),all:()=>[]}).then(()=>console.log(Number(process.hrtime.bigint()-t0)/1e6));`],{encoding:'utf8'}).trim());r.sort((a,b)=>a-b);return r[2];};
 const t1=tm(plan.nodes.find(n=>n.file==='Panel_Cure_Check.js').src),t2=tm('pkgLIB/patched/Panel_Cure_Check.js');
 console.log('   timing, Panel Cure Check on 33040, median of 5 fresh processes: full source '+t1.toFixed(1)+' ms, stub '+t2.toFixed(1)+' ms ('+(t2-t1>=0?'+':'')+(t2-t1).toFixed(1)+' ms per node run)');
 console.log('   size: the 22 nodes hold '+plan.bytes_before+' bytes of code before, '+plan.bytes_after+' after (Shared Library '+plan.library.bytes+' included)');
 T('the stub adds under 50 ms per node run',t2-t1<50);
 console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);})();
