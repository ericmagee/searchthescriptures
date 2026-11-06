// pkgMNP test. Run from wall2024/: node pkgMNP/test_MNP.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const rd=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(rd('pkgMNP/plan_MNP.json'));T('4 nodes; base and final shas match',plan.nodes.length===4&&plan.nodes.every(n=>sha(rd(n.base+'/'+n.file))===n.base_sha&&sha(rd('pkgMNP/patched/'+n.file))===n.final_sha));
const live=rd('pkgKWC/patched/Gate_Record.js'); /* = live 98daac9e (pkgKWC write) */const src=rd('pkgMNP/src_MNP.js');
const lp=live.slice(live.indexOf('const PRS=(()=>{'));T('the PRS copy in pkgMNP is the live library PRS byte for byte',src.includes(lp.slice(0,src.length>0?lp.indexOf('\n return {entries,parse,classify,refCheck,premise,blockAt,foot,RND,ORD,l2bad};})();')+80:0)));
const {sb,itemsOf}=require('../pkgUNA/replay_UNA.cjs');const k=i=>i.seat+'|'+i.rule+'|'+i.item+'|'+i.line;const REP=[];
for(const run of ['33040','33060','33083','33107','33129','33149','33160']){const a=itemsOf(sb('pkgUNA/patched/Send_Back_Build.js',run).o),b=itemsOf(sb('pkgMNP/patched/Send_Back_Build.js',run).o);const ka=new Set(a.map(k));
 const nw=b.filter(i=>!ka.has(k(i)));T(run+': every pkgUNA item still sent ('+a.length+'); new items are E-MNP only ('+nw.length+')',a.every(x=>b.some(y=>k(y)===k(x)))&&nw.every(i=>i.rule==='E-MNP'&&i.mnp));
 const by={};nw.forEach(i=>by[i.seat]=(by[i.seat]||0)+1);REP.push(run+': '+JSON.stringify(by)+'  '+nw.map(i=>i.seat+' '+i.item.replace(' (MEANS NONE)','')).join('; '));
 if(run==='33107')T('33107: chatgpt Acts 2:30 [CR3] is sent, with the ledger MEANS "the raising is out of David\'s loins according to the flesh."',nw.some(i=>i.seat==='chatgpt'&&/Acts 2:30 \[CR3\]/.test(i.item)&&/out of David's loins according to the flesh/.test(i.mnp.ledger_means)));}
console.log('  REPLAY (new E-MNP items per run):\n   '+REP.join('\n   '));
// cure units
const {MNP}=require('./scan_MNP.cjs');const it={mnp:{key:'Acts 2:30',ref:'Acts 2:30',round:'CR3',ledger_means:"the raising is out of David's loins according to the flesh.",ledger_cls:'PROVEN'}};
for(const [n,a,w] of [['KEEP',{ans:'KEEP'},'UNCURED'],['CHANGE TO still MEANS "NONE"',{ans:'CHANGE',to:'ANSWER CHECK: Acts 2:30 -- [CR3] -- MEANS: "NONE" -- ANSWER: "x" -- MISSES'},'UNCURED'],
 ['CHANGE TO with the real MEANS, MISSES',{ans:'CHANGE',to:'ANSWER CHECK: Acts 2:30 -- [CR3] -- MEANS: "the raising is out of David\'s loins according to the flesh" -- ANSWER: "x" -- MISSES'},'CURED'],
 ['CHANGE TO with the real MEANS, UNPROVEN on a PROVEN press',{ans:'CHANGE',to:'ANSWER CHECK: Acts 2:30 -- [CR3] -- MEANS: "the raising is out of David\'s loins according to the flesh" -- ANSWER: "x" -- UNPROVEN'},'UNCURED'],
 ['CHANGE TO with another MEANS',{ans:'CHANGE',to:'ANSWER CHECK: Acts 2:30 -- [CR3] -- MEANS: "David is a prophet" -- ANSWER: "x" -- MEETS'},'UNCURED'],
 ['CHANGE TO on another verse',{ans:'CHANGE',to:'ANSWER CHECK: Acts 2:31 -- [CR3] -- MEANS: "the raising is out of David\'s loins according to the flesh" -- ANSWER: "x" -- MEETS'},'UNCURED']])
 {const r=MNP.cure(it,a);T('cure: '+n+': '+r.status,r.status===w,r.why);}
// Send Back Record, whole node
const L=require('../pkgECL/libload.cjs');const D=L.data();const {I}=require('../pkgPAB/scan_PAB.cjs');const mk=nodes=>n=>{const it=nodes[n];if(!it)return {isExecuted:false,first:()=>{throw new Error(n);},all:()=>{throw new Error(n);}};return {isExecuted:true,first:()=>({json:it[0]}),all:()=>it.map(j=>({json:j}))};};
const recRun=(file,items,reply,bodies)=>{const PASS={bodies};const B=[{sb_skip:false,seat:'chatgpt',api_model:'m',run_token:'r',items,msg:'m'}];
 const nodes={'Judge Enforcer Record':[PASS],'Alt Judge Enforcer Record':[PASS],'Send Back Build':B,'Alt Send Back Build':B,'Panel Cure Check':[{bodies}],'Alt Seated':[{bodies}],'Cited Verses':D.rows,'L2 Words':D.ow,'L2 Lexicon':D.lex};for(const k2 of [1,2,3]){const v=I('33107','Panel_Cure_Normalize_'+k2);if(v)nodes['Panel Cure Normalize '+k2]=v;}
 return new Function('$','$input','$json',rd(file))(mk(nodes),{first:()=>({json:{choices:[{message:{content:reply}}]}}),all:()=>[{json:{choices:[{message:{content:reply}}]}}]},{}).map(x=>x.json)[0];};
const bod=[JSON.stringify({payload:{judge_seat:'chatgpt',drv_uncured:0,verdict_raw:'V'}})];const its=[{sid:'S1',rule:'E-MNP',item:'ANSWER CHECK Acts 2:30 [CR3] (MEANS NONE)',line:'x',reason:'MEANS',mnp:it.mnp},{sid:'S2',rule:'E-MNP',item:'ANSWER CHECK Acts 2:30 [CR3] copy',line:'y',reason:'MEANS',mnp:it.mnp}];
const reply='SENDBACK: S1 || KEEP || it has no MEANS\nSENDBACK: S2 || CHANGE TO: ANSWER CHECK: Acts 2:30 -- [CR3] -- MEANS: "the raising is out of David\'s loins according to the flesh" -- ANSWER: "x" -- MISSES || x';
for(const f of ['Send_Back_Record.js','Alt_Send_Back_Record.js']){let o;try{o=recRun('pkgMNP/patched/'+f,its,reply,bod);}catch(e){T(f+' runs',false,String(e.stack).slice(0,300));continue;}const p=JSON.parse(o.bodies[0]).payload;const r=n=>o.sb_rows.find(x=>x.item===its[n].item);
 T(f+': S1 KEEP UNCURED, counted once (drv_uncured 1, AUDIT v45); S2 CHANGE TO with the real MEANS CURED',p.drv_uncured===1&&/AUDIT v45: MEANS AGAINST THE LEDGER UNCURED \(pkgMNP\)[^\]]*S1 \(E-MNP/.test(p.verdict_raw)&&!/S2 \(/.test(p.verdict_raw)&&r(0).cure_status==='UNCURED'&&r(1).cure_status==='CURED'&&o.sendback.mnp_counted.length===1,p.verdict_raw.split('\n').pop().slice(0,200));}
console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
