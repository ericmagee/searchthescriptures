// ASK 590 build (W4), layer 1: ONE closing check. The closing enforcer reads the anti-cheat candidates (ruling 427) in its two reads; REVERSED READING
// is recorded in debate_enforcer_log and shown to the judges under the confirmed block; CONFIRMED wins; the anti-cheat nodes leave the path.
// Plan: ask589/w3/closing_check_plan.md dad7dfe9 (W1 PASS Wall 11389); operator press "Build it, with the send-back" 00:25 CST 11-24 (row 516).
// The send-back (plan S3 d) is layer 2. Base: live engine 9bec145c (base_eng.json).
const fs=require('fs');const crypto=require('crypto');const md5=s=>crypto.createHash('md5').update(s).digest('hex');const {once}=require('/mnt/project-files/ask588/w4/build/libpatch.js');
const E=JSON.parse(fs.readFileSync('base_eng.json','utf8'));if(E.versionId!=='9bec145c-e25e-49ec-b361-4e7fd3bd627a')throw new Error('base is not live 9bec145c');
const E0=JSON.parse(JSON.stringify(E));const N=n=>{const x=E.nodes.find(y=>y.name===n);if(!x)throw new Error('no node '+n);return x;};const log=[];
const FINDER=fs.readFileSync('finder_port.js','utf8'),OVS=fs.readFileSync('ovs_port.js','utf8');
// 1. Close Enforcer Build: the reversed-reading finder (Anticheat Build's, verbatim helpers) as VERSE candidates; the instruction; the answer form
{const x=N('Close Enforcer Build');let s=x.parameters.jsCode;
 const REV=`/* ASK 590 (ruling 427 in the closing enforcer): the anti-cheat finder's items become VERSE candidates of the same two reads. A block that quotes the other side's own words (six words or more standing in the other side's rounds outside quotation marks, so a verse both sides quote does not count) is not this side's reading (run 41822). */
const cecRev=(F,links,prev)=>{const out=[],nc=[];let k=Math.max(0,...prev.map(c=>+String(c.id).slice(1)||0));
const REF=/\\b((?:[1-3]\\s?)?[A-Z][a-z]+)\\.?\\s+(\\d{1,3}):(\\d{1,3})(?:\\s?[-–]\\s?(\\d{1,3}))?/g;
${FINDER}const qn=t=>String(t||'').toLowerCase().replace(/[^a-z0-9 ]+/g,' ').replace(/\\s+/g,' ').trim();
const QT=t=>[...String(t||'').matchAll(/"([^"\\n]{20,})"|“([^”\\n]{20,})”/g)].map(m=>qn(m[1]||m[2])).filter(q=>q.split(' ').length>=6);
const CUT=(t,n)=>{t=String(t||'');return t.length>n?t.slice(0,n)+' [...]':t;};const MAXC=120000;/* every item, as the anti-cheat check read them (it had up to 8 calls of 60,000 characters); past 120,000 characters a side the rest is recorded as not checked */
const SIDES={DEFENDER:{P:'CR',close:F.cr4,earlier:[['CR1',F.cr1],['CR2',F.cr2],['CR3',F.cr3]],other:[F.gr1,F.gr2,F.dr3,F.dr4]},CHALLENGER:{P:'DR',close:F.dr4,earlier:[['DR1',F.gr1],['DR2',F.gr2],['DR3',F.dr3]],other:[F.cr1,F.cr2,F.cr3,F.cr4]}};
for(const sd of ['DEFENDER','CHALLENGER']){const X=SIDES[sd];if(!String(X.close||'').trim())continue;const UQ=t=>String(t||'').replace(/"[^"\\n]*"|“[^”\\n]*”/g,' qqq ');const OT=qn(X.other.map(UQ).join('\\n'));const theirs=t=>QT(t).some(q=>OT.includes(q));
 const byKey=new Map();for(const b of blocksOf(X.close)){if(theirs(b.text))continue;const K=keysOf(b.text+' '+(/\\d+:\\d+/.test(b.text)?'':b.head));for(const [key,lab] of K){if(!byKey.has(key))byKey.set(key,{lab,close:[]});const e=byKey.get(key);if(!e.close.includes(b.text))e.close.push(b.text);}}
 const items=[];for(const [key,e] of byKey){const early=[];let inR3=false,er=null;for(const [r,txt] of [...X.earlier].reverse()){for(const b of blocksOf(txt)){if(theirs(b.text))continue;const K=keysOf(b.text+' '+(/\\d+:\\d+/.test(b.text)?'':b.head));if(K.has(key)){early.push('['+r+'] '+b.text);if(!er)er=r;if(r===X.P+'3')inR3=true;}}}
  if(!early.length)continue;const oth=keysOf(X.other.join('\\n')).has(key);items.push({key,lab:e.lab,inR3,oth,er,close:CUT(e.close.join(' / '),1200),earlier:CUT(early.join('\\n'),2400)});}
 items.sort((a,b)=>((b.oth?2:0)+(b.inR3?1:0))-((a.oth?2:0)+(a.inR3?1:0)));
 let used=0;const take=[];for(const it of items){const z=it.close.length+it.earlier.length+200;if(used+z>MAXC){nc.push({side:sd,verse:it.lab});continue;}used+=z;take.push(it);}
 take.forEach(it=>out.push({id:'X'+(++k),side:sd,by:'the code (ASK 590: the reversed-reading finder of ruling 427)',kind:'VERSE',n:it.lab,vkey:it.key,earlier_round:it.er,earlier_q:it.earlier,closing_round:X.P+'4',closing_q:it.close,why:'the same side reads '+it.lab+' in its close and in its earlier rounds; answer CONFIRMED, REVERSED READING or NOT A CONTRADICTION'}));
}
cecRev.nc=nc;return out;};
`;
 s=once(s,"const S=$('Init Seats').first().json;let RS=null;",REV+"const S=$('Init Seats').first().json;let RS=null;",'CEB finder');
 s=once(s,"cands.push(...cecNrh(F,links,cands));","cands.push(...cecNrh(F,links,cands));cands.push(...cecRev(F,links,cands));",'CEB push');
 const PARA="A candidate of kind VERSE names one verse that this side reads in its closing round and in its earlier rounds; its EARLIER words are the same side's own earlier blocks on that verse. Answer it CONFIRMED when a closing sentence and an earlier sentence cannot both be true, as above. Otherwise decide only this: does the close assert a reading of that verse, or draw a conclusion from it, that the same side's earlier words deny or contradict? A reading here is who did what to whom, whom the verse forbids or allows what, what it states or shows. Read each side's own conclusion sentences (the sentences that begin \\\"So\\\", \\\"Therefore\\\", \\\"This shows\\\", or that state what the verse means for the case), not only its quotation of the verse: two passages can quote the same words and draw opposite conclusions.\\nREVERSED READING, in either of two ways: (1) the close draws from the verse a conclusion the earlier words deny, or denies a conclusion they drew (for example, earlier: the verse shows the son is the heir; close: the verse shows the son is not the heir); (2) the close asserts again a claim about the verse that the same side earlier withdrew, dropped or gave up (\\\"I withdraw\\\", \\\"I drop\\\", \\\"I do not claim\\\").\\nNOT A CONTRADICTION for a VERSE candidate: the close repeats, narrows, adds footing, answers the opponent, or keeps the earlier reading; a fuller or more exact quotation or gloss of the same word; a close that itself withdraws, drops or grants an earlier claim; or earlier words that name the verse but state no reading of it.\\nFor REVERSED READING, quote the one closing sentence and the one earlier sentence that decide it, word for word, and name the link whose closing block holds the closing sentence. REVERSED READING is an answer only for a VERSE candidate.\\n";
 s=once(s,"Quote both sentences word for word and name the link:",PARA+"Quote both sentences word for word and name the link:",'CEB para');
 s=once(s,"CONFIRMED | NOT A CONTRADICTION","CONFIRMED | REVERSED READING | NOT A CONTRADICTION",'CEB form');
 s=once(s,"run_token:S.run_token,copy:1}","run_token:S.run_token,copy:1,rev_not_checked:cecRev.nc||[]}",'CEB nc1');
 s=once(s,"run_token:S.run_token,copy:2}","run_token:S.run_token,copy:2,rev_not_checked:cecRev.nc||[]}",'CEB nc2');
 x.parameters.jsCode=s;log.push('Close Enforcer Build '+md5(s).slice(0,8));}
