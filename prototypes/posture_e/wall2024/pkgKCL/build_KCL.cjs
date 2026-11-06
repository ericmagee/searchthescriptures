// pkgKCL (W3 queue, Wall 2437: the per-line commitment tag for K-CMT). Run from wall2024/: node pkgKCL/build_KCL.cjs
// Base: pkgKF/patched (whole stack through pkgCK, K-F LIVE). 22 library nodes.
// Before: one K-CMT item per judgment ("contested grades without a commitment", up to five lines shown); one Commitment N anywhere on its
// RESPONSE cured every line (W3 2437: that is the bar the prompt states today; a per-line tag changes the item and the prompt).
// (a) Raise: one K-CMT item per contested grade line, link "line <k>" (k = 1, 2, ... in the judgment's order), the line quoted in full
//     (to 400 characters) on the item, and the item names its own answer: RESPONSE: K-CMT line <k> | (Commitment N), or NOT A GRADE.
//     Which lines are contested is unchanged (kcmtGrade2024, as graded in pkgKCMT).
// (b) The cure prompt is the item text: each line is listed as its own flagged item, "K-CMT line <k>: ..." (cureAsk prints cureLabel and the line).
// (c) Cure: unchanged per item. Its RESPONSE (or, with a RESPONSE written, its STATEMENT) names a Commitment N or NOT A GRADE; the bare
//     "RESPONSE: K-CMT | ..." still answers when the judgment has only one contested line (pkgKCMT fallback, one item of its rule).
// (d) The AUDIT mark counts the lines and says each line is its own item; LIVE rule wording kept.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const OLD_ITEM=" items.push({rule:'K-CMT',side:'JUDGE',link:'contested grades without a commitment',line:L.length+' contested grade line'+(L.length===1?'':'s')+' name no commitment (answer each with its Commitment N, or NOT A GRADE); first: '+L.slice(0,5).map(l=>'\"'+l.slice(0,160)+'\"').join('; ')});";
const NEW_ITEM=" L.forEach((l,k)=>items.push({rule:'K-CMT',side:'JUDGE',link:'line '+(k+1),line:'\"'+l.slice(0,400)+'\" -- this contested grade line names no commitment. Answer this line on its own: RESPONSE: K-CMT line '+(k+1)+' | (Commitment N), the commitment the grade applies; or NOT A GRADE where the line carries a grade word but grades nothing.'})); /* pkgKCL (a): one item per line (W3 2437) */";
const OLD_MARK="the judge answers each line with its (Commitment N), or NOT A GRADE where the line carries a grade word but grades nothing. LIVE rule: left unanswered after the cure, it removes the seat; a Commitment N or NOT A GRADE on its RESPONSE or STATEMENT line answers it.]";
const NEW_MARK="each line is its own item (K-CMT line 1, line 2, ...); the judge answers each line with its (Commitment N), or NOT A GRADE where the line carries a grade word but grades nothing. LIVE rule: a line left unanswered after the cure removes the seat; a Commitment N or NOT A GRADE on the RESPONSE or STATEMENT of that line answers it.]";
const E=[[OLD_ITEM,NEW_ITEM,1,1,'K-CMT item per line'],[OLD_MARK,NEW_MARK,1,1,'K-CMT mark per line']];
const BASE='pkgKF/patched';const plan={base:BASE,nodes:[]};fs.mkdirSync('pkgKCL/patched',{recursive:true});
for(const f of fs.readdirSync(BASE).filter(f=>f.endsWith('.js')).sort()){const b=fs.readFileSync(BASE+'/'+f,'utf8');let t=b;const ed=[];
 for(const [a,c,mn,mx,tag] of E){const k=t.split(a).length-1;if(k<mn||k>mx)throw new Error(f+' '+tag+': x'+k);t=t.split(a).join(c);ed.push(tag);}
 new Function('$','$input','$json',t);fs.writeFileSync('pkgKCL/patched/'+f,t);plan.nodes.push({file:f,name:f.replace(/\.js$/,'').replace(/_/g,' '),base_sha:sha(b),final_sha:sha(t),edits:ed});}
fs.writeFileSync('pkgKCL/plan_KCL.json',JSON.stringify(plan,null,1));plan.nodes.forEach(x=>console.log(x.name.padEnd(28),x.base_sha,'->',x.final_sha,x.edits.join('; ')));
