// pkgGK test (W3 2302). Run from wall2024/ after pkgGKW/build_GKW.py and pkgGK/build_GK.py: node pkgGK/test_GK.cjs
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c,d)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n+(d?' -- '+d:''));}};
const plan=JSON.parse(rd('pkgGK/plan_GK.json'));
const baseOf=n=>(n.base==='pkgG4W/patched'?'pkgG4W/patched/':'pkgGKW/patched/')+n.file;
T('19 nodes: base and final shas match the plan',plan.nodes.length===19&&plan.nodes.every(n=>sha(rd(baseOf(n)))===n.base_sha&&sha(rd('pkgGK/patched/'+n.file))===n.final_sha));
T('(d) is in all 19 cure-library nodes, once',plan.nodes.every(n=>rd('pkgGK/patched/'+n.file).split('pkgGK (d), W3 2306').length===2));
T('every node parses as an n8n Code node body',plan.nodes.every(n=>{try{new Function('$','$input',rd('pkgGK/patched/'+n.file));return true;}catch(e){console.log('   '+n.file+': '+e.message);return false;}}));
const G4=rd('pkgGK/g4cure.js');const GN=plan.nodes.filter(n=>n.base!=='pkgG4W/patched');T('gateG4Cure2024 is one text, once, in each of the 6 gate-library nodes',GN.length===6&&GN.every(n=>rd('pkgGK/patched/'+n.file).split(G4).length===2));
T('the 13 other nodes differ from pkgG4W only by (d)',plan.nodes.filter(n=>n.base==='pkgG4W/patched').every(n=>rd('pkgGK/patched/'+n.file).replace(/if\(!B0\.length\)\{const AP=[^\n]*?\*\//,'')===rd('pkgG4W/patched/'+n.file)));
const mk=dir=>{const AM=rd(dir+'Alternate_Merge.js');const i0=AM.indexOf("const AM=$('Alternate Merge Seat')");const lib=AM.slice(0,i0);
 return new Function('$','$input',lib+'\nreturn {sbApply2024,gateCure2024,gateItems2024,'+(dir.includes('pkgGK/')?'gateG4Cure2024,':'')+'cureJText};')(()=>{throw new Error('offline');},null);};
const B=mk('pkgGKW/patched/'),N=mk('pkgGK/patched/');
const mkK=dir=>{const AM=rd(dir+'Alternate_Merge.js');const lib=AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"));return new Function('$','$input',lib+'\nreturn {kg4Split,kg4Witnesses,cureRefs};')(()=>{throw new Error('offline');},null);};
// (c) 32998 chatgpt S2 to S4: the judge's rows, stored escaped inside the reasoning string, and the send-back CHANGE TO rows with the tag and no "--"
const rows=['DEFENDER | [CR4] | "I do not claim that the pattern by itself denies a father."','DEFENDER | [CR4] | "The challenger reads these as empowering and presence. Granted."','DEFENDER | [CR4] | "Presence is granted."','DEFENDER | [CR4] | "The verb names what is held, which may be right or wrong."'];
const reasoning='VERDICT: HELD\nOUT-OF-ROUND CONCESSIONS:\n'+rows.join('\n')+'\nCHALLENGER | [DR2] | "I grant the order."\nRESULT: DEFENDER WINS';
const raw=JSON.stringify({verdict:'HELD',reasoning});
const F={verdict_tag:'HELD',defense_standing:'PROP-DEPENDENT',conceded_links:1,challenge_standing:'PROP-DEPENDENT',challenger_conceded_links:1};
const its=[2,3,4].map(i=>({seat:'chatgpt',sid:'S'+i,ans:'CHANGE',line:'DEFENDER CR4: '+rows[i-1].split(' | ')[2],to:rows[i-1]+' TOUCHES NO LINK'}));
T('fixture: the stored rows are found in the judge text by cureJText',rows.every(r=>N.cureJText(raw,true).split('\n').includes(r)));
const rb=B.sbApply2024('chatgpt',raw,F,its,null),rn=N.sbApply2024('chatgpt',raw,F,its,null);
const na=r=>(r&&r.items||[]).filter(x=>x.kind==='NOT APPLIED').map(x=>x.sid);
T('base (pkgGKW, as live): S2, S3, S4 NOT APPLIED, "the flagged line is not in the judge text" (32998 rows 5065 to 5067)',JSON.stringify(na(rb))==='["S2","S3","S4"]',JSON.stringify(rb&&rb.items));
T('pkgGK: S2, S3, S4 applied, and each judge row now carries TOUCHES NO LINK',na(rn).length===0&&['S2','S3','S4'].every(s=>(rn.applied||[]).includes(s))&&rows.slice(1).every(r=>rn.text.split('\n').includes(r+' TOUCHES NO LINK')),JSON.stringify(rn&&{applied:rn.applied,items:rn.items}));
{const t2=[{seat:'chatgpt',sid:'S9',ans:'CHANGE',line:'DEFENDER CR4: "Presence is granted."',to:'DEFENDER | [CR4] | "Presence is granted." -- TOUCHES NO LINK'}];const a=B.sbApply2024('chatgpt',raw,F,t2,null),b=N.sbApply2024('chatgpt',raw,F,t2,null);
 T('a row written with "--" before the tag applies on base and pkgGK alike',(a.applied||[]).includes('S9')&&(b.applied||[]).includes('S9')&&a.text===b.text);}
{const t3=[{seat:'chatgpt',sid:'S8',ans:'CHANGE',line:'DEFENDER CR4: "Presence is not granted."',to:'DEFENDER | [CR4] | "Presence is not granted." TOUCHES NO LINK'}];
 T('a row whose quote is not in the judge text is still NOT APPLIED',JSON.stringify(na(N.sbApply2024('chatgpt',raw,F,t3,null)))==='["S8"]');}
{const t4=[{seat:'chatgpt',sid:'S7',ans:'CHANGE',line:'DEFENDER CR4: "Presence is granted."',to:'DEFENDER | [CR3] | "Presence is granted." TOUCHES NO LINK'}];
 T('the round must match: a CR3 row does not replace the CR4 row',JSON.stringify(na(N.sbApply2024('chatgpt',raw,F,t4,null)))==='["S7"]');}
// (a) 32998 chatgpt G5: the gate change and the round words, as stored (debate_results run ODV1-32998-y1799l9d, excerpts)
const DR2='Isaiah 7:16 "For before the child shall know to refuse the evil, and choose the good" -- MEANS: the sign is bounded by a child\'s age in Isaiah\'s day. -- [L3] Isaiah 8:4 "before the child shall have knowledge to cry, My father" | PROVEN IN [Challenger R1]\nIsaiah 8:8 "the stretching out of his wings shall fill the breadth of thy land, O Immanuel." -- MEANS: Immanuel is addressed in Isaiah\'s own day. -- [L3] Isaiah 7:14 "shall call his name Immanuel" | PROVEN IN [Challenger R1]';
const CR3='  - Isaiah 7:16, "For before the child shall know to refuse the evil, and choose the good". Isaiah 8:3, "I went unto the prophetess; and she conceived, and bare a son". Isaiah 8:8, "O Immanuel".';
const CR4='**ANSWER: Isaiah 7:16, Isaiah 8:3, Isaiah 8:4, Isaiah 8:8 -- D4 -- (C5)**\nIsaiah 7:16: "For before the child shall know to refuse the evil, and choose the good, the land that thou abhorrest shall be forsaken of both her kings."';
const to5='D4 vs C5 (Isaiah 7:16; Isaiah 8:8): DEFENDER LINK BROKEN (Commitment 5) -- [L1] Isaiah 7:16: "For before the child shall know to refuse the evil, and choose the good"; [L3] Isaiah 8:8: "the breadth of thy land, O Immanuel." [DR2] presses: "the sign is bounded by a child\'s age in Isaiah\'s day" and "Immanuel is addressed in Isaiah\'s own day." -- GROUND: The proven presses under premise 5 were left unanswered on those meanings.';
const x5={key:'RULE|K-G4|DEFENDER|D4 VS C5',lines:['D4 vs C5 (Isaiah 7:16; Isaiah 8:8): DEFENDER LINK BROKEN (Commitment 5) -- GROUND: The proven presses about the setting were left unanswered.']};
const R={CR1:'',CR2:'',CR3,CR4,DR1:'',DR2,DR3:'',DR4:''};
{const g=N.gateG4Cure2024(x5,{lines:[to5]},to5,{R});T('chatgpt G5 (32998): stays UNCURED, for the right reason: unanswered-false, the defender\'s CR3 and CR4 name Isaiah 7:16 and 8:8 (needs (d))',!g.cured&&/^unanswered-false/.test(g.why)&&/CR3/.test(g.why)&&/CR4/.test(g.why)&&/Isaiah 7:16/.test(g.why)&&/Isaiah 8:8/.test(g.why),g.why);{const Bk=mkK('pkgGKW/patched/');const ks=Bk.kg4Split('DEFENDER',to5,[{round:'DR2',q:"the sign is bounded by a child's age in Isaiah's day"}],R);T('without (d) (pkgGKW library), the same test reads no witness from chatgpt G5, so it would cure',ks.rests.length===0,JSON.stringify(ks));}console.log('   why: '+g.why);}
{const R2={...R,CR3:'I grant the offer was refused.',CR4:'The sign is what 7:14 says.'};const g=N.gateG4Cure2024(x5,{lines:[to5]},to5,{R:R2});
 T('the same change CURES when no later defender round names Isaiah 7:16 or 8:8 (a truly unanswered press)',g.cured&&/^pressed: quotation found in DR2/.test(g.why),g.why);console.log('   why: '+g.why);}
{const tm=to5.replace('GROUND: The proven presses under premise 5 were left unanswered on those meanings.','GROUND: the sign cannot reach the virgin of 7:14.');const g=N.gateG4Cure2024(x5,{lines:[tm]},tm,{R:{...R,CR3:'x',CR4:'y'}});
 T('a meaning-break ground stays UNCURED: only a FORCED line cures it (ruling 421)',!g.cured&&/ruling 421/.test(g.why),g.why);}
{const tq=to5.replace('[DR2] presses: "the sign is bounded by a child\'s age in Isaiah\'s day" and "Immanuel is addressed in Isaiah\'s own day."','[DR2] presses: "the sign is bounded by the reign of Ahaz alone in that day."');const g=N.gateG4Cure2024(x5,{lines:[tq]},tq,{R:{...R,CR3:'x',CR4:'y'}});
 T('a quotation not found in the named round stays UNCURED (ruling 392)',!g.cured&&/ruling 392/.test(g.why),g.why);}
{const tc=to5.replace('[DR2] presses','[CR3] presses');const g=N.gateG4Cure2024(x5,{lines:[tc]},tc,{R:{...R,CR3:DR2,CR4:'y'}});
 T('a round that does not press the defender (CR3) is not read as the pressing round',!g.cured&&/ruling 392/.test(g.why),g.why);}
// (a) 32998 sol G1 (CHALLENGER LINK BROKEN on Matthew 1:19, pressed in CR3; the challenger's DR3 and DR4 name Matthew 1:19)
const CR3s='Matthew 1:19 "was minded to put her away privily" -- MEANS: the "for" answers the one fact that made him minded to put her away, her being with child before they came together -- [L3] Deuteronomy 22:24 "he hath humbled his neighbour\'s wife"';
const DR3='  - Matthew 1:19: "Then Joseph her husband."\n  - Matthew 1:20: "Joseph, thou son of David, fear not to take unto thee Mary thy wife: for that which is conceived in her is of the Holy Ghost."\n  - Deuteronomy 22:24 calls a betrothed damsel "his neighbour\'s wife."';const DR4='Matthew 1:19: "Then Joseph her husband, being a just [man], and not willing to make her a publick example, was minded to put her away privily."';
const to1='D1 vs C3 (Matthew 1:19): CHALLENGER LINK BROKEN (Commitment 5) -- PRESSED WITH [CR3], CHALLENGER\'S UNSUPPORTED-L4 PREMISES, premise 3: Matthew 1:19 "was minded to put her away privily" -- [L1] Matthew 1:19, "was minded to put her away privily"; [L3] Deuteronomy 22:24, "he hath humbled his neighbour\'s wife" -- GROUND: [CR3] presses "her being with child before they came together", and [DR3] leaves that connection unanswered.';
const x1={key:'RULE|K-G4|CHALLENGER|D1 VS C3',lines:['D1 vs C3 (Matthew 1:19): CHALLENGER LINK BROKEN -- GROUND: C3 leaves the proven contextual witness unanswered in meaning.']};
{const g=N.gateG4Cure2024(x1,{lines:[to1]},to1,{R:{CR1:'',CR2:'',CR3:CR3s,CR4:'',DR1:'',DR2:'',DR3,DR4}});T('sol G1 (32998): stays UNCURED as unanswered-false: DR3 names Deuteronomy 22:24, its pressed witness',!g.cured&&/^unanswered-false/.test(g.why)&&/DR3/.test(g.why),g.why);console.log('   why: '+g.why);}
// wiring: gateCure2024 calls the K-G4 test only for a RULE K-G4 item whose change was applied and is still raised; the other branches are unchanged
{const AM=rd('pkgGK/patched/Alternate_Merge.js');T('gateCure2024 routes only RULE K-G4, applied and still raised, to gateG4Cure2024',AM.includes("else if(x.kind==='RULE K-G4'&&applied.has(x.gid)&&now.has(x.key)){const g=gateG4Cure2024(x,(R2.items||[]).find(z=>z.key===x.key),a.to,ctx);cured=g.cured;why=g.why;}"));}
// pkgGKW's own test still passes on the stacked files: grok G1 KEEP cured (W3 2299)
{const raw='KEYSTONE: D6 -- STANDS -- D6 is not graded DEFENDER LINK BROKEN.\nCONCEDED LINKS: 0\nD6 vs C6 (Romans 1:3): CHALLENGER LINK BROKEN -- GROUND: [L1] Romans 1:3 "made of the seed of David according to the flesh" with [L3] Matthew 1:18 "she was found with child of the Holy Ghost."';
 const F={verdict_tag:'HELD',defense_standing:'SELF-SUPPORTED',conceded_links:0,challenge_standing:'COLLAPSED',challenger_conceded_links:1};
 const its=[{seat:'grok',sid:'S19',ans:'CHANGE',line:'KEYSTONE: D6 -- STANDS -- D6 is not graded DEFENDER LINK BROKEN.',to:'KEYSTONE: D6 -- BROKEN -- D6 is broken at D6 vs C6 because it cannot agree with the loins-seed through Joseph.'}];
 const ctx={R:null,DL:[],ask:false};const G=N.gateItems2024('grok',raw,F,its,ctx).items;const c=G.length?N.gateCure2024('grok',raw,F,its,G,'GATE: G1 || KEEP || The collision keeps D6.',ctx):null;const r=c&&c.res&&c.res[0];
 T('grok G1 (32998 shape): KEEP on the E-APPLY CONTRADICTION is CURED, "change withdrawn" (pkgGKW, kept)',!!r&&r.cured&&/change withdrawn/.test(r.why),JSON.stringify(r));}
// (d) replay: the 27 stored K-G4 items (pkgG4W fixtures: 32973, 32980; 32985 saved log body): witnesses read before and after (d)
{const KB=mkK('pkgGKW/patched/'),KN=mkK('pkgGK/patched/');const Bd=JSON.parse(rd('/mnt/project-files/wall2024/enforcer_log_body_32985.json'));
 const r85=(Array.isArray(Bd)?Bd:(Bd.p_rows||Bd.rows)).filter(r=>r.rule==='K-G4').map(r=>({run:'32985',seat:r.seat,item:r.item,line:r.flagged_line}));const all=JSON.parse(rd('pkgG4W/fixture_g4_32973_32980.json')).concat(r85);
 const ch=[];for(const x of all){for(const pt of ['','Isaiah 7:16 Isaiah 8:8 Matthew 1:19 Matthew 1:25 Luke 1:35 Romans 1:3']){const a=KB.kg4Witnesses(x.line,'',pt),b=KN.kg4Witnesses(x.line,'',pt);if(JSON.stringify(a)!==JSON.stringify(b))ch.push(x.run+' '+x.seat+' '+x.item+': '+a+' -> '+b);}}
 console.log('   (d) replay: '+all.length+' stored K-G4 items; witnesses changed: '+ch.length+(ch.length?' '+ch.join(' | '):''));T('(d) changes no witness on the 27 stored K-G4 items',all.length===27&&ch.length===0);
 const g=[['chatgpt G5',to5,'DEFENDER',"the sign is bounded by a child's age in Isaiah's day",'DR2',R],['sol G1',to1,'CHALLENGER','her being with child before they came together','CR3',{CR3:CR3s,DR3,DR4}]];
 for(const [n,l,sd,q,rk,RR] of g){const a=KB.kg4Split(sd,l,[{round:rk,q}],RR),b=KN.kg4Split(sd,l,[{round:rk,q}],RR);console.log('   32998 '+n+': witnesses before (d) ['+a.rests+'], after ['+b.rests+']; answered by '+b.answered.map(z=>'['+z.round+'] '+z.ref).join(', '));}}
console.log(ok+' OK '+bad+' FAIL');process.exitCode=bad?1:0;
