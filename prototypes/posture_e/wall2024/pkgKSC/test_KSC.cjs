// pkgKSC test. Run from wall2024/ after build_KSC.cjs: node pkgKSC/test_KSC.cjs
// data/verdict_lines.json: the KEYSTONE and CONCEDED LINKS lines of every stored verdict since 2026-10-28 (debate_judgments and the single
// judge's independent_verdict_raw), read by SQL 2026-11-06.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const rd=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(rd('pkgKSC/plan_KSC.json'));const F=n=>n.replace(/ /g,'_')+'.js';
T(plan.nodes.length+' nodes; base and final shas match the files',plan.nodes.length===26&&plan.nodes.every(p=>sha(rd('pkgKSC/base/'+F(p.node)))===p.base_sha&&sha(rd('pkgKSC/patched/'+F(p.node)))===p.final_sha));
const KSC=new Function(rd('pkgKSC/src_KSC.js')+';return KSC;')();
// Commitment 15
{const P=plan.nodes.filter(p=>p.edits===1&&!/Gate|Merge/.test(p.node)).map(p=>F(p.node));const blk=f=>{const s=rd('pkgKSC/patched/'+f);const i=s.indexOf('\\n\\n### Commitment 15.');return i<0?null:s.slice(i,s.indexOf('\\n\\nA sentence the system marks VOID',i));};const b0=blk(P[0]);
 T('Commitment 15 stands after Commitment 14 and before the pkgBAR VOID sentence, byte-identical in the 15 PART2 nodes',P.length===15&&b0&&P.every(f=>{const s=rd('pkgKSC/patched/'+f);return blk(f)===b0&&s.indexOf('### Commitment 14.')<s.indexOf('### Commitment 15.');}));
 const txt=JSON.parse('"'+b0+'"');T('Commitment 15 reads as written: the rule, both cures, KEEP does not cure',txt.includes('I do not grade KEYSTONE: D<n> STANDS while my own CONCEDED LINKS line counts LINK <n> UNEXHIBITED, CONCEDED or WITHDRAWN')&&txt.includes('my KEYSTONE line grades D<n> WITHDRAWN or BROKEN')&&txt.includes('a KEEP does not cure the item'));}
