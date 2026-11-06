// pkgKS3 (W3 queue item 5: K-S3, the close-round concession item, to LIVE at zero false items). Run from wall2024/: node pkgKS3/build_KS3.cjs
// Base: pkgKC2/patched (3cd9bc7; order pkgRU, pkgKFR, pkgACR, pkgKC2). 22 library nodes.
// Promotion read (ks3/items.json, ks3/replies_view.txt): corpus 32998 to 33040 has 57 K-S3 cure items; 30 CURED, 27 UNCURED. All 27 UNCURED are
// engine faults: each judge answered the item, but the reader reads only the RESPONSE line for COUNTED or TOUCHES NO LINK, and these judges wrote
// TOUCHES NO LINK: <reason> on the STATEMENT line and NOT HELD: <reason> on the RESPONSE line (32998 chatgpt x4, 33006 sol x9, 33021 chatgpt x3,
// 33025 sol x1, 33040 chatgpt x2, 33040 sol x8; 33021 chatgpt's RESPONSE reads "Accepted as a grant ..., not a surrender of the link").
// (a) The K-S3 cure reads: COUNTED on the RESPONSE (as before); TOUCHES NO LINK with a reason of 5 words or more on the RESPONSE (as before)
//     or on the item's STATEMENT line; or NOT HELD with a reason of 5 words or more on the RESPONSE (NOT HELD on a K-S3 item says the
//     sentence is not a countable concession, which is what TOUCHES NO LINK says).
// (b) ENF_STATUS K-S3 LIVE; the item mark and the cure prompt say LIVE (left uncured after the cure, it removes the seat).
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const E=[
 ["'K-S3':'TRIAL'","'K-S3':'LIVE'",1,1,'ENF_STATUS K-S3 LIVE'],
 ["TRIAL cure item K-S3 (ruling 421): COUNTED, or TOUCHES NO LINK with its reason.","LIVE cure item K-S3 (ruling 421): COUNTED, or TOUCHES NO LINK with its reason; left uncured after the cure, it removes the seat.",1,1,'mark LIVE'],
 ["K-W and K-S3 are TRIAL rules: an item left unanswered removes no seat.","K-W is a TRIAL rule: an item left unanswered removes no seat. K-S3 is a LIVE rule: an item left unanswered after the cure removes the seat; NOT HELD: <reason> on the RESPONSE line, or TOUCHES NO LINK: <reason> on the RESPONSE or the STATEMENT line, answers it.",0,1,'cure prompt LIVE'],
 ["if(x.rule==='K-S3'){const rp=respOf(x)||'';if(/\\bCOUNTED\\b/.test(rp))return res('CURED','answered: the close concession is counted',[rp]);const m=rp.match(/\\bTOUCHES\\s+NO\\s+LINK\\b\\s*:?\\s*(.*)$/i);if(m&&m[1].split(/\\s+/).filter(Boolean).length>=5)return res('CURED','answered: it touches no declared link or listed premise, with its reason',[rp]);",
  "if(x.rule==='K-S3'){const rp=respOf(x)||'';if(/\\bCOUNTED\\b/.test(rp))return res('CURED','answered: the close concession is counted',[rp]);const m=rp.match(/\\bTOUCHES\\s+NO\\s+LINK\\b\\s*:?\\s*(.*)$/i);if(m&&m[1].split(/\\s+/).filter(Boolean).length>=5)return res('CURED','answered: it touches no declared link or listed premise, with its reason',[rp]);\n"
  +"   {const sp=stmtOf(x)||'';const ms=sp.match(/\\bTOUCHES\\s+NO\\s+LINK\\b\\s*:?\\s*(.*)$/i);if(ms&&ms[1].split(/\\s+/).filter(Boolean).length>=5)return res('CURED','answered on the STATEMENT line: it touches no declared link or listed premise, with its reason (pkgKS3)',['STATEMENT: '+sp].concat(rp?[rp]:[]));\n"
  +"    const mn=rp.match(/^\\s*NOT\\s+HELD\\b\\s*(?:as\\b[^:]*)?:?\\s*(.*)$/i);if(mn&&mn[1].split(/\\s+/).filter(Boolean).length>=5)return res('CURED','answered NOT HELD with its reason: the sentence is not a countable concession (pkgKS3)',[rp]);} /* pkgKS3 (a) */",0,1,'cure reader']];
const BASE='pkgKC2/patched';const plan={base:BASE+' (3cd9bc7)',nodes:[]};fs.mkdirSync('pkgKS3/patched',{recursive:true});
for(const f of fs.readdirSync(BASE).filter(f=>f.endsWith('.js')).sort()){const b=fs.readFileSync(BASE+'/'+f,'utf8');let t=b;const ed=[];
 for(const [a,c,mn,mx,tag] of E){const k=t.split(a).length-1;if(k<mn||k>mx)throw new Error(f+' '+tag+': x'+k);if(k){t=t.split(a).join(c);ed.push(tag);}}
 if(t.includes("'K-S3':'TRIAL'")||t.includes('TRIAL cure item K-S3'))throw new Error(f+' left TRIAL');new Function('$','$input','$json',t);
 fs.writeFileSync('pkgKS3/patched/'+f,t);plan.nodes.push({file:f,name:f.replace(/\.js$/,'').replace(/_/g,' '),base_sha:sha(b),final_sha:sha(t),edits:ed});}
fs.writeFileSync('pkgKS3/plan_KS3.json',JSON.stringify(plan,null,1));plan.nodes.forEach(x=>console.log(x.name.padEnd(28),x.base_sha,'->',x.final_sha,x.edits.join('; ')));
