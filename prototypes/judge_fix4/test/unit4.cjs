// judge_fix4 unit fixtures, one block per F item (and R3, the operator's ruling on "quoted fully"); each fixture runs on every node that carries the code.
const fs=require('fs');const L=require('./lib4.cjs');const D=L.D;let bad=0,n=0;
const ok=(name,c,info)=>{n++;if(!c)bad++;console.log((c?'ok  ':'BAD ')+name+(info&&!c?' -- '+info:''));};
const CURE=['Alternate Build','Alternate Cure Build','Alternate Cure Normalize','Alternate Merge','Cure Build','Cure Check','Cure Normalize','Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Panel Cure Check','Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3'];
const CHK=['Panel Payloads','Alternate Payloads','Extract Independent Verdict'];const src=nm=>fs.readFileSync(D+'new/'+nm+'.js','utf8');
const r66=JSON.parse(fs.readFileSync(D+'data/run32266.json','utf8'));const E66=JSON.parse(fs.readFileSync(D+'data/enforcer_log_32266.json','utf8'));
// ---------- F1 ----------
{const j=r66.judgments.find(x=>x.judge_seat==='deepseek');const rep=E66.find(e=>e.id===36).full_reply;
 const its=E66.filter(e=>e.seat==='deepseek'&&e.kind==='cure'&&e.rule!=='K-DG8').map(e=>({rule:e.rule,link:e.item,line:e.flagged_line,side:'CHALLENGER'}));
 for(const nm of CURE){const C=L.lib('new',nm);const vs=C.cureVerdicts(its,{ok:true,text:rep},C.cureBroken(C.cureJText(j.verdict_raw,true)),null);
  const F0={verdict_tag:j.verdict_tag,defense_standing:j.defense_standing,conceded_links:j.conceded_links,challenge_standing:j.challenge_standing,challenger_conceded_links:j.challenger_conceded_links};
  const rc=C.cureRecompute('deepseek',C.cureJText(j.verdict_raw,true),F0,its,vs,{ok:true,text:rep});const raw=rc?C.cureRewrite(j.verdict_raw,true,rc,'deepseek',F0):'';
  ok('F1 '+nm+': DeepSeek 32266 retraction of D6 vs C4 gives CHALLENGE SELF-SUPPORTED and RESULT UNDERDETERMINED (fields, text, DB reader)',rc&&rc.fields.challenge_standing==='SELF-SUPPORTED'&&rc.result==='UNDERDETERMINED'&&L.resultWord(raw,'deepseek',rc.fields.challenge_standing)==='UNDERDETERMINED'&&/AUDIT v25: RECOMPUTED AFTER CURE/.test(raw)&&!/RESULT\s*:\s*DEFENDER WINS/.test(raw.split('[AUDIT v25')[0].replace(/\\n/g,'\n')),JSON.stringify(rc&&rc.fields));}
 // a count corrected up to collapse: PARTIAL-2, RESULT UNDERDETERMINED, a CORRECTED RESULT line the DB reads first
 const C=L.lib('new','Panel Cure Check');const txt='HELD.\nRESULT: DEFENDER WINS -- x.\nCLAUSE: HELD-1 -- n=6 w=0 k=0\nKEYSTONE: D6 -- STANDS -- footed.\nDEFENSE STANDING: PROP-DEPENDENT -- L=6 c=1 -- one.\nCONCEDED LINKS: 1 -- premise 2 UNEXHIBITED.\nCHALLENGE STANDING: PROP-DEPENDENT -- L=5 c=1 -- one.\nCHALLENGER CONCEDED LINKS: 1 -- premise 3 UNEXHIBITED.\nD1 vs C1 (Luke 1:5): UNDERDETERMINED -- GROUND: answered in [CR3].';
 const raw=JSON.stringify({verdict_tag:'HELD',defense_standing:'PROP-DEPENDENT',challenge_standing:'PROP-DEPENDENT',conceded_links:1,challenger_conceded_links:1,reasoning:txt},null,2);
 const it=[{rule:'K-G6',side:'DEFENDER',link:'DEFENDER premise 4',line:'premise 4: NOT NAMED: Luke 1:5',conc:1,st:'PROP-DEPENDENT',L:6},{rule:'K-G6',side:'DEFENDER',link:'DEFENDER premise 5',line:'premise 5: NOT NAMED: Luke 1:6',conc:1,st:'PROP-DEPENDENT',L:6},{rule:'K-G6',side:'DEFENDER',link:'DEFENDER premise 6',line:'premise 6: NOT NAMED: Luke 1:7',conc:1,st:'PROP-DEPENDENT',L:6}];
 const rep2='CORRECTED COUNT: DEFENDER 4\nCORRECTED STANDING: DEFENDER COLLAPSED\nRESPONSE: K-G6 DEFENDER premise 4 | accepted, [DR2] pressed Luke 1:5 and no round answered it.\nRESPONSE: K-G6 DEFENDER premise 5 | accepted, [DR2] pressed Luke 1:6.\nRESPONSE: K-G6 DEFENDER premise 6 | accepted, [DR2] pressed Luke 1:7.';
 const vs=C.cureVerdicts(it,{ok:true,text:rep2},null,{});const F0={verdict_tag:'HELD',defense_standing:'PROP-DEPENDENT',conceded_links:1,challenge_standing:'PROP-DEPENDENT',challenger_conceded_links:1};
 const p={...F0};const cs=C.cureSet({ok:true,text:rep2},vs);C.cureSetApply(p,cs,'x');const rc=C.cureRecompute('x',txt,p,it,vs,{ok:true,text:rep2});const out=rc?C.cureRewrite(raw,true,rc,'x',p):'';
 ok('F1: a count corrected to 4 of L=6 recomputes DEFENSE COLLAPSED, PARTIAL-2, RESULT UNDERDETERMINED; the CORRECTED RESULT line the DB reads comes first',rc&&rc.tag==='PARTIAL-2'&&rc.fields.defense_standing==='COLLAPSED'&&rc.result==='UNDERDETERMINED'&&L.resultWord(out,'x',rc.fields.challenge_standing)==='UNDERDETERMINED'&&/"verdict_tag": "PARTIAL"/.test(out)&&/CLAUSE: PARTIAL-2/.test(JSON.parse(out.slice(0,out.indexOf('\n[AUDIT'))).reasoning),JSON.stringify(rc&&{tag:rc.tag,f:rc.fields}));
 ok('F1: a cure that retracts, regrades and recounts nothing triggers no recompute',C.cureRecompute('x',txt,F0,[{rule:'K-C',link:'REASONING',line:'x'}],[{rule:'K-C',link:'REASONING',status:'CURED'}],{ok:true,text:'RESTATED: REASONING: HELD on the chain.'})===null);
 // the single judge's record (plain text): 32266, two retractions and a K-N count restated 2 -> 0
 const S=r66.independent_verdict_raw;const rs=E66.find(e=>e.id===56).full_reply;const sits=E66.filter(e=>e.seat==='single'&&e.kind==='cure'&&e.rule!=='K-DG8').map(e=>({rule:e.rule,link:e.item,line:e.flagged_line,side:/DEFENDER LINK BROKEN/.test(e.flagged_line||'')?'DEFENDER':(e.rule==='K-N'||e.rule==='K-SC'?'DEFENDER':'CHALLENGER')}));
 const CC=L.lib('new','Cure Check');const v2=CC.cureVerdicts(sits,{ok:true,text:rs},CC.cureBroken(CC.cureJText(S,false)),null);
 const FS={verdict_tag:'HELD',defense_standing:'PROP-DEPENDENT',conceded_links:2,challenge_standing:'PROP-DEPENDENT',challenger_conceded_links:0};const rc2=CC.cureRecompute(null,CC.cureJText(S,false),FS,sits,v2,{ok:true,text:rs});const t2=rc2?CC.cureRewrite(S,false,rc2,null,null):'';
 ok('F1 (Cure Check): the single judge 32266 recomputes to DEFENSE SELF-SUPPORTED 0, CHALLENGE SELF-SUPPORTED, RESULT UNDERDETERMINED in its text',rc2&&rc2.fields.defense_standing==='SELF-SUPPORTED'&&rc2.fields.conceded_links===0&&rc2.result==='UNDERDETERMINED'&&/\nRESULT: UNDERDETERMINED/.test(t2),JSON.stringify(rc2&&rc2.fields));}
