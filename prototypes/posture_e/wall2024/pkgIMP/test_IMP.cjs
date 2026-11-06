// pkgIMP test. Run from wall2024/: node pkgIMP/test_IMP.cjs [full]   (full: print every replayed item)
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const rd=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};const FULL=process.argv[2]==='full';
const plan=JSON.parse(rd('pkgIMP/plan_IMP.json'));T(plan.nodes.length+' nodes; base and final shas match',plan.nodes.length===19&&plan.nodes.every(n=>sha(rd(n.base+'/'+n.file))===n.base_sha&&sha(rd('pkgIMP/patched/'+n.file))===n.final_sha));
// Commitment 14 in PART2: byte-identical in the 15 nodes, after Commitment 13
{const blk=f=>{const s=rd('pkgIMP/patched/'+f);const i=s.indexOf('\\n\\n### Commitment 14.');return i<0?null:s.slice(i,s.indexOf('";',i));};const P=plan.nodes.filter(n=>!/Send_Back/.test(n.file)).map(n=>n.file);const b0=blk(P[0]);
 T('Commitment 14 stands after Commitment 13, byte-identical in the 15 PART2 nodes',P.length===15&&b0&&P.every(f=>blk(f)===b0&&rd('pkgIMP/patched/'+f).indexOf('### Commitment 13.')<rd('pkgIMP/patched/'+f).indexOf('### Commitment 14.')));
 const txt=JSON.parse('"'+b0+'"');T('Commitment 14 reads as written (unescaped): the IMPOSED line form and its example sentences',txt.includes('IMPOSED: [<round>] "<the sentence, quoted>" -- asks <verse> to <what it is asked to state> -- NO ROW SETS IT')&&txt.includes('"They do not name the parent"'));}
const IMP=require('./lib_IMP.cjs');
const UND=new Function(rd('pkgUNL/src_UNL.js')+';return UND;')();
const R=run=>{const p0=JSON.parse(rd('corpus/raw/gate_'+run+'.json'))['Panel Build'].slice(-1)[0][0];return UND.rounds(p0.judges[0].body.messages.map(m=>typeof m.content==='string'?m.content:(m.content||[]).map(c=>c&&c.text||'').join('\n')).join('\n'));};
// harvest examples (W3 2627)
const H07=IMP.harvest(R('33107')),H49=IMP.harvest(R('33149'));
T('harvest 33107 [CR3] "They do not name the parent."',H07.some(h=>h.round==='CR3'&&h.sentence==='They do not name the parent.'));
T('harvest 33149 [CR4] "It does not say through whom."',H49.some(h=>h.round==='CR4'&&h.sentence==='It does not say through whom.'));
T('harvest: a quoted verse is not read for the pattern (quotations removed first)',!IMP.harvest({CR2:'Luke 1:34 says "I know not a man" and the verse does say it.'}).length&&IMP.harvest({CR2:'Luke 1:34 does not name the father.'}).length===1);
T('harvest: a sentence with no verse reference within 600 characters is not read',!IMP.harvest({CR2:'The argument does not name a source.'}).length);
T('harvest: the "both retained / compatible / leaves room" forms are not requirements',!IMP.harvest({DR2:'Luke 1:35 leaves room for both. Matthew 1:16 is compatible with it. Both are retained in Luke 2:33.'}).length);
T('harvest: the challenger side is read too',IMP.harvest({DR3:'Matthew 1:20 does not say that no man begat.'}).map(h=>h.side).join()==='CHALLENGER');
// items and cure units
const h={id:'I8',round:'CR3',side:'DEFENDER',sentence:'They do not name the parent.',phrase:'do not name'};
T('items: an unflagged sentence is an E-IMP item',IMP.items('reasoning',[h]).length===1);
T('items: a judge IMPOSED line quoting it removes the item',!IMP.items('IMPOSED: [CR3] "They do not name the parent." -- asks Acts 2:30 to name the parent -- NO ROW SETS IT',[h]).length);
T('items: the IMPOSED line must name the sentence\'s round',IMP.items('IMPOSED: [CR4] "They do not name the parent." -- asks Acts 2:30 to name the parent -- NO ROW SETS IT',[h]).length===1);
{const t='IMPOSED: [CR3] "They do not name the parent." -- asks Acts 2:30 to name the parent -- NO ROW SETS IT\nANSWER CHECK: Acts 2:30 -- [CR3] -- MEANS: "the raising is out of David\'s loins" -- ANSWER: "They do not name the parent." -- MEETS -- "x"';const c=IMP.items(t,[h]);
 T('items: an ANSWER CHECK graded MEETS on an answer the judge flags NO ROW SETS IT is a contradiction item',c.length===1&&c[0].kind==='CONTRADICTION'&&c[0].ref==='Acts 2:30');
 T('items: graded MISSES, no contradiction',!IMP.items(t.replace('-- MEETS --','-- MISSES --'),[h]).length);}
