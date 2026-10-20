// BB-6904 portion 4 harness: runs the six new Code nodes with stubbed upstream nodes, both branches, and the falsifiers of 6945 AMEND 5.
// Usage: node harness.cjs. Every check prints PASS or FAIL; the last line counts failures.
const fs=require('fs');const src=n=>fs.readFileSync(__dirname+'/'+n+'.js','utf8');
let fails=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fails++;};
function run(file,nodes,input){const $=n=>{const v=nodes[n];if(v===undefined)return {isExecuted:false,first(){throw new Error('not run: '+n);},all(){throw new Error('not run: '+n);},itemMatching(){throw new Error('not run: '+n);}};
  const arr=Array.isArray(v)?v:[v];return {isExecuted:true,first:()=>({json:arr[0]}),all:()=>arr.map(j=>({json:j})),itemMatching:i=>({json:arr[i]})};};
 return new Function('$','$input',src(file))($,{first:()=>({json:input[0]}),all:()=>input.map(j=>({json:j}))}).map(x=>x.json);}
const evalIf=(expr,j)=>new Function('$json','return '+expr.replace(/^=\{\{|\}\}$/g,''))(j);
const ops=JSON.parse(fs.readFileSync(__dirname+'/ops.json','utf8'));const need=n=>ops.nodes_add.find(x=>x.name===n).parameters.conditions.conditions[0].leftValue;
const route=j=>new Function('$json','return '+ops.nodes_add.find(x=>x.name==='Cure Route').parameters.output.replace(/^=\{\{|\}\}$/g,''))(j);
// Real BROKEN lines from live run 27259 (debate_results 56e75954, single judge), as the portion 3 node lists them.
const L4='D4 vs C2 (Luke 1:34-35; Matthew 1:18): DEFENDER LINK BROKEN -- C2’s [L1]/[L2] chain says the “how” is answered by the Spirit and not the husband, while [CR3] answers only the title/no-begetting-verb point and leaves the Spirit-means witness unanswered.';
const L5='D5 vs C2 (Matthew 1:18, 1:25): DEFENDER LINK BROKEN -- C2 shows conception before union and knowing after birth; [CR3] quotes 1:25 but does not answer the timing and never answers 1:18’s “before they came together.”';
const V=[{rule:'K-B',side:'DEFENDER',link:'D4 vs C2',kinds:[],line:L4},{rule:'K-B',side:'DEFENDER',link:'D5 vs C2',kinds:[],line:L5},{rule:'K-G1',side:'DEFENDER',link:'D5 vs C2',line:L5}];
const GOOD='D4 vs C2: DEFENDER LINK BROKEN -- [L1] Luke 1:35 "The Holy Ghost shall come upon thee" answers the "how" of 1:34; [L2] ἐπελεύσεται, the coming-upon word; [CR3] leaves it unanswered.';
const BAD='D5 vs C2: DEFENDER LINK BROKEN -- the timing stands unanswered, as I said; [L4] it follows that Joseph is excluded.';
const base={verdict_tag:'BROKEN',defense_standing:'PROP-DEPENDENT',conceded_links:0,independent_verdict_raw:'JUDGE TEXT\n\n[AUDIT v21: ...]',debate_rule_violations:V};
const B={jidx:0,judge_model:'deepseek-flash',verdictBody:{model:'deepseek-flash',max_tokens:65536,messages:[{role:'system',content:'S'},{role:'user',content:'U'}]}};
const VN={choices:[{message:{content:'JUDGE TEXT'},finish_reason:'stop'}]};
console.log('# SINGLE JUDGE');
ok(evalIf(need('Cure Needed?'),base)===true,'Cure Needed? true when K-B violations exist');
const cb=run('Cure_Build',{'Build Independent Verdict':B,'Verdict Normalizer':VN},[base]);
ok(cb.length===1&&cb[0].cure.items.length===2&&cb[0].cure.fam==='deepseek','Cure Build: one request, the two K-B lines, family deepseek');
const msgs=cb[0].cure.body.messages;ok(msgs.length===4&&msgs[2].role==='assistant'&&msgs[2].content==='JUDGE TEXT'&&msgs[3].content.includes('FLAGGED LINES:')&&msgs[3].content.includes('D4 vs C2:'),'Cure body: the judge\'s own conversation, its answer, then the cure request naming each flagged line');
ok(route(cb[0])===0,'Cure Route: deepseek to output 0');
const reply={choices:[{message:{content:GOOD+'\n'+BAD},finish_reason:'stop'}]};
const cn=run('Cure_Normalize',{'Cure Build':cb},[reply]);ok(cn.length===1&&cn[0].reply.ok&&cn[0].cure.items.length===2,'Cure Normalize: reply read, request paired');
const ck=run('Cure_Check',{'Extract Independent Verdict':base,'Cure Normalize':cn},[cn[0]]);const r=ck[0].debate_rule_report;
ok(r.find(x=>x.link==='D4 vs C2'&&x.rule==='K-B').status==='CURED','WRONG-IF LIMB 3 known-good: two kinds ([L1] quoted, [L2] Greek script) -> CURED');
ok(r.find(x=>x.link==='D5 vs C2'&&x.rule==='K-B').status==='UNCURED','WRONG-IF LIMB 3 known-bad: no lower layer, an [L4] -> UNCURED');
ok(r.find(x=>x.rule==='K-G1').status==='UNCURED'&&/awaits the advisor ruling/.test(r.find(x=>x.rule==='K-G1').why),'K-G1: UNCURED, cure test pending the ruling on 6945 AMEND 4');
ok(ck[0].verdict_tag==='BROKEN'&&ck[0].defense_standing==='PROP-DEPENDENT'&&ck[0].conceded_links===0,'No grade or count changes (portion 5 is the operator\'s)');
ok(ck[0].independent_verdict_raw.startsWith(base.independent_verdict_raw)&&(ck[0].independent_verdict_raw.match(/DEBATE RULE VIOLATION REPORT/g)||[]).length===3&&!/REPORT[^\]]*REVIEW THIS ROW/.test(ck[0].independent_verdict_raw),'Report: three lines appended after the existing text, none counted as a new flag');
// failed call
const cnf=run('Cure_Normalize',{'Cure Build':cb},[{error:{message:'timeout of 900000ms exceeded'}}]);
const ckf=run('Cure_Check',{'Extract Independent Verdict':base,'Cure Normalize':cnf},[cnf[0]]);
ok(ckf[0].debate_rule_report.filter(x=>x.rule==='K-B').every(x=>x.status==='UNCURED'&&/cure call failed: error: timeout/.test(x.why)),'Failed call: every line UNCURED with the failure named; no throw');
// gemini envelope
const cng=run('Cure_Normalize',{'Cure Build':cb},[{candidates:[{content:{parts:[{text:GOOD}]},finishReason:'STOP'}]}]);ok(cng[0].reply.ok&&cng[0].reply.text===GOOD,'Gemini envelope read');
const gb=run('Cure_Build',{'Build Independent Verdict':{...B,jidx:2,verdictBody:{contents:[{role:'user',parts:[{text:'U'}]}]}},'Verdict Normalizer':VN},[base]);
ok(gb[0].cure.fam==='gemini'&&gb[0].cure.body.contents.length===3&&gb[0].cure.body.contents[1].role==='model','Gemini body: model turn then user turn');
// no-cure branch
const clean={...base,debate_rule_violations:[]};ok(evalIf(need('Cure Needed?'),clean)===false,'Cure Needed? false on a clean judgment');
const ck0=run('Cure_Check',{'Extract Independent Verdict':clean},[clean]);ok(ck0.length===1&&ck0[0].independent_verdict_raw===clean.independent_verdict_raw&&ck0[0].debate_rule_report.length===0,'AMEND 1 no-cure path: Cure Check passes the item unchanged, empty report');
const kg={...base,debate_rule_violations:[V[2]]};ok(evalIf(need('Cure Needed?'),kg)===false,'Only K-G1: no call (cure test pending)');
const ckg=run('Cure_Check',{'Extract Independent Verdict':kg},[kg]);ok(ckg[0].debate_rule_report.length===1&&ckg[0].debate_rule_report[0].status==='UNCURED','Only K-G1: reported UNCURED, pending');
console.log('# PANEL');
const mk=(seat,text,drv)=>({json:JSON.stringify({payload:{judge_seat:seat,verdict_raw:text+'\n\n[AUDIT v21: x. REVIEW THIS ROW.]',verdict_tag:'BROKEN'}}),drv});
const S=[['deepseek','{"reasoning":"DS"}',V.slice(0,2)],['gemini','{"reasoning":"GE"}',[{rule:'K-B',side:'DEFENDER',link:'D1 vs C5',kinds:[],line:'D1 vs C5 (Hebrews 10:5): DEFENDER LINK BROKEN -- Defender left Hebrews 10:5 unanswered in [CR3].'}]],['grok','{"reasoning":"GR"}',[{rule:'K-G3',side:'DEFENDER',link:null,line:null}]]];
const PP={run_token:'t',debate_id:'d',bodies:S.map(([s,t,d])=>mk(s,t,d).json),summary:S.map(([s,t,d])=>({seat:s,drv:d,substitute:false})),substitution:null,panel_effective:['deepseek','gemini','grok']};
const P={judges:[{seat:'deepseek',fam:'deepseek',api_model:'ds',body:{messages:[{role:'system',content:'S'},{role:'user',content:'U'}]}},{seat:'gemini',fam:'gemini',api_model:'gm',body:{contents:[{role:'user',parts:[{text:'U'}]}]}},{seat:'grok',fam:'grok',api_model:'gk',body:{messages:[]}}]};
ok(evalIf(need('Panel Cure Needed?'),PP)===true,'Panel Cure Needed? true');
const pb=run('Panel_Cure_Build',{'Panel Build':P},[PP]);ok(pb.length===2&&pb[0].cure.seat==='deepseek'&&pb[1].cure.seat==='gemini'&&pb[1].cure.jidx===2,'Panel Cure Build: one request per seat with K-B lines (grok has K-G3 only: none)');
ok(pb[0].cure.body.messages[2].content==='{"reasoning":"DS"}','Panel answer: the judge text before the audit lines');
const pn=run('Panel_Cure_Normalize',{'Panel Cure Build':pb},[{choices:[{message:{content:GOOD+'\n'+'D5 vs C2: '+'[L1] Matthew 1:18 "before they came together" [L3] Matthew 1:25 names the bound.'}}]},{error:'503'}]);
const pc=run('Panel_Cure_Check',{'Panel Payloads':PP,'Panel Cure Normalize':pn},[pn[0]]);
ok(pc.length===1&&pc[0].bodies.length===3,'AMEND 2: exactly one item, three bodies');
const st=s=>pc[0].summary.find(x=>x.seat===s).cure;
ok(st('deepseek').every(x=>x.status==='CURED'),'One seat cured (deepseek, both lines restated with two kinds)');
ok(st('gemini')[0].status==='UNCURED'&&/cure call failed/.test(st('gemini')[0].why),'Beside it a seat not cured: the failed call (gemini)');
ok(st('grok')[0].status==='UNCURED'&&/awaits the advisor ruling/.test(st('grok')[0].why),'grok K-G3: UNCURED, pending');
ok(pc[0].bodies.every((b,i)=>JSON.parse(b).payload.verdict_raw.startsWith(JSON.parse(PP.bodies[i]).payload.verdict_raw)),'Each body only gains report lines at its end');
ok(pc[0].debate_id===PP.debate_id&&pc[0].substitution===PP.substitution&&JSON.stringify(pc[0].panel_effective)===JSON.stringify(PP.panel_effective),'Other fields of the Panel Payloads item unchanged');
const PP0={...PP,summary:PP.summary.map(s=>({...s,drv:[]}))};ok(evalIf(need('Panel Cure Needed?'),PP0)===false,'Panel Cure Needed? false with no violation');
const pc0=run('Panel_Cure_Check',{'Panel Payloads':PP0},[PP0]);ok(pc0.length===1&&JSON.stringify(pc0[0].bodies)===JSON.stringify(PP0.bodies),'AMEND 1 panel no-cure path: item passes unchanged');
const pbs=run('Panel_Cure_Build',{'Panel Build':{judges:[]}},[PP]);ok(pbs.every(x=>x.cure.skip)&&route(pbs[0])===6,'Seat with no request body: skip item, routed to output 6, straight to Normalize');
console.log('failures',fails);
