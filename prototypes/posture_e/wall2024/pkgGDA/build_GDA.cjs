// pkgGDA (W2, 11-08; 33627 gemini removed on 4 duplicate gate items, Wall W2 check): a gate CHANGE that repeats an original send-back change
// the gate item came from (E-APPLY NOT APPLIED of S<n>), word for word, is cured when that original change is applied in the same pass.
// 33627: S5 "RETRACTED: D2 vs C3" (refused by pkgRFL while D2 vs C3 was BROKEN) made G6; the gate regraded D2 vs C3 (G1) and repeated
// "RETRACTED: D2 vs C3" (G6). In gateCure2024's one apply pass S5 is applied first, so G6's own copy finds no FORCED line left and reads
// "no line form", and G6 was scored "the gate change was not applied" (UNCURED, counted in drv_uncured) though its intent stands in the text.
// Run from wall2024/: node pkgGDA/build_GDA.cjs <base strip dir> <dest strip dir> <plan file>
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const SRC=(process.argv[2]||'pkgLIB/strip_R1B')+'/patched/',DST=(process.argv[3]||'pkgLIB/strip_GDA')+'/patched/',PLAN=process.argv[4]||'pkgGDA/plan_GDA.json';fs.mkdirSync(DST,{recursive:true});
const A1="  cured=a.ans==='KEEP'||applied.has(x.gid)||dup||sup;";
const B1="  const __gda=!(a.ans==='KEEP'||applied.has(x.gid)||dup||sup)?gdaDup2024(x,a,its,applied):null;cured=a.ans==='KEEP'||applied.has(x.gid)||dup||sup||!!__gda;";
const A2="+(__gsuRep?' (apply record; pkgGSU)':''):'the gate change was not applied');}";
const B2="+(__gsuRep?' (apply record; pkgGSU)':''):(__gda||'the gate change was not applied'));}";
const FN="/* pkgGDA (W2, 33627 gemini G6-G9): a gate CHANGE repeating, word for word, the original change S<n> its E-APPLY item came from is cured when S<n> is applied in the same pass */\n"
 +"function gdaDup2024(x,a,its,applied){try{if(!x||!a||a.ans!=='CHANGE'||!a.to||applied.has(x.gid)||!x.sid||!/^E-APPLY\\b/.test(String(x.src||''))||!applied.has(x.sid))return null;\n"
 +" const o=(its||[]).find(z=>z&&z.sid===x.sid);if(!o||!o.to)return null;const N=s=>String(s==null?'':s).replace(/\\\\+/g,'').replace(/[*_`]+/g,'').replace(/[\"\\u201c\\u201d]+/g,'').replace(/\\s+/g,' ').trim().replace(/[.\\s]+$/,'').toUpperCase();\n"
 +" if(!N(a.to)||N(a.to)!==N(o.to))return null;return 'the gate change repeats '+x.sid+' word for word, and '+x.sid+' was applied in the same pass, so its line stands as asked (pkgGDA)';}catch(e){return null;}}\n";
const A0='function gateCure2024(';
const plan={base:SRC,nodes:{}};
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(SRC+f,'utf8');let s=s0;
 if(s0.includes(A0)){for(const a of [A0,A1,A2])if(s0.split(a).length!==2)throw new Error(f+' anchor '+a.slice(0,40));s=s.replace(A0,()=>FN+A0).replace(A1,()=>B1).replace(A2,()=>B2);new Function('$','$input',s);plan.nodes[f]={base:h(s0),patched:h(s)};}
 fs.writeFileSync(DST+f,s);}
fs.writeFileSync(PLAN,JSON.stringify(plan,null,1));console.log(plan.nodes);
