// W2 regrade of pkgCFP rev 2 (W1, f6a5a9ed). LABELS, committed before the first run. Candidate pkgCFP/parent_s105_CFP2.json; Record = live s105 Judge Contradiction Record.
// S1 Q13 again: earlier ellipsis joining two non-adjacent CR3 sentences -> one candidate whose earlier quote is one of the parts, round CR3; Record given CONFIRMED with the candidate's quotes -> CONFIRMED
// S2 Q7 again: closing ellipsis joining two CR4 sentences across a heading -> one candidate, closing quote one part; Record CONFIRMED with the candidate's quotes -> CONFIRMED
// S3 both quotes ellipsis forms (S1 earlier, S2 closing) -> one candidate; Record CONFIRMED -> CONFIRMED
// S4 earlier ellipsis with parts in CR1 and CR3 (different rounds) -> one candidate, earlier round = the round of the part passed; Record CONFIRMED -> CONFIRMED
// S5 earlier ellipsis whose drop words are in the SHORTER part -> one candidate; NOTE what the enforcer is shown (the longer, neutral part)
// S6 judge names S1's pair with the longest part: one candidate whose by-text names the judge and "the anti-cheat check (found by the system; both quotes checked)"
// S7 stated limit: earlier quote crossing the CR2/CR3 boundary -> dropped; NOTE whether any record row names the drop
// S8 rev 1 grade set Q1-Q13 rerun on rev 2 (separate script w2_cfp_rev1set.cjs, CFPFILE=parent_s105_CFP2.json): Q1, Q2, Q4, Q5, Q8-Q11 OK; Q13 and Q7 now OK; Q3 as before (test fault), Q6 dropped (limit), Q12 invalid plant
process.chdir(__dirname+'/../..');const fs=require('fs');const {harness}=require(process.cwd()+'/pkgGSL/harness.cjs');const H=require(process.cwd()+'/pkgVP3/harness.cjs');
const code=(f,n)=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;d=d.workflow||d;return d.nodes.find(x=>x.name===n).parameters.jsCode;};
const CB=code('pkgCFP/parent_s105_CFP2.json','Judge Contradiction Build'),LR=code('/mnt/project-files/wall2024/fetchback_live_s105.json','Judge Contradiction Record');
const J=x=>({json:x});const R='34108';const F=H.out(R,'Final Output').flat().filter(Boolean)[0].json;let ok=0,bad=0;const T=(n,c,i)=>{c?ok++:bad++;console.log((c?'OK   ':'FAIL ')+n+(i?': '+i:''));};
const AC=(D,C)=>({'Anticheat Record':[J({acx:{skipped:false,reversed:{D:D||[],C:C||[]}}})]});const run=(over)=>harness(R,over)(CB,'Panel Payloads')[0].json;
const ac=c=>(c.cands||[]).filter(x=>/anti-cheat check/.test(x.by));
const rec=(b,line)=>harness(R,{'Judge Contradiction Build':[J(b)],'Judge Contradiction Call deepseek':[J({choices:[{message:{content:line}}]})]})(LR,'Judge Contradiction Call deepseek')[0].json.jcc||{};
const conf=(b,c)=>{const n=(b.links[c.side]||[])[0];const j=rec(b,'CLOSE-CONTRADICTION: '+c.id+' -- '+c.side+' -- LINK '+n+' -- CONFIRMED -- EARLIER ['+c.earlier_round+'] "'+c.earlier_q+'" -- CLOSING ['+c.closing_round+'] "'+c.closing_q+'" -- planted.');const r=(j.rows||[]).find(x=>x.id===c.id)||{};return r.status+(r.note?' ('+String(r.note).slice(0,80)+')':'');};
const PP=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/'+R+'_Panel_Payloads.json','utf8'));const PP0=PP[0].data?PP[0].data.main[0][0].json:PP[0].json;
const withJudge=line=>{const p=JSON.parse(JSON.stringify(PP0));const b=JSON.parse(p.bodies[0]);b.payload.verdict_raw=String(b.payload.verdict_raw)+'\n'+line;p.bodies[0]=JSON.stringify(b);return {'Panel Payloads':[J(p)]};};
const C4='Christ had no biological father.';
const E13A="The finding is dated before the pair's coming together.",E13B='I drop the broader claim that justice could never move a husband',E13=E13A.replace(/\.$/,'')+'... '+E13B;
const C7A="They are not the narrator's own word for who begat the child",C7B="The challenger's whole case (C1) rests on one window",C7=C7A+'... '+C7B;
const show=c=>JSON.stringify([c.id,c.earlier_round,c.earlier_q,c.closing_q]);
{const b=run(AC([{earlier_q:E13,close_q:C4}]));const a=ac(b);const st=a.length?conf(b,a[0]):'';T('S1 non-adjacent earlier ellipsis',a.length===1&&a[0].earlier_round==='CR3'&&[E13A.replace(/\.$/,''),E13B].some(p=>a[0].earlier_q.replace(/\.$/,'')===p.replace(/\.$/,''))&&/^CONFIRMED/.test(st),a.map(show).join(' ')+' | Record '+st);}
{const b=run(AC([{earlier_q:"I drop the wording \"no biological father\" as a bare statement.",close_q:C7}]));const a=ac(b);const st=a.length?conf(b,a[0]):'';T('S2 closing ellipsis across a heading',a.length===1&&[C7A,C7B].includes(a[0].closing_q)&&/^CONFIRMED/.test(st),a.map(show).join(' ')+' | Record '+st);}
{const b=run(AC([{earlier_q:E13,close_q:C7}]));const a=ac(b);const st=a.length?conf(b,a[0]):'';T('S3 both quotes ellipsis',a.length===1&&/^CONFIRMED/.test(st),a.map(show).join(' ')+' | Record '+st);}
const s1=String(F.cr1).split(/\n+|(?<=[.!?])\s+/).filter(x=>x.split(' ').length>=8&&!/[|#*"\[\-]/.test(x))[0].replace(/\.$/,'');
{const b=run(AC([{earlier_q:s1+'... '+E13B,close_q:C4}]));const a=ac(b);const st=a.length?conf(b,a[0]):'';const want=(s1.length>E13B.length)?'CR1':'CR3';T('S4 parts in CR1 and CR3: round of the part passed (expect '+want+')',a.length===1&&a[0].earlier_round===want&&/^CONFIRMED/.test(st),'CR1 part: '+JSON.stringify(s1)+' | '+a.map(show).join(' ')+' | Record '+st);}
{const neutral="The challenger's whole case (C1) rests on one window: a knowing by Joseph";const drop='I drop the broader claim';const b=run(AC([{earlier_q:E13A.replace(/\.$/,'')+'... '+drop,close_q:C4}]));const a=ac(b);T('S5 drop words in the shorter part (NOTE: what the enforcer sees)',a.length===1,a.map(show).join(' '));}
{const b=run({...AC([{earlier_q:E13,close_q:C4}]),...withJudge('CONTRADICTION -- DEFENDER -- EARLIER ([CR3], "'+E13B+'") -- LATER ([CR4], "'+C4+'")')});const a=ac(b);T('S6 judge names the same pair with the passed part: one merged candidate naming both',a.length===1&&/judges' CONTRADICTION lines \(luna\) and the anti-cheat check \(found by the system/.test(a[0].by),a.map(c=>c.id+' '+c.by).join(' | '));}
{const w=s=>String(s).replace(/\s+/g,' ').trim().split(' ');const E6=w(F.cr2).slice(-4).join(' ')+' '+w(F.cr3).slice(0,4).join(' ');const b=run(AC([{earlier_q:E6,close_q:C4}]));T('S7 stated limit: cross-round earlier quote dropped (NOTE: recorded anywhere?)',ac(b).length===0,'output keys holding "dropped": '+Object.keys(b).filter(k=>/drop/i.test(k)).join(',')+' | cands '+(b.cands||[]).length+(b.cec_skip?' skip '+b.why:''));}
console.log(ok+' OK, '+bad+' FAIL');
