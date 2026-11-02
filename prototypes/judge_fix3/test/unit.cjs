// judge_fix3 unit fixtures, base (live e9f2a2dd) vs new, typed from the SQL reads of runs 32212, 32228, 32255 (debate_results, debate_judgments,
// debate_enforcer_log 1-35). Every fixture on a library function runs on every changed node that carries it.
const fs=require('fs');const D=__dirname+'/../';const RL=require('./replay_lib.cjs');const {fullLib,drvLib}=require('./lib.cjs');
let bad=0,n=0;const ok=(c,msg)=>{n++;if(!c)bad++;console.log((c?'OK  ':'BAD ')+msg);};
const NEW=fs.readdirSync(D+'new');const src=(v,f)=>fs.readFileSync(D+v+'/'+f,'utf8');const has=(f,s)=>src('new',f).includes(s);
const drvNodes=NEW.filter(f=>has(f,'function drvCheck(')),cureNodes=NEW.filter(f=>has(f,'function cureVerdicts('));
const every=(nodes,fn)=>nodes.filter(f=>!fn(f)).length===0;
const E={};JSON.parse(fs.readFileSync(D+'data/enforcer_log_32255.json','utf8')).forEach(e=>E[e.id]=e);
const line=(t,re)=>String(t).split('\n').map(l=>l.trim()).find(l=>re.test(l));
const J=(run,seat)=>{const r=RL.run(run);return seat==='single'?RL.judgment(r.independent_verdict_raw,false):RL.judgment(r.judgments.find(j=>j.seat===seat).verdict_raw,true);};
const marks=(lib,t)=>lib.drvCheck(t,null,null,null,null,false).items.map(x=>x.rule+' '+(x.link||x.side));
console.log('drvCheck carried by',drvNodes.length,'new nodes; cureVerdicts by',cureNodes.length);

// ---------------- A1 ----------------
{const L4=line(E[4].full_reply,/^RESTATED: D5 vs C2/).replace(/^RESTATED:\s*/,'');
 const b=drvLib(D+'base/Cure Check.js').drvKinds(L4);ok(b.join()==='L1','A1 base reads row 4 restated D5 vs C2 as '+b.join(',')+' (stored: "exhibits 1 layer kind")');
 ok(every(drvNodes,f=>drvLib(D+'new/'+f).drvKinds(L4).join()==='L1,L2'),'A1 new: row 4 restated D5 vs C2 reads L1,L2 ("[L2] sperma, seed", "[L2] genomenou (made, come to be)") on all '+drvNodes.length+' nodes');
 const q=line(E[29].full_reply,/^RESTATED: D1 vs C4/).replace(/^RESTATED:\s*/,'');const kq=drvLib(D+'new/Alternate Merge.js').drvKinds(q),kb=drvLib(D+'base/Alternate Merge.js').drvKinds(q);
 ok(!kb.includes('L2')&&kq.includes('L2'),'A1 Qwen [L2] tag after the word ("gar (for) and gennēthen (...) [L2]"): base '+kb.join(',')+' -> new '+kq.join(','));
 const neg=['D1 vs C1 (Matthew 1:18): DEFENDER LINK BROKEN -- [L1] "she was found with child" ; [L2] the lexical ground (none given)','D1 vs C1: DEFENDER LINK BROKEN -- [L1] "she was found with child"; [L2] word meaning (unclear)','D1 vs C1: DEFENDER LINK BROKEN -- [L1] "she was found with child"; no [L2] genomenou (made)'];
 ok(every(drvNodes,f=>neg.every(t=>drvLib(D+'new/'+f).drvKinds(t).join()==='L1')),'A1 an [L2] tag on English words or after "no" is still not counted (3 negatives)');
 ok(every(cureNodes,f=>{const L=fullLib(D+'new/'+f);return /in plain letters with its English meaning beside it/.test(L.CURE_RULE_G)&&/\[L2\] genomenou \(made\)/.test(L.CURE_RULE)&&/a round named without brackets is not read/.test(L.CURE_RULE_G);}),'A1 the cure prompt states the [L2] form (both rule blocks) and the bracket rule on all '+cureNodes.length+' cure nodes');
 ok(['Panel Build.js','Build Independent Verdict.js'].every(f=>/written in plain letters with its English meaning beside it/.test(src('new',f))),'A1 the judge rule (Panel Build, Build Independent Verdict) states the same [L2] form');
 // the K-C cure on row 4 itself
 const it={rule:'K-C',side:'CHALLENGER',link:'D5 vs C2',line:E[4].flagged_line};const R=RL.rounds(RL.run('32255'));
 const v=L=>L.cureVerdicts([it],{ok:true,text:E[4].full_reply},null,R)[0];const vb=v(fullLib(D+'base/Panel Cure Check.js')),vn=v(fullLib(D+'new/Panel Cure Check.js'));
 ok(vb.status==='UNCURED'&&vn.status==='CURED','A1 enforcer row 4 (K-C D5 vs C2, DeepSeek) on the stored reply: base '+vb.status+' ('+vb.why+') -> new '+vn.status);}

