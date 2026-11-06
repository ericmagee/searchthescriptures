// pkgUND test. Run from wall2024/: node pkgUND/test_UND.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(fs.readFileSync('pkgUND/plan_UND.json','utf8'));
T('6 nodes; base (pkgECL/patched) and final shas match',plan.nodes.length===6&&plan.nodes.every(n=>sha(fs.readFileSync('pkgECL/patched/'+n.file,'utf8'))===n.base_sha&&sha(fs.readFileSync('pkgUND/patched/'+n.file,'utf8'))===n.final_sha));
const L=require('../pkgECL/libload.cjs');const keysOf=require('../pkgECL/keys.cjs');
const lib=ctx=>{const $=n=>({isExecuted:true,all:()=>(n==='Cited Verses'?ctx.rows:n==='L2 Words'?ctx.ow:ctx.lex).map(j=>({json:j}))});return new Function('$',L.LIBSRC+'\n'+fs.readFileSync('pkgUND/src_UND.js','utf8')+'\nreturn UND;')($);};
const D=L.data();const U=lib(D);
// the library copy in each Send Back node is src_UND.js byte for byte
T('every Send Back node carries src_UND.js byte for byte',['Send_Back_Build.js','Alt_Send_Back_Build.js','Send_Back_Record.js','Alt_Send_Back_Record.js'].every(f=>fs.readFileSync('pkgUND/patched/'+f,'utf8').includes(fs.readFileSync('pkgUND/src_UND.js','utf8'))));
// (1) units: the UNDERDETERMINED grounds
const c6='D6 vs C6 (Luke 1:36; Hebrews 2:14): UNDERDETERMINED -- Mary\'s kin and the sharing of flesh and blood are acknowledged; [CR3] answers the presses. GROUND: The narrowed keystone does not dispute those descriptions.';
const c6ok='D6 vs C6 (Luke 1:36): UNDERDETERMINED -- Mary\'s kin is granted -- GROUND: [L1] Luke 1:36 "thy cousin Elisabeth" -- the record leaves open whether the kinship reaches the house of David.';
const r1=U.undOk(c6,D),r2=U.undOk(c6ok,D);
T('unit: chatgpt 33107 D6 vs C6 as written gives no [L1] (and names the open point only as "does not dispute"): '+r1.why,!r1.ok&&r1.l1==='NONE');
T('unit: the same line with [L1] Luke 1:36 "thy cousin Elisabeth" and "the record leaves open whether ..." gives its grounds: '+r2.why,r2.ok);
const r3=U.undOk('D2 vs C3 (Matthew 1:18): UNDERDETERMINED -- x -- GROUND: [L1] Matthew 1:18 "before they came together, she was found with child" -- both readings agree with it.',D);
T('unit: "both readings agree" states the open point: '+r3.why,r3.ok);
// (2) units: the cure of each item, side-neutral
const ung={rule:'E-UNG',item:'COLLISION D1 (pressed: [DR2] premise 1)',und:{kind:'E-UNG',n:1}};const hu={rule:'E-HOLD',item:'COLLISION D6 vs C6',line:c6,und:{kind:'E-HOLD-UND'}};
const cu=[['E-UNG KEEP',ung,{ans:'KEEP'},'UNCURED'],['E-UNG CHANGE TO "D1: STANDS"',ung,{ans:'CHANGE',to:'D1: STANDS -- GROUND: x'},'UNCURED'],
 ['E-UNG CHANGE TO D1 vs C1 UNDERDETERMINED with [L1] and the open point',ung,{ans:'CHANGE',to:'D1 vs C1 (Matthew 1:16): UNDERDETERMINED -- x -- GROUND: [L1] Matthew 1:16 "Jacob begat Joseph the husband of Mary" -- the record leaves open whether the line runs to Jesus by begetting.'},'CURED'],
 ['E-UNG CHANGE TO D1 vs C1 DEFENDER LINK BROKEN with counted layers',ung,{ans:'CHANGE',to:'D1 vs C1 (Matthew 1:16): DEFENDER LINK BROKEN -- x -- GROUND: [L1] Matthew 1:16 "Jacob begat Joseph the husband of Mary"'},'CURED'],
 ['E-UNG CHANGE TO D1 vs C1 CHALLENGER LINK BROKEN with counted layers',ung,{ans:'CHANGE',to:'D1 vs C1 (Matthew 1:16): CHALLENGER LINK BROKEN -- x -- GROUND: [L1] Matthew 1:16 "Jacob begat Joseph the husband of Mary"'},'CURED'],
 ['E-UNG CHANGE TO D1 vs C1 CHALLENGER LINK BROKEN with no [L1]',ung,{ans:'CHANGE',to:'D1 vs C1 (Matthew 1:16): CHALLENGER LINK BROKEN -- x -- GROUND: it cannot overcome the verse'},'UNCURED'],
 ['E-HOLD-UND KEEP',hu,{ans:'KEEP'},'UNCURED'],['E-HOLD-UND RETRACTED',hu,{ans:'CHANGE',to:'RETRACTED: D6 vs C6'},'CURED'],
 ['E-HOLD-UND kept UNDERDETERMINED with its grounds',hu,{ans:'CHANGE',to:c6ok},'CURED'],['E-HOLD-UND kept UNDERDETERMINED without [L1]',hu,{ans:'CHANGE',to:c6},'UNCURED'],
 ['E-HOLD-UND regraded DEFENDER LINK BROKEN with counted layers',hu,{ans:'CHANGE',to:'D6 vs C6 (Luke 1:36): DEFENDER LINK BROKEN -- x -- GROUND: [L1] Luke 1:36 "thy cousin Elisabeth"'},'CURED'],
 ['E-HOLD-UND regraded STANDS',hu,{ans:'CHANGE',to:'D6 vs C6 (Luke 1:36): STANDS -- GROUND: x'},'CURED'],['no answer',hu,{ans:'NO ANSWER'},'UNCURED']];
