// pkgR1 tests L3, L4, L4b, L7 (labels pkgR1/labels_R1.md). Run from wall2024/: node pkgR1/test_R1.cjs [fetch-back]
// L4: each R1 node runs twice on every saved run holding its output: (a) its live s105 full source, (b) its new stub reading the new Shared Library.
//     Both go through the runner model (a node gets only the nodes its code TEXT names). Outputs must be byte-equal (or the same error).
// L4b: the R2 Alt nodes have no saved run; they run on the Alt nodes' saved data with node names mapped "R2 Alt"->"Alt", "R2 Alternate"->"Alternate".
const fs=require('fs');const RM=require('../pkgLIB/runner_model.cjs');const D='/mnt/project-files/wall2024/inputs/';
const FB=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s105.json';let w=JSON.parse(fs.readFileSync(FB,'utf8'));w=w.data||w;w=w.workflow||w;
const W=JSON.parse(fs.readFileSync('pkgR1/parent_s105_R1.json','utf8'));const by={},nb={};w.nodes.forEach(n=>by[n.name]=n);W.nodes.forEach(n=>nb[n.name]=n);
const LIB=nb['Shared Library'].parameters.jsCode;let ok=0,bad=0;const T=(c,m)=>{if(c){ok++;console.log('OK   '+m);}else{bad++;console.log('FAIL '+m);}};
const R1='Send Back Record|Alt Send Back Record|R2 Alt Send Back Record|Send Back Build|Alt Send Back Build|R2 Alt Send Back Build|Judge Enforcer Build|Alt Judge Enforcer Build|R2 Alt Judge Enforcer Build|Judge Enforcer Record|Alt Judge Enforcer Record|R2 Alt Judge Enforcer Record'.split('|');
// L3 runner refs
{const miss=[];for(const n of R1){const f=RM.needs(by[n].parameters.jsCode),s=RM.needs(nb[n].parameters.jsCode);if(!f.parsed||!s.parsed)miss.push(n+': parse');
  for(const r of f.nodes)if(!s.nodes.has(r))miss.push(n+': '+r);if(f.all&&!s.all)miss.push(n+': non-literal $()');for(const k of ['env','execution','prevNode'])if(f[k])miss.push(n+': reads $'+k);if(f.input&&!s.input)miss.push(n+': $input');}
 T(!miss.length,'L3 each new stub names every node its source names; none reads $execution, $env or $prevNode'+(miss.length?': '+miss.join('; '):''));}
const feeder=n=>Object.entries(w.connections).filter(([k,v])=>(v.main||[]).some(o=>(o||[]).some(c=>c.node===n))).map(([k])=>k);
const cache=new Map();const saved=(run,n)=>{const k=run+'|'+n;if(cache.has(k))return cache.get(k);const f=D+run+'_'+n.replace(/ /g,'_')+'.json';let v=null;
 if(fs.existsSync(f)){const d=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(d)?d[0]:d;if(r){const m=(r.data&&r.data.main)||r.main;v=(m&&m[0])||[];}}cache.set(k,v);return v;};
const cl=x=>JSON.parse(JSON.stringify(x));
const mk=(run,map)=>name=>{if(name==='Shared Library')return {isExecuted:true,params:{jsCode:LIB}};const it=saved(run,map(name));
 if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+name);};return {isExecuted:false,first:no,last:no,all:no,get item(){return no();},params:{}};}
 return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),get item(){return cl(it[0]);},params:{}};};
const AF=Object.getPrototypeOf(async function(){}).constructor;
{const RD=Date,FX=RD.parse('2026-11-10T14:00:00Z');global.Date=class extends RD{constructor(...a){a.length?super(...a):super(FX);}static now(){return FX;}};}
const go=async(code,run,inputNode,map)=>{const inp=inputNode?(saved(run,map(inputNode))||[]):[];const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp),get item(){return cl(inp[0]);}};
 let rs=0x2F6E2B1;const MR=Math.random;Math.random=()=>{rs=(rs*1103515245+12345)&0x7fffffff;return rs/0x7fffffff;};
 try{const $=RM.gate(RM.needs(code),mk(run,map));return 'OUT '+JSON.stringify(await new AF('$','$input','$json','$execution',code)($,$input,inp[0]&&inp[0].json,{id:run}));}catch(e){return 'ERR '+String(e&&e.message||e);}finally{Math.random=MR;}};
const runs=fs.readdirSync(D).filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]).sort();
(async()=>{const tm={full:0,stub:0,n:0};
 for(const n of R1){const r2=n.startsWith('R2 ');const src=r2?n.replace(/^R2 /,''):n;const map=r2?(x=>x.replace(/^R2 Alt/,'Alt').replace(/^R2 Alternate/,'Alternate')):(x=>x);
  const fd=feeder(n);const inputNode=fd[0];let eq=0,diff=[],errs=0,cnt=0;
  for(const run of runs){if(saved(run,src)===null)continue;cnt++;let t0=process.hrtime.bigint();const a=await go(by[n].parameters.jsCode,run,inputNode,map);let t1=process.hrtime.bigint();
   const b=await go(nb[n].parameters.jsCode,run,inputNode,map);let t2=process.hrtime.bigint();tm.full+=Number(t1-t0)/1e6;tm.stub+=Number(t2-t1)/1e6;tm.n++;
   if(a===b){eq++;if(a.startsWith('ERR'))errs++;}else diff.push(run+' ('+a.slice(0,60)+' | '+b.slice(0,60)+')');}
  T(cnt>0&&!diff.length,(r2?'L4b ':'L4  ')+n+' (input '+inputNode+(fd.length>1?' +'+(fd.length-1):'')+'): '+eq+' of '+cnt+' runs byte-equal'+(errs?' ('+errs+' same error)':'')+(diff.length?'; differ: '+diff.join('; '):''));}
 const per=(tm.stub-tm.full)/tm.n;T(per<50,'L7 stub run time: full source '+(tm.full/tm.n).toFixed(1)+' ms, stub '+(tm.stub/tm.n).toFixed(1)+' ms per node run (mean of '+tm.n+'); stub adds '+per.toFixed(1)+' ms');
 console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);})();