const ctx=require('./lib_IMP.cjs').ctx;const it={imp:{kind:'IMPOSED',id:'I8',round:'CR3',sentence:'They do not name the parent.'}};
for(const [n,a,w] of [['KEEP',{ans:'KEEP'},'UNCURED'],['no answer',{ans:'NO ANSWER'},'UNCURED'],['CHANGE TO a line that is not IMPOSED',{ans:'CHANGE',to:'D5 vs C1: STANDS'},'UNCURED'],
 ['IMPOSED ... NO ROW SETS IT',{ans:'CHANGE',to:'IMPOSED: [CR3] "They do not name the parent." -- asks Acts 2:30 to name the parent -- NO ROW SETS IT'},'CURED'],
 ['IMPOSED with another round',{ans:'CHANGE',to:'IMPOSED: [CR2] "They do not name the parent." -- asks Acts 2:30 to name the parent -- NO ROW SETS IT'},'UNCURED'],
 ['IMPOSED quoting another sentence',{ans:'CHANGE',to:'IMPOSED: [CR3] "The answer names no man." -- asks Luke 1:35 to name a man -- NO ROW SETS IT'},'UNCURED'],
 ['SET BY a counted [L1]',{ans:'CHANGE',to:'IMPOSED: [CR3] "They do not name the parent." -- asks Acts 2:30 to name the parent -- SET BY [L1] Acts 2:30 "of the fruit of his loins, according to the flesh"'},'CURED'],
 ['SET BY words not in the verse',{ans:'CHANGE',to:'IMPOSED: [CR3] "They do not name the parent." -- asks Acts 2:30 to name the parent -- SET BY [L1] Acts 2:30 "the parent is always named"'},'UNCURED'],
 ['SET BY with no [L1]',{ans:'CHANGE',to:'IMPOSED: [CR3] "They do not name the parent." -- asks Acts 2:30 to name the parent -- SET BY the law'},'UNCURED']])
 {const r=IMP.cure(it,a,ctx);T('cure: '+n+': '+r.status,r.status===w,r.why);}
{const ic={imp:{kind:'CONTRADICTION',ref:'Acts 2:30',round:'CR3'}};
 T('cure (contradiction): ANSWER CHECK regraded MISSES cures',IMP.cure(ic,{ans:'CHANGE',to:'ANSWER CHECK: Acts 2:30 -- [CR3] -- MEANS: "m" -- ANSWER: "a" -- MISSES -- "x"'},ctx).status==='CURED');
 T('cure (contradiction): KEEP does not cure',IMP.cure(ic,{ans:'KEEP'},ctx).status==='UNCURED');}
// whole-node replay: Send Back Build on 33107, 33149, 33160 (and the other saved runs)
const {sb,itemsOf}=require('../pkgUNA/replay_UNA.cjs');const k=i=>i.seat+'|'+i.rule+'|'+i.item+'|'+i.line;const REP=[];const LIST=[];
for(const run of ['33040','33060','33083','33107','33129','33149','33160']){const a=itemsOf(sb('pkgMNP/patched/Send_Back_Build.js',run).o),b=itemsOf(sb('pkgIMP/patched/Send_Back_Build.js',run).o);const ka=new Set(a.map(k));
 const nw=b.filter(i=>!ka.has(k(i)));T(run+': every pkgMNP item still sent ('+a.length+'); new items are E-IMP only ('+nw.length+')',a.every(x=>b.some(y=>k(y)===k(x)))&&nw.every(i=>i.rule==='E-IMP'&&i.imp));
 const by={};nw.forEach(i=>by[i.seat]=(by[i.seat]||0)+1);REP.push(run+': '+JSON.stringify(by)+', contradictions '+nw.filter(i=>i.imp.kind==='CONTRADICTION').length+', per-judge total items '+JSON.stringify(b.reduce((o,i)=>(o[i.seat]=(o[i.seat]||0)+1,o),{})));
 if(['33107','33149','33160'].includes(run)||FULL)for(const i of nw)LIST.push(run+' '+i.seat+' '+i.item+' '+String(i.line).slice(0,150));
 if(run==='33107')T('33107: every judge is sent [CR3] "They do not name the parent."',['gemini','chatgpt','sol'].every(s=>nw.some(i=>i.seat===s&&/They do not name the parent\./.test(i.line)))||[...new Set(nw.map(i=>i.seat))].every(s=>nw.some(i=>i.seat===s&&/They do not name the parent\./.test(i.line))));
 if(run==='33149')T('33149: [CR4] "It does not say through whom." is sent',nw.some(i=>/\[CR4\] "It does not say through whom\."/.test(i.line)));}
