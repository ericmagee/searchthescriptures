// pkgQRC probe (W2). Runs live s82 and pkgQRC QR node code on run 34108's closing contradiction (terra's CONTRADICTION line:
// [CR3] "I grant that this is the ordinary means." against [CR4] "Genesis 4:1 therefore cannot supply the sequence for Matthew, ...").
// Rounds: excerpts of debate_results c357d23f (engine_r3 from 1900, defender_r4 from 2250, 600 characters each; SQL position() puts both
// sentences there), with each side's cited verses (read by SQL) on its first round so the new-verse check sees the side's citations.
const fs=require('fs');const fx=JSON.parse(fs.readFileSync(__dirname+'/../fixture_34108.json','utf8'));
const LIVE=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s83.json','utf8'));const live=n=>LIVE.nodes.find(z=>z.name===n).parameters.jsCode;
const neu=n=>fs.readFileSync(__dirname+'/../nodes/'+n.replace(/ /g,'_')+'.js','utf8');
const F=fx.f;const cl=x=>JSON.parse(JSON.stringify(x));
const run=(code,nodes,input)=>{const $=n=>{if(!(n in nodes))throw new Error('unexecuted '+n);const it=nodes[n];return {isExecuted:true,first:()=>cl(it[0]),all:()=>cl(it),last:()=>cl(it[it.length-1])};};
 const inp=input||[];return new Function('$','$input',code)($,{first:()=>cl(inp[0]),all:()=>cl(inp)});};
const J=x=>({json:x});const body={model:'openai/gpt-6.1-terra',messages:[{role:'system',content:'s'},{role:'user',content:'judge prompt'}]};
const base={'Init Seats':[J({run_token:'PROBE',question_trial:true,dry:true})],'Panel Build':[J({judges:['chatgpt','luna','sol'].map(s=>({seat:s,fam:'openrouter',body}))})],
 'Regrade Load':[J({f:F})],'Regrade Row':[J({defender_model:'anthropic/claude-x',challenger_model:'deepseek/x'})]};