// 2. Close Enforcer Record: REVERSED READING parsed and checked; two reads; the other-side guard; CONFIRMED wins; the reversed list
{const x=N('Close Enforcer Record');let s=x.parameters.jsCode;
 s=once(s,"const CEC_PRE={DEFENDER:'CR',CHALLENGER:'DR'};","const CEC_PRE={DEFENDER:'CR',CHALLENGER:'DR'};\n/* ASK 590: the governing-verse check of the anti-cheat record (pkgOVS), verbatim */\n"+OVS,'CER ovs');
 s=once(s,"(CONFIRMED|NOT A CONTRADICTION)","(CONFIRMED|REVERSED READING|NOT A CONTRADICTION)",'CER LN');
 s=once(s," else row.status='NOT A CONTRADICTION';",` else if(row.answer==='REVERSED READING'){const f=[];const cd=(cands||[]).find(c=>c.id===row.id);
  if(!cd||cd.kind!=='VERSE'||cd.side!==side)f.push('REVERSED READING answers only a VERSE candidate of that side (ASK 590)');
  if(!(row.earlier_round.startsWith(P)&&/[123]$/.test(row.earlier_round)))f.push('the earlier round '+row.earlier_round+' is not one of the '+side.toLowerCase()+'\\'s rounds 1 to 3');
  if(row.closing_round!==P+'4')f.push('the closing round '+row.closing_round+' is not the '+side.toLowerCase()+'\\'s round 4 ('+P+'4)');
  if(CEC_RK[row.earlier_round]&&!cecStands(row.earlier_q,F[CEC_RK[row.earlier_round]]))f.push('the earlier quotation is not found word for word in '+row.earlier_round);
  if(CEC_RK[row.closing_round]&&!cecStands(row.closing_q,F[CEC_RK[row.closing_round]]))f.push('the closing quotation is not found word for word in '+row.closing_round);
  if(!f.length&&cd&&(revOther(cd.vkey,row.closing_q,[String(F[CEC_RK[P+'4']]||'')])||revOther(cd.vkey,row.earlier_q,[1,2,3].map(r=>String(F[CEC_RK[P+r]]||'')))))f.push('a quotation stands under another verse than '+cd.n+' (pkgOVS)');
  row.verse=cd?cd.n:null;row.status=f.length?'NOT REVERSED (form)':'REVERSED';if(f.length)row.note=f.join('; ');}
 else row.status='NOT A CONTRADICTION';`,'CER rev');
 s=once(s,"rows.forEach(row=>{if(row.status!=='CONFIRMED'||!row.side)return;const x=cecN(","rows.forEach(row=>{if((row.status!=='CONFIRMED'&&row.status!=='REVERSED')||!row.side)return;const x=cecN(",'CER osw');
 s=once(s,"  if(!mine.every(o=>__lab(o.p)||__own(o.p,them)))return;","  if(row.status==='REVERSED'&&cecN([1,2,3,4].map(r=>String(F[CEC_RK[O+r]]||'').replace(/\"[^\"\\n]*\"|\u201c[^\u201d\\n]*\u201d/g,' qqq ')).join('\\n')).includes(x)){row.status='NOT REVERSED (other side\\'s words)';row.note=(row.note?row.note+'; ':'')+'the EARLIER quotation is the '+them+'\\'s own words ('+[...new Set(theirsOwn.map(o=>o.r))].join(', ')+', outside quotation marks) and stands in the '+me+'\\'s rounds too ('+[...new Set(mine.map(o=>o.r))].join(', ')+'); a reversed reading needs the side\\'s own earlier reading, not the other side\\'s sentence it quoted (ASK 590, the run 41822 note)';return;}  if(!mine.every(o=>__lab(o.p)||__own(o.p,them)))return;",'CER osw3');
 s=once(s,"row.status='NOT CONFIRMED (other side\\'s words)';","row.status=row.status==='REVERSED'?'NOT REVERSED (other side\\'s words)':'NOT CONFIRMED (other side\\'s words)';",'CER osw2');
 s=once(s,"const cec_log=rows.map(",`/* ASK 590: a reversed reading stands only when the other independent read gives REVERSED READING or CONFIRMED for the same candidate; a CONFIRMED contradiction of the same candidate or the same close sentence wins */
if(__two)rows.forEach(x=>{if(x.status!=='REVERSED')return;if(rows.some(y=>y!==x&&y.copy!==x.copy&&y.id===x.id&&(y.status==='REVERSED'||/^CONFIRMED/.test(y.status))))return;x.status='NOT REVERSED (one check of two)';x.note=(x.note?x.note+'; ':'')+'the other independent check did not give '+x.id+' as reversed or confirmed (ASK 590: two reads needed)';});
if(__two)rows.forEach(x=>{if(x.copy===2&&x.status==='REVERSED')x.status='REVERSED (second check)';});
{const cid=new Set(rows.filter(y=>/^CONFIRMED/.test(y.status)).map(y=>y.id)),cq=new Set(confirmed.map(c=>c.side+'|'+cecN(c.closing_q)));rows.forEach(x=>{if(!/^REVERSED/.test(x.status))return;if(cid.has(x.id)||cq.has(x.side+'|'+cecN(x.closing_q))){x.status='REVERSED (CONFIRMED stands)';x.note=(x.note?x.note+'; ':'')+'the same candidate or close sentence is a confirmed contradiction, which stands (ASK 590 S5 h)';}});}
const reversed=[];{const s2=new Set();for(const x of rows){if(x.status!=='REVERSED')continue;const k=x.side+'|'+x.verse;if(s2.has(k)){x.note=(x.note?x.note+'; ':'')+'the same verse is already listed';continue;}s2.add(k);reversed.push({id:x.id,side:x.side,verse:x.verse,link:x.link,earlier_round:x.earlier_round,earlier_q:x.earlier_q,closing_round:x.closing_round,closing_q:x.closing_q,why:x.why});}}
const cec_log=rows.map(`,'CER two');
 s=once(s,"return [{json:{cec:{skipped:false,model:B.model||'',confirmed,rows,no_answer,none,errors,links},cec_log}}];","return [{json:{cec:{skipped:false,model:B.model||'',confirmed,reversed,rev_not_checked:B.rev_not_checked||[],rows,no_answer,none,errors,links},cec_log}}];",'CER ret');
 x.parameters.jsCode=s;log.push('Close Enforcer Record '+md5(s).slice(0,8));}