// ---------------- A2 ----------------
{const s=src('new','Init Seats.js');const pick=re=>s.match(re)[0];
 const code=[pick(/const ORDER=\[[^\]]*\];/),pick(/const JUDGE_TIME_REMOVED=\[[^\]]*\];/),pick(/const JFAM_I=\{[^}]*\};/)].join('\n');
 const pr=pick(/const panel_reserve=[^\n]*;/),ao=pick(/const ALT_ORDER=[^\n;]*;/);
 const run=new Function('D','C',code+'\nconst seated={};seated[D]=true;seated[C]=true;const free=ORDER.filter(s=>!seated[s]);const panel_order=free.slice(0,3);\n'+pr+'\n'+ao+'\nreturn {panel_order,panel_reserve,ALT_ORDER};');
 const sb=src('base','Init Seats.js');const runB=new Function('D','C',[sb.match(/const ORDER=\[[^\]]*\];/)[0],sb.match(/const JFAM_I=\{[^}]*\};/)[0]].join('\n')+'\nconst seated={};seated[D]=true;seated[C]=true;const free=ORDER.filter(s=>!seated[s]);const panel_order=free.slice(0,3);\n'+sb.match(/const panel_reserve=[^\n]*;/)[0]+'\n'+sb.match(/const ALT_ORDER=[^\n;]*;/)[0]+'\nreturn {panel_order,panel_reserve,ALT_ORDER};');
 const FAM={deepseek:'deepseek',gemini:'google',glm:'zhipu',chatgpt:'openai',mimo:'xiaomi',qwen:'qwen',grok:'xai',claude:'anthropic',sol:'openai'};
 const ENG=['claude','chatgpt','gemini','grok','mimo','glm','qwen','deepseek'];let rows=[],qwenLeft=0,panelSame=0,resQ=0,empty=0;
 for(const d of ENG)for(const c of ENG){if(d===c)continue;const a=runB(d,c),b=run(d,c);const deb=[FAM[d],FAM[c]];const pool=b.ALT_ORDER.filter(k=>deb.indexOf(FAM[k])<0);
  if(b.ALT_ORDER.includes('qwen')||b.panel_reserve==='qwen')qwenLeft++;if(a.panel_order.join()!==b.panel_order.join())panelSame++;if(a.panel_reserve==='qwen')resQ++;if(!pool.length)empty++;
  rows.push(d+' v '+c+': alt '+(a.ALT_ORDER.join(',')||'-')+' -> '+(pool.join(',')||'EMPTY')+(a.panel_reserve!==b.panel_reserve?' | reserve '+a.panel_reserve+' -> '+b.panel_reserve:''));}
 ok(qwenLeft===0&&panelSame===0,'A2 56 pairings: qwen in no alternate pool or reserve; the panel unchanged in every pairing');
 console.log('     base pool in every pairing: [qwen] or empty; new pool after the family guard (Resolve Seats): sol, EMPTY in '+empty+' pairings (ChatGPT or a family match debates); qwen was the reserve in '+resQ+' pairings, now none');
 rows.filter(r=>/claude v mimo|chatgpt v|reserve/.test(r)).slice(0,8).forEach(r=>console.log('       '+r));
 ok(/sol:'openrouter'/.test(src('new','Resolve Seats.js')),'A2 Resolve Seats maps sol to the openrouter alternate call');
 const ab=src('new','Alternate Build.js').match(/const body=\/\^openai\\\/\/\.test\(a\.api_model\)\?\{[^}]*\}/)[0];ok(!/reasoning|effort/.test(ab),'A2 an openai/ alternate body is {model,max_tokens,messages}: no reasoning or effort field');}

