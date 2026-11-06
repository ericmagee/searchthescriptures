// pkgALT test (item C). Run from wall2024/: node pkgALT/test_ALT.cjs
const fs=require('fs');const X=require('./sol_ctx.cjs');
let ok=0,bad=0;const T=(n,c,d)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n+(d?' -- '+d:''));}};
const P='pkgALT/patched/';const rd=f=>fs.readFileSync(f,'utf8');const NJ=JSON.parse(rd('pkgALT/nodes_ALT.json'));const BN=JSON.parse(rd('pkgALT/base_nodes_68fe.json'));const GN=JSON.parse(rd('pkgGATE/nodes_GATE.json')).nodes;
const MAP=NJ.substitutions.names;const LIT=NJ.substitutions.literals;
// 1. clone test (2268 condition a): each clone equals its original once every substituted name and literal is masked
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const names=[...new Set(Object.keys(MAP).concat(Object.values(MAP)))].sort((a,b)=>b.length-a.length);
const mask=t=>{let s=String(t);for(const [a,b] of LIT){s=s.split(a).join('<LIT>').split(b).join('<LIT>');}return s.replace(new RegExp('([\'"])('+names.map(esc).join('|')+')\\1','g'),'$1<NODE>$1');};
const AMs=rd('pkgTG/patched/Alternate_Merge.js');const lib=AMs.slice(0,AMs.indexOf("let PP=$('Panel Cure Check')"));
const pairs=[['Alt_Judge_Enforcer_Build.js',BN['Judge Enforcer Build'].parameters.jsCode],['Alt_Judge_Enforcer_Record.js',BN['Judge Enforcer Record'].parameters.jsCode],['Alt_Send_Back_Build.js',BN['Send Back Build'].parameters.jsCode],['Alt_Send_Back_Record.js',rd('pkgSBP/patched/Send_Back_Record.js')],['Alt_Gate_Build.js',rd(P+'Gate_Build.js')],['Alt_Gate_Record.js',rd(P+'Gate_Record.js')]];
for(const [f,o] of pairs){const c=rd(P+f);T('clone '+f+' differs from its original only in substituted names and literals',mask(c)===mask(o)&&c!==o);
 const left=[...c.matchAll(/\$\(\s*['"]([^'"]+)['"]\s*\)/g)].map(m=>m[1]).filter(n=>MAP[n]&&!(f.includes('Gate')&&c.indexOf(lib)===0&&lib.includes("$('"+n+"')")));
 T('clone '+f+': no original node name is left in a $() call outside the shared library',!left.length,left.join(', '));}
T('Alt Gate Build and Alt Gate Record keep the library byte for byte',rd(P+'Alt_Gate_Build.js').startsWith(lib)&&rd(P+'Alt_Gate_Record.js').startsWith(lib));
T('Gate Build, Gate Record and Alternate Merge (Alt Apply) carry pkgTG\'s library (one text in every node)',[P+'Gate_Build.js',P+'Gate_Record.js',P+'Alternate_Merge.js'].every(f=>rd(f).startsWith(lib)));
T('Alternate Merge Seat is pkgTG\'s Alternate Merge byte for byte',rd(P+'Alternate_Merge_Seat.js')===AMs);
{const XN=rd(P+'Alt_Send_Back_Build.js').match(/const XN=\[([^\]]*)\]/)[1];T('Alt Send Back Build: the x-ai list adds the alternate calls',/'Alternate Call openrouter'/.test(XN)&&/'Alternate Cure Call openrouter'/.test(XN));}
const nd=n=>NJ.nodes.find(x=>x.name===n);const strip=n=>{const o=JSON.parse(JSON.stringify(n));delete o.id;delete o.name;delete o.position;if(o.parameters.jsonBody)o.parameters.jsonBody=mask(o.parameters.jsonBody);if(o.parameters.conditions)o.parameters.conditions.conditions.forEach(c=>c.id=c.id.replace(/^alt-/,''));return JSON.stringify(o);};
for(const [a,o] of [['Alt Judge Enforcer Needed?',BN['Judge Enforcer Needed?']],['Alt Judge Enforcer Call deepseek',BN['Judge Enforcer Call deepseek']],['Alt Send Back Needed?',BN['Send Back Needed?']],['Alt Send Back Call openrouter',BN['Send Back Call openrouter']],['Alt Gate Needed?',GN.find(x=>x.name==='Gate Needed?')],['Alt Gate Call openrouter',GN.find(x=>x.name==='Gate Call openrouter')]])
 T('clone node '+a+' equals its original but for id, name, position and substituted names',strip(nd(a))===strip(o));
{const jb=nd('Alt Gate Call openrouter').parameters.jsonBody;T('Alt Gate Call: the x-ai reasoning list names the Alt send-back and gate calls',jb.includes('"Alt Send Back Call openrouter"')&&jb.includes('"Alt Gate Call openrouter"'));}
// the chain, offline
const run=(f,$,input)=>new Function('$','$input',rd(P+f))($,input);
const R0=(()=>{const M=new Function('$','$input',lib+'\nreturn {ciRounds};')(()=>{throw 0;},null);return M.ciRounds(X.ptext(X.solReq));})();
const FO={cr1:R0.CR1,cr2:R0.CR2,cr3:R0.CR3,cr4:R0.CR4,gr1:R0.DR1,gr2:R0.DR2,dr3:R0.DR3,dr4:R0.DR4,synthesis:'The defender dropped the claim that Matthew 1:25 reaches back across the espousal.'};
const AMwith=(alt)=>{const bodies=X.panelBodies.slice();if(alt)bodies[1]=X.solBody;return {debate_id:'d',bodies,summary:[{seat:'gemini'},{seat:alt?'sol':'chatgpt'},{seat:'grok'}],panel_effective:[],alternates_seated:alt?[{removed_seat:'chatgpt',alternate_seat:'sol',alternate_api_model:'SOL-MODEL-PLACEHOLDER'}]:[],
 drv_removed:alt?[{seat:'chatgpt',replaced_by:'sol',verdict_raw:'x'}]:[],alternates_tried:alt?[{removed_seat:'chatgpt',alternate:'sol',api_model:'SOL-MODEL-PLACEHOLDER',result:'SEATED'}]:[],enforcer_log:[{k:1}],enforcer_log_body:{p_rows:[{k:1}]},sb_apply:[]};};
