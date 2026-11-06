// pkgABS test. Run from wall2024/: node pkgABS/test_ABS.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(fs.readFileSync('pkgABS/plan_ABS.json','utf8'));
T('4 nodes; base (pkgUND/patched) and final shas match',plan.nodes.length===4&&plan.nodes.every(n=>sha(fs.readFileSync(n.base+'/'+n.file,'utf8'))===n.base_sha&&sha(fs.readFileSync('pkgABS/patched/'+n.file,'utf8'))===n.final_sha));
const L=require('../pkgECL/libload.cjs');const keysOf=require('../pkgECL/keys.cjs');const ADD=JSON.parse(fs.readFileSync('pkgABS/data_33107_add.json','utf8'));
const ctxOf=run=>{const c=L.data(keysOf(run).keys);if(run==='33107')c.rows=c.rows.concat(ADD.kjv);return c;};
const ABS=new Function('$',L.LIBSRC+'\n'+fs.readFileSync('pkgABS/src_ABS.js','utf8')+'\nreturn ABS;')(()=>{throw new Error('no $');});const D=ctxOf('33107');
// (1) units
const g13='ANSWER CHECK: Romans 1:3 -- [CR3] -- MEANS: "where the flesh-origin is meant" -- ANSWER: "*sperma* (G4690) states descent from David. The narrowed link does not deny that descent." -- MEETS -- "The narrowed link does not deny that descent"';
const u=[['E-ANS MEETS on "does not deny", no [L1]: raised',{rule:'E-ANS',grade:'MEETS',flagged_line:g13},true],
 ['the same answer with a counted [L1] positive fit: not raised',{rule:'E-ANS',grade:'MEETS',flagged_line:g13.replace('descent." -- MEETS','descent. [L1] Romans 1:3 \\"made of the seed of David according to the flesh\\"" -- MEETS')},false],
 ['the same answer with an [L1] whose words are not in the verse: raised',{rule:'E-ANS',grade:'MEETS',flagged_line:g13.replace('descent." -- MEETS','descent. [L1] Romans 1:3 \\"born of the seed of Joseph after the flesh\\"" -- MEETS')},true],
 ['E-ANS MISSES: not read',{rule:'E-ANS',grade:'MISSES',flagged_line:g13.replace('-- MEETS --','-- MISSES --')},false],
 ['single-quoted ANSWER CHECK: the answer is read, not the MEANS',{rule:'E-ANS',grade:'MEETS',flagged_line:"ANSWER CHECK: Matthew 1:25 -- [DR3] -- MEANS: 'no row states a knowing' -- ANSWER: 'The knowing of my chain stands before the taking' -- MEETS -- the answer places it"},false],
 ['a withdrawal answer ("I drop that limb"): not raised',{rule:'E-ANS',grade:'MEETS',flagged_line:'ANSWER CHECK: Job 14:1 -- [CR3] -- MEANS: "x" -- ANSWER: "The phrase alone does not exclude a father, and I drop that limb." -- MEETS -- "x"'},false],
 ['E-HOLD UNDERDETERMINED "both retained": raised',{rule:'E-HOLD',grade:'UNDERDETERMINED',flagged_line:'D2 vs C2 (Matthew 1:20): UNDERDETERMINED -- x -- GROUND: Attribution of conception and fleshly descent are both retained.'},true],
 ['E-HOLD STANDS "does not name": raised',{rule:'E-HOLD',grade:'STANDS',flagged_line:'D1: STANDS -- GROUND: the row does not name the father.'},true],
 ['E-HOLD STANDS with no absence: not raised',{rule:'E-HOLD',grade:'STANDS',flagged_line:'D1: STANDS -- GROUND: [CR3] answers each press.'},false],
 ['"rather than relying on silence": not raised',{rule:'E-ANS',grade:'MEETS',flagged_line:'ANSWER CHECK: Matthew 1:25 -- [CR4] -- MEANS: "x" -- ANSWER: "The answer relates the finding to the source, rather than relying on silence about an earlier act." -- MEETS -- "x"'},false]];
