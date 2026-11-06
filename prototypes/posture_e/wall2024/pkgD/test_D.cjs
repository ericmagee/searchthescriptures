// Package D offline tests (Commitment 11, K-RUL; cure text for K-CON, K-CMT, K-RUL). argv[2] = live fetch 8dd6d614. Expectations:
// /mnt/project-files/w3/ruling_card_draft.md (R1-R6, X1-X4) and WALL-2024 reply 2150 (T1, T2). R2 list fixed first in r2_expected.json (80dd697).
const fs=require('fs');const live=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).workflow;const LN={};live.nodes.forEach(n=>LN[n.name]=n.parameters&&n.parameters.jsCode||'');
const plan=JSON.parse(fs.readFileSync('pkgD/plan_D.json','utf8'));const pat=n=>fs.readFileSync('pkgD/patched/'+n.replace(/ /g,'_')+'.js','utf8');
const posture=src=>{const i=src.indexOf('const POSTURE=(()=>{');const j=src.indexOf('return {PART2,HEADS',i);const k=src.indexOf('})();',j);return new Function(src.slice(i,k+5)+'\nreturn POSTURE;')();};
const pick=(c,name)=>{const i=c.indexOf('function '+name+'(');const j=c.indexOf('\nfunction ',i+10);return c.slice(i,j<0?undefined:j);};
let fail=0;const ok=(id,cond,msg)=>{console.log((cond?'OK  ':'FAIL')+' '+id+' '+msg);if(!cond)fail++;};
// ---- R1 (and headings 1-10 unchanged) on every PART2 node
for(const n of Object.keys(LN).filter(n=>LN[n].includes('const PART2="'))){const O=posture(LN[n]),P=posture(pat(n));
 ok('R1a',P.HEADS.length===11&&JSON.stringify(P.HEADS.slice(0,10))===JSON.stringify(O.HEADS)&&P.RULE_C['K-RUL']===11,`${n}: HEADS ${O.HEADS.length} -> ${P.HEADS.length}, 1-10 identical, RULE_C K-RUL=${P.RULE_C['K-RUL']}`);
 const c10=P.PART2.slice(P.PART2.indexOf('### Commitment 10.'),P.PART2.indexOf('### Commitment 11.'));
 ok('R1c',/So is NONE FOUND written where the engine found one\. A contradiction is also one the system finds by checking another line of this kind against the rounds\.\n\n$/.test(c10)&&P.PART2.replace(' A contradiction is also one the system finds by checking another line of this kind against the rounds.','').startsWith(O.PART2),`${n}: Commitment 10 gains its one sentence; the rest of the old PART2 is unchanged`);
 if(n==='Accept Check'){const reply=k=>P.HEADS.slice(0,k).map(h=>h+' I hold to it.').join('\n')+'\n'+P.LINE;const r10=P.check(reply(10)),r11=P.check(reply(11));
  ok('R1',r10.status==='FAULT'&&/heading 11 missing/.test(r10.faults.join(';'))&&r11.status==='ACCEPT'&&Object.keys(r11.lines).length===11,`Accept Check: 10-heading reply -> ${r10.status} (${r10.faults.join('; ')}); 11-heading reply -> ${r11.status}, ${Object.keys(r11.lines).length} lines`);}}
// ---- the K-RUL library, from patched Panel Payloads
const pp=pat('Panel Payloads');const lib=pp.slice(pp.indexOf('// WALL-2024 Commitment 11, K-RUL'),pp.indexOf('function kconLines2024('));
const K=new Function(lib+'\nreturn {krulLines2024,krulCure,krulAcc,krulOwn,krulCards,__KRUL_HEADS};')();
const Rr=f=>({CR1:f.cr1,DR1:f.gr1,CR2:f.cr2,DR2:f.gr2,CR3:f.cr3,DR3:f.dr3,CR4:f.cr4,DR4:f.dr4});
const EXP=JSON.parse(fs.readFileSync('pkgD/r2_expected.json','utf8'));let tot=0;
for(const id of ['32791','32905','32924']){const R=Rr(JSON.parse(fs.readFileSync(`fixtures/${id}.json`,'utf8')));
 for(const j of JSON.parse(fs.readFileSync(`pkgA/judgments/${id}.json`,'utf8'))){const a=K.krulLines2024(j.verdict_raw,R,null,null,'');const got=a.items.map(x=>x.link);tot+=got.length;
  ok('R2',JSON.stringify(got)===JSON.stringify(EXP[id+' '+j.judge_seat])&&a.items.every(x=>/no ruling card/.test(x.line))&&a.marks.length===got.length,`${id} ${j.judge_seat}: ${got.length} items [${got.join('; ')}]`);}}
