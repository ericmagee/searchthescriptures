// pkgKC2 (W3 queue item 3: K-CON to LIVE at zero false items). Run from wall2024/: node pkgKC2/build_KC2.cjs
// Base: pkgRU/patched (graded, 6c1283e; live 868b0814 + pkgRU). PENDING W3's ruling on Wall 2410 ask 1.
// (a) A verified contradiction (VC) charges another seat only when at least two seats wrote the same pair independently in their
//     verdicts (vcBuild2024 in Panel Payloads). One judge's CONTRADICTION line stays its own finding, as pkgVC did. Corpus: the 32998
//     pair (grok alone; read FALSE, Wall 2410) no longer charges gemini and chatgpt.
// (b) K-CON returns to LIVE: the reverse of pkgKCON's two edits (ENF_STATUS and the K-CON item text), in all 22 library nodes.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const E1=["'K-CON':'TRIAL'","'K-CON':'LIVE'"];
const E2=["or REASSERTED IN with the quote. TRIAL rule: answer it in the cure; it removes no seat.","or REASSERTED IN with the quote. LIVE rule: left uncured after the cure, it removes the seat."];
const V1=" return [...V.values()];}\nfunction vcCaught2024";
const V2=" return [...V.values()].filter(v=>new Set(v.by).size>=2); /* pkgKC2 (a): a VC needs two seats that wrote the pair */}\nfunction vcCaught2024";
const BASE=process.env.BASE||'pkgRU/patched'; /* stack: BASE=pkgKFR/patched node pkgKC2/build_KC2.cjs */
const plan={base:BASE,nodes:[]};
for(const f of fs.readdirSync(BASE).sort()){const b=fs.readFileSync(BASE+'/'+f,'utf8');let t=b;const ed=[];
 if(t.split(E1[0]).length-1!==1)throw new Error(f+' E1');t=t.replace(E1[0],E1[1]);ed.push('ENF_STATUS K-CON LIVE');
 const k=t.split(E2[0]).length-1;if(k<1||k>2)throw new Error(f+' E2 x'+k);t=t.split(E2[0]).join(E2[1]);ed.push('K-CON item text LIVE x'+k);
 if(t.includes('function vcBuild2024')){if(t.split(V1).length-1!==1)throw new Error(f+' V1');t=t.replace(V1,V2);ed.push('VC two seats');}
 if(t.includes("'K-CON':'TRIAL'"))throw new Error(f+' left');new Function('$','$input','$json',t);
 fs.writeFileSync('pkgKC2/patched/'+f,t);plan.nodes.push({file:f,name:f.replace(/\.js$/,'').replace(/_/g,' '),base_sha:sha(b),final_sha:sha(t),edits:ed});}
fs.writeFileSync('pkgKC2/plan_KC2.json',JSON.stringify(plan,null,1));plan.nodes.forEach(x=>console.log(x.name.padEnd(28),x.base_sha,'->',x.final_sha,x.edits.join('; ')));