// ---------- F2 ----------
for(const nm of CURE.concat(CHK)){const s=src(nm);ok('F2 '+nm+': no K-DG8 mark, item, cure test or cure text',!/dg8Lines|DG8_|'K-DG8'|the record holds|DG-8 holds/.test(s));}
for(const nm of CHK){const K=L.chk('new',nm);const t='COLLISION POINTS:\nD6 vs C4 (Matthew 1:25): CHALLENGER LINK BROKEN -- [L1] Matthew 1:25 "knew her not till she had brought forth" with [L2] heos hou (until) -- GROUND: the text places no knowing before the birth, which excludes the union.';
 const d=K.drvCheck(t,0,0,'SELF-SUPPORTED','PROP-DEPENDENT',false,[]);ok('F2 '+nm+': a Matthew 1:25 ground draws no K-DG8 item',!d.items.some(x=>x.rule==='K-DG8')&&!d.marks.some(m=>/K-DG8/.test(m)));}
{const t=L.lib('new','Panel Cure Check').CURE_RULE_G;ok('F2: the cure rule names no K-DG8 and carries no record doctrine on Matthew 1:18 or 1:25',!/K-DG8|record holds|Matthew 1:25|Matthew 1:18/.test(t));}
// ---------- F3 ----------
{const glm=E66.find(e=>e.id===39).full_reply;
 for(const nm of CURE){const C=L.lib('new',nm);const o=C.cureLines(glm);ok('F3 '+nm+': GLM 32266 cure reply: ten RETRACTED lines read with their regrade and reason, none malformed',o.withdrawn.length===10&&o.withdrawn.every(w=>w.regrade==='UNDERDETERMINED'&&/\[DR1\]/.test(w.reason||''))&&!o.malformed.some(l=>/^RETRACTED/.test(l)),o.withdrawn.length+' / '+o.malformed.length);}
 const C=L.lib('new','Panel Cure Check');
 ok('F3: the bare form still parses',C.cureLines('RETRACTED: D6 vs C4').withdrawn.length===1);
 ok('F3: a rule name before the label is allowed',C.cureLines('RETRACTED: K-G4 D2 vs C5 -- [DR3] answered it').withdrawn[0].link==='D2 vs C5');
 ok('F3: a "retraction" regraded to a LINK BROKEN grade is no retraction',C.cureLines('RETRACTED: D2 vs C5 -- regraded CHALLENGER LINK BROKEN').withdrawn.length===0);
 ok('F3: a retraction keeps its own reason: carried by its own line ([DR1] and a quotation)',C.cureReasoned(C.cureLines("RETRACTED: D1 vs C6 (Matthew 1:18) -- regraded UNDERDETERMINED -- [DR1] answered this witness (\"she was found with child\")\nCORRECTED RESULT: HELD-1"),[]).has('D1 VS C6'));
 const its=[{rule:'K-G4',link:'D2 vs C4',side:'CHALLENGER',line:'D2 vs C4: CHALLENGER LINK BROKEN -- x'},{rule:'K-G4',link:'D1 vs C6',side:'CHALLENGER',line:'D1 vs C6: CHALLENGER LINK BROKEN -- y'}];
 const v=C.cureVerdicts(its,{ok:true,text:'RESTATED: D1 vs C6 the challenger: nonsense\nPRESSED: D2 vs C4 [CR1] no bars\nRESPONSE: K-G4 D2 vs C4 | wrong form test, the challenger in [DR1].\nRESPONSE: K-G4 D1 vs C6 | wrong form test, the challenger in [DR1].'},null,{});
 const a=v.find(x=>x.link==='D2 vs C4'),b=v.find(x=>x.link==='D1 vs C6');
 ok('F3: each item reports its own refused line, never another item\'s (old code gave D2 vs C4 the line "RESTATED: D1 vs C6 the challenger ...")',/malformed line: PRESSED: D2 vs C4/.test(a.why||'')&&!/D1 vs C6/.test(a.why||''),a.why);
 ok('F3: cureOwn: "D1" is not "D10"',C.cureOwn('RETRACTED: D10 vs C1 x',{rule:'K-B',link:'D1 vs C1'})===false&&C.cureOwn('RETRACTED: D1 vs C1 x',{rule:'K-B',link:'D1 vs C1'})===true);}