ok('R2t',tot===38,`total ${tot} (posted 38, reply 2152)`);
// ---- synthetic seat: acceptance reply, judgment with cards (32905 grok rulings and round text)
const f05=Rr(JSON.parse(fs.readFileSync('fixtures/32905.json','utf8')));const own=K.__KRUL_HEADS.map((h,i)=>'I hold line '+(i+1)+' in my own words.');
const ACCTXT=K.__KRUL_HEADS.map((h,i)=>h+'\n'+own[i]).join('\n')+'\nI ACCEPT THIS POSTURE AND WILL BE HELD TO IT.';
const body={messages:[{role:'system',content:'x'},{role:'user',content:'POSTURE FOR ACCEPTANCE\n\n...'},{role:'assistant',content:ACCTXT},{role:'user',content:'the debate'}]};
const ACC=K.krulAcc(body);ok('R3a',ACC===ACCTXT&&Object.keys(K.krulOwn(ACC)).length===11,'krulAcc finds the acceptance reply; krulOwn reads 11 own lines');
const q=s=>{const w=s.replace(/\s+/g,' ').trim().split(' ');return w.slice(0,Math.min(9,w.length)).join(' ');};
const g05=JSON.parse(fs.readFileSync('pkgA/judgments/32905.json','utf8')).find(j=>j.judge_seat==='grok');const J=JSON.parse(g05.verdict_raw.trim().slice(0,g05.verdict_raw.trim().lastIndexOf('}')+1));
const grade={keystone:'STANDS'};const card=(id,gr,nb,ruleN,ruleTxt)=>['RULING -- '+id+' -- '+gr,'CLAIM: the meaning I take the words to carry.','NAMED BY: '+nb,'RULE: Commitment '+ruleN+' -- "'+ruleTxt+'"','APPLIED: the rule requires a named meaning; the record shows it; so '+gr+'.'].join('\n');
const nbOK='"'+q(f05.CR3.split('\n').find(l=>l.split(' ').length>12))+'" ([CR3])';
const RUL=EXP['32905 grok'];const mk=(over)=>RUL.map((id,i)=>{const o=(over&&over[i])||{};return card(id,o.gr||(id==='keystone'?'STANDS':(/vs/.test(id)?'CHALLENGER LINK BROKEN':'COUNTED')),o.nb||nbOK,1,o.rt||own[0]);}).join('\n\n');
const withCards=c=>JSON.stringify({...J,reasoning:J.reasoning+'\n\n'+c});
let a=K.krulLines2024(withCards(mk()),f05,null,ACC,'');ok('R3',a.items.length===0,`full correct cards for all ${RUL.length} rulings: ${a.items.length} items${a.items[0]?' :: '+a.items[0].line:''}`);
a=K.krulLines2024(withCards(mk({2:{nb:'"the angel carried the child across the river" ([CR3])'}})),f05,null,ACC,'');ok('R4',a.items.length===1&&/does not stand in the record/.test(a.items[0].line),`one NAMED BY quote not in the record: ${a.items.length} item(s) :: ${a.items.map(x=>x.link+': '+x.line.slice(0,90)).join(' | ')}`);
a=K.krulLines2024(withCards(mk({4:{rt:'I hold line 1 in other words.'}})),f05,null,ACC,'');ok('R5',a.items.length===1&&/differs from your accepted line/.test(a.items[0].line),`one RULE quote differs: ${a.items.length} item(s) :: ${a.items.map(x=>x.link).join(' | ')}`);
a=K.krulLines2024(withCards(mk({3:{nb:'NONE'}})),f05,null,ACC,'');ok('R6a',a.items.length===1&&a.items[0].link===RUL[3],`NAMED BY: NONE under ${/vs/.test(RUL[3])?'CHALLENGER LINK BROKEN':'COUNTED'} (${RUL[3]}): ${a.items.length} item(s)`);
a=K.krulLines2024(withCards(mk({2:{nb:'NONE'}})),f05,null,ACC,'');ok('R6b',a.items.length===0,`NAMED BY: NONE under STANDS (keystone): ${a.items.length} item(s)`);
a=K.krulLines2024(withCards(mk({0:{nb:'NONE',gr:'UNEXHIBITED'}})),f05,null,ACC,'');ok('R6c',a.items.length===1,`NAMED BY: NONE under UNEXHIBITED: ${a.items.length} item(s)`);
a=K.krulLines2024(withCards(mk({4:{rt:'I hold line 1 in other words.'}})),f05,null,null,'');ok('R5b',a.items.length===0,`acceptance out of reach: the RULE check is skipped (${a.items.length} items)`);
// ---- X2: uncontested lines only
a=K.krulLines2024('{"reasoning":"D1 vs C1 (Luke 1:35): UNDERDETERMINED -- x\\nD2 vs C2 (Matthew 1:18): SUPPORTED -- y\\nD3 -- STANDS","counted_premises_defender":[],"counted_premises_challenger":[]}',f05,null,null,'');
ok('X2',a.items.length===0,`UNDERDETERMINED, SUPPORTED and STANDS lines with no count and no keystone: ${a.items.length} items`);
// ---- X1, X3: TRIAL in every kw node; kwLines421, wpLines2024, kconLines2024, kcmtLines2024, drvPressWith byte-identical
for(const n of Object.keys(LN).filter(n=>LN[n].includes('function kwLines421('))){const s=pat(n);
 const st=new Function(s.slice(s.indexOf('const ENF_STATUS='),s.indexOf('const enfLive='))+'\nreturn enfStatus;')();
 ok('X1',st('K-RUL')==='TRIAL'&&st('K-CMT')==='TRIAL'&&st('K-CON')==='TRIAL',`${n}: enfStatus K-RUL ${st('K-RUL')}`);
 const s2=s.replace(s.slice(s.indexOf('// WALL-2024 Commitment 11, K-RUL'),s.indexOf('function kconLines2024(')),'');const same=['kwLines421','wpLines2024','kconLines2024','kcmtLines2024','drvPressWith','drvBlocks'].filter(f=>LN[n].includes('function '+f+'(')).every(f=>pick(LN[n],f)===pick(s2,f));ok('X3',same,`${n}: K-W, check 2, K-CON, K-CMT and drvPressWith sources unchanged`);}
