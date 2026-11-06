// pkgLIB test (W3 Wall 2426: the only test that counts is byte-identical node output before and after). Run from wall2024/: node pkgLIB/test_LIB.cjs
// 1. every stub rebuilds its node's source byte for byte (sha) from the Shared Library; 2. every one of the 22 nodes, run whole on each saved run's
// inputs (corpus/raw/nodes_<run>.json.gz), gives the same output (or the same error) as the full-source node; 3. timing before and after.
const fs=require('fs'),zlib=require('zlib'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const rd=f=>fs.readFileSync(f,'utf8');
const {rebuild}=require('./unpack.cjs');let ok=0,bad=0;const T=(n,c)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n);}};
const plan=JSON.parse(rd('pkgLIB/plan_LIB.json'));const B=plan.base+'/patched/';const LIB=rd('pkgLIB/patched/Shared_Library.js');
T('plan: 22 nodes, base shas match '+plan.base+'/patched, stub shas match pkgLIB/patched',plan.nodes.length===22&&plan.nodes.every(n=>sha(rd(B+n.file))===n.base_sha&&sha(rd('pkgLIB/patched/'+n.file))===n.stub_sha));
const bad1=plan.nodes.filter(n=>rebuild(rd('pkgLIB/patched/'+n.file),LIB)!==rd(B+n.file));
T('every stub rebuilds its full source byte for byte from the Shared Library (22 of 22)',!bad1.length);bad1.forEach(n=>console.log('     differs: '+n.file));
T('every stub and the Shared Library parse',['Shared_Library.js',...plan.nodes.map(n=>n.file)].every(f=>{try{new Function('$','$input','return (async()=>{'+rd('pkgLIB/patched/'+f)+'\n})()');return true;}catch(e){console.log('     '+f+': '+e.message);return false;}}));
T('the stubs read only $(\'Shared Library\') and the node\'s own $/$input (no other global)',plan.nodes.every(n=>{const s=rd('pkgLIB/patched/'+n.file);return !/\b(require|process|globalThis|eval)\b/.test(s.replace(/const __P=.*\n/,''));}));
// 2. whole-node runs
const runs=fs.readdirSync('corpus/raw').filter(f=>/^nodes_\d+\.json\.gz$/.test(f)).map(f=>f.slice(6,11)).sort();
const mock=N=>name=>{if(name==='Shared Library')return {params:{jsCode:LIB}};const r=N.nodes[name];if(!r)return {isExecuted:false,first:()=>{throw new Error('node not saved: '+name);},last:()=>{throw new Error('node not saved: '+name);},all:()=>{throw new Error('node not saved: '+name);},item:undefined};
 const it=r[r.length-1]||[];return {isExecuted:true,first:()=>({json:it[0]}),last:()=>({json:it[it.length-1]}),all:()=>it.map(j=>({json:j})),item:{json:it[0]}};};
const $input={first:()=>({json:{}}),last:()=>({json:{}}),all:()=>[],item:{json:{}}};const AF=Object.getPrototypeOf(async function(){}).constructor;
// the nodes stamp rows with the clock ("at"); the clock is frozen for both sides so the comparison sees only the code
{const RD=Date,FX=RD.parse('2026-11-06T16:00:00Z');global.Date=class extends RD{constructor(...a){a.length?super(...a):super(FX);}static now(){return FX;}};}
const go=async(src,$)=>{try{return 'OUT '+JSON.stringify(await new AF('$','$input',src)($,$input));}catch(e){return 'ERR '+String(e&&e.message||e);}};
(async()=>{let n=0,same=0,outs=0;const diff=[];const per={};
 for(const run of runs){const N=JSON.parse(zlib.gunzipSync(fs.readFileSync('corpus/raw/nodes_'+run+'.json.gz')));
  for(const nd of plan.nodes){const a=await go(rd(B+nd.file),mock(N)),b=await go(rd('pkgLIB/patched/'+nd.file),mock(N));n++;per[nd.name]=per[nd.name]||{out:0,err:0,why:new Set()};if(a.startsWith('OUT'))per[nd.name].out++;else{per[nd.name].err++;per[nd.name].why.add(a.slice(4,60));}if(a===b){same++;if(a.startsWith('OUT'))outs++;}else diff.push(run+' '+nd.name+'\n        full: '+a.slice(0,200)+'\n        stub: '+b.slice(0,200));}}
 console.log('   '+runs.length+' saved runs x 22 nodes = '+n+' node runs; identical '+same+' ('+outs+' produce output, '+(same-outs)+' stop at the same missing upstream node in both)');diff.forEach(d=>console.log('     '+d));
 Object.entries(per).forEach(([k,v])=>console.log('     '+k.padEnd(30)+' real output on '+v.out+' of '+runs.length+' runs'+(v.err?'; stops in both on: '+[...v.why].join(' | '):'')));
 T('every node run gives byte-identical output (or the identical error) full vs stub',same===n);
 T('the cure path nodes produce real output on the saved runs (not only errors)',outs>=runs.length*5);
 // 3. timing: one whole fixture (33040 Panel Cure Check), each side in a fresh process (no compile cache shared), 5 runs each
 const {execFileSync}=require('child_process');const tm=f=>{const r=[];for(let i=0;i<5;i++)r.push(+execFileSync('node',['-e',`const fs=require('fs'),zlib=require('zlib');const LIB=fs.readFileSync('pkgLIB/patched/Shared_Library.js','utf8');const N=JSON.parse(zlib.gunzipSync(fs.readFileSync('corpus/raw/nodes_33040.json.gz')));
  const $=name=>{if(name==='Shared Library')return {params:{jsCode:LIB}};const r=N.nodes[name]||[[]];const it=r[r.length-1]||[];return {isExecuted:!!N.nodes[name],first:()=>({json:it[0]}),last:()=>({json:it[it.length-1]}),all:()=>it.map(j=>({json:j})),item:{json:it[0]}};};
  const src=fs.readFileSync('${f}','utf8');const t0=process.hrtime.bigint();const AF=Object.getPrototypeOf(async function(){}).constructor;new AF('$','$input',src)($,{first:()=>({json:{}}),all:()=>[]}).then(()=>console.log(Number(process.hrtime.bigint()-t0)/1e6));`],{encoding:'utf8'}).trim());r.sort((a,b)=>a-b);return r[2];};
 const t1=tm(B+'Panel_Cure_Check.js'),t2=tm('pkgLIB/patched/Panel_Cure_Check.js');
 console.log('   timing, Panel Cure Check on 33040, median of 5 fresh processes: full source '+t1.toFixed(1)+' ms, stub '+t2.toFixed(1)+' ms ('+(t2-t1>=0?'+':'')+(t2-t1).toFixed(1)+' ms per node run)');
 console.log('   size: the 22 nodes hold '+plan.bytes_before+' bytes of code before, '+plan.bytes_after+' after (Shared Library '+plan.library.bytes+' included)');
 T('the stub adds under 50 ms per node run',t2-t1<50);
 console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);})();
