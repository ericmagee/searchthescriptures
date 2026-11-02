// Replay of the checkers (judge_fix3) on the stored judgments of runs 32212, 32228, 32255 (every panel seat, the single judge, and in 32255 the
// Qwen alternate's first reply, enforcer row 21), base (live e9f2a2dd) and new. Items = drvCheck + drvLedger (K-G6/K-G8) + drvBroken (K-G7), on a
// judge prompt rebuilt from the stored rounds (Panel Build's ledger, base or new), sent through __orc as the seat's model was, so the cached
// array form of Gemini and Qwen is reproduced (A4). Cure replies: 32255, the seat's stored full reply (debate_enforcer_log); 32212 and 32228 (before
// the enforcer log), the reply rebuilt from the stored audit report as judge_fix2 did, and "+R": the same with one RESPONSE line per item (those
// runs predate W1, so without it every item is UNCURED in base and new alike). "counted" is the checker's part only: every item CURED.
const fs=require('fs');const D=__dirname+'/../';const RL=require('./replay_lib.cjs');const {fullLib,drvLib}=require('./lib.cjs');
const E=JSON.parse(fs.readFileSync(D+'data/enforcer_log_32255.json','utf8'));
const PWL=v=>{const s=fs.readFileSync(D+v+'/Panel Build.js','utf8');return new Function(s.slice(s.indexOf('const PWL='),s.indexOf('\nconst LEDGER='))+';return PWL;')();};
const orcS=fs.readFileSync(D+'base/Panel Build.js','utf8').match(/const __orc=[^\n]*/)[0];const __orc=new Function(orcS+';return __orc;')();
const MODEL={deepseek:['deepseek','deepseek-flash'],gemini:['openrouter','google/gemini-3.8-flash'],chatgpt:['openrouter','openai/gpt-6.1-terra'],glm:['openrouter','z-ai/glm-5.3'],qwen:['openrouter','qwen/qwen3.8-max-0902'],single:['deepseek','deepseek-flash']};
const out=[];const libs={};const L=(v,f)=>libs[v+f]||(libs[v+f]={d:drvLib(D+v+'/'+f),c:fullLib(D+v+'/Panel Cure Check.js')});
function seatRun(run,seat,raw,panel,reply0,v){const r=RL.run(run);const F={cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3};
 const J=RL.judgment(raw,panel);const f=J.fields;const T=['[CR1] DEFENDER R1',F.cr1,'[DR1] CHALLENGER R1',F.gr1,'[CR2] DEFENDER R2',F.cr2,'[DR2] CHALLENGER R2',F.gr2,'[CR3] DEFENDER R3 -- LINK ROUND (defender exhibit-or-concede)',F.cr3,'[DR3] CHALLENGER R3 -- LINK ROUND (challenger exhibit-or-concede)',F.dr3];
 let user='DEBATE TRANSCRIPT';for(let i=0;i<T.length;i+=2)user+='\n\n=== '+T[i]+' ===\n'+T[i+1];
 const [fam,model]=MODEL[seat];const body=__orc({model,max_tokens:64000,messages:[{role:'system',content:'RULES\n\n'+PWL(v).judgeBlock(F)},{role:'user',content:user}]},fam,model,'replay');
 const lib=L(v,panel?'Panel Payloads.js':'Extract Independent Verdict.js');const pt=lib.d.drvPromptText(body);const CPV=panel?{DEFENDER:f.counted_premises_defender,CHALLENGER:f.counted_premises_challenger}:null;
 const d=lib.d.drvCheck(J.text,f.conceded_links,f.challenger_conceded_links,f.defense_standing,f.challenge_standing,false);const items=d.items.slice();
 lib.d.drvLedger(J.text,pt,f.conceded_links,f.challenger_conceded_links,f.defense_standing,f.challenge_standing,CPV).items.forEach(x=>items.push(x));
 lib.d.drvBroken(J.text,f.conceded_links,f.defense_standing,items,f.challenger_conceded_links,f.challenge_standing,pt,CPV).items.forEach(x=>items.push(x));
 const C=L(v,'Panel Payloads.js').c;const reply=typeof reply0==='function'?reply0(items,C):reply0;
 const vs=items.length?C.cureVerdicts(items,reply,C.cureBroken(J.text),RL.rounds(r)):[];
 return {items:items.map(x=>x.rule+' '+(x.link||x.side)),unc:vs.filter(x=>x.status!=='CURED').map(x=>x.rule+' '+(x.link||x.side)),vs,marks:d.marks.filter(m=>/K-G4 NOT RAISED/.test(m))};}