console.log('  REPLAY (new E-IMP items per run and judge):\n   '+REP.join('\n   '));console.log('  ITEMS (33107, 33149, 33160):\n   '+LIST.join('\n   '));
// Send Back Record, whole node
const L=require('../pkgECL/libload.cjs');const D=L.data();const {I}=require('../pkgPAB/scan_PAB.cjs');const mk=nodes=>n=>{const x=nodes[n];if(!x)return {isExecuted:false,first:()=>{throw new Error(n);},all:()=>{throw new Error(n);}};return {isExecuted:true,first:()=>({json:x[0]}),all:()=>x.map(j=>({json:j}))};};
const recRun=(file,items,reply,bodies)=>{const PASS={bodies};const B=[{sb_skip:false,seat:'chatgpt',api_model:'m',run_token:'r',items,msg:'m'}];
 const nodes={'Judge Enforcer Record':[PASS],'Alt Judge Enforcer Record':[PASS],'Send Back Build':B,'Alt Send Back Build':B,'Panel Cure Check':[{bodies}],'Alt Seated':[{bodies}],'Cited Verses':D.rows,'L2 Words':D.ow,'L2 Lexicon':D.lex};for(const k2 of [1,2,3]){const v=I('33107','Panel_Cure_Normalize_'+k2);if(v)nodes['Panel Cure Normalize '+k2]=v;}
 return new Function('$','$input','$json',rd(file))(mk(nodes),{first:()=>({json:{choices:[{message:{content:reply}}]}}),all:()=>[{json:{choices:[{message:{content:reply}}]}}]},{}).map(x=>x.json)[0];};
const bod=[JSON.stringify({payload:{judge_seat:'chatgpt',drv_uncured:0,verdict_raw:'V'}})];const its=[{sid:'S1',rule:'E-IMP',item:'IMPOSED I8 [CR3]',line:'[CR3] "They do not name the parent."',reason:'IMP',imp:it.imp},{sid:'S2',rule:'E-IMP',item:'IMPOSED I8 [CR3] copy',line:'[CR3] "They do not name the parent."',reason:'IMP',imp:it.imp}];
const reply='SENDBACK: S1 || KEEP || they answer it\nSENDBACK: S2 || CHANGE TO: IMPOSED: [CR3] "They do not name the parent." -- asks Acts 2:30 to name the parent -- NO ROW SETS IT || x';
for(const f of ['Send_Back_Record.js','Alt_Send_Back_Record.js']){let o;try{o=recRun('pkgIMP/patched/'+f,its,reply,bod);}catch(e){T(f+' runs',false,String(e.stack).slice(0,300));continue;}const p=JSON.parse(o.bodies[0]).payload;const r=n=>o.sb_rows.find(x=>x.item===its[n].item);
 T(f+': S1 KEEP UNCURED, counted once (drv_uncured 1, AUDIT v46); S2 IMPOSED NO ROW SETS IT CURED',p.drv_uncured===1&&/AUDIT v46: IMPOSED REQUIREMENT UNCURED \(pkgIMP, Commitment 14\)[^\]]*S1 \(E-IMP/.test(p.verdict_raw)&&!/S2 \(/.test(p.verdict_raw)&&r(0).cure_status==='UNCURED'&&r(1).cure_status==='CURED'&&o.sendback.imp_counted.length===1,p.verdict_raw.split('\n').pop().slice(0,200));}
console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
