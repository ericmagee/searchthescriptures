// W2 grade tool for pkgR1 (R1: the 12 three-copy nodes moved into the Shared Library). Written before the build, independent of W1's pack check.
// Usage (from wall2024/): BASE=<live s105 fetch-back> WF=<R1 write file> [RUNS=all|N] node pkgR1/w2_grade/w2_r1.cjs
// G1 structure: only the Shared Library and the 12 nodes differ; names, ids, types, positions, credentials, other params, connections, settings equal.
// G2 rebuild: every stub in WF rebuilds (pkgLIB/unpack.cjs) to its base source byte for byte (base stubs rebuilt from the base library).
// G3 the existing library stubs are byte-equal to the base stubs.
// G4 runner model: each new stub names every literal $() node its source names; no source reads $execution/$env/$prevNode; $-globals other than $ and $input listed.
// G5 behavior: each of the 12 nodes, base source vs WF stub, on every saved run with its input (R2 Alt nodes fed the Alt run data by name map); outputs byte-equal or same error.
// G6 size: node text before and after. G7 stub rebuild time.
const fs=require('fs'),path=require('path');const W=path.resolve(__dirname,'../..');
const {rebuild}=require(W+'/pkgLIB/unpack.cjs');const RM=require(W+'/pkgLIB/runner_model.cjs');
const acorn=require(W+'/pkgLIB/vendor/acorn.cjs');const walk=require(W+'/pkgLIB/vendor/walk.cjs');
const ld=f=>{const d=JSON.parse(fs.readFileSync(f,'utf8'));let w=d.data||d;return w.workflow||w;};
const B=ld(process.env.BASE||'/mnt/project-files/wall2024/fetchback_live_s106.json'),C=ld(process.env.WF);
const N12=['Send Back Record','Alt Send Back Record','R2 Alt Send Back Record','Send Back Build','Alt Send Back Build','R2 Alt Send Back Build','Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build','Judge Enforcer Record','Alt Judge Enforcer Record','R2 Alt Judge Enforcer Record'];
const SL='Shared Library';const isStub=s=>typeof s==='string'&&s.includes('\nreturn await new Function(');
const bn=n=>B.nodes.find(x=>x.name===n),cn=n=>C.nodes.find(x=>x.name===n);const out=[];const say=s=>{out.push(s);console.log(s);};let fail=0;const F=s=>{fail++;say('  FAIL '+s);};
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
// G1
say('G1 structure');if(B.nodes.length!==C.nodes.length)F('node count '+B.nodes.length+' -> '+C.nodes.length);
const changed=[];for(const b of B.nodes){const c=cn(b.name);if(!c){F('missing '+b.name);continue;}
 for(const k of new Set([...Object.keys(b),...Object.keys(c)]))if(k!=='parameters'&&!eq(b[k],c[k]))F(b.name+' field '+k+' differs');
 const bp={...b.parameters},cp={...c.parameters};const jc=bp.jsCode!==cp.jsCode;delete bp.jsCode;delete cp.jsCode;if(!eq(bp,cp))F(b.name+' parameters other than jsCode differ');if(jc)changed.push(b.name);}
for(const c of C.nodes)if(!bn(c.name))F('new node '+c.name);
if(!eq(B.connections,C.connections))F('connections differ');if(!eq(B.settings,C.settings))F('settings differ');
const want=[SL,...N12].sort();if(!eq(changed.slice().sort(),want))F('changed nodes: '+changed.join(', '));say('  changed '+changed.length+' nodes (want 13)');
// G2/G3
say('G2/G3 rebuild');const bL=bn(SL).parameters.jsCode,cL=cn(SL).parameters.jsCode;const src=n=>{const s=bn(n).parameters.jsCode;return isStub(s)?rebuild(s,bL):s;};
let ns=0,old=0;const T=[];for(const c of C.nodes){const s=c.parameters&&c.parameters.jsCode;if(!isStub(s))continue;ns++;
 const t0=process.hrtime.bigint();let r;try{r=rebuild(s,cL);}catch(e){F(c.name+' rebuild error '+e.message);continue;}T.push(Number(process.hrtime.bigint()-t0)/1e6);
 if(r!==src(c.name))F(c.name+' rebuilt source differs from base');
 if(!N12.includes(c.name)){old++;if(s!==bn(c.name).parameters.jsCode)F(c.name+' existing stub not byte-equal to base');}}
for(const n of N12)if(!isStub(cn(n).parameters.jsCode))F(n+' is not a stub');say('  stubs '+ns+' (existing '+old+', new '+(ns-old)+')');
// G4
say('G4 runner model');const glob=code=>{const g=new Set();try{walk.full(acorn.parse('async function V(){'+code+'}',{ecmaVersion:2025,sourceType:'module'}),n=>{if(n.type==='Identifier'&&/^\$/.test(n.name))g.add(n.name);});}catch(e){g.add('PARSE:'+e.message);}return [...g].sort();};
for(const n of N12){const s=src(n),st=cn(n).parameters.jsCode;const a=RM.needs(s),b=RM.needs(st);
 const miss=[...a.nodes].filter(x=>!b.nodes.has(x));if(miss.length&&!b.all)F(n+' stub does not name '+miss.join(', '));if(a.all&&!b.all)F(n+' source has non-literal $(), stub does not');
 if(a.execution||a.env||a.prevNode)F(n+' source reads $execution/$env/$prevNode');const g=glob(s).filter(x=>x!=='$'&&x!=='$input');
 say('  '+n+': source names '+a.nodes.size+' nodes'+(a.all?' (all)':'')+', stub names '+b.nodes.size+(g.length?', other $ identifiers: '+g.join(' '):''));if(g.length)F(n+' uses '+g.join(' ')+' which the stub does not pass');}