// 3. the judges' block: REVERSED CLOSE SENTENCES under the confirmed block, in place of the anti-cheat notes (Panel Build; Build Independent Verdict, though off)
const REVF=`/* ASK 590: the reversed close sentences of the closing enforcer (ruling 427), under the confirmed block; they replace the anti-cheat notes */
const __REV=sd=>{try{if(!$('Close Enforcer Record').isExecuted)return '';const C=$('Close Enforcer Record').first().json.cec||{};const SD=sd==='D'?'DEFENDER':'CHALLENGER';const L=(C.reversed||[]).filter(x=>x&&x.side===SD);if(!L.length)return '';
 return '\\n\\n[REVERSED CLOSE SENTENCES -- found by the system\\'s closing enforcer in two independent reads and checked by code, not by a judge (ruling 427: a close round that reverses the same side\\'s own earlier reading of a verse).'+L.map(x=>'\\n- '+SD+' on '+x.verse+': the closing round ['+x.closing_round+'] says: "'+String(x.closing_q).slice(0,500)+'". The same side said in ['+x.earlier_round+']: "'+String(x.earlier_q).slice(0,500)+'". The close sentence is disregarded (this by itself breaks no link; only a pair listed under CONFIRMED CLOSING CONTRADICTIONS is confirmed); grade this side\\'s earlier answer on '+x.verse+' on its own words, against the verse.').join('')+'\\nA judge that holds a listed sentence is not reversed says so with its reason; the judge keeps the decision (ruling 428).]';}catch(e){return '';}};
`;
for(const n of ['Panel Build','Build Independent Verdict']){const x=N(n);let s=x.parameters.jsCode;s=once(s,"const __CEC=sd=>",REVF+"const __CEC=sd=>",n+' def');
 s=once(s,"+__ACX('D')+__CEC('D')","+__CEC('D')+__REV('D')",n+' D');s=once(s,"+__ACX('C')+__CEC('C')","+__CEC('C')+__REV('C')",n+' C');x.parameters.jsCode=s;log.push(n+' '+md5(s).slice(0,8));}
