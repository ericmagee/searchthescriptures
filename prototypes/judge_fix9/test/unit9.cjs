// judge_fix9 unit fixtures, one block per item (S1-S6), each with cases that pass and cases that fail; and the normal-run checks.
// Run: node test/unit9.cjs   (base = live cb4b94e0, new = fix set 9, add = the nodes fix set 9 adds)
const fs=require('fs');const RN=require('./runner.cjs');const RL=require('./replay_lib.cjs');const L=require('./lib8.cjs');const R9=require('./replay9.cjs');
const D=__dirname+'/../';const src=(v,n)=>fs.readFileSync(D+v+'/'+n+'.js','utf8');
let bad=0,n=0;const ok=(c,what,extra)=>{n++;if(!c)bad++;console.log((c?'ok  ':'BAD ')+what+(extra!==undefined?' -- '+String(extra).slice(0,300):''));};
const NEWF=fs.readdirSync(D+'new').filter(f=>f.endsWith('.js'));const C=L.chk('new','Panel Payloads'),CB=L.chk('base','Panel Payloads');const CC=L.lib('new','Panel Cure Check');
const OW=JSON.parse(fs.readFileSync(D+'data/ow_l2.json'));const LEX=JSON.parse(fs.readFileSync(D+'data/lex_l2.json'));
const PRS=C.PRS,L2C=C.L2C;
// a stored run with every press of its two lists rewritten in the PRESS FORM, proven by an [L3] in place (the format the rulings ask for)
const proveText=t=>String(t||'').split('\n').map(l=>{const i=l.search(/PRESSED WITH\s*:/i);if(i<0)return l;const head=l.slice(0,i)+'PRESSED WITH: ';const body=l.slice(i).replace(/^PRESSED WITH\s*:\s*/i,'');
 if(/^none\b/i.test(body))return l;return head+body.split(/;\s+(?=(?:[1-3]\s)?[A-Z][a-z]+\s\d)/).map(e=>e.trim().replace(/\.$/,'')+' -- MEANS: this verse is read against the quoted claim as the premise states. -- [L3] Matthew 1:2 "Abraham begat Isaac"').join('; ');}).join('\n');
const proved=r=>({...r,engine_r2:proveText(r.engine_r2),engine_r3:proveText(r.engine_r3)});
const rounds=r=>RL.rounds(r);
const its=(v,r,seat)=>{const j=r.judgments.find(x=>x.seat===seat||x.judge_seat===seat);const J=RL.judgment(R9.firstRaw(j.verdict_raw,true),true);return R9.items(v,r,seat,J,true);};

console.log('== S1: the judges\' rulebook -- sentence (B) removed everywhere, ruling 396 in its place, the FORCED line, K-F');
{const B1='A witness contradicts a link only when its own words state the contrary',B2='A pressed witness contradicts a link only when its own words state the contrary';
 const hit=NEWF.filter(f=>{const s=fs.readFileSync(D+'new/'+f,'utf8');return s.includes(B1)||s.includes(B2);});ok(!hit.length,'no changed node carries sentence (B), in either form',hit.join(', ')||'none');
 const bl=fs.readdirSync(D+'base').filter(f=>{const s=fs.readFileSync(D+'base/'+f,'utf8');return (s.includes(B1)||s.includes(B2))&&!NEWF.includes(f);});ok(!bl.length,'every live node that carried sentence (B) is changed',bl.join(', ')||'all changed');
 for(const nm of ['Panel Build','Build Independent Verdict']){const s=src('new',nm);ok(s.includes('FORCED LINK (md_notes_rulings 396')&&s.includes('FORCED: D<i> vs C<j> -- MEANS [<round>]')&&s.includes('"+__R396+" "+__RPROVEN+"'),nm+': ruling 396 and the FORCED line form stand where sentence (B) stood');}
 const post=['Accept Build','Accept Check','Accept Final','Accept Return Build','Alternate Build','Alternate Cure Build','Panel Build','Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Reserve Build'].filter(nm=>!src('new',nm).includes('### Commitment 3. No link is forced.'));ok(!post.length,'posture Commitment 3 replaced by ruling 396 in the 11 nodes that carry it',post.join(', ')||'11 of 11');
 const cure=['Alternate Build','Alternate Cure Build','Alternate Cure Normalize','Alternate Merge','Cure Build','Cure Check','Cure Normalize','Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Panel Cure Check','Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3'];
 ok(cure.every(nm=>CC.CURE_RULE_G!=null&&L.lib('new',nm).CURE_RULE_G.includes('FORCED LINK (md_notes_rulings 396)')&&L.lib('new',nm).CURE_RULE_G.includes('K-F (a FORCED line')),'the cure prompt of all 14 cure nodes carries ruling 396 and the K-F, K-P, K-R, K-L2 items');}
{const r=RL.run('32306');const R=rounds(r);
 const means='Matthew 1:20 "that which is conceived in her is of the Holy Ghost"';const ans=String(R.CR3).match(/"[^"\n]{20,80}"/)[0].slice(1,-1);const fails=ans.split(' ').slice(0,4).join(' ');
 const mq=String(R.DR2).match(/"([^"\n]{12,60})"/)[1];
 const good='D2 vs C1 (Luke 1:35): DEFENDER LINK BROKEN -- the link cannot take the witness -- GROUND: forced (ruling 396).\nFORCED: D2 vs C1 -- MEANS [DR2]: "'+mq+'" -- ANSWER [CR3]: "'+ans+'" -- FAILS: "'+fails+'"';
 ok(C.kfLines(good,R).items.length===0,'K-F: a FORCED line whose three quotations stand in [DR2] and [CR3] passes');
 const k1=C.kfLines(good.replace(mq,'the child had a father by the flesh of Joseph'),R);ok(k1.items.length===1&&/MEANS quotation is not in \[DR2\]/.test(k1.items[0].why),'K-F: a MEANS quotation the round does not hold is marked',k1.items[0]&&k1.items[0].why);
 const k2=C.kfLines('D2 vs C1 (Luke 1:35): DEFENDER LINK BROKEN -- x -- GROUND: the link is forced; it cannot take the witness.',R);ok(k2.items.length===1&&k2.items[0].why==='no FORCED line','K-F: a forced-link grade with no FORCED line is marked');
 const k3=C.kfLines('FORCED: D2 vs C1 -- the meaning fails',R);ok(k3.items.length===1&&k3.items[0].why==='malformed','K-F: a malformed FORCED line is marked');
 ok(C.kfLines('D2 vs C1 (Luke 1:35): DEFENDER LINK BROKEN -- x -- GROUND: [DR2] pressed Luke 1:35 and [CR3] left it unanswered.',R).items.length===0,'K-F: a BROKEN line on an unanswered witness is not a forced-link line');
 const x=k2.items[0];const cv=t=>CC.cureVerdicts([x],{ok:true,text:'RESPONSE: '+CC.cureLabel(x)+' | I give the three quotations.\n'+t},null,R)[0];
 ok(cv(good.split('\n')[1]).status==='CURED','K-F cure: one FORCED line whose quotations stand cures');
 ok(cv(good.split('\n')[1].replace(mq,'words no round holds anywhere at all')).status==='UNCURED','K-F cure: a FORCED line with a quotation the round does not hold does not cure');
 ok(cv('RETRACTED: D2 vs C1 -- regraded UNDERDETERMINED -- [CR3] answers Luke 1:35 with "'+fails+'".\nCORRECTED RESULT: HELD-1').status==='CURED','K-F cure: RETRACTED with one CORRECTED RESULT cures');}

