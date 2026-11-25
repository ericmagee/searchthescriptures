// ASK 628 tests. node t628.cjs base_eng base_child target_eng target_child fx/r42373.json
const fs=require('fs');const [,,BE,BC,TE,TC,FX]=process.argv;const J=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const be=J(BE),bc=J(BC),te=J(TE),tc=J(TC),R=J(FX);let fails=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fails++;};
const P=d=>Object.fromEntries(d.nodes.map(n=>[n.name,JSON.stringify(n.parameters)]));const node=(d,n)=>d.nodes.find(k=>k.name===n);
const ch=(a,b)=>Object.keys(P(b)).filter(k=>P(a)[k]!==P(b)[k]).sort();
ok(JSON.stringify(ch(be,te))==='["Build Independent Verdict","Build Save Body","D4 Build","D4B Build","Panel Build","Shared Library"]','C5 engine: only the six named nodes change '+JSON.stringify(ch(be,te)));
ok(JSON.stringify(ch(bc,tc))==='["Shared Library"]','C5 child: only the Shared Library changes');
ok(JSON.stringify(be.connections)===JSON.stringify(te.connections)&&JSON.stringify(bc.connections)===JSON.stringify(tc.connections),'C5 connections unchanged');
const split=T=>({L:JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))});
const reb=(p,k)=>p.M[k].p.map(e=>typeof e==='number'?p.L[e]:typeof e[0]==='string'?e[0]:p.L.slice(e[0],e[1]+1).join('\n')).join('\n');
const SL=d=>node(d,'Shared Library').parameters.jsCode;const pb=split(SL(be)),pt=split(SL(te)),pc=split(SL(tc));
ok(Object.keys(pb.M).every(k=>reb(pb,k)===reb(pt,k)),'C5 all '+Object.keys(pb.M).length+' existing MAP entries rebuild the same text');
ok(JSON.stringify(pt.L)===JSON.stringify(pc.L)&&JSON.stringify(pt.M['PRESS LIST'])===JSON.stringify(pc.M['PRESS LIST'])&&Object.keys(pc.M).filter(k=>k!=='PRESS LIST').every(k=>JSON.stringify(pc.M[k])===JSON.stringify(split(SL(bc)).M[k])),'C5 engine and child LIB lines equal; the PRESS LIST entry equal; every other child MAP entry unchanged');
ok(reb(pt,'PRESS LIST').length===pt.M['PRESS LIST'].n,'PRESS LIST rebuilds at its stated length');
const PRESSL=new Function(reb(pt,'PRESS LIST')+'\nreturn PRESSL;')();
for(const [d,n] of [[te,'Build Save Body'],[te,'D4 Build'],[te,'D4B Build'],[te,'Panel Build'],[te,'Build Independent Verdict']]){let e=null;try{new Function('$','$input',node(d,n).parameters.jsCode);}catch(x){e=x.message;}ok(!e,'C5 compiles: '+n+(e?' '+e:''));}
// C1 Build Save Body audit byte-equal
const blk=(s,a,end)=>{const i=s.indexOf(a);return s.slice(i,s.indexOf(end,i)+end.length);};
const oldB=blk(node(be,'Build Save Body').parameters.jsCode,"try{if(d.cr4){const __RF=","}}catch(e){}"),newB=blk(node(te,'Build Save Body').parameters.jsCode,"try{if(d.cr4){const PRESSL=","}}catch(e){}");
const $S=n=>{if(n==='Shared Library')return {params:{jsCode:SL(te)}};throw new Error('no '+n);};
const runA=(code,d)=>{const FF=[];new Function('$','d','FF',code)($S,d,FF);return FF.join('|');};
const a0=runA(oldB,R),a1=runA(newB,R);ok(a0===a1&&a0===R.audit,'C1 42373 audit line byte-equal: old, new and stored ('+a1.slice(0,70)+'...)');
{const R2={...R,dr4:'PRESSED WITH:\n- [L1] Exodus 3:14: "I AM THAT I AM"'};ok(runA(oldB,R2)===runA(newB,R2)&&runA(newB,R2)!==a1,'C1 audit byte-equal with a dr4 press too (the audit keeps reading dr4)');}
ok(PRESSL.pressed([R.gr1,R.gr2,R.dr3,R.dr4]).length===31&&PRESSL.open([R.gr1,R.gr2,R.dr3,R.dr4],R.cr4).length===20,'C1 PRESS LIST gives 31 pressed and 20 open on 42373');
// C2 D4 Build block
const d4=node(te,'D4 Build').parameters.jsCode;const d4b=d4.slice(d4.indexOf('{const __PL='),d4.indexOf('\nconst __ZH='));
const runD4=(prof,RW)=>{const msgs=[{role:'system',content:'S'},{role:'user',content:'U'}];const $=n=>{if(n==='Init Seats')return {first:()=>({json:{defender:{profile:prof}}})};return $S(n);};new Function('$','RW','msgs',d4b)($,RW,msgs);return msgs;};
{const m=runD4('oracle',R);const t=m[1].content;const n=(t.match(/\((\d+)\): /)||[])[1];ok(t.startsWith('U\n\nTHE VERSES PRESSED AGAINST YOU')&&n==='31'&&t.includes('Matthew 1:18')&&t.includes('1 Corinthians 7:5'),'C2 Oracle close prompt carries the 31 pressed verses');}
ok(JSON.stringify(runD4('plain',R))===JSON.stringify([{role:'system',content:'S'},{role:'user',content:'U'}]),'C2 other profiles: prompt unchanged');
{const R2={...R,dr4:'PRESSED WITH:\n- [L1] Exodus 3:14: "I AM THAT I AM"'};ok(JSON.stringify(runD4('oracle',R2))===JSON.stringify(runD4('oracle',R)),'C2b a press in dr4 only does not change the prompt list (W1 N2)');}
// C3 D4B Build whole node
const runD4B=(prof,close)=>{const raws={'D1 Extract':R.cr1,'C1B Extract':R.gr1,'D2B Extract':R.cr2,'C2B Extract':R.gr2,'D3B Extract':R.cr3,'C3B Extract':R.dr3};
 const $=n=>{if(n==='Shared Library')return {params:{jsCode:SL(te)}};if(n==='Init Seats')return {first:()=>({json:{defender:{profile:prof}}}),isExecuted:true};if(n==='D4 Extract')return {first:()=>({json:{raw:close,run_token:'T'}}),isExecuted:true};
  if(n==='D4 Build')return {first:()=>({json:{call:{fam:'anthropic',model:'m',body:{messages:[{role:'user',content:'U'}]}}}}),isExecuted:true};if(raws[n]!==undefined)return {first:()=>({json:{raw:raws[n]}}),isExecuted:true};return {isExecuted:false,first:()=>{throw new Error('no '+n);},all:()=>[]};};
 return new Function('$','$input',node(te,'D4B Build').parameters.jsCode)($,{first:()=>({json:{}}),all:()=>[]})[0].json;};
