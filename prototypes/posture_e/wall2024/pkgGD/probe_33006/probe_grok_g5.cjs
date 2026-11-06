// Run 33006 grok G5/G6 (W2): three gate items name one ANSWER CHECK line that send-back S8 rewrote; the judge gives the same CHANGE TO three
// times. Lines are from debate_enforcer_log rows 5554 (S8), 5573-5575 (G4-G6). The collision lines are shortened to their link, grade and witness.
// Run from wall2024/: node pkgGD/probe_33006/probe_grok_g5.cjs
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');
const mk=file=>{const AM=rd(file);const lib=AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"));
 return new Function('$','$input',lib+'\nreturn {gateCure2024,gateItems2024,sbApply2024};')(()=>{throw new Error('offline');},null);};
const AC0='ANSWER CHECK: Matthew 1:20 -- [CR3] -- MEANS: "the verse that carries the margin\'s begetting-verb names Joseph, son of David, and his wife in the same breath" -- ANSWER: "He is the one addressed and told to take his wife. The of the Holy Ghost clause is the reason given to him." -- MEETS -- "the verb is the margin\'s begetting-verb for what is in her."';
const S8='ANSWER CHECK: Matthew 1:20 -- [CR3] -- MEANS: "the verse that carries the margin\'s begetting-verb names Joseph, son of David, and his wife in the same breath" -- ANSWER: "He is the one addressed and told to take his wife. The "of the Holy Ghost" clause is the reason given to him." -- MISSES -- "The "of the Holy Ghost" clause is the reason given to him" (Commitment 5)';
const GT='ANSWER CHECK: Matthew 1:20 -- [CR3] -- MEANS: "the verse that carries the margin\'s begetting-verb names Joseph, son of David, and his wife in the same breath" -- ANSWER: "Matthew 1:20 names Joseph, the son of David. He is the one addressed and told to take his wife. The "of the Holy Ghost" clause is the reason given to him, and the verb is the margin\'s begetting-verb for what is in her." -- MEETS -- "the verb is the margin\'s begetting-verb for what is in her"';
const COL=['D2 vs C3 (Matthew 1:20): CHALLENGER LINK BROKEN -- [L1] Matthew 1:20 "for that which is conceived in her is of the Holy Ghost" GROUND: the press on Matthew 1:20 was met.',
 'D2 vs C4 (Matthew 1:19): CHALLENGER LINK BROKEN -- [L1] Matthew 1:19 "was minded to put her away privily" [L3] Matthew 1:20 "for that which is conceived in her is of the Holy Ghost." GROUND: the press was met.',
 'D6 vs C6 (Matthew 1:20): CHALLENGER LINK BROKEN -- [L1] Matthew 1:20 "that which is conceived in her is of the Holy Ghost" GROUND: the press was met.'];
const F={verdict_tag:'HELD',defense_standing:'SELF-SUPPORTED',conceded_links:0,challenge_standing:'COLLAPSED',challenger_conceded_links:3};
const raw=JSON.stringify({...F,reasoning:'HELD.\nANSWER CHECKS:\n'+AC0+'\nCOLLISIONS:\n'+COL.join('\n')+'\nRESULT: DEFENDER WINS'},null,2);
const its=[{seat:'grok',sid:'S8',rule:'E-ANS',ans:'CHANGE',line:AC0,to:S8}];const ctx={R:null,DL:[],ask:false};
for(const [name,file] of [['be10d6ae (pkgG4W, live at 33006)','pkgG4W/patched/Alternate_Merge.js'],['e46017fd (pkgGD, live now)','pkgGD/patched/Alternate_Merge.js']]){const M=mk(file);
 const G=M.gateItems2024('grok',raw,F,its,ctx).items;console.log('== '+name+': gate items '+G.map(x=>x.gid+' '+x.kind+' ['+x.src+'] '+(x.lines||[]).map(l=>l.slice(0,9)).join('+')).join('; '));
 const reply=G.map(x=>'GATE: '+x.gid+' || CHANGE TO: '+GT+' || the answer meets the press').join('\n');
 const C=M.gateCure2024('grok',raw,F,its,G,reply,ctx);
 C.res.forEach(r=>console.log('   '+r.gid+' '+r.kind+': '+(r.cured?'CURED':'UNCURED')+' -- '+r.why));
 console.log('   uncured counted '+C.uncured+'; E-APPLY on the corrected text: applied '+C.R2.R1.applied.join(',')+'; items after the gate: '+(C.R2.items.map(z=>z.kind+' '+z.src).join('; ')||'none'));}
