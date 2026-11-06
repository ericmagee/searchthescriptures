// pkgPTA test: for each of the 26 nodes, base and patched run on the same stand-in data in 4 scenarios (generic data, nothing executed,
// and the saved node data of runs 33107 and 33160 laid over the generic data); the output (or the error) must be byte-identical and the
// nodes asked for the same, in the same order; every node the base asks for must be in the patched table.
// Run from wall2024/ after build_PTA.cjs: node pkgPTA/test_PTA.cjs
const fs=require('fs');const z=require('zlib');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const rd=f=>fs.readFileSync(f,'utf8');
const {COMPN}=require('../pkgPTK/scan.cjs');
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(rd('pkgPTA/plan_PTA.json'));const W=JSON.parse(rd('pkgPTA/out/workflow_PTA.json'));
T(plan.nodes.length+' nodes; base and final shas match the files',plan.nodes.length===26&&plan.nodes.every(p=>{const f=p.node.replace(/ /g,'_')+'.js';return sha(rd('pkgPTA/base/'+f))===p.base_sha&&sha(rd('pkgPTA/patched/'+f))===p.final_sha;}));
T('no code node in the output workflow has a computed $() call',W.nodes.every(n=>typeof (n.parameters||{}).jsCode!=='string'||!COMPN(n.parameters.jsCode).length));
const am=plan.nodes.find(p=>p.node==='Alternate Merge');T('Alternate Merge is based on pkgSLA\'s final (49b19797)',am&&am.base_sha==='49b19797c2a4fe82');
const real={};for(const r of ['33107','33160']){const d=JSON.parse(z.gunzipSync(fs.readFileSync('corpus/raw/nodes_'+r+'.json.gz'))).nodes;const g=JSON.parse(rd('corpus/raw/gate_'+r+'.json'));real[r]={...d,...g};}
const gen=(n,i)=>({run_token:'t',seat:'gemini',usage:{prompt_tokens:i,completion_tokens:i},choices:[{message:{content:'x'+i},finish_reason:'stop'}],content:[{type:'text',text:'y'+i}],id:'msg_'+i,raw:'r'+i,labelled:'l'+i,body:{messages:[{role:'user',content:'u'}]},call:{fam:'openai',fam_idx:1,model:'m',body:{messages:[{role:'user',content:'u'}]}}});
const runWith=(code,sc)=>{const asked=[];const seen={};let k=0;const $=n=>{asked.push(n);
  if(sc==='none')return {isExecuted:false,first:()=>{throw new Error("Node '"+n+"' hasn't been executed");},all:()=>{throw new Error("Node '"+n+"' hasn't been executed");}};
  const R=real[sc];if(R&&R[n]){const it=(R[n].slice(-1)[0]||[]);const arr=Array.isArray(it)?it:Object.values(it);return {isExecuted:true,first:()=>({json:arr[0]}),all:()=>arr.map(j=>({json:j})),last:()=>({json:arr[arr.length-1]})};}
  if(!(n in seen))seen[n]=++k;const j=gen(n,seen[n]);return {isExecuted:true,first:()=>({json:j}),all:()=>[{json:j}],last:()=>({json:j})};};
 const ex={id:'e1',customData:{set(){},get(){}}};let out,err=null;
 try{out=new Function('$','$input','$json','$execution','$workflow','Date',code)($,{first:()=>({json:{}}),all:()=>[],item:{json:{}}},{},ex,{id:'w'},FD);}catch(e){err=String(e&&e.message||e);}
 return {out:out===undefined?'undefined':JSON.stringify(out),err,asked};};
/* the clock is fixed, so a node that stamps the time gives the same bytes on both runs */
const FD=class extends Date{constructor(...a){a.length?super(...a):super(Date.UTC(2026,10,6,23,0,0));}static now(){return Date.UTC(2026,10,6,23,0,0);}};
{const C=W.connections;const n=W.nodes.find(x=>x.name==='Write Enforcer Log');
 T('B1: Write Enforcer Log success -> Derive Outcome; error -> Panel Failure Note (no outcome derived without the log); 5 tries 5 s apart',C['Write Enforcer Log'].main[0][0].node==='Derive Outcome'&&C['Write Enforcer Log'].main[1].length===1&&C['Write Enforcer Log'].main[1][0].node==='Panel Failure Note'&&n.maxTries===5&&n.waitBetweenTries===5000&&n.onError==='continueErrorOutput');
 const pf=W.nodes.find(x=>x.name==='Panel Failure Note').parameters.jsCode;const o=new Function('$input','$prevNode','$execution',pf)({first:()=>({json:{error:{message:'canceling statement due to statement timeout'}}})},{name:'Write Enforcer Log'},{customData:{set(){}}})[0].json;
 T('B1: Panel Failure Note reads the log failure: panel_failed, failed_node Write Enforcer Log, the error text',o.panel_failed===true&&o.failed_node==='Write Enforcer Log'&&/statement timeout/.test(o.failed_msg));}
const rows=[];
for(const p of plan.nodes){const f=p.node.replace(/ /g,'_')+'.js';const b=rd('pkgPTA/base/'+f),q=rd('pkgPTA/patched/'+f);let same=true,cover=true,depth=[],why='';
 for(const sc of ['generic','none','33107','33160']){const x=runWith(b,sc),y=runWith(q,sc);
  if(x.out!==y.out||x.err!==y.err||JSON.stringify(x.asked)!==JSON.stringify(y.asked)){same=false;why=sc+': '+(x.err||'')+' | '+(y.err||'')+' | asks '+x.asked.length+'/'+y.asked.length;}
  const miss=[...new Set(x.asked)].filter(n=>!p.names.includes(n)&&!q.includes("$('"+n+"')"));if(miss.length){cover=false;why+=' missing '+miss.join(', ');}
  depth.push(sc+':'+x.asked.length+(x.err?'E':''));}
 rows.push(p.node.padEnd(26)+depth.join(' '));T(p.node+': same output or error and the same asks as the base, in 4 scenarios; every node asked is in the table',same&&cover,(same&&cover)?'':why.slice(0,300));}
console.log('\n  asks per scenario (E = the node stopped on an error, the same error in base and patched):\n  '+rows.join('\n  '));
console.log('\n'+ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
