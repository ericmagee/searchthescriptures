// pkgPAB test. Run from wall2024/: node pkgPAB/test_PAB.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};const rd=f=>fs.readFileSync(f,'utf8');
const plan=JSON.parse(rd('pkgPAB/plan_PAB.json'));
T('4 nodes; base (pkgABW/patched) and final shas match',plan.nodes.length===4&&plan.nodes.every(n=>sha(rd('pkgABW/patched/'+n.file))===n.base_sha&&sha(rd('pkgPAB/patched/'+n.file))===n.final_sha));
T('every node carries src_PAB.js byte for byte, after the ABS module',plan.nodes.every(n=>{const s=rd('pkgPAB/patched/'+n.file);const i=s.indexOf(rd('pkgPAB/src_PAB.js'));return i>s.indexOf('const ABS=(()=>{')&&s.indexOf('const ABS=(()=>{')>=0;}));
const {PAB,I}=require('./scan_PAB.cjs');
// (1) units
const P=PAB.parts('the row names the birth as the bound and does not name the taking');T('parts: "X and does not name Y" splits: the positive part is X',P.absence[0]==='does not name the taking'&&P.positive==='the row names the birth as the bound',JSON.stringify(P));
const P0=PAB.parts('Jeremiah 22:30 states no such condition');T('parts: an all-absence MEANS has no positive part',P0.absence.length===1&&P0.positive==='',JSON.stringify(P0));
const P4=PAB.parts('Joseph and Mary came together');T('parts: a plain "and" does not split',P4.absence.length===0&&P4.positive==='Joseph and Mary came together',JSON.stringify(P4));
const P2=PAB.parts('that rule is conditional on turning, and Jeremiah 22:30 states no such condition.');T('parts: "conditional on turning" is positive, "states no such condition" is absence',P2.positive==='that rule is conditional on turning'&&P2.absence.length===1,JSON.stringify(P2));
const P3=PAB.parts('Joseph is called her husband; the marriage was already made');T('parts: a MEANS with no absence clause raises nothing',P3.absence.length===0);
const ch=PAB.charges('CHALLENGER CONCEDED LINKS: Premise 6 CONCEDED (Commitment 5) -- Jeremiah 18:8 left unanswered; Premise 2 STANDS.\nD2 vs C1 (Matthew 1:20): DEFENDER LINK BROKEN -- the press was not answered -- GROUND: [L1] Matthew 1:20 "fear not"');
T('charges: a CONCEDED (Commitment 5) clause and an unanswered BREAK line are read; a STANDS clause is not',ch.length===2&&ch[0].kind==='CONCESSION'&&ch[0].refs[0]==='Jeremiah 18:8'&&ch[1].kind==='BREAK'&&ch[1].refs.length===1,JSON.stringify(ch.map(c=>[c.kind,c.label,c.refs])));
const it={pab:{ref:'Jeremiah 18:8',positive:'that rule is conditional on turning'}},it0={pab:{ref:'Matthew 1:25',positive:''}};
const cu=[['KEEP with no quote',it,{ans:'KEEP',why:'the challenger never answered it'},'UNCURED'],
 ['KEEP quoting the positive part',it,{ans:'KEEP',why:'The press "that rule is conditional on turning" was never met by [CR4].'},'CURED'],
 ['KEEP quoting only 5 words of it',it,{ans:'KEEP',why:'"rule is conditional on turning" was not met'},'UNCURED'],
 ['CHANGE TO: RETRACTED',it,{ans:'CHANGE',to:'RETRACTED: premise 6',why:'x'},'CURED'],
 ['CHANGE TO a line still charging Jeremiah 18:8 unanswered',it,{ans:'CHANGE',to:'Premise 6 CONCEDED (Commitment 5): Jeremiah 18:8 unanswered',why:'x'},'UNCURED'],
 ['CHANGE TO a regrade that no longer charges it',it,{ans:'CHANGE',to:'Premise 6 STANDS: [CR4] answers Jeremiah 18:8',why:'x'},'CURED'],
 ['no answer',it,{ans:'NO ANSWER'},'UNCURED'],
 ['no positive part: KEEP quoting anything',it0,{ans:'KEEP',why:'the row names the birth as the bound'},'UNCURED'],
 ['no positive part: RETRACTED',it0,{ans:'CHANGE',to:'RETRACTED',why:'x'},'CURED']];
