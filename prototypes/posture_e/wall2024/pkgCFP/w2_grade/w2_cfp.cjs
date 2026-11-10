// W2 second grade of pkgCFP rev 1 (W1). Planted anti-cheat rows on 34108 (Anticheat Record overridden). LABELS, committed before the first run:
// Q1  one shown DEFENDER row, exact CR3 drop / CR4 reclaim quotes      -> one candidate, DEFENDER, earlier CR3, closing CR4, named "the anti-cheat check (found by the system...)"; cec_skip false
// Q2  one shown CHALLENGER row, exact DR3 / DR4 quotes                  -> one candidate, CHALLENGER, earlier DR3, closing DR4
// Q3  Q1's pair also named by a judge with the same quotes (planted judge line) -> one candidate naming both
// Q4  Q1's pair named by a judge with a SHORTER closing quote           -> the pair is not lost (one or two candidates; a second is a NOTE)
// Q5  shown row whose earlier quote has an ellipsis joining two CR2 sentences (Anticheat's own quote test passes) -> the shown pair reaches the enforcer as a candidate
// Q6  shown row whose earlier quote runs across the CR2/CR3 boundary (Anticheat's quote test passes on rounds 1-3 joined) -> the shown pair reaches the enforcer
// Q7  shown row whose closing quote has an ellipsis joining two CR4 sentences -> candidate; Judge Contradiction Record (live) given CONFIRMED with those quotes -> CONFIRMED
// Q8  Q1's pair already answered NOT A CONTRADICTION by the closing enforcer -> dropped as for a judge candidate (NOTE: by design)
// Q9  Q1's pair already CONFIRMED by the closing enforcer              -> dropped
// Q10 Anticheat Record with reversed {D:[],C:[]} (none shown)            -> output equal to live s105 except the shortened sentence
// Q11 Record (live) given CONFIRMED to Q1 and Q2 candidates             -> both CONFIRMED, links broken
// Q12 shown row whose side is D but quotes are the challenger's (DR3/DR4) -> no candidate is made with defender rounds; a CHALLENGER-quoted pair is not confirmed against the defender
// AMENDMENT after the first run (W2, my faults, labels Q1-Q12 unchanged; committed before the rerun):
//  - Q3/Q4 test fault: my planted judge line did not match the judges' CONTRADICTION form (JRX); now written as "CONTRADICTION -- DEFENDER -- EARLIER ([CR3], "...") -- LATER ([CR4], "...")".
//  - Q2 label mistake: the challenger sentence also stands in DR2, and the build takes the first round 1-3 where it stands; DR2 is a valid earlier round.
//  - Q6 and Q12 invalid plants: each test now first checks that Anticheat Record's own quote test would SHOW the row (earlier in rounds 1-3 joined, closing in round 4);
//    Q6's quote runs into the round header and Q12's closing quote is not in CR4, so the anti-cheat call could not show them.
//  - Q7 plant spans a heading; kept, with the precondition shown.
//  NEW (labeled here before the rerun):
// Q13 shown row whose earlier quote joins two NON-adjacent CR3 sentences by an ellipsis (Anticheat's quote test passes) -> the shown pair reaches the enforcer, or its drop is recorded
process.chdir(__dirname+'/../..');const fs=require('fs');const {harness}=require(process.cwd()+'/pkgGSL/harness.cjs');const H=require(process.cwd()+'/pkgVP3/harness.cjs');
const code=(f,n)=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;d=d.workflow||d;return d.nodes.find(x=>x.name===n).parameters.jsCode;};
const LB=code('/mnt/project-files/wall2024/fetchback_live_s105.json','Judge Contradiction Build'),CB=code('pkgCFP/parent_s105_CFP.json','Judge Contradiction Build'),LR=code('/mnt/project-files/wall2024/fetchback_live_s105.json','Judge Contradiction Record');
const J=x=>({json:x});const R='34108';const F=H.out(R,'Final Output').flat().filter(Boolean)[0].json;
let ok=0,bad=0;const T=(n,c,i)=>{c?ok++:bad++;console.log((c?'OK   ':'FAIL ')+n+(i?': '+i:''));};
const AC=(D,C)=>({'Anticheat Record':[J({acx:{skipped:false,reversed:{D:D||[],C:C||[]}}})]});
const run=(c,over)=>harness(R,over)(c,'Panel Payloads')[0].json;
const PP=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/'+R+'_Panel_Payloads.json','utf8'));const PP0=PP[0].data?PP[0].data.main[0][0].json:PP[0].json;
const withJudge=line=>{const p=JSON.parse(JSON.stringify(PP0));const b=JSON.parse(p.bodies[0]);b.payload.verdict_raw=String(b.payload.verdict_raw)+'\n'+line;p.bodies[0]=JSON.stringify(b);return {'Panel Payloads':[J(p)]};};
const E3='I drop the wording "no biological father" as a bare statement.',C4='Christ had no biological father.';
const ED='So, footed on these rows, Joseph knew Mary his wife within the espousal.',CD='I grant all of this, and it makes Joseph the legal father.';
const ac=c=>(c.cands||[]).filter(x=>/anti-cheat check/.test(x.by));
const rec=(b,line)=>harness(R,{'Judge Contradiction Build':[J(b)],'Judge Contradiction Call deepseek':[J({choices:[{message:{content:line}}]})]})(LR,'Judge Contradiction Call deepseek')[0].json.jcc||{};
const cline=(c,n,eq,cq)=>'CLOSE-CONTRADICTION: '+c.id+' -- '+c.side+' -- LINK '+n+' -- CONFIRMED -- EARLIER ['+c.earlier_round+'] "'+(eq||c.earlier_q)+'" -- CLOSING ['+c.closing_round+'] "'+(cq||c.closing_q)+'" -- planted.';
// Q1
const b1=run(CB,AC([{earlier_q:E3,close_q:C4}]));const a1=ac(b1);T('Q1 one DEFENDER candidate CR3->CR4 from the anti-cheat check',!b1.cec_skip&&a1.length===1&&a1[0].side==='DEFENDER'&&a1[0].earlier_round==='CR3'&&a1[0].closing_round==='CR4'&&/found by the system/.test(a1[0].by),JSON.stringify(a1.map(c=>[c.id,c.side,c.earlier_round,c.by])));
// Q2
const b2=run(CB,AC([],[{earlier_q:ED,close_q:CD}]));const a2=ac(b2);T('Q2 one CHALLENGER candidate, earlier round 1-3, closing DR4 (amended)',a2.length===1&&a2[0].side==='CHALLENGER'&&/^DR[123]$/.test(a2[0].earlier_round)&&a2[0].closing_round==='DR4',JSON.stringify(a2.map(c=>[c.id,c.side,c.earlier_round,c.closing_round])));
// Q3, Q4 judge line form: read JRX from code
const jl=(eq,cq)=>'CONTRADICTION -- DEFENDER -- EARLIER ([CR3], "'+eq+'") -- LATER ([CR4], "'+cq+'")';
const acN=s=>String(s||'').toLowerCase().replace(/[“”"’‘'*_`\[\]]/g,'').replace(/[^a-z0-9:\s]/g,' ').replace(/\s+/g,' ').trim();
const acStands=(q,T)=>{T=acN(T);const x=acN(q);if(x.split(' ').length<3)return false;if(T.includes(x))return true;const parts=String(q).split(/\.\.\.|…/).map(acN).filter(p=>p.split(' ').length>=5);return parts.length>0&&parts.every(p=>T.includes(p));};
const shows=(sd,eq,cq)=>sd==='D'?acStands(eq,[F.cr1,F.cr2,F.cr3].join('\n'))&&acStands(cq,F.cr4):acStands(eq,[F.gr1,F.gr2,F.dr3].join('\n'))&&acStands(cq,F.dr4);
{const b=run(CB,{...AC([{earlier_q:E3,close_q:C4}]),...withJudge(jl(E3,C4))});const all=(b.cands||[]).filter(c=>c.side==='DEFENDER'&&c.earlier_round==='CR3');T('Q3 judge and anti-cheat name the same pair: one candidate naming both',all.length===1&&/anti-cheat check/.test(all[0].by),JSON.stringify(all.map(c=>[c.id,c.by]))+' | live judge-only cands '+(run(LB,withJudge(jl(E3,C4))).cands||[]).length);}
{const b=run(CB,{...AC([{earlier_q:E3,close_q:C4}]),...withJudge(jl(E3,'no biological father'))});const all=(b.cands||[]).filter(c=>c.side==='DEFENDER'&&c.earlier_round==='CR3');T('Q4 judge names the pair with a shorter closing quote: the pair is not lost',all.length>=1&&all.some(c=>/anti-cheat check/.test(c.by)),JSON.stringify(all.map(c=>[c.id,c.closing_q,c.by.slice(0,40)]))+(all.length>1?' NOTE: '+all.length+' candidates for one pair':''));}
// Q5 ellipsis earlier across two CR2 sentences
const E5='I grant all of this, and it makes Joseph the legal father... The question is whether he was the begetter.';
{const b=run(CB,AC([{earlier_q:E5,close_q:C4}]));T('Q5 shown pair whose earlier quote joins two CR2 sentences by an ellipsis reaches the enforcer',ac(b).length===1,JSON.stringify(ac(b).map(c=>[c.id,c.earlier_round]))+(b.cec_skip?' (skip: '+b.why+')':''));}
// Q6 across CR2/CR3 boundary
const w=s=>String(s).replace(/\s+/g,' ').trim().split(' ');const t2=w(F.cr2),t3=w(F.cr3);const E6=t2.slice(-4).join(' ')+' '+t3.slice(0,4).join(' ');
{const b=run(CB,AC([{earlier_q:E6,close_q:C4}]));T('Q6 [precondition anti-cheat shows: '+shows('D',E6,C4)+'] shown pair whose earlier quote runs across the CR2/CR3 boundary reaches the enforcer',ac(b).length===1,'quote: '+JSON.stringify(E6)+' | '+JSON.stringify(ac(b).map(c=>[c.id,c.earlier_round]))+(b.cec_skip?' (skip: '+b.why+')':''));}
// Q7 ellipsis closing across two CR4 sentences
const C7="They are not the narrator's own word for who begat the child... The challenger's whole case (C1) rests on one window";
{const b=run(CB,AC([{earlier_q:E3,close_q:C7}]));const a=ac(b);let st='no candidate';if(a.length){const n=(b.links.DEFENDER||[])[0];const j=rec(b,cline(a[0],n));const row=(j.rows||[]).find(x=>x.id===a[0].id)||{};st=row.status+' '+String(row.note||'').slice(0,90);}
 T('Q7 [precondition anti-cheat shows: '+shows('D',E3,C7)+'] shown pair whose closing quote joins two CR4 sentences: candidate made and Record confirms it',a.length===1&&/^CONFIRMED/.test(st),st);}
// Q8, Q9
const preRow=ans=>({'Close Enforcer Record':[J({cec:{rows:[{id:'NEW',side:'DEFENDER',link:6,answer:ans,status:ans==='CONFIRMED'?'CONFIRMED':'NOT A CONTRADICTION',earlier_round:'CR3',earlier_q:E3,closing_round:'CR4',closing_q:C4}]}})]});
{const b=run(CB,{...AC([{earlier_q:E3,close_q:C4}]),...preRow('NOT A CONTRADICTION')});T('Q8 pair already answered NOT A CONTRADICTION by the closing enforcer is dropped (NOTE: by design, as for judges)',ac(b).length===0,JSON.stringify(b.cec_skip?b.why:ac(b).map(c=>c.id)));}
{const b=run(CB,{...AC([{earlier_q:E3,close_q:C4}]),...preRow('CONFIRMED')});T('Q9 pair already CONFIRMED by the closing enforcer is dropped',ac(b).length===0,JSON.stringify(b.cec_skip?b.why:ac(b).map(c=>c.id)));}
// Q10
{const a=run(LB,AC([],[])),b=run(CB,AC([],[]));const sa=JSON.stringify(a).replace(/each was named by a judge after it read the debate\./,'each names who found it.');T('Q10 nothing shown: equal to live except the shortened sentence',sa===JSON.stringify(b),'');}
// Q11
{const b=run(CB,AC([{earlier_q:E3,close_q:C4}],[{earlier_q:ED,close_q:CD}]));const a=ac(b);const lines=a.map(c=>cline(c,(b.links[c.side]||[])[0])).join('\n');const j=rec(b,lines);const conf=(j.rows||[]).filter(x=>x.status==='CONFIRMED').map(x=>x.side+' '+x.link);
 T('Q11 Record confirms both planted anti-cheat candidates',a.length===2&&conf.length===2,JSON.stringify(conf)+' | '+JSON.stringify((j.rows||[]).map(x=>[x.id,x.status,String(x.note||'').slice(0,60)])));}
// Q12
{const b=run(CB,AC([{earlier_q:ED,close_q:CD}]));const a=ac(b);T('Q12 [precondition anti-cheat shows: '+shows('D',ED,CD)+'] a D row carrying challenger quotes makes no defender candidate',a.length===0,JSON.stringify(a.map(c=>[c.id,c.side,c.earlier_round])));}
const E13='The finding is dated before the pair\'s coming together... I drop the broader claim that justice could never move a husband';
{const b=run(CB,AC([{earlier_q:E13,close_q:C4}]));T('Q13 [precondition anti-cheat shows: '+shows('D',E13,C4)+'] shown pair whose earlier quote joins two non-adjacent CR3 sentences reaches the enforcer',ac(b).length===1,JSON.stringify(ac(b).map(c=>[c.id,c.earlier_round]))+(b.cec_skip?' (skip: '+b.why+')':''));}
console.log(ok+' OK, '+bad+' FAIL');