// ---------------- A3 ----------------
{const L13=line(E[13].full_reply,/^RESTATED: D1 vs C1/).replace(/^RESTATED:\s*/,'');const single=J('32255','single');const RES=line(single.text.replace(/[*_]/g,''),/^RESULT:/);
 const b=drvLib(D+'base/Cure Check.js').dg8Lines;ok(b(L13).length===1&&b(RES).length===0,'A3 base: the disclaimed restated line marked ('+b(L13).length+'), the timing RESULT missed ('+b(RES).length+')');
 ok(every(drvNodes,f=>{const g=drvLib(D+'new/'+f).dg8Lines;return g(L13).length===0&&g(RES).length===1;}),'A3 new: "does not rest on Matthew 1:25 or Matthew 1:18 as excluding any union" not marked; RESULT "contradicted by the stated timing" marked, on all nodes');
 const g=J('32212','gemini'),gl=line(g.text,/^D3:/),g5=line(g.text,/^D5:/),g80=line(J('32194','gemini').text,/^D3 vs C1/);const D1L=line(single.text.replace(/[*_]/g,''),/^D1 vs C1/);
 ok(every(drvNodes,f=>{const x=drvLib(D+'new/'+f).dg8Lines;return x(gl).length===1&&x(g5).length===1&&x(g80).length===1&&x(D1L).length===1;}),'A3 the judge_fix2 true marks stay (886 D3, 886 D5, 880 D3 vs C1) and the 32255 single judge D1 vs C1 line is still marked');
 ok(every(drvNodes,f=>drvLib(D+'new/'+f).dg8Lines('D2 vs C1 (Matthew 1:18-25): UNDERDETERMINED -- the same verses are read two ways and neither reading is excluded by their own words.').length===0),'A3 hedged "neither reading is excluded" still not marked');
 // the stored reply of row 13 now cures K-DG8
 const it={rule:'K-DG8',side:'CHALLENGER',link:'D1 vs C1',line:E[13].flagged_line};const R=RL.rounds(RL.run('32255'));
 const v=L=>L.cureVerdicts([it],{ok:true,text:E[13].full_reply},null,R)[0];const vb=v(fullLib(D+'base/Cure Check.js')),vn=v(fullLib(D+'new/Cure Check.js'));
 ok(vb.status==='UNCURED'&&vn.status==='CURED','A3 enforcer row 13 on the stored reply: base '+vb.status+' ('+vb.why+') -> new '+vn.status+' ('+vn.why+')');}

