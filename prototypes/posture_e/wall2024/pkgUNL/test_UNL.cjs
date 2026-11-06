// pkgUNL test. Run from wall2024/: node pkgUNL/test_UNL.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};const rd=f=>fs.readFileSync(f,'utf8');
const plan=JSON.parse(rd('pkgUNL/plan_UNL.json'));
T('4 nodes; base (pkgABS/patched) and final shas match',plan.nodes.length===4&&plan.nodes.every(n=>sha(rd('pkgABS/patched/'+n.file))===n.base_sha&&sha(rd('pkgUNL/patched/'+n.file))===n.final_sha));
T('every node carries src_UNL.js byte for byte and no copy of src_UND.js',plan.nodes.every(n=>{const s=rd('pkgUNL/patched/'+n.file);return s.includes(rd('pkgUNL/src_UNL.js'))&&!s.includes(rd('pkgUND/src_UND.js'));}));
const L=require('../pkgECL/libload.cjs');const keysOf=require('../pkgECL/keys.cjs');
const lib=(src,ctx)=>{const $=n=>({isExecuted:true,all:()=>(n==='Cited Verses'?ctx.rows:n==='L2 Words'?ctx.ow:ctx.lex).map(j=>({json:j}))});return new Function('$',L.LIBSRC+'\n'+rd(src)+'\nreturn UND;')($);};
const ctxOf=run=>{try{return L.data(keysOf(run).keys);}catch(e){return L.data();}};
const ptOf=run=>{const PB=JSON.parse(rd('corpus/raw/gate_'+run+'.json'))['Panel Build'].slice(-1)[0][0];const J=PB.judges[0];return J.body.messages.map(m=>typeof m.content==='string'?m.content:(m.content||[]).map(c=>c&&c.text||'').join('\n')).join('\n');};
// (1) pressed: 33149's list, premise -> its LINK label
const D49=ctxOf('33149');const O=lib('pkgUND/src_UND.js',D49),N=lib('pkgUNL/src_UNL.js',D49);
const p0=O.pressed(ptOf('33149')).map(p=>p.n),p1=N.pressed(ptOf('33149'));
console.log('   33149 [DR2] list: pkgUND links '+JSON.stringify(p0)+'; pkgUNL '+JSON.stringify(p1.map(p=>'D'+p.n+' <- premise '+p.premises.join(','))));
T('33149: premises 1-3 press D6, 4 D2, 5 D3, 6 D4 (their LINK labels), not D1-D6 by position',JSON.stringify(p1.map(p=>[p.n,p.premises]))===JSON.stringify([[2,[4]],[3,[5]],[4,[6]],[6,[1,2,3]]]));
const synth='=== [DR2] x ===\nUNSUPPORTED-L4 PREMISES:\n1. LINK 3: a\n2. premise with no label\n3. LINK none: b\n4. **LINK 5**: c\n';
T('unit: an unlabelled premise and LINK none raise nothing; a bold LINK label is read',JSON.stringify(N.pressed(synth).map(p=>[p.n,p.premises]))===JSON.stringify([[3,[1]],[5,[4]]]),JSON.stringify(N.pressed(synth)));
// (2) the cure of chatgpt's two 33149 CHANGE TO lines, and the old pkgUND tests still hold
const c1={rule:'E-UNG',item:'COLLISION D1 (pressed: [DR2] premise 1)',und:{kind:'E-UNG',n:1}},c5={rule:'E-UNG',item:'COLLISION D5 (pressed: [DR2] premise 5)',und:{kind:'E-UNG',n:5}};
const t1='D1 vs C1 (Matthew 1:16): UNDERDETERMINED -- The parties agree on the maternal wording but dispute Joseph\'s role; [CR4] answers the genealogy press -- GROUND: [L1] Matthew 1:16 "Jacob begat Joseph the husband of Mary, of whom was born Jesus" leaves that role disputed.';
const t5='D5 vs C1 (Galatians 4:4): UNDERDETERMINED -- Both accounts accept the maternal wording but dispute its implications; [CR4] answers the seed comparison -- GROUND: [L1] Galatians 4:4 "made of a woman" leaves the paternal route to the other rows.';
for(const [it,t] of [[c1,t1],[c5,t5]]){const a=O.cure(it,{ans:'CHANGE',to:t},D49),b=N.cure(it,{ans:'CHANGE',to:t},D49);T('33149 chatgpt '+it.item.slice(0,13)+': pkgUND '+a.status+', pkgUNL '+b.status,a.status==='UNCURED'&&b.status==='CURED',b.why);}
for(const [n,t,w] of [['no open point','D1 vs C1 (Matthew 1:16): UNDERDETERMINED -- x -- GROUND: [L1] Matthew 1:16 "Jacob begat Joseph the husband of Mary".','UNCURED'],['open point but no [L1]','D1 vs C1 (Matthew 1:16): UNDERDETERMINED -- the record leaves open whether -- GROUND: the verse is disputed.','UNCURED'],['KEEP',null,'UNCURED']]){const r=N.cure(c1,t?{ans:'CHANGE',to:t}:{ans:'KEEP'},D49);T('unit kept: '+n+' -> '+r.status,r.status===w,r.why);}
// (3) Send Back Build replay: E-UNG items, pkgABS (live) vs pkgUNL
const I=(run,n)=>{const f='/mnt/project-files/wall2024/inputs/'+run+'_'+n+'.json';if(!fs.existsSync(f))return null;const r=JSON.parse(rd(f))[0];return ((r.main||(r.data&&r.data.main))[0]).map(x=>x.json);};
const sb=(f,run)=>{const G=JSON.parse(rd('corpus/raw/gate_'+run+'.json'));const g=G['Gate Record'].slice(-1)[0][0];const ctx=ctxOf(run);
 const nodes={'Panel Build':G['Panel Build'].slice(-1)[0],'Panel Cure Check':I(run,'Panel_Cure_Check'),'Enforcer Record':[{enf421_rows:g.enf421_rows||[]}],'Judge Enforcer Build':I(run,'Judge_Enforcer_Build')||[],'Cited Verses':ctx.rows,'L2 Words':ctx.ow,'L2 Lexicon':ctx.lex};
 const $=n=>{const it=nodes[n];if(!it)return {isExecuted:false,first:()=>{throw new Error(n);},all:()=>{throw new Error(n);}};return {isExecuted:true,first:()=>({json:it[0]}),all:()=>it.map(j=>({json:j}))};};
 const PASS={enf428_rows:g.enf428_rows||[],bodies:nodes['Panel Cure Check'][0].bodies};
 return new Function('$','$input','$json',rd(f))($,{first:()=>({json:PASS}),all:()=>[{json:PASS}]},PASS).map(x=>x.json);};