cu.forEach(([n,it,a,w])=>{const r=U.cure(it,a,D);T('cure: '+n+': '+r.status,r.status===w,r.why);});
// (3) Send Back Build replay 33040 to 33107: the enforcer rows as stored (Gate Record), the judges' texts (Panel Cure Check), the verses each run read
const I=(run,n)=>{const f='/mnt/project-files/wall2024/inputs/'+run+'_'+n+'.json';if(!fs.existsSync(f))return null;const r=JSON.parse(fs.readFileSync(f,'utf8'))[0];return ((r.main||(r.data&&r.data.main))[0]).map(x=>x.json);};
const sb=(f,run)=>{const G=JSON.parse(fs.readFileSync('corpus/raw/gate_'+run+'.json','utf8'));const g=G['Gate Record'].slice(-1)[0][0];let ctx;try{ctx=L.data(keysOf(run).keys);}catch(e){ctx=L.data();}
 const nodes={'Panel Build':G['Panel Build'].slice(-1)[0],'Panel Cure Check':I(run,'Panel_Cure_Check'),'Enforcer Record':[{enf421_rows:g.enf421_rows||[]}],'Judge Enforcer Build':I(run,'Judge_Enforcer_Build')||[],'Cited Verses':ctx.rows,'L2 Words':ctx.ow,'L2 Lexicon':ctx.lex};
 const $=n=>{const it=nodes[n];if(!it)return {isExecuted:false,first:()=>{throw new Error(n);},all:()=>{throw new Error(n);}};return {isExecuted:true,first:()=>({json:it[0]}),all:()=>it.map(j=>({json:j}))};};
 const PASS={enf428_rows:g.enf428_rows||[],bodies:nodes['Panel Cure Check'][0].bodies};
 return {g,out:new Function('$','$input','$json',fs.readFileSync(f,'utf8'))($,{first:()=>({json:PASS}),all:()=>[{json:PASS}]},PASS).map(x=>x.json)};};
