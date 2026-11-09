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
const f0=chk(neu('QR Check'),CQ,OQ);T('1 34108 contradiction question passes on full rounds',f0.retry===false&&!f0.faults.defender.length&&!f0.faults.challenger.length,JSON.stringify(f0.faults));
const f1=chk(neu('QR Check'),{...CQ,earlier_round:'[cr3]'},OQ);T('2 earlier_round written "[cr3]" is read as CR3',!f1.faults.defender.length,JSON.stringify(f1.faults.defender));
const f2=chk(neu('QR Check'),{...CQ,earlier_round:null},OQ).faults.defender;T('3 earlier quote with no earlier round: refused',f2.some(x=>/earlier round/.test(x)),f2.join(' | '));
const f3=chk(neu('QR Check'),{...CQ,earlier_quote:''},OQ).faults.defender;T('4 earlier round with an empty earlier quote: refused',f3.some(x=>/earlier quotation missing/.test(x)),f3.join(' | '));
const f4=chk(neu('QR Check'),{...CQ,earlier_round:'CR1'},OQ).faults.defender;T('5 true words but wrong earlier round: refused',f4.some(x=>/not found word for word in CR1/.test(x)),f4.join(' | '));
const f5=chk(neu('QR Check'),{...CQ,round:'CR3',quote:'I grant that this is the ordinary means'},OQ).faults.defender;T('6 contradiction question not quoting the closing round: refused',f5.some(x=>/closing round CR4/.test(x)),f5.join(' | '));
const f6=chk(neu('QR Check'),{...CQ,earlier_quote:'I **grant** that this is the ordinary means'},OQ);T('7 markdown in the earlier quote is tolerated as live tolerates it in "quote"',!f6.faults.defender.length,JSON.stringify(f6.faults.defender));
const cc=FF.dr4.replace(/\s+/g,' ').match(/[A-Za-z][^."\n]{40,80}/)[0],ce=FF.gr2.replace(/\s+/g,' ').match(/[A-Za-z][^."\n]{40,80}/)[0];
const f7=chk(neu('QR Check'),CQ,{round:'DR4',quote:cc,earlier_round:'DR2',earlier_quote:ce,question:'How do these agree?'});T('8 a real-words challenger DR2 vs DR4 question passes',!f7.faults.challenger.length,JSON.stringify(f7.faults.challenger));
const f8=chk(neu('QR Check'),{...CQ,earlier_round:'CR4',earlier_quote:CQ.quote},OQ).faults.defender;T('9 closing quoted against itself: refused',f8.some(x=>/earlier round "CR4"/.test(x)),f8.join(' | '));
let same=true;for(const [d,c] of [[{round:'CR3',quote:'I grant that this is the ordinary means',question:'Explain.'},OQ],[{round:'CR4',quote:'not in the round, these words',question:'?'},{...OQ,round:'CR1'}]]){if(JSON.stringify(chk(neu('QR Check'),d,c))!==JSON.stringify(chk(live('QR Check'),d,c)))same=false;}
T('10 ordinary questions on full rounds: output equal to live',same);
console.log(ok+' OK, '+bad+' FAIL');
