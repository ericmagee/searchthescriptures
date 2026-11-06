// pkgSQ (W1, Wall 2501): E-APPLY K-S3 row lookup folds quote marks. Run from wall2024/: node pkgSQ/build_SQ.cjs [base, default pkgRCK] [out, default pkgSQ] (pkgKCL -> pkgSQK, W3 2503)
// Run 33060 chatgpt S1, S2, S4 were NOT APPLIED ("the flagged line is not in the judge text"): a K-S3 CHANGE TO in the row form is matched to
// the judge's own OUT-OF-ROUND row by side, round and sentence (__sk). The judge's row quotes inside the sentence with "came together"; the
// CHANGE TO wraps the sentence in quotes and so nests the inner quote as 'came together' (curly). __sk compared the quote marks, so the rows
// with an inner quote were not found (S3, with none, applied). __sk now drops every quote mark (straight and curly, single and double) and
// backslashes before it compares; the words must still match exactly. 6 gate nodes; the other 16 are copied unchanged.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const OLD="const __sk=s=>String(s||'').replace(/^[\"\\u201c]+|[\"\\u201d]+$/g,'').replace(/\\s+/g,' ').trim().toUpperCase();";
const NEW="const __sk=s=>String(s||'').replace(/\\\\+/g,'').replace(/[\"'`\\u2018\\u2019\\u201c\\u201d]/g,'').replace(/\\s+/g,' ').trim().toUpperCase(); /* pkgSQ: quote marks folded (33060 chatgpt S1, S2, S4) */";
const BASE=(process.argv[2]||'pkgRCK')+'/patched';const OUT=process.argv[3]||'pkgSQ';const plan={base:BASE,nodes:[]};fs.rmSync(OUT+'/patched',{recursive:true,force:true});fs.mkdirSync(OUT+'/patched',{recursive:true});
for(const f of fs.readdirSync(BASE).filter(f=>f.endsWith('.js')).sort()){const b=fs.readFileSync(BASE+'/'+f,'utf8');const k=b.split(OLD).length-1;if(k>1)throw new Error(f+' x'+k);
 const t=k?b.split(OLD).join(NEW):b;new Function('$','$input','$json',t);fs.writeFileSync(OUT+'/patched/'+f,t);plan.nodes.push({file:f,base_sha:sha(b),final_sha:sha(t),edits:k?['__sk quote fold']:[]});}
const n=plan.nodes.filter(x=>x.edits.length).length;if(n!==6)throw new Error('edited '+n+', expected 6');
fs.writeFileSync(OUT+'/plan_SQ.json',JSON.stringify(plan,null,1));plan.nodes.forEach(x=>console.log(x.file.padEnd(32),x.base_sha,'->',x.final_sha,x.edits.join('; ')));