// the stored verdicts
const D=JSON.parse(rd('pkgKSC/data/verdict_lines.json'));const hits=D.flatMap(r=>KSC.items(r.lines).map(k=>r.run.slice(5,10)+' '+r.seat+' D'+k.n+' '+k.tag));
const EXP=['29519 deepseek D6 CONCEDED','29609 grok D6 UNEXHIBITED','29955 gemini D6 CONCEDED','32194 glm D6 CONCEDED','32194 single D6 CONCEDED','32212 single D6 UNEXHIBITED','32228 chatgpt D6 CONCEDED','32293 single D6 CONCEDED','32302 glm D6 UNEXHIBITED','32725 chatgpt D6 UNEXHIBITED','32905 grok D6 CONCEDED','32924 chatgpt D5 UNEXHIBITED','32924 grok D5 UNEXHIBITED','32936 single D6 UNEXHIBITED','32998 grok D6 UNEXHIBITED','33014 sol D6 UNEXHIBITED','33021 gemini D5 UNEXHIBITED','33055 single D6 UNEXHIBITED','33129 chatgpt D6 CONCEDED','33129 gemini D6 CONCEDED','33160 chatgpt D6 CONCEDED','33160 single D6 CONCEDED','33160 sol D6 CONCEDED','33175 single D6 UNEXHIBITED'];
T(D.length+' stored verdicts read; '+hits.length+' have KEYSTONE Dn STANDS with LINK n counted (each checked by hand in the line)',D.length===260&&JSON.stringify(hits)===JSON.stringify(EXP),hits.join('; '));
T('33175 single judge (builder feedback 4): D6 STANDS on LINK 6 UNEXHIBITED',hits.includes('33175 single D6 UNEXHIBITED'));
// item units
const V=(k,c,x)=>'COLLISION POINTS:\nD6 vs C6 (Romans 1:3): UNDERDETERMINED -- x\n'+(k||'KEYSTONE: D6 -- STANDS -- the chain holds')+'\n'+(c||'CONCEDED LINKS: 1 -- LINK 6: UNEXHIBITED (ASSUMES: Mary is of the house of David)')+'\n'+(x||'')+'RESULT: UNDERDETERMINED';
T('items: STANDS with LINK 6 counted is one item',KSC.items(V()).length===1&&KSC.items(V())[0].n===6&&KSC.items(V())[0].tag==='UNEXHIBITED');
T('items: BROKEN or WITHDRAWN keystone, no item',!KSC.items(V('KEYSTONE: D6 -- WITHDRAWN -- conceded')).length&&!KSC.items(V('KEYSTONE: D6 -- BROKEN -- at D6 vs C6')).length);
T('items: another link counted, no item',!KSC.items(V(null,'CONCEDED LINKS: 1 -- LINK 5: UNEXHIBITED (x); Spared: LINK 6')).length);
T('items: "Premise 6 SUPPORTED (... not CONCEDED)" is not a count of premise 6',!KSC.items(V(null,'CONCEDED LINKS: 0 -- Premise 6 SUPPORTED (Luke 1:35; the defender CONCEDED nothing here)')).length);
T('items: the CHALLENGER CONCEDED LINKS line is not read',!KSC.items(V(null,'CONCEDED LINKS: 0 -- none\nCHALLENGER CONCEDED LINKS: 1 -- Premise 6: UNEXHIBITED')).length);
T('items: an AUDIT line is not read',!KSC.items(V(null,'CONCEDED LINKS: 0 -- none','[AUDIT v21: CONCEDED LINKS: 1 -- LINK 6: CONCEDED]\n')).length);
T('items: the bare-number form "-- 4 UNEXHIBITED: ...; 6 CONCEDED (stated)" (33129 chatgpt) is read; the count after CONCEDED LINKS: is not',KSC.items(V(null,'CONCEDED LINKS: 2 -- 4 UNEXHIBITED: x; 6 CONCEDED (stated): y')).length===1&&!KSC.items(V(null,'CONCEDED LINKS: 6 -- none counted here')).length);
T('items: markdown and bullets are read through',KSC.items(V('- **KEYSTONE:** D6 -- STANDS -- x','**CONCEDED LINKS:** 1 -- Premise 6: CONCEDED (stated)')).length===1);
// cure units
const it={ksc:{n:6,tag:'UNEXHIBITED'}};
for(const [n,a,w] of [['KEEP',{ans:'KEEP'},'UNCURED'],['no answer',{ans:'NO ANSWER'},'UNCURED'],['KEYSTONE D6 WITHDRAWN',{ans:'CHANGE',to:'KEYSTONE: D6 -- WITHDRAWN -- LINK 6 is unexhibited'},'CURED'],
 ['KEYSTONE D6 BROKEN',{ans:'CHANGE',to:'KEYSTONE: D6 -- BROKEN -- graded at D6 vs C6'},'CURED'],['KEYSTONE D6 still STANDS',{ans:'CHANGE',to:'KEYSTONE: D6 -- STANDS -- the chain holds on Romans 1:3'},'UNCURED'],
 ['KEYSTONE naming D5',{ans:'CHANGE',to:'KEYSTONE: D5 -- WITHDRAWN -- x'},'UNCURED'],['CONCEDED LINKS no longer counting LINK 6',{ans:'CHANGE',to:'CONCEDED LINKS: 1 -- LINK 1: UNEXHIBITED (x). Spared: LINK 2 to LINK 6; LINK 6 stands without it because [L1] Romans 1:3 "made of the seed of David according to the flesh"'},'CURED'],
 ['CONCEDED LINKS still counting LINK 6',{ans:'CHANGE',to:'CONCEDED LINKS: 2 -- LINK 1: UNEXHIBITED; LINK 6: UNEXHIBITED'},'UNCURED'],['a collision line',{ans:'CHANGE',to:'D6 vs C6 (Romans 1:3): DEFENDER LINK BROKEN -- x'},'UNCURED']])
 {const r=KSC.cure(it,a);T('cure: '+n+': '+r.status,r.status===w,r.why);}
