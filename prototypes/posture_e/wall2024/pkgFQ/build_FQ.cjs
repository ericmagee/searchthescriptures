// pkgFQ (W2, from W3's 33020 chatgpt question). Run from wall2024/: node pkgFQ/build_FQ.cjs
// sbApply2024 stripped every leading and trailing quote from a CHANGE TO line, to unwrap a quoted answer. Since pkgFC a tagged
// "FORCED (Commitment N):" CHANGE TO is applied, and a FORCED line ends with the FAILS quote, so the written line lost its closing
// quote. KF_LINE then no longer reads it, ruling 411 no longer exempts the BROKEN line, and the K re-read raises a false K-G4
// (33020 chatgpt S14: D1 vs C2, counted 1 on pkgFC/pkgKS/pkgGL, 0 live). Fix: unwrap only a line that both opens and closes with a quote.
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const A="const to=one(String(x.to==null?'':x.to).replace(/\\\\+\"/g,'\"')).replace(/^[\"\\u201c]+|[\"\\u201d]+$/g,'').trim();";
const B="const to=one(String(x.to==null?'':x.to).replace(/\\\\+\"/g,'\"')).replace(/^[\"\\u201c]+([\\s\\S]*?)[\"\\u201d]+$/,(m,c)=>c).trim(); /* pkgFQ: unwrap only a fully quoted line; a FORCED line keeps its closing FAILS quote */";
const NODES=['Gate_Build','Alt_Gate_Build','Gate_Record','Alt_Gate_Record','Alternate_Merge','Alternate_Merge_Seat'];
fs.mkdirSync('pkgFQ/patched',{recursive:true});const plan={base:'pkgGL/patched (3370d1b)',nodes:[]};
for(const n of NODES){const b=rd('pkgGL/patched/'+n+'.js');const k=b.split(A).length-1;if(k!==1)throw new Error(n+': anchor count '+k);const s=b.split(A).join(B);
 fs.writeFileSync('pkgFQ/patched/'+n+'.js',s);plan.nodes.push({file:n+'.js',name:n.replace(/_/g,' '),base_sha:sha(b),final_sha:sha(s)});}
fs.writeFileSync('pkgFQ/plan_FQ.json',JSON.stringify(plan,null,1));plan.nodes.forEach(x=>console.log(x.name,x.base_sha,'->',x.final_sha));
