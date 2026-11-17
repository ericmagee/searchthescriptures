// ASK 379 build (plan W3 rev 3 amended, 7936/7939; W1 7941/7943/7959; W2 7935/7938/7962; W3 7960/7961).
// usage: node build379.cjs <base engine fetch.json> <child id or CHILD_ID_AT_WRITE> <out engine target.json> <out child.json>
// Moves the R2 chain (39 nodes) into a sub-workflow called once per further pass; the engine loops Second Alternate? -> Alternate Pass Input -> Alternate Pass Call -> Pass Accumulate.
const fs=require('fs');const [BASE,CHILD,OUT_E,OUT_C]=process.argv.slice(2);const CAP=+(process.env.A379_CAP||6);
const W=JSON.parse(fs.readFileSync(BASE));const N=Object.fromEntries(W.nodes.map(n=>[n.name,n]));const C=W.connections;
const clone=x=>JSON.parse(JSON.stringify(x));const fail=m=>{throw new Error(m);};
// ---- the chain
const down=(s,stop)=>{const seen=new Set(),st=[s];while(st.length){const x=st.pop();if(seen.has(x)||stop.has(x))continue;seen.add(x);for(const o of ((C[x]||{}).main||[]))for(const e of (o||[]))st.push(e.node);}return seen;};
const CHAIN=[...down('R2 Alternate Build',new Set(['R2 Alternate Merge'])),'R2 Alternate Merge'];if(CHAIN.length!==39)fail('chain is '+CHAIN.length+' nodes, expected 39');
const inChain=new Set(CHAIN);
for(const [s,v] of Object.entries(C))for(const o of (v.main||[]))for(const e of (o||[]))if(inChain.has(s)!==inChain.has(e.node)){const k=s+'>'+e.node;if(k!=='Second Alternate Needed?>R2 Alternate Build'&&k!=='R2 Alternate Merge>Alternate Merge')fail('unexpected boundary edge '+k);}
// ---- outside nodes the chain reads (literal $() calls, stubs' preambles included), Shared Library apart (read by .params, copied)
const LT=N['Shared Library'].parameters.jsCode;const LIB=JSON.parse(LT.slice(LT.indexOf('\n/*LIB*/')+8,LT.lastIndexOf('\n/*MAP*/')));const MAP=JSON.parse(LT.slice(LT.lastIndexOf('\n/*MAP*/')+8,LT.lastIndexOf('\n/*END*/')));
const src=n=>{const m=MAP[n];return (m?m.p.map(e=>typeof e==='number'?LIB[e]:typeof e[0]==='string'?e[0]:LIB.slice(e[0],e[1]+1).join('\n')).join('\n'):'')+JSON.stringify(N[n].parameters);};
const OUT=new Set();for(const n of CHAIN){for(const m of src(n).matchAll(/\$\(\s*\\?['"]([^'"\\]+)\\?['"]\s*\)/g)){const t=m[1];if(!inChain.has(t)&&N[t])OUT.add(t);}}
OUT.delete('Shared Library');const HOLD=[...OUT].sort();if(HOLD.length!==39)fail('outside nodes '+HOLD.length+', expected 39: '+HOLD.join(', '));
// ---- nodes outside the engine read from the chain (Format Markdown, Panel Tokens): their outputs come back in the pass record
const BACK=['R2 Alternate Build','R2 Alternate Cure Build','R2 Alternate Cure Normalize','R2 Alternate Call openrouter','R2 Alternate Cure Call openrouter','R2 Alt Judge Enforcer Call deepseek','R2 Alt Judge Enforcer Retry Call deepseek','R2 Alt Send Back Call openrouter','R2 Alt Gate Call openrouter','R2 Alt Late Gate Call openrouter','R2 Alt Reread Call deepseek','FUM Call R2 Alternate openrouter'];
BACK.forEach(n=>{if(!inChain.has(n))fail('BACK node not in chain: '+n);});
const JS=s=>JSON.stringify(s);
// ================= CHILD =================
const CH=[];const CC={};const link=(a,b,i=0,j=0)=>{CC[a]=CC[a]||{main:[]};while(CC[a].main.length<=i)CC[a].main.push([]);CC[a].main[i].push({node:b,type:'main',index:j});};
CH.push({id:'a379-in',name:'Alternate Pass In',type:'n8n-nodes-base.executeWorkflowTrigger',typeVersion:1.1,position:[-3400,0],parameters:{inputSource:'passthrough'}});
const checkCode="// ASK 379: input check (W2 7935 item 1, W3 7939 item 1). Every input the pass reads is present; a node that ran in the engine brings at least one item.\n"+
 "const HOLD="+JS(HOLD)+";\nconst j=$input.first().json;const miss=[];\nif(!j||typeof j!=='object')throw new Error('ASK 379 input check: no input item');\n"+
 "if(!j.sa||typeof j.sa!=='object'||!j.sa.a2r)miss.push('sa (the pass decision)');if(!j.parent_exec)miss.push('parent_exec');if(!j.h||typeof j.h!=='object')miss.push('h');\n"+
 "else for(const n of HOLD){const x=j.h[n];if(!x||typeof x.ran!=='boolean')miss.push(n);else if(x.ran&&!(Array.isArray(x.items)&&x.items.length))miss.push(n+' (ran, no items)');}\n"+
 "if(miss.length)throw new Error('ASK 379 input check: missing input '+miss.join(', '));\nconst ran={};for(const n of HOLD)ran[n]=j.h[n].ran;\nreturn [{json:{parent_exec:j.parent_exec,ran}}]; // flags only: the items stay once, in Alternate Pass In";
