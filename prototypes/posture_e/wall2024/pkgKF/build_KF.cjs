// pkgKF (W3 queue item 5: K-F, forced retrieval discipline, to LIVE at zero false items). Run from wall2024/: node pkgKF/build_KF.cjs
// Base: pkgCK/patched (stack pkgRU, pkgKFR, pkgACR, pkgKC2, pkgKS3, pkgKW, pkgKV, pkgKCMT, pkgPAY, pkgPS, pkgSBR, pkgRC, pkgCK). 22 library nodes.
// Promotion read (pkgKF/test_KF.cjs): the corpus 32998 to 33040 has 11 K-F cure items, 8 UNCURED.
//  - 33006 chatgpt D1 vs C3, 33006 sol D1 vs C2 and D2 vs C3: ENGINE FAULT. Each reply holds a FORCED line for the item, but the reply is a
//    JSON object (chatgpt and sol answer in JSON) and the K-F cure split the raw text, so the line sat inside the "reasoning" string with
//    escaped breaks and was never seen ("no FORCED line"). Every other cure check reads the reply through cureUnwrap (cureLines).
//  - 32998 gemini D3 vs C1: today's raise (pkgKFR reader) no longer raises it on the 32998 rounds; the log item came from the old reader.
//  - 33006 single x3 and 33021 single x1: no saved rounds for the single judge (no node fixture), so the quotes cannot be checked offline.
//  - Today's raise on every saved verdict with rounds (6 runs): 1 item, 33025 grok D5 vs C5, a true item (the ANSWER quotation adds
//    "therefore" and is not in [DR3]); grok retracted it, CURED.
// (a) The K-F cure reads the reply through cureUnwrap. The same raw split in the K-R and K-LXX cures (record-only) is fixed with it.
// (b) ENF_STATUS K-F LIVE; the three K-F marks say LIVE (left uncured after the cure, it removes the seat).
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const RAW="String(reply&&reply.ok?reply.text:'').split('\\n')",UNW="String(cureUnwrap(reply&&reply.ok?reply.text:'')).split('\\n')";
const E=[
 ["'K-F':'TRIAL'","'K-F':'LIVE'",1,1,'ENF_STATUS K-F LIVE'],
 [RAW,UNW,0,3,'K-F, K-R, K-LXX cures read the reply through cureUnwrap'],
];
const MK=[ // inside kfLines only
 ["is not in the form FORCED: D<i> vs C<j> -- MEANS [<round>]: \"<...>\" -- ANSWER [<round>]: \"<...>\" -- FAILS: \"<...>\". TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]","is not in the form FORCED: D<i> vs C<j> -- MEANS [<round>]: \"<...>\" -- ANSWER [<round>]: \"<...>\" -- FAILS: \"<...>\". LIVE rule: left uncured after the cure, it removes the seat. REVIEW THIS ROW.]"],
 ["the judge supplies none of its own). TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]","the judge supplies none of its own). LIVE rule: left uncured after the cure, it removes the seat. REVIEW THIS ROW.]"],
 ["(ruling 396). TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]","(ruling 396). LIVE rule: left uncured after the cure, it removes the seat. REVIEW THIS ROW.]"],
];
const BASE='pkgCK/patched';const plan={base:BASE,nodes:[]};fs.mkdirSync('pkgKF/patched',{recursive:true});
for(const f of fs.readdirSync(BASE).filter(f=>f.endsWith('.js')).sort()){const b=fs.readFileSync(BASE+'/'+f,'utf8');let t=b;const ed=[];
 for(const [a,c,mn,mx,tag] of E){const k=t.split(a).length-1;if(k<mn||k>mx)throw new Error(f+' '+tag+': x'+k);if(!k){if(mn>0)throw new Error(f+' '+tag+': x0');continue;}if(tag.startsWith('K-F, K-R')&&k!==3)throw new Error(f+' '+tag+': x'+k);t=t.split(a).join(c);ed.push(tag);}
 const i=t.indexOf('function kfLines('),j=t.indexOf('const KR_LINE=',i);if(i<0||j<0)throw new Error(f+' kfLines not found');let body=t.slice(i,j);
 for(const [a,c] of MK){const k=body.split(a).length-1;if(k!==1)throw new Error(f+' mark x'+k+': '+a.slice(0,50));body=body.split(a).join(c);}
 if(/TRIAL rule/.test(body))throw new Error(f+' kfLines keeps a TRIAL mark');t=t.slice(0,i)+body+t.slice(j);ed.push('K-F marks LIVE');
 if(t.includes("'K-F':'TRIAL'"))throw new Error(f+' left TRIAL');new Function('$','$input','$json',t);
 fs.writeFileSync('pkgKF/patched/'+f,t);plan.nodes.push({file:f,name:f.replace(/\.js$/,'').replace(/_/g,' '),base_sha:sha(b),final_sha:sha(t),edits:ed});}
fs.writeFileSync('pkgKF/plan_KF.json',JSON.stringify(plan,null,1));plan.nodes.forEach(x=>console.log(x.name.padEnd(28),x.base_sha,'->',x.final_sha,x.edits.join('; ')));
