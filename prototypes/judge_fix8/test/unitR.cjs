// judge_fix8 part R unit fixtures (the reviews of run 32306 by Worker_E and Worker_G1; ruling 393), from the stored 32306 data (and 32284 to 32302
// where a counter-case is needed). Run: node test/unitR.cjs
const fs=require('fs');const L=require('./lib8.cjs');const RL=require('./replay_lib.cjs');const RN=require('./runner.cjs');const R8=require('./replay8.cjs');
const D=__dirname+'/../';const src=(v,n)=>fs.readFileSync(D+v+'/'+n+'.js','utf8');
let bad=0,n=0;const ok=(c,what,extra)=>{n++;if(!c)bad++;console.log((c?'ok  ':'BAD ')+what+(extra!==undefined?' -- '+extra:''));};
const CURE=['Alternate Build','Alternate Cure Build','Alternate Cure Normalize','Alternate Merge','Cure Build','Cure Check','Cure Normalize','Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Panel Cure Check','Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3'];
const CHECK=['Panel Payloads','Alternate Payloads','Extract Independent Verdict'];
const C4N=['Build Independent Verdict','Build Save Body','Build Synthesis','C4 Build','C4 Extract','D4 Build','D4 Extract','Format Markdown','Panel Build'];
const RE_END='\n return {parse,keys,book,BK,BOOKS};})();';
const c4p=(v,nm)=>{const s=src(v,nm||'Panel Build');const r=s.indexOf('const REFP=(()=>');const a=s.indexOf('const C4P=(()=>');const b=s.indexOf('})();',s.indexOf(' return {refs,fresh,of',a))+5;return new Function(s.slice(r,s.indexOf(RE_END,r)+RE_END.length)+'\n'+s.slice(a,b)+';return C4P;')();};
const r06=RL.run('32306');const F06=R8.F_(r06);
const prompt=(nn)=>{const F=R8.F_(RL.run(nn));const T=[['[CR1] DEFENDER R1',F.cr1],['[DR1] CHALLENGER R1',F.gr1],['[CR2] DEFENDER R2',F.cr2],['[DR2] CHALLENGER R2',F.gr2],['[CR3] DEFENDER R3 -- LINK ROUND',F.cr3],['[DR3] CHALLENGER R3 -- LINK ROUND',F.dr3]];let u='DEBATE TRANSCRIPT';T.forEach(x=>u+='\n\n=== '+x[0]+' ===\n'+x[1]);return u;};
const judg=(nn,seat)=>RL.judgment(R8.firstRaw(R8.run(nn).judgments.find(j=>j.seat===seat).verdict_raw,true),true);
const C=L.chk('new','Panel Payloads');const CC=L.lib('new','Panel Cure Check');

console.log('== R1: the close-round grading check marks grades and new presses only');
{const B=c4p('base'),N=c4p('new');
 const oldD=B.press({cr1:F06.cr1,dr3:F06.dr3,cr4:F06.cr4},'D').map(x=>x.s),oldC=B.press({cr1:F06.cr1,dr3:F06.dr3,dr4:F06.dr4},'C').map(x=>x.s); // as the live transcript computed them (23 and 37)
 const nD=N.press(F06,'D').map(x=>x.s),nC=N.press(F06,'C').map(x=>x.s);
 ok(oldD.length===23&&oldC.length===37,'base, as the transcript computed it: 23 defender and 37 challenger close sentences',oldD.length+' / '+oldC.length);
 const keep=[3,4,5,6,7,8,9,10,11,12,13,19,20,21,22].map(i=>oldD[i-1]);const hit=keep.filter(s=>nD.includes(s));
 ok(hit.length===0,'defender close items 3-13 and 19-22 (its Matthew 1:18-20 quotations and answers, its grants) come back unmarked',hit.length+' still marked');
 const list=oldC.slice(22,37);const miss=list.filter(s=>!nC.includes(s));
 ok(list.length===15&&miss.length===0,'challenger close items 23-37 (its new UNSUPPORTED-L4 PREMISES list) all come back marked',miss.length+' missing');
 const rest=[5,6,7,8,9].concat([13,14,15,16,17,18,19,20,21,22]).map(i=>oldC[i-1]).filter(s=>nC.includes(s));
 ok(rest.length===0,'challenger close items 5-9 (Jeremiah 22:30, Matthew 1:12, Jeremiah 22:24, Haggai 2:23, Jeremiah 18:8) and 13-22 (its own rows) come back unmarked',rest.join(' | ').slice(0,200));
 console.log('     new: defender '+nD.length+' marked'+(nD.length?' ('+nD.map(s=>'"'+s.slice(0,60)+'"').join('; ')+')':'')+'; challenger '+nC.length+' marked');
 const why=N.press(F06,'C').filter(x=>!list.includes(x.s)).map(x=>x.why+': '+x.s.slice(0,70));console.log('     challenger marks outside the list: '+(why.join(' | ')||'none'));
 // synthetic: a grade of the other side's link is marked; the side's own concession is not
 const syn=t=>N.press({cr1:'',gr1:'',cr2:'',gr2:'',cr3:'',dr3:'',cr4:t},'D').map(x=>x.why);
 ok(syn('C2 is circular.').length===1&&syn('The challenger\'s C4 fails at Luke 1:35.').length===1,'synthetic: "C2 is circular", "the challenger\'s C4 fails" are marked');
 ok(syn('I grant the challenger the verb means presence.').length===0&&syn('[L1] Matthew 1:18: "before they came together, she was found with child of the Holy Ghost."').length===0,'synthetic: the side\'s own grant and a verse quoted for its own link are not marked');
 ok(syn('PRESSED WITH: Luke 1:31 "thou shalt conceive"').length===1,'synthetic: a PRESSED WITH: line in a close is marked');
 for(const nm of C4N){ok(src('new',nm).includes(" // judge_fix8 R1 (run 32306, Worker_E A1")&&src('new',nm).includes('const stored=(notes,sd)=>'),nm+': carries the new check (one copy of the library in 9 nodes)');}
 const md=nm=>{const s=src('new',nm);const a=s.indexOf(' const press=(F,sd)=>{');return require('crypto').createHash('md5').update(s.slice(a,s.indexOf('})();',a))).digest('hex');};ok(new Set(C4N.map(md)).size===1,'the 9 copies are identical');}