// ---------------- A4 ----------------
{const PWL=v=>{const s=src(v,'Panel Build.js');return new Function(s.slice(s.indexOf('const PWL='),s.indexOf('\nconst LEDGER='))+';return PWL;')();};
 const r=RL.run('32255');const F={cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3};const SYS='RULES ...\n\n'+PWL('base').judgeBlock(F);
 const orc=src('base','Panel Build.js').match(/const __orc=[^\n]*/)[0];const __orc=new Function(orc+';return __orc;')();
 const body=__orc({model:'google/gemini-3.8-flash',max_tokens:64000,messages:[{role:'system',content:SYS},{role:'user',content:'DEBATE TRANSCRIPT ...'}]},'openrouter','google/gemini-3.8-flash','t');
 ok(Array.isArray(body.messages[0].content),'A4 __orc turns a google/ system message into a cached array (as for Gemini and Qwen in 32255)');
 const gj=J('32255','gemini'),f=gj.fields;const kg6=v=>{const L=drvLib(D+v+'/Panel Payloads.js');const pt=L.drvPromptText(body);return L.drvLedger(gj.text,pt,f.conceded_links,f.challenger_conceded_links,f.defense_standing,f.challenge_standing,{DEFENDER:f.counted_premises_defender,CHALLENGER:f.counted_premises_challenger}).items.filter(x=>x.rule==='K-G6').map(x=>x.link);};
 const b=kg6('base'),w=kg6('new');ok(b.length===0&&w.length>=1,'A4 K-G6 on Gemini 32255 (judgment 892) through the cached body: base '+(b.join(', ')||'none')+' -> new '+w.join(', '));
 const pn=v=>{const L=drvLib(D+v+'/Panel Payloads.js');return L.drvPromptText(body).split('\n').filter(l=>/^premise \d/.test(l)).length;};
 ok(pn('base')===0&&pn('new')>0,'A4 the ledger premise lines read from that body: base '+pn('base')+', new '+pn('new'));
 for(const f2 of ['Alternate Payloads.js','Extract Independent Verdict.js'])ok(drvLib(D+'new/'+f2).drvPromptText(body)===drvLib(D+'new/Panel Payloads.js').drvPromptText(body),'A4 '+f2+' reads the cached body the same way');}

// ---------------- A5 ----------------
{const s1=line(J('32228','single').text.replace(/[*_]/g,''),/^D5 vs C6/),dk='D5 vs C6 (Jeremiah 22:30): DEFENDER LINK BROKEN -- [L1] "no man of his seed shall prosper" (Jeremiah 22:30); [L2] zera (seed) -- GROUND: [CR3] LINK 4 [premise 6] concedes it cannot exhibit \'a legal heir received by taking is not seed\'.'; /* DeepSeek 32228 was removed (no judgment row); its line as quoted in run32228/problems.md B2 */
 const bk=drvLib(D+'base/Cure Check.js');ok(marks(bk,s1).includes('K-G4 D5 vs C6')&&marks(bk,dk).includes('K-G4 D5 vs C6'),'A5 base: K-G4 on the 32228 concession-ground BROKEN lines (single judge, DeepSeek)');
 ok(every(drvNodes,f=>{const L=drvLib(D+'new/'+f);return !marks(L,s1).includes('K-G4 D5 vs C6')&&!marks(L,dk).includes('K-G4 D5 vs C6');}),'A5 new: neither is K-G4 on any node (a "K-G4 NOT RAISED" audit line is written instead)');
 const cg=J('32255','chatgpt');ok(every(drvNodes,f=>{const m=marks(drvLib(D+'new/'+f),cg.text);return m.includes('K-G4 D3 vs C6')&&m.includes('K-G4 D5 vs C2');}),'A5 the true K-G4 marks (32255 ChatGPT D3 vs C6, D5 vs C2) stay');
 ok(every(drvNodes,f=>marks(drvLib(D+'new/'+f),'D2 vs C1 (Luke 1:35): CHALLENGER LINK BROKEN -- [L1] "x y z" ; [L3] Luke 1:31 -- GROUND: [CR3] conceded nothing and [DR3] left Luke 1:31 unanswered.').includes('K-G4 D2 vs C1')),'A5 a challenger link whose ground names the OTHER side\'s concession and an unanswered witness is still K-G4');}

// ---------------- A6 ----------------
{const R=RL.rounds(RL.run('32255'));for(const [id,rule,link,want] of [[13,'K-DG8','D1 vs C1','The mark is correct; the original ground read the timing rows'],[17,'K-C','D6','I accept the mark; D6 is restated on the chain as a whole']]){
  const it={rule,side:'DEFENDER',link,line:E[id].flagged_line};const g=v=>fullLib(D+v+'/Cure Check.js').cureVerdicts([it],{ok:true,text:E[id].full_reply},null,R)[0].response||'';
  ok(!g('base').startsWith(want)&&g('base').slice(0,60)===String(E[id].response_line).slice(0,60)&&g('new').startsWith(want),'A6 row '+id+' '+rule+' '+link+': base reproduces the stored (wrong) RESPONSE "'+g('base').slice(0,40)+'..."; new "'+g('new').slice(0,50)+'..."');}
 ok(every(cureNodes,f=>/const ruleOk=L=>/.test(src('new',f))),'A6 respOf matches by rule and item on all '+cureNodes.length+' cure nodes (enfRows reads it)');}

