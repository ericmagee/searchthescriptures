// ASK 422(a) build (plan W3 rev 1 + rev 2; "two copies, one writer, checked at load"). Usage: node build422a.cjs ENG CHILD ENG_BASEV CHILD_BASEV ENG_OUT CHILD_OUT
// Engine: new Code node "Library Sha (ASK 422a)" on the true branch of "Second Alternate Needed?", before "Alternate Pass Call"; it adds __lib422 (the
// run-time sha of its own Shared Library body); the Call's pass input drops __lib422 from sa and carries it as lib_sha.
// Child: new Code node "Library Check (ASK 422a)" between "Alternate Pass In" and "Alternate Pass Check"; it stops the child with
// "pkgLIB1: library drift, engine <x>, child <y>" unless lib_sha equals the sha of the child's own Shared Library body.
const fs=require('fs'),path=require('path');const acorn=require(path.join(__dirname,'../tools/node_modules/acorn'));
const [EI,CI,EV,CV,EO,CO]=process.argv.slice(2);const ld=p=>{let d=JSON.parse(fs.readFileSync(p));return d.data||d;};const E=ld(EI),C=ld(CI);
if(E.versionId!==EV)throw new Error('engine base moved '+E.versionId);if(C.versionId!==CV)throw new Error('child base moved '+C.versionId);
const SHA=fs.readFileSync(path.join(__dirname,'sha.js'),'utf8').trim();const nd=(w,n)=>{const x=w.nodes.filter(y=>y.name===n);if(x.length!==1)throw new Error('node '+n);return x[0];};
const EN='Library Sha (ASK 422a)',CN='Library Check (ASK 422a)';if(E.nodes.some(n=>n.name===EN)||C.nodes.some(n=>n.name===CN))throw new Error('already built');
const ECODE=SHA+"\n/* ASK 422(a): computed at run time from this workflow's own Shared Library, never stored; the child checks it at load (pkgLIB1). */\nconst __ls=__LIBSHA422($('Shared Library').params.jsCode);\nreturn $input.all().map((i,k)=>({json:{...i.json,__lib422:__ls},pairedItem:{item:k}}));";
const CCODE=SHA+"\n/* ASK 422(a) load check: the engine's library sha (pass.lib_sha) must equal this child's own Shared Library sha, else the pass stops (pkgLIB1). */\nconst __it=$input.all();const __p=(__it[0]&&__it[0].json&&__it[0].json.pass)||{};const __eng=(typeof __p.lib_sha==='string'&&__p.lib_sha)?__p.lib_sha:null;const __own=__LIBSHA422($('Shared Library').params.jsCode);\nif(!__eng||!__own||__eng!==__own)throw new Error('pkgLIB1: library drift, engine '+(__eng||'none')+', child '+(__own||'none'));\nreturn __it.map((i,k)=>({json:{...i.json,lib422:{engine:__eng,child:__own,same:true}},pairedItem:{item:k}}));";
const P=s=>acorn.parse('(async function(){'+s+'\n})',{ecmaVersion:'latest'});P(ECODE);P(CCODE);
const call=nd(E,'Alternate Pass Call'),ifn=nd(E,'Second Alternate Needed?');
const pv=call.parameters.workflowInputs.value.pass;const A1="sa: Object.fromEntries(Object.entries($json).filter(e => e[0] !== '__a379')), parent_exec: $execution.id,";
if(pv.split(A1).length!==2)throw new Error('Call pass anchor');call.parameters.workflowInputs.value.pass=pv.replace(A1,()=>"sa: Object.fromEntries(Object.entries($json).filter(e => e[0] !== '__a379' && e[0] !== '__lib422')), parent_exec: $execution.id, lib_sha: $json.__lib422,");
const mid=(a,b)=>[Math.round((a.position[0]+b.position[0])/2),Math.round((a.position[1]+b.position[1])/2)+80];
E.nodes.push({parameters:{jsCode:ECODE},id:'a422a0e1-0000-4000-8000-000000000001',name:EN,type:'n8n-nodes-base.code',typeVersion:2,position:mid(ifn,call)});
const t=E.connections['Second Alternate Needed?'].main;if(!(t[0].length===1&&t[0][0].node==='Alternate Pass Call'))throw new Error('IF true branch is not the Call alone');
t[0]=[{node:EN,type:'main',index:0}];E.connections[EN]={main:[[{node:'Alternate Pass Call',type:'main',index:0}]]};
const cin=nd(C,'Alternate Pass In'),cchk=nd(C,'Alternate Pass Check');const ci=C.connections['Alternate Pass In'].main;if(!(ci[0].length===1&&ci[0][0].node==='Alternate Pass Check'))throw new Error('child In does not lead to Check alone');
C.nodes.push({parameters:{jsCode:CCODE},id:'a422a0c1-0000-4000-8000-000000000002',name:CN,type:'n8n-nodes-base.code',typeVersion:2,position:mid(cin,cchk)});
ci[0]=[{node:CN,type:'main',index:0}];C.connections[CN]={main:[[{node:'Alternate Pass Check',type:'main',index:0}]]};
fs.writeFileSync(EO,JSON.stringify(E));fs.writeFileSync(CO,JSON.stringify(C));console.log('built: engine +',EN,'| child +',CN);