const runD4Bold=(prof,close)=>{const s=node(be,'D4B Build').parameters.jsCode;const raws={'D1 Extract':R.cr1,'C1B Extract':R.gr1,'D2B Extract':R.cr2,'C2B Extract':R.gr2,'D3B Extract':R.cr3,'C3B Extract':R.dr3};
 const $=n=>{if(n==='Shared Library')return {params:{jsCode:SL(be)}};if(n==='Init Seats')return {first:()=>({json:{defender:{profile:prof}}}),isExecuted:true};if(n==='D4 Extract')return {first:()=>({json:{raw:close,run_token:'T'}}),isExecuted:true};
  if(n==='D4 Build')return {first:()=>({json:{call:{fam:'anthropic',model:'m',body:{messages:[{role:'user',content:'U'}]}}}}),isExecuted:true};if(raws[n]!==undefined)return {first:()=>({json:{raw:raws[n]}}),isExecuted:true};return {isExecuted:false,first:()=>{throw new Error('no '+n);},all:()=>[]};};
 return new Function('$','$input',s)($,{first:()=>({json:{}}),all:()=>[]})[0].json;};
{const o=runD4B('oracle',R.cr4),b=runD4Bold('oracle',R.cr4);console.log('   42373 close: live D4B resend='+b.resend+' ('+b.why+'); new resend='+o.resend+' ('+o.why+')');
 ok(o.resend===true&&(o.press_open||[]).length===20&&/PRESSED VERSES WITH NO ANSWER LINE/.test(o.note)&&o.note.includes('Luke 2:49'),'C3 D4B re-calls the 42373 close naming the 20 unanswered verses');
 ok(o.call&&o.call.body.messages.length===3&&o.call.body.messages[2].content===o.note,'C3 one re-call request: the close plus one note');}
