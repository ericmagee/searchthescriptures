// pkgPTA (W3 2647, after pkgPTK): the 26 remaining nodes with a computed $() call fetch by literal name. Same transform as pkgPTK: each
// computed $(x) becomes __L[x](), a table of literal $('<name>') calls. The table holds every node name the node's code spells as a whole
// string, plus the names it builds by concatenation (listed per node below, read from its code). Base: the n22p finals (pkgPTK output,
// itself on pkgBAR v2 on fetchback_n21). Its own write after n23 (pkgJFL), which touches none of these 26 nodes' code... checked by W4 sha.
// Run from wall2024/: node pkgPTA/build_PTA.cjs [in workflow JSON] [out workflow JSON]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const {COMPN}=require('../pkgPTK/scan.cjs');
// W3 2653: two writes. PART A = the 12 nodes whose real scenarios ran to the end, plus B1 (base: live). PART B = the 14 held nodes (Panel
// Done, Panel Check, Panel Payloads, the 3 Accept nodes, the 8 round Builds), built on PART A's output, graded on saved real inputs.
const PART=(process.argv[2]||'A').toUpperCase();if(!/^[AB]$/.test(PART))throw new Error('usage: build_PTA.cjs A|B [in] [out]');
const HELD=['Panel Done','Panel Check','Panel Payloads','Accept Final','Accept Check','Accept Build','D1 Build','C1 Build','D2 Build','C2 Build','D3 Build','C3 Build','D4 Build','C4 Build'];
const IN=process.argv[3]||(PART==='A'?'/mnt/project-files/wall2024/fetchback_live_1b49671d.json':'pkgPTA/out/workflow_PTA_A.json'),OUTW=process.argv[4]||'pkgPTA/out/workflow_PTA_'+PART+'.json';
let w=JSON.parse(fs.readFileSync(IN,'utf8'));w=w.nodes?w:(w.data||w);const N=Object.fromEntries(w.nodes.map(n=>[n.name,n]));const NS=new Set(Object.keys(N));
// pkgSLA d58a35f (W3 PASS) goes first: its 6 nodes are laid on the input when its plan's base sha matches (Alternate Merge is one of the 26)
if(PART==='A'){const SP=JSON.parse(fs.readFileSync('pkgSLA/plan_SLA.json','utf8'));for(const x of SP.nodes){const n=x.file.slice(0,-3).replace(/_/g,' ');const cur=N[n].parameters.jsCode;
 if(sha(cur)===x.final_sha)continue;if(sha(cur)!==x.base_sha)throw new Error('pkgSLA '+n+': input sha '+sha(cur)+' is neither its base nor its final');N[n].parameters.jsCode=fs.readFileSync('pkgSLA/patched/'+x.file,'utf8');}}
for(const d of ['patched','base','out'])fs.mkdirSync('pkgPTA/'+d,{recursive:true});const plan={part:PART,base:IN,nodes:[]};
const RC=['C','D'].flatMap(s=>[1,2,3,4].map(k=>s+k+' Call anthropic'));
// names built by concatenation, per node (from the code: sd+k+' Call anthropic' in the 8 round Builds; the z-ai helper __ZH(side,prev);
// Failure Salvage's r+' Extract' and r+'B Extract' over the round list)
const ZH={'D3 Build':['D2 Build','D2B Extract'],'C3 Build':['C2 Build','C2B Extract'],'D4 Build':['D3 Build','D3B Extract'],'C4 Build':['C3 Build','C3B Extract']};
const R8=['D1','C1','D2','C2','D3','C3','D4','C4'];
const EXTRA=n=>(/^[CD][1-4] Build$/.test(n)?RC.concat(ZH[n]||[]):n==='Failure Salvage'?R8.map(r=>r+' Extract').concat(R8.map(r=>r+'B Extract')):[]);
const ORDER=['Panel Tokens'/*done in pkgPTK*/,'Panel Done','Format Markdown','Failure Salvage','Alternate Merge','Alt Send Back Record','Alt Send Back Build','Alt Judge Enforcer Build',
 'Alternate Payloads','Send Back Record','Send Back Build','Judge Enforcer Build','Enforcer Build','Panel Cure Check','Panel Check','Panel Payloads',
 'Accept Final','Accept Check','Accept Build','D1 Build','C1 Build','D2 Build','C2 Build','D3 Build','C3 Build','D4 Build','C4 Build'].slice(1).filter(n=>PART==='B'?HELD.includes(n):!HELD.includes(n));