// ---- X4: node list and base hashes
const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const W2=Object.fromEntries(fs.readFileSync('/mnt/project-files/w2/base_hashes_8dd6d614.tsv','utf8').trim().split('\n').slice(1).map(l=>l.split('\t')).map(r=>[r[0],r[2]]));
ok('X4',plan.nodes.length===26&&plan.nodes.every(x=>h(LN[x.name])===x.live_sha&&W2[x.name]===x.live_sha&&h(pat(x.name))===x.final_sha),`26 nodes; every live_sha equals my fetch and W2's base_hashes_8dd6d614.tsv; every final_sha equals the patched file`);
// ---- T1: the cure request text shows K-CON, K-CMT and K-RUL items under their own rule (WALL-2024 reply 2150)
for(const n of ['Cure Build','Panel Cure Build 1','Alternate Cure Build']){const s=pat(n),o=LN[n];const seg=c=>{const d=c.indexOf('const __CURE396=');const pre=c.slice(d,c.indexOf(';\n',d)+1);const i=c.indexOf('const CURE_RULE=');const l=c.indexOf('function cureAsk(');return pre+'\n'+c.slice(i,c.indexOf('\n',c.indexOf('return t+',l)));};
 const ask=new Function(seg(s)+'\nreturn cureAsk;')(),ask0=new Function(seg(o)+'\nreturn cureAsk;')();
 const items=[{rule:'K-CMT',side:'JUDGE',link:'contested grades without a commitment',line:'5 contested grade lines name no commitment'},{rule:'K-CON',side:'DEFENDER',link:'DEFENDER CR4 withdrawn in CR2 #1',line:'[CR4] ... quotes it: "Genesis 24:16 and Genesis 24:43 fix the word on an unknown woman"'},{rule:'K-RUL',side:'JUDGE',link:'keystone',ruling:'keystone',line:'deciding ruling keystone: no ruling card'}];
 const t=ask(items,{}),t0=ask0(items,{});
 ok('T1',!/K-G3 JUDGE|K-G3 DEFENDER/.test(t)&&items.every(x=>t.includes(x.rule+' '+x.link+': '+x.line))&&/K-G3 JUDGE/.test(t0),`${n}: new request shows each item under its rule; old request showed "K-G3 JUDGE" (reproduced)`);
 const other=[{rule:'K-W',side:'DEFENDER',link:'L1',line:'w'},{rule:'K-G3',side:'CHALLENGER',link:'',line:''}];ok('T1b',ask(other,{CHALLENGER:['D1 vs C2']})===ask0(other,{CHALLENGER:['D1 vs C2']}),`${n}: requests for other rules byte-identical`);}
