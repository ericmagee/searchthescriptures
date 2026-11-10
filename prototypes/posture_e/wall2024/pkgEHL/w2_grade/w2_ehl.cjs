// W2 grade of pkgEHL (Wall 4180). Run from wall2024/: node pkgEHL/w2_grade/w2_ehl.cjs
const fs=require('fs');const RM=require('../../pkgLIB/runner_model.cjs');const {rebuild}=require('../../pkgLIB/unpack.cjs');const D='/mnt/project-files/wall2024/inputs/';
const Ld=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const L=Ld('/mnt/project-files/wall2024/fetchback_live_s108.json'),N=Ld('pkgEHL/parent_s108_EHL.json');
let bad=0;const T=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);if(!c)bad++;};
const code=(w,n)=>w.nodes.find(x=>x.name===n).parameters.jsCode;const LIBL=code(L,'Shared Library'),LIBN=code(N,'Shared Library');
// H1
const diff=N.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(L.nodes.find(x=>x.name===n.name))).map(n=>n.name);
T(diff.length===1&&diff[0]==='Shared Library'&&N.nodes.length===L.nodes.length&&JSON.stringify(N.connections)===JSON.stringify(L.connections),'H1 only the Shared Library changes ('+diff.join(', ')+'); size '+LIBL.length+' -> '+LIBN.length+' ('+(LIBN.length-LIBL.length)+')');
const src=(w,lib,n)=>{const c=code(w,n);return /^\/\/ pkgLIB stub/.test(c)&&c.includes('\nreturn await new Function(')?rebuild(c,lib):c;};
const chg=L.nodes.filter(n=>n.parameters&&typeof n.parameters.jsCode==='string'&&n.name!=='Shared Library'&&/^\/\/ pkgLIB stub/.test(n.parameters.jsCode)&&n.parameters.jsCode.includes('\nreturn await new Function(')).filter(n=>src(L,LIBL,n.name)!==src(N,LIBN,n.name)).map(n=>n.name);
console.log('     rebuilt sources that change: '+chg.join(', '));
// runner
const NODES={'Judge Enforcer Record':'Judge Enforcer','Alt Judge Enforcer Record':'Alt Judge Enforcer'};
const files=new Set(fs.readdirSync(D));const runs=[...files].filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]).sort();
const savedRaw=(run,n)=>{const f=D+run+'_'+n.replace(/ /g,'_')+'.json';if(!files.has(run+'_'+n.replace(/ /g,'_')+'.json'))return null;const d=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(d)?d[0]:d;if(!r)return null;const m=(r.data&&r.data.main)||r.main;return (m&&m[0])||[];};
const cl=x=>JSON.parse(JSON.stringify(x));const AF=Object.getPrototypeOf(async function(){}).constructor;
async function run(w,lib,node,runId,over){const saved=n=>over&&over[n]!==undefined?over[n]:savedRaw(runId,n);const c=src(w,lib,node);const pre=NODES[node];
 const inNode=[pre+' Retry Call deepseek',pre+' Call deepseek'].find(x=>saved(x)!==null);const inp=saved(inNode)||[];
 const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp),get item(){return cl(inp[0]);}};
 const mk=name=>{if(name==='Shared Library')return {isExecuted:true,params:{jsCode:lib}};const it=saved(name);if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+name);};return {isExecuted:false,first:no,last:no,all:no,get item(){return no();},params:{}};}
  return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),get item(){return cl(it[0]);},params:{}};};
 try{const o=await new AF('$','$input','$json','$execution',c)(RM.gate(RM.needs(c),mk),$input,inp[0]&&inp[0].json,{id:runId});return o[0].json;}catch(e){return {ERR:String(e.message||e)};}}