// 4. the anti-cheat nodes leave the path (they stay in the flow, unconnected)
{const x=N('Close Group Batch Build');let s=x.parameters.jsCode;s=once(s,'["A","Anticheat Build","acx_skip"],','','CGB A');s=once(s,"$('Anticheat Build'),","",'CGB stub');x.parameters.jsCode=s;log.push('Close Group Batch Build '+md5(s).slice(0,8));}
const cn=E.connections;const to=n=>({node:n,type:'main',index:0});
const eq=(a,b,w)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw new Error('wiring differs: '+w);};
eq(cn['Close Enforcer Build'].main,[[to('Anticheat Build')]],'CEB');cn['Close Enforcer Build'].main=[[to('Assume Check Build')]];
eq(cn['Check Save'].main[0],[to('Anticheat Resume')],'Check Save');cn['Check Save'].main[0]=[to('Panel Build')];
eq(cn['Regrade After Quotes?'].main[0],[to('Anticheat Resume')],'RAQ');cn['Regrade After Quotes?'].main[0]=[to('Panel Build')];
for(const n of ['Anticheat Build','Anticheat Resume','Anticheat Needed?','Anticheat Call openrouter','Anticheat Record','Anticheat Only?'])delete cn[n];
log.push('rewired: Close Enforcer Build -> Assume Check Build; Check Save and Regrade After Quotes? (true) -> Panel Build; the six Anticheat nodes unconnected');
fs.writeFileSync('target_engine_590.json',JSON.stringify(E));
const diff=E0.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(E.nodes.find(x=>x.name===n.name))).map(n=>n.name+' '+md5(JSON.stringify(n.parameters)).slice(0,8)+'->'+md5(JSON.stringify(E.nodes.find(x=>x.name===n.name).parameters)).slice(0,8));
console.log(JSON.stringify({log,diff,nodes:E.nodes.length,eng_md5:md5(JSON.stringify(E)).slice(0,8)},null,1));
