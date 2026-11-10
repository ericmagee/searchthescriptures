// Dry regrade check R1.1/R1.2 (dryregrade_34108_R1_CSS_checklist_W1.md). Usage: node pkgR1/dr_R1.cjs <execution.json> [s106 fetch-back]
// For each of the 12 R1 nodes that ran: rerun its s106 full source on the execution's own node data; compare with the output the live stub recorded.
const fs=require('fs');const RM=require('../pkgLIB/runner_model.cjs');
const X=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const rd=(X.data||X).resultData.runData;
let w=JSON.parse(fs.readFileSync(process.argv[3]||'/mnt/project-files/wall2024/fetchback_live_s106.json','utf8'));w=w.data||w;w=w.workflow||w;const by={};w.nodes.forEach(n=>by[n.name]=n);
const R1='Send Back Record|Alt Send Back Record|R2 Alt Send Back Record|Send Back Build|Alt Send Back Build|R2 Alt Send Back Build|Judge Enforcer Build|Alt Judge Enforcer Build|R2 Alt Judge Enforcer Build|Judge Enforcer Record|Alt Judge Enforcer Record|R2 Alt Judge Enforcer Record'.split('|');
const out=n=>rd[n]?(rd[n][rd[n].length-1].data||{}).main:null;const err=n=>rd[n]&&rd[n][rd[n].length-1].error;
const cl=x=>JSON.parse(JSON.stringify(x));const AF=Object.getPrototypeOf(async function(){}).constructor;
const mk=name=>{const m=out(name);const it=m?m[0]||[]:null;if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+name);};return {isExecuted:false,first:no,last:no,all:no,get item(){return no();},params:{}};}
 return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),get item(){return cl(it[0]);},params:{}};};
const st=n=>{const s=rd[n][rd[n].length-1].startTime;return s;};
{const RD=Date;}
const feeder=n=>{const src=(rd[n][rd[n].length-1].source||[])[0];return src&&src.previousNode;};
(async()=>{let ok=0,bad=0,nr=[];
 for(const n of R1){if(!rd[n]){nr.push(n);continue;}if(err(n)){bad++;console.log('FAIL R1.1 '+n+': node error '+JSON.stringify(err(n)).slice(0,200));continue;}
  const RD=Date,FX=st(n);global.Date=class extends RD{constructor(...a){a.length?super(...a):super(FX);}static now(){return FX;}};
  const fd=feeder(n);const inp=fd&&out(fd)?out(fd)[0]||[]:[];const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp),get item(){return cl(inp[0]);}};
  let a;try{a=JSON.stringify((await new AF('$','$input','$json','$execution',by[n].parameters.jsCode)(RM.gate(RM.needs(by[n].parameters.jsCode),mk),$input,inp[0]&&inp[0].json,{id:String(X.id||'')})).map(x=>x.json));}catch(e){a='ERR '+e.message;}
  global.Date=RD;let b=JSON.stringify((out(n)[0]||[]).map(x=>x.json));
  const nt=s=>s.replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z/g,"T");a=nt(a);const b0=b;b=nt(b);
  if(a===b){ok++;console.log('OK   R1.2 '+n+': s106 full source output equal to the live stub output, run-time stamps aside ('+b.length+' chars)');}
  else{bad++;let i=0;while(a[i]===b[i])i++;console.log('DIFF R1.2 '+n+' at char '+i+': full "'+a.slice(Math.max(0,i-80),i+80)+'" | stub "'+b.slice(Math.max(0,i-80),i+80)+'"');}}
 console.log('R1.3 not reached: '+(nr.join(', ')||'none'));console.log(ok+' OK, '+bad+' FAIL/DIFF');})();