const addR=rep=>(items,C)=>rep.ok?{ok:true,text:rep.text+'\n'+items.map(x=>'RESPONSE: '+C.cureLabel(x)+' | I accept the mark; replay line added to test the rest of the check.').join('\n')}:rep;
for(const run of ['32212','32228','32255']){const r=RL.run(run);
 const seats=r.judgments.map(j=>({seat:j.seat,raw:j.verdict_raw,panel:true,stored:j.drv_uncured})).concat([{seat:'single',raw:r.independent_verdict_raw,panel:false,stored:'-'}]);
 if(run==='32255')seats.push({seat:'qwen',raw:E.find(e=>e.id===21).full_reply,panel:true,stored:'13 (not seated)',alt:true});
 for(const S of seats){let reply;
  if(run==='32255'){const e=E.find(x=>x.seat===S.seat&&x.kind==='cure');reply=e?{ok:true,text:e.full_reply}:{ok:false,why:'no cure call was made for this seat'};}
  else{const J=RL.judgment(S.raw,S.panel);reply=J.reports.length?RL.reply(J.reports):{ok:false,why:'no cure reply stored'};}
  const b=seatRun(run,S.seat,S.raw,S.panel,reply,'base'),n=seatRun(run,S.seat,S.raw,S.panel,reply,'new');
  const bR=run==='32255'?null:seatRun(run,S.seat,S.raw,S.panel,addR(reply),'base'),nR=run==='32255'?null:seatRun(run,S.seat,S.raw,S.panel,addR(reply),'new');
  out.push({run,seat:S.seat+(S.alt?' (alt)':''),stored:S.stored,b,n,bR,nR});}}
const cnt=x=>x.unc.length?'NO':'yes';
console.log('run   seat          stored-uncured | BASE items/uncured counted | NEW items/uncured counted | +R: BASE counted / NEW counted');
for(const x of out){console.log(`${x.run} ${x.seat.padEnd(13)} ${String(x.stored).padStart(15)} | ${String(x.b.items.length).padStart(3)}/${String(x.b.unc.length).padEnd(3)} ${cnt(x.b).padEnd(3)}            | ${String(x.n.items.length).padStart(3)}/${String(x.n.unc.length).padEnd(3)} ${cnt(x.n).padEnd(3)}           | ${x.bR?cnt(x.bR)+' / '+cnt(x.nR)+' ('+x.bR.unc.length+' -> '+x.nR.unc.length+' uncured)':'-'}`);
 const gone=x.b.items.filter(i=>!x.n.items.includes(i)),added=x.n.items.filter(i=>!x.b.items.includes(i));
 if(gone.length)console.log('      marks removed: '+gone.join(', '));if(added.length)console.log('      marks added:   '+added.join(', '));
 if(x.n.marks.length)console.log('      '+x.n.marks.map(m=>m.slice(0,140)).join(' / '));
 const ch=x.n.vs.filter(v=>{const o=x.b.vs.find(z=>z.rule===v.rule&&(z.link||z.side)===(v.link||v.side));return o&&o.status!==v.status;});
 ch.forEach(v=>{const o=x.b.vs.find(z=>z.rule===v.rule&&(z.link||z.side)===(v.link||v.side));console.log('      status changed: '+v.rule+' '+(v.link||v.side)+': '+o.status+' -> '+v.status+' ('+String(v.why||'').slice(0,90)+')');});
 if(x.n.unc.length)console.log('      NEW uncured: '+x.n.unc.join(', '));}
// the enforcer log, row by row (32255): stored vs new status and RESPONSE line, the item re-checked on the seat's own stored reply
console.log('\nENFORCER LOG 32255, every row: id seat rule item | stored status -> new status | RESPONSE line: same or changed');
const R=RL.rounds(RL.run('32255'));
for(const e of E){if(e.kind!=='cure'){console.log(String(e.id).padStart(2)+' '+e.seat+' '+e.kind+' '+(e.item||'')+' | not a cure row'+(e.kind==='alternate_reply'?' (its judgment is replayed above as qwen (alt))':''));continue;}
 const it={rule:e.rule,side:/^K-G6 /.test(e.rule+' ')?(/DEFENDER/.test(e.item)?'DEFENDER':'CHALLENGER'):(e.item.startsWith('D')||e.item==='KEYSTONE'?'CHALLENGER':'DEFENDER'),link:e.rule==='K-G6'?e.item.replace(/^(DEFENDER|CHALLENGER)\s+/,'$1 '):e.item,line:e.flagged_line};
 if(e.rule==='K-G6'){it.side=e.item.split(' ')[0];it.link=e.item;}
 {const g=String(e.flagged_line||'').toUpperCase().match(/(DEFENDER|CHALLENGER) LINK BROKEN/);if(g&&/^K-G[147]$/.test(e.rule))it.side=g[1];} // K-G1/K-G4/K-G7 belong to the side whose link is graded BROKEN
 const g=v=>fullLib(D+v+'/Panel Cure Check.js').cureVerdicts([it],{ok:true,text:e.full_reply},null,R)[0];const b=g('base'),n=g('new');
 const same=(n.response||'')===(e.response_line||'');
 console.log(String(e.id).padStart(2)+' '+e.seat.padEnd(8)+' '+e.rule.padEnd(6)+' '+e.item.padEnd(22)+' | '+e.cure_status+' -> '+n.status+(b.status!==e.cure_status?' (base replay '+b.status+')':'')+' | RESPONSE '+(same?'same':'CHANGED: "'+String(n.response).slice(0,70)+'"'));}