// whole-node replay: Send Back Build on the saved runs
const {sb,itemsOf}=require('../pkgUNA/replay_UNA.cjs');const k=i=>i.seat+'|'+i.rule+'|'+i.item+'|'+i.line;const REP=[];
for(const run of ['33040','33060','33083','33107','33129','33149','33160']){const a=itemsOf(sb('pkgKSC/base/Send_Back_Build.js',run).o),b=itemsOf(sb('pkgKSC/patched/Send_Back_Build.js',run).o);const ka=new Set(a.map(k));
 const nw=b.filter(i=>!ka.has(k(i)));T(run+': every item still sent ('+a.length+'); new items are E-KSC only ('+nw.length+')',a.every(x=>b.some(y=>k(y)===k(x)))&&nw.every(i=>i.rule==='E-KSC'&&i.ksc));
 REP.push(run+': '+(nw.map(i=>i.seat+' '+i.item).join(', ')||'none'));
 if(run==='33129')T('33129: chatgpt is sent E-KSC (its cure-check verdict: "-- 4 UNEXHIBITED ...; 6 CONCEDED (stated)")',nw.some(i=>i.seat==='chatgpt'&&i.ksc.n===6&&i.ksc.tag==='CONCEDED'));
 if(run==='33160')T('33160: chatgpt and sol are sent E-KSC (D6 STANDS, Premise 6 CONCEDED), gemini is not',['chatgpt','sol'].every(s=>nw.some(i=>i.seat===s&&i.ksc.n===6&&i.ksc.tag==='CONCEDED'))&&!nw.some(i=>i.seat==='gemini'));
 if(run==='33160'){const i=nw.find(x=>x.seat==='chatgpt');const o=sb('pkgKSC/patched/Send_Back_Build.js',run).o.find(x=>x.seat==='chatgpt');T('33160 chatgpt: the send-back message carries the rule and both cures',o&&/THE KEYSTONE CONSISTENCY RULE \(E-KSC, ENFORCED, pkgKSC; Commitment 15\)/.test(o.msg)&&/a KEYSTONE line for D6 graded WITHDRAWN or BROKEN/.test(o.msg)&&/CONCEDED LINKS line no longer counting LINK 6/.test(o.msg),i&&i.line);}}
console.log('  REPLAY (new E-KSC items):\n   '+REP.join('\n   '));
// Send Back Record, whole node
const L=require('../pkgECL/libload.cjs');const DD=L.data();const {I}=require('../pkgPAB/scan_PAB.cjs');const mk=nodes=>n=>{const x=nodes[n];if(!x)return {isExecuted:false,first:()=>{throw new Error(n);},all:()=>{throw new Error(n);}};return {isExecuted:true,first:()=>({json:x[0]}),all:()=>x.map(j=>({json:j}))};};
const recRun=(file,items,reply,bodies)=>{const PASS={bodies};const B=[{sb_skip:false,seat:'chatgpt',api_model:'m',run_token:'r',items,msg:'m'}];
 const nodes={'Judge Enforcer Record':[PASS],'Alt Judge Enforcer Record':[PASS],'Send Back Build':B,'Alt Send Back Build':B,'Panel Cure Check':[{bodies}],'Alt Seated':[{bodies}],'Cited Verses':DD.rows,'L2 Words':DD.ow,'L2 Lexicon':DD.lex};for(const k2 of [1,2,3]){const v=I('33107','Panel_Cure_Normalize_'+k2);if(v)nodes['Panel Cure Normalize '+k2]=v;}
 return new Function('$','$input','$json',rd(file))(mk(nodes),{first:()=>({json:{choices:[{message:{content:reply}}]}}),all:()=>[{json:{choices:[{message:{content:reply}}]}}]},{}).map(x=>x.json)[0];};
