// ASK 364 Part B tests. Usage: node t364b.cjs <partB target> <partA target>
const fs=require('fs');const {run}=require('../a364/harness.cjs');let n=0,f=0;const ok=(t,c,d)=>{n++;console.log((c?'ok  ':'FAIL')+' '+t+(d?' :: '+d:''));if(!c)f++;};
const T=JSON.parse(fs.readFileSync(process.argv[2])),A=JSON.parse(fs.readFileSync(process.argv[3]));const nm=w=>Object.fromEntries(w.nodes.map(x=>[x.name,x]));const NT=nm(T),NA=nm(A);const js=JSON.stringify;
const NEW=['D1B Build','D1B Route','D1B Call anthropic','D1B Call openrouter','D1B Call deepseek','D1B Extract'];
ok('six nodes added, none removed, the old order kept',js(T.nodes.slice(0,A.nodes.length).map(x=>x.name))===js(A.nodes.map(x=>x.name))&&js(T.nodes.slice(A.nodes.length).map(x=>x.name))===js(NEW));
const ch=A.nodes.filter(x=>js(x)!==js(NT[x.name])).map(x=>x.name);ok('changed existing nodes are code nodes only, and only in jsCode',A.nodes.filter(x=>ch.includes(x.name)).every(x=>{const a=JSON.parse(js(x)),b=JSON.parse(js(NT[x.name]));delete a.parameters.jsCode;delete b.parameters.jsCode;return js(a)===js(b);}),ch.length+' nodes');
for(const f2 of ['anthropic','openrouter','deepseek']){const a=JSON.parse(js(NA['D1 Call '+f2])),b=JSON.parse(js(NT['D1B Call '+f2]));ok('D1B Call '+f2+' equals D1 Call '+f2+' in type, version, parameters, credentials, retry and error settings',['type','typeVersion','parameters','credentials','retryOnFail','maxTries','waitBetweenTries','onError'].every(k=>js(a[k])===js(b[k])));}
ok('D1B Route equals D2B Route in parameters',js(NT['D1B Route'].parameters)===js(NA['D2B Route'].parameters));
const C=T.connections;const tg=k=>C[k].main.map(o=>(o||[]).map(e=>e.node).join('+')).join(' | ');
ok('wiring: D1 Extract -> D1B Build -> D1B Route; error output of D1 Extract unchanged',tg('D1 Extract')==='D1B Build | Failure Salvage'&&tg('D1B Build')==='D1B Route',tg('D1 Extract'));
ok('wiring: D1B Route as D2B Route (7 = no resend, straight to D1B Extract)',tg('D1B Route')===tg('D2B Route').split('D2B').join('D1B'),tg('D1B Route'));
ok('wiring: each D1B Call, both outputs -> D1B Extract; D1B Extract -> C1 Verse Sheet',['anthropic','openrouter','deepseek'].every(f2=>tg('D1B Call '+f2)==='D1B Extract | D1B Extract')&&tg('D1B Extract')==='C1 Verse Sheet');
const ca=js(A.connections),ct=JSON.parse(js(C));delete ct['D1B Build'];delete ct['D1B Route'];delete ct['D1B Call anthropic'];delete ct['D1B Call openrouter'];delete ct['D1B Call deepseek'];delete ct['D1B Extract'];ct['D1 Extract'].main[0]=[{node:'C1 Verse Sheet',type:'main',index:0}];
ok('no other edge changed',js(ct)===ca);
const left=T.nodes.filter(x=>!['D1B Build','D1B Extract','Failure Salvage','Build Save Body','D1 Extract'].includes(x.name)&&js(x.parameters).includes('D1 Extract'));ok('no reader outside D1B, Failure Salvage and Build Save Body still names D1 Extract',!left.length,left.map(x=>x.name).join());
const AF=Object.getPrototypeOf(async function(){}).constructor;const syn=[];for(const x of T.nodes){if(typeof x.parameters.jsCode!=='string'||!(NEW.includes(x.name)||ch.includes(x.name)))continue;try{new AF('$','$input','$execution',x.parameters.jsCode);}catch(e){syn.push(x.name+': '+e.message);}}ok('syntax of every new or changed code node',!syn.length,syn.join(' | '));
// runs
const rows=JSON.parse(fs.readFileSync('../a364/def_rounds.json'));const r91=rows.find(x=>x.run_token.includes('37891'));
const call={fam:'openrouter',fam_idx:5,model:'m',body:{model:'m',messages:[{role:'user',content:'x'}]}};
const X1=raw=>({run_token:'T',round:'D1',raw,labelled:'DEFENDER (standard reading) -- ROUND 1, OPENING\n\n'+raw,fam:'openrouter',model:'m',msg_id:null});
const env=raw=>({'D1 Extract':X1(raw),'D1 Build':{call},'Init Seats':{run_token:'T'},'Init with Guards':{lab:{D:'DEFENDER (standard reading)',C:'CHALLENGER'}}});
const G=run(NT['D1B Build'].parameters.jsCode,env(r91.r1),{})[0].json;ok('REAL 37891 round 1 (clean under rev 2): no resend',G.resend===false,G.why);
const bad='LINK 1: SUPPORTED\n[L1] Luke 1:34: "Then said Mary unto the angel, How shall this be, seeing I know not a man?"\n[L2] G1097 ginosko (to know).\nChain: she knew no man, so the conception had no human father.';
const Gb=run(NT['D1B Build'].parameters.jsCode,env(bad),{})[0].json;ok('PLANT round 1 short of its layers: resend, layers note only, defender call continued',Gb.resend===true&&/^LAYERS CHECK/.test(Gb.note)&&!/BARRED MOVES/.test(Gb.note)&&Gb.round==='D1B'&&Gb.call.body.messages.slice(-2)[0].content===bad&&Gb.call.body.messages.slice(-1)[0].content===Gb.note,Gb.why);
const K=run(NT['D1B Extract'].parameters.jsCode,{...env(r91.r1),'D1B Build':G},{})[0].json;ok('no resend: D1B Extract passes D1 Extract\'s output through, raw and labelled byte-equal',K.raw===r91.r1&&K.labelled===X1(r91.r1).labelled&&K.round==='D1'&&K.bar&&K.bar.kept==='first');
const fixed=bad+'\n[L3] Matthew 1:18: "Now the birth of Jesus Christ was on this wise: When as his mother Mary was espoused to Joseph, before they came together, she was found with child of the Holy Ghost."';
const reply={choices:[{message:{content:fixed},finish_reason:'stop'}],usage:{prompt_tokens:1,completion_tokens:1}};
let K2=null,er=null;try{K2=run(NT['D1B Extract'].parameters.jsCode,{...env(bad),'D1B Build':Gb},reply)[0].json;}catch(e){er=e.message;}
ok('resend: the second round replaces the first, labelled as ROUND 1, re-checked clean',!!K2&&K2.bar.kept==='second'&&K2.raw.startsWith(fixed)&&/ROUND 1, OPENING/.test(K2.labelled)&&K2.bar.layers&&K2.bar.layers.after&&K2.bar.layers.after.items.length===0,er||(K2&&K2.bar.why));
console.log(n-f+' of '+n+' pass');process.exit(f?1:0);
