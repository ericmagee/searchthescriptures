// judge_fix8 unit fixtures: K1 (the rule text in every copy), K2 (K-G9 retired; the K-G10 check and its cure), K3 (the D4 close list).
const fs=require('fs');const L=require('./lib8.cjs');const RL=require('./replay_lib.cjs');const RN=require('./runner.cjs');const R8=require('./replay8.cjs');
const D=__dirname+'/../';const src=(v,n)=>fs.readFileSync(D+v+'/'+n+'.js','utf8');
let bad=0,n=0;const ok=(c,what,extra)=>{n++;if(!c)bad++;console.log((c?'ok  ':'BAD ')+what+(extra!==undefined?' -- '+extra:''));};
const has=(v,nm,t)=>src(v,nm).includes(t);const cnt=(v,nm,t)=>src(v,nm).split(t).length-1;
const CURE=['Alternate Build','Alternate Cure Build','Alternate Cure Normalize','Alternate Merge','Cure Build','Cure Check','Cure Normalize','Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Panel Cure Check','Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3'];
const CHECK=['Panel Payloads','Alternate Payloads','Extract Independent Verdict'];

console.log('== K1: the rule text');
for(const nm of ['Panel Build','Build Independent Verdict']){
 ok(has('new',nm,'UNANSWERED WITNESS: a pressed witness is a verse the other side carries under PRESSED WITH: beside a premise of its listed premises'),nm+': UNANSWERED WITNESS defines the witness by PRESSED WITH');
 ok(!has('new',nm,'a verse the other side quoted against a link or a listed premise'),nm+': the old "quoted against a link or a listed premise" is gone');
 ok(has('new',nm,'A PRESS NEEDS A PREMISE (md_notes_rulings 392): a press must have a premise behind it; a verse pressed without one is not a witness.'),nm+': ruling 392 stated');
 ok(has('new',nm,'the UNANSWERED WITNESS rule and ruling 372 apply to it and to no other verse'),nm+': UNANSWERED WITNESS and 372 limited to PRESSED WITH verses');
 ok(has('new',nm,'The \\"cited in\\" lines are informational and are not a list of witnesses.')||has('new',nm,'The "cited in" lines are informational and are not a list of witnesses.'),nm+': judges told the cited-in lines are not a list of witnesses');
 ok(!has('new',nm,"counts as an unanswered witness only when the judge quotes"),nm+': the old cited-in witness clause is gone');
 ok(cnt('new',nm,'md_notes_rulings 392: a verse carried under no listed premise')===2,nm+': both UNEXHIBITED clauses carry ruling 392');
 ok(has('new',nm,'the line is informational and is not a list of witnesses (md_notes_rulings 392)'),nm+': the ledger header calls the cited-in line informational');
 ok(!has('new',nm,'For EVERY verse each line of the PRESSED-WITNESS LEDGER'),nm+': the CITED-IN RULINGS requirement is removed');
 ok(has('new',nm,'A premise whose pressed witness goes unanswered is UNEXHIBITED: it counts toward CONCEDED LINKS and the standings.'),nm+': the ruling 372 sentence the K-G6 cure quotes is kept word for word');}
ok(!has('new','Panel Build','CITED-IN RULINGS, OUT-OF-ROUND'),'Panel Build: the reasoning field no longer lists CITED-IN RULINGS');
// the ledger as the judges see it (Panel Build's PWL on 32302)
{const s=src('new','Panel Build');const r=s.indexOf('const REFP=(()=>');const RE_END='\n return {parse,keys,book,BK,BOOKS};})();';
 const PWL=new Function(s.slice(r,s.indexOf(RE_END,r)+RE_END.length)+s.slice(s.indexOf('const PWL='),s.indexOf('\nconst LEDGER='))+';return PWL;')();
 const F=R8.F_(RL.run('32302'));const t=PWL.judgeBlock(F);ok(/is not a list of witnesses \(md_notes_rulings 392\)/.test(t)&&/^cited in /m.test(t),'Panel Build ledger (32302): the cited-in line is printed and labelled informational');}