// ---------------- A7 ----------------
{const s=src('new','Build Save Body.js');const a=s.indexOf('// judge_fix2 E6');const b=s.indexOf("const RN=FF.length?FF.join(' '):null;",a);const blk=s.slice(a,b);
 const sb=src('base','Build Save Body.js');const blkB=sb.slice(sb.indexOf('// judge_fix2 E6'),sb.indexOf("const RN=FF.length?FF.join(' '):null;"));
 const r=RL.run('32255');const d={synthesis:r.synthesis,cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3};
 const go=x=>{const FF=[];new Function('d','FF',x)(d,FF);return FF;};const ob=go(blkB),on=go(blk);
 ok(ob.filter(x=>/S-A/.test(x)).length===1,'A7 base on 32255: S-A '+ob.filter(x=>/S-A/.test(x)).length+', S-C '+ob.filter(x=>/S-C/.test(x)).length+', S-E none (no such check)');
 ok(on.some(x=>/S-A/.test(x)&&/Both use 3:38/.test(x))&&on.some(x=>/S-A/.test(x)&&/Both now agree/.test(x)),'A7 new S-A: "Both use 3:38" and "Both now agree" marked');
 ok(on.some(x=>/S-C/.test(x)),'A7 new S-C fires on section 1 ("no charge on either side\'s list contests these"): '+on.filter(x=>/S-C/.test(x)).length+' item(s)');
 ok(on.some(x=>/S-E/.test(x)&&/Septuagint/.test(x)),'A7 new S-E: "withdrew the Septuagint citation" against "I withdraw nothing" marked');
 const se=[...blk.matchAll(/x/g)];console.log('     new synthesis lines on 32255 ('+on.length+'):');on.forEach(x=>console.log('       '+x.slice(0,230)));
 const dd={...d,synthesis:'## 2. Concessions\n- The defender withdrew the Septuagint citation.'};const d2={...dd,cr2:String(d.cr2)+'\nI withdraw the Septuagint citation.'};
 const FF=[];new Function('d','FF',blk)(d2,FF);ok(!FF.some(x=>/S-E/.test(x)),'A7 S-E is quiet when the side\'s round does withdraw it in words');}