// ---- T2: cure verdicts, form only
const cr=(x,rep,resp)=>K.krulCure(x,rep,f05,resp);
ok('T2a',cr({rule:'K-CMT'},'',  'D2 vs C2 BROKEN (Commitment 5)').st==='CURED'&&cr({rule:'K-CMT'},'','NOT A GRADE').st==='CURED'&&cr({rule:'K-CMT'},'',null).st==='UNCURED','K-CMT: a commitment named or NOT A GRADE cures; no response does not');
const kc={rule:'K-CON',line:'[CR4] the engine marked ... quotes it: "Genesis 24:16 and Genesis 24:43 fix the word on an unknown woman"'};
ok('T2b',cr(kc,'CONTRADICTION -- DEFENDER -- EARLIER (CR2, "I withdraw it") -- LATER (CR4, "Genesis 24:16 and Genesis 24:43 fix the word on an unknown woman")').st==='CURED'&&cr(kc,'CONTRADICTIONS: NONE FOUND.').st==='UNCURED','K-CON: a CONTRADICTION line quoting the flagged sentence cures; NONE FOUND does not');
const kr={rule:'K-RUL',link:'keystone',ruling:'keystone'};
ok('T2c',cr(kr,card('keystone','STANDS',nbOK,1,own[0])).st==='CURED'&&cr(kr,card('keystone','STANDS','"words that stand nowhere in this record at all"',1,own[0])).st==='UNCURED'&&cr(kr,'').st==='UNCURED','K-RUL: a valid card cures; a card whose quote does not stand, or no card, does not');
for(const n of plan.nodes.filter(x=>x.edits.includes('cureVerdicts')).map(x=>x.name)){const s=pat(n);ok('T2d',/\{const kr=krulCure\(x,reply&&reply\.ok\?reply\.text:'',R,/.test(s)&&s.indexOf('const kr=krulCure(')<s.indexOf("return res('UNCURED','unknown rule',null);}).concat(krulRestated(items,reply,R));"),`${n}: cureVerdicts consults krulCure before "unknown rule"`);}
// ---- R7, R7b (W3, reply 2157): the full patched cureVerdicts (library of Panel Cure Normalize 2) replayed on the stored 32936 chatgpt cure
{const lib=n=>{const c=pat(n);return c.slice(0,c.lastIndexOf('\nreturn $input'));};const lib0=n=>{const c=LN[n];return c.slice(0,c.lastIndexOf('\nreturn $input'));};
 const $=()=>{throw new Error('no node data offline');};
 const CV=new Function('$','$input',lib('Panel Cure Normalize 2')+'\nreturn cureVerdicts;')($,null),CV0=new Function('$','$input',lib0('Panel Cure Normalize 2')+'\nreturn cureVerdicts;')($,null);
 const F=JSON.parse(fs.readFileSync('pkgD/cure_32936_chatgpt.json','utf8'));const v=CV(F.items,F.reply,null,F.rounds),v0=CV0(F.items,F.reply,null,F.rounds);
 const kr=v.filter(x=>x.rule==='K-RUL');
 ok('R7',kr.length===1&&kr[0].ruling==='D6 vs C1'&&kr[0].status==='UNCURED',`32936 chatgpt cure replay: ${kr.length} K-RUL row(s) [${kr.map(x=>x.link+' :: '+x.why.slice(0,110)).join(' | ')}]`);
 const strip=a=>JSON.stringify(a.map(x=>({rule:x.rule,link:x.link,status:x.status})));
 ok('R7c',strip(v.filter(x=>x.rule!=='K-RUL'&&x.rule!=='K-CMT'))===strip(v0.filter(x=>x.rule!=='K-CMT'))&&v.length===v0.length+1,`every other item keeps its cure status (${v0.length} items before, ${v.length} rows after)`);
 const own1=K.__KRUL_HEADS?null:null;
 const t=JSON.parse(F.reply.text.trim());const nb='"'+q(F.rounds.CR3.split('\n').find(l=>l.split(' ').length>12))+'" ([CR3])';
 const withCard={...F.reply,text:JSON.stringify({...t,reasoning:t.reasoning+'\n'+card('D6 vs C1','UNDERDETERMINED',nb,1,'any accepted line')})};
 const v2=CV(F.items,withCard,null,F.rounds);ok('R7b',v2.filter(x=>x.rule==='K-RUL').length===0,`the same reply with a valid card for D6 vs C1: ${v2.filter(x=>x.rule==='K-RUL').length} K-RUL rows`);
 const kc={rule:'K-CON',line:'[CR4] withdrawn in [CR2]: "my bridge joined two words, and I withdraw it" -- later "Genesis 24:16 and Genesis 24:43 fix the word on an unknown woman"'};
 ok('T2e',K.krulCure(kc,'CONTRADICTION -- DEFENDER -- EARLIER (CR2, "my bridge joined two words, and I withdraw it") -- LATER (CR4, "the word")',f05).st==='CURED',`K-CON cure quoting only the EARLIER sentence is accepted (W2, reply 2160)`);}
console.log(fail?`FAILED ${fail}`:'ALL OK (with R7)');