// the reading guide
{const s=src('new','Format Markdown');ok(s.includes('**AN UNANSWERED PRESSED WITNESS (operator rulings 372 and 392).**')&&s.includes("a press must have a premise behind it; a verse pressed without one isn't a witness"),'Format Markdown: the reading guide states ruling 392');
 ok(s.includes('or when a witness pressed against that premise, a verse carried under PRESSED WITH: in the list against that side, was left unanswered'),'Format Markdown: the UNEXHIBITED quotation matches the new rulebook words');
 const pb=src('new','Panel Build');ok(pb.includes('or when a witness pressed against that premise, a verse carried under PRESSED WITH: in the list against that side, was left unanswered'),'the quoted words stand in the rulebook (Panel Build)');
 const fk=s.match(/const flagKey = x => \{[\s\S]*?return null; \};/)[0];const flagKey=new Function(fk+';return flagKey;')();
 ok(flagKey('[AUDIT v26: DEBATE RULE VIOLATION (K-G10) -- CHALLENGER premise 4: x]')==='K-G10|CHALLENGER PREMISE 4','Format Markdown flagKey reads a K-G10 mark');
 ok(flagKey('[AUDIT v21: DEBATE RULE VIOLATION (K-G6) -- DEFENDER premise 2: x]')==='K-G6|DEFENDER PREMISE 2','Format Markdown flagKey still reads a K-G6 mark');
 ok(/'K-G10': 'Premise counted on a verse no listed premise carries/.test(s),'Format Markdown names the K-G10 rule');}
{const s=src('new','Build Save Body');const fk=s.match(/const __FK=x=>\{[\s\S]*?return null;\};/)[0];const FK=new Function(fk+';return __FK;')();
 ok(FK('[AUDIT v26: DEBATE RULE VIOLATION (K-G10) -- DEFENDER premise 3: x]')==='K-G10|DEFENDER PREMISE 3','Build Save Body __FK reads a K-G10 mark');}
ok(cnt('new','Init with Guards',"a verse on a side's 'cited in' line, or pressed in prose against a link but under no listed premise, is not a witness and is never counted unanswered.")===2&&!has('new','Init with Guards','counts as an unanswered witness only when the judge quotes'),'Init with Guards: both debater copies of the cited-in sentence carry ruling 392');
for(const nm of CURE){const s=src('new',nm);
 const r=s.includes(' K-G10 (your CONCEDED LINKS or CHALLENGER CONCEDED LINKS counts a premise UNEXHIBITED on a verse')&&!s.includes(' K-G9 (the PRESSED-WITNESS LEDGER')&&!s.includes('(a K-G9 ruling')&&s.includes('<SELF-SUPPORTED, PROP-DEPENDENT or COLLAPSED>')&&s.includes('For a K-G10 item it must quote the PRESSED WITH: line');
 ok(r,nm+': cure prompt asks for K-G10 (count or PRESSED WITH statement); K-G9 sentence and ruling forms gone');}

console.log('== K2: K-G9 retired, K-G10');
for(const nm of CHECK){const s=src('new',nm);ok(!/drvCited\((?:WT|raw0),/.test(s)&&/drvPressWith\((?:WT|raw0),PT,/.test(s)&&s.includes("'K-G10':'TRIAL'"),nm+': drvCited no longer called; drvPressWith called; K-G10 TRIAL');}
const C=L.chk('new','Panel Payloads');const CC=L.lib('new','Panel Cure Check');
ok(C.ENF_STATUS['K-G10']==='TRIAL'&&!C.enfLive({rule:'K-G10'}),'ENF_STATUS: K-G10 is TRIAL (removes no seat)');
ok(CC.ENF_STATUS['K-G10']==='TRIAL'&&CC.enfUncured([{rule:'K-G10',status:'UNCURED'}])===0,'cure nodes: an uncured K-G10 item never counts in drv_uncured');
// the prompt as the replay builds it, and a judgment
const prompt=(n)=>{const r=RL.run(n);const F=R8.F_(r);const T=[['[CR1] DEFENDER R1',F.cr1],['[DR1] CHALLENGER R1',F.gr1],['[CR2] DEFENDER R2',F.cr2],['[DR2] CHALLENGER R2',F.gr2],['[CR3] DEFENDER R3 -- LINK ROUND',F.cr3],['[DR3] CHALLENGER R3 -- LINK ROUND',F.dr3]];let u='DEBATE TRANSCRIPT';T.forEach(x=>u+='\n\n=== '+x[0]+' ===\n'+x[1]);return u;};
const judg=(n,seat,alt)=>{const r=R8.run(n);const raw=alt?R8.ELOG[n].find(x=>x.id===alt).full_reply:r.judgments.find(j=>j.seat===seat).verdict_raw;return RL.judgment(R8.firstRaw(raw,true),true);};
const pwAll=(J,n,dc,cc)=>C.drvPressWith(J.text,prompt(n),dc==null?J.fields.conceded_links:dc,cc==null?J.fields.challenger_conceded_links:cc,J.fields.defense_standing,J.fields.challenge_standing,null);
const pw=(...a)=>{const o=pwAll(...a);return {items:o.items.filter(x=>x.rule==='K-G10'),marks:o.marks.filter(m=>/K-G10/.test(m))};};
{const J=judg('32284','chatgpt');const o=pw(J,'32284',0,3);ok(o.items.map(x=>x.link).join()==='CHALLENGER premise 4,CHALLENGER premise 5'&&o.items.every(x=>x.verses.join()==='Luke 3:31'),'32284 ChatGPT: premises 4 and 5 counted on Luke 3:31 (under no PRESSED WITH of the [CR3] list) are marked',o.items.map(x=>x.link+' '+x.verses).join('; '));
 ok(!o.items.some(x=>x.premise===6),'32284 ChatGPT: premise 6 (inadequate footing) is not marked');
 ok(/K-G10\) -- CHALLENGER premise 4: CHALLENGER CONCEDED LINKS counts it UNEXHIBITED on Luke 3:31/.test(o.marks[0]||''),'32284 ChatGPT: the mark names the premise and the verse');}
{const J=judg('32293','sol',83);const o=pw(J,'32293',0,2);ok(o.items.map(x=>x.link+':'+x.verses.join('+')).join()==='CHALLENGER premise 2:Luke 1:27,CHALLENGER premise 3:Matthew 1:22','32293 Sol: premise 2 (Luke 1:27) and premise 3 (Matthew 1:22) are marked; Matthew 1:23, named as no answer, is not read as a witness',o.items.map(x=>x.link+':'+x.verses).join('; '));}
{const J=judg('32302','gemini');const o=pw(J,'32302');ok(o.items.length===0&&/K-G10 PASS: 2 UNEXHIBITED witness grounds read/.test(o.marks[0]),'32302 Gemini: Isaiah 7:11 and Luke 3:31 are under PRESSED WITH; nothing marked',o.marks[0]);}
{const J=judg('32302','glm');const o=pw(J,'32302');ok(o.items.length===0,'32302 GLM: premise 4 rests on Luke 3:31 (under PRESSED WITH) and Matthew 1:1 (not) and on its footing; not marked');}
// synthetic fixtures on 32284's rounds
const syn=(cl,cc,ds,cs)=>{const t='RESULT: DEFENDER WINS\nCHALLENGE STANDING: PROP-DEPENDENT -- L=6\n'+cl;const o=C.drvPressWith(t,prompt('32284'),0,cc,ds||'SELF-SUPPORTED',cs||'PROP-DEPENDENT',null);return {items:o.items.filter(x=>x.rule==='K-G10'),marks:o.marks};};
ok(syn('CHALLENGER CONCEDED LINKS: 1 -- Premise 4: UNEXHIBITED: Romans 1:3 was left unanswered in [DR3].',1).items.length===0,'synthetic: a verse under PRESSED WITH (Romans 1:3, premise 4) is a witness; not marked');
ok(syn('CHALLENGER CONCEDED LINKS: 1 -- Premise 2: UNEXHIBITED: Luke 3:31 was left unanswered and the block exhibits only [L1].',1).items.length===0,'synthetic: a premise also counted on a footing ground is not marked');
ok(syn('CHALLENGER CONCEDED LINKS: 1 -- Premises 2 and 3 are VOID. Premise 2: UNEXHIBITED: Luke 3:31 was left unanswered.',1).items.length===0,'synthetic: a premise the seat ruled VOID is not marked');
ok(syn('CHALLENGER CONCEDED LINKS: 0 -- none.',0).items.length===0,'synthetic: a count of 0 is not read');
{const o=syn('CHALLENGER CONCEDED LINKS: 1\n- premise 3 UNEXHIBITED: Luke 3:31, pressed in [CR2], receives no later answer.',1);ok(o.items.length===1&&o.items[0].premise===3,'synthetic: an item line under the count line ("- premise 3 UNEXHIBITED:") is read');}
{const o=syn('CHALLENGER CONCEDED LINKS: 1 -- Premise 3: UNEXHIBITED; its block names Luke 2:48, and Luke 3:31 was left unanswered.',1);ok(o.items.length===1&&o.items[0].verses.join()==='Luke 3:31','synthetic: only the verse said to be unanswered is read as the witness',o.items.map(x=>x.verses).join());}
{const R={CR3:'CHALLENGER\'S UNSUPPORTED-L4 PREMISES\n1. "x" charge. PRESSED WITH: none\n2. "y" charge. PRESSED WITH: Luke 3:31 "which was the son of Nathan"'};const P=C.pwList(R,'CHALLENGER');ok(P.length===2&&P[0].keys.size===0&&P[1].keys.has('Luke 3:31'),'pwList: PRESSED WITH: none carries no verse; a listed verse is read');}
// the cure
const items=C.drvPressWith(judg('32284','chatgpt').text,prompt('32284'),0,3,'SELF-SUPPORTED','PROP-DEPENDENT',null).items.filter(x=>x.rule==='K-G10');
const rounds=RL.rounds(RL.run('32284'));const resp=items.map(x=>'RESPONSE: '+CC.cureLabel(x)+' | I accept: Luke 3:31 is under no premise.').join('\n');
const cv=(txt,br,its)=>CC.cureVerdicts(its||items,{ok:true,text:txt},br||{DEFENDER:[],CHALLENGER:[]},rounds);
{const v=cv(resp+'\nCORRECTED COUNT: CHALLENGER 1\nCORRECTED STANDING: CHALLENGER PROP-DEPENDENT');ok(v.every(x=>x.status==='CURED'),'cure: CORRECTED COUNT 1 (3 less premises 4 and 5) with PROP-DEPENDENT cures both items',v.map(x=>x.why).join(' | '));
 const cs=CC.cureSet({ok:true,text:resp+'\nCORRECTED COUNT: CHALLENGER 1\nCORRECTED STANDING: CHALLENGER PROP-DEPENDENT'},v);ok(cs&&cs.CHALLENGER&&cs.CHALLENGER.n===1,'cureSet writes the corrected count of a K-G10 cure');}
{const v=cv(resp+'\nCORRECTED COUNT: CHALLENGER 2\nCORRECTED STANDING: CHALLENGER PROP-DEPENDENT');ok(v.every(x=>x.status==='UNCURED'&&/still counts/.test(x.why)),'cure: a count of 2 still counts a premise on Luke 3:31; UNCURED',v[0].why);}
{const v=cv(resp+'\nCORRECTED COUNT: CHALLENGER 1\nCORRECTED STANDING: CHALLENGER SELF-SUPPORTED');ok(v.every(x=>x.status==='UNCURED'&&/makes the CHALLENGER standing PROP-DEPENDENT/.test(x.why)),'cure: a count of 1 with SELF-SUPPORTED is refused');}
{const one=[{...items[0],conc:1}];const r1='RESPONSE: '+CC.cureLabel(one[0])+' | accepted, the verse is under no premise.';
 ok(cv(r1+'\nCORRECTED COUNT: CHALLENGER 0\nCORRECTED STANDING: CHALLENGER SELF-SUPPORTED',null,one)[0].status==='CURED','cure: count 0 with SELF-SUPPORTED cures when no challenger link stands BROKEN');
 ok(cv(r1+'\nCORRECTED COUNT: CHALLENGER 0\nCORRECTED STANDING: CHALLENGER SELF-SUPPORTED',{DEFENDER:[],CHALLENGER:['D3 vs C2']},one)[0].status==='UNCURED','cure: count 0 with SELF-SUPPORTED is refused while a challenger link stands BROKEN (K-G3)');}
{const x={...items[0],verses:['Romans 1:3']};const r1='RESPONSE: '+CC.cureLabel(x)+' | the verse is carried.\nSTATEMENT: '+CC.cureLabel(x)+' | [CR3] premise 4 carries it: \'Romans 1:3 "made of the seed of David according to the flesh"\'.';
 const v=cv(r1,null,[x]);ok(v[0].status==='CURED'&&/^statement quotes the PRESSED WITH line/.test(v[0].why),'cure: a STATEMENT quoting the PRESSED WITH line that carries the verse cures',v[0].why);
 const cs=CC.cureSet({ok:true,text:r1},v);ok(!cs,'cureSet writes no count for a K-G10 statement cure');}
{const r1=resp+'\nSTATEMENT: '+CC.cureLabel(items[0])+' | [CR2] presses it: "Luke 3:31, which was the son of Nathan" against the seed argument.';const v=cv(r1);ok(v[0].status==='UNCURED','cure: a STATEMENT quoting the prose press (not a PRESSED WITH line) does not cure',v[0].why);}
{const t=CC.cureAsk(items,{});ok(t.includes('K-G10 CHALLENGER premise 4: premise 4: counted UNEXHIBITED on Luke 3:31')&&t.includes('K-G10 (your CONCEDED LINKS'),'cureAsk lists the K-G10 item with its line and the rule');}

console.log('== K3 and K7: the D4 close list');
const d4=(n,v,blank)=>{const r=RL.run(n);const map={'Init Seats':{run_token:'T',dpos:'the affirmative'},'Init with Guards':{dsys:'SYS',topic:'TOPIC'},'Resolve Seats':{defender:{fam:'openrouter',model:'m/d',tok:1000},challenger:{fam:'openrouter',model:'m/c',tok:1000}},
  'D1 Extract':{raw:r.claude_r1},'C1 Extract':{raw:r.engine_r1},'D2 Extract':{raw:blank?'(no answer)':r.claude_r2},'C2 Extract':{raw:r.engine_r2},'D3 Extract':{raw:blank?'(no answer)':r.engine_r3},'C3 Extract':{raw:r.challenger_r3}};return RN.runNode(v,'D4 Build',map)[0].json;};
const partA=t=>{const o={};for(const l of t.split('\n(b)')[0].split('\n')){const m=l.match(/^premise (\d+)(?: \(LINK [^)]*\))?: NOT NAMED: (.+)$/);if(m)o[m[1]]=m[2].split(', ');}return o;};
for(const [n,blank] of [['32302',false],['32306',false],['32302',true],['32306',true]]){const b=d4(n,'base',blank),w=d4(n,'new',blank);if(blank)console.log('     ('+n+' with the defender rounds 2 and 3 blanked, so no verse is named: part (a) shows every verse in scope)');const A=partA(b.open_list),B=partA(w.open_list);
 ok(/\(b\) EVERY VERSE THE CHALLENGER CITED/.test(b.open_list)&&!/\(b\)/.test(w.open_list),'D4 ('+n+(blank?', blanked':'')+'): part (b) is dropped from the close list');
 const PL=C.pwList(RL.rounds(RL.run(n)),'DEFENDER');const PW=new Set(PL.flatMap(p=>[...p.keys]));const key=l=>[...C.ciRounds?CC.REFP.keys(l,{scoped:true,cap:12}).map(k=>k.key):[]];
 const drop=[],bad=[];for(const p of Object.keys(A)){const kept=B[p]||[];for(const v of A[p])if(!kept.includes(v))drop.push('premise '+p+': '+v);}
 const PWp=p=>(PL[+p-1]||{keys:new Set()}).keys;for(const p of Object.keys(B))for(const v of B[p])if(!key(v).every(k=>PWp(p).has(k)))bad.push('premise '+p+': '+v);
 ok(bad.length===0,'D4 ('+n+') K7: every verse part (a) lists for a premise is under that premise\'s PRESSED WITH line of the [DR2] list');
 ok(drop.every(d=>{const m=d.match(/^premise (\d+): (.*)$/);return !key(m[2]).some(k=>PWp(m[1]).has(k));}),'D4 ('+n+') K7: the verses that drop out are under no PRESSED WITH line of their premise',drop.join('; ')||'none');
 console.log('     D4 ('+n+') part (a) base: '+Object.entries(A).map(([p,v])=>p+': '+v.join(', ')).join(' | '));
 console.log('     D4 ('+n+') part (a) new : '+Object.entries(B).map(([p,v])=>p+': '+v.join(', ')).join(' | '));
 const um=j=>j.call.body.messages[j.call.body.messages.length-1].content;const cut=s=>s.replace(/STILL UNANSWERED AGAINST YOUR CHAIN[\s\S]*?(?=\n\nCLOSE ROUND)/,'');
 ok(cut(um(b))===cut(um(w)),'D4 ('+n+'): the close message outside the still-unanswered list is unchanged');}
console.log('== K5 (1): ruling 392 at the collisions');
for(const nm of ['Panel Build','Build Independent Verdict']){const s=src('new',nm);
 ok(s.includes('A pressed witness (a verse a listed premise carries under PRESSED WITH:, md_notes_rulings 392) left unanswered is a BROKEN ground; a verse under no PRESSED WITH: line, left unanswered, is no BROKEN ground.')&&!s.includes('A witness left unanswered is a BROKEN ground.'),nm+': the collision rule limits the BROKEN ground to PRESSED WITH verses');
 ok(s.includes('left UNANSWERED any of those witnesses that a listed premise carries under PRESSED WITH: (COUNTING RULE;')&&s.includes('A grade that rests on a witness left unanswered counts only when that witness is a verse a listed premise carries under PRESSED WITH:')&&s.includes('BROKEN for a pressed witness (a verse a listed premise carries'),nm+': COUNTING RULE, BROKEN AT COLLISION and the count-0 sentence carry 392');}
for(const nm of CURE){const s=src('new',nm);ok(s.includes('WITNESS (md_notes_rulings 392): in every item below a witness is a verse a listed premise carries under PRESSED WITH:')&&(s.split('on a pressed witness (a verse a listed premise carries under PRESSED WITH:, md_notes_rulings 392) left unanswered): cure it').length-1)===2&&s.includes(' K-G11 (a COLLISION POINTS line you graded LINK BROKEN')&&!s.includes('A witness left unanswered is a BROKEN ground.'),nm+': K-G1, K-G4, K-S, K-G7 cure text and K-G11 carry 392');}
for(const nm of CHECK.concat(CURE)){const s=src('new',nm);ok(s.includes('a pressed witness (a verse a listed premise carries under PRESSED WITH, ruling 392) left unanswered is a BROKEN ground')&&s.includes('only for a verse a listed premise carries under PRESSED WITH (ruling 392).')&&s.includes('(a witness is a verse a listed premise carries under PRESSED WITH, ruling 392)')&&s.includes("'K-G11':'TRIAL'"),nm+': the K-U, K-G4 and K-G1 marks carry 392; K-G11 TRIAL');}
{const r=R8.run('32293');const R=RL.rounds(r);const J=judg('32293','sol',83);const line=J.text.split('\n').find(l=>/^D3 vs C2/.test(l));
 const o=C.drvPressWith(J.text,prompt('32293'),0,2,'SELF-SUPPORTED','PROP-DEPENDENT',null);const x=o.items.find(y=>y.rule==='K-G11');
 console.log('     Sol 32293 D3 vs C2: '+line.slice(0,140)+' ...');
 ok(x&&x.verses.join()==='Luke 1:27','Sol D3 vs C2: the part resting on an unanswered verse names Luke 1:27 only ("Luke 1:27 supplies the unanswered description"; GROUND "[DR3] leaves Luke 1:27 unanswered")',x&&x.verses.join());
 const PL=C.pwList(R,'CHALLENGER');ok(!PL.some(p=>p.keys.has('Luke 1:27'))&&PL[1].keys.has('Matthew 1:25'),'Sol D3 vs C2: Luke 1:27 is under no PRESSED WITH of the [CR3] list; Matthew 1:25 is under premise 2');
 ok(x&&x.pwNamed.join()==='Matthew 1:25','Sol D3 vs C2: its other ground, the chain read through Matthew 1:25 ([L1]), Genesis 4:1 ([L3]) and ginosko ([L2]), names one PRESSED WITH verse: Matthew 1:25',x&&x.pwNamed.join());
 const nm=k=>['DR1','DR2','DR3'].filter(z=>CC.REFP.keys(R[z],{scoped:true,cap:30}).some(q=>q.key===k));ok(nm('Matthew 1:25').join()==='DR1,DR2,DR3','Sol D3 vs C2: Matthew 1:25 is named in [DR1], [DR2] and [DR3], so by the rule it was answered: the line does not stand on its other ground, and K-G11 marks it',nm('Matthew 1:25').join());
 const R2={...R,DR1:R.DR1.replace(/Matthew 1:25/g,'Matthew 9:9'),DR2:R.DR2.replace(/Matthew 1:25/g,'Matthew 9:9'),DR3:R.DR3.replace(/Matthew 1:25/g,'Matthew 9:9')};
 let u='DEBATE TRANSCRIPT';['CR1','DR1','CR2','DR2','CR3','DR3'].forEach(k=>u+='\n\n=== ['+k+'] round ===\n'+R2[k]);const o2=C.drvPressWith(J.text,u,0,2,'SELF-SUPPORTED','PROP-DEPENDENT',null);
 ok(!o2.items.some(y=>y.rule==='K-G11'),'counter-fixture: were Matthew 1:25 named in no later challenger round, the line would stand on that pressed witness, and K-G11 would not mark it');
 for(const [s0,nn] of [['chatgpt','32284'],['gemini','32284'],['glm','32284'],['gemini','32302'],['glm','32302'],['chatgpt','32302'],['gemini','32293'],['chatgpt','32293']]){const Jx=judg(nn,s0);const ox=C.drvPressWith(Jx.text,prompt(nn),Jx.fields.conceded_links,Jx.fields.challenger_conceded_links,Jx.fields.defense_standing,Jx.fields.challenge_standing,null);
  ok(!ox.items.some(y=>y.rule==='K-G11'),nn+' '+s0+': no K-G11 mark');}
 const its=[x];const cv11=t=>CC.cureVerdicts(its,{ok:true,text:'RESPONSE: '+CC.cureLabel(x)+' | accepted: Luke 1:27 is under no premise.\n'+t},{DEFENDER:[],CHALLENGER:['D3 vs C2']},R)[0];
 ok(cv11('RETRACTED: D3 vs C2 -- regraded UNDERDETERMINED -- [DR3] names Matthew 1:25, and Luke 1:27 is under no PRESSED WITH line.\nCORRECTED RESULT: HELD-1').status==='CURED','K-G11 cure: RETRACTED with one CORRECTED RESULT and a reason cures');
 ok(cv11('RESTATED: D3 vs C2 (Matthew 1:25): UNDERDETERMINED -- [DR3] answers Matthew 1:25 -- GROUND: the chain is answered.').status==='CURED','K-G11 cure: a RESTATED line graded UNDERDETERMINED cures');
 ok(cv11('RESTATED: D3 vs C2 (Luke 1:27): CHALLENGER LINK BROKEN -- [L1] Matthew 1:25 -- GROUND: [DR3] leaves Luke 1:27 unanswered.').status==='UNCURED','K-G11 cure: restated BROKEN still resting on Luke 1:27 is refused');
 ok(cv11('STATEMENT: '+CC.cureLabel(x)+' | it stands.').status==='UNCURED','K-G11 cure: a statement alone does not cure');}
console.log('== K5 (2): the ledger premise lines and K-G6');
{const s=src('new','Panel Build');const r0=s.indexOf('const REFP=(()=>');const RE_END='\n return {parse,keys,book,BK,BOOKS};})();';
 const mk=v=>{const t=src(v,'Panel Build');const r=t.indexOf('const REFP=(()=>');return new Function(t.slice(r,t.indexOf(RE_END,r)+RE_END.length)+t.slice(t.indexOf('const PWL='),t.indexOf('\nconst LEDGER='))+';return PWL;')();};
 const Pn=mk('new'),Pb=mk('base');const F=R8.F_(RL.run('32302'));const tn=Pn.judgeBlock(F),tb=Pb.judgeBlock(F);
 const ln=tn.split('\n'),lb=tb.split('\n');const i=ln.findIndex(l=>/^AGAINST THE CHALLENGER/.test(l));const p4=ln.slice(i).find(l=>/^premise 4\b/.test(l));
 console.log('     32302 new: '+p4);console.log('     32302 base: '+lb.slice(lb.findIndex(l=>/^AGAINST THE CHALLENGER/.test(l))).find(l=>/^premise 4\b/.test(l)));
 ok(/carried under PRESSED WITH; \d+ named; other verses the premise names \(informational, not witnesses\): [^;]*Matthew 1:1[^;]*; NOT NAMED: /.test(p4)&&!/NOT NAMED: .*Matthew 1:1/.test(p4),'32302 premise 4 against the challenger: Matthew 1:1 (outside PRESSED WITH) is shown as informational, not in NOT NAMED');
 const m=p4.match(/^premise (\d+)(?: \(LINK (\d+)\))?: .*NOT NAMED: (.+)$/);ok(m&&!/informational/.test(m[3]),'the K-G6 reader takes only the PRESSED WITH verses from the new line',m&&m[3]);
 ok(/SCOPE: the verses each numbered premise carries under PRESSED WITH: \(its pressed witnesses, md_notes_rulings 392/.test(tn),'the ledger header says the premise lines count PRESSED WITH verses only');
 const s2=Pn.ledger({cr1:'',gr1:'',cr2:'',gr2:'LIST\nUNSUPPORTED-L4 PREMISES\n1. "quote" charge about Luke 2:48. PRESSED WITH: none\n2. "q" charge. PRESSED WITH: John 6:42 "whose father"',cr3:'',dr3:'',cr4:null}).defender;
 ok(s2.premises[0].verses===0&&s2.premises[0].info.join()==='Luke 2:48'&&s2.premises[1].verses===1,'synthetic: PRESSED WITH: none carries no witness; the charge verse is informational');
 const k6=(v,n,s0,alt)=>{const J=judg(n,s0,alt);const P=v==='new'?Pn:Pb;const t=P.judgeBlock(R8.F_(RL.run(n)));const Cv=L.chk(v,'Panel Payloads');return Cv.drvLedger(J.text,t,J.fields.conceded_links,J.fields.challenger_conceded_links,J.fields.defense_standing,J.fields.challenge_standing,{DEFENDER:J.fields.counted_premises_defender,CHALLENGER:J.fields.counted_premises_challenger}).items.filter(x=>x.rule==='K-G6').map(x=>x.link).join(',')||'none';};
 for(const [n,s0,alt] of [['32284','chatgpt'],['32284','gemini'],['32284','glm'],['32293','gemini'],['32293','chatgpt'],['32293','sol',83],['32302','gemini'],['32302','glm'],['32302','chatgpt']]){const b=k6('base',n,s0,alt),w=k6('new',n,s0,alt);ok(true,n+' '+s0+': K-G6 items base '+b+' | new '+w+(b===w?' (same)':' (MOVED)'));}}
console.log('== K5 (3): the debaters\' lists');
for(const nm of ['C2 Build','D3 Build']){const s=src('new',nm);ok(s.includes('a verse pressed without the PRESSED WITH: line of a listed premise is not a witness and is not weighed as one (operator ruling 392: a press must have a premise behind it).')&&!s.includes('reaches the judges only if the other side never names it'),nm+': the list instruction states ruling 392');}

console.log('== K6: K-V, a VOID ruling quotes the charge words beyond the quote and names the kind');
for(const nm of ['Panel Build','Build Independent Verdict'])ok(has('new',nm,'A VOID ruling for a charge stronger than its quote quotes, in the same ruling, the charge words that go beyond the quote and names the kind: a negation, a universal, or a claim the words of the quote do not make'),nm+': the VOID rule asks for the charge words and the kind');
for(const nm of CURE){const s=src('new',nm);ok(s.includes(' K-V (a premise you ruled VOID as charged beyond its quote')&&s.includes("'K-V':'TRIAL'")&&s.includes("x.rule==='K-G11'||x.rule==='K-V'||x.rule==='K-LB'||x.rule==='K-S'"),nm+': K-V in the cure prompt, ENF_STATUS (TRIAL) and the label lists');}
for(const nm of CHECK)ok(src('new',nm).includes("'K-V':'TRIAL'")&&src('new',nm).includes('function drvVoid('),nm+': K-V checker present, TRIAL');
{const J=judg('32306','chatgpt');const o=C.drvPressWith(J.text,prompt('32306'),0,0,'SELF-SUPPORTED','SELF-SUPPORTED',null);const kv=o.items.filter(x=>x.rule==='K-V');
 ok(kv.length===11&&!kv.some(x=>x.link==='DEFENDER premise 1'),'32306 ChatGPT: 11 VOID rulings marked (defender premises 2-6, challenger 1-6); defender premise 1 (SUPPORTED) is not',kv.map(x=>x.link.replace(' premise ','')).join(' '));
 const p6=kv.find(x=>x.link==='DEFENDER premise 6'),p3=kv.find(x=>x.link==='DEFENDER premise 3');
 ok(p6&&/excludes Joseph's seed, not seed altogether/.test(p6.line)&&/quotes no charge words/.test(p6.line)&&/names no kind/.test(p6.line),'32306 ChatGPT premise 6 ("its [CR1] quote excludes Joseph\'s seed, not seed altogether"): no charge words quoted, no kind named');
 ok(p3&&/says legal fatherhood, not a register-name/.test(p3.line)&&/quotes no charge words/.test(p3.line),'32306 ChatGPT premise 3 ("its [CR1] quote says legal fatherhood, not a register-name"): register-name is named, not quoted; marked');
 ok(o.marks.some(m=>/^\[AUDIT v26: DEBATE RULE VIOLATION \(K-V\) -- DEFENDER premise 6: ruled VOID, but the ruling quotes no charge words/.test(m)&&/REVIEW THIS ROW\.\]$/.test(m)),'32306 ChatGPT: the K-V mark form');
 for(const s0 of ['gemini','glm']){const Jx=judg('32306',s0);const ox=C.drvPressWith(Jx.text,prompt('32306'),Jx.fields.conceded_links,Jx.fields.challenger_conceded_links,Jx.fields.defense_standing,Jx.fields.challenge_standing,null);ok(!ox.items.some(x=>x.rule==='K-V'),'32306 '+s0+': voided none; no K-V mark ("No premise is VOID" is read as a denial)');}
 const sy=t=>C.drvPressWith('RESULT: DEFENDER WINS\nCONCEDED LINKS: 0 -- '+t,prompt('32306'),0,0,'SELF-SUPPORTED','SELF-SUPPORTED',null).items.filter(x=>x.rule==='K-V');
 ok(sy('premise 3 is VOID: the charge "reduced to a register-name" makes a claim the words of the quote do not make.').length===0,'synthetic: charge words quoted ("reduced to a register-name") and the kind named pass');
 ok(sy('premise 3 is VOID: the charge "reduced to a register-name" goes beyond the quote.').length===1,'synthetic: charge words without the kind are marked');
 ok(sy('premise 3 is VOID: the charge "legal and supposed" makes a claim the words of the quote do not make.').length===1,'synthetic: words of the quote itself are not charge words; marked');
 ok(sy('premise 3 is VOID: no verbatim quote of the defender is found in [CR1] or [CR2].').length===0,'synthetic: a VOID for no verbatim quote needs no charge words');
 // the cure
 const x=p3;const R=RL.rounds(RL.run('32306'));const cvv=t=>CC.cureVerdicts([x],{ok:true,text:'RESPONSE: '+CC.cureLabel(x)+' | I answer the mark on premise 3.\n'+t},{DEFENDER:[],CHALLENGER:[]},R)[0];
 ok(cvv('STATEMENT: '+CC.cureLabel(x)+' | the charge "reduced to a register-name" makes a claim the words of the quote do not make: a universal reduction.').status==='CURED','K-V cure: a STATEMENT quoting the charge words and naming the kind cures');
 ok(cvv('STATEMENT: '+CC.cureLabel(x)+' | the quote says legal fatherhood, not a register-name.').status==='UNCURED','K-V cure: the original ruling restated as a statement does not cure');
 ok(cvv('RESTATED: CONCEDED LINKS: 0 -- premise 3 is SUPPORTED: [CR3] exhibits Luke 3:23 and enomizeto.').status==='CURED','K-V cure: premise regraded SUPPORTED in a RESTATED count cures');
 const c1=cvv('RESTATED: CONCEDED LINKS: 1 -- premise 3 is UNEXHIBITED: the block shows one layer.\nCORRECTED COUNT: DEFENDER 1\nCORRECTED STANDING: DEFENDER PROP-DEPENDENT');ok(c1.status==='CURED'&&/^counted/.test(c1.why),'K-V cure: premise counted, with CORRECTED COUNT 1 and PROP-DEPENDENT, cures',c1.why);
 ok(cvv('RESTATED: CONCEDED LINKS: 1 -- premise 3 is UNEXHIBITED: the block shows one layer.').status==='UNCURED','K-V cure: counted without a CORRECTED COUNT is refused');
 ok(cvv('').status==='UNCURED','K-V cure: no statement and no regrade leaves it UNCURED');
 ok(CC.enfUncured([{rule:'K-V',status:'UNCURED'}])===0,'K-V is TRIAL: an uncured item removes no seat');
 {const rp={ok:true,text:'CORRECTED COUNT: DEFENDER 1\nCORRECTED STANDING: DEFENDER PROP-DEPENDENT'};const cs=CC.cureSet(rp,[{rule:'K-G10',side:'DEFENDER',status:'CURED',why:'recounted'},{rule:'K-V',side:'DEFENDER',status:'UNCURED',why:'no STATEMENT'}]);
  ok(cs&&cs.DEFENDER&&cs.DEFENDER.n===1,'cureSet: an open K-V item does not hold back another cured count of its side (run 32293 Sol, ruled)');
  const cs2=CC.cureSet(rp,[{rule:'K-V',side:'DEFENDER',status:'CURED',why:'counted: DEFENDER COUNT 1, STANDING PROP-DEPENDENT'}]);ok(cs2&&cs2.DEFENDER&&cs2.DEFENDER.n===1,'cureSet: a K-V item cured by a count writes the count');}}
console.log('\n'+n+' fixtures, '+bad+' bad');process.exitCode=bad?1:0;