// ---------------- A8 ----------------
{const R3='a verse counts as evidence, as footing, as a witness or as an answer only when its book, chapter and verse are stated and its words are quoted fully and correctly';
 ok(['Panel Build.js','Build Independent Verdict.js'].every(f=>src('new',f).includes(R3)),'A8 the judge rule (ruling 3) is in Panel Build and Build Independent Verdict (Alternate and Reserve Build reuse Panel Build\'s prompt)');
 ok(/VERSE CITATION \(operator ruling 3\)/.test(src('new','Format Markdown.js')),'A8 Format Markdown\'s rule copy carries ruling 3');
 const g=src('new','Init with Guards.js');ok((g.match(/cite every verse by book, chapter and verse \(for example Matthew 1:25\) and quote its words exactly/g)||[]).length===2,'A8 both debater frames (DEF_BURDEN, CH_BURDEN) carry the citation rule');
 ok(every(cureNodes,f=>/A verse counts as footing, as a witness or as an answer only when its book, chapter and verse are stated/.test(src('new',f))),'A8 the cure rule copy carries ruling 3 on all cure nodes');
 // the checkers' "answered" tests require the reference to be named
 const R={CR1:'x',DR1:'x',CR2:'He said the timing proves nothing: "knew her not till she had brought forth" bounds the abstinence.',DR2:'Matthew 1:25 "knew her not till she had brought forth her firstborn son" is pressed.',CR3:'x',DR3:'x'};
 const ans=fullLib(D+'new/Cure Check.js').kg4Answered('DEFENDER','D1 vs C1 (Luke 1:34): DEFENDER LINK BROKEN -- Matthew 1:25 unanswered.',[{round:'DR2',q:'knew her not till she had brought forth her firstborn son'}],R);
 ok(ans.length===0,'A8 K-G4 (kg4Answered): an answer quoting the words without "Matthew 1:25" is not an answer ('+ans.length+' namings)');
 const R2={...R,CR3:R.CR2+' (Matthew 1:25)'};ok(fullLib(D+'new/Cure Check.js').kg4Answered('DEFENDER','D1 vs C1 (Luke 1:34): DEFENDER LINK BROKEN -- Matthew 1:25 unanswered.',[{round:'DR2',q:'knew her not till she had brought forth her firstborn son'}],R2).length===1,'A8 the same answer with the reference named counts');
 const P=src('new','Panel Build.js');const PW=new Function(P.slice(P.indexOf('const PWL='),P.indexOf('\nconst LEDGER='))+';return PWL;')();
 const L=PW.ledger({cr1:'a',gr1:'b',cr2:'"knew her not till she had brought forth" answers it.',gr2:'UNSUPPORTED-L4 PREMISES\n1. LINK 1: "x" PRESSED WITH: Matthew 1:25 "knew her not till"',cr3:'LINK 1: SUPPORTED -- "knew her not till she had brought forth"',dr3:'c'});
 ok(L.defender.premises[0].notNamed.join()==='Matthew 1:25','A8 the ledger (K-G6\'s source): words without the reference leave Matthew 1:25 NOT NAMED');
 // the citation check reaches the judges as NOT COUNTED
 const k=P.slice(P.indexOf('const KJVC=(()=>{'),P.indexOf('})();',P.indexOf('const KJVC=(()=>{'))+5);
 const QR={checked:3,matches:1,not_checked:0,mismatches:2,items:[{side:'DEFENDER',round:'R1',ref:'John 6:42',quote:'Is not this Joseph\'s son?',status:'WORDING DIFFERS FROM John 6:42'},{side:'CHALLENGER',round:'R1',ref:'Romans 1:3',quote:'of the seed of David kata sarka',status:'WORDING NOT FOUND IN Romans'},{side:'CHALLENGER',round:'R2',ref:'Hebrews 7:9',quote:'x',status:'WORDS ARE AT Hebrews 7:10'}]};
 const out=new Function('$','NL',k+';return KJVC;')(()=>({first:()=>({json:QR})}),'\n');
 ok(/John 6:42.*WORDING DIFFERS FROM John 6:42 -- NOT COUNTED/.test(out)&&/WORDING NOT FOUND IN Romans -- NOT COUNTED/.test(out)&&!/WORDS ARE AT Hebrews 7:10 -- NOT COUNTED/.test(out)&&/a line marked NOT COUNTED is not footing/.test(out),'A8 Panel Build citation block: WORDING DIFFERS and WORDING NOT FOUND reach the judges "NOT COUNTED"; WORDS ARE AT unchanged');}

// ---------------- B2: the C4 new-press check ----------------
{const s=src('new','C4 Extract.js');const C4P=new Function(s.slice(s.indexOf('const C4P='),s.indexOf('return {refs,fresh,of,note};})();')+'return {refs,fresh,of,note};})();'.length)+';return C4P;')();
 const e=['Matthew 1:16 "Joseph the husband of Mary"; Luke 3:23-25 and Romans 1:3.','Genesis 4:1 and Acts 2:30 (also 2:31).','LINK 1: SUPPORTED [L1] Matthew 1:20'];
 const t1=C4P.fresh(e,'I close on Matthew 1:16, Luke 3:24 and Romans 1:3, as the record shows (Acts 2:31).');
 ok(t1.length===0,'B2 verses cited before (a verse inside an earlier range; a bare 2:31 after Acts in the same sentence) are not new presses');
 const t2=C4P.fresh(e,'Consider Hebrews 7:14 "our Lord sprang out of Juda" and Psalm 132:11; also Luke 3:23.');
 ok(t2.join()==='Hebrews 7:14,Psalms 132:11','B2 new verses in the close are new presses: '+t2.join(', '));
 const t3=C4P.fresh(e,'Romans 1:3. (1:4)');ok(t3.length===0,'B2 a bare reference after a sentence end takes no book and is not read (no false press)');
 const note=C4P.note({gr1:e[0],gr2:e[1],dr3:e[2],dr4:'Hebrews 7:14 settles it.'});ok(/NEW PRESS and is NOT COUNTED/.test(note)&&/Hebrews 7:14/.test(note),'B2 the judges\' note under [DR4] lists it as NOT COUNTED');
 for(const f of ['Panel Build.js','Build Independent Verdict.js','Build Save Body.js','Format Markdown.js','Build Synthesis.js'])ok(src('new',f).includes(s.slice(s.indexOf('const C4P='),s.indexOf('return {refs,fresh,of,note};})();'))),'B2 '+f+' carries the same C4P code');
 ok(/C4P\.note\(F\)/.test(src('new','Panel Build.js'))&&/C4P\.note\(d\)/.test(src('new','Build Independent Verdict.js'))&&/CLOSE-ROUND PRESS CHECK \(C4\)/.test(src('new','Build Save Body.js')),'B2 marked for the panel and the single judge, recorded in review_notes');}