function chain(AM,replies){const out={};const it=j=>({json:j});const N={};
 const node=(name,val,all)=>{N[name]={isExecuted:true,first:()=>it(Array.isArray(val)?val[0]:val),all:()=>(all||[val]).map(it)};};
 node('Alternate Merge Seat',AM);node('Init Seats',{run_token:'ODV1-32980-og3a977j'});node('Resolve Seats',{deepseek:{api_model:'deepseek/test'}});node('Final Output',FO);N['Regrade Load']={isExecuted:false};
 node('Alternate Build',null,[{alt:{seat:'sol',api_model:'SOL-MODEL-PLACEHOLDER',body:X.solReq}}]);node('Panel Cure Check',{bodies:X.panelBodies,summary:[{seat:'gemini'},{seat:'chatgpt'},{seat:'grok'}]});
 const $=n=>{if(N[n])return N[n];return {isExecuted:false,first:()=>{throw new Error('node '+n+' did not run');},all:()=>{throw new Error('node '+n+' did not run');}};};
 const step=(name,file,input)=>{const r=run(file,$,{first:()=>it(input[0]),all:()=>input.map(it)});out[name]=r.map(x=>x.json);N[name]={isExecuted:true,first:()=>r[0],all:()=>r};return out[name];};
 // the If nodes route on $json; a skipped call means the record node reads its builder's skip item
 const AS=step('Alt Seated','Alt_Seated.js',[{}]);
 const JEB=step('Alt Judge Enforcer Build','Alt_Judge_Enforcer_Build.js',AS);
 const jeCall=!JEB[0].je_skip?JEB.map(b=>({choices:[{message:{content:replies.enforcer(b)}}]})):JEB;if(!JEB[0].je_skip)N['Alt Judge Enforcer Call deepseek']={isExecuted:true,all:()=>jeCall.map(it)};
 const JER=step('Alt Judge Enforcer Record','Alt_Judge_Enforcer_Record.js',jeCall);
 const SBB=step('Alt Send Back Build','Alt_Send_Back_Build.js',JER);
 const sbCall=!SBB[0].sb_skip?SBB.map(b=>({choices:[{message:{content:replies.sendback(b)}}]})):SBB;if(!SBB[0].sb_skip)N['Alt Send Back Call openrouter']={isExecuted:true,all:()=>sbCall.map(it),first:()=>it(sbCall[0])};
 const SBR=step('Alt Send Back Record','Alt_Send_Back_Record.js',sbCall);
 const GB=step('Alt Gate Build','Alt_Gate_Build.js',SBR);
 const gCall=!GB[0].gate_skip?GB.map(b=>({choices:[{message:{content:replies.gate(b)}}]})):GB;
 const GR=step('Alt Gate Record','Alt_Gate_Record.js',gCall);
 const AP=step('Alternate Merge','Alternate_Merge.js',GR);return out;}