CH.push({id:'a379-chk',name:'Alternate Pass Check',type:'n8n-nodes-base.code',typeVersion:2,position:[-3200,0],parameters:{jsCode:checkCode}});link('Alternate Pass In','Alternate Pass Check');
HOLD.forEach((n,k)=>{const g='A379 Gate '+String(k+1).padStart(2,'0');
 CH.push({id:'a379-g'+k,name:g,type:'n8n-nodes-base.if',typeVersion:2,position:[-3000+k*0,200+k*120],executeOnce:true,parameters:{conditions:{options:{caseSensitive:true,leftValue:'',typeValidation:'loose'},conditions:[{id:'a379g'+k,leftValue:"={{ $('Alternate Pass Check').first().json.ran["+JS(n)+"] === true }}",rightValue:true,operator:{type:'boolean',operation:'true',singleValue:true}}],combinator:'and'},options:{}}});
 CH.push({id:'a379-h'+k,name:n,type:'n8n-nodes-base.code',typeVersion:2,position:[-2800,200+k*120],parameters:{jsCode:"// ASK 379 holder: this engine node's items as they stood when the pass was called.\nreturn $('Alternate Pass In').first().json.h["+JS(n)+"].items.map(json=>({json}));"}});
 const tk='A379 Tick '+String(k+1).padStart(2,'0');CH.push({id:'a379-t'+k,name:tk,type:'n8n-nodes-base.set',typeVersion:3.4,position:[-2600,200+k*120],executeOnce:true,parameters:{mode:'manual',assignments:{assignments:[]},includeOtherFields:false,options:{}}}); // one empty item to the next gate
 if(k===0)link('Alternate Pass Check',g);link(g,n,0);const nx=k+1<HOLD.length?'A379 Gate '+String(k+2).padStart(2,'0'):'Alternate Pass Entry';link(n,tk);link(tk,nx);link(g,nx,1);});
