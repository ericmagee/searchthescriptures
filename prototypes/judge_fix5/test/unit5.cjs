// judge_fix5 unit fixtures: every G item, on the node code in new/ (base/ where a contrast is shown). Run: node test/unit5.cjs
const fs=require('fs');const T=require('./runner.cjs');const L=require('./lib5.cjs');const RL=require('./replay_lib.cjs');
let n=0,bad=0;const ok=(name,c,d)=>{n++;if(!c)bad++;console.log((c?'ok  ':'BAD ')+name+(d!==undefined?' | '+(typeof d==='string'?d:JSON.stringify(d)):''));};
const r84=T.run('32284'),r66=T.run('32266'),r55=T.run('32255');
const F_=r=>({cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3,cr4:r.defender_r4||null,dr4:r.challenger_r4||null});
const F84=F_(r84),F66=F_(r66);
const C4P_END='\n return {refs,fresh,of,note,ofD,noteD,renum,noteR,declared,dlinks,cblocks,press,noteP};})();';
const CL=(node)=>T.block('new',node,'const REFP=(()=>',C4P_END,['REFP','C4P']);
const KJV=JSON.parse(fs.readFileSync(T.D+'data/kjv_rows5.json','utf8'));
const KX={};KJV.forEach(x=>KX[x.book+'|'+x.chapter+'|'+x.verse]=x);

console.log('== G5 one reference parser');
{const {REFP}=CL('D4 Extract');const lab=t=>REFP.parse(t,{scoped:true}).map(r=>(r.book||r.ctx||'?')+' '+r.label);
 ok('G5 "Luke 21:26, 35" is two references',JSON.stringify(lab('Luke 21:26, 35'))===JSON.stringify(['Luke 21:26','Luke 21:35']),lab('Luke 21:26, 35'));
 ok('G5 "Isaiah 7:11, 7:14" is two references',JSON.stringify(lab('Isaiah 7:11, 7:14'))===JSON.stringify(['Isaiah 7:11','Isaiah 7:14']),lab('Isaiah 7:11, 7:14'));
 ok('G5 a range keeps its span; a list after it',JSON.stringify(lab('Matthew 1:24-25: x and Luke 2:33, 41'))===JSON.stringify(['Matthew 1:24-25','Luke 2:33','Luke 2:41']),lab('Matthew 1:24-25: x and Luke 2:33, 41'));
 ok('G5 scoped: "(1:24)" after a sentence end names no book',lab('Matthew 1:18 says so. Then (1:24) follows.')[1]==='? 1:24',lab('Matthew 1:18 says so. Then (1:24) follows.'));
 ok('G5 bare reference in the same sentence takes the book',lab('Matthew 1:18 and (1:24)')[1]==='Matthew 1:24');
 // the same parser in every node that carries a reader
 for(const nm of ['Panel Build','Build Independent Verdict','D3 Build','C3 Build','D4 Build','C4 Build','D4 Extract','C4 Extract','Build Save Body','Build Synthesis','Format Markdown','Citation Scan','C1 Extract','Init with Guards','Panel Payloads','Alternate Payloads','Extract Independent Verdict','Panel Cure Check','Alternate Build','Cure Check'])
  {const s=T.src('new',nm);const i=s.indexOf('const REFP=(()=>');const j=s.indexOf(T.REFP_END,i);const blk=s.slice(i,j);ok('G5 REFP identical in '+nm,i>=0&&blk===fs.readFileSync(T.D+'lib/refp.js','utf8').slice(fs.readFileSync(T.D+'lib/refp.js','utf8').indexOf('const REFP=(()=>'),fs.readFileSync(T.D+'lib/refp.js','utf8').indexOf(T.REFP_END)));}
 // new-in-close: Luke 21:35 no longer new
 const B=T.block('base','D4 Extract','const C4P=(()=>','\n return {refs,fresh,of,note,ofD,noteD,renum,noteR};})();',['C4P']).C4P;const {C4P}=CL('D4 Extract');
 ok('G5 32284 new-in-close: base marks Luke 21:35',B.ofD(F84).includes('Luke 21:35'),B.ofD(F84));
 ok('G5 32284 new-in-close: new does not (Luke 1:31, Luke 2:5 stay)',!C4P.ofD(F84).includes('Luke 21:35')&&C4P.ofD(F84).includes('Luke 1:31')&&C4P.ofD(F84).includes('Luke 2:5'),C4P.ofD(F84));
 ok('G5 32284 C4 new-press check: none in either',B.of(F84).length===0&&C4P.of(F84).length===0);
 ok('G5 32266 new-in-close unchanged (5 verses)',JSON.stringify(B.ofD(F66).sort())===JSON.stringify(C4P.ofD(F66).sort()),C4P.ofD(F66));
 // the ledger (PWL) on REFP
 const PW=v=>{const s=T.src(v,'Panel Build');return new Function((v==='new'?s.slice(s.indexOf('const REFP=(()=>'),s.indexOf(T.REFP_END)+T.REFP_END.length):'')+s.slice(s.indexOf('const PWL='),s.indexOf('\nconst LEDGER='))+';return PWL;')();};
 const lb=PW('base').judgeBlock(F84),ln=PW('new').judgeBlock(F84);const ci=t=>(t.match(/^cited in [^\n]*/gm)||[]).map(x=>x.slice(0,140));
 ok('G5 ledger cited-in lines, base',true,ci(lb));ok('G5 ledger cited-in lines, new',true,ci(ln));
 ok('G5 ledger premise lines unchanged on 32284',JSON.stringify(lb.split('\n').filter(l=>/^premise /.test(l)))===JSON.stringify(ln.split('\n').filter(l=>/^premise /.test(l))));
 // K-G4 (cureRefs) and the C-label reader (cRefs) on REFP
 const K=L.lib('new','Panel Cure Check'),Kb=L.lib('base','Panel Cure Check');
 ok('G5 cureRefs: "Luke 21:26, 35" names Luke 21:35',K.cureRefs('Luke 21:26, 35').some(x=>x.key==='Luke 21:35'),K.cureRefs('Luke 21:26, 35').map(x=>x.key));
 ok('G5 cureRefs: "Isaiah 7:11, 7:14" names Isaiah 7:14 (base read 7:14 under a guessed chapter key too)',K.cureRefs('Isaiah 7:11, 7:14').map(x=>x.key).join()==='Isaiah 7:11,Isaiah 7:14',[K.cureRefs('Isaiah 7:11, 7:14').map(x=>x.key),Kb.cureRefs('Isaiah 7:11, 7:14').map(x=>x.key)]);
 ok('G5 kg4Answered finds Luke 21:35 in a "Luke 21:26, 35" round',K.kg4Answered('CHALLENGER','D2 vs C2 (Luke 1:35): CHALLENGER LINK BROKEN -- Luke 21:35 unanswered',[{round:'CR2',q:'x'}],{CR1:'',DR1:'',CR2:'',DR2:'',CR3:'',DR3:'rows at Luke 21:26, 35 show it'}).length===1);
 const Cn=L.chk('new','Panel Payloads');ok('G5 cRefs on REFP',Cn.cRefs('Luke 21:26, 35').map(x=>x.key).join()==='Luke 21:26,Luke 21:35');}