console.log('== R2: computed once, stored, printed from the stored result');
{const N=c4p('new');const all=N.all(F06);const line=N.storeLine(all.C,'C');const back=N.stored(line,'C');
 ok(back&&back.length===all.C.length&&back.every((s,i)=>s===all.C[i].replace(/[\[\]"]/g,'')),'the stored AUDIT v27 line reads back sentence for sentence',all.C.length+' sentences');
 const pb=src('new','Panel Build'),bi=src('new','Build Independent Verdict'),fm=src('new','Format Markdown'),bs=src('new','Build Synthesis'),sb=src('new','Build Save Body');
 ok(bs.includes("const __CG=C4P.all({cr1,gr1,cr2,gr2,cr3,dr3,cr4,dr4});")&&bs.includes('close_graded:__CG')&&bs.includes("C4P.noteL(__CG.D,'D')")&&bs.includes("C4P.noteL(__CG.C,'C')"),'Build Synthesis computes it once from every round, prints it to the synthesis and outputs close_graded');
 ok(pb.includes("C4P.noteP(F,'D',__CGS('D'))")&&bi.includes("C4P.noteP(d,'C',__CGS('C'))")&&pb.includes("$('Build Synthesis').first().json.close_graded")&&pb.includes("C4P.stored($('Regrade Row').first().json.review_notes,sd)"),'the judges are sent the stored result (Build Synthesis; on a regrade, the saved row)');
 ok(fm.includes("C4P.noteP(__FR,'D',__CGF('D'))")&&fm.includes('C4P.stored(r.review_notes,sd)'),'the transcript prints the stored result from the saved row');
 ok(sb.includes('FF.push(C4P.storeLine(CG[sd]||[],sd))')&&!/C4P\.press\(d,/.test(sb),'Build Save Body stores the result once (no recomputation)');
 ok(!/C4P\.press\(/.test(src('new','D4 Extract').split('const C4P=(()=>')[0]+src('new','D4 Extract').split(' return {refs,fresh,of')[1])&&!/graded=C4P\.press/.test(src('new','C4 Extract')),'D4 Extract and C4 Extract no longer compute it');
 // the same text in both places: Panel Build's note from the stored list equals Format Markdown's
 const noteJ=N.noteP(F06,'C',all.C),noteT=N.noteP({cr1:F06.cr1,dr3:F06.dr3,dr4:F06.dr4},'C',N.stored(line,'C'));ok(noteJ===noteT,'judges and transcript print the same note even from different round sets (32306 printed 34 against 37)',(noteJ.match(/holds (\d+)/)||[])[1]);}

console.log('== R4: the transcript prints the corrected lines (R3, printing the single judge, withdrawn by ruling 402)');
const seat06=(s0,raw)=>{const pl=s0==='single';const r=R8.run('32306');raw=raw||(pl?r.independent_verdict_raw:r.judgments.find(j=>j.seat===s0).verdict_raw);return R8.seat('new','32306',r,s0,raw,!pl,R8.replyOf('32306',r,s0,raw,!pl),false);};
// GLM: under ruling 400 the new check no longer raises K-LB on premise 6, so its cure is rerun here on the items live cfcbb37b raised (K-C x4,
// K-LB premises 3 and 6, read from the base checker) with its stored cure reply, as Panel Cure Check runs it.
const glm=(()=>{const r=R8.run('32306');const raw=r.judgments.find(j=>j.seat==='glm').verdict_raw;const raw0=R8.firstRaw(raw,true);const J=RL.judgment(raw0,true);const f={...J.fields,defense_standing:'SELF-SUPPORTED',conceded_links:0};
 const CB=L.chk('base','Panel Payloads');const pt=prompt('32306');const it=CB.drvCheck(J.text,0,0,'SELF-SUPPORTED','SELF-SUPPORTED',false,CB.drvLinks(pt)).items.filter(x=>x.rule==='K-C').concat(CB.drvBlocks(J.text,pt,0,0,'SELF-SUPPORTED','SELF-SUPPORTED',null,null).items.map(x=>({...x,L:6})));
 const reply={ok:true,text:R8.ELOG['32306'].find(x=>x.seat==='glm'&&x.kind==='cure').full_reply};const p={seat:'glm',verdict_tag:'HELD',defense_standing:f.defense_standing,conceded_links:f.conceded_links,challenge_standing:f.challenge_standing,challenger_conceded_links:f.challenger_conceded_links,verdict_raw:raw0};
 const vs=CC.cureVerdicts(it,reply,CC.cureBroken(J.text),RL.rounds(r));p.verdict_raw+='\n'+CC.cureReport('glm',vs).join('\n');const cs=CC.cureSet(reply,vs);if(cs)p.verdict_raw+='\n'+CC.cureSetApply(p,cs,'glm').join('\n');
 const F0={verdict_tag:p.verdict_tag,defense_standing:p.defense_standing,conceded_links:p.conceded_links,challenge_standing:p.challenge_standing,challenger_conceded_links:p.challenger_conceded_links};
 const rc=CC.cureRecompute('glm',CC.cureJText(p.verdict_raw,true),F0,it,vs,reply);if(rc){p.verdict_raw=CC.cureRewrite(p.verdict_raw,true,rc,'glm',F0);Object.assign(p,rc.fields);}return p;})();
// the single judge: the replay's checks do not reproduce its three K-G4 items (live cfcbb37b raised them), so its cure is rerun on them as stored
const sj=(()=>{const r=R8.run('32306');const st=RL.judgment(r.independent_verdict_raw,false).reports; /* the stored text was rewritten by the live cure; its first lines are taken back from the report LINE fields (cut at 300 characters) */
 let raw0=R8.firstRaw(r.independent_verdict_raw,false);for(const x of st.filter(y=>y.rule==='K-G4')){const li=String(r.independent_verdict_raw.split('\n').find(l=>l.includes('ITEM: '+x.item+'; RULE: K-G4'))||'').match(/; LINE: (.*?); STATEMENT: /);if(li)raw0=raw0.split('\n').map(l=>l.startsWith(x.item+' ')?RL.unbr(li[1]):l).join('\n');}const txt=raw0;const its=['D1 vs C1','D2 vs C1','D6 vs C1'].map(l=>({rule:'K-G4',side:'CHALLENGER',link:l,line:txt.split('\n').find(z=>z.startsWith(l))}));
 const rep={ok:true,text:R8.ELOG['32306'].find(x=>x.id===120).full_reply};const v=CC.cureVerdicts(its,rep,CC.cureBroken(txt),RL.rounds(r06));const F0={verdict_tag:'HELD',defense_standing:'PROP-DEPENDENT',conceded_links:1,challenge_standing:'PROP-DEPENDENT',challenger_conceded_links:1};
 const rc=CC.cureRecompute(null,CC.cureJText(raw0,false),F0,its,v,rep);const out=rc?CC.cureRewrite(raw0,false,{...rc,audit:''},null,null).replace(/\n$/,''):raw0;return {verdict_raw:out+'\n\n'+CC.cureReport(null,v).join('\n'),v,rc};})();
{const J=RL.judgment(glm.verdict_raw.split('\n[AUDIT')[0],true);
 ok(/DEFENSE STANDING: PROP-DEPENDENT -- L=6 c=1/.test(J.text)&&/^CONCEDED LINKS: 1 --/m.test(J.text),'GLM after its cure: the standing and count lines in its text read PROP-DEPENDENT, 1 (32306 printed SELF-SUPPORTED c=0)');
 const sup=[...glm.verdict_raw.matchAll(/\[AUDIT v27: SUPERSEDED LINE -- SEAT: glm; LABEL: ([^;]*);/g)].map(m=>m[1]);
 ok(['DEFENSE STANDING','CONCEDED LINKS','D1 VS C5','D3 VS C2','D5 VS C6','D6 VS C2'].every(l=>sup.includes(l)),'GLM: each replaced line keeps its original on a SUPERSEDED LINE (the standing, the count and the four restated collision lines)',sup.join(', '));
 ok(J.text.split('\n').some(l=>/^D5 vs C6 \(Jeremiah 22:30\): UNDERDETERMINED -- GROUND: both chains weighed on their footing/.test(l)),'GLM: the restated D5 vs C6 line stands in its text in place of the original');
 ok(glm.defense_standing==='PROP-DEPENDENT'&&glm.conceded_links===1,'GLM: the fields are unchanged by the rewrite (PROP-DEPENDENT, 1)');
 const st6=(glm.verdict_raw.split('\n').find(l=>/ITEM: DEFENDER premise 6; RULE: K-LB; RESULT: CURED;/.test(l))||'').replace(/^.*?STATEMENT: /,'');
 ok(/CORRECTED COUNT: DEFENDER 1/.test(st6)&&/RESPONSE: I accept the mark: \(CR3\) LINK 5/.test(st6),'the violation table row for premise 6 carries its own RESPONSE beside the count it shares',st6.slice(0,120));
 const s1=sj.verdict_raw;ok(/\[AUDIT v27: SUPERSEDED LINE -- LABEL: D1 VS C1; ORIGINAL: D1 vs C1 \(Matthew 1:25\): CHALLENGER LINK BROKEN/.test(s1),'the single judge: its retracted D1 vs C1 line is written in place, the original kept as SUPERSEDED');}
// Format Markdown run on the stored 32306 row with GLM's and the single judge's replayed (new) text
const fmRun=(row,J)=>RN.runNode('new','Format Markdown',{'Get Row':row,'Get Judgments':J,'Get Verse':{text:'For precept must be upon precept'},'Get Guards':[{rule_num:18,subject:'Son of God'}],'Init Seats':{run_token:'T',single_judge:'deepseek'},'Quote Report':{unavailable:true,items:[]}})[0].json.md;
{const r=R8.run('32306');const J=r.judgments.map(j=>j.seat==='glm'?{...j,verdict_raw:glm.verdict_raw}:j);
 const sjv=sj.verdict_raw;const sjT=sjv.split('\n[AUDIT')[0].replace(/\n+$/,'');const sjL=sjv.split('\n').filter(l=>/^\[AUDIT v2[57]: /.test(l)).join('\n');const st=r.independent_verdict_raw;
 const row={...r,defender_engine:'claude',challenger_engine:'claude',topic:'Did Christ have a biological father?',independent_verdict_raw:sjT+st.slice(st.indexOf('\n\n[AUDIT'))+'\n'+sjL,review_notes:r.review_notes}; /* the stored flags and reports, with the replayed rewrite (text, AUDIT v25/v27 lines) */
 const md=fmRun(row,J);
 ok(!md.includes('## Single judge')&&!md.includes('Its flags')&&!md.includes('Its cures'),'R3 withdrawn (ruling 402): the single judge is not printed in the debate document');
 const g=md.slice(md.indexOf('Panel judge',md.indexOf('## Panel judge')),md.indexOf('*Debate complete.*'));const gl=g.slice(g.indexOf(': GLM'));
 ok(/DEFENSE STANDING: PROP-DEPENDENT -- L=6 c=1 -- recomputed after the cure[^\n]*\*\(corrected by the cure\)\*/.test(gl)&&/> \*Superseded by the cure \(the judge's line before it\):\* DEFENSE STANDING: SELF-SUPPORTED -- L=6 c=0/.test(gl),'R4: GLM prints the corrected standing in place, the original below it marked superseded');
 ok(/> \*Superseded by the cure \(the judge's line before it\):\* D5 vs C6 \(Jeremiah 22:30\): UNDERDETERMINED -- every witness answered/.test(gl),'R4: the restated D5 vs C6 line prints with its original below it');
 ok(/\| Panel judge GLM \| DEFENDER premise 6 \|[^\n]*RESPONSE: I accept the mark/.test(md),'R4: the violation table attaches GLM\'s premise 6 RESPONSE to that item');
 // R2 in the transcript: the stored line is what prints
 const N=c4p('new');const all=N.all(F06);const row2={...row,review_notes:r.review_notes+' '+N.storeLine(all.D,'D')+' '+N.storeLine(all.C,'C')};const md2=fmRun(row2,J);
 const k=(md2.match(/\[DR4\] holds (\d+) sentence/)||[])[1];ok(+k===all.C.length,'R2: the transcript prints the stored count for the challenger close ('+all.C.length+'), not a recount');
 fs.writeFileSync(D+'test/transcript_32306_R.md',md);console.log('     (the rebuilt transcript: test/transcript_32306_R.md)');}

console.log('== R5: K-LB reads footing, not tags (as amended by ruling 400: L3 is supporting verse(s) for L1)');
{const blk=j=>{let s=F06.cr3;const c=s.search(/CHALLENGER.{0,2}S\s+UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/i);s=s.slice(0,c);const H=[...s.matchAll(/^[ \t>*#_-]*LINK\s+(\d+)[^\n]*/gmi)];return s.slice(H[j-1].index,j<H.length?H[j].index:s.length);};
 ok(C.lbFoot(blk(3)).join()==='L1,L2,L3'&&C.drvLayersByTag(blk(3)).join()==='L2','premise 3 ([CR3] LINK 4): L1 Luke 3:23 "as was supposed" (untagged), L2 enomizeto and hes, L3 Matthew 1:16 "of whom was born Jesus" quoted after it; the tags alone gave L2',C.lbFoot(blk(3)).join());
 ok(C.lbFoot(blk(6)).join()==='L1,L3'&&C.drvLayersByTag(blk(6)).join()==='L1','premise 6 ([CR3] LINK 5): L1 Jeremiah 22:30, then Matthew 1:12 and Luke 1:32 quoted after it: L3 (ruling 400), though all three are tagged [L1]',C.lbFoot(blk(6)).join());
 for(const s0 of ['gemini','glm']){const J=judg('32306',s0);const o=C.drvBlocks(J.text,prompt('32306'),0,0,'SELF-SUPPORTED','SELF-SUPPORTED',null,null); /* the seat's first counts (GLM's stored fields carry its cure) */
  ok(!o.items.some(x=>x.side==='DEFENDER'&&(x.premise===3||x.premise===6)),'32306 '+s0+': neither premise 3 nor premise 6 fires',o.items.map(x=>x.link).join(', ')||'none');}
 // the cure tests the block's own words: a block read as one layer is not cured by a statement that relabels a verse (synthetic block, two verses of one chapter)
 const it=[{rule:'K-LB',side:'DEFENDER',link:'DEFENDER premise 1',premise:1,line:'x',kinds:['L1'],conc:0,st:'SELF-SUPPORTED',L:6}];
 ok(C.lbFoot('Footing:\n- [L1] Matthew 1:11: "And Josias begat Jechonias about the time they were carried away."\n- [L1] Matthew 1:12: "Jechonias begat Salathiel."').join()==='L1,L3','synthetic: Matthew 1:12 quoted after Matthew 1:11 is L3, the same chapter included (ruling 400, as the coordinator corrected it)');
 const R1={...RL.rounds(r06),CR3:'**LINK 1: SUPPORTED**\n\nFooting:\n- [L1] Matthew 1:11: "And Josias begat Jechonias about the time they were carried away."\n- [L3] Matthew 1:12 names Salathiel.\n\nChain: the line runs through Jechonias.\n'};
 ok(C.lbFoot(R1.CR3).join()==='L1','synthetic block: one quoted verse and an unquoted [L3] reference are one layer');
 const syn='RESPONSE: '+CC.cureLabel(it[0])+' | The mark is wrong in my reading, and the statement below exhibits the layers.\nSTATEMENT: '+CC.cureLabel(it[0])+' | [CR3] LINK 1 shows [L1] "And Josias begat Jechonias" (Matthew 1:11) and [L3] Matthew 1:12 "Jechonias begat Salathiel" as cross-reference.';
 const v=CC.cureVerdicts(it,{ok:true,text:syn},{DEFENDER:[],CHALLENGER:[]},R1)[0];ok(v.status==='UNCURED'&&/FOOTING LAYERS/.test(v.why),'a statement that quotes Matthew 1:12 for the block, which only names it, does not cure (the block, read by FOOTING LAYERS, shows L1 only)',String(v.why).slice(0,140));
 ok(CC.cureVerdicts(it,{ok:true,text:'RESPONSE: '+CC.cureLabel(it[0])+' | I accept the mark: the block shows two verses of one chapter at one layer, so premise 1 is counted.\nCORRECTED COUNT: DEFENDER 1\nCORRECTED STANDING: DEFENDER PROP-DEPENDENT'},{DEFENDER:[],CHALLENGER:[]},R1)[0].status==='CURED','counting the premise cures it');
 const FD=s=>(s.match(/FOOTING LAYERS \(judge_fix8; the definition the system link-round check uses; md_notes_rulings 400: L3 is supporting verse\(s\) for L1\): [^]*?does not change what the block shows\./)||[''])[0];const d0=FD(src('new','Panel Build'));
 ok(d0.length>200&&FD(src('new','Build Independent Verdict'))===d0&&CURE.every(nm=>FD(src('new',nm))===d0)&&!/cross-reference to the first/.test(d0),'the same FOOTING LAYERS words (ruling 400) stand in Panel Build, Build Independent Verdict and the 14 cure prompts');
 ok(CHECK.every(nm=>src('new',nm).includes('const lbKinds=block=>lbFoot(block);')),'the 3 checkers read the block by lbFoot');
 const bl=t=>C.lbFoot(t);ok(bl('[L1] Luke 1:32: "the throne of his father David." [L1] Matthew 1:12: "Jechonias begat Salathiel."').join()==='L1,L3'&&bl('"though Coniah were the signet" (Jeremiah 22:24) and "will make thee as a signet" (Haggai 2:23)').join()==='L1,L3'&&bl('Luke 3:23 "as was supposed" with [L2] enomizeto (was reckoned).').join()==='L1,L2'&&bl('[L3] Hosea 11:1 "called my son out of Egypt".').join()==='L1'&&bl('Matthew 2:15 is the cross-reference.').join()==='','synthetic: a second quoted verse from another place is L3 tagged or not; a lone quoted verse is L1 whatever its tag; an unquoted reference makes no layer');}

console.log('== R6: K-S2, GLM\'s forms of the single-verse ground, sent to the cure');
{const J=judg('32306','glm');const o=C.drvCheck(J.text,J.fields.conceded_links,J.fields.challenger_conceded_links,J.fields.defense_standing,J.fields.challenge_standing,false,C.drvLinks(prompt('32306')));
 const kc=o.items.filter(x=>x.rule==='K-C').map(x=>x.link),k2=o.items.filter(x=>x.rule==='K-S2').map(x=>x.link);
 const want=['REASONING','D1 vs C1','D2 vs C1','D3 vs C3','D3 vs C4','D4 vs C2','D6 vs C1'];
 ok(want.every(l=>k2.includes(l))&&k2.length===7,'32306 GLM: K-S2 catches the reasoning line, D1 vs C1, D6 vs C1 (marked only before), D2 vs C1, D3 vs C3, D3 vs C4 and D4 vs C2',k2.join(', '));
 ok(['D1 vs C5','D3 vs C2','D5 vs C6','D6 vs C2'].every(l=>kc.includes(l)),'32306 GLM: the four K-C lines stay K-C (11 lines caught in all)',kc.join(', '));
 ok(!o.marks.some(m=>/AUDIT v22: DEBATE RULE VIOLATION \(K-S2\)/.test(m))&&o.marks.filter(m=>/AUDIT v27: DEBATE RULE VIOLATION \(K-S2\)/.test(m)).length===7,'the old v22 K-S2 marks give way to 7 K-S2 items with their marks');
 ok(C.ENF_STATUS['K-S2']==='TRIAL'&&CC.enfUncured([{rule:'K-S2',status:'UNCURED'}])===0,'K-S2 is TRIAL: it removes no seat');
 const x=o.items.find(y=>y.rule==='K-S2'&&y.link==='D4 vs C2');const cv=t=>CC.cureVerdicts([x],{ok:true,text:'RESPONSE: '+CC.cureLabel(x)+' | I accept the mark and answer it in the line below, in my own words.\n'+t},{DEFENDER:[],CHALLENGER:[]},RL.rounds(r06))[0];
 ok(cv('RESTATED: D4 vs C2 (Luke 3:23): UNDERDETERMINED -- GROUND: both chains weighed on their footing: [L1] "of whom was born Jesus" (Matthew 1:16) with [L2] enomizeto (was supposed), and [L3] Luke 2:48 read with Luke 3:23; footed chain against footed chain.').status==='CURED','K-S2 cure: a RESTATED line on the chains\' footing cures');
 ok(cv('RESTATED: D4 vs C2 (Luke 3:23): UNDERDETERMINED -- GROUND: [L1] "of whom was born Jesus" (Matthew 1:16) with [L2] enomizeto (was supposed); no witness\'s own words state that Joseph begat the child.').status==='UNCURED','K-S2 cure: a RESTATED line that keeps "no witness\'s own words state" is refused');
 for(const [nn,s0] of [['32284','chatgpt'],['32284','gemini'],['32284','glm'],['32302','gemini'],['32302','glm'],['32302','chatgpt']]){const Jx=judg(nn,s0);const ox=C.drvCheck(Jx.text,Jx.fields.conceded_links,Jx.fields.challenger_conceded_links,Jx.fields.defense_standing,Jx.fields.challenge_standing,false,C.drvLinks(prompt(nn)));
  console.log('     '+nn+' '+s0+': K-S2 '+(ox.items.filter(y=>y.rule==='K-S2').map(y=>y.link).join(', ')||'none'));}}

console.log('== R7: the universal test (pre-check) and K-V');
{const s=src('new','Panel Build');const a=s.indexOf('function preCheckSide(');const pcs=new Function(s.slice(a,s.indexOf('\nfunction preCheckBlock(',a))+';return preCheckSide;')();
 const L1=pcs(F06.cr3,[F06.gr1,F06.gr2],'DEFENDER LIST [CR3]');console.log('     '+L1.map(l=>l.replace(/^.*?(item \d+).*\|\| (UNIVERSAL TEST: .*)$/,'$1: $2')).join('\n     '));
 ok(/item 2: .*UNIVERSAL TEST: the charge adds [^|]*ONLY/.test(L1[1])&&/item 4: .*UNIVERSAL TEST: the charge adds [^|]*NEVER/.test(L1[3])&&/item 6: .*UNIVERSAL TEST: the charge adds [^|]*REVERSED/.test(L1[5]),'32306 the defender\'s list: the test lists ONLY (premise 2), NEVER (premise 4), REVERSED (premise 6)');
 ok(src('new','Panel Build').includes('UNIVERSAL TEST (computed by the system, judge_fix8)')&&src('new','Build Independent Verdict').includes('UNIVERSAL TEST (computed by the system, judge_fix8)'),'both judge prompts give the test with the pre-check, and the VOID rule asks a ruling to name the word');
 const U=C.kvUni(C.ciRounds(prompt('32306')),'CHALLENGER');ok(U[1].words.includes('only')&&U[3].words.includes('never')&&U[5].words.includes('reversed'),'the checker computes the same test (K-V)',JSON.stringify(U.map(u=>u.words)));
 const seg=(t)=>C.drvPressWith('RESULT: DEFENDER WINS\nCHALLENGER CONCEDED LINKS: 0 -- '+t,prompt('32306'),0,0,'SELF-SUPPORTED','SELF-SUPPORTED',null).items.filter(x=>x.rule==='K-V');
 ok(seg('premise 2 is VOID: the charge adds "only", which its quote lacks.').length===0,'K-V: a VOID ruling that names the word the test lists ("only") passes');
 ok(seg('premise 2 is VOID: the charge goes beyond its quote.').length===1,'K-V: a VOID ruling that names no word and quotes no claim is marked');
 for(const nm of ['C2 Build','D3 Build'])ok(src('new',nm).includes('is a whole claim sentence of the')&&src('new',nm).includes('never a fragment of one'),nm+': each listed premise quotes a whole claim sentence, not a fragment');}

console.log('== R8: the defender placeholder');
for(const nm of ['D1 Build','D2 Build'])ok(!src('new',nm).includes('Goes to review')&&src('new',nm).includes('no stock phrase stands in for an answer'),nm+': DD-2 no longer prescribes the placeholder');
const ext=(nm,text,round)=>RN.runNode('new',nm,{'Init Seats':{run_token:'T'},[round+' Build']:{call:{fam:'openrouter',model:'m/x'}},'Init with Guards':{lab:{D:'DEFENDER',C:'CHALLENGER'}},'D1 Extract':{raw:F06.cr1},'C1 Extract':{raw:F06.gr1},'D2 Extract':{raw:F06.cr2},'C2 Extract':{raw:F06.gr2},'D3 Extract':{raw:F06.cr3},'C3 Extract':{raw:F06.dr3},'D4 Extract':{raw:F06.cr4}},{choices:[{message:{content:text},finish_reason:'stop'}],usage:{}})[0].json;
const strip=t=>String(t).replace(/^[^\n]* -- ROUND \d[^\n]*\n\n/,'');
{const o=ext('D2 Extract',strip(F06.cr2),'D2');ok(o.round_fix.placeholder===3&&!/Goes to review/.test(o.raw)&&/placeholder removed by the system/.test(o.raw),'D2 Extract on 32306: the placeholder is stripped 3 times',o.round_fix.placeholder);
 const s=src('new','Build Save Body');ok(s.includes('DEFENDER PLACEHOLDER STRIPPED')&&src('new','Build Synthesis').includes('is a defect of method, not discipline'),'Build Save Body writes a review line; the synthesis is told it is a defect, not method');}

console.log('== R9: the challenger close and a contradicting round heading');
ok(src('new','C4 Build').includes('Write NO premise list in this round')&&src('new','C4 Build').includes('NO charge or grade against any defender link'),'C4 Build: no premise list and no charge against defender links in round 4');
{const o=ext('C2 Extract',strip(F06.gr2),'C2');ok(o.round_fix.heading&&/Round 3 \(close\)/.test(o.round_fix.heading)&&/^# Challenger, Round 2: the oath runs/.test(o.raw),'C2 Extract on 32306: "# Challenger, Round 3 (close): ..." becomes "# Challenger, Round 2: ..."',o.raw.split('\n')[0].slice(0,70));
 const o2=ext('D2 Extract',strip(F06.cr2),'D2');ok(!o2.round_fix.heading,'D2 Extract on 32306: its correct heading ("Defender, Round 2") is left alone');}

console.log('== R10: S-E reads the claim\'s words in the close rounds');
{const s=src('new','Build Save Body');const a=s.indexOf("{const SY=String(d.synthesis||'');");const b=s.indexOf('// judge_fix3 B2: the challenger',a);
 const runSE=(v,syn)=>{const t=src(v,'Build Save Body');const a2=t.indexOf("{const SY=String(d.synthesis||'');");const b2=t.indexOf('// judge_fix3 B2: the challenger',a2);
  const f=new Function('d','C4P','__CGB','const FF=[];'+t.slice(a2,b2)+';return FF;');return f({cr1:F06.cr1,gr1:F06.gr1,cr2:F06.cr2,gr2:F06.gr2,cr3:F06.cr3,dr3:F06.dr3,cr4:F06.cr4,dr4:F06.dr4,synthesis:syn},{of:()=>[]},()=>({D:[],C:[]})).filter(x=>/S-E/.test(x));};
 const SYN='### Challenger\'s links\n\n- **C3 (Galatians 4:4 says what Job 14:1 and Matthew 11:11 say) — CITED-WITH-FOOTING, and conceded by the defender** in the words quoted under D3 above.';
 ok(runSE('base',SYN).length===1,'base: the 32306 S-E flag on C3 reproduces');ok(runSE('new',SYN).length===0,'new: the defender\'s close holds Galatians 4:4, Job 14:1 and Matthew 11:11 together; no S-E flag');
 ok(runSE('new','The challenger withdrew Psalms 2:7 and Hebrews 5:5 from the case.').length===1,'new: a claim whose references stand together in no round of that side is still flagged');}

console.log('== R11: K-LXX');
{const L=C.lxxScan(C.ciRounds(prompt('32306')));ok(L.some(x=>x.round==='CR1'&&x.ref==='Exodus 40:35'),'the scan finds the defender\'s round 1 Greek Old Testament footing at Exodus 40:35');
 const o=s0=>{const J=judg('32306',s0);return C.drvPressWith(J.text,prompt('32306'),J.fields.conceded_links,J.fields.challenger_conceded_links,J.fields.defense_standing,J.fields.challenge_standing,null).items.filter(x=>x.rule==='K-LXX');};
 ok(o('gemini').length===1,'Gemini ("No citation errors or Septuagint references occurred") is marked');ok(o('glm').length===0&&o('chatgpt').length===0,'GLM and ChatGPT, who named it, are not');
 const x=o('gemini')[0];const cv=t=>CC.cureVerdicts([x],{ok:true,text:'RESPONSE: '+CC.cureLabel(x)+' | I accept the mark and answer it in the line below, in my own words.\n'+t},{DEFENDER:[],CHALLENGER:[]},RL.rounds(r06))[0].status;
 ok(cv('STATEMENT: '+CC.cureLabel(x)+' | [CR1] rests overshadow on the Septuagint: "In the Greek Old Testament it is used of the cloud over the tabernacle".')==='CURED','K-LXX cure: a STATEMENT naming it and quoting [CR1] cures');
 ok(cv('STATEMENT: '+CC.cureLabel(x)+' | there was a Septuagint reading.')==='UNCURED','K-LXX cure: naming it without the round quoted does not');
 ok(C.ENF_STATUS['K-LXX']==='TRIAL'&&src('new','Panel Build').includes('SEPTUAGINT SCAN'),'K-LXX is TRIAL; the scan is served with the pre-check');}

console.log('== R12: the verse sheet serves the three occasions of Psalm 2:7 together');
{const s=src('new','C2 Build');const r=s.indexOf('const REFP=(()=>');const S=new Function(s.slice(r,s.indexOf(RE_END,r)+RE_END.length)+s.slice(s.indexOf('const SHEET=(()=>'),s.indexOf('return {req,url,plan,text,CAP_V,CAP_C};})();')+45)+';return SHEET;')();
 const k=t=>S.req([t]).map(x=>x.key);
 ok(['Acts 13:33','Hebrews 1:5','Hebrews 5:5'].every(z=>k('Psalm 2:7 "Thou art my Son"').includes(z))&&k('Psalm 2:7 "Thou art my Son"').includes('Psalms 2:7'),'a sheet that serves Psalm 2:7 serves Acts 13:33, Hebrews 1:5 and Hebrews 5:5',k('Psalm 2:7').join(', '));
 ok(['Hebrews 1:5','Hebrews 5:5'].every(z=>k('Acts 13:33 "this day have I begotten thee"').includes(z)),'a sheet that serves Acts 13:33 serves Hebrews 1:5 and Hebrews 5:5');
 ok(k('Luke 1:35').length===1,'a sheet without them is unchanged');
 const all=['C1 Build','C1 Extract','C2 Build','C2 Extract','C3 Build','C3 Extract','C4 Build','D1 Build','D2 Build','D2 Extract','D3 Build','D3 Extract','D4 Build','D4 Extract','Init with Guards'];
 const md=nm=>{const t=src('new',nm);const a=t.indexOf('const SHEET=(()=>');return require('crypto').createHash('md5').update(t.slice(a,t.indexOf('})();',a))).digest('hex');};ok(new Set(all.map(md)).size===1,'the 15 copies of the sheet are identical');
 const sh=k(F06.gr1+'\n'+F06.dr3);console.log('     32306 challenger rounds 1 and 3: the sheet now carries '+['Acts 13:33','Hebrews 1:5','Hebrews 5:5'].filter(z=>sh.includes(z)).join(', '));}

console.log('== R13: at most 8 pressed verses per listed premise (md_notes_rulings 393)');
{const P=C.pwList(RL.rounds(r06),'DEFENDER');const p2=P[1];
 ok(p2.keys.size===8&&p2.over.length===12,'32306 challenger premise 2 (its [DR2] list, 20 distinct verses): 8 witnesses kept under PRESSED WITH, 12 over the cap',p2.keys.size+' kept, '+p2.over.length+' over: '+p2.over.slice(0,4).join(', ')+' ...');
 const s=src('new','Panel Build');const r=s.indexOf('const REFP=(()=>');const PWL=new Function(s.slice(r,s.indexOf(RE_END,r)+RE_END.length)+s.slice(s.indexOf('const PWL='),s.indexOf('\nconst LEDGER='))+';return PWL;')();
 const t=PWL.judgeBlock(F06);const ln=t.split('\n');const i=ln.findIndex(l=>/^AGAINST THE DEFENDER/.test(l));const l2=ln.slice(i).find(l=>/^premise 2\b/.test(l));
 ok(/8 verse\(s\) carried under PRESSED WITH; .*over the cap of 8 pressed verses \(md_notes_rulings 393\), not witnesses: .*; NOT NAMED: /.test(l2),'the judges\' ledger lists 8 witnesses for premise 2 and names the rest as over the cap, before NOT NAMED',l2.slice(0,160));
 ok(s.includes('A PRESS HAS A CAP (md_notes_rulings 393)')&&src('new','C2 Build').includes('(operator ruling 393)')&&src('new','D3 Build').includes('(operator ruling 393)'),'the rulebook and both debaters\' list instructions state the cap');
 ok(src('new','Build Save Body').includes('PRESSED-WITH CAP (md_notes_rulings 393)')&&src('new','D4 Build').includes('judge_fix8 R13'),'Build Save Body lists them in a review line; D4 Build\'s still-unanswered list reads only the first 8');}

console.log('\n'+n+' fixtures, '+bad+' bad');process.exitCode=bad?1:0;
