// pkgQRC probe (W2). Runs live s82 and pkgQRC QR node code on run 34108's closing contradiction (terra's CONTRADICTION line:
// [CR3] "I grant that this is the ordinary means." against [CR4] "Genesis 4:1 therefore cannot supply the sequence for Matthew, ...").
// Rounds: excerpts of debate_results c357d23f (engine_r3 from 1900, defender_r4 from 2250, 600 characters each; SQL position() puts both
// sentences there), with each side's cited verses (read by SQL) on its first round so the new-verse check sees the side's citations.
const fs=require('fs');const fx=JSON.parse(fs.readFileSync(__dirname+'/../fixture_34108.json','utf8'));
const LIVE=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s82.json','utf8'));const live=n=>LIVE.nodes.find(z=>z.name===n).parameters.jsCode;
const neu=n=>fs.readFileSync(__dirname+'/../nodes/'+n.replace(/ /g,'_')+'.js','utf8');
const F=fx.f;const cl=x=>JSON.parse(JSON.stringify(x));
const run=(code,nodes,input)=>{const $=n=>{if(!(n in nodes))throw new Error('unexecuted '+n);const it=nodes[n];return {isExecuted:true,first:()=>cl(it[0]),all:()=>cl(it),last:()=>cl(it[it.length-1])};};
 const inp=input||[];return new Function('$','$input',code)($,{first:()=>cl(inp[0]),all:()=>cl(inp)});};
const J=x=>({json:x});const body={model:'openai/gpt-6.1-terra',messages:[{role:'system',content:'s'},{role:'user',content:'judge prompt'}]};
const base={'Init Seats':[J({run_token:'PROBE',question_trial:true,dry:true})],'Panel Build':[J({judges:['chatgpt','luna','sol'].map(s=>({seat:s,fam:'openrouter',body}))})],
 'Regrade Load':[J({f:F})],'Regrade Row':[J({defender_model:'anthropic/claude-x',challenger_model:'deepseek/x'})]};
let ok=0,bad=0;const T=(n,c,i)=>{if(c){ok++;console.log('OK   '+n+(i?': '+i:''));}else{bad++;console.log('FAIL '+n+(i?': '+i:''));}};
const reply=o=>({choices:[{message:{role:'assistant',content:JSON.stringify(o)},finish_reason:'stop'}]});
// W4 grade of pkgQRC: the probe's QR Check runs, but on run 34108's FULL saved rounds (not excerpts), plus edge cases.
const R=n=>{const d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/34108_'+n+'_Extract.json','utf8'));const r=Array.isArray(d)?d[0]:d;return String(r.data.main[0][0].json.raw||'');};
const FF={topic:F.topic,cr1:R('D1'),cr2:R('D2B'),cr3:R('D3B'),cr4:R('D4B'),gr1:R('C1B'),gr2:R('C2B'),dr3:R('C3B'),dr4:R('C4')};
base['Regrade Load']=[J({f:FF})];
const A=run(neu('QR Ask Build'),base);base['QR Ask Build']=A;
const chk=(code,d,c)=>{const r=J(reply({defender:d,challenger:c}));return run(code,base,[r,r,r])[0].json;};
const CQ={round:'CR4',quote:'Genesis 4:1 therefore cannot supply the sequence for Matthew',earlier_round:'CR3',earlier_quote:'I grant that this is the ordinary means',question:'In [CR3] you grant this is the ordinary means; in [CR4] you say Genesis 4:1 cannot supply the sequence. How do the two agree?'};
const dq=FF.dr3.replace(/\s+/g,' ').match(/[A-Za-z][^."\n]{40,90}/)[0];const OQ={round:'DR3',quote:dq,question:'Explain this sentence.'};
console.log('round lengths',Object.fromEntries(Object.entries(FF).map(([k,v])=>[k,String(v).length])));
// W4 regrade rev 2: empty forms on an ordinary question must equal live; a real contradiction question still checked.
const ORD={round:'CR3',quote:'I grant that this is the ordinary means',question:'Explain.'};
const forms=[['',''],['   ',' '],['none','none'],['None','N/A'],['null',null],['-','-'],[null,''],['na','']];
let allEq=true;for(const [er,eq] of forms){const d={...ORD,earlier_round:er,earlier_quote:eq};const a=chk(neu('QR Check'),d,OQ),b=chk(live('QR Check'),d,OQ);if(JSON.stringify(a.faults)!==JSON.stringify(b.faults)||a.retry!==b.retry){allEq=false;console.log('  differs',JSON.stringify([er,eq]),JSON.stringify(a.faults));}}
T('R1 '+forms.length+' empty forms on an ordinary question: faults and retry equal to live',allEq);
const g1=chk(neu('QR Check'),CQ,OQ);T('R2 the 34108 contradiction question still passes',!g1.faults.defender.length&&g1.retry===false);
const g2=chk(neu('QR Check'),{...CQ,earlier_round:''},OQ).faults.defender;T('R3 a real earlier quote with a blank earlier round is still checked and refused',g2.some(x=>/earlier round/.test(x)),g2.join(' | '));
const g3=chk(neu('QR Check'),{...CQ,earlier_quote:'none'},OQ).faults.defender;T('R4 CR4 question with earlier round CR3 but quote "none": still checked and refused',g3.some(x=>/earlier quotation/.test(x)),g3.join(' | '));
const g4=chk(neu('QR Check'),{...CQ,earlier_quote:'I deny that this is the ordinary means'},OQ).faults.defender;T('R5 invented earlier quote still refused',g4.some(x=>/not found word for word/.test(x)));
console.log(ok+' OK, '+bad+' FAIL');
