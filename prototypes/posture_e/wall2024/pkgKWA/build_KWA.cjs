// pkgKWA (W3 2026-11-06, 33160 sol K-W DEFENDER CR2 D6 #8; 33129 "CONCEDED as an independently sufficient limb."): the K-W CONCEDED form (kwCo)
// also reads CONCEDED at a sentence start followed by an "as" or "as to" qualifier, to the sentence end ("CONCEDED as to the additional
// maternal-list route, already counted under defender premise 6."). Everything pkgKWC reads is read as before; "CONCEDED LINKS" is still
// excluded; lowercase or mid-sentence "conceded" is still not the form. 19 kwCo nodes. Base: pkgKVE/patched. Run from wall2024/.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const BASE='pkgKVE/patched',OUT='pkgKWA/patched';fs.mkdirSync(OUT,{recursive:true});const plan={base:BASE,nodes:[]};
const A="(?:\\s+[A-Za-z][A-Za-z'\\u2019-]*){1,4}\\s*(?::|--|\\u2014))/.test(String(t));";
const B="(?:\\s+[A-Za-z][A-Za-z'\\u2019-]*){1,4}\\s*(?::|--|\\u2014)|\\s+as(?:\\s+to)?\\s+[A-Za-z])/.test(String(t)); /* pkgKWA: or an \"as\" / \"as to\" qualifier to the sentence end */";
for(const f of fs.readdirSync(BASE).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(BASE+'/'+f,'utf8');const n=s0.split(A).length-1;
 if(n===0){fs.writeFileSync(OUT+'/'+f,s0);continue;}if(n!==1)throw new Error(f+': anchor '+n);
 const s=s0.replace(A,()=>B);new Function('$','$input','$json',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base:BASE,base_sha:sha(s0),final_sha:sha(s),edits:1});}
fs.writeFileSync('pkgKWA/plan_KWA.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes edited');
