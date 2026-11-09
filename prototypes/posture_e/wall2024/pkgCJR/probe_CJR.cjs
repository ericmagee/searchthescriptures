// pkgCJR probe: cureLines on cure replies, base vs pkgCJR. (1) a reply built in the shape of Haiku's 34016 cure reply (enforcer log row 27957):
// compact JSON, "reasoning" with \n escapes and unescaped quotation marks, so JSON.parse fails; (2) the same reply made valid; (3) plain text; (4) every saved cure call reply.
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');
const mk=p=>{const S=rd(p+'/patched/Alternate_Merge_Seat.js');return new Function('$','$input',S.slice(0,S.indexOf("let PP=$('Panel Cure Check')"))+'\nreturn {cureLines,cureText};')(()=>{throw 0},null);};
const O=mk(process.argv[2]||'pkgLIB/strip_WLG'),N=mk(process.argv[3]||'pkgLIB/strip_CJR');let ok=0,bad=0;const T=(c,m)=>{c?ok++:bad++;console.log((c?'OK   ':'FAIL ')+m);};
const L=['Line 1 (verdict): PARTIAL -- the defender\'s chain has one counted premise (defender premise 4, LINK 1) narrowed.','RESULT: UNDERDETERMINED -- the record leaves open whether the paternal union inference holds.',
 'ANSWER CHECK: Hebrews 7:14 -- [DR3] -- MEANS: the verse names the tribe -- ANSWER: "Hebrews 7:14 names the tribe" -- MEETS.','FORCED: none graded.',
 'RESPONSE: K-G1 cure: no K-G1 item flagged; no BROKEN line rests on an unanswered pressed witness.',
 'RESPONSE: K-W DEFENDER CR2 no link heading #1 | NOT HELD: the sentence withdraws a claim about a verse\'s content, not a link\'s footing.',
 'RESPONSE: K-W DEFENDER CR2 D2 #2 | CONCEDED: the grant that \'born of a woman\' is said of men with fathers stands.',
 'RESPONSE: K-W CHALLENGER DR3 LINK 3 #3 | NOT HELD: the dropped limb is the challenger\'s own knowledge-of-cause claim.',
 'RESPONSE: K-CMTL line 1 | NOT A GRADE: the line \'FORCED: none graded.\' grades nothing.',
 'RESPONSE: K-RUL keystone | (Commitment 11) RULING -- keystone D6 -- STANDS. CLAIM: the seed is David\'s. NAMED BY: \\"made of a woman\\" (Galatians 4:4) in [CR1].',
 'DEFENDER CHAIN MARK: STRAINED -- the union inference floats.'];
const head='{"verdict_tag":"PARTIAL","defense_standing":"PROP-DEPENDENT","challenge_standing":"PROP-DEPENDENT","conceded_links":1,"challenger_conceded_links":0,"counted_premises_defender":[4],"counted_premises_challenger":[],"reasoning":"';
const bad1=head+L.join('\\n')+'"}';let threw=false;try{JSON.parse(bad1);}catch(e){threw=true;}T(threw,'the Haiku-shaped reply is not valid JSON (unescaped quotation marks), as row 27957');
const lab=o=>o.response.map(r=>r.label).join(' ; ');
const a=O.cureLines(bad1),b=N.cureLines(bad1);T(a.response.length===0&&b.response.length===5,'invalid JSON reply: RESPONSE lines read '+a.response.length+' -> '+b.response.length+' ('+lab(b)+')');
T(b.response.some(r=>/K-RUL keystone/.test(r.label)&&/"made of a woman"/.test(r.text)),'the escaped quotation marks inside a line read as plain quotation marks');
const good=JSON.stringify({verdict_tag:'PARTIAL',reasoning:L.join('\n').replace(/\\"/g,'"')});const g0=O.cureLines(good),g1=N.cureLines(good);T(JSON.stringify(g0)===JSON.stringify(g1)&&g1.response.length===5,'valid JSON reply: read the same before and after ('+g1.response.length+' RESPONSE lines)');
const plain=L.join('\n');T(JSON.stringify(O.cureLines(plain))===JSON.stringify(N.cureLines(plain)),'plain text reply: unchanged');
const noesc='{"verdict_tag":"HELD", "note": "no reasoning key, "bad" quote"}';T(JSON.stringify(O.cureLines(noesc))===JSON.stringify(N.cureLines(noesc)),'invalid JSON with no \\n escapes: unchanged');
// every saved cure call reply
const D='/mnt/project-files/wall2024/inputs/';let n=0,same=0;const ch=[];
for(const f of fs.readdirSync(D).filter(f=>/_(?:Panel_)?(?:Alternate_|R2_Alternate_)?Cure_Call/.test(f)||/_Cure_Call/.test(f))){let d;try{d=JSON.parse(rd(D+f));}catch(e){continue;}
 for(const r of (Array.isArray(d)?d:[d])){const it=(r.data&&r.data.main&&r.data.main[0])||[];for(const x of it){const ct=O.cureText(x.json);if(!ct.ok)continue;n++;if(JSON.stringify(O.cureLines(ct.text))===JSON.stringify(N.cureLines(ct.text)))same++;else ch.push(f);}}}
T(n>0&&same===n,'saved cure call replies: '+n+' read, '+same+' read the same'+(ch.length?' (changed: '+ch.join(', ')+')':''));
console.log('TOTAL '+ok+' OK, '+bad+' FAIL');