// G5
say('G5 behavior on saved runs');const D='/mnt/project-files/wall2024/inputs/';const runs=[...new Set(fs.readdirSync(D).map(f=>f.split('_')[0]))].filter(r=>/^\d+$/.test(r)).sort();
const feeder=n=>Object.entries(B.connections).filter(([k,v])=>JSON.stringify(v).includes('"node":"'+n+'"')).map(([k])=>k);
const cl=x=>x===undefined?x:JSON.parse(JSON.stringify(x));
function H(run,code,gateSt,libText){const cache={};const saved=n=>{if(n in cache)return cache[n];let f=D+run+'_'+n.replace(/ /g,'_')+'.json';
  if(!fs.existsSync(f)&&/^R2 /.test(n))f=D+run+'_'+n.slice(3).replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return cache[n]=null;const d=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(d)?d[0]:d;const m=(r.data&&r.data.main)||r.main;return cache[n]=(m&&m[0])||[];};
 const mk=n=>{if(n===SL)return {isExecuted:true,params:{jsCode:libText},first:()=>({json:{}}),all:()=>[{json:{}}],last:()=>({json:{}})};const it=saved(n);if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+n);};return {isExecuted:false,first:no,last:no,all:no,get item(){return no();},params:{}};}
  return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),get item(){return cl(it[0]);},params:{}};};
 const $=RM.gate(gateSt,mk);return inputNode=>{const inp=saved(inputNode)||[];const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp),get item(){return cl(inp[0]);}};
  const RD=Date,FIX=new RD('2026-11-07T03:10:18.511Z').getTime();class FD extends RD{constructor(...a){a.length?super(...a):super(FIX);}static now(){return FIX;}}global.Date=FD;const MR=Math.random;let seed=1;Math.random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  return Promise.resolve().then(()=>new Function('$','$input','return (async()=>{\n'+code+'\n})();')($,$input)).then(v=>({ok:JSON.stringify(v)}),e=>({err:String(e&&e.message)})).finally(()=>{global.Date=RD;Math.random=MR;});};}
(async()=>{let tot=0,same=0,errs=0;for(const n of N12){const s=src(n),st=cn(n).parameters.jsCode;const fd=feeder(n);const probe=/^R2 /.test(n)?n.slice(3):n;
  let k=0,d=0,e=0,nr=0,sk=0;const em={};for(const run of runs){if(!fs.existsSync(D+run+'_'+probe.replace(/ /g,'_')+'.json'))continue;if(process.env.RUNS&&process.env.RUNS!=='all'&&nr>=+process.env.RUNS)break;nr++;
   const fds=fd.filter(f=>fs.existsSync(D+run+'_'+(/^R2 /.test(f)?f.slice(3):f).replace(/ /g,'_')+'.json'));
   if(!fds.length){sk++;nr--;continue;}for(const f of fds){const a=await H(run,s,RM.needs(s),bL)(f);const b=await H(run,st,RM.needs(st),cL)(f);k++;tot++;if(a.err){e++;em[a.err.slice(0,80)]=(em[a.err.slice(0,80)]||0)+1;}
   if(eq(a,b))same++;else{d++;F(n+' run '+run+' input '+f+' differs: '+(a.err||'ok')+' / '+(b.err||'ok'));}}}
  say('  '+n+' (inputs '+fd.join(', ')+'): '+nr+' runs, '+k+' node runs, '+d+' differ, '+e+' base errors, '+sk+' runs skipped (no saved input)'+(e?' '+JSON.stringify(em):''));}
 say('  total '+tot+' node runs, '+same+' equal');
 // G6/G7
 const sz=w=>w.nodes.reduce((a,n)=>a+JSON.stringify(n.parameters||{}).length,0),js=w=>w.nodes.reduce((a,n)=>a+((n.parameters&&n.parameters.jsCode)||'').length,0);
 say('G6 size: node parameters '+sz(B)+' -> '+sz(C)+' ('+(sz(C)-sz(B))+'); jsCode '+js(B)+' -> '+js(C)+' ('+(js(C)-js(B))+'); Shared Library '+bL.length+' -> '+cL.length);
 T.sort((a,b)=>a-b);say('G7 stub rebuild ms: median '+T[T.length>>1].toFixed(2)+', max '+T[T.length-1].toFixed(2));
 say(fail?'RESULT FAIL ('+fail+')':'RESULT PASS');if(process.env.OUT)fs.writeFileSync(process.env.OUT,out.join('\n')+'\n');})();
