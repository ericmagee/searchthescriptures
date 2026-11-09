// pkgKNL (W2, 11-09; W3 grade_34016 countermeasure 2): a FORCED line that grades nothing ("FORCED: none", "FORCED: none graded.") raises no K-F item and no K-CMT item.
// Case: run 34016, Haiku (alternate for luna): "FORCED: none graded." raised K-F FORCED (malformed) and K-CMT (a contested grade line), both uncurable.
// Two substitutions per library file: (1) kfLines skips a none line before the FORCED form check; (2) kcmtGrade2024 returns false for a none line.
// knlNone2024 (rev 3, allow-list): the line is FORCED: (Commitment N)? followed ONLY by none / nil / n/a / no / nothing / zero / 0, optionally with graded / forced / link(s) (is|are) graded|forced, a full stop, or (Commitment N). Any other text is checked as before.
// Base: live s76 library strip_CJR_KRC (s75 + pkgCJR + pkgKRC, Shared Library 3f7270edaa30). Run from wall2024/: node pkgKNL/build_KNL.cjs [base strip] [out strip]
const fs=require('fs'),cr=require('crypto');const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const BASE=process.argv[2]||'pkgLIB/strip_CJR_KRC',OUT=process.argv[3]||'pkgLIB/strip_KNL';
const A0=String.raw`if(!ri4IsF2024(l,/^(?:[-•]|\d+[.)])?\s*FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:/i))continue;const m=l.match(KF_LINE);
  if(!m){const id=`;
const A1=String.raw`if(!ri4IsF2024(l,/^(?:[-•]|\d+[.)])?\s*FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:/i))continue;if(knlNone2024(l))continue; /* pkgKNL */const m=l.match(KF_LINE);
  if(!m){const id=`;
const B0=String.raw`if(/\bCommitments?\s*\d+/i.test(h))return false;`;
const B1=String.raw`if(/\bCommitments?\s*\d+/i.test(h))return false;if(knlNone2024(h))return false; /* pkgKNL */`;
const F0='function kfLines(text,R){';
const F1=String.raw`function knlNone2024(l){const s=String(l==null?'':l).replace(/[*_`+'`'+String.raw`]+/g,'').trim().replace(/^(?:[-•>]|\d+[.)])\s*/,'');const m=s.match(/^FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:\s*(.*)$/i);if(!m)return false;const r=m[1].trim(); /* pkgKNL */
 return /^(?:none|nil|n\/a|no|nothing|zero|0)(?:\s+(?:graded|forced|links?\s+(?:is\s+|are\s+)?(?:graded\s+)?(?:graded|forced)))?\s*\.?\s*(?:\(\s*Commitment\s+\d+\s*\)\s*\.?)?$/i.test(r);} /* rev 3 (W3 3576): an allow-list; the none word alone or with a short tail, and nothing else */
`+F0;
const sub=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': '+n+' hits for '+a.slice(0,60));return s.split(a).join(b);};
fs.rmSync(OUT,{recursive:true,force:true});fs.mkdirSync(OUT+'/patched',{recursive:true});const plan={base:BASE,library:{}};
for(const f of fs.readdirSync(BASE+'/patched').filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(BASE+'/patched/'+f,'utf8');
 let s=sub(s0,A0,A1,f);s=sub(s,B0,B1,f);s=sub(s,F0,F1,f);new Function('$','$input','return (async()=>{\n'+s+'\n})();');
 fs.writeFileSync(OUT+'/patched/'+f,s);plan.library[f]={base:h(s0),patched:h(s)};}
fs.writeFileSync('pkgKNL/plan_KNL.json',JSON.stringify(plan,null,1)+'\n');console.log('library',Object.keys(plan.library).length);
