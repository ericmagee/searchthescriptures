// pkgP test: K-CMT precision on stored runs 32936, 32949, 32973 (debate_judgments verdict_raw) plus unit cases.
const fs=require('fs');
function load(p){const s=fs.readFileSync(p,'utf8');const i=s.indexOf('// K-CMT precision');const j=s.indexOf('\n// WALL-2024 Commitment 11',i);
 return new Function(s.slice(i,j)+'\nreturn {kcmtLines2024,kcmtGrade2024};')();}
function loadOld(p){const s=fs.readFileSync(p,'utf8');const i=s.indexOf('function kcmtLines2024');const j=s.indexOf('\n// WALL-2024 Commitment 11',i);return new Function(s.slice(i,j)+'\nreturn kcmtLines2024;')();}
const N=load('patched/Panel_Payloads.js'), O=loadOld('../merged_TLRN/Panel_Payloads.js');
const dec=t=>{const s=t.trim();if(s[0]==='{'){const i=s.lastIndexOf('}');try{const j=JSON.parse(s.slice(0,i+1));if(j&&typeof j.reasoning==='string')return j.reasoning;}catch(e){}}return t;};
let ok=0,bad=0;const A=(c,m)=>{if(c){ok++;console.log('OK   '+m);}else{bad++;console.log('FAIL '+m);}};
const RUN={'5e640b21':'32936','1cd2f5ce':'32949','819ccc9f':'32973'};
const rows=JSON.parse(fs.readFileSync('fixture_kcmt_judgments.json','utf8'));
let tOld=0,tNew=0;
for(const r of rows){const T=dec(r.verdict_raw).split('\n').map(l=>l.trim()).filter(Boolean);
 const old=T.filter(l=>!/^\[AUDIT\b/.test(l)&&/\b(BROKEN|FORCED|MISSES|VOID|UNPROVEN)\b/.test(l)&&!/\bCommitment\s*\d+\b/i.test(l));
 const kept=T.filter(l=>N.kcmtGrade2024(l));tOld+=old.length;tNew+=kept.length;
 console.log('\n=== run '+RUN[r.debate_id.slice(0,8)]+' '+r.judge_seat+': old '+old.length+' -> new '+kept.length);
 old.forEach(l=>console.log((kept.includes(l)?'  KEPT    ':'  DROPPED ')+l.slice(0,170)));
 const no=O(r.verdict_raw).items.length,nn=N.kcmtLines2024(r.verdict_raw).items.length;
 A(nn===(kept.length?1:0)&&kept.every(l=>old.includes(l)),'run '+RUN[r.debate_id.slice(0,8)]+' '+r.judge_seat+': new set is a subset of old, item '+no+'->'+nn);}
console.log('\nTOTAL lines old '+tOld+' new '+tNew+'\n');
const G=N.kcmtGrade2024, U=[
 ['RESULT: UNDERDETERMINED -- recomputed after the cure from the cured lines (RETRACTED D2 vs C3 (DEFENDER LINK BROKEN to UNDERDETERMINED))',false,'engine RESULT recomputed line'],
 ['CLAUSE: BROKEN-1 -- n=6 w=0 k=1',false,'CLAUSE formula line'],
 ['RULING -- D2 vs C3 -- DEFENDER LINK BROKEN',false,'ruling card head'],
 ['APPLIED: the rule requires ...; so CHALLENGER LINK BROKEN.',false,'ruling card APPLIED'],
 ['NAMED BY: "the link is BROKEN" (round 3)',false,'ruling card NAMED BY'],
 ['ANSWER CHECK: Matthew 1:24 -- [DR2] -- MEANS: "no MEANS sentence" -- ANSWER: NONE -- FAILS -- "UNPROVEN, not a witness (ruling 398); not counted."',false,'ANSWER CHECK: grade word only inside a quote'],
 ['ANSWER CHECK: Luke 2:5 -- [DR3] -- MEANS: "after the taking she is still called espoused." -- ANSWER: "One row joins." -- MISSES -- "the answer does not engage after the taking."',true,'ANSWER CHECK verdict MISSES outside quotes is the judge\'s own grade'],
 ['CONCEDED LINKS: 0 -- Premises 1 to 6 are spared. None is VOID, and none is counted as CONCEDED or UNEXHIBITED.',false,'negation "None is VOID"'],
 ['CHALLENGER CONCEDED LINKS: 1 -- premise 3 UNEXHIBITED. Spared: premises 1, 2. No premise is VOID.',false,'negation "No premise is VOID"'],
 ['D1 vs C2 (Matthew 1:18): CHALLENGER LINK BROKEN (Commitments 3 and 7) -- ...',false,'plural "Commitments 3 and 7" names a commitment'],
 ['D1 vs C2 (Matthew 1:18): CHALLENGER LINK BROKEN (Commitment 3) -- ...',false,'singular commitment named'],
 ['D1 vs C2 (Matthew 1:18): CHALLENGER LINK BROKEN -- a knowing within the espousal cannot fit',true,'collision grade with no commitment stays'],
 ['KEYSTONE: D6 -- BROKEN -- the conclusion',true,'keystone grade with no commitment stays'],
 ['FORCED: D1 vs C1 -- MEANS [CR3]: "x" -- ANSWER [DR3]: "y" -- FAILS',true,'FORCED line stays'],
 ['BROKEN. [L1] The record presents a dispute',true,'close paragraph grade stays'],
 ['CHALLENGER CONCEDED LINKS: 1 -- premise 1 UNEXHIBITED. Premise 2 VOID: the charge adds ONLY.',true,'a real VOID ruling stays'],
 ['Premise 2 was VOID (adds universal word \'only\'); premise 4 is not VOID.',true,'a real VOID stays beside a negated one'],
 ['ANSWER CHECK: John 3:6 -- [DR3] -- MEANS: "x." -- ANSWER: "The verse keeps two kinds." -- MEETS -- two kinds are agreed; premise 5 is VOID and not counted.',false,'ANSWER CHECK MEETS with a trailing pointer to a VOID ruled elsewhere'],
 ['ANSWER CHECK: Romans 1:3 -- [CR3] -- MEANS: "x." -- ANSWER: "y" -- MISSES -- "the answer does not engage."',true,'ANSWER CHECK MISSES verdict stays'],
 ['ANSWER CHECK: Luke 1:27 -- [DR2] -- MEANS: none (UNPROVEN, not a witness) -- ANSWER: n/a -- not a witness.',false,'ANSWER CHECK with no MEANS: UNPROVEN before ANSWER is not its verdict'],
 ['CONCEDED LINKS: 1 -- premise 6 UNEXHIBITED. Premises 1 to 5 spared. No premise VOID: each charge is in ASSUMES form.',false,'negation "No premise VOID" (no verb)'],
 ['CHALLENGE STANDING: COLLAPSED -- L=1 c=1 -- Five listed premises are VOID and excluded from the count.',false,'standing line'],
 ['[AUDIT v33: GRADE WITHOUT ITS COMMITMENT (K-CMT) -- BROKEN]',false,'engine AUDIT line'],
];
U.forEach(([l,e,m])=>A(G(l)===e,'unit: '+m));
// cure: plural commitment accepted
const s=fs.readFileSync('patched/Panel_Cure_Check.js','utf8');A(s.includes("/\\bCommitments?\\s*\\d+/i.test(rp)"),'cure: K-CMT RESPONSE naming "Commitments 3 and 7" is accepted');
console.log('\n'+ok+' OK, '+bad+' FAIL');