cu.forEach(([n,i,a,w])=>{const r=PAB.cure(i,a);T('cure: '+n+': '+r.status,r.status===w,r.why);});
// (2) scan replay over the corpus (rounds from Panel Cure Normalize): every raise listed
const RUNS=['33040','33060','33083','33107','33129','33149'];const RAISES=[];
const roundsOf=run=>{for(const k of [1,2,3]){const v=I(run,'Panel_Cure_Normalize_'+k);if(v&&v[0].cure&&v[0].cure.rounds)return v[0].cure.rounds;}return null;};
for(const run of RUNS){const R=roundsOf(run);const pcc=I(run,'Panel_Cure_Check');if(!R||!pcc){T(run+': inputs read',false);continue;}
 for(const b of pcc[0].bodies){const p=(typeof b==='string'?JSON.parse(b):b).payload;const t=String(p.verdict_raw).replace(/\\n/g,'\n').replace(/\\"/g,'"').split('\n').filter(l=>!/^\s*\[AUDIT\b/.test(l)).join('\n');
  for(const x of PAB.check(t,R))RAISES.push(run+' '+p.judge_seat+': '+x.kind+' '+x.label+' on '+x.ref+' ['+x.round+'] positive="'+x.positive+'"');}}
console.log('  REPLAY raises:\n   '+RAISES.join('\n   '));
T('replay: exactly 2 raises, 33107 gemini premise 2 on Matthew 1:25 and 33149 gemini premise 6 on Jeremiah 18:8',RAISES.length===2&&/^33107 gemini: CONCESSION premise 2 \(challenger\) on Matthew 1:25 .*positive="the row names the birth as the bound"$/.test(RAISES[0])&&/^33149 gemini: CONCESSION premise 6 \(challenger\) on Jeremiah 18:8 .*positive="that rule is conditional on turning"$/.test(RAISES[1]));
// (3) Send Back Build, whole node: E-PAB items sent on 33107 and 33149; every other item unchanged against pkgABW
const L=require('../pkgECL/libload.cjs');const keysOf=require('../pkgECL/keys.cjs');const ctxOf=run=>{try{return L.data(keysOf(run).keys);}catch(e){return L.data();}};
const mk=nodes=>n=>{const it=nodes[n];if(!it)return {isExecuted:false,first:()=>{throw new Error(n);},all:()=>{throw new Error(n);}};return {isExecuted:true,first:()=>({json:it[0]}),all:()=>it.map(j=>({json:j}))};};
const sb=(f,run)=>{const G=JSON.parse(rd('corpus/raw/gate_'+run+'.json'));const g=G['Gate Record'].slice(-1)[0][0];const ctx=ctxOf(run);
 const nodes={'Panel Build':G['Panel Build'].slice(-1)[0],'Panel Cure Check':I(run,'Panel_Cure_Check'),'Enforcer Record':[{enf421_rows:g.enf421_rows||[]}],'Judge Enforcer Build':I(run,'Judge_Enforcer_Build')||[],'Cited Verses':ctx.rows,'L2 Words':ctx.ow,'L2 Lexicon':ctx.lex};
 const PASS={enf428_rows:g.enf428_rows||[],bodies:nodes['Panel Cure Check'][0].bodies};
 return new Function('$','$input','$json',rd(f))(mk(nodes),{first:()=>({json:PASS}),all:()=>[{json:PASS}]},PASS).map(x=>x.json);};
const itemsOf=o=>o.filter(x=>!x.sb_skip&&x.items).flatMap(x=>x.items.map(i=>({seat:x.seat,...i})));const msgOf=(o,seat)=>(o.find(x=>x.seat===seat)||{}).msg||'';
for(const run of RUNS){if(!fs.existsSync('corpus/raw/gate_'+run+'.json')){console.log('  '+run+': no corpus/raw gate file; Send Back Build not replayed');continue;}let a,b;
 try{a=sb('pkgABW/patched/Send_Back_Build.js',run);b=sb('pkgPAB/patched/Send_Back_Build.js',run);}catch(e){T(run+' Send Back Build runs',false,String(e.stack).slice(0,300));continue;}
 const ia=itemsOf(a),ib=itemsOf(b);const pb=ib.filter(i=>i.rule==='E-PAB');const ob=ib.filter(i=>i.rule!=='E-PAB');
 console.log('  == '+run+': items pkgABW '+ia.length+' -> pkgPAB '+ib.length+'; E-PAB ['+pb.map(i=>i.seat+' '+i.sid+' '+i.item).join('; ')+']');
 T(run+': every pkgABW item is sent unchanged',ia.length===ob.length&&ia.every(x=>ob.some(y=>y.seat===x.seat&&y.rule===x.rule&&y.item===x.item&&y.line===x.line)));
 const want=run==='33107'?['gemini CONCESSION premise 2 (challenger) on Matthew 1:25']:run==='33149'?['gemini CONCESSION premise 6 (challenger) on Jeremiah 18:8']:[];
 T(run+': E-PAB items are '+JSON.stringify(want),JSON.stringify(pb.map(i=>i.seat+' '+i.item))===JSON.stringify(want));
 if(pb.length)T(run+': the gemini send-back states the press absence rule and its cure',/THE PRESS ABSENCE RULE \(E-PAB, ENFORCED, pkgPAB/.test(msgOf(b,'gemini'))&&/CHANGE TO: RETRACTED/.test(msgOf(b,'gemini'))&&(run==='33149'?/"that rule is conditional on turning"/.test(msgOf(b,'gemini')):/"the row names the birth as the bound"/.test(msgOf(b,'gemini'))));}
// (4) Send Back Record, whole node
const D=ctxOf('33149');const recRun=(file,items,reply,bodies)=>{const PASS={bodies};const B=[{sb_skip:false,seat:'gemini',api_model:'m',run_token:'r',items,msg:'m'}];
 const nodes={'Judge Enforcer Record':[PASS],'Alt Judge Enforcer Record':[PASS],'Send Back Build':B,'Alt Send Back Build':B,'Panel Cure Check':[{bodies}],'Alt Seated':[{bodies}],'Cited Verses':D.rows,'L2 Words':D.ow,'L2 Lexicon':D.lex};for(const k of [1,2,3]){const v=I('33149','Panel_Cure_Normalize_'+k);if(v)nodes['Panel Cure Normalize '+k]=v;}
 return new Function('$','$input','$json',rd(file))(mk(nodes),{first:()=>({json:{choices:[{message:{content:reply}}]}}),all:()=>[{json:{choices:[{message:{content:reply}}]}}]},{}).map(x=>x.json)[0];};
const bod=[JSON.stringify({payload:{judge_seat:'gemini',drv_uncured:0,verdict_raw:'V'}})];
const pab={kind:'CONCESSION',label:'premise 6 (challenger)',ref:'Jeremiah 18:8',round:'CR3',means:'that rule is conditional on turning, and Jeremiah 22:30 states no such condition.',absence:['Jeremiah 22:30 states no such condition.'],positive:'that rule is conditional on turning'};
const its=[{sid:'S1',rule:'E-PAB',item:'CONCESSION premise 6 (challenger) on Jeremiah 18:8',line:'Premise 6 CONCEDED',reason:'PRESS ABSENCE',pab},{sid:'S2',rule:'E-PAB',item:'CONCESSION premise 6 copy',line:'x',reason:'PRESS ABSENCE',pab},{sid:'S3',rule:'E-PAB',item:'CONCESSION premise 6 copy 2',line:'y',reason:'PRESS ABSENCE',pab}];
const reply='SENDBACK: S1 || KEEP || the defender never answered it\nSENDBACK: S2 || KEEP || The press "that rule is conditional on turning" was never met.\nSENDBACK: S3 || CHANGE TO: RETRACTED: premise 6 || x';
for(const f of ['Send_Back_Record.js','Alt_Send_Back_Record.js']){let o;try{o=recRun('pkgPAB/patched/'+f,its,reply,bod);}catch(e){T(f+' runs',false,String(e.stack).slice(0,400));continue;}
 const p=JSON.parse(o.bodies[0]).payload;const r=k=>o.sb_rows.find(x=>x.item===its[k].item);
 T(f+': S1 KEEP no quote UNCURED and counted once (drv_uncured 1, AUDIT v44); S2 KEEP quoting the positive part CURED; S3 RETRACTED CURED',p.drv_uncured===1&&/AUDIT v44: PRESS ABSENCE UNCURED \(pkgPAB[^\]]*S1 \(E-PAB/.test(p.verdict_raw)&&!/S2 \(|S3 \(/.test(p.verdict_raw)&&r(0).cure_status==='UNCURED'&&r(1).cure_status==='CURED'&&r(2).cure_status==='CURED'&&o.sendback.pab_counted.length===1&&/CURE \(PRESS ABSENCE ENFORCED, pkgPAB\): UNCURED/.test(r(0).cure_reason),p.verdict_raw.split('\n').pop().slice(0,240)+' | '+[0,1,2].map(k=>r(k)&&r(k).cure_status).join(','));
 const o2=recRun('pkgPAB/patched/'+f,[its[0]],'nothing',bod);const p2=JSON.parse(o2.bodies[0]).payload;
 T(f+': a silent E-PAB item is counted once, by silence (pkgSBS), not again by pkgPAB',p2.drv_uncured===1&&o2.sendback.pab_counted.length===0,'drv '+p2.drv_uncured+' pab '+JSON.stringify(o2.sendback.pab_counted));}
console.log('\n'+ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