/* every node name the code spells whole, in single or double quotes (a substring test per name, so a stray quote elsewhere cannot shift it) */
const lits=s=>[...NS].filter(n=>s.includes("'"+n.replace(/\\/g,'\\\\').replace(/'/g,"\\'")+"'")||s.includes('"'+n+'"'));
for(const name of ORDER){const s0=N[name].parameters.jsCode;const cs=COMPN(s0);if(!cs.length)throw new Error(name+': no computed call');
 const names=[...new Set(lits(s0).concat(EXTRA(name)))].filter(n=>NS.has(n)).sort();
 let s1=s0;for(const c of cs.slice().reverse())s1=s1.slice(0,c.st)+'__L['+c.arg+']()'+s1.slice(c.en);
 const s="const __L={"+names.map(n=>JSON.stringify(n)+":()=>$('"+n.replace(/\\/g,'\\\\').replace(/'/g,"\\'")+"')").join(',')+"}; /* pkgPTA: literal names only */\n"+s1;
 if(COMPN(s).length)throw new Error(name+': a computed $() is left');new Function('$','$input','$json',s);
 const f=name.replace(/ /g,'_')+'.js';fs.writeFileSync('pkgPTA/base/'+f,s0);fs.writeFileSync('pkgPTA/patched/'+f,s);N[name].parameters.jsCode=s;
 plan.nodes.push({node:name,base_sha:sha(s0),final_sha:sha(s),computed_calls:cs.length,table:names.length,names});}
// B1 (W3 rulings 2650): run 33175 lost its enforcer log. record_enforcer_log returned 500 three times at 23:30:11-23:30:44Z, each a
// "canceling statement due to statement timeout" (8 s), and Write Enforcer Log's error output still went to Derive Outcome, so the outcome
// was derived and seats removed with no cure rows on record. (1) The error output goes to Panel Failure Note, the panel's own failure path:
// no outcome is derived, so no seat is removed, without the log. (2) More room to get past a busy table: 5 tries, 5 s apart (was 3, 3 s).
if(PART==='A'){const C=w.connections;const n=N['Write Enforcer Log'];const was=JSON.stringify({c:C['Write Enforcer Log'],t:[n.maxTries,n.waitBetweenTries,n.onError]});
 if(JSON.stringify(C['Write Enforcer Log'].main)!==JSON.stringify([[{node:'Derive Outcome',type:'main',index:0}],[{node:'Derive Outcome',type:'main',index:0}]]))throw new Error('Write Enforcer Log wiring is not the expected base');
 C['Write Enforcer Log'].main[1]=[{node:'Panel Failure Note',type:'main',index:0}];n.maxTries=5;n.waitBetweenTries=5000;
 plan.structural={node:'Write Enforcer Log',was:JSON.parse(was),now:{c:C['Write Enforcer Log'],t:[n.maxTries,n.waitBetweenTries,n.onError]}};}
const left=w.nodes.filter(n=>typeof (n.parameters||{}).jsCode==='string'&&COMPN(n.parameters.jsCode).length).map(n=>n.name);
if(PART==='B'&&left.length)throw new Error('still computed: '+left.join(', '));if(PART==='A'&&left.sort().join()!==HELD.slice().sort().join())throw new Error('part A leaves computed: '+left.join(', '));
fs.writeFileSync(OUTW,JSON.stringify(w));fs.writeFileSync('pkgPTA/plan_PTA_'+PART+'.json',JSON.stringify(plan,null,1));
for(const p of plan.nodes)console.log(p.node.padEnd(26),p.base_sha,'->',p.final_sha,String(p.computed_calls).padStart(2)+' computed, '+p.table+' names');
console.log(PART==='B'?'no code node in the workflow has a computed $() call left':'part A: the 14 held nodes are the only computed ones left');