// ---------------- B3: round sets ----------------
{const L=fullLib(D+'new/Cure Check.js'),Lb=fullLib(D+'base/Cure Check.js');
 const body={messages:[{role:'system',content:'S'},{role:'user',content:'DEBATE TRANSCRIPT\n\n=== [CR1] DEFENDER R1 ===\nc1\n\n=== [DR3] CHALLENGER R3 -- LINK ROUND (challenger exhibit-or-concede) ===\nd3\n\n=== [CR4] DEFENDER R4 -- CLOSE ROUND (defender final defense; answers pressed witnesses) ===\nc4 text\n\n=== [DR4] CHALLENGER R4 -- CLOSE ROUND (challenger final words; no new press) ===\nd4 text'}]};
 const R=L.cureRounds(body);ok(R.CR4.trim()==='c4 text'&&R.DR4.trim()==='d4 text'&&R.DR3.trim()==='d3','B3 cureRounds reads [CR4] and [DR4] as their own blocks (base: '+JSON.stringify(Object.keys(Lb.cureRounds(body)))+')');
 const t='D3 vs C2 (Luke 1:32): UNDERDETERMINED -- [CR4] answered Psalm 2:7, and no verse states the contrary.';
 ok(every(drvNodes,f=>!marks(drvLib(D+'new/'+f),t).includes('K-S D3 vs C2'))&&marks(drvLib(D+'base/Cure Check.js'),t).includes('K-S D3 vs C2'),'B3 K-S: [CR4] named as the answering round is read as named (base marked it)');
 const RR={CR1:'a',DR1:'b',CR2:'c',DR2:'Psalm 2:7 "Thou art my Son; this day have I begotten thee" is pressed against LINK 3.',CR3:'d',DR3:'e',CR4:'ANSWER: Psalm 2:7 -- D3 -- "Thou art my Son"'};
 const an=L.kg4Answered('DEFENDER','D3 vs C6 (Acts 13:33): DEFENDER LINK BROKEN -- [L1] ... Psalm 2:7 unanswered.',[{round:'DR2',q:'Thou art my Son; this day have I begotten thee'}],RR);
 ok(an.length===1&&an[0].round==='CR4','B3 K-G4: a pressed witness named in the defender\'s close [CR4] makes the BROKEN grade unanswered-false');
 const RC={...RR,DR4:'Psalm 2:7 again.'};ok(L.kg4Answered('CHALLENGER','D1 vs C1 (Psalm 2:7): CHALLENGER LINK BROKEN -- Psalm 2:7 unanswered.',[{round:'CR2',q:'c'}],{...RC,CR2:'Psalm 2:7 "Thou art my Son" presses C1.'}).length===0,'B3 K-G4: the challenger\'s close [DR4] answers nothing');
 ok(every(cureNodes,f=>{const x=src('new',f);return x.includes("['CR2','CR3','CR4']:['DR1','DR2','DR3']")&&x.includes("const CURE_PRESS={DEFENDER:['DR1','DR2'],CHALLENGER:['CR1','CR2','CR3']}")&&!/(?<!\[CR1\], )\[CR2\] or \[CR3\]/.test(x);}),'B3 every cure node: the defender answers in [CR2], [CR3] or [CR4]; pressing rounds unchanged; no "[CR2] or [CR3]" text left');
 const P=src('new','Panel Build.js');const PW=new Function(P.slice(P.indexOf('const PWL='),P.indexOf('\nconst LEDGER='))+';return PWL;')();const r=RL.run('32255');
 const F={cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3};
 const l0=PW.judgeBlock(F),l1=PW.judgeBlock({...F,cr4:'ANSWER: Deuteronomy 24:1 -- D1 -- "When a man hath taken a wife". ANSWER: Psalm 2:7 and Acts 13:33 -- D3. ANSWER: Luke 1:5 -- D5.'});
 const dl=t=>t.slice(t.indexOf('AGAINST THE DEFENDER'),t.indexOf('AGAINST THE CHALLENGER'));
 ok(/NOT NAMED: Deuteronomy 24:1/.test(dl(l0))&&!/NOT NAMED: Deuteronomy 24:1/.test(dl(l1))&&!/Luke 1:5/.test(dl(l1).split('\n').filter(x=>/NOT NAMED/.test(x)).join(' ')),'B3 the judges\' ledger on 32255: the unanswered Deuteronomy 24:1, Psalm 2:7, Acts 13:33, Luke 1:5 become named when [CR4] names them');
 ok(/AGAINST THE DEFENDER, answered in \[CR2\], \[CR3\] or \[CR4\]/.test(l0)&&/AGAINST THE CHALLENGER, answered in \[DR1\], \[DR2\] or \[DR3\]/.test(l0),'B3 the ledger headings: defender [CR2], [CR3] or [CR4]; challenger unchanged ([DR4] answers nothing)');
 const pd=drvLib(D+'new/Panel Payloads.js');const T='AGAINST THE DEFENDER, answered in [CR2], [CR3] or [CR4]:\npremise 1 (LINK 1): 1 verse(s) carried; 0 named; NOT NAMED: Acts 1:8\nAGAINST THE CHALLENGER, answered in [DR1], [DR2] or [DR3]:\npremise 1: 1 verse(s) carried; 1 named; NOT NAMED: none\nA verse marked NOT NAMED is unanswered by the rule.';
 ok(pd.drvLedger('CONCEDED LINKS: 0 -- none.\nCHALLENGER CONCEDED LINKS: 0 -- none.',T,0,0,'SELF-SUPPORTED','SELF-SUPPORTED',null).items.some(x=>x.rule==='K-G6'),'B3 K-G6 reads the new ledger heading (drvLabAt)');
 for(const f of ['Panel Build.js','Build Independent Verdict.js'])ok(src('new',f).includes('the challenger close round [DR4] is structurally LAST')&&src('new',f).includes('[DR4] is the challenger\\\'s final words on its own position'),'B3 '+f+': counting rule names [CR4] as an answering round and [DR4] as answering nothing, structurally last');
 ok(/\[CR4\] DEFENDER R4 -- CLOSE ROUND/.test(src('new','Build Diagnostic Prompt.js'))&&/DEFENDER R4 -- CLOSE ROUND/.test(src('new','Build Synthesis.js'))&&/Round 4 - Defender/.test(src('new','Format Markdown.js'))&&/Round 4 - Challenger/.test(src('new','Failure Salvage.js')),'B3 the synthesis, diagnostic, Format Markdown and the salvage file include both close rounds');
 ok(/defender_r4:d\.cr4\|\|null,challenger_r4:d\.dr4\|\|null/.test(src('new','Build Save Body.js'))&&/cr4:prev\.cr4/.test(src('new','Final Output.js'))&&/cr4:r\.defender_r4\|\|null/.test(src('new','Regrade Load.js')),'B4 the save path carries defender_r4 and challenger_r4; Final Output and Regrade Load carry cr4/dr4');}
console.log('\n'+n+' fixtures, '+bad+' bad');process.exitCode=bad?1:0;
