// judge_fix6 unit fixtures: every H item, with the run 32293 false cases and true controls that must still fire. Base = live 6ff18a54 (base/),
// new = judge_fix6 (new/). Each line: OK or BAD, the fixture, what was read.
const fs=require('fs');const crypto=require('crypto');const L=require('./lib6.cjs');const RL=require('./replay_lib.cjs');const R=require('./runner.cjs');const LL=require('./libload.cjs');
const D=__dirname+'/../';let ok=0,bad=0;const T=(name,cond,info)=>{cond?ok++:bad++;console.log((cond?'OK  ':'BAD ')+name+(info!==undefined?' | '+(typeof info==='string'?info:JSON.stringify(info)):''));};
const r93=RL.run('32293'),r84=RL.run('32284'),r66=RL.run('32266');const R93=RL.rounds(r93);const E93=JSON.parse(fs.readFileSync(D+'data/enforcer_log_32293.json','utf8'));
const NB=L.chk('new','Panel Payloads'),OB=L.chk('base','Panel Payloads');const NC=L.lib('new','Panel Cure Check'),OC=L.lib('base','Panel Cure Check'),NS=L.lib('new','Cure Check'),OS=L.lib('base','Cure Check');
const blk=(t,n)=>{const H=[...t.matchAll(/^[ \t>*#_-]*LINK\s+(\d+)[^\n]*/gmi)];const i=H.findIndex(h=>+h[1]===n);return t.slice(H[i].index,i+1<H.length?H[i+1].index:t.length);};
const PT=(R)=>'RULES\n\n'+Object.entries(R).map(([k,v])=>'=== ['+k+'] ROUND ===\n'+v).join('\n\n');

console.log('== H1: K-LB, the one layer reader, VOID premises');
{const b4=blk(r93.challenger_r3,4),b6=blk(r93.challenger_r3,6);
 T('H1 32293 [DR3] LINK 4 (kata sarka inside the [L2] text): base reads one kind (the false mark)',OB.lbKinds(b4).length<2,OB.lbKinds(b4));
 T('H1 32293 [DR3] LINK 4: new reads two kinds',NB.lbKinds(b4).length>=2,NB.lbKinds(b4));
 T('H1 32293 [DR3] LINK 6 (osphys, loins): base reads one kind (the false mark)',OB.lbKinds(b6).length<2,OB.lbKinds(b6));
 T('H1 32293 [DR3] LINK 6: new reads two kinds',NB.lbKinds(b6).length>=2,NB.lbKinds(b6));
 const all=[1,2,3,4,5,6].map(j=>NB.lbKinds(blk(r93.challenger_r3,j)).length>=2);T('H1 32293 every [DR3] block shows two kinds (new)',all.every(Boolean),all);
 const dall=[1,2,3,4,5,6].map(j=>{try{return NB.lbKinds(blk(r93.engine_r3.split(/CHALLENGER.{0,2}S\s+UNSUPPORTED/i)[0],j)).length>=2;}catch(e){return null;}});T('H1 32293 every [CR3] block shows two kinds (new)',dall.every(Boolean),dall);
 T('H1 control: an [L2] tag with an English gloss only and no source word is not read as L2',!NB.lbKinds('[L1] Luke 2:48 "thy father and I have sought thee"\n[L2] The word means father in the household sense.').includes('L2'));
 T('H1 control: "[L2] the house (of David)" style English word is read (known leniency, recorded)',true,NB.lbKinds('[L2] the house (of David)'));
 T('H1 control: [L2] after "no" never counts',!NB.lbKinds('[L1] "thy father and I" and no [L2] kata sarka (according to flesh)').includes('L2'));
 T('H1 control: a tag stops at the next tag: [L1] with no quotation is not met by a quotation under the next [L3]',!NB.lbKinds('[L1] Luke 2:48 states it. [L3] Luke 2:27 "the parents brought in the child"').includes('L1'));
 // K-B, K-LB and the cure checks read with one function: the same text in every node
 const md=nm=>{const s=fs.readFileSync(D+'new/'+nm+'.js','utf8');const i=s.indexOf('const ENF_STATUS=');const j=s.indexOf('const drvKinds=(line)=>drvLayers(line);');return i<0||j<0?null:crypto.createHash('md5').update(s.slice(i,j)).digest('hex');};
 const NODES=['Panel Payloads','Alternate Payloads','Extract Independent Verdict','Alternate Build','Alternate Cure Build','Alternate Cure Normalize','Alternate Merge','Cure Build','Cure Check','Cure Normalize','Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Panel Cure Check','Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3'];
 const ms=NODES.map(md);T('H1/H8 the status table and layer reader are one text in all 17 checker and cure nodes',ms.every(x=>x&&x===ms[0]),ms[0]);
 T('H1 K-B reads with drvKinds = drvLayers; K-LB lbKinds = drvLayers',/const drvKinds=\(line\)=>drvLayers\(line\);/.test(fs.readFileSync(D+'new/Panel Payloads.js','utf8'))&&/const lbKinds=block=>drvLayers\(block\);/.test(fs.readFileSync(D+'new/Panel Payloads.js','utf8')));
 // VOID
 const J=s=>RL.judgment(r93.judgments.find(j=>j.judge_seat===s).verdict_raw,true).text;
 const vC=NB.lbVoid(J('chatgpt'),'CHALLENGER'),vS=NB.lbVoid(J('sol'),'CHALLENGER'),vSD=NB.lbVoid(J('sol'),'DEFENDER'),vG=NB.lbVoid(J('gemini'),'CHALLENGER');
 T('H1 VOID: ChatGPT (902) rules all six challenger premises VOID',vC.all===true,{all:vC.all,set:[...vC.set]});
 T('H1 VOID: Sol (901) rules challenger premises 4, 5, 6 VOID',[4,5,6].every(j=>vS.has(j))&&!vS.has(2)&&!vS.has(3),{all:vS.all,set:[...vS.set]});
 T('H1 VOID: Sol (901) rules defender premises 1 and 6 VOID',vSD.has(1)&&vSD.has(6)&&!vSD.has(2),{all:vSD.all,set:[...vSD.set]});
 T('H1 VOID control: Gemini (900) rules nothing VOID',!vG.all&&vG.set.size===0,{all:vG.all,set:[...vG.set]});
 // drvBlocks: a one-kind block is marked (true control); the same block ruled VOID is not
 const one='**LINK 1: SUPPORTED.**\n- [L1] Luke 2:48 "thy father and I have sought thee sorrowing"\n- [L2] The word is the common one.\n- Chain: so the father is named.\n';
 const P1=PT({CR1:'x',DR1:'x',CR2:'x',DR2:'x',CR3:'**LINK 1: KEPT.** [L1] "a b c d e" [L3] Luke 1:1',DR3:one});
 const txt=v=>'CHALLENGE STANDING: SELF-SUPPORTED -- L=1 c=0\nCHALLENGER CONCEDED LINKS: 0'+(v?' -- Premise 1 is VOID: the charge adds "only" to the quotation.':'')+'\nCOLLISION POINTS:\n';
 const m0=NB.drvBlocks(txt(false),P1,0,0,'SELF-SUPPORTED','SELF-SUPPORTED',null,{DEFENDER:1,CHALLENGER:1});const m1=NB.drvBlocks(txt(true),P1,0,0,'SELF-SUPPORTED','SELF-SUPPORTED',null,{DEFENDER:1,CHALLENGER:1});
 T('H1 control: a one-kind link-round block not counted still fires K-LB (new)',m0.items.some(x=>x.rule==='K-LB'&&x.link==='CHALLENGER premise 1'),m0.items.map(x=>x.link));
 T('H1 the same block ruled VOID by the seat is not marked (new)',!m1.items.some(x=>x.rule==='K-LB'),m1.items.map(x=>x.link));
 T('H1 a K-LB mark says TRIAL',m0.marks.some(x=>/TRIAL rule/.test(x)));}

console.log('== H2: the cure check reads single marks; a refused statement names its step');
{const ITEMS=seat=>E93.filter(e=>e.seat===seat&&e.kind==='cure').map(e=>({rule:e.rule,side:'CHALLENGER',link:e.item,premise:e.rule==='K-LB'?+e.item.match(/\d+$/)[0]:undefined,line:e.flagged_line,conc:0,st:'SELF-SUPPORTED',L:6}));
 const run=(C,seat)=>C.cureVerdicts(ITEMS(seat),{ok:true,text:E93.find(e=>e.seat===seat&&e.kind==='cure').full_reply},null,R93);
 const ob=run(OC,'glm'),nb=run(NC,'glm');
 for(const p of [4,6]){const o=ob.find(x=>x.link==='CHALLENGER premise '+p),n=nb.find(x=>x.link==='CHALLENGER premise '+p);
  T('H2 32293 GLM (rows '+(p===4?75:76)+') premise '+p+' single-mark statement: base UNCURED',o.status==='UNCURED',o.why);
  T('H2 32293 GLM premise '+p+': new CURED',n.status==='CURED',n.why);}
 const os=run(OS,'single'),ns=run(NS,'single');const o4=os.find(x=>x.link==='CHALLENGER premise 4'),n4=ns.find(x=>x.link==='CHALLENGER premise 4');
 T('H2 32293 single judge (row 81) premise 4: base UNCURED, reason names no step',o4.status==='UNCURED'&&!/step/.test(o4.why),o4.why);
 T('H2 32293 single judge premise 4: new CURED (the refusing step was the layer reader: [L1] in nested double marks and [L2] not at the start were not read)',n4.status==='CURED',n4.why);
 const st=OB.drvKinds('[L1] "1 Chronicles 28:6 "And he said unto me, Solomon thy son, he shall build my house"" and [L2] "Romans 1:3 adds kata sarka (according to flesh) when flesh is meant" with [L3] "2 Samuel 7:14 "I will be his father""');
 T('H2 diagnosis: the base layer reader reads the row 81 premise 4 statement as L3 only',st.join()==='L3',st);
 const it={rule:'K-LB',side:'CHALLENGER',link:'CHALLENGER premise 4',premise:4,line:'x',conc:0,st:'SELF-SUPPORTED',L:6};const v=(C,txt)=>C.cureVerdicts([it],{ok:true,text:txt+'\nRESPONSE: K-LB CHALLENGER premise 4 | I answer the mark in my own words here.'},null,R93)[0];
 const a=v(NC,'STATEMENT: K-LB CHALLENGER premise 4 | [L1] "And he said unto me, Solomon thy son, he shall build my house" only.');
 T('H2 control: a statement with one layer kind stays UNCURED and names step 3',a.status==='UNCURED'&&/step 3 \(layer kinds\)/.test(a.why),a.why);
 const b=v(NC,"STATEMENT: K-LB CHALLENGER premise 4 | [L1] 'the quick brown fox jumps over' and [L2] kata sarka (according to flesh).");
 T('H2 control: a statement whose quotation is not in [DR3] stays UNCURED and names step 2',b.status==='UNCURED'&&/step 2 \(quotation\)/.test(b.why),b.why);
 const c=v(NC,'RESPONSE only.');T('H2 control: no statement names step 1',c.status==='UNCURED'&&/step 1 \(statement\)/.test(c.why),c.why);
 const d=v(NC,"STATEMENT: K-LB CHALLENGER premise 4 | [L1] 'And he said unto me, Solomon thy son, he shall build my house' and [L2] kata sarka (according to flesh), the block's own words.");
 T('H2 a single-mark statement with two kinds that quotes [DR3] is CURED',d.status==='CURED',d.why);}

console.log('== H3: the renumbering flag');
{const load=dir=>new Function(fs.readFileSync(dir+'/refp.js','utf8')+'\n'+fs.readFileSync(dir+'/close.js','utf8')+'\nreturn C4P;')();const N=load(D+'lib'),O=load(D+'../judge_fix5/lib');
 for(const [n,r] of [['32293',r93],['32284',r84],['32266',r66]])for(const sd of ['D','C']){const F=LL.F_(r);const w=N.renum(F,sd),b=O.renum(F,sd);
  if(n==='32293'){T('H3 '+n+' '+sd+'4 base flagged (the false flag)',b.length>0,b.length);T('H3 '+n+' '+sd+'4 new: no flag',w.length===0,w);}
  else T('H3 '+n+' '+sd+'4 new: flagged',w.length>0&&/numbering of its own/.test(w[0]),w[0]);}
 const F={cr1:'DECLARED CHAIN\n1. Isaiah 7:14 gives a sign fulfilled in Matthew 1:23.\n2. Luke 3:23 enomizeto was supposed.\n3. Romans 1:3 the seed of David kata sarka.',dr3:'',cr4:'**D1: NARROWED TO:** Luke 3:23 marks enomizeto as supposition.\n\n**D2: KEPT.** Romans 1:3 kata sarka, the seed of David.\n\n**D3: KEPT.** Isaiah 7:14 gives a sign fulfilled in Matthew 1:23.'};
 T('H3 control: labels that carry another declared link\'s verses and words are flagged',N.renum(F,'D').length>=2,N.renum(F,'D'));
 const F2={...F,cr4:'**D1: KEPT.** Isaiah 7:14.\n\n- **D2, D3 -- KEPT.**\n\n## Next heading\nLuke 3:23 enomizeto.'};T('H3 a two-label status line ("D2, D3") is skipped and a label stops at the next heading',N.renum(F2,'D').length===0,N.renum(F2,'D'));}

console.log('== H4: the close-round press check');
{const N=new Function(fs.readFileSync(D+'lib/refp.js','utf8')+'\n'+fs.readFileSync(D+'lib/close.js','utf8')+'\nreturn C4P;')();const F=LL.F_(r93);
 const pc=N.press(F,'C').map(x=>x.s),pd=N.press(F,'D').map(x=>x.s);const has=(L,s)=>L.some(x=>x.includes(s));
 for(const s of ['Not one of them says what D6 says','is not stated by any verse the defender has shown','D6 is the keystone','The passive at the last link after the active series is non-narration','The defender says Matthew 1:25 denies the knowing','The defender has already narrowed it','the defender answers Romans 1:3'])T('H4 32293 [DR4] marks: "'+s+'"',has(pc,s));
 T('H4 32293 [DR4] does not mark the report "The defender grants enomizeto ... by lexicon alone" (base did)',!has(pc,'The defender grants'));
 T('H4 32293 [DR4] does not mark its own links ("C1 — NARROWED TO", "C5, C6")',!has(pc,'C1 — NARROWED TO')&&!has(pc,'C5, C6'));
 for(const s of ["The challenger's chain needs Joseph to have known Mary within the espousal",'It does not show a father undisturbed','The challenger dropped the silence-limb','The challenger granted that the Luke-Acts rows'])T('H4 32293 [CR4] marks: "'+s+'"',has(pd,s));
 T('H4 32293 [CR4] marks no ANSWER block sentence and none of its own D labels',!has(pd,'This row gives a near deadline')&&!has(pd,'D1: KEPT'));
 T('H4 32293 [CR4] does not mark "C6. Answered row by row below." (own)',!has(pd,'Answered row by row'));
 const F84=LL.F_(r84);T('H4 control 32284 [DR4] still marks "D1 is refused"',N.press(F84,'C').some(x=>/D1 is refused/.test(x.s)));
 T('H4 control 32284 [DR4] still marks "each stand on an inference the named rows do not state"',N.press(F84,'C').some(x=>/inference the named rows do not state/.test(x.s)));}

console.log('== H5: K-G9 NOT PRESSED needs a reason; the PASS line');
{const ledger='PRESSED-WITNESS LEDGER\ncited in [CR1], [CR2] or [CR3] and not named in a later round of the challenger (6 of 40): Hebrews 10:5, Luke 1:27, Matthew 1:21, Acts 13:33, Romans 1:4, Matthew 1:22\ncited in [DR1] or [DR2] and not named in a later round of the defender (0 of 50): none\n';
 const P=ledger+'\n'+PT(R93);const J=RL.judgment(r93.judgments.find(j=>j.judge_seat==='gemini').verdict_raw,true).text;
 const rs=NB.ciRulings(J);T('H5 32293 Gemini wrote six NOT PRESSED rulings with no reason',rs.filter(x=>x.kind==='NOT PRESSED'&&!x.reason).length===6,rs.map(x=>x.ref+' / '+(x.reason||'')));
 const c=NB.drvCited(J,P,0,0,'SELF-SUPPORTED','SELF-SUPPORTED',{DEFENDER:6,CHALLENGER:6});const it=c.items.find(x=>x.side==='CHALLENGER');
 T('H5 32293 Gemini: new K-G9 item on the challenger lists Luke 1:27 and Matthew 1:22, "NOT PRESSED gives no reason"',!!it&&it.missing.includes('Luke 1:27')&&it.missing.includes('Matthew 1:22')&&/NOT PRESSED gives no reason/.test(it.line),it&&it.line.slice(0,200));
 const ob=OB.drvCited(J,P,0,0,'SELF-SUPPORTED','SELF-SUPPORTED',{DEFENDER:6,CHALLENGER:6});T('H5 base: no K-G9 item on the same text',!ob.items.length);
 T('H5 the passing defender side writes "K-G9 PASS: 0 verses ruled"',c.marks.some(m=>/K-G9 PASS: 0 verses ruled -- DEFENDER CITED-IN 0/.test(m)),c.marks.filter(m=>/PASS/.test(m)));
 const J2=J.replace(/NOT PRESSED: ([^\n]*?\d+:\d+)\.?(?=\n|$)/g,"NOT PRESSED: $1 -- quoted for the defender's own chain, not against a link or listed premise of the challenger");
 const c2=NB.drvCited(J2,P,0,0,'SELF-SUPPORTED','SELF-SUPPORTED',{DEFENDER:6,CHALLENGER:6});T('H5 the same rulings with a reason: no item, "K-G9 PASS: 6 verses ruled"',!c2.items.length&&c2.marks.some(m=>/K-G9 PASS: 6 verses ruled/.test(m)),c2.marks.filter(m=>/PASS/.test(m)));
 const np=NB.ciRulings('NOT PRESSED: Luke 1:27 (quoted in [CR1] for D3, not against a challenger premise)\nNOT PRESSED: Matthew 1:22; the verse is the defender\'s own footing\nNOT PRESSED: Hebrews 10:5.');
 T('H5 parse: reason in parentheses, after a semicolon; none after a bare reference',np[0].reason&&np[1].reason&&!np[2].reason&&np[0].ref==='Luke 1:27',np.map(x=>[x.ref,x.reason]));
 T('H5 parse: a reason that names another verse does not rule that verse',![...np[0].keys].some(k=>/Luke 1:2[^7]/.test(k))&&np[0].keys.size===1,[...np[0].keys]);
 const p0=NB.ciRulings('PRESSED: Luke 1:27 -- [CR1] -- "To a virgin espoused to a man whose name was Joseph" -- UNANSWERED');T('H5 control: a PRESSED ruling still reads as before',p0.length===1&&p0[0].kind==='PRESSED');
 // the cure: reasoned lines cure the item, bare ones do not
 const C=NC;const item={...it,conc:0,st:'SELF-SUPPORTED',L:6};const lab=C.cureLabel(item);
 const bare=['Hebrews 10:5','Luke 1:27','Matthew 1:21','Acts 13:33','Romans 1:4','Matthew 1:22'].map(x=>'NOT PRESSED: '+x).join('\n')+'\nRESPONSE: '+lab+' | I ruled every listed verse in the fixed form.';
 const why=['Hebrews 10:5','Luke 1:27','Matthew 1:21','Acts 13:33','Romans 1:4','Matthew 1:22'].map(x=>'NOT PRESSED: '+x+" -- quoted for the defender's own chain, not against a challenger premise").join('\n')+'\nRESPONSE: '+lab+' | ruled with reasons.';
 const v1=C.cureVerdicts([item],{ok:true,text:bare},null,R93)[0],v2=C.cureVerdicts([item],{ok:true,text:why},null,R93)[0];
 T('H5 cure: NOT PRESSED lines without a reason leave K-G9 UNCURED',v1.status==='UNCURED',v1.why);T('H5 cure: the lines with a reason and a RESPONSE cure it',v2.status==='CURED',v2.why);
 T('H5 the judge prompt asks for the reason (Panel Build, Build Independent Verdict)',['Panel Build','Build Independent Verdict'].every(n=>/NOT PRESSED: <book chapter:verse> -- <the reason, in one clause/.test(fs.readFileSync(D+'new/'+n+'.js','utf8'))));}

console.log('== H6: the citation report');
{const {chain}=require('./cite_chain.cjs');const F=LL.F_(r93);const b=chain('base',F),n=chain('new',F);
 T('H6 32293 base keeps 300 of '+b.S.scanned+' scanned items; the challenger\'s close has none',b.S.items.length===300&&!b.Q.items.some(i=>i.side==='CHALLENGER'&&i.round==='R4'),b.Q.items.length);
 T('H6 32293 new keeps every scanned item (cap 1000), the challenger\'s close included',n.S.items.length===n.S.scanned&&n.Q.items.some(i=>i.side==='CHALLENGER'&&i.round==='R4'),{scanned:n.S.scanned,report:n.Q.items.length,cap:n.Q.item_cap});
 const l34b=b.Q.items.find(i=>i.side==='CHALLENGER'&&i.round==='R1'&&/the Lord God shall give unto him the throne/.test(i.quote)),l34n=n.Q.items.find(i=>i.side==='CHALLENGER'&&i.round==='R1'&&/the Lord God shall give unto him the throne/.test(i.quote));
 T('H6 32293 item 22: base "WORDS ARE AT Luke 1:32" (the false flag)',l34b&&l34b.status==='WORDS ARE AT Luke 1:32',l34b&&l34b.status);
 T('H6 32293 item 22: new MATCHES Luke 1:32, rebound from Luke 1:34',l34n&&l34n.status==='MATCHES'&&l34n.ref==='Luke 1:32'&&l34n.rebound_from==='Luke 1:34',l34n&&[l34n.ref,l34n.status,l34n.rebound_from]);
 const t72=n.Q.items.find(i=>i.side==='DEFENDER'&&i.round==='R2'&&i.ref==='Luke 1:35'&&/WORDING DIFFERS/.test(i.status));T('H6 control: the true misquote (defender round 2, Luke 1:35) still flags',!!t72);
 const nc=n.Q.items.filter(i=>i.status==='NOT CHECKED');T('H6 every NOT CHECKED carries a reason',nc.length>0&&nc.every(i=>i.reason),nc.map(i=>i.ref+': '+i.reason));
 const mk=(over)=>{const s=R.runNode('new','Quote Compare',{'Citation Scan':{items:[{ref:'Luke 1:1',book:'Luke',chapter:1,v1:1,v2:1,quote:'x y z w',segs:['x y z w'],side:'DEFENDER',round:'R1',...over}],scanned:1001,item_cap:1000},'Cited Verses':[{}]});return s[0].json.items[0];};
 T('H6 an item past the cap is NOT CHECKED with its reason',/item cap/.test(mk({over_cap:true}).reason||''),mk({over_cap:true}).reason);
 T('H6 an unread chapter is NOT CHECKED with its reason',/not read/.test(mk({unread:true}).reason||''),mk({unread:true}).reason);
 const s=fs.readFileSync(D+'new/Build Save Body.js','utf8');T('H6 the stored citation items keep reason and rebound_from',/\.\.\.\(i\.reason\?\{reason:i\.reason\}:\{\}\)/.test(s));}

console.log('== H7: Failure Salvage keeps the CACHE DIAG lines');
{const S={run_token:'ODV1-1-x',defender:{engine:'claude',profile:'plain'},challenger:{engine:'mimo',profile:'oracle'},topic:'T',sd:'2026-11-02'};
 const map={'Init Seats':S,'D1 Extract':{labelled:'r1',cache_diag:'[CACHE DIAG D1: cache_miss_reason=null (first Claude call of the seat, previous_message_id=null); read=0; write=900; uncached=12; previous_message_id=null; message_id=msg_1]'},
  'C1 Extract':{labelled:'c1',cache_diag:null},'D2 Extract':{labelled:'r2',cache_diag:'[CACHE DIAG D2: cache_miss_reason=null (no divergence); read=900; write=50; uncached=3; previous_message_id=msg_1; message_id=msg_2]'}};
 const ex={id:'t',customData:{set:()=>{}}};const src=fs.readFileSync(D+'new/Failure Salvage.js','utf8');const o=new Function('$','$input','$execution',src)(R.stub(map),{first:()=>({json:{error:{message:'call failed'}}})},ex)[0].json;
 T('H7 new: both CACHE DIAG lines in review_notes, in round order',/\[CACHE DIAG D1:[^\]]*\] \[CACHE DIAG D2:/.test(o.saveBody.review_notes),o.saveBody.review_notes.slice(0,300));
 const ob=new Function('$','$input','$execution',fs.readFileSync(D+'base/Failure Salvage.js','utf8'))(R.stub(map),{first:()=>({json:{error:{message:'call failed'}}})},ex)[0].json;
 T('H7 base: the lines were lost',!/CACHE DIAG/.test(ob.saveBody.review_notes));}

console.log('== H8: LIVE and TRIAL');
{T('H8 the table: K-LB, K-G9, C4-RENUM, C4-PRESS TRIAL; the older rules LIVE',['K-LB','K-G9','C4-RENUM','C4-PRESS'].every(r=>NB.ENF_STATUS[r]==='TRIAL')&&['K-B','K-C','K-G1','K-G3','K-G4','K-G6','K-G7','K-G8','K-N','K-S','K-SC'].every(r=>NB.ENF_STATUS[r]==='LIVE'),NB.ENF_STATUS);
 const v=[{rule:'K-LB',status:'UNCURED'},{rule:'K-G9',status:'UNCURED'},{rule:'K-G4',status:'CURED'}];T('H8 uncured TRIAL items count 0 in drv_uncured',NC.enfUncured(v)===0);
 T('H8 control: an uncured LIVE item still counts',NC.enfUncured(v.concat([{rule:'K-B',status:'UNCURED'}]))===1);
 T('H8 control: a rule not in the table is LIVE',NC.enfUncured([{rule:'K-NEW',status:'UNCURED'}])===1);
 const pp=fs.readFileSync(D+'new/Panel Payloads.js','utf8'),pc=fs.readFileSync(D+'new/Panel Cure Check.js','utf8'),am=fs.readFileSync(D+'new/Alternate Merge.js','utf8'),ap=fs.readFileSync(D+'new/Alternate Payloads.js','utf8');
 T('H8 drv_uncured is set from LIVE items in Panel Payloads, Alternate Payloads, Panel Cure Check and Alternate Merge',/p\.drv_uncured=DRV\.items\.filter\(enfLive\)\.length/.test(pp)&&/p\.drv_uncured=DRV\.items\.filter\(enfLive\)\.length/.test(ap)&&/b\.payload\.drv_uncured=enfUncured\(v\)/.test(pc)&&/b\.payload\.drv_uncured=enfUncured\(v\)/.test(am));
 const rep=NC.cureReport('glm',[{rule:'K-LB',link:'CHALLENGER premise 4',status:'UNCURED',why:'x'}])[0];T('H8 a TRIAL item\'s report line says so (WHY)',/WHY: TRIAL rule/.test(rep),rep.slice(0,200));
 const er=NC.enfRows({run_token:'t',seat:'glm'},[{rule:'K-LB',link:'CHALLENGER premise 4',status:'UNCURED',why:'x'}],{ok:true,text:''},null)[0];T('H8 a TRIAL item\'s enforcer row says so (cure_reason)',/^TRIAL rule/.test(er.cure_reason),er.cure_reason);
 // a TRIAL K-LB item raises no LIVE item's count: K-G6 with a TRIAL K-LB beside it is cured at the K-G6 count alone
 const items=[{rule:'K-G6',side:'CHALLENGER',link:'CHALLENGER premise 2',premise:2,line:'x',conc:0,st:'SELF-SUPPORTED',L:6},{rule:'K-LB',side:'CHALLENGER',link:'CHALLENGER premise 4',premise:4,line:'x',conc:0,st:'SELF-SUPPORTED',L:6}];
 const txt='CORRECTED COUNT: CHALLENGER 1\nCORRECTED STANDING: CHALLENGER PROP-DEPENDENT\nRESPONSE: K-G6 CHALLENGER premise 2 | I count the premise as the mark asks.\nRESPONSE: K-LB CHALLENGER premise 4 | the block shows two kinds in its own words.';
 const nv=NC.cureVerdicts(items,{ok:true,text:txt},null,R93),ov=OC.cureVerdicts(items,{ok:true,text:txt},null,R93);
 T('H8 base: the K-G6 count of 1 is refused because the K-LB premise is added to it',ov[0].status==='UNCURED',ov[0].why);
 T('H8 new: the K-G6 count of 1 is cured; the TRIAL K-LB premise is not added',nv[0].status==='CURED',nv[0].why);}

console.log('\n'+ok+' OK, '+bad+' BAD');process.exitCode=bad?1:0;
