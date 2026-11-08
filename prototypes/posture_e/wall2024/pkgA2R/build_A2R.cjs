// pkgA2R: the second alternate round (Eric-approved even-panel reserve, WALL-2024 2887 option (a), 2889, 2891; design Wall 3222). W1, 11-08.
// A cloned round-2 chain, not a loop: n8n $('X') reads a node's LAST run, so in a loop a Record node whose Call was skipped in round 2 would read
// round 1's replies (isExecuted stays true). Clones have no such leak.
// Usage (from wall2024/): node pkgA2R/build_A2R.cjs [base strip dir] [live fetchback] [out dir]
//   base strip dir: the 22 library full sources (default pkgLIB/strip_RI3, i.e. LIB v25_RI3).
//   live fetchback: the live workflow JSON the non-library chain nodes, IF nodes and HTTP nodes are cloned from (default fetchback_live_s61).
// Writes <out>/strip/patched/ (the 22 base sources, the round-1 "Alternate Merge" renamed Alternate_Merge_1.js, plus 8 R2 library clones = 30)
// and <out>/nodes_A2R.json (new nodes, the rename, connections, code updates) and <out>/plan_A2R.json.
const fs=require('fs');const path=require('path');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const BASE=process.argv[2]||'pkgLIB/strip_RI3';const FB=process.argv[3]||'/mnt/project-files/wall2024/fetchback_live_s61.json';const OUT=process.argv[4]||'pkgA2R/out';
const rd=f=>fs.readFileSync(f,'utf8');
const W=(()=>{const d=JSON.parse(rd(FB));return d.data||d;})();const NODES=W.nodes||W.workflow.nodes;const CONN=W.connections||W.workflow.connections;
const N=Object.fromEntries(NODES.map(n=>[n.name,n]));
const {CHAIN,sub,unsub}=require('./names.cjs').names(CONN);
const CLONED=CHAIN.filter(n=>n!=='Alternate Needed?'); /* round 2 enters at R2 Alternate Build from Second Alternate Needed? */
const R2=n=>'R2 '+n;
const LIBF=fs.readdirSync(BASE+'/patched').filter(f=>f.endsWith('.js')&&f!=='Shared_Library.js');if(LIBF.length!==22)throw new Error('base strip must hold 22 sources, has '+LIBF.length);
const fileOf=n=>n.replace(/ /g,'_').replace(/\?/g,'')+'.js';const LIBNAMES=new Set(LIBF.map(f=>f.replace(/\.js$/,'').replace(/_/g,' ')));
// R2 Alternate Build: three patches on top of the substitution (documented; test_A2R checks they are the only other change).
const {AB_PATCH}=require('./names.cjs');
const once=(t,a,b,what)=>{const k=t.split(a).length-1;if(k!==1)throw new Error(what+': anchor found '+k+' times: '+a.slice(0,80));return t.replace(a,()=>b);};
fs.rmSync(OUT,{recursive:true,force:true});const SP=OUT+'/strip/patched';fs.mkdirSync(SP,{recursive:true});
const plan={base_strip:BASE,fetchback:FB,chain:CHAIN,cloned:CLONED.map(n=>[n,R2(n)]),library_files:[],nodes_new:[],rename:[['Alternate Merge','Alternate Merge 1']]};
for(const f of LIBF){const s=rd(BASE+'/patched/'+f);const to=f==='Alternate_Merge.js'?'Alternate_Merge_1.js':f;fs.writeFileSync(SP+'/'+to,s);plan.library_files.push({file:to,from:f,sha:sha(s),kind:'base'});}
for(const n of CLONED.filter(n=>LIBNAMES.has(n))){let s=sub(rd(BASE+'/patched/'+fileOf(n)));
 if(n==='Alternate Build')for(const [a,b] of AB_PATCH)s=once(s,sub(a),b,'R2 Alternate Build');
 const f='R2_'+fileOf(n);fs.writeFileSync(SP+'/'+f,s);plan.library_files.push({file:f,clone_of:fileOf(n),sha:sha(s),kind:'R2 clone'});}
