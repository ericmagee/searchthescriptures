// pkgPSQ (D32 part 2, W1 3075; 33575 terra E-APPLY S8 false NOT APPLIED): psGrades strips a quoted span together with the sentence end inside it,
// so "Premise 2 is VOID ... to [DR2]'s 'These footings ... empowering.' Premises 3, 4, 5 and 6 are spared" became one clause and its first grade
// word (VOID) went to premises 2-6. The scope check then saw 3-5 move VOID -> SPARED and refused terra's CHANGE TO.
// Change (psGrades, every library node that has it): a stripped quote whose text ends in . ! or ? leaves a sentence break (" . ") in its place.
// Run from wall2024/: node pkgPSQ/build_PSQ.cjs [base strip] [dest strip] [plan]
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const SRC=(process.argv[2]||'pkgLIB/strip_KG7_22')+'/patched/',DST=(process.argv[3]||'pkgLIB/strip_PSQ')+'/patched/',PLAN=process.argv[4]||'pkgPSQ/plan_PSQ.json';fs.mkdirSync(DST,{recursive:true});
const A1=` t=t.replace(/\\([^()]*\\)/g,' ').replace(/"[^"\\n]*"|“[^”\\n]*”/g,' ').replace(/(^|[\\s(\\[:;,])['‘](?:[^'’\\n]|['’](?=[A-Za-z]))+?['’](?=$|[\\s.,;:!?)\\]])/g,'$1 ')`;
const B1=` t=t.replace(/\\([^()]*\\)/g,' ').replace(/"[^"\\n]*"|“[^”\\n]*”/g,q=>/[.!?]\\s*["”]$/.test(q)?' . ':' ').replace(/(^|[\\s(\\[:;,])(['‘](?:[^'’\\n]|['’](?=[A-Za-z]))+?['’])(?=$|[\\s.,;:!?)\\]])/g,(x,a,q)=>a+(/[.!?]\\s*['’]$/.test(q)?' . ':' ')) /* pkgPSQ: a quote ending a sentence keeps the sentence break */`;
const plan={base:SRC,nodes:{}};
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(SRC+f,'utf8');let s=s0;
 if(s0.includes('function psGrades(')){if(s0.split(A1).length!==2)throw new Error(f+' anchor x'+(s0.split(A1).length-1));s=s.replace(A1,()=>B1);new Function('$','$input',s);plan.nodes[f]={base:h(s0),patched:h(s)};}
 fs.writeFileSync(DST+f,s);}
fs.writeFileSync(PLAN,JSON.stringify(plan,null,1));console.log(Object.keys(plan.nodes).length+' nodes');