const itemsOf=o=>o.filter(x=>!x.sb_skip&&x.items).flatMap(x=>x.items.map(i=>({seat:x.seat,...i})));
for(const run of ['33040','33060','33083','33107','33129','33149']){let a,b;try{a=itemsOf(sb('pkgABS/patched/Send_Back_Build.js',run));b=itemsOf(sb('pkgUNL/patched/Send_Back_Build.js',run));}catch(e){T(run+' Send Back Build runs',false,String(e.stack).slice(0,300));continue;}
 const ua=a.filter(i=>i.rule==='E-UNG'),ub=b.filter(i=>i.rule==='E-UNG');const k=i=>i.seat+' '+i.item.replace(/ \(.*/,'');
 console.log('  == '+run+': E-UNG pkgABS '+ua.length+' ['+ua.map(k).join('; ')+'] -> pkgUNL '+ub.length+' ['+ub.map(i=>i.seat+' '+i.item).join('; ')+']');
 const oa=a.filter(i=>i.rule!=='E-UNG'),ob=b.filter(i=>i.rule!=='E-UNG');
 T(run+': every other item is sent unchanged',oa.length===ob.length&&oa.every(x=>ob.some(y=>y.seat===x.seat&&y.rule===x.rule&&y.item===x.item&&y.line===x.line)));
 if(run==='33149')T('33149: sol raises no E-UNG (its D3 is graded; premise 5 presses D3); gemini and chatgpt items name the labelled links',!ub.some(i=>i.seat==='sol'&&/D5/.test(i.item))&&!ub.some(i=>/COLLISION D[15] /.test(i.item)));}
// (4) Send Back Record carries the same cure
for(const f of ['Send_Back_Record.js','Alt_Send_Back_Record.js'])T(f+': the cure hook unchanged (UND.cure on E-UNG and marked items)',/if\(it\.rule==='E-UNG'\|\|it\.und\)\{let __u;try\{__u=UND\.cure\(/.test(rd('pkgUNL/patched/'+f)));
console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