const none={enforcer:()=>'',sendback:()=>'',gate:()=>''};
// 2. strict no-op (2268): no alternate seated
{const AM=AMwith(false);const o=chain(AM,none);T('no alternate seated: Alt Seated has no bodies, every builder skips',o['Alt Seated'][0].bodies.length===0&&o['Alt Judge Enforcer Build'][0].je_skip&&o['Alt Send Back Build'][0].sb_skip&&o['Alt Gate Build'][0].gate_skip);
 T('no alternate seated: Alternate Merge (Alt Apply) returns Alternate Merge Seat\'s output byte for byte',JSON.stringify(o['Alternate Merge'][0])===JSON.stringify(AM));}
// 3. sol on 32980 (2268 condition b): the enforcer read
const AM=AMwith(true);let JEitems=null;
{const o=chain(AM,none);const AS=o['Alt Seated'][0];T('sol seated: Alt Seated carries sol\'s body and request only',AS.bodies.length===1&&JSON.parse(AS.bodies[0]).payload.judge_seat==='sol'&&AS.judges.length===1&&AS.judges[0].seat==='sol');
 const JEB=o['Alt Judge Enforcer Build'];JEitems=JEB.flatMap(b=>b.ids||[]);
 T('the enforcer reads sol\'s lines (items built)',JEitems.length>0&&JEitems.every(x=>x.seat==='sol'),JEitems.map(x=>x.seat).join());
 T('no E-SYN item in the alternate chain (the synthesis was read with the panel)',!JEitems.some(x=>x.rule==='E-SYN'));
 const r13=JEitems.filter(x=>x.rule==='E-ANS'&&/^ANSWER CHECK\s*:\s*Romans 1:3\b/.test(String(x.flagged_line||'')));T('FINDING (not a pass of 2268\'s expectation): sol\'s Romans 1:3 ANSWER CHECK names two rounds, "[CR3; CR4]"; the live E-ANS reader (Judge Enforcer Build, AC pattern) reads one round only, so the line is not read, here or on a panel seat',r13.length===0&&/ANSWER CHECK: Romans 1:3 -- \[CR3; CR4\]/.test(JSON.parse(X.solBody).payload.verdict_raw),JEitems.map(x=>x.rule+' '+String(x.item).slice(0,40)).join(' | '));
 const code=(o['Alt Judge Enforcer Build'][0].code_rows||[]);
 console.log('   sol items: '+JEitems.length+' ('+[...new Set(JEitems.map(x=>x.rule))].map(r=>r+' '+JEitems.filter(x=>x.rule===r).length).join(', ')+'); code rows: '+code.length+' ('+code.map(x=>x.rule).join(', ')+')');
 for(const x of JEitems.filter(x=>/^ANSWER CHECK\s*:\s*Romans 1:3\b|^(?:CHALLENGER )?CONCEDED LINKS/i.test(String(x.flagged_line||''))))console.log('   READ '+x.id+' '+x.rule+' '+String(x.item||'').slice(0,60)+' | '+String(x.flagged_line||'').slice(0,240));
 for(const x of code.filter(x=>/CONCEDED|E-OOR|E-RES/.test(x.rule+' '+(x.flagged_line||''))))console.log('   CODE '+x.rule+' '+String(x.item||'')+' | '+String(x.flagged_line||'').slice(0,200)+' | '+String(x.cure_reason||'').slice(0,200));
 T('the alternate chain\'s rows are marked seat_role alternate',o['Alt Judge Enforcer Record'][0].enf428_rows.every(x=>x.seat_role==='alternate'));}