CH.push({id:'a379-entry',name:'Alternate Pass Entry',type:'n8n-nodes-base.code',typeVersion:2,position:[-2600,0],parameters:{jsCode:"// ASK 379: the pass decision item (Second Alternate? in the engine) enters the pass, as live R2 Alternate Build's input.\n$('Alternate Pass Check').first();return [{json:$('Alternate Pass In').first().json.sa}];"}});
link('Alternate Pass Entry','R2 Alternate Build');
const PARENT_EXEC="$('Alternate Pass Check').first().json.parent_exec";
const DRIFT=[];
for(const n of CHAIN){const x=clone(N[n]);let p=JSON.stringify(x.parameters);const k=(p.match(/\$execution\.id/g)||[]).length;
 if(k){p=p.split('$execution.id').join(PARENT_EXEC.replace(/"/g,'\\"'));DRIFT.push({node:n,what:'$execution.id -> the engine execution id passed in ('+k+')'});}
 x.parameters=JSON.parse(p);CH.push(x);
 for(const o of ((C[n]||{}).main||[]).entries())for(const e of (o[1]||[])){if(n==='R2 Alternate Merge'&&e.node==='Alternate Merge')continue;link(n,e.node,o[0],e.index);}}
link('R2 Alternate Merge','Alternate Pass Out');
const outCode="// ASK 379: the pass result: R2 Alternate Merge's item, plus the items of the pass nodes that Format Markdown and Panel Tokens read.\nconst R=$input.first().json;const NM="+JS(BACK)+";\nconst A={"+BACK.map(n=>JS(n)+":()=>$("+JS(n)+")").join(',')+"};\nconst nodes={};for(const n of NM){try{const x=A[n]();nodes[n]=x.isExecuted?{ran:true,items:x.all().map(i=>i.json)}:{ran:false,items:[]};}catch(e){nodes[n]={ran:false,items:[],error:String(e.message||e).slice(0,200)};}}\nreturn [{json:{...R,__a379_nodes:nodes}}];";
CH.push({id:'a379-out',name:'Alternate Pass Out',type:'n8n-nodes-base.code',typeVersion:2,position:[3000,0],parameters:{jsCode:outCode}});
const SL=clone(N['Shared Library']);SL.position=[-3400,-400];CH.push(SL); // byte copy, not wired (read by .params)
const CHILDW={name:'ODV1 Alternate Pass',nodes:CH,connections:CC,settings:{executionOrder:'v1',callerPolicy:'workflowsFromSameOwner',errorWorkflow:W.settings&&W.settings.errorWorkflow,binaryMode:(W.settings||{}).binaryMode}};
if(!CHILDW.settings.errorWorkflow)delete CHILDW.settings.errorWorkflow;if(!CHILDW.settings.binaryMode)delete CHILDW.settings.binaryMode;
// ================= ENGINE =================
const T=clone(W);T.nodes=T.nodes.filter(n=>!inChain.has(n.name));for(const n of CHAIN)delete T.connections[n];
const TN=Object.fromEntries(T.nodes.map(n=>[n.name,n]));
const rep=(node,a,b)=>{const c=TN[node].parameters.jsCode;const k=c.split(a).length-1;if(k!==1)fail(node+' anchor count '+k+': '+a.slice(0,70));TN[node].parameters.jsCode=c.replace(a,()=>b);};
// 1. Second Alternate? (pass decision): the state comes in the item; one retry as live, never a third try; the cap.
rep('Second Alternate?',"const R1=$('Alternate Merge 1').first().json;","const R1=(({__a379,...r})=>r)($input.first().json);const __P=(($input.first().json.__a379||{}).passes||[]);const __CAP="+CAP+"; /* ASK 379: the pass state travels in the item (Alternate Merge 1's output on the first entry, Pass Accumulate's fold after each pass); __CAP is the operator's number of further passes */");
rep('Second Alternate?'," a2r.retry=[...new Set(T.filter(x=>x.result==='NOT SEATED'&&!filled.has(x.removed_seat)&&/returned content null|returned no JSON object|JSON did not parse/.test(x.why)).map(x=>x.api_model))];",
    " a2r.retry=[...new Set(T.filter(x=>x.result==='NOT SEATED'&&!filled.has(x.removed_seat)&&/returned content null|returned no JSON object|JSON did not parse/.test(x.why)&&T.filter(y=>y.api_model===x.api_model).length===1).map(x=>x.api_model))]; /* ASK 379 (W1 7959): the live retry, once; never a third try */");
rep('Second Alternate?'," a2r.free=free.map(a=>a.seat);a2r.run=a2r.seats.length>0&&free.length>0;"," a2r.free=free.map(a=>a.seat);a2r.run=a2r.seats.length>0&&free.length>0&&__P.length<__CAP;");
rep('Second Alternate?',"  :!T.length?","  :(a2r.seats.length>0&&free.length>0&&__P.length>=__CAP)?'the cap of '+__CAP+' further alternate pass'+(__CAP===1?'':'es')+' is reached'\n  :!T.length?");
rep('Second Alternate?',"return [{json:{...G,a2r}}];","return [{json:{...G,a2r,__a379:{R:R1,passes:__P,pass:__P.length+2}}}]; /* ASK 379 */");
// 2. Alternate Pass Input
const inCode="// ASK 379: the input of one alternate pass: the pass decision, the engine execution id, and the items of every engine node the pass reads (W3 7939 item 1).\nconst A={"+HOLD.map(n=>JS(n)+":()=>$("+JS(n)+")").join(',')+"};\nconst h={};for(const n of Object.keys(A)){let x=null;try{x=A[n]();}catch(e){x=null;}const ran=!!(x&&x.isExecuted);h[n]={ran,items:ran?x.all().map(i=>i.json):[]};}\nconst {__a379,...sa}=$input.first().json; /* the pass state stays in the engine */\nreturn [{json:{sa,parent_exec:$execution.id,h}}];";
T.nodes.push({id:'a379-pin',name:'Alternate Pass Input',type:'n8n-nodes-base.code',typeVersion:2,position:[TN['Second Alternate Needed?'].position[0]+220,TN['Second Alternate Needed?'].position[1]-200],parameters:{jsCode:inCode}});
// 3. Alternate Pass Call (waits; an error comes back as an item)
T.nodes.push({id:'a379-call',name:'Alternate Pass Call',type:'n8n-nodes-base.executeWorkflow',typeVersion:1.2,position:[TN['Second Alternate Needed?'].position[0]+440,TN['Second Alternate Needed?'].position[1]-200],onError:'continueRegularOutput',
 parameters:{source:'database',workflowId:{__rl:true,mode:'id',value:CHILD},mode:'once',options:{waitForSubWorkflow:true},workflowInputs:{mappingMode:'defineBelow',value:{},matchingColumns:[],schema:[],attemptToConvertTypes:false,convertFieldsToString:false}}});
// 4. Pass Accumulate: live Alternate Merge's merge, applied to one pass; an errored pass is recorded as NOT SEATED tries.
const AMc=N['Alternate Merge'].parameters.jsCode;const amHead="const __AMOUT=(()=>{\nconst R1=$('Alternate Merge 1').first().json;\nlet R2=null;try{if($('R2 Alternate Merge').isExecuted)R2=$('R2 Alternate Merge').first().json;}catch(e){R2=null;}\n";
if(AMc.indexOf(amHead)!==0)fail('Alternate Merge head anchor');const core=AMc.slice(amHead.length,AMc.indexOf('\n})();\n'));
let core2=core.replace("const __cecL=","const __cecL0=");const ifr=core2.match(/if\(!R2\)return[^\n]*\n/);if(!ifr)fail('core if(!R2)');core2=core2.replace(ifr[0],"const __cecL=[];\n");
const accCode="// ASK 379: fold one pass into the state. The merge lines below are live Alternate Merge's, applied to this pass (its close-enforcer log is added once, in Alternate Merge).\n"+
"const __SA=$('Second Alternate?').first().json;const __ST=__SA.__a379||{};const __a2r=__SA.a2r||{};const __in=$input.first().json||{};\n"+
"const __err=__in.error?String(__in.error.message||__in.error).replace(/\\s+/g,' ').slice(0,300):(!Array.isArray(__in.bodies)?'the pass returned no result':null);\n"+
"const __RS=$('Resolve Seats').first().json;const __pool=(__RS.alternates||[]);\n"+
"const __ALTL=(s,a,m,why)=>'[AUDIT v21: ALTERNATE TRIED -- SEAT: '+s+'; ALTERNATE: '+a+'; MODEL: '+m+'; RESULT: NOT SEATED; WHY: '+why+']';\n"+
"const R2=__err?(()=>{const seatOf=b=>{try{return JSON.parse(b).payload.judge_seat;}catch(e){return null;}};const tried=[],bodies=[];(__a2r.seats||[]).forEach((s,i)=>{const fs=(__a2r.free||[])[i];const a=__pool.find(x=>x.seat===fs);const why='sub-workflow error: '+__err+(a?'':' (no alternate was assigned)');tried.push({removed_seat:s,alternate:a?a.seat:'none',api_model:a?a.api_model:'none',result:'NOT SEATED',why});const b0=(__SA.bodies||[]).find(b=>seatOf(b)===s);if(b0){const b=JSON.parse(b0);b.payload.verdict_raw=String(b.payload.verdict_raw==null?'':b.payload.verdict_raw)+'\\n'+__ALTL(s,a?a.seat:'none',a?a.api_model:'none',why);bodies.push(JSON.stringify(b));}});return {bodies,summary:[],alternates_seated:[],drv_removed:[],alternates_tried:tried,enforcer_log:[]};})():__in;\n"+
"const R1=__ST.R?__ST.R:$('Alternate Merge 1').first().json;\n"+
"const __AMOUT=(()=>{\n"+core2+"\n})();\n"+
"const __o=__AMOUT[0].json;const passes=(__ST.passes||[]).concat([{pass:__ST.pass||((__ST.passes||[]).length+2),a2r:__a2r,error:__err}]);\n"+
"return [{json:{...__o,__a379:{passes,nodes:__err?{}:(__in.__a379_nodes||{})}}}]; // this pass's nodes only; earlier passes' nodes stay in this node's earlier runs";
T.nodes.push({id:'a379-acc',name:'Pass Accumulate',type:'n8n-nodes-base.code',typeVersion:2,position:[TN['Second Alternate Needed?'].position[0]+660,TN['Second Alternate Needed?'].position[1]-200],parameters:{jsCode:accCode}});
// 5. Alternate Merge: the fold replaces the single R2 merge; a seat left empty by the cap or the two-alternate limit gets a tried line saying so (W3 7960 item 2).
rep('Alternate Merge',amHead,"const __AMOUT=(()=>{\nconst R1=(()=>{let r=null;try{if($('Pass Accumulate').isExecuted)r=$('Pass Accumulate').first().json;}catch(e){r=null;}if(!r)r=$('Alternate Merge 1').first().json;const {__a379,...x}=r;\n"+
" let D=null;try{D=$('Second Alternate?').first().json.a2r;}catch(e){D=null;}const why=D&&D.run!==true&&/the cap of |two alternates already sit/.test(String(D.why||''))?(/two alternates already sit/.test(D.why)?'the two-alternate limit is reached':D.why):null; /* ASK 379 */\n"+
" if(why){const seatOf=b=>{try{return JSON.parse(b).payload.judge_seat;}catch(e){return null;}};const filled=new Set((x.alternates_seated||[]).map(y=>y.removed_seat));const empty=[...new Set((x.alternates_tried||[]).filter(y=>y&&y.result!=='SEATED'&&!filled.has(y.removed_seat)).map(y=>y.removed_seat))];\n"+
"  if(empty.length){const L=s=>'[AUDIT v21: ALTERNATE TRIED -- SEAT: '+s+'; ALTERNATE: none; MODEL: none; RESULT: NOT SEATED; WHY: '+why+']';x.alternates_tried=(x.alternates_tried||[]).concat(empty.map(s=>({removed_seat:s,alternate:'none',api_model:'none',result:'NOT SEATED',why})));x.bodies=(x.bodies||[]).map(b=>{const s=seatOf(b);if(empty.indexOf(s)<0)return b;const j=JSON.parse(b);j.payload.verdict_raw=String(j.payload.verdict_raw==null?'':j.payload.verdict_raw)+'\\n'+L(s);return JSON.stringify(j);});}}\n"+
" return x;})();\nlet R2=null; /* ASK 379: Pass Accumulate folds every pass */\n");
// 6. Format Markdown and Panel Tokens read the chain nodes from the pass record, all passes in order
const SHIM="const __A379=(()=>{let k=0;try{if($('Pass Accumulate').isExecuted)k=(($('Pass Accumulate').first().json.__a379||{}).passes||[]).length;}catch(e){k=0;}const P=[];for(let r=0;r<k;r++){const it=$('Pass Accumulate').all(0,r);P.push(((it[0]||{}).json||{}).__a379||{});}return n=>{const it=[].concat(...P.map(p=>((p.nodes||{})[n]&&p.nodes[n].ran)?p.nodes[n].items:[])).map(json=>({json}));const ran=P.some(p=>(p.nodes||{})[n]&&p.nodes[n].ran);return {isExecuted:ran,all:()=>it,first:()=>it[0]};};})(); /* ASK 379: the alternate-pass nodes now run in the sub-workflow; every pass's items, in order (run r of Pass Accumulate holds pass r+2) */\n";
for(const node of ['Format Markdown','Panel Tokens']){let c=TN[node].parameters.jsCode;let k=0;for(const n of BACK){const a="$('"+n+"')";const m=c.split(a).length-1;k+=m;c=c.split(a).join("__A379('"+n+"')");}
 if(node==='Panel Tokens'){const a="const n=(String(f).match(/\\$\\('(.+)'\\)/)||[])[1]||'?';";if(c.split(a).length!==2)fail('Panel Tokens name anchor');c=c.replace(a,()=>"const n=(String(f).match(/(?:\\$|__A379)\\('(.+)'\\)/)||[])[1]||'?'; /* ASK 379: a pass node's name, read through the pass record */");k++;}
 if(/\$\('R2 /.test(c)||/\$\('FUM [^']*R2 /.test(c))fail(node+' still names an R2 node');TN[node].parameters.jsCode=SHIM+c;DRIFT.push({node,what:k+' reads moved to the pass record'});}
// 7. connections
T.connections['Second Alternate Needed?'].main[0]=[{node:'Alternate Pass Input',type:'main',index:0}];
T.connections['Alternate Pass Input']={main:[[{node:'Alternate Pass Call',type:'main',index:0}]]};
T.connections['Alternate Pass Call']={main:[[{node:'Pass Accumulate',type:'main',index:0}]]};
T.connections['Pass Accumulate']={main:[[{node:'Second Alternate?',type:'main',index:0}]]};
// ---- asserts
for(const x of T.nodes){if(x.name==='Shared Library')continue;const p=JSON.stringify(x.parameters);for(const n of CHAIN)if(p.indexOf("$('"+n+"')")>=0||p.indexOf('$(\\"'+n+'\\")')>=0)fail('engine node '+x.name+' still reads '+n);}
for(const s of Object.keys(T.connections))if(!TN[s]&&!['Alternate Pass Input','Alternate Pass Call','Pass Accumulate'].includes(s))fail('dangling connection from '+s);
const sl=CH.find(x=>x.name==='Shared Library');if(JSON.stringify(sl.parameters)!==JSON.stringify(N['Shared Library'].parameters))fail('Shared Library copy differs');
const newCode=[inCode,accCode.replace(core2,''),checkCode,outCode,SHIM].join('\n');if(/\b(terra|ernie|haiku|sonnet|chatgpt|sol62|hydrogen|argon|spark|ember|grok|luna|qwen|gemini|deepseek|openai|anthropic)\b/i.test(newCode.replace(/deepseek'\)|deepseek"|Call deepseek/g,'')))console.log('NOTE: a model-like word appears in new code; check it');
fs.writeFileSync(OUT_E,JSON.stringify(T));fs.writeFileSync(OUT_C,JSON.stringify(CHILDW));fs.writeFileSync(OUT_E.replace(/\.json$/,'_drift.json'),JSON.stringify(DRIFT,null,1));
console.log('engine nodes',W.nodes.length,'->',T.nodes.length,'| child nodes',CH.length,'| holders',HOLD.length,'| drift exceptions',DRIFT.length);
