// pkgLIB comment strip + repack on live s45: each of the 22 nodes, original live source (pkgLIB/base_s45) vs the packed stub, run on every recent saved run
// (/mnt/project-files/wall2024/inputs, pkgGSL harness, the node's live feeder as $input). Output must be byte-identical (or the identical error).
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const rd=f=>fs.readFileSync(f,'utf8');
const F='/mnt/project-files/wall2024/fetchback_live_s45.json';const plan=JSON.parse(rd('pkgLIB/plan_LIB.json'));const LIB=rd('pkgLIB/patched/Shared_Library.js');
const runs=[...new Set(fs.readdirSync(D).filter(f=>/^33[2-9]\d\d_Panel_Cure_Check\.json$/.test(f)).map(f=>f.slice(0,5)))].sort();
let n=0,same=0,outs=0;const diff=[];const t0={a:0,b:0};
for(const R of runs)for(const nd of plan.nodes){const IN=feeder(F,nd.name)[0];const a0=rd((process.env.ORIG||'pkgLIB/base_s45/patched')+'/'+nd.file);
 const stub='const __LIBTXT='+JSON.stringify(LIB)+';\n'+rd('pkgLIB/patched/'+nd.file).split("$('Shared Library').params.jsCode").join('__LIBTXT');
 const run=src=>{const t=Date.now();let r;try{r=harness(R)('return (async()=>{'+src+'\n})()',IN);r=Promise.resolve(r);}catch(e){r=Promise.resolve('ERR '+String(e&&e.message||e));}return r;};
 n++;const ta=Date.now();let a,b;
 a=run(a0);b=run(stub);diff.push([R,nd.name,a,b]);}
(async()=>{for(const [R,name,pa,pb] of diff){let a,b;try{a=await pa;a=typeof a==='string'?a:'OUT '+JSON.stringify(a);}catch(e){a='ERR '+String(e&&e.message||e);}try{b=await pb;b=typeof b==='string'?b:'OUT '+JSON.stringify(b);}catch(e){b='ERR '+String(e&&e.message||e);}
  if(a===b){same++;if(a.startsWith('OUT'))outs++;}else console.log('DIFF '+R+' '+name+'\n  a '+a.slice(0,160)+'\n  b '+b.slice(0,160));}
 console.log(runs.length+' recent runs ('+runs.join(' ')+') x 22 nodes = '+n+' node runs; identical '+same+' ('+outs+' with real output)');console.log(same===n?'OK':'FAIL');})();