// 4. sol, full flow with synthetic replies (2268 condition b): the enforcer DISAGREEs with the Romans 1:3 ANSWER CHECK grade
const r13id=(JEitems.find(x=>x.rule==='E-ANS'&&/^ANSWER CHECK\s*:\s*Galatians 4:4 -- \[CR3\]/.test(String(x.flagged_line||'')))||{}).id; /* the enforcer DISAGREEs with sol's MEETS on Galatians 4:4 [CR3] ("I grant the idiom is said of men with fathers") */
T('the synthetic enforcer reply targets sol\'s Galatians 4:4 [CR3] item',!!r13id);
const enf=b=>(b.ids||[]).map(x=>'ENFORCER: '+x.id+' -- '+(x.id===r13id?'DISAGREE -- RIGHT: MISSES -- "passes through" one parent does not meet the pressed meaning':'AGREE -- fits')).join('\n');
const solAC=(JSON.parse(X.solBody).payload.verdict_raw.split(/\\n|\n/).find(l=>/ANSWER CHECK\s*:\s*Galatians 4:4 -- \[CR3\]/.test(l))||'').replace(/\\"/g,'"');
const flows=[['CHANGE (Galatians 4:4 [CR3] to MISSES)',b=>(b.items||[]).map(i=>i.sid+'').map(s=>'SENDBACK: '+s+' || CHANGE TO: '+solAC.replace(/\bMEETS\b/,'MISSES')+' || "passes through" one parent.').join('\n')],
 ['CHANGE with no line form (a NOT APPLIED item for the gate)',b=>(b.items||[]).map(i=>'SENDBACK: '+i.sid+' || CHANGE TO: Remove the Romans 1:3 answer check. || it should go.').join('\n')],
 ['KEEP',b=>(b.items||[]).map(i=>'SENDBACK: '+i.sid+' || KEEP || "passes through" one parent.').join('\n')],['silence',b=>'']];
for(const [lab,sb] of flows){const o=chain(AM,{enforcer:enf,sendback:sb,gate:b=>''});const SBB=o['Alt Send Back Build'][0];const SBR=o['Alt Send Back Record'][0];const GB=o['Alt Gate Build'];const A=o['Alternate Merge'][0];
 console.log('   flow '+lab+': send-back items '+(SBB.items||[]).length+'; tally '+JSON.stringify(SBR.sendback&&SBR.sendback.tally)+'; gate '+(GB[0].gate_skip?'skip ('+GB[0].gate_why+')':GB.map(g=>g.seat+': '+g.items.map(i=>i.gid+' '+i.kind+' '+i.src).join(', ')).join('; '))+'; alt_apply '+JSON.stringify(A.alt_apply).slice(0,300));
 T('flow '+lab+': the send-back reaches sol in its own conversation',!SBB.sb_skip&&SBB.seat==='sol'&&SBB.body.messages[SBB.body.messages.length-1].role==='user'&&SBB.body.model==='SOL-MODEL-PLACEHOLDER');
 T('flow '+lab+': Send Back rows are marked alternate',(SBR.sb_rows||[]).every(x=>x.seat_role==='alternate'));
 const gi=GB[0].gate_skip?[]:GB.flatMap(g=>g.items);const un=A.alt_apply[0]&&A.alt_apply[0].unseated;
 T('flow '+lab+': sol is unseated exactly when a counted gate item is left uncured (the gate reply is silent here)',un===(gi.some(i=>i.live)),JSON.stringify(A.alt_apply));
 if(/no line form/.test(lab))T('flow '+lab+': the gate raises the NOT APPLIED item and sol is unseated',gi.some(i=>i.kind==='NOT APPLIED')&&un===true);
 if(un){T('flow '+lab+': unseated: chatgpt\'s body returns, no alternate seated, sol NOT SEATED, the line names the rule and item',JSON.parse(A.bodies[1]).payload.judge_seat==='chatgpt'&&!A.alternates_seated.length&&!A.drv_removed.length&&A.alternates_tried[0].result==='NOT SEATED'&&/E-GATE G\d/.test(A.alternates_tried[0].why)&&JSON.parse(A.bodies[1]).payload.verdict_raw.includes('ALTERNATE UNSEATED'),A.alternates_tried[0].why);}
 else T('flow '+lab+': sol stays seated',JSON.parse(A.bodies[1]).payload.judge_seat==='sol'&&A.alternates_seated.length===1);
 T('flow '+lab+': E-APPLY ran once for sol and never for a panel seat',A.enforcer_log.filter(x=>x.kind==='send_back_apply'&&x.rule==='E-APPLY'&&/^APPLIED/.test(x.item)).every(x=>x.seat==='sol')&&A.enforcer_log.filter(x=>x.kind==='send_back_apply'&&/^APPLIED/.test(x.item)).length<=1&&A.sb_apply===AM.sb_apply);
 T('flow '+lab+': the alternate chain\'s rows reach the enforcer log',A.enforcer_log_body.p_rows.length===A.enforcer_log.length&&A.enforcer_log.some(x=>x.seat_role==='alternate'&&x.kind==='send_back'));}
// 5. the NOT APPLIED item answered KEEP at the gate is cured, and sol stays seated
{const o=chain(AM,{enforcer:enf,sendback:flows[1][1],gate:g=>g.items.map(i=>'GATE: '+i.gid+' || KEEP || the change stays unapplied.').join('\n')});
 const GB=o['Alt Gate Build'];if(!GB[0].gate_skip){const A=o['Alternate Merge'][0];T('gate KEEP on the NOT APPLIED item: cured, sol stays seated',A.alt_apply[0].unseated===false,JSON.stringify(o['Alt Gate Record'][0].gate_rows.map(x=>x.item+' '+x.cure_status+' '+x.cure_reason.slice(-120))));}
 else console.log('   (no gate item in the CHANGE flow; test 5 not applicable)');}
console.log(ok+' OK '+bad+' FAIL');process.exitCode=bad?1:0;
