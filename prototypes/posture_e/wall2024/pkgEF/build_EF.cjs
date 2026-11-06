// pkgEF (W3 Wall 2477 rulings 1 and 2; W2 promotion read Wall 2476, pkgPR): enforcer feed fixes for the false items of E-HOLD, E-COL, E-RES.
// Run from wall2024/: node pkgEF/build_EF.cjs. Base: pkgEP/patched Judge Enforcer Build and Alt Judge Enforcer Build (not library nodes).
// All three rules stay RECORD-ONLY TRIAL; this changes what the enforcer is fed and which lines it is given, not what any row does.
// (1) E-HOLD link-state lines ("D5: STANDS") name no verse, so the enforcer was fed no ANSWER CHECK line (5667, 6395, 6396, 7093). Now it is fed
//     that side's ANSWER CHECK lines on proven presses that are not MEETS (up to 6), with the count of that side's proven checks.
// (2) E-HOLD: each fed ANSWER CHECK line is labelled with whose answer it is, and an UNPROVEN press is labelled "no answering burden"
//     (4937, 6398, 6403, 7595, 7598, 7606 read an unproven press as a burden; 7608 read a challenger's FAILS against the defender's link).
//     RULE E-HOLD gains the matching sentences.
// (3) E-RES: a RESULT line the cure recompute wrote ("RESULT: X -- recomputed after the cure ...") is not a judge's reason and is not sent (6171, 6821).
// (4) E-RES VERDICT LINES (code): the RETRACTED set is read only from the judge's own lines that begin RETRACTED. It was matched over the whole
//     text, so "RETRACTED: D6 vs C1" quoted inside an [AUDIT ... RESULT: UNCURED] note dropped D6 from the k count (33014 chatgpt, row 5993).
// (5) E-COL (W3 2477 ruling 2): when the FAILS words of a FORCED line are found exactly (spacing and quote marks aside) in the round named on
//     its ANSWER, the item says so, and RULE E-COL reads them as part of the answer (5931, 5934).
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const BASE=process.env.BASE||'pkgEP/patched';const OUT=process.env.OUT||'pkgEF';
const E=[
 // (4)
 ["const retr=new Set([...String(j.t).matchAll(/RETRACTED[:\\s]+D(\\d+)\\s*vs\\.?\\s*C\\d+/g)].map(m=>+m[1]));",
  "/* pkgEF (4): the judge's own RETRACTED lines only; a retraction quoted in an [AUDIT ...] note (an UNCURED one too) is not one (33014 chatgpt, row 5993) */const retr=new Set(ls.map(l=>l.match(/^RETRACTED[:\\s]+D(\\d+)\\s*vs\\.?\\s*C\\d+/)).filter(Boolean).map(m=>+m[1]));"],
 // (3)
 [" if(!res)continue;ri++;",
  " /* pkgEF (3): a RESULT line the cure recompute wrote is not a judge's reason (rows 6171, 6821) */if(!res||/^RESULT\\s*:\\s*[A-Z ]+?\\s*(?:--|—|–)\\s*recomputed after the cure/i.test(res))continue;ri++;"],
 // (1)
 ["HG.push({seat:j.seat,line:l,link:m[1].replace(/\\s+/g,' '),grade:m[2],own});",
  "const lk=m[1].replace(/\\s+/g,' ');const side0=(/vs/.test(lk)||own.length)?null:(lk[0]==='D'?'C':'D');/* pkgEF (1): a link-state line that names no checked verse is fed that side's proven ANSWER CHECK lines that are not MEETS (W3 2484: a line naming checked verses gets those alone) */\n  const sideAll=side0?acs.filter(a=>acRound(a)===side0&&!acUnp(a)):[];const sideAc=sideAll.filter(a=>!own.includes(a)&&!/--\\s*MEETS\\b/.test(a)).slice(0,6);\n  HG.push({seat:j.seat,line:l,link:lk,grade:m[2],own,side0,sideAc,sideN:sideAll.length});"],
 ["const HG=[];",
  "const HG=[];\n/* pkgEF (2): whose answer an ANSWER CHECK line grades ([CRn] the defender's, [DRn] the challenger's), and whether its press is UNPROVEN */\nconst acRound=a=>{const m=String(a).match(/^ANSWER CHECK:\\s*.+?\\s*--\\s*\\[\\s*(?:([CD])R\\s*\\d|(Defender|Challenger)\\s*R)/);return m?(m[1]||(m[2]==='Defender'?'C':'D')):null;};\nconst acUnp=a=>/\\bUNPROVEN\\b|MEANS:\\s*(?:NONE\\b|\"\")/.test(String(a));\nconst acLab=a=>{const r=acRound(a);return (r==='C'?'(the defender\\'s answer) ':r==='D'?'(the challenger\\'s answer) ':'')+(acUnp(a)?'(UNPROVEN press: no answering burden) ':'');};"],
 // (1)+(2) item text
 ["THIS JUDGE\\'S OWN ANSWER CHECK LINES ON THE VERSES THE LINE NAMES:\\n'+(g.own.length?g.own.map(a=>'- '+cut(a,900)).join('\\n'):'(none on these verses)')});}",
  "THIS JUDGE\\'S OWN ANSWER CHECK LINES ON THE VERSES THE LINE NAMES:\\n'+(g.own.length?g.own.map(a=>'- '+acLab(a)+cut(a,900)).join('\\n'):'(none on these verses)')\n  +(g.side0?'\\nTHIS IS A LINK-STATE LINE. THIS JUDGE\\'S ANSWER CHECK LINES ON THE '+(g.side0==='C'?'DEFENDER':'CHALLENGER')+'\\'S ANSWERS TO PROVEN PRESSES: '+g.sideN+' in all; those not MEETS (these checks may be on presses against other links; one counts against this line only if its press is on this link):\\n'+(g.sideAc.length?g.sideAc.map(a=>'- '+acLab(a)+cut(a,900)).join('\\n'):'(none: every one MEETS)'):'')});}"],
 // (2) rule text
 ["is not a ground. AGREE when the judge\\'s grade is right; DISAGREE when it is not.\\n'",
  "is not a ground. Each ANSWER CHECK line given you is labelled with whose answer it grades: a MISSES or FAILS on the challenger\\'s answer counts against the challenger\\'s link, never against the defender\\'s, and the reverse. A press labelled UNPROVEN carries no answering burden, so a MISSES on it breaks nothing. For a link-state line (\\\"D5: STANDS\\\"), the quoted answers are that side\\'s ANSWER CHECK lines given you: STANDS is right unless one of them, on a press against this link, is MISSES or FAILS. AGREE when the judge\\'s grade is right; DISAGREE when it is not.\\n'"],
 // (5)
 ["items.push({ids,text:'ITEM K'+ci+' (E-COL, a collision line graded against a link):\\nTHE LINE: '+cut(g.line,1600)+'\\nTHE JUDGES WHO WROTE IT: '+ids.map(x=>x.id+' ('+x.seat+')').join(', ')});}",
  "items.push({ids,text:'ITEM K'+ci+' (E-COL, a collision line graded against a link):\\nTHE LINE: '+cut(g.line,1600)+'\\nTHE JUDGES WHO WROTE IT: '+ids.map(x=>x.id+' ('+x.seat+')').join(', ')+failsNote(g.line)});}"],
 ["let ci=0;\n",
  "let ci=0;\n/* pkgEF (5) (W3 2477 ruling 2): FAILS words found exactly (spacing and quote marks aside) in the round named on the ANSWER are that side's own words */\nconst Nx=s=>String(s||'').replace(/[“”]/g,'\"').replace(/[’‘]/g,\"'\").replace(/\\s+/g,' ').trim();\nconst failsNote=l0=>{const l=String(l0).replace(/\\\\+\"/g,'\"');if(!/^FORCED/.test(l)||!R)return '';const a0=l.match(/ANSWER\\s*\\[\\s*(?:([CD])R\\s*(\\d)|(Defender|Challenger)\\s*R(?:ound)?\\s*(\\d))\\s*\\]/);const a=a0?[null,(a0[1]||(a0[3]==='Defender'?'C':'D'))+'R'+(a0[2]||a0[4])]:null;const f=l.match(/--\\s*FAILS\\s*:\\s*\"([\\s\\S]+)\"\\s*$/);if(!a||!f||!R[a[1]])return '';const q=Nx(f[1]);if(q.length<12||!Nx(R[a[1]]).includes(q))return '';const an=l.match(/ANSWER\\s*\\[[^\\]]*\\]\\s*:\\s*\"([\\s\\S]*?)\"\\s*--\\s*FAILS\\s*:/);if(an&&Nx(an[1]).includes(q))return '';/* W3 2484: no note when the FAILS words only repeat the ANSWER */\n return '\\nThe FAILS words are found in ['+a[1]+']; read them as part of the answer. FORCED holds only if the answer\\'s words, these included, state something the MEANS cannot agree with; a rival reading is not that.';};\n"],
 ["it is not broken because no verse states it, or because of an absence. AGREE when",
  "it is not broken because no verse states it, or because of an absence. When the item says the FAILS words are found exactly in the round of the answer, those words are the answering side\\'s own and are read as part of its answer. AGREE when"],
];
const nodes=[['Judge Enforcer Build','Judge_Enforcer_Build.js'],['Alt Judge Enforcer Build','Alt_Judge_Enforcer_Build.js']];
fs.mkdirSync(OUT+'/patched',{recursive:true});const plan={base:BASE,nodes:[]};
for(const [name,file] of nodes){const s0=fs.readFileSync(BASE+'/'+file,'utf8');let s=s0;
 for(const [a,b] of E){const n=s.split(a).length-1;if(n!==1)throw new Error(name+': anchor found '+n+' times: '+a.slice(0,90));s=s.replace(a,()=>b);}
 fs.writeFileSync(OUT+'/patched/'+file,s);plan.nodes.push({name,file,base_sha:sha(s0),final_sha:sha(s),edits:E.length});
 console.log(name.padEnd(28),sha(s0),'->',sha(s),E.length+' edits');}
fs.writeFileSync(OUT+'/plan_EF.json',JSON.stringify(plan,null,1));