u.forEach(([n,id,w])=>{const c=ABS.check(id,D);T('unit: '+n,!!c.raise===w,c.why||'(no absence phrase)');});
// (2) replay 33040 to 33107: JEB ids from the live enforcer Build (pkgECL/patched) on each run's inputs
const I=(run,n)=>{const f='/mnt/project-files/wall2024/inputs/'+run+'_'+n+'.json';return fs.existsSync(f)?JSON.parse(fs.readFileSync(f,'utf8'))[0].main[0].map(x=>x.json):null;};
const mk=nodes=>n=>{const it=nodes[n];if(!it)return {isExecuted:false,first:()=>{throw new Error(n);},all:()=>{throw new Error(n);}};return {isExecuted:true,first:()=>({json:it[0]}),all:()=>it.map(j=>({json:j}))};};
const jebRun=run=>{const nodes={'Panel Cure Check':I(run,'Panel_Cure_Check'),'Init Seats':I(run,'Init_Seats')||[{run_token:'r'}],'Resolve Seats':[{deepseek:{api_model:'stub'}}]};for(const k of [1,2,3]){const v=I(run,'Panel_Cure_Normalize_'+k);if(v)nodes['Panel Cure Normalize '+k]=v;}
 return {nodes,out:new Function('$','$input','$json',fs.readFileSync('pkgECL/patched/Judge_Enforcer_Build.js','utf8'))(mk(nodes),{first:()=>({json:{}}),all:()=>[],item:{json:{}}},{}).map(x=>x.json)};};
const RUNS=['33040','33060','33083','33107'];const SC={};const REP=[];
for(const r of RUNS){const J=jebRun(r);const ctx=ctxOf(r);const seen=new Set();const xs=[];for(const id of J.out.flatMap(c=>c.ids||[])){const k=id.rule+'|'+id.seat+'|'+id.flagged_line;if(seen.has(k))continue;seen.add(k);const c=ABS.check(id,ctx);if(c.applies)xs.push({id,c,q:ABS.quoted(ABS.text(id),ctx).filter(x=>x.status==='STANDS')});}
 SC[r]={J,ctx,xs};const ra=xs.filter(x=>x.c.raise);REP.push('== '+r+': '+xs.length+' lines read; raised '+ra.length+' ('+ra.filter(x=>!x.q.length).length+' with no verse quoted, '+ra.filter(x=>x.q.length).length+' quoting a verse without [L1]); absence + counted [L1] (not raised) '+xs.filter(x=>x.c.absence&&!x.c.raise&&!x.c.withdrawn).length+'; withdrawal answers (not raised) '+xs.filter(x=>x.c.withdrawn).length);
 for(const x of ra.sort((a,b)=>a.q.length-b.q.length))REP.push('   '+(x.q.length?'RAISED, VERSE QUOTED w/o [L1] ':'RAISED ')+x.id.seat.padEnd(8)+x.id.rule.padEnd(7)+String(x.id.grade).padEnd(16)+String(x.id.item).padEnd(36)+'"'+x.c.absence+'"'+(x.q.length?' | '+x.q.map(q=>q.ref).join(', '):''));
 for(const x of xs.filter(x=>x.c.withdrawn))REP.push('   withdrawal '+x.id.seat.padEnd(8)+String(x.id.item).padEnd(36)+'"'+x.c.absence+'"');}
const S7=SC['33107'].xs.filter(x=>x.c.raise);
T('33107: gemini Romans 1:3 MEETS raised',S7.some(x=>x.id.seat==='gemini'&&x.id.rule==='E-ANS'&&/Romans 1:3/.test(x.id.item)));
T('33107: sol D2 vs C2 UNDERDETERMINED raised',S7.some(x=>x.id.seat==='sol'&&x.id.rule==='E-HOLD'&&/D2 vs C2/.test(x.id.item)));
T('no raised line carries a counted [L1]',RUNS.every(r=>SC[r].xs.filter(x=>x.c.raise).every(x=>x.c.fit!=='COUNTED')));
// (3) Send Back Build: every raise is sent (or recorded NOT SENT), ENFORCED, with the rule and the cure; base items unchanged
const sbRun=(run,file)=>{const {J,ctx}=SC[run];const nodes={...J.nodes,'Judge Enforcer Build':J.out,'Panel Build':I(run,'Panel_Build'),'Cited Verses':ctx.rows,'L2 Words':ctx.ow,'L2 Lexicon':ctx.lex};
 const PASS={enf428_rows:[],bodies:(nodes['Panel Cure Check']&&nodes['Panel Cure Check'][0].bodies)||[]};
 return new Function('$','$input','$json',fs.readFileSync(file,'utf8'))(mk(nodes),{first:()=>({json:PASS}),all:()=>[{json:PASS}]},PASS).map(x=>x.json);};
