// pkgSLA test. Run from wall2024/: node pkgSLA/test_SLA.cjs   (reads the repo and /mnt/project-files/wall2024/inputs only)
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const rd=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(rd('pkgSLA/plan_SLA.json'));T('6 nodes; base (pkgSLA/base = live 22e92b40) and final shas match',plan.nodes.length===6&&plan.nodes.every(n=>sha(rd('pkgSLA/base/'+n.file))===n.base_sha&&sha(rd('pkgSLA/patched/'+n.file))===n.final_sha));
const fn=s=>{const i=s.indexOf('function sbApply2024');return s.slice(i,s.indexOf('\n',s.indexOf("why:'the flagged line is not in the judge text',to});continue;}",i)+200));};
T('sbApply2024 is the same in all 6 patched nodes',new Set(plan.nodes.map(n=>sha(fn(rd('pkgSLA/patched/'+n.file))))).size===1);
const lib=p=>{const AM=rd(p);return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {sbApply2024};')(()=>{throw 0},null);};
const O=lib('pkgSLA/base/Alternate_Merge.js'),N=lib('pkgSLA/patched/Alternate_Merge.js');const D='/mnt/project-files/wall2024/inputs/';
const na=R=>R?R.items.filter(z=>z.kind==='NOT APPLIED').map(z=>z.sid):[];
// ---- units shaped on 33175 ----
const CL='CHALLENGER CONCEDED LINKS: 1 -- Premise 6: UNEXHIBITED, because its rejection rests on the retired stating-verse test. Premise 1: VOID (Commitment 6), because the charge adds the negation in \\"No quoted row states a knowing before the birth,\\" which its [DR2] quote does not assert. Premise 4: VOID (Commitment 6), because \\"as a title only\\" adds \\"only\\".';
const raw='COLLISION POINTS:\nD1 vs C1 (Matthew 1:18): UNDERDETERMINED -- x -- GROUND: [L1] Matthew 1:18 "before they came together"\nKEYSTONE: D1 -- STANDS\nCONCEDED LINKS: 0 -- Premises 1-6 are spared.\n'+CL+'\nRESULT: UNDERDETERMINED';
const F0={verdict_tag:'HELD',defense_standing:'SELF-SUPPORTED',conceded_links:0,challenge_standing:'PROP-DEPENDENT',challenger_conceded_links:1};
const TO='CHALLENGER CONCEDED LINKS: 1 -- Premise 6: UNEXHIBITED, because its rejection rests on the retired stating-verse test. Premise 1: VOID (Commitment 6), because the charge adds the negation in "No quoted row states a knowing before the birth," which its (DR2) quote does not assert. Premise 4: NOT VOID; its charge is the challenger\'s quoted claim.';
const g1={sid:'G1',rule:'K-V',item:'CHALLENGER premise 4',line:'CHALLENGER premise 4 ruled VOID',ans:'CHANGE',to:TO};
const b1=O.sbApply2024('chatgpt',raw,F0,[g1],null),n1=N.sbApply2024('chatgpt',raw,F0,[g1],null);
T('33175 shape: base refuses the CHALLENGER CONCEDED LINKS change ("the flagged line is not in the judge text")',JSON.stringify(na(b1))==='["G1"]'&&b1.items[0].why==='the flagged line is not in the judge text');
T('33175 shape: pkgSLA applies it over the judge\'s own CHALLENGER CONCEDED LINKS line',!na(n1).length&&n1.rp.some(([o,n])=>o.startsWith('CHALLENGER CONCEDED LINKS')&&n.includes('Premise 4: NOT VOID')),JSON.stringify(n1&&n1.rp&&n1.rp.map(([o,n])=>[o.slice(0,40),n.slice(-50)])));
T('33175 shape: the defender CONCEDED LINKS line is untouched',!n1.rp.some(([o])=>o.startsWith('CONCEDED LINKS')));
const sp={...g1,to:'Premise 4: NOT VOID; its charge is the challenger\'s quoted claim.'};
T('a CHANGE TO with no label ("Premise 4: NOT VOID ...", 33175 S9/S11) is still refused',JSON.stringify(na(N.sbApply2024('c',raw,F0,[sp],null)))==='["G1"]');
const raw2=raw.replace('KEYSTONE: D1 -- STANDS','KEYSTONE: D1 -- STANDS\nD1 vs C1 (Matthew 1:20): STANDS -- y');
const pc={sid:'S1',rule:'K-G4',item:'D1 vs C1',line:'(not a judge line)',ans:'CHANGE',to:'D1 vs C1 (Matthew 1:18): UNDERDETERMINED -- z -- GROUND: [L1] Matthew 1:18 "before they came together"'};
T('two judge lines with the label: refused as before',JSON.stringify(na(N.sbApply2024('c',raw2,F0,[pc],null)))==='["S1"]');
T('one collision line with the label: applied over it',!na(N.sbApply2024('c',raw,F0,[pc],null)).length);
// ---- replay: every stored send-back (S) and gate (G) item of 7 runs, applied together, base vs pkgSLA ----
const L=(run,n)=>{const f=D+run+'_'+n+'.json';if(!fs.existsSync(f))return null;const d=JSON.parse(rd(f))[0];return (d.main||d.data.main)[0][0].json;};
const F=b=>({verdict_tag:b.payload.verdict_tag,defense_standing:b.payload.defense_standing,conceded_links:b.payload.conceded_links,challenge_standing:b.payload.challenge_standing,challenger_conceded_links:b.payload.challenger_conceded_links});
const chg=[];let seen=0;
for(const run of ['33040','33060','33083','33107','33129','33149','33160']){const GR=L(run,'Gate_Record'),PC=L(run,'Panel_Cure_Check');if(!GR||!PC)continue;
 for(const b of PC.bodies.map(x=>typeof x==='string'?JSON.parse(x):x)){const seat=b.payload.judge_seat;const its=(GR.sb_items||[]).filter(x=>x.seat===seat&&/^[SG]/.test(x.sid));seen+=its.length;
  const a=O.sbApply2024(seat,b.payload.verdict_raw,F(b),its,null),c=N.sbApply2024(seat,b.payload.verdict_raw,F(b),its,null);
  if(JSON.stringify(a&&a.rp)!==JSON.stringify(c&&c.rp)||JSON.stringify(na(a))!==JSON.stringify(na(c)))chg.push(run+' '+seat+': NOT APPLIED '+JSON.stringify(na(a))+' -> '+JSON.stringify(na(c))+'; fields '+JSON.stringify(a.fields)+' -> '+JSON.stringify(c.fields)+' | '+c.items.filter(z=>!na(a).includes(z.sid)||1).length);}}
console.log('  REPLAY: '+seen+' send-back items; changes:\n   '+(chg.join('\n   ')||'none'));
fs.writeFileSync('pkgSLA/replay_SLA.txt',chg.join('\n')+'\n');
T('replay ran on stored items',seen>0);
console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
