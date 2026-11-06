// pkgCP (W3 2351, grade_33021 section 3). Run from wall2024/: node pkgCP/build_CP.cjs
// A CHANGE TO that answers a send-back or gate item whose LINE is a collision line or a FORCED line for D<i> vs C<j> must itself be a
// collision line for the same pair ("D<i> vs C<j> (...): <grade>"), the grade word DEFENDER LINK BROKEN, CHALLENGER LINK BROKEN, UNDERDETERMINED
// or STANDS (W3 grade_33021 section 3 names "D1 vs C1 (Matthew 1:18): STANDS" as an honest answer). A FORCED line may also be replaced by a FORCED line for the same pair, since
// its collision line stays. Otherwise the change is NOT APPLIED, "the change drops the collision D<i> vs C<j>", and the item stays uncured.
// Case: 33021 gemini S9 (FORCED D1 vs C1 -> "D1: STANDS") and G1 (D1 vs C1 CHALLENGER LINK BROKEN -> "D1: STANDS") deleted the pair's grade.
// sbApply2024 is the one apply path for send-back and gate changes; it lives in the 6 gate library nodes.
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const A="  if(!to||!SB_FORM.test(to)){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the CHANGE TO line has no line form the engine reads',to});continue;}\n";
const B=A+"  {const PR=/^\\s*(?:[-\\u2022]|\\d+[.)])?\\s*(?:FORCED(?:\\s*\\(\\s*Commitment\\s+\\d+\\s*\\))?\\s*:\\s*)?(D\\d+)\\s+VS\\.?\\s+(C\\d+)\\b/i;const FR=/^\\s*(?:[-\\u2022]|\\d+[.)])?\\s*FORCED\\b/i; /* pkgCP (W3 2351): a change to a collision or FORCED line keeps the pair */\n"
 +"   const pOf=l=>{const m=nrm(l).match(PR);return m?(m[1]+' VS '+m[2]).toUpperCase():null;};const pk=pOf(o);\n"
 +"   const GR=/^\\s*(?:[-\\u2022]|\\d+[.)])?\\s*D\\d+\\s+VS\\.?\\s+C\\d+\\b\\s*(?:\\([^)]*\\))?\\s*(?::|--|\\u2014|\\u2013)?\\s*(?:DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS)\\b/i; /* the grade word follows the label (W2 2352 C: a label with no grade word is no regrade) */\n"
 +"   if(pk){const tp=pOf(to);const ok=tp===pk&&(FR.test(nrm(to))?FR.test(nrm(o)):GR.test(nrm(to)));\n"
 +"    if(!ok){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the change drops the collision '+pk.replace(' VS ',' vs ')+' (W3 2351: a change to a collision or FORCED line must be a collision line for the same pair)',to,lines:[o]});continue;}}} /* lines: the gate item names the line, so a same-pair regrade at the gate finds it (W2 2355) */\n";
const A2="const st=!applied.has(x.gid)&&a.ans==='CHANGE'&&gateStands2024(a.to,R2.T1);";
const B2="const st=!applied.has(x.gid)&&a.ans==='CHANGE'&&!((R2.R1&&R2.R1.items)||[]).some(z=>z&&z.sid===x.gid&&/drops the collision/.test(String(z.why||'')))&&gateStands2024(a.to,R2.T1); /* pkgCP: a change refused for dropping its collision does not cure as a line already in the text (W2 2352 E) */";
const NODES=['Gate_Build','Alt_Gate_Build','Gate_Record','Alt_Gate_Record','Alternate_Merge','Alternate_Merge_Seat'];
fs.mkdirSync('pkgCP/patched',{recursive:true});const plan={base:'pkgKF/patched (cb28f80, live 5f29c9bd)',nodes:[]};
for(const n of NODES){const b=rd('pkgKF/patched/'+n+'.js');const k=b.split(A).length-1;if(k!==1)throw new Error(n+': anchor count '+k);if(b.split(A2).length!==2)throw new Error(n+': anchor 2');
 const s=b.split(A).join(B).split(A2).join(B2);fs.writeFileSync('pkgCP/patched/'+n+'.js',s);plan.nodes.push({file:n+'.js',name:n.replace(/_/g,' '),base_sha:sha(b),final_sha:sha(s)});}
fs.writeFileSync('pkgCP/plan_CP.json',JSON.stringify(plan,null,1));plan.nodes.forEach(x=>console.log(x.name,x.base_sha,'->',x.final_sha));
