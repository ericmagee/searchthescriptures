// ASK 533 offline test (W2). Usage: node test533.js <live_engine.json> <target_engine.json>
// Inputs: ren533.json (KJV renderings per number, from the SQL doc md5 e6fb5de2), dread533.json (numbers the debaters gloss per run, same doc), glosses533.json (154 judge [L2] glosses from glosses533.py, md5 dffa0fc3).
const fs=require('fs');const {pkg}=require('./harness533.js');
const [LIVE,TGT]=process.argv.slice(2);const R=require('./ren533.json'),D=require('./dread533.json'),G=require('./glosses533.json');
const sub=d8=>{const o={};for(const n of (D[d8]||[]))if(R[n])o[n]=R[n];return o;};
const out=[];const say=s=>{out.push(s);};let fails=0;const ok=(c,s)=>{if(!c)fails++;say((c?'PASS ':'FAIL ')+s);};
const NEW=pkg(TGT,'Cure Check',{'L2 Count Plan':{e340:{ren:R}}}),OLD=pkg(LIVE,'Cure Check',{'L2 Count Plan':{e340:{ren:R}}});
ok(OLD.kl2gLines===null&&typeof NEW.kl2gLines==='function','1. live has no kl2gLines; the target has it');
// synthetic judge lines: one per (judgment, line), the glosses in stored order
const lines=new Map();for(const [jid,d8,n,lk,word,num,rd,gl] of G){const k=jid+'|'+n;if(!lines.has(k))lines.set(k,{jid,d8,n,lk,parts:[]});lines.get(k).parts.push('[L2] '+word+' ('+num+', '+gl.replace(/\\"/g,'"')+')');}
const line=L=>'- '+L.lk+' (cited verse): STANDS | '+L.parts.join('; ');
// 2. known bad and known good (run 41418, f333ef24)
const run=(jid,n)=>{const L=lines.get(jid+'|'+n);return NEW.kl2gLines(line(L),sub(L.d8));};
const b1=run(1263,37),b2=run(1265,36);
ok(b1.items.length===1&&/'including conjugal cohabitation' for G4905/.test(b1.items[0].why)&&!/'to come together'/.test(b1.items[0].why),'2a. 1263 D5 vs C2: "including conjugal cohabitation" raised; "to come together" not raised');
ok(b2.items.length===1&&/'to cohabit conjugally' for G4905/.test(b2.items[0].why)&&!/'to come together'/.test(b2.items[0].why),'2b. 1265 D5 vs C2: "to cohabit conjugally" raised; "to come together" not raised');
const g1=run(1265,28),g2=run(1265,30);ok(!g1.items.length&&!g2.items.length,'2c. 1265 H2233 "seed" and H6635 "host, war" raise nothing');
const b3=run(1265,34);say('     1265 D4 vs C2 (G1080 + G1537): '+(b3.items.length?b3.items[0].why:'no item'));
ok(b3.items.length===1&&!/G1537/.test(b3.items[0].why.split(';').filter(s=>/is not/.test(s)).join(';')),'2d. G1537 "out of" raises nothing (G1080 part listed above)');
ok(b1.marks.length===0,'2e. REN given (cure path): no AUDIT mark');
// 3. the read path through $('L2 Count Plan')
const viaStub=pkg(TGT,'Cure Check',{'L2 Count Plan':{e340:{ren:sub('f333ef24')}}}).kl2gLines(line(lines.get('1265|36')));
ok(viaStub.items.length===1&&viaStub.marks.length===1&&/^\[AUDIT v66: /.test(viaStub.marks[0]),'3a. read path: item and AUDIT v66 mark from $(\'L2 Count Plan\').e340.ren');say('     '+viaStub.marks[0]);
const noL2=pkg(TGT,'Cure Check',{}).kl2gLines(line(lines.get('1265|36')));
ok(noL2.items.length===0&&/the renderings export was not found/.test(noL2.marks[0]||''),'3b. no L2 Count Plan: no item, mark says NOT READ and export not found');say('     '+noL2.marks[0]);
// 4. cure branch
const it=b2.items;const RS='RESPONSE: K-GLS D5 vs C2 | The gloss is restated in the KJV renderings of G4905.';const RND={CR2:'Mary was found with child before they came together, as Matthew 1:18 reads.'};
const cv=t=>NEW.cureVerdicts(it,{ok:true,text:t},{},RND).find(x=>x.rule==='K-GLS');
const c1=cv(RS+'\nRESTATED: D5 vs C2 (Matthew 1:18): STANDS | [L2] synerchomai (G4905, to come together) reads the act');ok(c1.status==='CURED','4a. RESTATED "(G4905, to come together)": CURED -- '+c1.why);
const c2=cv(RS+'\nRESTATED: D5 vs C2 (Matthew 1:18): STANDS | [L2] synerchomai (G4905, to cohabit conjugally) reads the act');ok(c2.status==='UNCURED'&&/still carries/.test(c2.why),'4b. RESTATED "(G4905, to cohabit conjugally)": UNCURED -- '+c2.why.slice(0,120));
const c3=cv('RESPONSE: K-GLS D5 vs C2 | The line is withdrawn.\nRETRACTED: D5 vs C2 -- UNDERDETERMINED -- [CR2] reads "before they came together" and the gloss is not a KJV rendering of G4905\nCORRECTED RESULT: PARTIAL-2 -- D5 vs C2 is withdrawn, the rest stands');ok(c3.status==='CURED'&&/recorded only, not applied/.test(c3.why),'4c. RETRACTED with reason and one CORRECTED RESULT: CURED, recorded only (rev 1a) -- '+c3.why);
const c4=cv(RS);ok(c4.status==='UNCURED'&&/no RESTATED or RETRACTED/.test(c4.why),'4d. RESPONSE only: UNCURED -- '+c4.why);
const c5=cv('');ok(c5.status==='UNCURED'&&c5.silent===true,'4e. no reply line: UNCURED, silent');
ok(NEW.enfSilent(c5)===false&&OLD.enfSilent({...c5})===true,'4f. enfSilent: K-GLS silence does not count on the target (live would count it)');
ok(NEW.cureOwn('RESTATED: K-GLS D5 vs C2 (x): STANDS',{rule:'K-GLS',link:'D5 vs C2',side:'BOTH'})===OLD.cureOwn('RESTATED: D5 vs C2 (x): STANDS',{rule:'K-GLS',link:'D5 vs C2',side:'BOTH'}),'4g. cureOwn strips "K-GLS " as it strips any K-rule label');
ok(NEW.cureLabel(it[0])==='K-GLS D5 vs C2'||/D5 vs C2/.test(NEW.cureLabel(it[0])),'4h. cureLabel: '+NEW.cureLabel(it[0]));
// 4i/4j (plan rev 1a, W1 10779): a retraction answering only K-GLS items is recorded, not applied; with a K-L2 item on the same link it is applied
{const TX=['KEYSTONE: D5 -- STANDS','D5 vs C2 (Matthew 1:18): DEFENDER LINK BROKEN -- [L2] synerchomai (G4905, to come together, to cohabit conjugally) reads the act [CR2]','RESULT: BROKEN-1 -- D5 broken','DEFENSE STANDING: COLLAPSED'].join('\n');
 const RP='RESPONSE: K-GLS D5 vs C2 | The line is withdrawn.\nRETRACTED: D5 vs C2 -- UNDERDETERMINED -- [CR2] reads "before they came together" and the gloss is not a KJV rendering of G4905\nCORRECTED RESULT: PARTIAL-2 -- D5 vs C2 is withdrawn, the rest stands';
 const run2=(P,items)=>{const v=P.cureVerdicts(items,{ok:true,text:RP},{},RND);return {v,r:P.cureRecompute('sol62',TX,{cr2:RND.CR2},items,v,{ok:true,text:RP})};};
 const g=NEW.kl2gLines(TX).items,l2={rule:'K-L2',side:'DEFENDER',link:'D5 vs C2',line:'x'};
 const a=run2(NEW,g);ok(a.r===null&&a.v[0].status==='CURED'&&/recorded only, not applied/.test(a.v[0].why),'4i. K-GLS only: RETRACTED recorded, not applied (cureRecompute returns null: no count moves); cure CURED -- '+a.v[0].why);
 const b=run2(NEW,g.concat([l2]));ok(b.r&&JSON.stringify(b.r.retracted)==='["D5 vs C2"]'&&b.v[0].why==='retracted','4j. K-GLS + K-L2 on one link: RETRACTED applied (retracted '+JSON.stringify(b.r&&b.r.retracted)+'); K-GLS cure "'+b.v[0].why+'"');}
// 5. full replay over every stored gloss line
let raised=0,gl=0,pc=0,nr=0;const byRun={};const rows=[];
for(const L of lines.values()){const x=pkg.cache||null;const r=NEW.kl2gLines(line(L),sub(L.d8));const m=pkg(TGT,'Cure Check',{'L2 Count Plan':{e340:{ren:sub(L.d8)}}}).kl2gLines(line(L)).marks[0]||'';const q=m.match(/-- (\d+) \[L2\] glosses read on collision lines; (\d+) parts checked; (\d+) items raised.*?; (\d+) NOT READ/);gl+=+q[1];pc+=+q[2];nr+=+q[4];
 for(const i of r.items){raised++;rows.push(L.jid+' '+L.d8+' line '+L.n+' '+i.link+': '+i.why.split('; the 1611')[0]);}}
say('5. replay: '+lines.size+' judge lines, '+gl+' glosses, '+pc+' parts checked, '+raised+' items raised, '+nr+' glosses NOT READ (number not glossed by the debaters in that run)');
rows.forEach(r=>say('     '+r));
{let eq=0;for(const L of lines.values()){const a=JSON.stringify(OLD.kl2Lines(line(L),OLD.l2Data?OLD.l2Data():null)),b=JSON.stringify(NEW.kl2Lines(line(L),NEW.l2Data?NEW.l2Data():null));if(a===b)eq++;}ok(eq===lines.size,'6. kl2Lines (K-L2) output equal OLD and NEW on all '+lines.size+' lines ('+eq+')');}
ok(gl===G.length,'5a. every stored gloss is read ('+gl+' of '+G.length+')');
console.log(out.join('\n'));console.log(fails?('FAILS: '+fails):'ALL PASS');