const allAns=R.cr4+'\n'+PRESSL.pressed([R.gr1,R.gr2,R.dr3]).map(v=>'ANSWER: '+v+' -- D1 -- "x"').join('\n');
{const o=runD4B('oracle',allAns),b=runD4Bold('oracle',allAns);ok((o.press_open||[]).length===0&&o.resend===b.resend,'C3 every verse answered: this trigger adds nothing (resend '+o.resend+', as live)');}
{const o=runD4B('plain',R.cr4),b=runD4Bold('plain',R.cr4);ok(o.resend===b.resend&&(o.press_open||[]).length===0&&(o.note||'')===(b.note||''),'C3 other profiles: same decision and note as live');}
ok(!/C4 Extract|dr4|DR4/.test(node(te,'D4B Build').parameters.jsCode.slice(node(te,'D4B Build').parameters.jsCode.indexOf('let __un='),node(te,'D4B Build').parameters.jsCode.indexOf('/* ASK 628: pressed'))),'C2b the re-call list reads DR1 to DR3 only, no dr4 source (W1 N2)');
// C4 judges' line
const pbc=node(te,'Panel Build').parameters.jsCode;const jl=pbc.slice(pbc.indexOf('const __PCL='),pbc.indexOf('const LEDGER='));
const runJ=(prof,F)=>{const $=n=>{if(n==='Init Seats')return {first:()=>({json:{defender:{profile:prof}}})};return $S(n);};return new Function('$','F',jl+'return __PCL;')($,F);};
{const t=runJ('oracle',R);ok(/^\n\nPRESSED VERSES WITH NO ANSWER LINE IN THE DEFENDER'S CLOSE \[CR4\]/.test(t)&&/\(20\): /.test(t),'C4 judges get the 20 still unanswered on the 42373 close');}
ok(runJ('oracle',{...R,cr4:allAns})==='','C4 all answered: no line (packet byte-equal)');ok(runJ('plain',R)==='','C4 other profiles: no line');
ok(runJ('oracle',{...R,dr4:'PRESSED WITH:\n- [L1] Exodus 3:14: "I AM"'})===runJ('oracle',R),'C2b the judges\' list never reads dr4 (W1 N2)');
const bvc=node(te,'Build Independent Verdict').parameters.jsCode;ok(bvc.includes("+__PCL;")&&bvc.includes(jl.replace(/F\./g,'d.').replace(/\[F\./g,'[d.'))||bvc.includes('const __PCL='),'C4 Build Independent Verdict carries the same line on its ledger');
ok(pbc.includes("})());\n".slice(0,0))&&pbc.includes("catch(e){return '';}})())+__PCL;"),'C4 Panel Build ledger ends with the line');
// ASK 599 tags
ok(['Build Save Body','D4 Build','D4B Build','Panel Build','Build Independent Verdict'].every(n=>/ASK 628/.test(node(te,n).parameters.jsCode))&&/ASK 628/.test(reb(pt,'PRESS LIST')),'C5 ASK 599: every change tagged ASK 628');
console.log(fails?'FAILED '+fails:'ALL PASS');
