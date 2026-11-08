// pkgKWF test (W3). Run from wall2024/: node pkgKWF/test_KWF.cjs
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const FB='/mnt/project-files/wall2024/fetchback_live_s60.json';const ns=(j=>j.nodes||j)(JSON.parse(fs.readFileSync(FB,'utf8')));
let ok=0,bad=0;const T=(c,m)=>{console.log((c?'OK ':'FAIL ')+m);c?ok++:bad++;};
const OLD_HEAD='I answer in one of three forms: STANDS WITHOUT IT because <layer>; CONCEDED; or REASSERTED IN <round> ';
const NEW_HEAD='I answer in one of four forms: STANDS WITHOUT IT because <layer>; CONCEDED; REASSERTED IN <round> ';
const TAIL='when a later round rests on what was withdrawn.';
const NEW_TAIL="when a later round rests on what was withdrawn; or NOT HELD -- <why the sentence gives up no footing this link needs>, quoting the flagged sentence, at least six words in a row.";
const plan=JSON.parse(fs.readFileSync('pkgKWF/plan_KWF.json','utf8')).nodes;
const baseOf=n=>n==='Enforcer Build'?fs.readFileSync('pkgEKL/patched/Enforcer_Build.js','utf8'):n==='Alt Judge Enforcer Build'?fs.readFileSync('pkgEKL/patched/Alt_Judge_Enforcer_Build.js','utf8'):n==='Shared Library'?fs.readFileSync('pkgLIB_v19_GDA/patched/Shared_Library.js','utf8'):ns.find(x=>x.name===n).parameters.jsCode;
for(const [f,p] of Object.entries(plan)){const a=baseOf(p.node),b=fs.readFileSync('pkgKWF/patched/'+f,'utf8');
 T(b.replace(NEW_HEAD,OLD_HEAD).replace(NEW_TAIL,TAIL)===a,p.node+': only the K-W sentence changes');
 T(b.split(NEW_HEAD).length===2&&!b.includes('one of three forms: STANDS WITHOUT IT'),p.node+': new sentence once, old sentence gone');
 if(p.node!=='Shared Library'){let e=null;try{new Function('$','$input',b);}catch(x){e=x.message;}T(!e,p.node+': parses'+(e?' ('+e+')':''));}}
// every live node that carried the old sentence is in the plan
const carriers=ns.filter(n=>((n.parameters||{}).jsCode||'').includes(OLD_HEAD)).map(n=>n.name).sort();
T(carriers.every(c=>Object.values(plan).some(p=>p.node===c)),'all '+carriers.length+' live carriers are patched');
// render: Panel Build on saved runs (async node: run with an AsyncFunction over the same saved inputs)
(async()=>{const AF=Object.getPrototypeOf(async function(){}).constructor;const RUNS=fs.readdirSync(D).filter(f=>/^\d+_Panel_Build\.json$/.test(f)).map(f=>f.split('_')[0]).sort();
 const fe=feeder(FB,'Panel Build');let n=0,same=0,errs=0;const esc=s=>JSON.stringify(s).slice(1,-1);
 for(const RUN of RUNS){const i=fe.find(x=>fs.existsSync(D+RUN+'_'+x.replace(/ /g,'_')+'.json'));if(!i)continue;
  const rd=nm=>{const f=D+RUN+'_'+nm.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return null;const d=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(d)?d[0]:d;return ((r.data&&r.data.main)||r.main)[0]||[];};
  const mk=nm=>{const it=rd(nm);if(it===null){const no=()=>{throw new Error('unexecuted '+nm)};return {isExecuted:false,first:no,last:no,all:no,params:{}};}const cl=x=>JSON.parse(JSON.stringify(x));return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),get item(){return cl(it[0]);},params:{}};};
  const inp=rd(i)||[];const $input={first:()=>inp[0],last:()=>inp[inp.length-1],all:()=>inp,get item(){return inp[0];}};
  const go=async c=>{const RD=Date,FIX=new RD('2026-11-07T03:10:18.511Z').getTime();class FD extends RD{constructor(...a){a.length?super(...a):super(FIX);}static now(){return FIX;}}global.Date=FD;const mr=Math.random;Math.random=()=>0.5;try{return JSON.stringify(await new AF('$','$input','$json','$execution','$workflow',c)(mk,$input,inp[0]&&inp[0].json,{id:RUN,customData:{set:()=>{},get:()=>undefined}},{id:'w'}));}finally{global.Date=RD;Math.random=mr;}};
  let a,b;try{a=await go(baseOf('Panel Build'));b=await go(fs.readFileSync('pkgKWF/patched/Panel_Build.js','utf8'));}catch(x){errs++;continue;}
  n++;if(b.split(esc(NEW_HEAD)).join(esc(OLD_HEAD)).split(esc(NEW_TAIL)).join(esc(TAIL))===a&&b.includes(esc(NEW_TAIL)))same++;}
 T(n>0&&same===n,'Panel Build replay: '+same+' of '+n+' saved runs render the new sentence and differ only by it ('+errs+' runs could not run)');
 console.log('TOTAL '+ok+' OK, '+bad+' FAIL');})();
