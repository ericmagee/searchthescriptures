// pkgEAK2 (W2, 11-08; W3 3121): the seated alternate's DeepSeek K-W check must run even when the alternate's text gives no decision line
// or synthesis claim. pkgEAK appended eakItems2024() at the end, after the early je_skip, so a run with only K-W/K-S3 cure rows
// (33430, 33497: 'no panel judgment text') never called DeepSeek. Now the early skip holds only when there is also no alternate K-W/K-S3 cure row, and the
// final return carries the build's code_rows on the K-W call when it is the only call, and falls back to the skip if nothing is built.
// Run from wall2024/: node pkgEAK2/build_EAK2.cjs [base file] [out file]   (base default: pkgEHF/patched, = live s59 + EHF, which carries EAK)
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const SRC=process.argv[2]||'pkgEHF/patched/Alt_Judge_Enforcer_Build.js',DST=process.argv[3]||'pkgEAK2/patched/Alt_Judge_Enforcer_Build.js';
const s0=fs.readFileSync(SRC,'utf8');
const SKIP="if(!items.length)return [{json:{je_skip:true,why:'no judge decision line and no synthesis claim was read',items:[],code_rows}}];";
const A=[["if(!judges.length)return skip('no panel judgment text');","if(!judges.length&&!eakHas2024())return skip('no panel judgment text'); /* pkgEAK2: the seated alternate's text is not in the panel bodies (33430, 33497); its K-W rows still get their call */"],
 [SKIP,"if(!items.length&&!eakHas2024())return [{json:{je_skip:true,why:'no judge decision line and no synthesis claim was read',items:[],code_rows}}]; /* pkgEAK2: an alternate K-W/K-S3 cure row still gets its DeepSeek call */"],
 ["const __eakR=R;\nreturn [].concat(calls.filter(","const __eakR=R;\nconst __eak2=[].concat(calls.filter("],
 ["eakItems2024()); /* pkgEAK: the alternate's K-W call goes last */\n","(__x=>{if(!calls.some(c=>c.length)&&__x[0])__x[0].json.code_rows=code_rows;return __x;})(eakItems2024())); /* pkgEAK: the alternate's K-W call goes last; pkgEAK2: it carries code_rows when it is the only call */\nreturn __eak2.length?__eak2:[{json:{je_skip:true,why:'no judge decision line and no synthesis claim was read'+(eakHas2024()?' (the alternate K-W check built no call)':''),items:[],code_rows}}];\n"],
 ["function eakItems2024(){","function eakHas2024(){try{let L=[];try{L=$('Alternate Merge Seat').first().json.enforcer_log||[];}catch(e){L=[];}return L.some(r=>r&&r.kind==='cure'&&r.seat_role==='alternate'&&(r.rule==='K-W'||r.rule==='K-S3'));}catch(e){return false;}}\nfunction eakItems2024(){"]];
let s=s0;for(const [a,b] of A){if(s.split(a).length!==2)throw new Error('anchor '+a.slice(0,60));s=s.replace(a,()=>b);}
new Function('$','$input','$json',s);fs.mkdirSync(require('path').dirname(DST),{recursive:true});fs.writeFileSync(DST,s);
const plan={base:SRC,nodes:{'Alt Judge Enforcer Build':{base:h(s0),patched:h(s)}}};fs.writeFileSync('pkgEAK2/plan_EAK2.json',JSON.stringify(plan,null,1));console.log(plan);