console.log('== S2: the debaters -- every critical point carries its layers; the Oracle seat; the PRESS FORM; counts name their unit');
{const s=src('new','Init with Guards');ok(/__ORACLE9\+' '\+/.test(s)&&s.includes('Prove every position with the layers. A statement of your position is not proof of it.'),'Init with Guards: the Oracle seat is told to prove every position with the layers');
 ok((s.match(/'\\n\\n'\+__PROVE9/g)||[]).length===2,'Init with Guards: the PROVEN STRUCTURE text goes to both seat profiles (Oracle and plain)');
 for(const nm of ['D1 Build','C1 Build','D2 Build','C2 Build','D3 Build','C3 Build','D4 Build','C4 Build'])ok(src('new',nm).includes('const __X9=[__PROVE9'),nm+': the PROVEN STRUCTURE text is appended to the round\'s last user message');
 for(const nm of ['C2 Build','D3 Build'])ok(src('new',nm).includes("each in the PRESS FORM below; write PRESSED WITH: none if you pressed none. '+__PWFORM9+'")&&src('new',nm).includes('-- MEANS: <one sentence'),nm+': the list asks every press in the fixed PRESS FORM');
 const T=require('child_process').execSync('python3 -c "import sys;sys.path.insert(0,\''+D+'\');import texts;print(texts.PROVE)"').toString();ok(/verses or tokens/.test(T)&&/charge sentence of a premise list/.test(T)&&/exempt/.test(T),'the text: counts name their unit (verses or tokens); the charge sentence is exempt');}
{const r=RL.run('32306');const map={'Init Seats':{run_token:'T',dpos:'the affirmative',cpos:'the negative'},'Init with Guards':{dsys:'SYS',csys:'SYS',topic:'TOPIC',lab:{D:'DEFENDER',C:'CHALLENGER'}},'Resolve Seats':{defender:{fam:'openrouter',model:'m/d',tok:1000},challenger:{fam:'openrouter',model:'m/c',tok:1000}},
  'D1 Extract':{raw:r.claude_r1},'C1 Extract':{raw:r.engine_r1},'D2 Extract':{raw:r.claude_r2},'C2 Extract':{raw:r.engine_r2},'D3 Extract':{raw:r.engine_r3},'C3 Extract':{raw:r.challenger_r3}};
 const lastUser=o=>{const b=o.requestBody||o.body||o.call&&o.call.body||o;const m=(b.messages||[]).filter(x=>x.role==='user');return m.length?String(m[m.length-1].content):JSON.stringify(o).slice(0,0);};
 const P=RN.runNode('new','C3 Extract',{'Init Seats':{run_token:'T'},'C3 Build':{call:{fam:'openrouter',model:'m/x'}},'Init with Guards':{lab:{D:'DEFENDER',C:'CHALLENGER'}},'D1 Extract':{raw:r.claude_r1},'C1 Extract':{raw:r.engine_r1},'D2 Extract':{raw:r.claude_r2},'C2 Extract':{raw:r.engine_r2},'D3 Extract':{raw:r.engine_r3}},{choices:[{message:{content:r.challenger_r3},finish_reason:'stop'}],usage:{}})[0].json;
 ok(Array.isArray(P.l2_urls)&&P.l2_req.length===85&&P.l2_urls.length===Math.ceil(85/20)&&P.l2_urls.every(u=>/original_words\?select=book,chapter,verse,word_position,strongs_number,transliteration,original_script,morph&order=/.test(u)&&u.length<7000),'C3 Extract (32306): the [L2] read plan covers every cited verse (85), pressed first, in batches of 20, no cap',P.l2_req.length+' verses in '+P.l2_urls.length+' requests; first '+P.l2_req.slice(0,3).join(', '));
 const WP=RN.runNode('add','D4 Words Plan',{'C3 Extract':P}).map(x=>x.json.url);ok(WP.length===P.l2_urls.length&&WP.every((u,i)=>u===P.l2_urls[i]),'D4 Words Plan: one item (one request) per batch',WP.length+' items');
 const owR=OW.filter(x=>P.l2_req.includes(x.book+' '+x.chapter+':'+x.verse));ok(new Set(owR.map(x=>x.book+' '+x.chapter+':'+x.verse)).size===85,'the rows of all 85 verses read (data/ow_l2.json)');
 const LPu=RN.runNode('add','D4 Lexicon Plan',{'D4 Words Sheet':owR}).map(x=>x.json.url);const nums=LPu.flatMap(u=>u.match(/in\.\(([^)]*)\)/)[1].split(','));
 ok(LPu.every(u=>/anchor_gloss/.test(u))&&!nums.includes('G3588')&&!nums.includes('G2532')&&!nums.includes('G1722')&&nums.includes('G1080')&&nums.includes('G4690'),'D4 Lexicon Plan: the Strong\'s numbers read, function words left out (G3588 the, G2532 and, G1722 in), gloss read',nums.length+' numbers in '+LPu.length+' requests');
 const LEXr=LEX.filter(x=>nums.includes(x.strongs_number));
 let o;try{o=RN.runNode('new','D4 Build',{...map,'C3 Extract':{...map['C3 Extract'],...P},'D4 Words Sheet':owR,'D4 Lexicon Sheet':LEXr})[0].json;}catch(e){o={err:e.message};}
 const s=JSON.stringify(o);ok(!o.err&&s.includes('PROVEN STRUCTURE (md_notes_rulings 397 to 400')&&s.includes('[L2] SHEET -- read by the system'),'D4 Build (32306): runs; its request carries the PROVEN STRUCTURE text and the [L2] SHEET',o.err||(s.match(/\[L2\] SHEET[^\\]{0,80}/)||[''])[0]);
 ok(/\[source: MetaV Strongs\.csv/.test(s)&&/G4396 \S+ \S+: from a compound of/.test(s)&&s.includes('a foreteller'),'D4 Build: the [L2] sheet quotes the lexicon gloss whole (with its source tag)',(s.match(/function words \(articles[^.]*\) are left out/)||[''])[0]+' '+(s.match(/G1080[^\\]{0,140}/)||[''])[0]);
 ok(!/verses read with no rows|not read \(over/.test(s)&&!/\\nG3588 /.test(s)&&!/\\nG2532 /.test(s),'D4 Build: every one of the 85 verses read; no function word on the sheet',((s.match(/LEFT OFF THE \[L2\] SHEET:[^"]{0,160}/)||['nothing left off'])[0]));
 let o2;try{o2=RN.runNode('new','D4 Build',{...map})[0].json;}catch(e){o2={err:e.message};}ok(!o2.err&&!JSON.stringify(o2).includes('[L2] SHEET'),'D4 Build without the sheet reads (a normal run with no new input shape): runs, no [L2] sheet',o2.err||'ok');
 const b=RN.runNode('base','D4 Build',{...map})[0].json;ok(JSON.stringify(b).length<JSON.stringify(o2).length,'D4 Build: base runs on the same input (the new request differs by the appended texts)');}

{const IS={run_token:'T',topic:'T',dpos:'the affirmative',cpos:'the negative',defender:{engine:'claude',profile:'plain'},challenger:{engine:'opus',profile:'oracle'}};const m={'Init Seats':IS,'Resolve Seats':{gt:'',tt:''},'Retrieve Held Conclusions':[]};
 const b=RN.runNode('data/live_code','Init with Guards',m)[0].json,w=RN.runNode('new','Init with Guards',m)[0].json;
 ok(w.csys.includes(' Prove every position with the layers. A statement of your position is not proof of it. ')&&!w.dsys.includes('Prove every position')&&!b.csys.includes('Prove every position'),'Init with Guards runs: the Oracle seat (here the challenger) carries the line; the plain seat does not');
 ok(w.dsys.includes('PROVEN STRUCTURE (md_notes_rulings 397 to 400')&&w.csys.includes('PROVEN STRUCTURE (md_notes_rulings 397 to 400')&&w.csys.length-b.csys.length===w.dsys.length-b.dsys.length+' Prove every position with the layers. A statement of your position is not proof of it.'.length,'Init with Guards: both seats get the PROVEN STRUCTURE text, nothing else changes');}
console.log('== S3: the press parse, the ledger, ruling 372 counting (K-G1, K-G4, K-G6, K-G10, K-G11, D4), REFERENCE and K-R');
{const R=rounds(RL.run('32306'));
 const e=(seg,pr)=>PRS.premise(seg,R,pr||'DR2').verses.map(v=>v.cls);
 ok(e('PRESSED WITH: Romans 1:3 "made of the seed of David according to the flesh" -- MEANS: the flesh of the Son is of David\'s seed. -- [L2] sperma (seed)')[0]==='PROVEN','parse: MEANS with an [L2] word (meaning) in place is PROVEN');
 ok(e('PRESSED WITH: Romans 1:3 "made of the seed of David" -- MEANS: the flesh of the Son is of David\'s seed. -- [L3] Acts 2:30 "of the fruit of his loins"')[0]==='PROVEN','parse: MEANS with an [L3] verse "quote" in place is PROVEN');
 ok(e('PRESSED WITH: Romans 1:3 "made of the seed of David"')[0]==='UNPROVEN','parse: reference and quotation alone ([L1] only, the stored format) is UNPROVEN');
 ok(e('PRESSED WITH: Romans 1:3 "made of the seed of David" -- MEANS: the flesh of the Son is of David\'s seed.')[0]==='UNPROVEN','parse: MEANS with no second layer is UNPROVEN');
 ok(e('PRESSED WITH: Romans 1:3 "made of the seed of David" -- MEANS: the flesh of the Son is of David\'s seed. -- [L3] Romans 1:3 "made of the seed"')[0]==='UNPROVEN','parse: an [L3] that is the same verse is no second layer');
 ok(e('PRESSED WITH: Romans 1:3 "made of the seed of David" -- MEANS: the flesh of the Son is of David\'s seed. -- [L2] sperma')[0]==='UNPROVEN','parse: an [L2] without its meaning is not in the form');
 // proof by reference: [CR2] of 32306 quotes Romans 1:3 in a block with Greek and other verses
 const byr=e('PRESSED WITH: Romans 1:3 "made of the seed of David according to the flesh" -- MEANS: the flesh of the Son is of David\'s seed. -- PROVEN IN [CR2]','CR3');
 ok(byr[0]==='PROVEN BY REFERENCE','proof by reference: [CR2] quotes Romans 1:3 with its reference in a block of two layer kinds',PRS.premise('PRESSED WITH: Romans 1:3 "x y z w" -- MEANS: the flesh of the Son is of David\'s seed. -- PROVEN IN [CR2]',R,'CR3').verses[0].why);
 const late=PRS.premise('PRESSED WITH: Romans 1:3 "made of the seed of David" -- MEANS: the flesh of the Son is of David\'s seed. -- PROVEN IN [DR3]',R,'DR2').verses[0];ok(late.cls==='UNPROVEN'&&/after the press/.test(late.why),'proof by reference: a round after the press does not prove it',late.why);
 const none=PRS.premise('PRESSED WITH: Ezra 2:62 "therefore were they, as polluted" -- MEANS: the register decides the priesthood here. -- PROVEN IN [CR1]',R,'DR2').verses[0];ok(none.cls==='UNPROVEN'&&/not named there|not quoted|fewer than two/.test(none.why),'proof by reference: a round that does not quote the verse in a block of two kinds does not prove it',none.why);
 const Rx={...R,CR2:'## A\n\nRomans 1:3 is a verse I only name here.'};const nq=PRS.premise('PRESSED WITH: Romans 1:3 "made of the seed of David" -- MEANS: the flesh of the Son is of David\'s seed. -- PROVEN IN [CR2]',Rx,'CR3').verses[0];ok(nq.cls==='UNPROVEN'&&/not quoted/.test(nq.why),'proof by reference: a verse named but not quoted there does not prove it',nq.why);
 const P=PRS.premise('PRESSED WITH: '+Array.from({length:10},(x,i)=>'Matthew 1:'+(i+1)+' "w w w w" -- MEANS: the line runs through the fathers here. -- [L3] Luke 3:23 "being (as was supposed)"').join('; '),R,'DR2');ok(P.verses.length===8&&P.over.length===2,'parse: the cap of 8 pressed verses per premise (ruling 393) holds',P.over.join(', '));}
{const r=RL.run('32302'),rp=proved(r);const W=s=>RN; // ledgers
 const RE_END='\n return {parse,keys,book,BK,BOOKS};})();';const PWL=v=>{const s=src(v,'Panel Build');const a=s.indexOf('const REFP=(()=>');const e9=s.indexOf('// ======== end judge_fix9 libraries ========');return new Function((e9<0?'':s.slice(0,e9))+'\n'+s.slice(a,s.indexOf(RE_END,a)+RE_END.length)+s.slice(s.indexOf('const PWL='),s.indexOf('\nconst LEDGER='))+';return PWL;')();};
 const F=x=>({cr1:x.claude_r1,gr1:x.engine_r1,cr2:x.claude_r2,gr2:x.engine_r2,cr3:x.engine_r3,dr3:x.challenger_r3,cr4:x.defender_r4||null});
 const nn=t=>t.split('\n').filter(l=>/^premise \d+/.test(l)).map(l=>(l.match(/NOT NAMED: (.*)$/)||[])[1]).filter(x=>x&&x!=='none');
 const b=PWL('base').judgeBlock(F(r)),w=PWL('new').judgeBlock(F(r)),wp=PWL('new').judgeBlock(F(rp)),bp=PWL('base').judgeBlock(F(rp));
 ok(nn(b).length>0&&nn(w).length===0&&/UNPROVEN, not a witness \(ruling 398\)/.test(w),'ledger (32302, stored format): base lists NOT NAMED verses; new lists none, every press shown UNPROVEN, not a witness',nn(b).join(' | '));
 ok(JSON.stringify(nn(wp))===JSON.stringify(nn(bp))&&nn(wp).length>0&&/(\d+) PROVEN, 0 PROVEN BY REFERENCE/.test(wp),'ledger (32302 rewritten in the PRESS FORM): new counts the proven presses and lists the same NOT NAMED verses as base',nn(wp).join(' | '));
 ok(/^premise \d+(?: \(LINK (\d+)\))?: .*NOT NAMED: (.+)$/m.test(wp),'ledger lines keep the form K-G6 reads (premise n (LINK m): ... NOT NAMED: ...)');}
{const r=RL.run('32302'),rp=proved(r);
 const gb=its('base',r,'gemini').map(x=>x.rule+' '+x.link),gn=its('new',r,'gemini').map(x=>x.rule+' '+x.link),gp=its('new',rp,'gemini').map(x=>x.rule+' '+x.link);
 ok(gn.includes('K-P CHALLENGER premise 2')&&gn.includes('K-P CHALLENGER premise 4')&&!gb.some(x=>/K-P/.test(x)),'K-P (32302 Gemini): challenger premises 2 and 4 counted UNEXHIBITED on presses the ledger marks UNPROVEN',gn.filter(x=>/K-P/.test(x)).join(', '));
 ok(!gp.some(x=>/K-P|K-G10/.test(x)),'K-P (the same seat, the presses rewritten in the PRESS FORM): no K-P and no K-G10 -- the count rests on proven presses');
 const lb=its('base',r,'glm').map(x=>x.rule+' '+x.link),ln=its('new',r,'glm').map(x=>x.rule+' '+x.link),lp=its('new',rp,'glm').map(x=>x.rule+' '+x.link);
 ok(lb.includes('K-G4 D6 vs C4')&&!ln.includes('K-G4 D6 vs C4')&&ln.includes('K-P D6 vs C4'),'K-G4 (32302 GLM, D6 vs C4 rests on Luke 3:31 and on unproven presses): not raised; K-P raised instead');
 ok(lp.includes('K-G4 D6 vs C4')&&!lp.includes('K-P D6 vs C4'),'K-G4 (the presses rewritten in the PRESS FORM): raised again as in base; no K-P');}
{const r=RL.run('32302');const x=its('new',r,'gemini').filter(y=>y.rule==='K-P');const R=rounds(r);
 const cv=(t,X)=>CC.cureVerdicts(X||x,{ok:true,text:x.map(y=>'RESPONSE: '+CC.cureLabel(y)+' | I accept the mark.').join('\n')+'\n'+t},{DEFENDER:[],CHALLENGER:[]},R);
 const c=Math.max(0,(x[0].conc||0)-2);ok(cv('CORRECTED COUNT: CHALLENGER '+c+'\nCORRECTED STANDING: CHALLENGER '+(c===0?'SELF-SUPPORTED':(x[0].L&&2*c>x[0].L?'COLLAPSED':'PROP-DEPENDENT'))).every(y=>y.status==='CURED'),'K-P cure (count): CORRECTED COUNT without the two premises and its standing cures',x[0].conc+' -> '+c);
 ok(cv('CORRECTED COUNT: CHALLENGER '+x[0].conc+'\nCORRECTED STANDING: CHALLENGER COLLAPSED').every(y=>y.status==='UNCURED'),'K-P cure (count): the same count does not cure');
 ok(cv('STATEMENT: '+CC.cureLabel(x[0])+' | [DR2] premise 2 carries it: "Matthew 1:20 Joseph, thou son of David".').some(y=>y.status==='UNCURED'),'K-P cure (count): a STATEMENT quoting the PRESSED WITH line does not cure (an unproven press stays unproven)');
 const y=its('new',r,'glm').find(z=>z.rule==='K-P');const cy=t=>CC.cureVerdicts([y],{ok:true,text:'RESPONSE: '+CC.cureLabel(y)+' | I accept the mark.\n'+t},{DEFENDER:[],CHALLENGER:['D6 vs C4']},R)[0];
 ok(cy('RETRACTED: D6 vs C4 -- regraded UNDERDETERMINED -- [DR3] names Luke 3:31 and the presses are unproven.\nCORRECTED RESULT: HELD-1').status==='CURED','K-P cure (BROKEN line): RETRACTED with one CORRECTED RESULT cures');
 ok(cy('').status==='UNCURED','K-P cure (BROKEN line): no RETRACTED or RESTATED line does not cure');}
{const r=RL.run('32302');const map=(v,x)=>({'Init Seats':{run_token:'T',dpos:'the affirmative'},'Init with Guards':{dsys:'SYS',topic:'TOPIC'},'Resolve Seats':{defender:{fam:'openrouter',model:'m/d',tok:1000},challenger:{fam:'openrouter',model:'m/c',tok:1000}},
  'D1 Extract':{raw:x.claude_r1},'C1 Extract':{raw:x.engine_r1},'D2 Extract':{raw:'(no answer)'},'C2 Extract':{raw:x.engine_r2},'D3 Extract':{raw:'(no answer)'},'C3 Extract':{raw:x.challenger_r3}});
 const b=RN.runNode('base','D4 Build',map('base',r))[0].json.open_list,w=RN.runNode('new','D4 Build',map('new',r))[0].json.open_list,p=RN.runNode('new','D4 Build',map('new',proved(r)))[0].json.open_list;
 const A=t=>(t.split('\n(b)')[0].match(/^premise \d+.*NOT NAMED: .*$/gm)||[]);
 ok(A(b).length>0&&A(w).length===0&&/\(b\) UNPROVEN PRESSES, not witnesses/.test(w),'D4 Build (32302, defender rounds 2-3 blanked): base lists every pressed verse still unanswered; new lists no unproven press there and names them apart',A(b).length+' -> '+A(w).length);
 ok(JSON.stringify(A(p))===JSON.stringify(A(b)),'D4 Build (presses rewritten in the PRESS FORM): the still-pressed list equals base');}
{const r=RL.run('32306');const R=rounds(r);const seg='PRESSED WITH: Romans 1:3 "made of the seed of David according to the flesh" -- MEANS: the flesh of the Son is of David\'s seed. -- PROVEN IN [CR2]';
 const R2={...R,DR2:String(R.DR2).replace(/(\n1\. LINK 6:[^\n]*?)PRESSED WITH:[^\n]*/,(m,a)=>a+seg)};const PL=C.pwList(R2,'DEFENDER');const v=PL[0].cls[0];ok(v.cls==='PROVEN BY REFERENCE','K-R fixture: a [DR2] premise whose press is proven by reference to [CR2]',v.why);
 const blk=String(R.CR2);const mm=blk.match(/"([^"\n]{10,60})"/)[1];
 const ref='REFERENCE: Romans 1:3 -- [CR2] -- CONFIRMED -- "'+mm+'" / "the flesh of the Son is of David\'s seed."';
 ok(C.krLines('D1 vs C1 (x): UNDERDETERMINED -- GROUND: x.',R2).items.length===1,'K-R: a referenced press with no REFERENCE line is marked');
 ok(C.krLines(ref,R2).items.length===0,'K-R: a REFERENCE line whose quotations stand passes');
 ok(C.krLines(ref.replace(mm,'a meaning no round of the debate exhibits'),R2).items.length===1,'K-R: a REFERENCE line whose first quotation the round does not hold is marked');
 ok(C.krLines(ref.replace('[CR2]','[CR1]'),R2).items.length===1,'K-R: a REFERENCE line naming another round is marked');
 const x=C.krLines('',R2).items[0];const cv=t=>CC.cureVerdicts([x],{ok:true,text:'RESPONSE: '+CC.cureLabel(x)+' | I confirm it.\n'+t},null,R2)[0];
 ok(cv(ref).status==='CURED','K-R cure: one REFERENCE line whose quotations stand cures');ok(cv(ref.replace(mm,'nothing the round holds at all here')).status==='UNCURED','K-R cure: a REFERENCE line with a bad quotation does not cure');
 const PB=src('new','Panel Build');ok(PB.includes('REFERENCE: <the press')&&PB.includes('NOT CONFIRMED'),'the judges\' rulebook states the REFERENCE line form');}

console.log('== S4: the [L2] sheet (debaters only), the [L2] check, the count check, K-L2');
{const blk=(v,txt)=>[['DEFENDER','CR1',txt]];const chk=t=>L2C.check(L2C.tags(blk(0,t)),OW,LEX)[0];
 ok(chk('[L1] Matthew 1:20: "that which is conceived in her is of the Holy Ghost."\n- [L2] *gennaō* (to beget) is the verb.').status==='COUNTED','[L2] check: a dictionary form (gennaō) of a word in the cited verse is COUNTED (dictionary route)');
 ok(chk('[L1] Matthew 1:20: "that which is conceived in her".\n- [L2] γεννηθὲν (begotten).').status==='COUNTED','[L2] check: the inflected Greek form in the verse is COUNTED (second route)');
 ok(chk('[L1] Isaiah 7:14: "Behold, a virgin shall conceive".\n- [L2] The Hebrew is *ha-almah* (the young woman).').status==='COUNTED','[L2] check: a Hebrew word with its prefix (ha-almah) is COUNTED (prefix stripped; H5959)');
 ok(chk('[L1] Isaiah 7:14: "Behold, a virgin shall conceive".\n- [L2] The verse is a sign to Ahaz.').status==='IGNORED','[L2] check: a tag that names no Hebrew or Greek word is IGNORED (no [L2] claim)');
 ok(chk('[L1] Isaiah 7:14: "Behold, a virgin shall conceive".\n- [L2] H5959 (a lass).').status==='COUNTED','[L2] check: a Strong\'s number written directly is matched by itself');
 const nc=chk('[L1] Genesis 4:1: "Adam knew Eve his wife".\n- [L2] *gennaō* (to beget).');ok(nc.status==='NOT COUNTED'&&/not in the cited verse/.test(nc.why),'[L2] check: a word in no verse the block cites is NOT COUNTED ("not in the cited verse")',nc.why);
 const ap=chk('[L1] Sirach 25:24: "Of the woman came the beginning of sin".\n- [L2] *gynē* (woman).');ok(ap.status==='UNVERIFIABLE'&&/Apocrypha/.test(ap.why),'[L2] check: an [L2] on an Apocrypha verse is UNVERIFIABLE',ap.why);
 const nr=L2C.check(L2C.tags(blk(0,'[L1] Luke 1:34: "seeing I know not a man".\n- [L2] *ginōskō* (to know).')),OW,LEX,['Matthew 1:1'])[0];ok(nr.status==='UNVERIFIABLE'&&/not read/.test(nr.why),'[L2] check: a verse whose words were not read is UNVERIFIABLE',nr.why);
 const cl=t=>L2C.countCheck(L2C.countClaims([['CHALLENGER','DR1',t]]),JSON.parse(fs.readFileSync(D+'data/counts_l2.json')),false,[])[0];
 ok(cl('[L2] *ha-almah* (H5959) stands in 7 verses.').status==='MATCHES THE RECORD','count check: "H5959 ... 7 verses" matches the record (7 verses, 7 tokens)');
 ok(cl('[L2] *ha-almah* (H5959) stands in 9 verses.').status==='DIFFERS FROM THE RECORD (7 verses, 7 tokens)','count check: "9 verses" is marked DIFFERS FROM THE RECORD (7 verses, 7 tokens)');
 ok(/unit not named/.test(cl('[L2] *ha-almah* (H5959), 7 rows.').status),'count check: a count with no unit (rows) is checked against both and says the unit was not named');}
{const sh=L2C.sheet(OW.filter(x=>x.book==='Isaiah'&&x.chapter===7&&x.verse===14),LEX,{l2_read:['Isaiah 7:14'],l2_off:[]});ok(sh.includes('H5959 עַלְמָה almah: feminine of')&&sh.includes('[source: MetaV Strongs.csv'),'[L2] sheet: one row per Strong\'s number, dictionary form and the lexicon gloss quoted whole',sh.split('\n')[1]);
 const all=OW.map(x=>x.book+' '+x.chapter+':'+x.verse);const big=L2C.sheet(OW,LEX,{l2_req:[...new Set(all)]});ok(/numbers over the sheet cap of 26000 characters/.test(big),'[L2] sheet (all 138 verses): capped at 26,000 characters, every number left off listed',(big.length)+' characters');}
{const r=RL.run('32306');const F=R9.F_(r);const FO={topic:'T',synthesis:'The synthesis. Hebrews 7:14 reads "For it is evident that our Lord sprang out of Juda" and the debate turned on it. The defender wins.',...F};
 const CS=RN.runNode('new','Citation Scan',{'Final Output':FO,'Init Seats':{run_token:'T'}})[0].json;
 ok(CS.l2_tags.length===56&&CS.l2_urls.length===Math.ceil(CS.l2_read.length/20)&&CS.l2_urls.every(u=>/original_words/.test(u)),'Citation Scan (32306): the 56 [L2] tags and a read of every verse their blocks cite, in batches',CS.l2_read.length+' verses in '+CS.l2_urls.length+' requests');
 ok(RN.runNode('add','L2 Words Plan',{'Citation Scan':CS}).length===CS.l2_urls.length,'L2 Words Plan: one item per batch');
 {const u=RN.runNode('add','L2 Lexicon Plan',{'L2 Words':OW.slice(0,300)}).map(x=>x.json.url);ok(u.every(x=>!/anchor_gloss/.test(x))&&u.join().includes('G3588'),'L2 Lexicon Plan (the judges\' path): no gloss read; every number, function words included (the check reads them)');}
 const owR=OW.filter(x=>CS.l2_read.includes(x.book+' '+x.chapter+':'+x.verse));
 const CP=RN.runNode('add','L2 Count Plan',{'Citation Scan':CS,'L2 Words':owR,'L2 Lexicon':LEX.map(x=>({strongs_number:x.strongs_number,original_script:x.original_script,transliteration:x.transliteration}))})[0].json;
 const c=CP.tags.filter(t=>t.status==='COUNTED').length;ok(CP.tags.length===56&&c>=50,'L2 Count Plan (32306): the check, run as the node runs it',c+' COUNTED of '+CP.tags.length);
 const kjv=JSON.parse(fs.readFileSync(D+'data/kjv_32293.json')).concat(JSON.parse(fs.readFileSync(D+'data/kjv_32302.json')));
 const QC=RN.runNode('data/live_code','Quote Compare',{'Citation Scan':CS,'Cited Verses':kjv});
 const QR=RN.runNode('new','Quote Report',{'Quote Compare':QC[0].json,'Find Words':[],'Citation Scan':CS,'L2 Count Plan':CP,'L2 Counts':[]})[0].json;
 ok(QR.l2&&QR.l2.tags.length===56&&QR.l2_data&&QR.l2_data.ow.length===owR.length,'Quote Report: carries the [L2] check and the rows read (for K-L2)');
 ok(QR.synthesis&&QR.synthesis.checked>=1&&QR.items.every(i=>i.side!=='SYNTHESIS'),'S5 Quote Report: the synthesis\'s quotations are checked and reported apart; the judges\' items hold the debaters\' only',JSON.stringify(QR.synthesis.bad));
 ok(QR.synthesis.verdict_phrases.length===1&&/defender wins/i.test(QR.synthesis.verdict_phrases[0]),'S5: the synthesis verdict scan finds "The defender wins"',QR.synthesis.verdict_phrases[0]);
 const QR0=RN.runNode('base','Quote Report',{'Quote Compare':QC[0].json,'Find Words':[]})[0].json;ok(JSON.stringify(QR0.items.filter(i=>i.side!=='SYNTHESIS'))===JSON.stringify(QR.items),'S5 Quote Report: the debaters\' items are those the live node reports');
 const QRn=RN.runNode('new','Quote Report',{'Quote Compare':QC[0].json,'Find Words':[]})[0].json;ok(!QRn.l2&&Array.isArray(QRn.items),'Quote Report with no [L2] nodes run (a normal run of the old shape): runs, no [L2] block');
 // the judges' copy: the [L2] check results, no gloss; K-L2
 const TOK='ODV1-32306-ccyhzcuy';const MC={gemini:'google/gemini-3.8-flash',glm:'z-ai/glm-5.3',chatgpt:'openai/gpt-6.1-terra',mimo:'xiaomi/mimo-v2.6-pro',sol:'openai/gpt-6.1-sol'};const sj=k=>({seat:k,fam:'openrouter',api_model:MC[k],max_tokens:64000});
 const IS={run_token:TOK,variant:'ORACLE_DEBATE_V1',topic:'T',defender:{engine:'claude',profile:'plain'},challenger:{engine:'opus',profile:'oracle'},panel_order:['gemini','glm','chatgpt'],panel_expected:['chatgpt','gemini','glm'],panel_reserve:'mimo',alt_order:['sol'],single_judge:'deepseek',regrade:true,dry:true,rulebook:'current'};
 const RS={run_token:TOK,judges:['gemini','glm','chatgpt'].map(sj),reserve:sj('mimo'),alternates:[{...sj('sol'),family:'openai'}],gt:'',tt:''};
 const pbm=q=>({'Init Seats':IS,'Resolve Seats':RS,'Regrade Load':{run_token:TOK,debate_id:r.id,f:F,synthesis:'(stored)',ig:{posline:'',d_served:[],c_served:[],d_named:[],c_named:[]}},'Quote Report':q,'Regrade Row':{...r,variant:'ORACLE_DEBATE_V1'}});
 const P=RN.runNode('new','Panel Build',pbm(QR))[0].json;const S=JSON.stringify(P);
 ok(S.includes('[L2] CHECK -- computed by the system, not by a model: '+CP.tags.filter(t=>t.status!=='IGNORED').length+' [L2] tags')&&!S.includes(': IGNORED')&&!S.includes('a lass (as veiled or private)')&&!S.includes('to procreate (properly, of the father'),'Panel Build: the judges get the [L2] check results, and no lexicon gloss');
 const P0=RN.runNode('new','Panel Build',pbm({unavailable:true}))[0].json;ok(JSON.stringify(P0).includes('[L2] CHECK: not available this run'),'Panel Build with no [L2] check (old-shape Quote Report): runs and says the check is not available');
 const PB0=RN.runNode('base','Panel Build',pbm({unavailable:true}))[0].json;ok(PB0.judges&&P0.judges&&PB0.judges.length===P0.judges.length,'Panel Build base and new both build the three judging calls',P0.judges.length);
 const k=C.kl2Lines('D1 vs C1 (Matthew 1:20): DEFENDER LINK BROKEN -- [L2] *anēr* (husband) -- GROUND: x.',QR.l2_data);ok(k.items.length===1,'K-L2: a judge\'s [L2] whose word is in no verse the line cites is marked',k.items[0]&&k.items[0].why);
 ok(C.kl2Lines('D1 vs C1 (Matthew 1:20): DEFENDER LINK BROKEN -- [L2] *gennaō* (beget) -- GROUND: x.',QR.l2_data).items.length===0,'K-L2: a judge\'s [L2] whose word stands in the cited verse passes');}

{const spec=JSON.parse(fs.readFileSync(D+'add/nodes_9.json'));const H=spec.nodes.filter(x=>x.type==='n8n-nodes-base.httpRequest');
 ok(H.filter(x=>x.name!=='L2 Counts').every(x=>!x.executeOnce&&x.parameters.url==='={{ $json.url }}')&&H.every(x=>x.alwaysOutputData&&x.onError==='continueRegularOutput'&&x.credentials&&x.credentials.httpHeaderAuth),'every added read runs once per plan item (one request per batch), always outputs, continues on error, with the Verse Sheet credential',H.length+' HTTP nodes');
 ok(RN.runNode('add','D2 Words Plan',{'C1 Extract':{}}).length===1&&/id=eq\.-1$/.test(RN.runNode('add','D2 Words Plan',{'C1 Extract':{}})[0].json.url),'D2 Words Plan with no plan (an Extract of the old shape): one read that returns nothing');
 ok(/in\.\(NONE\)$/.test(RN.runNode('add','D2 Lexicon Plan',{'D2 Words Sheet':[{}]})[0].json.url),'D2 Lexicon Plan with no word read: one read that returns nothing');
 ok(spec.nodes.length===30&&spec.remove_links.length===7&&spec.add_links.length===37,'30 nodes added; links: 7 removed (Verse Sheet -> Build x6, Find Words -> Quote Report), 37 added');}
console.log('== S5: the synthesis prompt');
{const s=src('new','Build Synthesis');ok(s.includes("Do NOT deliver a verdict.'+__SYNTH9")&&s.includes('QUOTE ONLY THE RECORD'),'Build Synthesis: quotes only the record, gives no verdict, is told its quotations are checked');
 const F=src('new','Format Markdown');ok(F.includes('## Citation check of the synthesis'),'Format Markdown prints the synthesis citation check');
 const B=src('new','Build Save Body');ok(B.includes('SYNTHESIS CITATION CHECK')&&B.includes('SYNTHESIS VERDICT')&&B.includes('for(const x of __L2RV)FF.push(x);'),'Build Save Body records the [L2] check, counts that differ, the synthesis check and its verdict scan in review_notes');}

console.log('== S6 and TRIAL status: every new rule is TRIAL in the 3 checkers and the 14 cure nodes');
{const ns=['Panel Payloads','Alternate Payloads','Extract Independent Verdict'];const ok1=ns.every(nm=>{const c=L.chk('new',nm);return ['K-P','K-F','K-R','K-L2'].every(k=>c.ENF_STATUS[k]==='TRIAL');});ok(ok1,'checkers: K-P, K-F, K-R, K-L2 are TRIAL (ENF_STATUS)');
 const cs=['Alternate Build','Alternate Cure Build','Alternate Cure Normalize','Alternate Merge','Cure Build','Cure Check','Cure Normalize','Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Panel Cure Check','Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3'];
 ok(cs.every(nm=>['K-P','K-F','K-R','K-L2'].every(k=>L.lib('new',nm).ENF_STATUS[k]==='TRIAL')),'cure nodes: K-P, K-F, K-R, K-L2 are TRIAL');
 ok(['K-P','K-F','K-R','K-L2'].every(k=>!C.enfLive({rule:k})),'enfLive: a new item never counts toward drv_uncured');}
console.log('== F1 (live run 32341, enforcer row 124): a RETRACTED line is a retraction unless it regrades the link LINK BROKEN');
{const E41=JSON.parse(fs.readFileSync(D+'data/enforcer_log_32341.json'));const E66=JSON.parse(fs.readFileSync(D+'data/enforcer_log_32266.json'));
 const g41=E41.find(e=>e.id===124).full_reply,g66=E66.find(e=>e.id===39).full_reply;
 const CURE14=['Alternate Build','Alternate Cure Build','Alternate Cure Normalize','Alternate Merge','Cure Build','Cure Check','Cure Normalize','Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Panel Cure Check','Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3'];
 const b41=L.lib('base','Panel Cure Check').cureLines(g41);ok(!b41.withdrawn.some(w=>w.link==='D3 vs C4')&&b41.malformed.some(l=>/^RETRACTED: D3 vs C4/.test(l)),'base (live cb4b94e0) reproduces the fault: GLM 32341\'s RETRACTED D3 vs C4 is refused as malformed');
 for(const nm of CURE14){const C=L.lib('new',nm);const o=C.cureLines(g41);ok(o.withdrawn.some(w=>w.link==='D3 vs C4')&&o.withdrawn.some(w=>w.link==='D5 vs C4')&&!o.malformed.some(l=>/^RETRACTED/.test(l)),nm+': GLM 32341 row 124: both RETRACTED lines read as retractions, none malformed',o.withdrawn.map(w=>w.link).join(', '));}
 const C=L.lib('new','Panel Cure Check');const o66=C.cureLines(g66);ok(o66.withdrawn.length===10&&o66.withdrawn.every(w=>w.regrade==='UNDERDETERMINED')&&!o66.malformed.some(l=>/^RETRACTED/.test(l)),'GLM 32266 (row 39): its ten RETRACTED lines read exactly as before (regraded UNDERDETERMINED)',o66.withdrawn.length);
 for(const t of ['RETRACTED: D2 vs C5 -- regraded CHALLENGER LINK BROKEN','RETRACTED: D3 vs C2 (Matthew 1:18): CHALLENGER LINK BROKEN -- the challenger left it unanswered','RETRACTED: D3 vs C2 -- DEFENDER LINK BROKEN -- [CR3] never answers it','RETRACTED: D3 vs C2 -- the line is now CHALLENGER LINK BROKEN on Luke 1:27','RETRACTED: D3 vs C2 -- graded as LINK BROKEN after all'])ok(C.cureLines(t).withdrawn.length===0,'a true regrade to LINK BROKEN stays refused: '+t.slice(0,70));
 ok(C.cureLines('RETRACTED: D3 vs C2 -- regraded UNDERDETERMINED -- the DEFENDER LINK BROKEN grade rested on a verse [CR3] answers').withdrawn.length===1,'a reason naming the retracted LINK BROKEN grade is allowed');
 ok(C.cureLines('RETRACTED: D3 vs C2 -- regraded UNDERDETERMINED, not LINK BROKEN').withdrawn.length===1,'"not LINK BROKEN" is allowed (as before)');
 const r41=R9.run('32341');const glm=R9.firstRaw(r41.drv_removed[0].verdict_raw,true);const J=RL.judgment(glm,true);const it=R9.items('new',r41,'glm',J,true);
 const v=L.lib('new','Panel Cure Check').cureVerdicts(it,{ok:true,text:g41},L.lib('new','Panel Cure Check').cureBroken(J.text),RL.rounds(r41));const vb=L.lib('base','Panel Cure Check').cureVerdicts(it,{ok:true,text:g41},L.lib('base','Panel Cure Check').cureBroken(J.text),RL.rounds(r41));
 ok(vb.find(x=>x.link==='D3 vs C4').status==='UNCURED'&&v.find(x=>x.link==='D3 vs C4').status==='CURED','GLM 32341 K-G4 D3 vs C4 with its stored cure reply: UNCURED on base (the seat drop), CURED on new',v.find(x=>x.link==='D3 vs C4').why);}
console.log('== a normal run (32306 dry regrade, the stored first replies): Panel Build, Panel Payloads and the three Panel Cure Builds run, base and new');
{const r=R9.run('32306');const F=R9.F_(r);const TOK='ODV1-32306-ccyhzcuy';const MC={gemini:'google/gemini-3.8-flash',glm:'z-ai/glm-5.3',chatgpt:'openai/gpt-6.1-terra',mimo:'xiaomi/mimo-v2.6-pro',sol:'openai/gpt-6.1-sol'};const sj=k=>({seat:k,fam:'openrouter',api_model:MC[k],max_tokens:64000});
 const IS={run_token:TOK,variant:'ORACLE_DEBATE_V1',topic:'T',defender:{engine:'claude',profile:'plain'},challenger:{engine:'opus',profile:'oracle'},panel_order:['gemini','glm','chatgpt'],panel_expected:['chatgpt','gemini','glm'],panel_reserve:'mimo',alt_order:['sol'],single_judge:'deepseek',regrade:true,dry:true,rulebook:'current',test_fail_seat:null,test_fail_reserve:false,test_no_fallback:false,qualify_alternate:null};
 const RS={run_token:TOK,judges:['gemini','glm','chatgpt'].map(sj),reserve:sj('mimo'),alternates:[{...sj('sol'),family:'openai'}],gt:'',tt:''};const RGL={run_token:TOK,debate_id:r.id,f:F,synthesis:'(stored)',ig:{posline:'',d_served:[],c_served:[],d_named:[],c_named:[]}};const ROW={...r,variant:'ORACLE_DEBATE_V1'};
 const chat=t=>({choices:[{message:{content:t},finish_reason:'stop'}],model:'x'});const RAW=['gemini','glm','chatgpt'].map(sn=>R9.firstRaw(r.judgments.find(j=>j.seat===sn).verdict_raw,true));
 const run=(v,nm,map)=>{try{return RN.runNode(v,nm,map);}catch(e){return {err:e.message};}};
 for(const v of ['base','new']){const P=run(v,'Panel Build',{'Init Seats':IS,'Resolve Seats':RS,'Regrade Load':RGL,'Quote Report':{unavailable:true},'Regrade Row':ROW});ok(!P.err,v+' Panel Build runs',P.err);if(P.err)continue;
  const PP=run(v,'Panel Payloads',{'Init Seats':IS,'Panel Build':P[0].json,'Panel Check':{run_token:TOK,sub:null},'Regrade Load':RGL,'Regrade Row':ROW,'Panel Judge 1 openrouter':chat(RAW[0]),'Panel Judge 2 openrouter':chat(RAW[1]),'Panel Judge 3 openrouter':chat(RAW[2])});
  ok(!PP.err&&PP[0].json.bodies.length===3,v+' Panel Payloads runs on the three stored replies',PP.err||PP[0].json.summary.map(x=>x.seat+':'+x.drv.map(y=>y.rule).join('/')).join(' '));if(PP.err)continue;
  for(const k of [1,2,3]){const c=run(v,'Panel Cure Build '+k,{'Panel Build':P[0].json,'Panel Payloads':PP[0].json});ok(!c.err,v+' Panel Cure Build '+k+' runs',c.err||((c[0].json.cure&&c[0].json.cure.items)||[]).length+' items');}}}
console.log('\n'+(n-bad)+' passed, '+bad+' bad of '+n);process.exitCode=bad?1:0;
