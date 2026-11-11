// W3: merge of engine manual section 18 into the rule sections. usage: node merge.cjs <base.md> <out.md>
const fs=require('fs');const [inF,outF]=process.argv.slice(2);const c=fs.readFileSync(inF,'utf8');
const D=fs.readFileSync('/mnt/project-files/w2/manual_merge_s18_draft_w2.md','utf8').split('\n');const dl=(a,b)=>D.slice(a-1,b).join('\n'); // W2 draft lines, 1-based inclusive
const i18=c.indexOf('\n## 18. Writes after s82');if(i18<0)throw new Error('s18');
const body=c.slice(0,i18),s18=c.slice(i18+1);const parts=s18.split(/\n(?=### )/);const E=parts.slice(1).map(p=>{const L=p.split('\n');return {h:L[0].replace(/^### /,''),L:L.slice(1).filter(x=>x.trim()&&x.trim()!=='---')};});
if(E.length<56)throw new Error('entries '+E.length);
const want=(n,rx)=>{if(!rx.test(E[n-1].h))throw new Error('entry '+n+' is '+E[n-1].h.slice(0,60));};
[[1,/pkgSJR/],[5,/ANSWER OPEN/],[11,/The break/],[16,/pkgVP4/],[17,/pkgVP3/],[25,/pkgVPD/],[34,/pkgQRD/],[35,/pkgF3A/],[36,/pkgGFC/],[37,/pkgKSR/],[38,/pkgGCCN/],[39,/pkgGCP/],[40,/pkgGUB/],[41,/pkgK7C/],[42,/pkgEAD/],[44,/pkgOON rev 2/],[45,/pkgGK1/],[46,/pkgKCQ/],[47,/pkgKWQ/],[49,/pkgBRF/],[50,/pkgCCM/],[51,/pkgCMS/],[53,/pkgOON3/],[55,/pkgRTE/],[56,/pkgPLT/]].forEach(([n,rx])=>want(n,rx));
const PROV=/^\s*(?:-\s*)?(?:Size measured|Size of the write|Size\b|Grades?\b|Finding\b|History\b|Shown offline|Stored text|Stored effect|Checked by W3|Unproven until|Entered by W3|\(Section written by W3|Source:|Anchor:|Line numbers|This is the DeepSeek enforcer fix)/;
const reg={};const used=new Set();
const take=(n,opt={})=>{const e=E[n-1];used.add(n);const keep=[];reg[n]=reg[n]||[];e.L.forEach((l,k)=>{if(opt.only&&!opt.only.includes(k)){return;}if(opt.drop&&opt.drop.includes(k)){reg[n].push('(replaced by a later rule) '+l.trim().replace(/^- /,''));return;}if(PROV.test(l)&&!(opt.keep||[]).includes(k)){reg[n].push(l.trim().replace(/^- /,''));return;}keep.push(l);});return keep;};
const blk=(head,lines)=>'- '+head+'\n'+lines.map(l=>'  '+(/^\s*(?:-|\d+\.)\s/.test(l)||/^\s/.test(l)?l:'- '+l)).join('\n');
const LEAD=s=>'- RULES WRITTEN AFTER s82 (each from the package named; where one differs from the text above it in this section, the later rule is right; library line numbers are those of the version the package was written on, so find a line by its text):';
const add={4:[],6:[],7:[],8:[],9:[],10:[],14:[],15:[],17:[]};
// section 4
add[4].push(blk('CHALLENGER CACHE MARKERS (pkgCCM):',take(50)));
// section 6
add[6].push(blk('CLOSE-ROUND BOOK CHECK (pkgBRF rev 4): a bare chapter:verse in a close round is not marked NEW under a borrowed book, and is not dropped.',take(49)));
// section 7
add[7].push(D[17]);used.add(1);reg[1]=['Anchor as handed in: section 10, after the single-judge cure; placed in section 7 with the single judge.'];
// section 8
add[8].push(blk('CONTRADICTION IN THE CLOSING ROUND (the perjury rule; pkgCEC):',take(8).slice(1)));
add[8].push('- '+D[91].replace(/^- Section 8, Commitment 9, last sentence: /,'COMMITMENT 9, last sentence (pkgQRC): '));
// section 9
add[9].push(dl(44,54));[9,12,13,14,15,30,32].forEach(n=>used.add(n));
add[9].push(blk('SHOWN TO THE JUDGES (pkgCEC):',take(10)));
add[9].push(blk('CLOSING BREAK IN THE RECOMPUTE (pkgCEC; library cecBroken2024, cureRecompute, sbApply2024):',take(11)));
add[9].push(blk('KEYSTONE AFTER A CLOSING BREAK, AND THE ENGINE\'S BREAK LINES (pkgKSR, pkgECB rev 3; the sentence on the judge\'s own break line is replaced by pkgRTE rev 3, part EJ, below):',take(37,{drop:[4]})));
add[9].push(blk('REPLACED LINES ARE READ (pkgVP1; RECORD-ONLY; md_notes_rulings 459):',take(4)));
add[9].push(blk('ANSWER OPEN (pkgVP1; E-GATE M, LIVE):',take(5)));
add[9].push(blk('ASSUMPTION CHARGE CHECK (pkgVP4):',take(16)));
add[9].push(blk('BARE ANSWER CHECK (pkgVP3 rev 3, pkgVPD rev 2):',[...take(17),...take(25)]));
add[9].push(dl(83,88));[19,23,24,26,27].forEach(n=>used.add(n));
add[9].push(D[99]+'\n  '+D[100]+'\n  '+D[101]);[28,29].forEach(n=>used.add(n));
add[9].push('- FORCED NONE-LINE (pkgKNL rev 5): '+D[104].replace(/^Merged wording: /,''));
add[9].push('- ANTI-CHEAT ANSWER LINES (pkgACM): '+D[113].replace(/^Merged wording: Anti-cheat answer lines: /,''));used.add(33);
add[9].push(blk('FORCED LINE INSIDE A GATE CHANGE (pkgGFC rev s):',take(36)));
add[9].push(blk('A GATE CHANGE AND THE SEND-BACK COUNT (pkgGCCN rev 3):',take(38,{keep:[]})));
add[9].push(blk('A pkgUND SEND-BACK COUNT AT THE GATE (pkgGUB rev 2):',take(40)));
add[9].push(blk('A LATER CORRECTION AND A CURE-STEP COUNT (pkgGCP rev 1b):',take(39)));
add[9].push(blk('K-G7 AND K-G4 ON A LINK BROKEN BY THE CONFIRMED CLOSING CONTRADICTION (pkgK7C rev 2):',take(41)));
add[9].push(blk('A DEFERRAL READ AS THE WHOLE ANSWER (pkgEAD rev 3b):',take(42)));
add[9].push(blk('OUT-OF-ROUND STRIKE WORDS (pkgOON rev 2; two of its limits are replaced by pkgOON3, next):',take(44,{drop:[9,10]})));
add[9].push(blk('OUT-OF-ROUND STRIKE AFTER ITS LABEL, AND THE FORMS TOLD (pkgOON3):',take(53)));
add[9].push(blk('A K-G1 RAISED BY THE GATE\'S OWN CONTRADICTION ITEM (pkgGK1 rev 1):',take(45)));
add[9].push(blk('K-C AND A LINE THAT COMPARES A CHARGE WITH A QUOTATION (pkgKCQ rev 2):',take(46)));
add[9].push(blk('K-W ANSWER WITH SINGLE QUOTATION MARKS (pkgKWQ rev 2):',take(47)));
add[9].push(blk('A REASONED RETRACTION, AND THE JUDGE\'S OWN BREAK LINE ON A CONFIRMED LINK (pkgRTE rev 3):',take(55)));
add[9].push(blk('THE DEEPSEEK PREMISE ITEM AND THE LINK TAG (pkgPLT):',take(56)));
// section 10
add[10].push('- EARLY ALTERNATE (pkgABH): '+D[108].replace(/^Merged wording: /,''));
add[10].push(blk('UNUSABLE ALTERNATE REPLY (pkgF3A rev 2s):',take(35)));
// section 14
add[14].push(dl(93,94));used.add(20);
add[14].push(blk('REPEATED CONTRADICTION QUESTION (pkgQRD rev 5):',take(34)));
// section 15
add[15].push(dl(76,79));[18,22,31,51].forEach(n=>used.add(n));
// section 17 (open items, each with its home)
add[17].push(dl(172,182));add[17].push(dl(184,186));
add[17].push('- A29: the parser fault in other scoped uses; a second bare reference read by neither check; the book line names the first book only.');
add[17].push(dl(188,189));
// registers for entries replaced by merged wording: the provenance lines only
const provOnly=n=>{reg[n]=reg[n]||[];E[n-1].L.forEach(l=>{const m=l.match(/(Code [-+][\d,]+[^.]*\.|[-+][\d,]+ characters[^.]*\.|Largest single call 46\.3% smaller|Revert [^.]*\.json\.|Found by [^.]*\.)/g);if(m)reg[n].push(...m);});};
[18,21,22,26,27,30,31,32,33].forEach(provOnly);reg[51]=E[50].L.filter(l=>/^- (Size|Shown offline|Limits|Grades)/.test(l)).map(l=>l.replace(/^- /,''));reg[21]=reg[21]||[];reg[21].push(E[20].L[3].replace(/^- /,''));
[2,3,6,7,43,48,52,54].forEach(n=>{used.add(n);reg[n]=E[n-1].L.map(l=>l.trim().replace(/^- /,''));});used.add(21);
const miss=[];for(let n=1;n<=E.length;n++)if(!used.has(n))miss.push(n+' '+E[n-1].h.slice(0,50));if(miss.length)throw new Error('entries not placed: '+miss.join(' | '));
// build
let out=body;const secEnd=n=>{const a=out.indexOf('\n## '+n+'. ');if(a<0)throw new Error('sec '+n);const b=out.indexOf('\n## ',a+5);return b<0?out.length:b;};
for(const n of [17,15,14,10,9,8,7,6,4]){const e=secEnd(n);const AL={A2:'pkgVP1',A5:'the closing enforcer',A3:'ANSWER OPEN',A12:'the question round',A13:'K-S3 follow-up reading',A18:'pkgF3A',A20:'pkgECB',A21:'pkgGCCN',A22:'pkgGCP',A23:'pkgK7C',A24:'pkgEAD',A26:'pkgGK1',A27:'pkgKCQ',A28:'pkgKWQ',A29:'pkgBRF',A30:'pkgCCM'};if(n===17)add[n]=add[n].map(x=>x.replace(/^- (A\d+):/gm,(m,a)=>'- '+(AL[a]||a)+':'));const txt=(n===17?'- OPEN LIMITS OF THE RULES WRITTEN AFTER s82 (each is stated with its rule in its home section):\n'+add[n].map(x=>x.replace(/^/gm,'  ')).join('\n'):LEAD()+'\n'+add[n].map(x=>x.replace(/^/gm,'  ')).join('\n'));out=out.slice(0,e).replace(/\s+$/,'')+'\n'+txt+'\n'+out.slice(e);}
let R='\n## 18. Write register (every write after s82, newest last)\n- The rules of these writes stand in their home sections (4, 6, 7, 8, 9, 10, 14, 15), each under "RULES WRITTEN AFTER s82"; their open limits are also listed in section 17. This section keeps one entry per write as it was handed in: the version, its packages, sizes, files, grades and what was shown offline.\n- The entries in full, as they stood before this merge, are engine_manual version '+(process.argv[4]||'103')+' section 18 and the rows of engine_manual_log.\n- A new write is entered by a new manual version that adds its rule to its home section and its entry here, so the last entry names the live flow.\n- Everything from s91 on is unproven until two clean repeated debates. A dry regrade is not a run.\n';
E.forEach((e,i)=>{if(!/pkg|^s\d+/.test(e.h)&&!(reg[i+1]||[]).length)return;R+='- '+e.h+'\n'+(reg[i+1]||[]).map(l=>'  - '+l).join('\n')+((reg[i+1]||[]).length?'\n':'');});
out=out.replace(/\s+$/,'')+'\n'+R;fs.writeFileSync(outF,out);
// no-silent-drop report
const norm=s=>s.trim().replace(/^- /,'').replace(/\*\*/g,'');const hay=out.replace(/\*\*/g,'');let lost=[];E.forEach((e,i)=>e.L.forEach(l=>{const q=norm(l);if(q.length>8&&!hay.includes(q))lost.push((i+1)+'| '+q.slice(0,110));}));
console.log('base',c.length,'out',out.length,'entries',E.length,'| lines of section 18 not found verbatim:',lost.length);fs.writeFileSync(outF+'.lost.txt',lost.join('\n'));
