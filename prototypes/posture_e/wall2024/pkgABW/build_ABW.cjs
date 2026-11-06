// pkgABW (W3, Wall 2596; run 33149): the pkgABS absence pattern also reads "without asserting/stating/naming/saying/claiming/mentioning/specifying/
// denying/excluding" and the passive "is/are/was/were (itself) not denied/contradicted/excluded/disputed/ruled out/rejected/negated".
// Base: pkgUNL/patched 2ad8e0d (graded PASS, W4 writes next gap) = live ff8967bb + pkgUNL. Run from wall2024/: node pkgABW/build_ABW.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const OLD=fs.readFileSync('pkgABS/src_ABS.js','utf8'),NEW=fs.readFileSync('pkgABW/src_ABW.js','utf8');
const BASE='pkgUNL/patched',OUT='pkgABW/patched';fs.mkdirSync(OUT,{recursive:true});const plan={base:BASE+' 2ad8e0d',nodes:[]};
for(const f of ['Send_Back_Build.js','Alt_Send_Back_Build.js','Send_Back_Record.js','Alt_Send_Back_Record.js']){const s0=fs.readFileSync(BASE+'/'+f,'utf8');
 const n=s0.split(OLD).length-1;if(n!==1)throw new Error(f+': src_ABS found '+n+' times');const s=s0.replace(OLD,()=>NEW);
 new Function('$','$input','$json',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base_sha:sha(s0),final_sha:sha(s),edits:1});console.log(f.padEnd(28),sha(s0),'->',sha(s));}
fs.writeFileSync('pkgABW/plan_ABW.json',JSON.stringify(plan,null,1));