console.log('== G5, G6, G7 citation scan and quote match on 32284');
{const SP={};for(const v of ['base','new'])SP[v]=T.runNode(v,'Citation Scan',{'Final Output':F84})[0].json;
 const rowsFor=j=>{const u=decodeURIComponent(j.url_cited);const out=[];for(const m of u.matchAll(/and\(book\.eq\."([^"]+)",chapter\.eq\.(\d+),verse\.in\.\(([\d,]+)\)\)/g))m[3].split(',').forEach(x=>{const k=m[1]+'|'+m[2]+'|'+x;if(KX[k])out.push(KX[k]);});return out;};
 const QC={};for(const v of ['base','new'])QC[v]=T.runNode(v,'Quote Compare',{'Citation Scan':SP[v],'Cited Verses':rowsFor(SP[v])})[0].json;
 const find=(j,re,side)=>j.items.find(i=>re.test(i.ref)&&(!side||i.side===side));
 ok('G5 scan: base reads "Isaiah 7:11,7"',!!find(SP.base,/^Isaiah 7:11,7$/),find(SP.base,/^Isaiah 7:11/).ref);
 ok('G5 scan: new reads two parts',JSON.stringify(find(SP.new,/^Isaiah 7:11/).parts)==='[{"chapter":7,"v1":11,"v2":11},{"chapter":7,"v1":14,"v2":14}]',find(SP.new,/^Isaiah 7:11/).ref);
 ok('G5 compare: base Isaiah 7:11 item PENDING (later "not in Isaiah")',find(QC.base,/^Isaiah 7:11/).status==='PENDING');
 ok('G5 compare: new Isaiah 7:11, 7:14 MATCHES part by part',find(QC.new,/^Isaiah 7:11/).status==='MATCHES',find(QC.new,/^Isaiah 7:11/).status);
 const m118=j=>j.items.find(i=>/^Matthew 1:18,1/.test(i.ref));ok('G5 "Matthew 1:18, 1:20" no longer read as "Matthew 1:18,1"',m118(SP.base).ref==='Matthew 1:18,1'&&m118(SP.new).ref==='Matthew 1:18,1:20',[m118(SP.base).ref,m118(SP.new).ref,m118(QC.new).status]);
 const cnt=j=>{const c={};j.items.forEach(i=>c[i.status]=(c[i.status]||0)+1);return c;};ok('G5 compare status counts base',true,cnt(QC.base));ok('G5 compare status counts new',true,cnt(QC.new));
 const changed=QC.new.items.filter((i,k)=>{const b=QC.base.items[k];return b&&b.status!==i.status;}).map(i=>i.ref+' '+QC.base.items[QC.new.items.indexOf(i)].status+' -> '+i.status);ok('G5 items whose status moved',true,changed);
 // G7: the hyphen switch
 const i83=find(QC.new,/^Isaiah 8:3$/);ok('G7 switch OFF: Isaiah 8:3 "Maher-shalal-hash-baz" not matched',i83.status==='PENDING',i83.status);
 ok('G7 Quote Compare carries the switch, default false',/const HYPHEN_JOIN=false;/.test(T.src('new','Quote Compare')));
 {const s=T.src('new','Quote Compare').replace('const HYPHEN_JOIN=false;','const HYPHEN_JOIN=true;');fs.mkdirSync(T.D+'test/tmp',{recursive:true});fs.mkdirSync(T.D+'test/tmp/new',{recursive:true});fs.writeFileSync(T.D+'test/tmp/new/Quote Compare.js',s);
  const q=T.runNode('test/tmp/new','Quote Compare',{'Citation Scan':SP.new,'Cited Verses':rowsFor(SP.new)})[0].json;const x=find(q,/^Isaiah 8:3$/);ok('G7 switch ON: Isaiah 8:3 MATCHES',x.status==='MATCHES',x.status);
  ok('G7 switch ON changes nothing else',q.items.filter((i,k)=>i.status!==QC.new.items[k].status).length===1);}
 // Quote Report: Esther 2:7 still differs; the Isaiah 7:11 item is no longer reported
 const QR=v=>T.runNode(v,'Quote Report',{'Quote Compare':QC[v],'Find Words':[]})[0].json;const rb=QR('base'),rn=QR('new');
 const badl=j=>j.items.filter(i=>!/^MATCHES/.test(i.status)&&i.status!=='NOT CHECKED').map(i=>i.side[0]+i.round+' '+i.ref+': '+i.status);
 ok('G5 report non-matches, base (Find Words empty here)',true,badl(rb));ok('G5 report non-matches, new',!badl(rn).some(x=>/Isaiah 7:11/.test(x)),badl(rn));
 // G6: escapes, in the scan and the pre-check
 const tE='The text: \\"This is a correction of the term \\"father.\\"\\" (Luke 2:48).';
 const SPe=T.runNode('new','Citation Scan',{'Final Output':{...F84,gr2:F84.gr2+'\n'+tE}})[0].json;ok('G6 scan reads a \\" quotation as a quotation',SPe.items.length>=SP.new.items.length);
 const pre=v=>{const s=T.src(v,'Panel Build');return new Function(s.slice(s.indexOf('function preCheckSide('),s.indexOf('function preCheckBlock('))+';return preCheckSide;')();};
 const pb=pre('base')(F84.gr2,[F84.cr1,F84.cr2],'CHALLENGER LIST [DR2]'),pn=pre('new')(F84.gr2,[F84.cr1,F84.cr2],'CHALLENGER LIST [DR2]');
 ok('G6 pre-check base: item 4 "no verbatim quote found"',/no verbatim quote found/.test(pb[3]),pb[3]);ok('G6 pre-check new: item 4 quote found',!/no verbatim quote found/.test(pn[3]),pn[3].slice(0,160));
 fs.writeFileSync(T.D+'test/cite5_items.json',JSON.stringify({base:badl(rb),new:badl(rn),moved:changed},null,1));}

console.log('== G1 declared chain to the closes; numbering check');
{const {C4P}=CL('D4 Extract');const B=T.block('base','D4 Extract','const C4P=(()=>','\n return {refs,fresh,of,note,ofD,noteD,renum,noteR};})();',['C4P']).C4P;
 for(const [nm,F] of [['32284',F84],['32266',F66]])for(const sd of ['D','C']){const b=B.renum(F,sd),x=C4P.renum(F,sd);ok('G1 '+nm+' '+sd+'4 numbering flag: base '+b.length+' item(s), new '+x.length,x.length>0,x.map(s=>s.slice(0,110)));}
 ok('G1 the note says the close numbering does not govern',/the close round's numbering does not govern/.test(C4P.noteR(F84,'D')));
 const base={'Init Seats':{run_token:'T',dpos:'the standard reading',cpos:"the record's reading",topic:r84.topic||'Did Christ have a biological father?'},'Init with Guards':{topic:'Did Christ have a biological father?',dsys:'SYS',csys:'SYS',lab:{D:'DEFENDER',C:'CHALLENGER'}},
  'Resolve Seats':{defender:{fam:'openrouter',model:'anthropic/claude-sonnet-5.5',tok:64000},challenger:{fam:'openrouter',model:'xiaomi/mimo-v2.6-pro',tok:64000}},
  'D1 Extract':{raw:F84.cr1},'C1 Extract':{raw:F84.gr1},'D2 Extract':{raw:F84.cr2},'C2 Extract':{raw:F84.gr2},'D3 Extract':{raw:F84.cr3},'C3 Extract':{raw:F84.dr3},'D4 Extract':{raw:F84.cr4}};
 const msg=o=>{const b=o[0].json.call.body||o[0].json.call;const ms=b.messages||[];const u=ms.filter(m=>m.role==='user').pop();return typeof u.content==='string'?u.content:u.content.map(p=>p.text).join('');};
 const d4b=msg(T.runNode('base','D4 Build',base)),d4n=msg(T.runNode('new','D4 Build',base));
 ok('G1 D4 request: base has no declared chain text',!/1\. The conception is stated to be "of the Holy Ghost"/.test(d4b));
 ok('G1 D4 request: new carries the declared chain verbatim and the instruction',d4n.includes(C4P.declared(F84))&&/Keep these numbers in this round: D<n> is link n/.test(d4n));
 ok('G1 D4 request: new carries the C list',/C6 = \[DR3\] LINK 6: NARROWED TO/.test(d4n));
 const c4n=msg(T.runNode('new','C4 Build',base));ok('G1 C4 request: new carries the C list with the instruction',/YOUR C NUMBERS -- the LINK blocks of your round 3 link round[^\n]*Keep these numbers/.test(c4n)&&/C1 = \[DR3\] LINK 1: SUPPORTED/.test(c4n));
 ok('G1 C4 request carries the declared chain (D numbers)',c4n.includes(C4P.declared(F84)));
 fs.writeFileSync(T.D+'test/d4_request_new.txt',d4n);}

console.log('== G3 close-round grading check');
{const {C4P}=CL('Panel Build');const pd=C4P.press(F84,'D'),pc=C4P.press(F84,'C');
 ok('G3 32284 defender close: graded sentences found',pd.length>=4&&pd.some(x=>/own measure/.test(x.s))&&pd.some(x=>/offered no reading/.test(x.s)),pd.map(x=>x.why+': '+x.s.slice(0,70)));
 ok('G3 32284 challenger close: graded sentences found',pc.some(x=>/D1 is refused/.test(x.s))&&pc.some(x=>/each stand on an inference/.test(x.s)),pc.map(x=>x.why+': '+x.s.slice(0,70)));
 ok('G3 ANSWER lines are not read',!pd.some(x=>/^\**ANSWER:/.test(x.s)));
 ok('G3 32266 closes: none flagged',C4P.press(F66,'D').length===0&&C4P.press(F66,'C').length===0);
 ok('G3 note printed beside both closes (DISREGARDED)',/DISREGARDED/.test(C4P.noteP(F84,'D'))&&/DISREGARDED/.test(C4P.noteP(F84,'C')));
 for(const nm of ['Panel Build','Build Independent Verdict','Build Synthesis','Format Markdown'])ok('G3 '+nm+' prints noteP beside [CR4] and [DR4]',(T.src('new',nm).match(/C4P\.noteP\(/g)||[]).length===2);
 const fx=T.runNode('new','D4 Extract',{'Init Seats':{run_token:'T'},'D4 Build':{call:{fam:'openrouter',model:'m'}},'Init with Guards':{lab:{D:'DEFENDER'}},'D1 Extract':{raw:F84.cr1},'C1 Extract':{raw:F84.gr1},'D2 Extract':{raw:F84.cr2},'C2 Extract':{raw:F84.gr2},'D3 Extract':{raw:F84.cr3},'C3 Extract':{raw:F84.dr3}},{choices:[{message:{content:F84.cr4},finish_reason:'stop'}],usage:{}})[0].json;
 ok('G3 D4 Extract records graded sentences and renumbering',fx.graded.length===pd.length&&fx.renumbered.length>=1,[fx.graded.length,fx.renumbered.length,fx.new_in_close]);}

console.log('== G2 K-G9: the cited-in line ruled; G13 K-LB');
{const Cn=L.chk('new','Panel Payloads');const PW=(()=>{const s=T.src('new','Panel Build');return new Function(s.slice(s.indexOf('const REFP=(()=>'),s.indexOf(T.REFP_END)+T.REFP_END.length)+s.slice(s.indexOf('const PWL='),s.indexOf('\nconst LEDGER='))+';return PWL;')();})();
 const T84=[['[CR1] DEFENDER R1',F84.cr1],['[DR1] CHALLENGER R1',F84.gr1],['[CR2] DEFENDER R2',F84.cr2],['[DR2] CHALLENGER R2',F84.gr2],['[CR3] DEFENDER R3 -- LINK ROUND',F84.cr3],['[DR3] CHALLENGER R3 -- LINK ROUND',F84.dr3],['[CR4] DEFENDER R4 -- CLOSE ROUND',F84.cr4],['[DR4] CHALLENGER R4 -- CLOSE ROUND',F84.dr4]];
 const PT='RULES\n\n'+PW.judgeBlock(F84)+'\nDEBATE TRANSCRIPT'+T84.map(x=>'\n\n=== '+x[0]+' ===\n'+x[1]).join('');const LN={DEFENDER:Cn.drvLedgerN(PT,'DEFENDER'),CHALLENGER:Cn.drvLedgerN(PT,'CHALLENGER')};
 const lg=(PT.match(/^cited in [^\n]*/gm)||[]);ok('G2 the ledger lists against the challenger',/\((\d+) of (\d+)\)/.test(lg[1]),lg.map(x=>x.slice(0,120)));
 const J={};r84.judgments.forEach(j=>{const s=String(j.verdict_raw);const a=s.indexOf('{');let d=0,q=false,e=s.length;for(let i=a;i<s.length;i++){const c=s[i];if(q){if(c==='\\')i++;else if(c==='"')q=false;continue;}if(c==='"')q=true;else if(c==='{')d++;else if(c==='}'&&--d===0){e=i+1;break;}}J[j.judge_seat]=RL.judgment(s.slice(0,e),true);});
 const ci=(seat,txt)=>{const f=J[seat].fields;return Cn.drvCited(txt==null?J[seat].text:txt,PT,f.conceded_links,f.challenger_conceded_links,f.defense_standing,f.challenge_standing,LN);};
 for(const s of ['chatgpt','gemini','glm']){const x=ci(s);ok('G2 32284 '+s+' as stored: K-G9 fires (no ruling lines)',x.items.length===1&&x.items[0].side==='CHALLENGER'&&x.items[0].missing.length>0,x.items.map(i=>i.link+' missing '+i.missing.length+' uncounted '+i.uncounted.length));}
 const labs=(PT.match(/^cited in [^\n]*not named in a later round of the challenger[^\n]*\(\d+ of \d+\):\s*([^\n]*)$/m)||[])[1].split(/,\s+(?=(?:[1-3]\s)?[A-Z])/);
 const Q="So Luke's line can be Joseph's line by marriage into Heli's house, and the register's silence on women proves nothing against Mary's descent";
 const rulings=labs.map(l=>l==='Luke 3:31'?'PRESSED: Luke 3:31 -- [CR2] -- "'+Q+'" -- UNANSWERED':'NOT PRESSED: '+l).join('\n');
 ok('G2 Luke 3:31 is on the list',labs.includes('Luke 3:31'));
 const cg=ci('chatgpt',J.chatgpt.text+'\nCITED-IN RULINGS\n'+rulings);ok("G2 ChatGPT's count with the rulings: no item (its count of 3 names Luke 3:31)",cg.items.length===0,cg.items.map(i=>i.line.slice(0,140)));
 const gm=ci('gemini',J.gemini.text+'\nCITED-IN RULINGS\n'+rulings);ok("G2 Gemini with the same rulings: K-G9 for the uncounted Luke 3:31",gm.items.length===1&&gm.items[0].uncounted.join()==='Luke 3:31'&&gm.items[0].missing.length===0,gm.items.map(i=>i.line.slice(0,160)));
 const gl=ci('glm',J.glm.text+'\nCITED-IN RULINGS\n'+rulings.replace(Q,'So the register proves Joseph begat him'));ok('G2 a PRESSED quotation not found in the round named is no ruling',gl.items.length===1&&gl.items[0].missing.includes('Luke 3:31'),gl.items.map(i=>i.line.slice(0,200)));
 const ga=ci('glm',J.glm.text+'\nCITED-IN RULINGS\n'+rulings.replace('-- UNANSWERED','-- ANSWERED IN [DR3]'));ok('G2 ANSWERED IN a round that does not name the verse is no ruling (ruling 376)',ga.items.length===1&&/does not name Luke 3:31/.test(ga.items[0].line),ga.items[0]&&ga.items[0].line.slice(-160));
 const gw=ci('glm',J.glm.text+'\nCITED-IN RULINGS\n'+rulings.replace('[CR2]','[DR2]'));ok('G2 a round that does not press that side is no ruling',gw.items.length===1&&/does not press the challenger/.test(gw.items[0].line));
 const gp=ci('glm',J.glm.text+'\nCITED-IN RULINGS\n'+rulings.split('\n').slice(0,10).join('\n'));ok('G2 partial rulings: the rest listed as missing',gp.items.length===1&&gp.items[0].missing.length===labs.length-10);
 // the cure: Gemini's item cured by its count, and the recompute moves its RESULT
 const K=L.lib('new','Panel Cure Check');const R=RL.rounds(r84);const it=gm.items;const f=J.gemini.fields;
 const resp='RESPONSE: K-G9 CHALLENGER CITED-IN | I accept the mark: [CR2] presses Luke 3:31 with "'+Q+'" and no challenger round names it.';
 const rep1={ok:true,text:'PRESSED: Luke 3:31 -- [CR2] -- "'+Q+'" -- UNANSWERED\nCORRECTED COUNT: CHALLENGER 1\nCORRECTED STANDING: CHALLENGER PROP-DEPENDENT\n'+resp};
 const v1=K.cureVerdicts(it,rep1,K.cureBroken(J.gemini.text),R);ok('G2 cure: counted under ruling 372 is CURED',v1[0].status==='CURED',v1[0].why);
 const cs=K.cureSet(rep1,v1);ok('G2 cure: the count is written to the seat (cureSet)',cs&&cs.CHALLENGER&&cs.CHALLENGER.n===1,cs);
 const F0={verdict_tag:'HELD',defense_standing:f.defense_standing,conceded_links:f.conceded_links,challenge_standing:f.challenge_standing,challenger_conceded_links:f.challenger_conceded_links};
 const rc=K.cureRecompute('gemini',J.gemini.text,F0,it,v1,rep1);ok('G2 recompute: Gemini HELD with the challenge PROP-DEPENDENT gives DEFENDER WINS',rc&&rc.fields.challenge_standing==='PROP-DEPENDENT'&&rc.result==='DEFENDER WINS',rc&&{fields:rc.fields,result:rc.result});
 const v2=K.cureVerdicts(it,{ok:true,text:'PRESSED: Luke 3:31 -- [CR2] -- "'+Q+'" -- UNANSWERED\n'+resp},K.cureBroken(J.gemini.text),R);ok('G2 cure without a count stays UNCURED',v2[0].status==='UNCURED',v2[0].why);
 const v3=K.cureVerdicts(it,{ok:true,text:'NOT PRESSED: Luke 3:31\n'+resp},K.cureBroken(J.gemini.text),R);ok('G2 cure by re-ruling NOT PRESSED is CURED',v3[0].status==='CURED',v3[0].why);
 const v4=K.cureVerdicts(it,{ok:true,text:'NOT PRESSED: Luke 3:31\n'},K.cureBroken(J.gemini.text),R);ok('G2 cure with no RESPONSE stays UNCURED',v4[0].status==='UNCURED',v4[0].why);
 const sil=ci('glm');const v5=K.cureVerdicts(sil.items,{ok:true,text:rulings+'\nCORRECTED COUNT: CHALLENGER 1\nCORRECTED STANDING: CHALLENGER PROP-DEPENDENT\n'+resp},K.cureBroken(J.glm.text),R);ok("G2 GLM's silence cured by all rulings and a count",v5[0].status==='CURED',v5[0].why);
 const v6=K.cureVerdicts(sil.items,{ok:true,text:rulings.split('\n').slice(1).join('\n')+'\n'+resp},K.cureBroken(J.glm.text),R);ok('G2 a ruling missing in the cure keeps it UNCURED',v6[0].status==='UNCURED',v6[0].why);
 const ask=K.cureAsk(gm.items,{});ok('G2 cure request carries the K-G9 rule and the ruling form',/K-G9 \(the PRESSED-WITNESS LEDGER/.test(ask)&&/NOT PRESSED: <book chapter:verse>/.test(ask));
 ok('G2 judge prompt (Panel Build) requires CITED-IN RULINGS; BIV too',/CITED-IN RULINGS \(md_notes_rulings 372 and 373\)/.test(T.src('new','Panel Build'))&&/CITED-IN RULINGS \(md_notes_rulings 372 and 373\)/.test(T.src('new','Build Independent Verdict')));
 // G13 K-LB
 for(const s of ['chatgpt','gemini','glm']){const f=J[s].fields;const x=Cn.drvBlocks(J[s].text,PT,f.conceded_links,f.challenger_conceded_links,f.defense_standing,f.challenge_standing,{DEFENDER:f.counted_premises_defender,CHALLENGER:f.counted_premises_challenger},LN);
  ok('G13 32284 '+s+' K-LB items (counted_premises '+JSON.stringify([f.counted_premises_defender,f.counted_premises_challenger])+')',true,x.items.map(i=>i.link+': '+i.line.slice(0,90)));}
 const KL=Cn.drvBlocks(J.gemini.text,PT,0,0,'SELF-SUPPORTED','SELF-SUPPORTED',null,LN).items;
 ok('G13 at count 0: DR3 LINK 6 (one layer) and CR3 LINK 5 (one layer) marked',KL.some(i=>i.link==='CHALLENGER premise 6')&&KL.some(i=>i.link==='DEFENDER premise 5'),KL.map(i=>i.link));
 const xs=KL.filter(i=>i.side==='CHALLENGER');const v7=K.cureVerdicts(xs,{ok:true,text:'CORRECTED COUNT: CHALLENGER 1\nCORRECTED STANDING: CHALLENGER PROP-DEPENDENT\nRESPONSE: K-LB CHALLENGER premise 6 | I accept: [DR3] LINK 6 exhibits only the [L1] rows "Jechonias begat Salathiel".'},K.cureBroken(J.gemini.text),R);
 ok('G13 K-LB cured by counting it',v7[0].status==='CURED',v7[0].why);
 const v8=K.cureVerdicts(xs,{ok:true,text:'STATEMENT: K-LB CHALLENGER premise 6 | [L1] "And after they were brought to Babylon, Jechonias begat Salathiel" [L3] Matthew 1:11 names the other row.\nRESPONSE: K-LB CHALLENGER premise 6 | The block shows two kinds, [DR3] quotes "Jechonias begat Salathiel".'},K.cureBroken(J.gemini.text),R);
 ok('G13 K-LB cured by a statement quoting [DR3] with two layer kinds',v8[0].status==='CURED',v8[0].why);
 ok('G13 rule text in every copy',[['Panel Build',2],['Build Independent Verdict',2],['Format Markdown',1]].every(([nm,c])=>(T.src('new',nm).match(/or exhibited fewer than two prior layers \(the burden rule, the same in every round/g)||[]).length===c));}

console.log('== G4 reserve line; G9 retry');
{const pc=(raw,retry)=>{const map={'Init Seats':{run_token:'T',dry:false},'Panel Build':{judges:[{seat:'deepseek',api_model:'deepseek-flash'},{seat:'gemini'},{seat:'glm'}]},'Resolve Seats':{reserve:{seat:'chatgpt'}},
   'Panel Judge 1 deepseek':raw,'Panel Judge 2 openrouter':{choices:[{message:{content:'{"verdict_tag":"HELD","defense_standing":"SELF-SUPPORTED","challenge_standing":"SELF-SUPPORTED","conceded_links":0,"challenger_conceded_links":0}'}}]},
   'Panel Judge 3 openrouter':{choices:[{message:{content:'{"verdict_tag":"HELD","defense_standing":"SELF-SUPPORTED","challenge_standing":"SELF-SUPPORTED","conceded_links":0,"challenger_conceded_links":0}'}}]}};if(retry!==undefined)map['Panel Judge 1 deepseek retry']=retry;return map;};
 const e1=T.runNode('new','Panel Check',pc({choices:[{message:{content:''},finish_reason:'stop'}]}))[0].json.sub;ok('G4 empty content: reason "empty reply", body 0',e1.reason==='empty reply'&&e1.body_chars===0&&e1.failure_kind==='no_usable_judgment',e1);
 const e2=T.runNode('new','Panel Check',pc({error:{message:'Request failed with status code 502',httpCode:'502'}}))[0].json.sub;ok('G4 error: HTTP status recorded',e2.reason==='error'&&String(e2.http_status)==='502',e2);
 const e3=T.runNode('new','Panel Check',pc({choices:[{message:{content:'not json at all'}}]}))[0].json.sub;ok('G4 unreadable',e3.reason==='unreadable',e3.reason);
 const e4=T.runNode('new','Panel Check',pc({choices:[{message:{content:''}}]},{choices:[{message:{content:''}}]}))[0].json.sub;ok('G9 the retry ran and was empty too: its reply is read, retried recorded',e4&&e4.retried===true&&e4.reason==='empty reply',e4);
 const e5=T.runNode('new','Panel Check',pc({choices:[{message:{content:''}}]},{choices:[{message:{content:'{"verdict_tag":"HELD","defense_standing":"SELF-SUPPORTED","challenge_standing":"SELF-SUPPORTED","conceded_links":0,"challenger_conceded_links":0}'}}]}))[0].json.sub;ok('G9 the retry answered: no substitution',e5===null);
 const G=new Function(T.src('new','Format Markdown').match(/const g4Line=[\s\S]*?judged in its place\.';\};/)[0]+';return g4Line;')();
 ok('G4 the line for 32284 (stored substitution)',/DeepSeek|deepseek/.test(G(r84.panel_substitution))&&/empty reply/.test(G(r84.panel_substitution)),G(r84.panel_substitution,x=>({deepseek:'DeepSeek',chatgpt:'ChatGPT',glm:'GLM'})[x]||x));
 ok('G4 the line for 32255 (GLM, unrecognised envelope)',/unreadable/.test(G({failed_seat:'glm',substitute:'chatgpt',failure_kind:'no_usable_judgment',detail:'FAIL-CLOSED: seat "glm" returned an envelope this parser does not recognise.'})));
 // G9 IF expression
 const fl=JSON.parse(fs.readFileSync(T.D+'flow/nodes.json','utf8'));const ifn=fl.add_nodes.find(x=>x.name==='Panel Judge 1 Empty?');const ex=ifn.parameters.conditions.conditions[0].leftValue.replace(/^=\{\{|\}\}$/g,'');
 const ev=j=>new Function('$json','return '+ex)(j);ok('G9 IF: empty content -> retry',ev({choices:[{message:{content:''}}]})===true);ok('G9 IF: empty body -> retry',ev({})===true);
 ok('G9 IF: an error -> no retry',ev({error:{message:'timeout'}})===false);ok('G9 IF: an answer -> no retry',ev({choices:[{message:{content:'{"a":1}'}}]})===false);
 const rt=fl.add_nodes.find(x=>x.name==='Panel Judge 1 deepseek retry');const wf=JSON.parse(fs.readFileSync(T.D+'data/workflow_live.json','utf8'));const d1=wf.nodes.find(x=>x.name==='Panel Judge 1 deepseek');
 ok('G9 the retry node sends the same request body (same parameters and credential)',JSON.stringify(rt.parameters)===JSON.stringify(d1.parameters)&&JSON.stringify(rt.credentials)===JSON.stringify(d1.credentials)&&rt.onError===d1.onError);}

console.log('== G8 transcript header');
{const s=T.src('new','Format Markdown');const blk=s.match(/\{const pv=r\.panel_verdict,oc=r\.outcome[\s\S]*?\\n\\n';\}\n/)[0];const H=r=>{let t='';new Function('r','t',blk.replace(/t \+=/g,'t+=')+';return t;');return new Function('r',"let t='';"+blk+';return t;')(r);};
 ok('G8 32284: outcome first, with the computed line',H(r84)==="**Outcome:** UNDERDETERMINED. The defender's chain held (3-0); the challenger's chain also stood for two judges, so the question is left open.\n\n",H(r84));
 ok('G8 HELD and DEFENDER PREVAILS: no explanation',H({panel_verdict:'HELD',outcome:'DEFENDER PREVAILS',panel_split:'3-0'})==='**Outcome:** DEFENDER PREVAILS\n\n');
 ok('G8 32255 (CONTESTED)',/no majority verdict \(1-1 \(1 not counted: debate rule\)\); the outcome goes to review/.test(H({panel_verdict:'CONTESTED',outcome:'UNGRADED — REVIEW',panel_split:'1-1 (1 not counted: debate rule)'})),H({panel_verdict:'CONTESTED',outcome:'UNGRADED — REVIEW',panel_split:'1-1 (1 not counted: debate rule)'}));
 ok('G8 a citation block',/but DEFENDER would prevail/.test(H({panel_verdict:'HELD',outcome:'UNGRADED — REVIEW',panel_split:'3-0',citation_block:'DEFENDER would prevail on load-bearing quotation(s) ...'})));
 ok('G8 placed before the Topic line',s.indexOf("t += '**Outcome:** '")<s.indexOf("t += '**Topic:** '"));}

console.log('== G10 synthesis checks; chain marks');
{const s=T.src('new','Build Save Body');const a=s.indexOf('{const SY=String(d.synthesis');const b=s.indexOf("SX.forEach(x=>FF.push('[AUDIT v23: SYNTHESIS CHECK '+x+'. REVIEW THIS ROW.]'));}",a)+"SX.forEach(x=>FF.push('[AUDIT v23: SYNTHESIS CHECK '+x+'. REVIEW THIS ROW.]'));}".length;
 const {C4P}=CL('Build Save Body');const run=(d)=>{const FF=[];new Function('d','FF','C4P',s.slice(a,b))(d,FF,C4P);return FF;};
 const d={...F84,synthesis:r84.synthesis};const out=run(d);const sd=out.filter(x=>/\(S-D\)/.test(x)),sf=out.filter(x=>/\(S-F\)/.test(x));
 ok('G10 32284 synthesis: S-D reads the CONFIRMATION paragraph',sd.length>=1,sd.map(x=>x.slice(0,200)));
 ok('G10 32284 synthesis: S-F reads "pressed nothing new"',sf.length>=1,sf.map(x=>x.slice(0,220)));
 const o2=run({...d,synthesis:'The guards should bind the defender as well.\nThe challenger\'s close pressed nothing new.'});ok('G10 fixtures: "should bind the defender" and "pressed nothing new"',o2.some(x=>/\(S-D\)/.test(x))&&o2.some(x=>/\(S-F\)/.test(x)));
 const o3=run({...F66,synthesis:"The challenger's close pressed nothing new."});ok('G10 no S-F when no press was found (32266)',!o3.some(x=>/\(S-F\)/.test(x)));
 ok('G10 S-checks printed through S-F in the transcript',/SYNTHESIS CHECK \\\(\(S-\[A-F\]\)\\\)/.test(T.src('new','Format Markdown')));
 const sql=fs.readFileSync(T.D+'sql/derive_debate_outcome_g10.sql','utf8');ok('G10 sql: chain marks at the first stamp from the counted seats',/defender_chain_mark\s+= CASE WHEN panel_verdict IS NULL THEN v_dcm/.test(sql)&&/challenger_chain_mark = CASE WHEN panel_verdict IS NULL THEN v_ccm/.test(sql));}

console.log('== G11 verse sheet');
{const S=T.block('new','D4 Extract','const REFP=(()=>','\n return {req,url,plan,text,CAP_V,CAP_C};})();',['SHEET']).SHEET;
 const R=[F84.cr1,F84.gr1,F84.cr2,F84.gr2,F84.cr3,F84.dr3,F84.cr4];const names=['D2','C2','D3','C3','D4','C4'];const rowsOf=keys=>keys.map(k=>{const m=k.match(/^(.+) (\d+):(\d+)$/);return KX[m[1]+'|'+m[2]+'|'+m[3]];}).filter(Boolean);
 const tab=[];for(let k=0;k<names.length;k++){const P=S.plan(R.slice(0,k+2));const txt=S.text(rowsOf(P.sheet_req),P,'the KJV text of every verse cited so far.');tab.push(names[k]+': '+P.sheet_req.length+' verses requested, URL '+P.sheet_url.length+' chars, sheet '+txt.length+' chars, about '+Math.round(txt.length/4)+' tokens'+(/LEFT OFF/.test(txt)?' | '+txt.slice(txt.indexOf('LEFT OFF')).slice(0,160):''));}
 ok('G11 sheet per round on 32284 (cap '+S.CAP_V+' verses / '+S.CAP_C+' chars)',true,tab);
 const P=S.plan([F84.cr1]);const t=S.text(rowsOf(P.sheet_req),P,'h');ok('G11 italics and margins kept as stored',/Matthew 1:20 [^\n]*\[conceived: Gr\. begotten\]/.test(t));
 ok('G11 cap: a verse over the cap is listed',/over the cap/.test(S.text(Array.from({length:200},(_,i)=>({book:'Psalms',chapter:119,verse:i+1,text:'x'.repeat(50)})),{sheet_req:Array.from({length:200},(_,i)=>'Psalms 119:'+(i+1))},'h')));
 const base={'Init Seats':{run_token:'T',dpos:'d',cpos:'c'},'Init with Guards':{topic:'t',dsys:'S',csys:'S',lab:{D:'D',C:'C'},sheet_req:[],sheet_off_url:[],sheet_req_c1:[],sheet_off_url_c1:[]},'Resolve Seats':{defender:{fam:'openrouter',model:'anthropic/claude-sonnet-5.5',tok:64000},challenger:{fam:'openrouter',model:'xiaomi/mimo-v2.6-pro',tok:64000}},
  'D1 Build':{opening_user:'DEBATE TOPIC: t'},'D1 Extract':{raw:F84.cr1},'C1 Extract':{raw:F84.gr1,...S.plan([F84.cr1,F84.gr1])},'D2 Extract':{raw:F84.cr2},'C2 Extract':{raw:F84.gr2},'D3 Extract':{raw:F84.cr3},'C3 Extract':{raw:F84.dr3},'D4 Extract':{raw:F84.cr4}};
 base['D2 Verse Sheet']=rowsOf(base['C1 Extract'].sheet_req);const o=T.runNode('new','D2 Build',base)[0].json;const ms=(o.call.body||o.call).messages;const u=ms.filter(m=>m.role==='user').pop();const c=typeof u.content==='string'?u.content:u.content.map(p=>p.text).join('');
 ok('G11 D2 Build appends the VERSE SHEET to its last user message',/VERSE SHEET -- the KJV text of every verse cited so far/.test(c)&&/Matthew 1:18 Now the birth of Jesus Christ/.test(c),c.length);
 const o1=T.runNode('new','D1 Build',{...base,'D1 Verse Sheet':[{}]})[0].json;const c1=(o1.call.body||o1.call).messages.filter(m=>m.role==='user').pop();ok('G11 D1 with no served rows: no sheet',!/VERSE SHEET/.test(typeof c1.content==='string'?c1.content:JSON.stringify(c1.content)));
 const ig=T.src('new','Init with Guards');ok('G11 Init with Guards plans the Oracle seat\'s round-1 sheet from its served rows',/const __D1=S\.defender\.profile==='oracle'\?__SV:__NO,__C1=S\.challenger\.profile==='oracle'\?__SV:__NO;/.test(ig));
 const fl=JSON.parse(fs.readFileSync(T.D+'flow/nodes.json','utf8'));ok('G11 eight Verse Sheet nodes, always output, error continues',fl.add_nodes.filter(x=>/Verse Sheet$/.test(x.name)&&x.alwaysOutputData===true&&x.onError==='continueRegularOutput').length===8);
 fs.writeFileSync(T.D+'test/sheet5_out.txt',tab.join('\n'));}

console.log('== G12 DeepSeek off the panel');
{const E=['claude','chatgpt','gemini','grok','mimo','glm','qwen','deepseek'];const out=[];const FAM={chatgpt:'openai',sol:'openai',gemini:'google',glm:'zhipu',grok:'xai',mimo:'xiaomi',qwen:'qwen',deepseek:'deepseek',claude:'anthropic'};
 const run=(v,d,c)=>{try{return T.runNode(v,'Init Seats',{},{body:{topic:'t',defender:{engine:d,profile:'plain'},challenger:{engine:c,profile:'oracle'}}})[0].json;}catch(e){return {err:String(e.message).slice(0,140)};}};
 let lost=[];for(let i=0;i<E.length;i++)for(let j=0;j<E.length;j++){if(i===j)continue;const d=E[i],c=E[j];const b=run('base',d,c),x=run('new',d,c);const alt=y=>(y.alt_order||[]).filter(s=>FAM[s]!==FAM[d]&&FAM[s]!==FAM[c]);
  const line=d+' v '+c+': base panel '+(b.panel_order||[b.err]).join(',')+' reserve '+(b.panel_reserve||'none')+' alt '+(alt(b).join(',')||'none')+' single '+b.single_judge+' | new panel '+(x.panel_order||[x.err]).join(',')+' reserve '+(x.panel_reserve||'none')+' alt '+(alt(x).join(',')||'none')+' single '+x.single_judge;
  out.push(line);if(x.err||!x.panel_order||x.panel_order.length!==3)lost.push(d+' v '+c);}
 ok('G12 all '+out.length+' pairings seat three panel judges',out.length===56&&lost.length===0,lost);
 const nw=l=>l.split('| ')[1];ok('G12 qwen and deepseek on no panel, reserve or alternate list (new)',out.every(l=>!/(?:panel|reserve|alt) [^ ]*(?:qwen|deepseek)/.test(nw(l).replace(/ single \w+$/,''))));
 ok('G12 sol never judges beside chatgpt debating',out.filter(l=>/chatgpt/.test(l.split(':')[0])).every(l=>!/sol/.test(nw(l).replace(/ single \w+$/,''))));
 ok('G12 DeepSeek on no panel, reserve or alternate list; still the single judge when free',out.every(l=>!/new panel [^|]*deepseek/.test(l.split('| ')[1].split(' single')[0]))&&/single deepseek$/.test(out.find(l=>l.startsWith('claude v mimo'))),out.find(l=>l.startsWith('claude v mimo')));
 fs.writeFileSync(T.D+'test/pairings5_out.txt',out.join('\n'));}

console.log('\n'+n+' fixtures, '+bad+' bad');process.exitCode=bad?1:0;