const bod=[JSON.stringify({payload:{judge_seat:'chatgpt',drv_uncured:0,verdict_raw:'V'}})];const KL='KEYSTONE: D6 -- STANDS -- the chain holds';
const its=[{sid:'S1',rule:'E-KSC',item:'KEYSTONE D6 on LINK 6 UNEXHIBITED',line:KL,reason:'KSC',ksc:{n:6,tag:'UNEXHIBITED'}},{sid:'S2',rule:'E-KSC',item:'KEYSTONE D6 on LINK 6 UNEXHIBITED copy',line:KL,reason:'KSC',ksc:{n:6,tag:'UNEXHIBITED'}},{sid:'S3',rule:'E-KSC',item:'KEYSTONE D6 on LINK 6 UNEXHIBITED third',line:KL,reason:'KSC',ksc:{n:6,tag:'UNEXHIBITED'}}];
const reply='SENDBACK: S1 || KEEP || it stands\nSENDBACK: S2 || CHANGE TO: KEYSTONE: D6 -- WITHDRAWN -- LINK 6 is unexhibited || x\nSENDBACK: S3 || CHANGE TO: CONCEDED LINKS: 1 -- LINK 1: UNEXHIBITED (x) || y';
for(const f of ['Send_Back_Record.js','Alt_Send_Back_Record.js']){let o;try{o=recRun('pkgKSC/patched/'+f,its,reply,bod);}catch(e){T(f+' runs',false,String(e.stack).slice(0,300));continue;}const p=JSON.parse(o.bodies[0]).payload;const r=n=>o.sb_rows.find(x=>x.item===its[n].item);
 T(f+': S1 KEEP UNCURED, counted once (drv_uncured 1, AUDIT v48); S2 KEYSTONE WITHDRAWN and S3 CONCEDED LINKS without LINK 6 CURED',p.drv_uncured===1&&/AUDIT v48: KEYSTONE CONSISTENCY UNCURED \(pkgKSC, Commitment 15\)[^\]]*S1 \(E-KSC/.test(p.verdict_raw)&&!/S2 \(|S3 \(/.test(p.verdict_raw)&&r(0).cure_status==='UNCURED'&&r(1).cure_status==='CURED'&&r(2).cure_status==='CURED'&&o.sendback.ksc_counted.length===1,p.verdict_raw.split('\n').pop().slice(0,220));}
// sbApply: the change goes over the line with its label
{const lib=p=>{const AM=rd(p);return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {sbApply2024};')(()=>{throw 0},null);};
 const O=lib('pkgKSC/base/Alternate_Merge.js'),N=lib('pkgKSC/patched/Alternate_Merge.js');const raw=V();const F0={verdict_tag:'HELD',defense_standing:'PROP-DEPENDENT',conceded_links:1,challenge_standing:'PROP-DEPENDENT',challenger_conceded_links:0};
 const TO='CONCEDED LINKS: 0 -- Spared: LINK 1 to LINK 6; LINK 6 stands without it because [L1] Romans 1:3 "made of the seed of David according to the flesh"';
 const g=(to,rule)=>({sid:'S1',rule:rule||'E-KSC',item:'KEYSTONE D6 on LINK 6 UNEXHIBITED',line:'KEYSTONE: D6 -- STANDS -- the chain holds',ans:'CHANGE',to});
 const txt=R=>R&&R.text?R.text:(R&&R.raw)||JSON.stringify(R);const n1=N.sbApply2024('chatgpt',raw,F0,[g(TO)],null),o1=O.sbApply2024('chatgpt',raw,F0,[g(TO)],null);const t1=txt(n1),u1=txt(o1);
 T('sbApply: an E-KSC CONCEDED LINKS change replaces the CONCEDED LINKS line and keeps the KEYSTONE line (the base overwrote the KEYSTONE line)',t1.includes('CONCEDED LINKS: 0 -- Spared')&&t1.includes('KEYSTONE: D6 -- STANDS')&&!t1.includes('LINK 6: UNEXHIBITED (ASSUMES')&&!u1.includes('KEYSTONE: D6 -- STANDS'),t1.slice(0,400));
 const n2=txt(N.sbApply2024('chatgpt',raw,F0,[g('KEYSTONE: D6 -- WITHDRAWN -- LINK 6 is unexhibited')],null));
 T('sbApply: an E-KSC KEYSTONE change replaces the KEYSTONE line',n2.includes('KEYSTONE: D6 -- WITHDRAWN')&&!n2.includes('KEYSTONE: D6 -- STANDS')&&n2.includes('LINK 6: UNEXHIBITED'));
 T('sbApply: another rule with the same change is applied as before (unchanged)',JSON.stringify(N.sbApply2024('chatgpt',raw,F0,[g(TO,'E-GATE')],null))===JSON.stringify(O.sbApply2024('chatgpt',raw,F0,[g(TO,'E-GATE')],null)));
 const fn=s=>{const i=s.indexOf('function sbApply2024');return s.slice(i,s.indexOf("why:'the flagged line is not in the judge text',to});continue;}",i));};
 T('sbApply2024 is the same in all 6 patched nodes',new Set(['Gate_Build','Gate_Record','Alt_Gate_Build','Alt_Gate_Record','Alternate_Merge','Alternate_Merge_Seat'].map(f=>sha(fn(rd('pkgKSC/patched/'+f+'.js'))))).size===1);}
// the single judge: a review line, record-only
{const s=rd('pkgKSC/patched/Extract_Independent_Verdict.js');const i=s.indexOf('/* pkgKSC (W3 2665): the single judge');const sn=s.slice(s.indexOf('\n',i)+1,s.indexOf('catch(e){}\n',i)+10);
 const runEIV=r=>new Function('raw',rd('pkgKSC/src_KSC.js')+'\n'+sn+'\nreturn raw;')(r);const r1=runEIV(V()+'\n[AUDIT v21: x]');
 T('single judge: one AUDIT v48 review line, record-only',(r1.match(/\[AUDIT v48: SINGLE JUDGE \(second opinion\): KEYSTONE CONSISTENCY \(E-KSC, Commitment 15; record-only/g)||[]).length===1&&/KEYSTONE D6 STANDS while CONCEDED LINKS counts LINK 6 UNEXHIBITED/.test(r1));
 const t75=D.find(r=>r.run.includes('33175')&&r.seat==='single').lines;T('single judge 33175: the review line is written',/AUDIT v48/.test(runEIV(t75)));
 T('single judge: no line when consistent',!/AUDIT v48/.test(runEIV(V('KEYSTONE: D6 -- WITHDRAWN -- x'))));}
console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
