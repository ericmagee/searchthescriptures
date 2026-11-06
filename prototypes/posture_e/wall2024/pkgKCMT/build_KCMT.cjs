// pkgKCMT (W3 queue item 5, part 2: K-CMT, the commitment tags, to LIVE at zero false items). Run from wall2024/: node pkgKCMT/build_KCMT.cjs
// Base: pkgKV/patched (order pkgRU, pkgKFR, pkgACR, pkgKC2, pkgKS3, pkgKW, pkgKV). 22 library nodes.
// Promotion read (ks3/kcmt_view.txt): the corpus 32998 to 33040 has 4 UNCURED K-CMT cure items (32998 chatgpt, 33021 chatgpt, 33025 grok,
// 33040 chatgpt). All 4 are engine faults: each judge named the commitment on the item's STATEMENT line ("The original top-line BROKEN grade
// applied Commitment 5; ..."; grok 33025 "(Commitment 5) CHALLENGER CONCEDED LINKS: 3. (Commitment 3) D1 vs C2 ...") and wrote a RESPONSE line
// ("Accepted ..."), but the cure reads only the RESPONSE.
// (a) The K-CMT cure reads the RESPONSE and, when a RESPONSE line is written, the item's STATEMENT line (no RESPONSE stays "no written response").
//     As respOf does, a STATEMENT headed by the bare rule ("STATEMENT: K-CMT | ...", grok 33025) is the item's when it is the one K-CMT item.
// (c) Raise: "not graded DEFENDER LINK BROKEN" is a negation (33021 grok's one-line item was false: KEYSTONE D5 -- STANDS -- ... not graded
//     DEFENDER LINK BROKEN); the engine's own SUPERSEDED BY CURE and "RESULT: ... derived after the send-back" lines are not the judge's grades.
// (b) ENF_STATUS K-CMT LIVE; the mark says LIVE (left unanswered after the cure, it removes the seat).
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const E=[
 ["'K-CMT':'TRIAL'","'K-CMT':'LIVE'",1,1,'ENF_STATUS K-CMT LIVE'],
 ["NOT A GRADE where the line carries a grade word but grades nothing. TRIAL rule: it removes no seat. REVIEW THIS ROW.]","NOT A GRADE where the line carries a grade word but grades nothing. LIVE rule: left unanswered after the cure, it removes the seat; a Commitment N or NOT A GRADE on its RESPONSE or STATEMENT line answers it.]",1,1,'mark LIVE'],
 ["t=t.replace(/\\b(?:none|no\\s+\\w+(?:\\s+\\w+)?)\\s+(?:(?:is|are|was|were)\\s+)?(?:counted\\s+as\\s+)?(?:BROKEN|FORCED|MISSES|VOID|UNPROVEN)\\b/gi,' ').replace(/\\bnot\\s+(?:BROKEN|FORCED|MISSES|VOID|UNPROVEN)\\b/gi,' ');",
  "t=t.replace(/\\b(?:none|no\\s+\\w+(?:\\s+\\w+)?)\\s+(?:(?:is|are|was|were)\\s+)?(?:counted\\s+as\\s+)?(?:BROKEN|FORCED|MISSES|VOID|UNPROVEN)\\b/gi,' ').replace(/\\bnot\\s+(?:(?:graded|counted|ruled|held)\\s+)?(?:(?:DEFENDER|CHALLENGER)\\s+)?(?:LINK\\s+)?(?:BROKEN|FORCED|MISSES|VOID|UNPROVEN)\\b/gi,' '); /* pkgKCMT (c): \"not graded DEFENDER LINK BROKEN\" negates (32998, 33021 grok KEYSTONE ... STANDS) */",1,1,'raise: negated link grade'],
 ["if(/^CLAUSE\\s*:/i.test(h))return false;","if(/^CLAUSE\\s*:/i.test(h))return false;if(/^SUPERSEDED BY CURE\\s*:/i.test(h)||/^RESULT\\s*:.*\\bderived after the send-back\\b/i.test(h))return false; /* pkgKCMT (c): engine-written lines (W3 2216) */",1,1,'raise: engine lines'],
 ["krulCure(x,reply&&reply.ok?reply.text:'',R,(x.rule==='K-CMT'?respOf(x):null))","krulCure(x,reply&&reply.ok?reply.text:'',R,(x.rule==='K-CMT'?(respOf(x)?respOf(x)+'\\n'+(stmtOf(x)||(items.filter(y=>y&&y.rule==='K-CMT').length===1?(o.statement.find(s=>{const L=NZ(s.label);return L==='K-CMT'||L.startsWith('K-CMT ');})||{}).text:'')||''):null):null)) /* pkgKCMT (a): the STATEMENT line too, once a RESPONSE is written */",0,1,'cure reads STATEMENT']];
const BASE='pkgKV/patched';const plan={base:BASE,nodes:[]};fs.mkdirSync('pkgKCMT/patched',{recursive:true});
for(const f of fs.readdirSync(BASE).filter(f=>f.endsWith('.js')).sort()){const b=fs.readFileSync(BASE+'/'+f,'utf8');let t=b;const ed=[];
 for(const [a,c,mn,mx,tag] of E){const k=t.split(a).length-1;if(k<mn||k>mx)throw new Error(f+' '+tag+': x'+k);if(k){t=t.split(a).join(c);ed.push(tag);}}
 if(t.includes("'K-CMT':'TRIAL'"))throw new Error(f+' left TRIAL');new Function('$','$input','$json',t);
 fs.writeFileSync('pkgKCMT/patched/'+f,t);plan.nodes.push({file:f,name:f.replace(/\.js$/,'').replace(/_/g,' '),base_sha:sha(b),final_sha:sha(t),edits:ed});}
fs.writeFileSync('pkgKCMT/plan_KCMT.json',JSON.stringify(plan,null,1));plan.nodes.forEach(x=>console.log(x.name.padEnd(28),x.base_sha,'->',x.final_sha,x.edits.join('; ')));