let ok=0,bad=0;const T=(n,c,i)=>{if(c){ok++;console.log('OK   '+n+(i?': '+i:''));}else{bad++;console.log('FAIL '+n+(i?': '+i:''));}};
const CQ={round:'CR4',quote:'Genesis 4:1 therefore cannot supply the sequence for Matthew, because Matthew 1:23 sets the virgin as the one with child.',earlier_round:'CR3',earlier_quote:'I grant that this is the ordinary means.',question:'In [CR3] you grant that this is the ordinary means; in [CR4] you say Genesis 4:1 cannot supply the sequence for Matthew. Explain how the two agree.'};
const OQ={round:'DR3',quote:fx.dr3_quote,question:'Explain what the word "espoused" means in this passage.'};
const reply=o=>({choices:[{message:{role:'assistant',content:JSON.stringify(o)},finish_reason:'stop'}]});
// 1. QR Ask Build: the ask carries C1 and C2.
const A=run(neu('QR Ask Build'),base);const ask=A[0].json.body.messages.find(m=>/QUESTION ROUND \(TRIAL\) - BEFORE YOU JUDGE/.test(m.content)).content;
T('1a ask: Commitment 9 carries the new sentence (C1)',ask.includes("When a debater's closing round ([CR4] for the defender, [DR4] for the challenger) says what contradicts its own earlier round"));
T('1b ask: the watch-and-question paragraph (C2) and the optional fields in the form line',ask.includes('Watch the closing rounds for contradictions.')&&ask.includes('add "earlier_round" and "earlier_quote" to a side only for a contradiction question'));
const AL=run(live('QR Ask Build'),base);T('1c ask: apart from C1 and C2 the ask is the live ask',AL[0].json.body.messages.length===A[0].json.body.messages.length&&ask.replace(/ When a debater's closing round[^"]*?closing enforcer\./,'').replace(/\n\nWatch the closing rounds[\s\S]*?leave out the earlier fields\./,'').replace(' (add "earlier_round" and "earlier_quote" to a side only for a contradiction question)','')===AL[0].json.body.messages.find(m=>/BEFORE YOU JUDGE/.test(m.content)).content);
// 2. QR Check.
const chk=(code,d,c)=>{const r=J(reply({defender:d,challenger:c}));return run(code,{...base,'QR Ask Build':A},[r,r,r])[0].json;};
const c2=chk(neu('QR Check'),CQ,OQ);T('2a the 34108 contradiction question passes every check',c2.retry===false&&!c2.faults.defender.length&&!c2.faults.challenger.length,JSON.stringify(c2.faults));
const F1=chk(neu('QR Check'),{...CQ,round:'CR3',quote:CQ.earlier_quote,earlier_round:'CR4',earlier_quote:CQ.quote},OQ).faults.defender;T('2b reversed (closing quoted as earlier): refused',F1.some(x=>/closing round CR4/.test(x))&&F1.some(x=>/earlier round "CR4"/.test(x)),F1.join(' | '));
const F2=chk(neu('QR Check'),{...CQ,earlier_quote:'I grant that this is the only means.'},OQ).faults.defender;T('2c earlier quote not word for word: refused',F2.some(x=>/earlier quotation is not found word for word in CR3/.test(x)),F2.join(' | '));
const F3=chk(neu('QR Check'),{...CQ,earlier_quote:'Galatians 4:4 grants that this is the ordinary means.'},OQ).faults.defender;T('2d a verse the debater never cited, in the earlier quote: refused',F3.some(x=>/Galatians 4:4/.test(x)),F3.join(' | '));
const F4=chk(neu('QR Check'),{...CQ,earlier_round:'DR3'},OQ).faults.defender;T('2e earlier round from the other side: refused',F4.some(x=>/earlier round "DR3"/.test(x)),F4.join(' | '));
const F5=chk(neu('QR Check'),CQ,{...OQ,round:'DR4',earlier_round:'DR3',earlier_quote:'not in the round at all, words'}).faults.challenger;T('2f a challenger contradiction question with a made-up earlier quote: refused',F5.some(x=>/earlier quotation is not found/.test(x)),F5.join(' | '));
// old-form questions: same faults as live
const cases=[[OQ,{round:'CR3',quote:'I grant that this is the ordinary means.',question:'Explain "ordinary".'}],[{...OQ,question:'Defend this.'},{round:'CR9',quote:'x',question:'?'}],[{round:'DR3',quote:'words not there anywhere',question:'Explain Galatians 4:4 here.'},{round:'CR3',quote:'I grant that this is the ordinary means.',question:'Explain the verb.'}]];
let same=true;for(const [c,d] of cases){const a=chk(neu('QR Check'),d,c),b=chk(live('QR Check'),d,c);if(JSON.stringify(a)!==JSON.stringify(b))same=false;}
T('2g questions without the earlier fields: output equal to live QR Check ('+cases.length+' cases, passing and failing)',same);
// 2h (rev 2, W1 3722 E1): an ordinary question whose optional fields are empty, "none", "n/a" or null passes as live passes it.
{let eq=true;const info=[];for(const v of ['','  ','none','None','n/a','N/A','null',null]){const c={...OQ,earlier_round:v,earlier_quote:v};const a=chk(neu('QR Check'),{round:'CR3',quote:'I grant that this is the ordinary means.',question:'Explain the verb.'},c),b=chk(live('QR Check'),{round:'CR3',quote:'I grant that this is the ordinary means.',question:'Explain the verb.'},OQ);
 if(JSON.stringify(a.faults)!==JSON.stringify(b.faults)||a.retry!==b.retry){eq=false;info.push(JSON.stringify(v)+': '+JSON.stringify(a.faults));}}
 T('2h empty, blank, "none", "n/a", "null" and null earlier fields: same faults and retry as live (8 forms)',eq,info.join(' | '));}
{const ck2=chk(neu('QR Check'),CQ,{...OQ,earlier_round:'none',earlier_quote:'none'});const FN2=run(neu('QR Final'),{...base,'QR Check':[J(ck2)]},[J({})]);const c2q=FN2.find(x=>x.json.side==='challenger').json;
 T('2i "none" earlier fields: the debater sees an ordinary question and the item has no earlier fields',/The judge quotes your round DR3: "/.test(c2q.body.messages[1].content)&&c2q.earlier_quote===null&&c2q.earlier_round===null);}
// 3. QR Final: the debater sees both quotes; C4; the record carries the earlier fields.
const ck=chk(neu('QR Check'),CQ,OQ);const FN=run(neu('QR Final'),{...base,'QR Check':[J(ck)]},[J({})]);
const dq=FN.find(x=>x.json.side==='defender').json;const um=dq.body.messages[1].content;
T('3a defender sees: earlier round CR3 quoted, then closing round CR4, then the question',/The judge quotes your earlier round CR3: "I grant that this is the ordinary means\."\nand your closing round CR4: "Genesis 4:1 therefore/.test(um));
T('3b debater prompt carries C4',dq.body.messages[0].content.includes('If the judge quotes two of your passages, explain how they agree; you cannot withdraw or change either one here.'));
T('3c record and item carry earlier_round and earlier_quote',FN[0].json.record.find(r=>r.side==='defender').earlier_round==='CR3'&&dq.earlier_round==='CR3'&&dq.earlier_quote===CQ.earlier_quote);
const cq=FN.find(x=>x.json.side==='challenger').json;T('3d an ordinary question reads as before ("The judge quotes your round DR3")',/The judge quotes your round DR3: "/.test(cq.body.messages[1].content)&&cq.earlier_quote===null);
// 4. QR Merge: C5 and the contradiction label.
const M=run(neu('QR Merge'),{...base,'QR Final':FN},FN.map(()=>J({choices:[{message:{content:'They agree because ...'},finish_reason:'stop'}]})))[0].json;
T('4a judges read C5',M.qa_text.includes('A question that quotes two passages of one debater is a contradiction question.'));
T('4b the block names a CONTRADICTION QUESTION with both quotes',/to the defender, CONTRADICTION QUESTION, quoting \[CR3\]: "I grant that this is the ordinary means\." and \[CR4\]: "Genesis 4:1/.test(M.qa_text),M.qa_text.split('\n').find(l=>/CONTRADICTION QUESTION/.test(l)).slice(0,160));
T('4c an ordinary question line reads as before',/to the challenger, quoting \[DR3\]: "/.test(M.qa_text));

console.log('--- W1 edge cases ---');
const E=(lbl,d)=>{const n=chk(neu('QR Check'),d,OQ).faults.defender, l=chk(live('QR Check'),{round:d.round,quote:d.quote,question:d.question},OQ).faults.defender;console.log(lbl+'\n   QRC faults: '+JSON.stringify(n)+'\n   live faults (same question without earlier fields): '+JSON.stringify(l));return n;};
const ORD={round:'CR3',quote:'I grant that this is the ordinary means.',question:'Explain what "ordinary" means here.'};
const e1=E('E1 ordinary question, earlier fields as empty strings',{...ORD,earlier_round:'',earlier_quote:''});
const e2=E('E2 ordinary question, earlier fields null',{...ORD,earlier_round:null,earlier_quote:null});
const e3=E('E3 ordinary question, earlier fields "none"',{...ORD,earlier_round:'none',earlier_quote:'none'});
const e4=E('E4 contradiction question, round written "[CR4]" and earlier "[CR3]"',{...CQ,round:'[CR4]',earlier_round:'[CR3]'});
const e5=E('E5 contradiction question, earlier round lower case "cr3"',{...CQ,earlier_round:'cr3'});
// QR Final / Merge on a passing ordinary question that carries empty strings: does the label stay ordinary?
const ckE=chk(neu('QR Check'),{...ORD,earlier_round:'',earlier_quote:''},OQ);
console.log('E1 retry flag: '+ckE.retry);
T('E1 an ordinary question with empty earlier fields is NOT refused',e1.length===0,JSON.stringify(e1));
T('E2 null earlier fields: no new fault',e2.length===0);
T('E4 bracketed rounds accepted',e4.length===0,JSON.stringify(e4));
T('E5 lower-case earlier round accepted',e5.length===0,JSON.stringify(e5));
console.log('\n'+ok+' OK, '+bad+' FAIL');