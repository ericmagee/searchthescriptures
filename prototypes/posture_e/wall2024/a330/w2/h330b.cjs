// W2 grading harness for ASK 330 (assumed-fact form, K-UNX) and ASK 331 (Option A, one grade-or-count test).
// Read-only, offline, no model calls. Usage: node h330.cjs <live.json> <target.json>
// Runs the REAL library code (rebuilt from Shared Library LIB/MAP) of both versions on planted inputs.
const L=require('./lib2.cjs');const [,,LV,TG]=process.argv;const NL=L.load(LV),NT=L.load(TG);let fails=0;const ok=(c,m)=>{console.log((c?'  OK   ':'  FAIL ')+m);if(!c)fails++;};
// 1. DIFF: which nodes change, which LIB lines, MAP lengths, model settings
console.log('== DIFF');
const byN=N=>Object.fromEntries(N.map(n=>[n.name,n]));const BL=byN(NL),BT=byN(NT);
const changed=Object.keys(BT).filter(k=>JSON.stringify(BT[k])!==JSON.stringify(BL[k]));
console.log('  changed nodes:',changed.join(', ')||'none');ok(changed.length===1&&changed[0]==='Shared Library','only the Shared Library node changes (plan 6932 items 1, 4, 9)');
const SLv=L.split(BL['Shared Library'].parameters.jsCode),SLt=L.split(BT['Shared Library'].parameters.jsCode);
const dl=[];for(let i=0;i<Math.max(SLv.LIB.length,SLt.LIB.length);i++)if(SLv.LIB[i]!==SLt.LIB[i])dl.push(i);console.log('  LIB lines differing:',dl.length,dl.slice(0,40).join(','));
const rb=(S,P)=>P.map(x=>typeof x==='number'?S.LIB[x]:(typeof x[0]==='string'?x[0]:S.LIB.slice(x[0],x[1]+1).join('\n'))).join('\n');
let mapBad=[];for(const k in SLt.MAP)if(rb(SLt,SLt.MAP[k].p).length!==SLt.MAP[k].n)mapBad.push(k);ok(!mapBad.length,'MAP n equals rebuilt length for every library node '+(mapBad.length?mapBad.join(','):''));
const sha=require('crypto').createHash('sha256').update(JSON.stringify(SLt.LIB)).digest('hex').slice(0,16);ok(SLt.head.includes('library sha '+sha),'header sha matches LIB ('+sha+')');
const MS=/\b(reasoning|effort|max_tokens|temperature|thinking|top_p)\b/g;const cnt=s=>(String(s).match(MS)||[]).length;
let msBad=[];for(const k of changed){const a=JSON.stringify(BL[k]?.parameters||{}),b=JSON.stringify(BT[k].parameters);if(cnt(a)!==cnt(b))msBad.push(k+' '+cnt(a)+'->'+cnt(b));}
for(const i of dl)if(cnt(SLv.LIB[i]||'')!==cnt(SLt.LIB[i]||''))msBad.push('LIB '+i);ok(!msBad.length,'no model-setting token added or removed (reasoning guard) '+msBad.join('; '));
const nodesChangedSrc=Object.keys(SLt.MAP).filter(k=>!SLv.MAP[k]||rb(SLv,SLv.MAP[k].p)!==rb(SLt,SLt.MAP[k].p));console.log('  library nodes whose rebuilt source changes:',nodesChangedSrc.join(', '));
// 2. ASK 330 plants: K-UNX cure on an ASSUMES-form STATEMENT
console.log('== ASK 330 (K-UNX cure on the STEP / ASSUMES / ROWS GIVE form)');
const R={CR1:'',CR2:'',CR3:'LINK 5. The flesh of David reaches the child by the womb. [L1] Romans 1:3 "made of the seed of David according to the flesh" -- MEANS: the flesh is David\'s.',CR4:'I rest this route on Romans 1:3, Luke 1:32 and Luke 1:35, and not on Mary\'s genealogy stated in a row.',DR1:'',DR2:'',DR3:'',DR4:''};
const VERSES={'Romans 1:3':'Concerning his Son Jesus Christ our Lord, which was made of the seed of David according to the flesh;'};
const stub=nm=>{if(/Cited Verses/.test(nm))return {isExecuted:true,first:()=>({json:{verses:VERSES,rows:Object.entries(VERSES).map(([ref,text])=>({ref,text}))}}),all:()=>[{json:{verses:VERSES}}].concat(Object.entries(VERSES).map(([ref,text])=>{const m=ref.match(/^(.+) (\d+):(\d+)$/);return {json:{book:m[1],chapter:+m[2],verse:+m[3],text}};})),params:{}};return {isExecuted:false,first:()=>({json:{}}),all:()=>[],params:{}};};
const it={rule:'K-UNX',side:'DEFENDER',link:'D5 vs C6',premise:5,kinds:['L4'],conc:2,why:'x',line:'x'};
const run=(N,txt)=>{const M=L.module(N,'Panel Cure Check',['cureVerdicts'],{$:stub,extra:(L.src(N,'Panel Cure Check').full.includes('function __af330')?'\n'+require('fs').readFileSync('/home/claude/searchthescriptures/prototypes/posture_e/wall2024/a330b/af330.js','utf8'):'')});const v=M.cureVerdicts([{...it}],{ok:true,text:'RESPONSE: K-UNX D5 vs C6 | '+txt+'\nSTATEMENT: K-UNX D5 vs C6 | '+txt},null,R);return v[0];};
const P330=[
 ['P1 valid form','STEP: "The flesh of David reaches the child by the womb" -- ASSUMES: Mary is of the house of David -- ROWS GIVE: "made of the seed of David according to the flesh" (Romans 1:3)','CURED','UNCURED'],
 ['P2 STEP not verbatim in side rounds','STEP: "the child takes David\'s flesh through his mother" -- ASSUMES: Mary is of the house of David -- ROWS GIVE: "made of the seed of David according to the flesh" (Romans 1:3)','UNCURED','UNCURED'],
 ['P3 ROWS GIVE not in the cited verse','STEP: "The flesh of David reaches the child by the womb" -- ASSUMES: Mary is of the house of David -- ROWS GIVE: "born of the virgin of the house of David" (Romans 1:3)','UNCURED','UNCURED'],
 ['P4 ROWS GIVE reference only','STEP: "The flesh of David reaches the child by the womb" -- ASSUMES: Mary is of the house of David -- ROWS GIVE: Romans 1:3','UNCURED','UNCURED'],
 ['P5 ASSUMES contested conclusions','STEP: "The flesh of David reaches the child by the womb" -- ASSUMES: the contested conclusions of Links 1-5 -- ROWS GIVE: "made of the seed of David according to the flesh" (Romans 1:3)','UNCURED','UNCURED'],
 ['P6 named missing layer (today)','The block lacks [L2].','CURED','CURED'],
 ['P7 [Ln] inside ASSUMES not read as a missing layer','ASSUMES: the [L2] word means seed -- ROWS GIVE: Romans 1:3','UNCURED','UNCURED'],
];
for(const [nm,txt,expT,expL] of P330){let t,l;try{l=run(NL,txt);}catch(e){l={status:'ERR '+e.message.slice(0,80)};}try{t=run(NT,txt);}catch(e){t={status:'ERR '+e.message.slice(0,80)};}
 ok(l.status===expL&&t.status===expT,nm+': live '+l.status+' (expect '+expL+'), target '+t.status+' (expect '+expT+') | '+String(t.why||'').slice(0,110));}
// 3. ASK 331 plants: data only until the build names its function; graded by the builder's replay plus these expectations
console.log('== ASK 331 expectations (wired to the built function at grade time)');
for(const [nm,exp] of [['judge MEETS, CHANGE TO MEETS, no count field','not counted'],['grade differs','counted'],['CONCEDED LINKS 0 vs 1 (hydrogen 40161 shape)','counted'],['DEFENSE STANDING differs, grade equal','counted'],['KEEP answer','counted'],['no answer','counted'],['unreadable CHANGE TO','counted'],['K-C cure, no send-back grade (37372 40694)','counted'],['E-GATE CHANGE TO MISSES vs MISSES (41074), if in scope','not counted'],['alternate path, grade equal','not counted']])console.log('  '+nm+' -> '+exp);
console.log(fails?'RESULT: '+fails+' FAIL':'RESULT: all checks pass');
