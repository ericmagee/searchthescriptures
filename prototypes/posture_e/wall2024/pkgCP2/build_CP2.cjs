// pkgCP2 (W3 2357). Run from wall2024/: node pkgCP2/build_CP2.cjs
// The pair check takes the collision reader's own form (the K-RUL reader in drvCheck): same prefix, a required ":" after the label and an
// optional (...) and text, then the grade word, case-sensitive: DEFENDER LINK BROKEN, CHALLENGER LINK BROKEN, UNDERDETERMINED, STANDS, WITHDRAWN.
// A lower-case grade or a dash separator is no longer applied without being read; a WITHDRAWN regrade applies.
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const A="const GR=/^\\s*(?:[-\\u2022]|\\d+[.)])?\\s*D\\d+\\s+VS\\.?\\s+C\\d+\\b\\s*(?:\\([^)]*\\))?\\s*(?::|--|\\u2014|\\u2013)?\\s*(?:DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS)\\b/i;";
const B="const GR=/^\\s*(?:[-\\u2022*]\\s*|\\d+[.)]\\s*)?\\**D\\d+\\s+vs\\.?\\s+C\\d+\\b(?:\\s*\\([^)\\n]*\\))?[^:\\n(]*:\\s*\\**(?:DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS|WITHDRAWN)\\b/; /* pkgCP2 (W3 2357): the collision reader's form, case-sensitive, \":\" required */";
const A2="GR.test(nrm(to))",B2="GR.test(to)";
const NODES=['Gate_Build','Alt_Gate_Build','Gate_Record','Alt_Gate_Record','Alternate_Merge','Alternate_Merge_Seat'];
fs.mkdirSync('pkgCP2/patched',{recursive:true});const plan={base:'pkgCP/patched (5bf1485)',nodes:[]};
for(const n of NODES){const b=rd('pkgCP/patched/'+n+'.js');for(const [x,k] of [[A,1],[A2,1]]){const c=b.split(x).length-1;if(c!==k)throw new Error(n+': anchor count '+c);}
 const s=b.split(A).join(B).split(A2).join(B2);fs.writeFileSync('pkgCP2/patched/'+n+'.js',s);plan.nodes.push({file:n+'.js',name:n.replace(/_/g,' '),base_sha:sha(b),final_sha:sha(s)});}
fs.writeFileSync('pkgCP2/plan_CP2.json',JSON.stringify(plan,null,1));plan.nodes.forEach(x=>console.log(x.name,x.base_sha,'->',x.final_sha));