// ---------- F4 ----------
for(const nm of CHK){const K=L.chk('new',nm);const base=L.chk('base',nm);
 const q='COLLISION POINTS:\nD2 vs C4 (Luke 1:34): UNDERDETERMINED -- the challenger wrote "no verse states that no man was involved" -- GROUND: [DR3] answered the witness and [CR3] answered it; the chains are weighed together.';
 ok('F4 '+nm+': K-S/K-S2 do not read a quotation of a side as the judge\'s ground',!K.drvCheck(q,0,0,'SELF-SUPPORTED','SELF-SUPPORTED',false,[]).marks.some(m=>/K-S2?\)/.test(m)));
 const g='COLLISION POINTS:\nD2 vs C4 (Luke 1:34): UNDERDETERMINED -- [L1] Luke 1:35 quoted -- GROUND: no verse states the link, read singly.';
 ok('F4 '+nm+': the judge\'s own ground still draws K-S',K.drvCheck(g,0,0,'SELF-SUPPORTED','SELF-SUPPORTED',false,[]).items.some(x=>x.rule==='K-S'));
 const dl=['The text names no human father of Jesus anywhere in its genealogy rows'];
 const k='KEYSTONE: D6 -- STANDS -- The text names no human father of Jesus anywhere in its genealogy rows, and [CR3] exhibited [L1] Matthew 1:20 with [L2] ek (out of).';
 ok('F4 '+nm+': K-C does not read the declared link wording restated on a KEYSTONE line (base did)',!K.drvCheck(k,0,0,'SELF-SUPPORTED','SELF-SUPPORTED',false,dl).items.some(x=>x.rule==='K-C')&&base.drvCheck(k,0,0,'SELF-SUPPORTED','SELF-SUPPORTED',false).items.some(x=>x.rule==='K-C'));
 const u='COLLISION POINTS:\nD3: STANDS -- the challenger said "the witness was left unanswered" -- GROUND: [CR3] answered Matthew 1:16.';
 ok('F4 '+nm+': K-U does not read a quotation',!K.drvCheck(u,0,0,'SELF-SUPPORTED','SELF-SUPPORTED',false,[]).marks.some(m=>/K-U/.test(m)));
 const sc='COLLISION POINTS:\nD4: STANDS -- the challenger claims "[CR3] conceded the link" -- GROUND: [CR3] kept the link with [L1] Isaiah 7:14.';
 ok('F4 '+nm+': K-SC does not read a quoted concession',!K.drvCheck(sc,0,0,'SELF-SUPPORTED','SELF-SUPPORTED',false,[]).items.some(x=>x.rule==='K-SC'));
 const sc2='COLLISION POINTS:\nD4: STANDS -- GROUND: [CR3] conceded the link outright.';
 ok('F4 '+nm+': K-SC still reads the judge\'s own ground',K.drvCheck(sc2,0,0,'SELF-SUPPORTED','SELF-SUPPORTED',false,[]).items.some(x=>x.rule==='K-SC'));}
{const C=L.lib('new','Panel Cure Check');ok('F4: the K-C cure test (netKeeps) reads the ground clause, so a quoted stating phrase is not kept',!C.netKeeps('D2 vs C4: UNDERDETERMINED -- the challenger said "no verse states it" -- GROUND: the chains read together leave it open, [CR3] and [DR3] answered.')&&C.netKeeps('D2 vs C4: UNDERDETERMINED -- GROUND: no verse states the link.'));}
// ---------- F5 ----------
{const s=src('Panel Build');const C4P=new Function(s.slice(s.indexOf('const C4P='),s.indexOf('return {refs,fresh,of,note,ofD,noteD,renum,noteR};})();')+'return {refs,fresh,of,note,ofD,noteD,renum,noteR};})();'.length)+';return C4P;')();
 const F={cr1:r66.claude_r1,gr1:r66.engine_r1,cr2:r66.claude_r2,gr2:r66.engine_r2,cr3:r66.engine_r3,dr3:r66.challenger_r3,cr4:r66.defender_r4,dr4:r66.challenger_r4};const nd=C4P.ofD(F);
 ok('F5: 32266 [CR4] verses new in the close: Leviticus 15:16, Deuteronomy 22:23, Isaiah 7:13, Luke 3:38, 1 Corinthians 15:47 ('+nd.join(', ')+')',['Leviticus 15:16','Deuteronomy 22:23','Isaiah 7:13','Luke 3:38','1 Corinthians 15:47'].every(x=>nd.includes(x)));
 ok('F5: the [CR4] note marks them NEW IN CLOSE, NOT COUNTED and states the round-4 rule',/NEW IN CLOSE, NOT COUNTED/.test(C4P.noteD(F))&&/disregarded/.test(C4P.noteD(F)));
 ok('F5: 32266 [DR4] new presses: none (the C4 check stays silent, as stored)',C4P.of(F).length===0);
 ok('F5: both 32266 closes are flagged as renumbering ("I number D1-D6 ..."; "I number my chain as pressed ...")',C4P.renum(F,'D').length>0&&C4P.renum(F,'C').length>0,JSON.stringify([C4P.renum(F,'D'),C4P.renum(F,'C')]));
 ok('F5: a close that keeps the numbering is not flagged',C4P.renum({cr1:F.cr1,dr3:F.dr3,cr4:'ANSWER: Luke 1:5 -- D5 -- "x". D5 stands.'},'D').length===0);
 for(const nm of ['Panel Build','Build Independent Verdict']){const t=src(nm);ok('F5 '+nm+': the judges are told round-4 material counts only as an answer and a [CR4] sentence grading a challenger link is disregarded; the notes are under [CR4] and [DR4]',/counts only as an answer to a witness already pressed against the defender/.test(t)&&/C4P\.noteD\(/.test(t)&&/C4P\.noteR\(/.test(t));}
 ok('F5: D4 Build and C4 Build ask for the declared numbering; D4 Extract, C4 Extract, Build Save Body record the checks',/do not renumber/.test(src('D4 Build'))&&/do not renumber/.test(src('C4 Build'))&&/new_in_close/.test(src('D4 Extract'))&&/renumbered/.test(src('C4 Extract'))&&/CLOSE-ROUND NEW-VERSE CHECK \(D4\)/.test(src('Build Save Body')));}
// ---------- F6 ----------
{const P=v=>{const s=fs.readFileSync(D+v+'/Panel Build.js','utf8');return new Function(s.slice(s.indexOf('const PWL='),s.indexOf('\nconst LEDGER='))+';return PWL;')();};
 const F={cr1:r66.claude_r1,gr1:r66.engine_r1,cr2:r66.claude_r2,gr2:r66.engine_r2,cr3:r66.engine_r3,dr3:r66.challenger_r3,cr4:r66.defender_r4};
 const ln=v=>P(v).judgeBlock(F).split('\n').find(l=>/^cited in \[DR1\] or \[DR2\]/.test(l));
 ok('F6: 32266 ledger: Matthew 1:24 (named by the defender only as "(1:24)") is now listed as not named; base listed none ('+ln('new').slice(0,140)+')',/Matthew 1:24/.test(ln('new'))&&!/Matthew 1:24/.test(ln('base')));
 const p=P('new');const t1='Matthew 1:18 dates it. From the taking of his wife (1:24) to the delivery, he knew her not.',t2='Matthew 1:20 and 1:24 say so.';
 const s=fs.readFileSync(D+'new/Panel Build.js','utf8');const PW=new Function(s.slice(s.indexOf('const PWL='),s.indexOf('\nconst LEDGER=')).replace('return {ledger,judgeBlock,','return {namedIn,isNamed,ledger,judgeBlock,')+';return PWL;')();
 ok('F6 (ledger reader): "(1:24)" in the sentence after "Matthew 1:18" does not name Matthew 1:24; "Matthew 1:20 and 1:24" does',!PW.isNamed(PW.namedIn(t1),'Matthew','1:24')&&PW.isNamed(PW.namedIn(t2),'Matthew','1:24'));
 for(const nm of CURE){const C=L.lib('new',nm);const R={CR1:'x',DR1:'Matthew 1:24 says "took unto him his wife".',CR2:t1,DR2:'',CR3:'',DR3:''};
  ok('F6 '+nm+' (K-G4): a later bare "(1:24)" in another sentence does not answer Matthew 1:24; with its book in the sentence it does',C.kg4Answered('DEFENDER','D6 vs C2 (Matthew 1:24): DEFENDER LINK BROKEN -- unanswered',[{round:'DR1',q:'took unto him his wife Matthew 1:24'}],R).length===0&&C.kg4Answered('DEFENDER','D6 vs C2 (Matthew 1:24): DEFENDER LINK BROKEN -- unanswered',[{round:'DR1',q:'took unto him his wife Matthew 1:24'}],{...R,CR2:t2}).length===1);}}
// ---------- F7, F10 (Quote Compare) ----------
{const run=(code,item,rows)=>new Function('$',code)(nm=>{if(nm==='Citation Scan')return {first:()=>({json:{items:[item]}})};if(nm==='Cited Verses')return {all:()=>rows.map(j=>({json:j}))};throw new Error(nm);})[0].json.items[0];
 const qc=src('Quote Compare');const v14={book:'Isaiah',chapter:7,verse:14,text:'Therefore the Lord himself shall give you a sign; Behold, a virgin shall conceive, and bear a son, and shall call his name Immanuel. [shall call: or, thou, O virgin, shalt call]'};
 const it=q=>({ref:'Isaiah 7:14',book:'Isaiah',chapter:7,v1:14,v2:14,quote:q,side:'CHALLENGER'});
 ok('F7: the 1611 margin quoted ("or, thou, O virgin, shalt call") is MATCHES (MARGIN); base gave PENDING (then WORDING DIFFERS)',run(qc,it('or, thou, O virgin, shalt call'),[v14]).status==='MATCHES (MARGIN)'&&run(fs.readFileSync(D+'base/Quote Compare.js','utf8'),it('or, thou, O virgin, shalt call'),[v14]).status==='PENDING');
 ok('F7: the verse read with the margin reading ("and thou, O virgin, shalt call his name Immanuel") is MATCHES (MARGIN)',run(qc,it('and thou, O virgin, shalt call his name Immanuel'),[v14]).status==='MATCHES (MARGIN)');
 ok('F7: a wrong quotation is still not a match',run(qc,it('a young woman shall bear a son'),[v14]).status==='PENDING');
 ok('F10: switch OFF (default): a part of the verse is MATCHES',run(qc,it('Behold, a virgin shall conceive, and bear a son'),[v14]).status==='MATCHES'&&/const SHORTENED_CHECK=false;/.test(qc));
 const on=qc.replace('const SHORTENED_CHECK=false;','const SHORTENED_CHECK=true;');
 ok('F10: switch ON: a part of the verse is SHORTENED; the whole verse is MATCHES (both sides alike: the side is not read)',run(on,it('Behold, a virgin shall conceive, and bear a son'),[v14]).status==='SHORTENED'&&run(on,{...it('Therefore the Lord himself shall give you a sign; Behold, a virgin shall conceive, and bear a son, and shall call his name Immanuel.'),side:'DEFENDER'},[v14]).status==='MATCHES');
 const qr=src('Quote Report');const rq=new Function('$',qr)(nm=>{if(nm==='Quote Compare')return {first:()=>({json:{read_ok:true,items:[{status:'MATCHES (MARGIN)',ref:'Isaiah 7:14'},{status:'SHORTENED',ref:'Luke 1:35',cite_form:false},{status:'MATCHES',ref:'x'}]}})};if(nm==='Find Words')return {all:()=>[]};})[0].json;
 ok('F7/F10 Quote Report: MATCHES (MARGIN) counts as a match; SHORTENED stays in the report as a mismatch',rq.matches===2&&rq.mismatches===1&&rq.checked===3);
 for(const nm of ['Panel Build','Build Independent Verdict'])ok('F7 '+nm+': MATCHES (MARGIN) is not listed NOT COUNTED to the judges; SHORTENED is',/!\/\^MATCHES\\b\/\.test\(i\.status\)/.test(src(nm)));}
// ---------- F8, F9, R3 ----------
for(const nm of ['Panel Build','Build Independent Verdict']){const t=src(nm);ok('F8 '+nm+': both itemization copies define UNEXHIBITED as no footing offered or a pressed witness left unanswered (ruling 372)',(t.match(/UNEXHIBITED \(no footing offered, or a pressed witness left unanswered\)/g)||[]).length===2&&!/UNEXHIBITED \(no footing offered\) when/.test(t));}
{const t=src('Format Markdown');ok('F8 Format Markdown: the reader\'s copy matches, and "How to read this debate" prints ruling 372',/a pressed witness left unanswered/.test(t)&&/AN UNANSWERED PRESSED WITNESS \(operator ruling 372\)/.test(t));
 const a=t.indexOf('// judge_fix4 F9');const b=t.indexOf("'\\n\\n---\\n\\n'; }",a)+"'\\n\\n---\\n\\n'; }".length;const blk=t.slice(t.indexOf('{ const SC',a),b);
 const out=new Function('r','let t="";'+blk+';return t;')({review_notes:r66.review_notes});
 ok('F9 Format Markdown: the synthesis checks of 32266 are printed (S-A three times, S-C, S-E)',(out.match(/- \*\*S-A\.\*\*/g)||[]).length===3&&/- \*\*S-C\.\*\*/.test(out)&&/- \*\*S-E\.\*\*/.test(out),out.slice(0,300));
 ok('F9: none flagged prints "none flagged."',/none flagged\./.test(new Function('r','let t="";'+blk+';return t;')({review_notes:''})));}
for(const nm of fs.readdirSync(D+'new').map(f=>f.slice(0,-3))){const t=src(nm);if(/fully and correctly|shortened or misquoted/.test(t))ok('R3 '+nm+': old ruling 3 wording left',false);}
{const want=['Panel Build','Build Independent Verdict','Format Markdown','Build Synthesis','Init with Guards'].concat(CURE);for(const nm of want)ok('R3 '+nm+': "a quotation may be part of a verse" with exact KJV words',/a quotation may be part of a verse/.test(src(nm))&&/(exactly the words of the KJV|quote its words exactly as the KJV gives them)/.test(src(nm)));
 ok('R3 Init with Guards: both debater frames carry the new wording',(src('Init with Guards').match(/a quotation may be part of a verse/g)||[]).length===2);}
console.log('\nfixtures '+n+', bad '+bad);process.exitCode=bad?1:0;