// pkgE4 guard: round 2 has no early start. A clone source that names an Early Alternate node would read round 1's early replies.
for(const n of CLONED){const t=LIBNAMES.has(n)?rd(BASE+'/patched/'+fileOf(n)):JSON.stringify(N[n].parameters);if(/Early Alternate/.test(t))throw new Error(n+' names an Early Alternate node (pkgE4); build the clones from pre-E4 sources (fetchback_live_s61) or map those names first');}
// non-library nodes: clone from the live workflow by substitution in every string parameter
const ids=k=>{const h=crypto.createHash('sha1').update('odv1-a2r-'+k).digest('hex');return h.slice(0,8)+'-'+h.slice(8,12)+'-5'+h.slice(13,16)+'-a'+h.slice(17,20)+'-'+h.slice(20,32);};
const deep=(o,f)=>typeof o==='string'?f(o):Array.isArray(o)?o.map(x=>deep(x,f)):o&&typeof o==='object'?Object.fromEntries(Object.entries(o).map(([k,v])=>[k,deep(v,f)])):o;
const DY=1700;const nodesNew=[];
for(const n of CLONED){const b=N[n];if(!b)throw new Error('live node missing: '+n);const c=JSON.parse(JSON.stringify(b));c.id=ids(n);c.name=R2(n);c.position=[b.position[0],b.position[1]+DY];
 if(LIBNAMES.has(n)){c.parameters={jsCode:'FILE:stub:R2_'+fileOf(n)};}
 else{c.parameters=deep(b.parameters,sub);if(c.parameters.conditions&&Array.isArray(c.parameters.conditions.conditions))c.parameters.conditions.conditions.forEach(x=>{x.id='r2-'+x.id;});}
 nodesNew.push(c);}
// new nodes: Second Alternate? (code), Second Alternate Needed? (IF), Alternate Merge (the final combine; the round-1 node is renamed Alternate Merge 1)
const AM1=N['Alternate Merge'];const P0=AM1.position;
const SA_CODE=rd('pkgA2R/second_alternate.js'),FIN_CODE=rd('pkgA2R/alternate_merge_final.js');
nodesNew.push({id:ids('Second Alternate?'),name:'Second Alternate?',type:'n8n-nodes-base.code',typeVersion:2,position:[P0[0]+220,P0[1]],parameters:{jsCode:SA_CODE}});
{const t=JSON.parse(JSON.stringify(N['Alternate Needed?']));t.id=ids('Second Alternate Needed?');t.name='Second Alternate Needed?';t.position=[P0[0]+440,P0[1]];
 t.parameters.conditions.conditions=[{id:'second-alternate-needed',leftValue:'={{ $json.a2r && $json.a2r.run === true }}',operator:{operation:'true',singleValue:true,type:'boolean'},rightValue:''}];nodesNew.push(t);}
nodesNew.push({id:ids('Alternate Merge (final)'),name:'Alternate Merge',type:'n8n-nodes-base.code',typeVersion:2,position:[P0[0]+660,P0[1]+DY],parameters:{jsCode:FIN_CODE}});
// connections
const add=[];for(const n of CLONED){(((CONN[n]||{}).main)||[]).forEach((br,o)=>(br||[]).forEach(c=>{if(c.node==='Dry?')return;add.push([R2(n),o,R2(c.node),c.index||0]);}));}
add.push(['Alternate Merge 1',0,'Second Alternate?',0],['Second Alternate?',0,'Second Alternate Needed?',0],['Second Alternate Needed?',0,'R2 Alternate Build',0],
 ['Second Alternate Needed?',1,'Alternate Merge',0],['R2 Alternate Merge',0,'Alternate Merge',0],['Alternate Merge',0,'Dry?',0]);
