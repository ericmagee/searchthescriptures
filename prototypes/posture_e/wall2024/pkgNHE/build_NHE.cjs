// pkgNHE (W2, run 33129 sol K-W DR3 LINK 3): nhqFull, which recovers a K-W flagged sentence's full text from its round for the NOT HELD quote test,
// ended the sentence at the third dot of an ellipsis ("a 'father'... near or more remote" stopped at "..."), so a NOT HELD that quoted the real
// sentence was refused. The sentence end now skips a dot that is part of "..." (the pkgMK class: dots read as a boundary). One regex, in all 22
// library nodes that carry nhqFull. Base: pkgKVQ/patched (live library). Run from wall2024/: node pkgNHE/build_NHE.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const BASE='pkgKVQ/patched',OUT='pkgNHE/patched';fs.mkdirSync(OUT,{recursive:true});const plan={base:BASE,nodes:[]};
const A="const e=t.slice(from).search(/[.!?](?=[\"')\\]]*(?:\\s|$))/);";
const B="const e=t.slice(from).search(/(?<!\\.)[.!?](?!\\.)(?=[\"')\\]]*(?:\\s|$))/); /* pkgNHE: an ellipsis is not a sentence end */";
for(const f of fs.readdirSync(BASE).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(BASE+'/'+f,'utf8');const n=s0.split(A).length-1;if(n!==1)throw new Error(f+': anchor '+n);
 const s=s0.replace(A,()=>B);new Function('$','$input','$json',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base:BASE,base_sha:sha(s0),final_sha:sha(s),edits:1});}
fs.writeFileSync('pkgNHE/plan_NHE.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes');