const sig=j=>j.ERR?'ERR '+j.ERR:JSON.stringify((j.enf428_rows||[]).map(r=>[r.seat,r.rule,r.flagged_line,r.cure_reason]))+JSON.stringify(j.enf428&&j.enf428.tally||null);
(async()=>{
 // H2
 for(const node of Object.keys(NODES)){let n=0,eq=0,dif=[];for(const r of runs){if(savedRaw(r,NODES[node]+' Call deepseek')===null)continue;const a=await run(L,LIBL,node,r),b=await run(N,LIBN,node,r);if(a.ERR&&b.ERR)continue;n++;if(sig(a)===sig(b))eq++;else dif.push(r);}
  T(!dif.length,'H2 '+node+': '+eq+' of '+n+' stored runs identical to live'+(dif.length?'; differ: '+dif.join(', '):''));}
 // H3 real headless forms
 const re=/^\s*(?:[-•>*]\s*|\d+[.)]\s*)?(?:\*\*)?[BVKYHZPRSWA-Z]\d+(?:\.\d+)?(?:\*\*)?\s*(?:--|—|–|-|\(|,)/;let found=[];
 for(const pre of ['Judge Enforcer','Alt Judge Enforcer','R2 Alt Judge Enforcer'])for(const r of runs)for(const c of ['Call','Retry Call']){const s=savedRaw(r,pre+' '+c+' deepseek');if(!s)continue;
  s.forEach((i,k)=>{let t='';try{t=i.json.choices[0].message.content||'';}catch(e){}for(const l of t.split('\n'))if(re.test(l)&&!/ENFORCER\s*:/i.test(l))found.push(pre+' '+c+' '+r+' call '+(k+1)+' | '+l.trim().slice(0,140));});}
 console.log('H3 stored lines that start with an id and carry no head: '+found.length);found.forEach(x=>console.log('     '+x));
 // H4 plants on 34108 call 1, line B3.1 (real DISAGREE, E-ANS)
 const C0=savedRaw('34108','Judge Enforcer Call deepseek');const t0=C0[0].json.choices[0].message.content;const line=t0.split('\n').find(l=>/^ENFORCER: B3\.1 --/.test(l));
 const ids=savedRaw('34108','Judge Enforcer Build').flatMap(b=>b.json.ids||[]);const kB=ids.findIndex(i=>i.id==='B3.1');
 const other=ids.find(i=>i.id!=='B3.1'&&/^B3\./.test(i.id));
 const verdict=j=>{if(j.ERR)return 'ERR';const rows=(j.enf428_rows||[]).filter(r=>!/^form note/.test(r.cure_reason)&&!/ruling 443/.test(r.cure_reason));return (rows[kB].cure_reason.match(/^ENFORCER (AGREE|DISAGREE|NO VERDICT|NO ANSWER|HELD)/)||[])[1];};
 const P=async(id,ln,expL,expN)=>{const C=cl(C0);C[0].json.choices[0].message.content=t0.replace(line,ln);const over={'Judge Enforcer Call deepseek':C,'Judge Enforcer Retry Call deepseek':null,'Judge Enforcer Retry Build':null};
  const a=await run(L,LIBL,'Judge Enforcer Record','34108',over),b=await run(N,LIBN,'Judge Enforcer Record','34108',over);const va=verdict(a),vb=verdict(b);
  const extra=sig(b)!==sig(a)&&vb===va?' (other rows changed!)':'';T(va===expL&&vb===expN&&!extra,'H4 '+id+': live '+va+', pkgEHL '+vb+' (expected '+expL+', '+expN+')'+extra);};
 const nh=line.replace(/^ENFORCER:\s*/,'');
 await P('headed (control)',line,'DISAGREE','DISAGREE');
 await P('no head',nh,'NO VERDICT','DISAGREE');
 await P('"- " list mark',('- '+nh),'NO VERDICT','DISAGREE');
 await P('"• " bullet',('• '+nh),'NO VERDICT','DISAGREE');
 await P('"> " quote mark',('> '+nh),'NO VERDICT','DISAGREE');
 await P('"1. " numbered',('1. '+nh),'NO VERDICT','NO VERDICT');
 await P('"1) " numbered',('1) '+nh),'NO VERDICT','NO VERDICT');
 await P('single hyphen, no head "B3.1 - DISAGREE"',nh.replace(/^B3\.1 --/,'B3.1 -'),'NO VERDICT','NO VERDICT');
 await P('headed single hyphen "ENFORCER: B3.1 - DISAGREE" (no regression)',line.replace(/^ENFORCER: B3\.1 --/,'ENFORCER: B3.1 -'),'DISAGREE','DISAGREE');
 await P('lower-case head "enforcer:"',line.replace(/^ENFORCER/,'enforcer'),'DISAGREE','DISAGREE');
 await P('bold id, no head "**B3.1** -- DISAGREE"',nh.replace(/^B3\.1/,'**B3.1**'),'NO VERDICT','DISAGREE');
 await P('"- ENFORCER: B3.1 ..." list mark before the head',('- '+line),'DISAGREE','DISAGREE');
 await P('quoted judge line "B3.1 -- MISSES -- ..." (no verdict word)',nh.replace(/--\s*DISAGREE\s*--\s*RIGHT:\s*MISSES/,'-- MISSES'),'NO VERDICT','NO VERDICT');
 await P('non-answer line "D6 -- DISAGREE ..." replacing it',nh.replace(/^B3\.1/,'D6'),'NO VERDICT','NO VERDICT');
 await P('non-answer line "L2, the answer DISAGREE ..."',nh.replace(/^B3\.1 --/,'L2,'),'NO VERDICT','NO VERDICT');
 if(other)await P('headless line naming another item of the call ('+other.id+') in place of B3.1',nh.replace(/^B3\.1/,other.id),'NO VERDICT','NO VERDICT');
 await P('no head, AGREE "B3.1 -- AGREE -- RIGHT: MEETS"',nh.replace(/DISAGREE -- RIGHT: MISSES/,'AGREE -- RIGHT: MEETS'),'NO VERDICT','AGREE');
 // H5 retry counting: the Retry Build counts headed lines only
 const RB=src(L,LIBL,'Judge Enforcer Retry Build'),RBN=src(N,LIBN,'Judge Enforcer Retry Build');T(RB===RBN,'H5a Judge Enforcer Retry Build unchanged by pkgEHL');
 console.log(bad?bad+' FAIL':'ALL OK');})();