const itemsOf=o=>o.filter(x=>!x.sb_skip&&x.items).flatMap(x=>x.items.map(i=>({seat:x.seat,...i})));const ALL=[];
for(const run of ['33040','33060','33083','33107']){let A,B;try{A=sb('pkgECL/patched/Send_Back_Build.js',run);B=sb('pkgUND/patched/Send_Back_Build.js',run);}catch(e){T('Send Back Build '+run+' runs',false,String(e.stack).slice(0,300));continue;}
 const a=itemsOf(A.out),b=itemsOf(B.out);const ns=(B.out[0]&&B.out[0].sb_not_sent)||[];const ung=b.filter(i=>i.rule==='E-UNG'),hu=b.filter(i=>i.rule==='E-HOLD'&&i.und);
 const same=a.every(x=>b.some(y=>y.seat===x.seat&&y.rule===x.rule&&y.item===x.item&&y.line===x.line));
 console.log('  == '+run+': base '+a.length+' items, pkgUND '+b.length+' (E-UNG '+ung.length+', E-HOLD on UNDERDETERMINED marked '+hu.length+')'+(ns.length?'; NOT SENT '+ns.filter(x=>x.rule==='E-UNG').length+' E-UNG ('+[...new Set(ns.map(x=>x.seat+': '+x.why))].join('; ')+')':''));
 ung.forEach(i=>console.log('     E-UNG  '+i.seat.padEnd(8)+i.item+' | '+String(i.line).slice(0,110)));
 hu.forEach(i=>{const st=(A.g.sb_items||[]).find(x=>x.seat===i.seat&&x.item===i.item&&x.rule==='E-HOLD');const c=st?U.cure(i,{ans:st.ans,to:st.to},L.data()):null;
  console.log('     E-HOLD '+i.seat.padEnd(8)+i.item+' | stored answer '+(st?st.ans+(st.to?' TO: '+String(st.to).slice(0,80):''):'none')+' -> under pkgUND '+(c?c.status+' ('+String(c.why).slice(0,90)+')':'-'));ALL.push({run,seat:i.seat,c});});
 ns.filter(x=>x.rule==='E-UNG').forEach(x=>console.log('     NOT SENT '+x.seat+' '+x.item+': '+x.why));
 T('Send Back Build '+run+': every base item is still sent unchanged; the only new items are E-UNG; marked E-HOLD items are UNDERDETERMINED lines the enforcer reads BROKEN',same&&b.length===a.length+ung.length&&hu.every(i=>/UNDERDETERMINED/.test(i.line)&&/right:\s*BROKEN/i.test(i.reason))&&B.out.filter(x=>x.msg&&x.items&&x.items.some(i=>i.und)).every(x=>/THE COLLISION RULE \(pkgUND, ENFORCED\)/.test(x.msg)));
 if(run==='33107'){T('33107: gemini D1 to D6 raised (no graded collision line), chatgpt D6 vs C6 marked',['1','2','3','4','5','6'].every(n=>ung.some(i=>i.seat==='gemini'&&i.item.startsWith('COLLISION D'+n+' ')))&&hu.some(i=>i.seat==='chatgpt'&&i.item==='COLLISION D6 vs C6'));}}
// (4) Send Back Record: the hook, the counting and the parse
for(const f of ['Send_Back_Record.js','Alt_Send_Back_Record.js']){const s=fs.readFileSync('pkgUND/patched/'+f,'utf8');
 T(f+': UND.cure on E-UNG and marked items; UNCURED counted in drv_uncured with an AUDIT v42 line; reported in und_counted',/if\(it\.rule==='E-UNG'\|\|it\.und\)\{let __u;try\{__u=UND\.cure\(/.test(s)&&/p\.drv_uncured=\(p\.drv_uncured\|\|0\)\+its\.length;anySil=true;und_counted\.push/.test(s)&&s.includes('[AUDIT v42: COLLISION GRADE UNCURED (pkgUND)')&&s.includes('silent_counted,ecol_counted,und_counted}'));}
// (5) the instruction
const P=['Panel_Build.js','Build_Independent_Verdict.js'].map(f=>fs.readFileSync('pkgUND/patched/'+f,'utf8'));
T('Panel Build and Build Independent Verdict state the pressed-link rule and the UNDERDETERMINED ground, once each',P.every(s=>s.split('is not any other link: it takes a graded D<i> vs C<j> line').length===2&&s.includes('[L1] <reference> \\"<the KJV words both readings rest on>\\" and what the record leaves open')));
console.log('\n'+ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
