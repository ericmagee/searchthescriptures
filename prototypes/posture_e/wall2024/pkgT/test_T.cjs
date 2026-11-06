// WALL-2024 alternate shortage fix, offline tests (W2). argv[2]: fetch of live 6b077f9e. Run from the wall2024 dir. Writes nothing live.
const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).workflow;const LN={};W.nodes.forEach(n=>LN[n.name]=n.parameters&&n.parameters.jsCode||'');
const plan=JSON.parse(fs.readFileSync('pkgT/plan_T.json','utf8'));const pat=n=>fs.readFileSync('pkgT/patched/'+n.replace(/ /g,'_')+'.js','utf8');
let bad=0;const T=(ok,m)=>{console.log((ok?'OK  ':'FAIL')+' '+m);if(!ok)bad++;};const sha=s=>require('crypto').createHash('sha256').update(s).digest('hex').slice(0,16);
(async()=>{
T(plan.nodes.length===2&&plan.nodes.every(x=>sha(LN[x.name])===x.live_sha&&sha(pat(x.name))===x.final_sha),'2 nodes (Alternate Build, Build Save Body); live_sha equals this fetch, final_sha equals the patched file');
const G4="\n  if(!QA&&used.indexOf(a.api_model)>=0)return 'G4: '+a.api_model+' is already offered to an earlier removed seat'; // WALL-2024 2198 (b): each removed seat gets the next pool model";
const bsb=pat('Build Save Body');const i0=bsb.indexOf('// WALL-2024 2198 (b): a removed panel seat');const i1=bsb.indexOf("const RN=FF.length?FF.join(' '):null;");
T(pat('Alternate Build').replace(G4,'')===LN['Alternate Build']&&bsb.slice(0,i0)+bsb.slice(i1)===LN['Build Save Body'],'reverse edit: removing the two insertions gives the live text');
// ---- Alternate Build, run offline on its own code with its inputs stubbed
const AF=Object.getPrototypeOf(async function(){}).constructor;const AB=pat('Alternate Build'),AB0=LN['Alternate Build'];
const runAB=async(code,pool,removed)=>{const seats=['gemini','chatgpt','grok'];
 const pay=seats.map((s,i)=>({judge_seat:s,judge_api_model:'m/'+s,drv_uncured:removed.includes(s)?2:0,verdict_raw:'x'}));
 const PP={bodies:pay.map(p=>JSON.stringify({payload:p})),summary:seats.map(s=>({seat:s}))};
 const P={judges:seats.map(s=>({seat:s,body:{messages:[{role:'system',content:'SYS'},{role:'user',content:'TRANSCRIPT'}]}}))};
 const D={'Panel Build':P,'Init Seats':{run_token:'T',posture:false,dry:false},'Resolve Seats':{alternates:pool.map(k=>({seat:k,fam:'openrouter',api_model:'m/'+k,max_tokens:4000,family:k})),debaters:[{engine:'claude',model:'c',family:'anthropic'}]}};
 const $=n=>{if(n in D)return {first:()=>({json:D[n]}),all:()=>[{json:D[n]}],isExecuted:true};return {isExecuted:false,first:()=>{throw new Error('no '+n);},all:()=>[]};};
 const $input={first:()=>({json:PP}),all:()=>[{json:PP}]};return (await new AF('$','$input','$execution',code)($,$input,{id:'1'})).map(x=>x.json);};
{const o=await runAB(AB,['sol','glm'],['chatgpt','grok']),o0=await runAB(AB0,['sol','glm'],['chatgpt','grok']);
 T(o.length===2&&o[0].alt.removed_seat==='chatgpt'&&o[0].alt.pool_seat==='sol'&&o[1].alt.removed_seat==='grok'&&o[1].alt.pool_seat==='glm','two removed seats, pool sol and glm: chatgpt gets sol, grok gets glm (the next model)');
 T(o0.length===2&&o0[0].alt.pool_seat==='sol'&&o0[1].alt.pool_seat==='sol','the live code gives both seats sol (the defect)');}
{const o=await runAB(AB,['sol'],['chatgpt','grok']);const sk=(o[0].skips||[]);
 T(o.length===1&&o[0].alt.pool_seat==='sol'&&sk.length===1&&sk[0].removed_seat==='grok'&&/G4: m\/sol is already offered to an earlier removed seat/.test(sk[0].skip),'pool of one (as in 32949, alt_order ["sol"]): chatgpt gets sol; grok is a skip naming G4: '+(sk[0]&&sk[0].skip));}
{const o=await runAB(AB,['sol','glm'],['grok']);T(o.length===1&&o[0].alt.pool_seat==='sol','one removed seat: unchanged, it gets the first model');}
// ---- Build Save Body insertion, run on stubbed Alternate Merge output
const snip=bsb.slice(i0,i1);const runBS=AM=>{const FF=[];const $=n=>n==='Alternate Merge'?{isExecuted:!!AM,first:()=>({json:AM})}:{isExecuted:false};new Function('$','FF',snip)($,FF);return FF;};
const body=(s,n)=>JSON.stringify({payload:{judge_seat:s,drv_uncured:n}});
{const F=runBS({alternates_seated:[{removed_seat:'chatgpt',alternate_seat:'sol'}],alternates_tried:[{removed_seat:'chatgpt',alternate:'sol',api_model:'m/sol',result:'SEATED'},{removed_seat:'grok',alternate:null,result:'NOT SEATED',why:'no pool model passes the guards: sol G4: m/sol is already offered to an earlier removed seat'}],bodies:[body('sol',0),body('grok',4),body('gemini',0)]});
 T(F.length===1&&/^\[AUDIT v36: PANEL SEAT LEFT UNFILLED -- SEAT: grok; drv_uncured 4; no alternate was seated \(no alternate: NOT SEATED, no pool model passes the guards: sol G4: m\/sol is already offered to an earlier removed seat\); this seat is not counted in the panel result\. REVIEW THIS ROW\.\]$/.test(F[0]),'an unfilled seat gets one plain review line: '+F[0]);
 T(/\[(?:EXTRACTOR|AUDIT) v\d+[^\]\n]*REVIEW THIS ROW[^\]\n]*\]/.test(F[0]),'the line is one bracketed REVIEW line with no inner brackets');}
{const F=runBS({alternates_seated:[],alternates_tried:[{removed_seat:'chatgpt',alternate:'sol',api_model:'m/sol',result:'NOT SEATED',why:'13 uncured item(s)'}],bodies:[body('chatgpt',2)]});T(F.length===1&&/SEAT: chatgpt; drv_uncured 2; no alternate was seated \(sol \(m\/sol\): NOT SEATED, 13 uncured item\(s\)\)/.test(F[0]),'an alternate tried and refused also leaves the seat unfilled, stated with its reason');}
{T(runBS({alternates_seated:[{removed_seat:'chatgpt'}],alternates_tried:[{removed_seat:'chatgpt',alternate:'sol',result:'SEATED'}],bodies:[]}).length===0&&runBS(null).length===0,'no line when every removed seat is filled, or when no alternate step ran');}
// ---- 32949 replay, from the stored inputs: alt_order ["sol"] (execution 32949 Init Seats); removed under the silence rule: gemini, chatgpt, grok
{const o=await runAB(AB,['sol'],['gemini','chatgpt','grok']);const sk=o[0].skips||[];
 T(o.length===1&&o[0].alt.removed_seat==='gemini'&&sk.map(x=>x.removed_seat).join()==='chatgpt,grok','32949: gemini is offered sol; chatgpt and grok are skips (G4), where live offered sol to all three');
 console.log('     32949 effect: sol has 13 and 19 silent items, so Alternate Merge does not seat it; all three seats are unfilled and each gets a v36 line; the panel is UNGRADED, as before this fix. The fix changes who is offered which model, not the count: the pool holds one model.');}
console.log(bad?'FAILED '+bad:'ALL OK');})();