const remove=[['Alternate Merge 1',0,'Dry?',0]];
// code updates outside the chain: Panel Tokens (round-2 call tokens) and Format Markdown (round-2 calls in the report)
const upd={};
{let t=N['Panel Tokens'].parameters.jsCode;
 t=once(t,`"Alternate Cure Call openrouter":()=>$('Alternate Cure Call openrouter')}`,`"Alternate Cure Call openrouter":()=>$('Alternate Cure Call openrouter'),"R2 Alternate Call openrouter":()=>$('R2 Alternate Call openrouter'),"R2 Alternate Cure Call openrouter":()=>$('R2 Alternate Cure Call openrouter')}`,'Panel Tokens map');
 t=once(t,`.concat(['Alternate Call openrouter','Alternate Cure Call openrouter'])`,`.concat(['Alternate Call openrouter','Alternate Cure Call openrouter','R2 Alternate Call openrouter','R2 Alternate Cure Call openrouter'])`,'Panel Tokens list');upd['Panel Tokens']=t;}
{let t=N['Format Markdown'].parameters.jsCode;
 t=once(t,`const __L={"Alternate Build":()=>$('Alternate Build'),"Alternate Cure Build":()=>$('Alternate Cure Build'),"Alternate Cure Normalize":()=>$('Alternate Cure Normalize'),`,
  `const __L={"Alternate Build":()=>$('Alternate Build'),"Alternate Cure Build":()=>$('Alternate Cure Build'),"Alternate Cure Normalize":()=>$('Alternate Cure Normalize'),"R2 Alternate Build":()=>$('R2 Alternate Build'),"R2 Alternate Cure Build":()=>$('R2 Alternate Cure Build'),"R2 Alternate Cure Normalize":()=>$('R2 Alternate Cure Normalize'),`,'Format Markdown map');
 const fmA=`(fromNode('Alternate Build', x => x.all().map(i => i.json.alt)) || [])`;
 t=once(t,fmA,`(fromNode('Alternate Build', x => x.all().map(i => i.json.alt)) || []).concat((__L['R2 Alternate Build']().isExecuted ? fromNode('R2 Alternate Build', x => x.all().map(i => i.json.alt)) : null) || [])`,'Format Markdown alternate calls');
 t=once(t,`'Panel Cure Normalize 3', 'Alternate Cure Normalize'].forEach(`,`'Panel Cure Normalize 3', 'Alternate Cure Normalize', 'R2 Alternate Cure Normalize'].forEach(`,'Format Markdown cure replies');
 t=once(t,`'Panel Cure Build 3', 'Alternate Cure Build'].forEach(`,`'Panel Cure Build 3', 'Alternate Cure Build'].concat(__L['R2 Alternate Cure Build']().isExecuted ? ['R2 Alternate Cure Build'] : []).forEach(`,'Format Markdown cure calls');upd['Format Markdown']=t;}
for(const [k,v] of Object.entries(upd)){fs.writeFileSync(OUT+'/'+fileOf(k),v);plan.code_updates=plan.code_updates||[];plan.code_updates.push({node:k,base_sha:sha(N[k].parameters.jsCode),final_sha:sha(v),file:fileOf(k)});}
plan.nodes_new=nodesNew.map(n=>({name:n.name,type:n.type,code_sha:n.parameters.jsCode&&!/^FILE:/.test(n.parameters.jsCode)?sha(n.parameters.jsCode):null,library_stub:/^FILE:/.test(n.parameters.jsCode||'')?n.parameters.jsCode.slice(10):null}));
fs.writeFileSync(OUT+'/nodes_A2R.json',JSON.stringify({nodes:nodesNew,rename:plan.rename,connections:{remove,add},code_updates:Object.keys(upd).map(k=>({node:k,file:fileOf(k)}))},null,1));
fs.writeFileSync(OUT+'/plan_A2R.json',JSON.stringify(plan,null,1));
console.log('chain',CHAIN.length,'cloned',CLONED.length,'library clones',plan.library_files.filter(x=>x.kind==='R2 clone').length,'new nodes',nodesNew.length,'connections +'+add.length+' -'+remove.length);