for(const r of RUNS){let o,b;try{o=sbRun(r,'pkgABS/patched/Send_Back_Build.js');b=sbRun(r,'pkgUND/patched/Send_Back_Build.js');}catch(e){T('Send Back Build '+r+' runs',false,String(e.stack).slice(0,300));continue;}
 const its=o.filter(x=>!x.sb_skip&&x.items).flatMap(x=>x.items.map(i=>({seat:x.seat,...i})));const bi=b.filter(x=>!x.sb_skip&&x.items).flatMap(x=>x.items.map(i=>({seat:x.seat,...i})));
 const ab=its.filter(i=>i.abs);const bns=(b[0]&&b[0].sb_not_sent)||[];const ns=((o[0]&&o[0].sb_not_sent)||[]).filter(x=>!bi.some(i=>i.seat===x.seat&&i.item===x.item)&&!bns.some(y=>y.seat===x.seat&&y.item===x.item&&y.rule===x.rule));const want=SC[r].xs.filter(x=>x.c.raise).length;
 const sameBase=bi.every(i=>its.some(j=>j.seat===i.seat&&j.rule===i.rule&&j.line===i.line));
 T('Send Back Build '+r+': '+ab.length+' absence items sent'+(ns.length?', '+ns.length+' NOT SENT ('+[...new Set(ns.map(x=>x.why))].join('; ')+')':'')+' of '+want+' raised; every pkgUND item still sent',ab.length+ns.length===want&&sameBase&&o.filter(x=>x.msg&&x.items.some(i=>i.abs)).every(x=>/THE ABSENCE CHECK \(E-(?:ANS|HOLD), ENFORCED, pkgABS/.test(x.msg)&&/A KEEP does not cure this item/.test(x.msg)),ab.map(i=>i.seat+' '+i.sid+' '+i.rule+' '+i.item).join(', '));
 if(r==='33107'){const lines=new Set(ab.map(i=>i.seat+'|'+i.line));T('33107 Alt Send Back Build loads and runs (Alt enforcer Build absent in the inputs: skips)',(()=>{try{const x=sbRun(r,'pkgABS/patched/Alt_Send_Back_Build.js');return Array.isArray(x);}catch(e){return false;}})());}}
// (4) cure units
const CTX=D;const ita={rule:'E-ANS',item:'ANSWER CHECK Romans 1:3 [CR3]',line:g13,abs:{raise:true}};const ith={rule:'E-HOLD',item:'COLLISION D2 vs C2',line:'D2 vs C2 (Matthew 1:20): UNDERDETERMINED -- x -- GROUND: both retained',abs:{raise:true}};
const cu=[['E-ANS KEEP',ita,{ans:'KEEP',why:'"states descent from David"'},'UNCURED'],['E-ANS no answer',ita,{ans:'NO ANSWER'},'UNCURED'],
 ['E-ANS CHANGE TO MISSES',ita,{ans:'CHANGE',to:g13.replace('-- MEETS --','-- MISSES --')},'CURED'],
 ['E-ANS CHANGE TO MEETS on the same absence',ita,{ans:'CHANGE',to:g13},'UNCURED'],
 ['E-ANS CHANGE TO MEETS with a counted [L1] fit',ita,{ans:'CHANGE',to:g13.replace('descent." -- MEETS','descent. [L1] Romans 1:3 \\"made of the seed of David according to the flesh\\"" -- MEETS')},'CURED'],
 ['E-HOLD KEEP',ith,{ans:'KEEP',why:'x'},'UNCURED'],['E-HOLD CHANGE TO RETRACTED',ith,{ans:'CHANGE',to:'RETRACTED: D2 vs C2'},'CURED'],
 ['E-HOLD CHANGE TO BROKEN with counted layers',ith,{ans:'CHANGE',to:'D2 vs C2 (Matthew 1:20): CHALLENGER LINK BROKEN -- x -- GROUND: [L1] Matthew 1:20 "that which is conceived in her is of the Holy Ghost"'},'CURED'],
 ['E-HOLD CHANGE TO BROKEN without [L1]',ith,{ans:'CHANGE',to:'D2 vs C2 (Matthew 1:20): CHALLENGER LINK BROKEN -- the answer cannot overcome it'},'UNCURED'],
 ['E-HOLD CHANGE TO UNDERDETERMINED with a counted [L1] fit',ith,{ans:'CHANGE',to:'D2 vs C2 (Matthew 1:20): UNDERDETERMINED -- GROUND: [L1] Romans 1:3 "made of the seed of David according to the flesh"; the record leaves open the means'},'CURED'],
 ['E-HOLD CHANGE TO UNDERDETERMINED still "both retained"',ith,{ans:'CHANGE',to:'D2 vs C2 (Matthew 1:20): UNDERDETERMINED -- GROUND: both are retained'},'UNCURED']];
cu.forEach(([n,it,a,w])=>{const r=ABS.cure(it,a,CTX);T('cure: '+n+': '+r.status,r.status===w,r.why);});
// (5) Send Back Record, whole node: KEEP on an absence item counts once in drv_uncured with AUDIT v43; a cured item does not; an item pkgUND also counts is counted once
const recRun=(file,items,reply,bodies)=>{const PASS={bodies};const B=[{sb_skip:false,seat:'gemini',api_model:'m',run_token:'r',items,msg:'m'}];
 const nodes={'Judge Enforcer Record':[PASS],'Alt Judge Enforcer Record':[PASS],'Send Back Build':B,'Alt Send Back Build':B,'Panel Cure Check':[{bodies}],'Alt Seated':[{bodies}],'Cited Verses':D.rows,'L2 Words':D.ow,'L2 Lexicon':D.lex};for(const k of [1,2,3]){const v=I('33107','Panel_Cure_Normalize_'+k);if(v)nodes['Panel Cure Normalize '+k]=v;}
 return new Function('$','$input','$json',fs.readFileSync(file,'utf8'))(mk(nodes),{first:()=>({json:{choices:[{message:{content:reply}}]}}),all:()=>[{json:{choices:[{message:{content:reply}}]}}]},{}).map(x=>x.json)[0];};
const bod=[JSON.stringify({payload:{judge_seat:'gemini',drv_uncured:0,verdict_raw:'V'}})];
const its=[{sid:'S1',rule:'E-ANS',item:ita.item,line:g13,reason:'ABSENCE CHECK',abs:{raise:true}},{sid:'S2',rule:'E-HOLD',item:ith.item,line:ith.line,reason:'ABSENCE CHECK',abs:{raise:true}}];
for(const f of ['Send_Back_Record.js','Alt_Send_Back_Record.js']){let o;try{o=recRun('pkgABS/patched/'+f,its,'SENDBACK: S1 || KEEP || "The narrowed link does not deny that descent"\nSENDBACK: S2 || CHANGE TO: RETRACTED: D2 vs C2 || x',bod);}catch(e){T(f+' runs',false,String(e.stack).slice(0,400));continue;}
 const p=JSON.parse(o.bodies[0]).payload;const r1=o.sb_rows.find(x=>x.item===ita.item),r2=o.sb_rows.find(x=>x.item===ith.item);
 T(f+': KEEP on S1 UNCURED and counted (drv_uncured 1, AUDIT v43); S2 RETRACTED CURED, not counted',p.drv_uncured===1&&/AUDIT v43: ABSENCE GRADE UNCURED \(pkgABS[^\]]*S1 \(E-ANS/.test(p.verdict_raw)&&!/S2 \(/.test(p.verdict_raw)&&r1.cure_status==='UNCURED'&&r2.cure_status==='CURED'&&o.sendback.abs_counted.length===1&&/CURE \(ABSENCE CHECK ENFORCED, pkgABS\): UNCURED/.test(r1.cure_reason),p.verdict_raw.split('\n').pop().slice(0,200));
 const both=[{...its[1],sid:'S1',reason:'x (right: BROKEN)',und:{kind:'E-HOLD-UND'}}];const o2=recRun('pkgABS/patched/'+f,both,'SENDBACK: S1 || KEEP || x',bod);const p2=JSON.parse(o2.bodies[0]).payload;
 T(f+': an item pkgUND also marks is counted once on KEEP (drv_uncured 1)',p2.drv_uncured===1,'und '+JSON.stringify(o2.sendback.und_counted)+' abs '+JSON.stringify(o2.sendback.abs_counted));}
console.log('\nREPLAY (raises listed; "VERSE QUOTED w/o [L1]" = a verse is quoted beside its reference and stands in the KJV, but under no [L1] tag)');REP.forEach(l=>console.log(l));
console.log('\n'+ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
