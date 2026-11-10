// W3 grade of pkgQRD. usage: node w3_QRD.cjs <live fetch-back> <candidate>
process.chdir(__dirname+'/../..');const fs=require('fs');const RM=require('../../pkgLIB/runner_model.cjs');
const Ld=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const LP=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s110.json',CP=process.argv[3]||'pkgQRD/parent_s110_QRD.json';
const L=Ld(LP),N=Ld(CP);console.log('live '+LP+' ('+L.versionId+'); candidate '+CP);
const code=(w,n)=>w.nodes.find(x=>x.name===n).parameters.jsCode;const S=JSON.stringify;const cl=x=>JSON.parse(S(x));
let ok=true;const chk=(n,c,x)=>{if(!c)ok=false;console.log((c?'OK   ':'FAIL ')+n+(x?': '+x:''));};
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34299_full.json','utf8')).data.resultData.runData;const out=n=>X[n]?X[n][0].data.main[0]:null;
const AF=Object.getPrototypeOf(async function(){}).constructor;
async function go(w,name,over,input){const c=code(w,name);const s=n=>over&&over[n]!==undefined?over[n]:out(n);const inp=input||[];
 const mk=n=>{const it=s(n);if(!it){const no=()=>{throw new Error('unexecuted '+n);};return {isExecuted:false,first:no,last:no,all:no,params:{}};}return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params:{}};};
 const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp)};
 return (await new AF('$','$input','$json','$execution',c)(RM.gate(RM.needs(c),mk),$input,inp[0]&&inp[0].json,{id:'34299'})).map(x=>x.json);}
const rep=o=>({json:{choices:[{message:{content:typeof o==='string'?o:S(o)}}]}});
(async()=>{
 // R1
 const dn=N.nodes.filter(n=>S(n)!==S(L.nodes.find(x=>x.name===n.name))).map(n=>n.name).sort();
 const tot=W=>W.nodes.reduce((s,n)=>s+(n.parameters&&typeof n.parameters.jsCode==='string'?n.parameters.jsCode.length:0),0);
 chk('R1 nodes '+L.nodes.length+'/'+N.nodes.length+'; differing '+S(dn)+'; connections equal',L.nodes.length===418&&N.nodes.length===418&&S(dn)===S(['QR Check','QR Final'])&&S(L.connections)===S(N.connections),'QR Check '+code(L,'QR Check').length+' to '+code(N,'QR Check').length+', QR Final '+code(L,'QR Final').length+' to '+code(N,'QR Final').length+'; code text total '+tot(L)+' to '+tot(N)+' ('+(tot(N)-tot(L))+')');
 const sent="Another judge already asks the defender about the contradiction between CR3 and CR4. If you see a different contradiction in that debater's closing round, ask about it instead; if you see none, keep your question.";console.log('     the sentence for one side: '+sent.length+' characters');
 console.log('     QR Trial? outputs: '+S(L.connections['QR Trial?'].main.map(x=>x.map(y=>y.node)))+'; condition: '+S(L.nodes.find(n=>n.name==='QR Trial?').parameters).slice(0,400));
 // R2
 const ask=out('QR Ask');const a=await go(L,'QR Check',{},ask),b=await go(N,'QR Check',{},ask);
 const core=x=>S(x.map(j=>({i:j.i,seat:j.seat,first_text:j.first_text,qs:j.qs,faults:j.faults,why:j.why})));
 const sum=x=>x.map(j=>j.seat+':'+(j.retry?((j.why||[]).length?'fault':'')+Object.keys(j.redirect||{}).map(s=>'redirect-'+s).join('+'):'-')).join(', ');
 console.log('     live '+sum(a)+'; candidate '+sum(b));
 chk('R2 stored 34299: live returns none; candidate returns chatgpt and sol on the defender side; qs and faults equal',core(a)===core(b)&&sum(a)==='luna:-, chatgpt:-, sol:-'&&sum(b)==='luna:-, chatgpt:redirect-defender, sol:redirect-defender');
 b.forEach(j=>console.log('     '+j.seat+' defender first question: ['+j.qs.defender.earlier_round+'] "'+String(j.qs.defender.earlier_quote).slice(0,90)+'" / ['+j.qs.defender.round+'] "'+String(j.qs.defender.quote).slice(0,90)+'"'));
 console.log('     return message to chatgpt ('+b[1].body.messages[b[1].body.messages.length-1].content.length+' characters): '+b[1].body.messages[b[1].body.messages.length-1].content.replace(/\n/g,' / '));
 console.log('     return body messages: live '+a[1].body.messages.length+' (no-op), candidate '+b[1].body.messages.length+'; candidate body '+S(b[1].body).length+' characters, live '+S(a[1].body).length);
 // R3
 const R0=out('QR Retry Ask');const fl=await go(L,'QR Final',{},R0),fn=await go(N,'QR Final',{},R0);const sr=x=>S(x.map(j=>({...j,record:j.record&&j.record.map(r=>({...r,redirect:undefined}))})));
 chk('R3 QR Final on the stored 34299 retry input: equal to live apart from the redirect field',sr(fl)===sr(fn),fl.length+' items');
 // helpers for plants
 const F=out('Regrade Load')[0].json.f;const sents=t=>String(t).split(/(?<=[.!?])\s+/).filter(x=>x.length>40&&x.length<160&&!/["“”\d]/.test(x));const s4=sents(F.cr4),s3=sents(F.cr3),d4=sents(F.dr4),d3=sents(F.dr3);
 const firstOf=i=>cl(b[i].qs);const askWith=repl=>ask.map((x,i)=>repl[i]!==undefined?rep(repl[i]):x);
 const PAIR=q=>q&&q.earlier_quote&&String(q.earlier_round).replace(/\W/g,'').toUpperCase()==='CR3'&&String(q.round).replace(/\W/g,'').toUpperCase()==='CR4'&&(String(firstOf(0).defender.earlier_quote).includes(q.earlier_quote)||String(q.earlier_quote).includes(firstOf(0).defender.earlier_quote)||String(firstOf(0).defender.quote).includes(q.quote)||String(q.quote).includes(firstOf(0).defender.quote));
 const full=async(W,firsts,seconds)=>{const A1=askWith(firsts);const c=await go(W,'QR Check',{},A1);const R=c.map((j,i)=>j.retry?(seconds[i]!==undefined?rep(seconds[i]):rep(j.qs)):rep('OK'));const f=await go(W,'QR Final',{'QR Check':c.map(j=>({json:j}))},R);return {c,f,rec:f[0].record,askers:f.filter(x=>x.side==='defender'&&PAIR(x)).map(x=>x.judge)};};
 const show=(nm,l,c)=>{console.log('     '+nm+': live returns '+sum(l.c)+' | candidate returns '+sum(c.c));console.log('       judges asking the defender about the CR3/CR4 pair at the end: live ['+l.askers.join(', ')+'], candidate ['+c.askers.join(', ')+']');console.log('       candidate record: '+c.rec.map(r=>r.judge+' '+r.side[0].toUpperCase()+' '+r.status+(r.redirect_note?' ('+r.redirect_note+')':'')).join('; '));};
 const other=k=>({round:'CR4',quote:s4[k],earlier_round:'CR3',earlier_quote:s3[k],question:'How do these two passages agree?'});
 const plain=k=>({round:'CR3',quote:s3[k],question:'What does this passage mean in your own words here?'});
 const badCh={round:'DR4',quote:'words that are not in the closing round of the challenger at all',question:'What does this passage mean in your own words here?'};
 // R4a
 {const f0={0:{...firstOf(0),challenger:badCh}};const sec={0:'the call failed',1:{...firstOf(1),defender:other(1)},2:{...firstOf(2),defender:other(2)}};const l=await full(L,f0,sec),c=await full(N,f0,sec);show('R4a standing judge returned for a fault, its second reply is not JSON; the two others redirected and switch',l,c);chk('R4a the pair is still asked by a judge under the candidate where live keeps it',!(l.askers.length>0&&c.askers.length===0),'live '+l.askers.length+', candidate '+c.askers.length);}
 {const f0={0:{...firstOf(0),challenger:badCh}};const sec={0:{defender:other(0),challenger:firstOf(0).challenger},1:{...firstOf(1),defender:other(1)},2:{...firstOf(2),defender:other(2)}};const l=await full(L,f0,sec),c=await full(N,f0,sec);show('R4b standing judge returned for a fault and changes its defender question; the two others redirected and switch',l,c);chk('R4b the pair is still asked by a judge under the candidate where live keeps it',!(l.askers.length>0&&c.askers.length===0),'live '+l.askers.length+', candidate '+c.askers.length);}
 {const sec={1:{...firstOf(1),defender:plain(1)},2:{...firstOf(2),defender:plain(2)}};const l=await full(L,{},sec),c=await full(N,{},sec);show('R4c redirected judges switch to a plain question',l,c);chk('R4c luna still asks about the pair; the plain questions are used',c.askers.join()==='luna'&&c.rec.filter(r=>r.side==='defender'&&r.status==='PASSED ON RETURN').length===2);}
 {const sec={1:'',2:''};const l=await full(L,{},sec),c=await full(N,{},sec);show('R4d redirected judges return nothing',l,c);chk('R4d both keep the first question on both sides; nothing dropped',c.askers.length===3&&c.rec.every(r=>r.status==='PASSED')&&c.rec.filter(r=>r.redirect_note).length===2&&c.f.length===l.f.length);}
 // R5
 {const sec={1:{defender:other(1),challenger:{round:'DR4',quote:d4[0],question:'What does this passage mean in your own words here?'}}};const c=await full(N,{},sec);const r=c.rec.find(r=>r.judge==='chatgpt'&&r.side==='challenger');chk('R5 a redirected judge that also changes its challenger question: the challenger side keeps the first',r.status==='PASSED'&&r.question===firstOf(1).challenger.question);}
 // R6
 {const c=await full(N,{1:{...firstOf(1),defender:other(1)}},{});chk('R6a same rounds, quotes not contained: chatgpt not returned',!c.c[1].retry,sum(c.c));}
 {const c=await full(N,{0:{...firstOf(0),defender:{...firstOf(0).defender,quote:'words that are not in the closing round at all, none'}}},{0:firstOf(0)});console.log('     R6b luna\'s defender question fails a check at first: '+sum(c.c));chk('R6b chatgpt is not redirected against a failing question; sol is redirected against chatgpt',!(c.c[1].redirect||{}).defender&&(c.c[2].redirect||{}).defender&&c.c[2].redirect.defender.of==='chatgpt');}
 {const cq={round:'DR4',quote:d4[0],earlier_round:'DR3',earlier_quote:d3[0],question:'How do these two passages agree?'};const c=await full(N,{0:{...firstOf(0),challenger:cq},1:{...firstOf(1),challenger:cq},2:{defender:plain(0),challenger:cq}},{});console.log('     R7 '+sum(c.c));const t=c.c[1].body.messages[c.c[1].body.messages.length-1].content;console.log('     chatgpt return: '+t.replace(/\n/g,' / '));chk('R7 chain and both sides: chatgpt redirected on both sides with two sentences naming the right rounds; sol on the challenger side only',S(Object.keys(c.c[1].redirect))===S(['defender','challenger'])&&/the defender about the contradiction between CR3 and CR4/.test(t)&&/the challenger about the contradiction between DR3 and DR4/.test(t)&&S(Object.keys(c.c[2].redirect))===S(['challenger'])&&c.c[2].redirect.challenger.of==='luna');}
 // R9
 {const sec={1:{...firstOf(1),defender:{...other(1),quote:'words that are not in the closing round at all, none'}}};const c=await full(N,{},sec);const r=c.rec.find(r=>r.judge==='chatgpt'&&r.side==='defender');chk('R9 a failing redirect reply: first kept, status PASSED with the note, not PASSED ON RETURN',r.status==='PASSED'&&r.redirect_note&&r.quote===firstOf(1).defender.quote&&S(r.faults)==='[]');}

 // rev 2 plants
 {const f0={0:{...firstOf(0),challenger:badCh},1:{...firstOf(1),challenger:badCh}};const c=await full(N,f0,{0:firstOf(0),1:firstOf(1)});console.log('     R10 '+sum(c.c));chk('R10 luna and chatgpt both faulted: sol is not redirected',!c.c[2].retry);}
 {const f0={0:'this is not JSON'};const c=await full(N,f0,{0:firstOf(0)});console.log('     R11 '+sum(c.c));chk('R11 luna not JSON at first: not counted; chatgpt stands; sol redirected against chatgpt',!(c.c[1].redirect||{}).defender&&c.c[2].redirect.defender&&c.c[2].redirect.defender.of==='chatgpt');}
 {// R12 non-transitive containment
  const A='and I accepted that order.',B="The finding is dated before the pair's coming together.",AB=A+' '+B;if(!String(F.cr3).includes(AB))throw new Error('R12 passage not in CR3');const q=(eq,cq)=>({round:'CR4',quote:cq,earlier_round:'CR3',earlier_quote:eq,question:'How do these two passages agree?'});
  const f0={0:{...firstOf(0),defender:q(A,s4[0])},1:{...firstOf(1),defender:q(AB,s4[1])},2:{...firstOf(2),defender:q(B,s4[2])}};
  const sec={1:{...firstOf(1),defender:other(3)},2:{...firstOf(2),defender:other(4)}};
  const l=await full(L,f0,sec),c=await full(N,f0,sec);console.log('     R12 first faults (must be empty): '+S(c.c.map(j=>j.faults.defender)));console.log('     R12 live returns '+sum(l.c)+' | candidate returns '+sum(c.c)+'; sol redirected of: '+(((c.c[2].redirect||{}).defender||{}).of||'-'));
  const asksB=x=>x.f.filter(y=>y.side==='defender'&&y.earlier_quote&&(y.earlier_quote===B||y.earlier_quote===AB)).map(y=>y.judge);console.log('     R12 judges whose final defender question quotes sol\'s passage: live ['+asksB(l).join(', ')+'], candidate ['+asksB(c).join(', ')+']');
  chk('R12 sol\'s distinct question is not lost where live keeps it',!(asksB(l).length>0&&asksB(c).length===0));}

 {// R13 random walk, seeded
  let seed=+(process.env.SEED||20261110);const rnd=n=>{seed=(seed*1103515245+12345)&0x7fffffff;return (seed>>>12)%n;};
  const A='and I accepted that order.',B="The finding is dated before the pair's coming together.",AB=A+' '+B;const q=(eq,cq)=>({round:'CR4',quote:cq,earlier_round:'CR3',earlier_quote:eq,question:'How do these two passages agree?'});
  const firstKinds=[];for(const e of [A,B,AB])for(const c of [0,1])firstKinds.push(i=>q(e,s4[c]));firstKinds.push(i=>other(5+i),i=>plain(i),i=>q('words that are not in the earlier round at all, none',s4[i]));
  const secKinds=[i=>other(8+i),i=>plain(3+i),null,i=>q(B,'words that are not in the closing round at all, none'),'NOTJSON'];
  const nq=x=>String(x).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();const inn=(x,y)=>{x=nq(x);y=nq(y);return y.includes(x);}; /* y contains x */
  let broke=[],cases=0,redirs=0;
  for(let t=0;t<400;t++){const f0={},sec={};const desc=[];for(let i=0;i<3;i++){const k=rnd(firstKinds.length),cf=rnd(4)===0;f0[i]={defender:firstKinds[k](i),challenger:cf?badCh:firstOf(i).challenger};const sk=rnd(secKinds.length);const SK=secKinds[sk];sec[i]=SK==='NOTJSON'?'not json at all':{defender:SK?SK(i):f0[i].defender,challenger:firstOf(i).challenger};desc.push(k+(cf?'f':'')+'/'+sk);}
   let l,c;try{l=await full(L,f0,sec);}catch(e){if(/no question passed/.test(e.message))continue;throw e;}
   try{c=await full(N,f0,sec);}catch(e){broke.push(desc.join(' ')+' candidate threw: '+e.message.slice(0,80));continue;}
cases++;redirs+=c.c.filter(j=>Object.keys(j.redirect||{}).length).length;
   const lq=l.f.filter(x=>x.side==='defender'&&x.earlier_quote),cq=c.f.filter(x=>x.side==='defender'&&x.earlier_quote);
   for(const x of lq)if(!cq.some(y=>y.round===x.round&&y.earlier_round===x.earlier_round&&(inn(x.earlier_quote,y.earlier_quote)&&inn(x.quote,y.quote))))broke.push(desc.join(' ')+': live '+x.judge+' asks ['+String(x.earlier_quote).slice(0,40)+'], no candidate match');}
  console.log('     R13 cases run '+cases+'; redirect returns in them '+redirs+'; rule broken in '+broke.length);broke.slice(0,6).forEach(z=>console.log('       '+z));chk('R13 walk: no contradiction question that live ends with is left without a match',broke.length===0&&cases>300&&redirs>30);}

 {// R14
  const A='and I accepted that order.',B="The finding is dated before the pair's coming together.";const q=(eq,cq)=>({round:'CR4',quote:cq,earlier_round:'CR3',earlier_quote:eq,question:'How do these two passages agree?'});
  for(const [nm,f0,key,val] of [['same earlier passage, different closing sentences',{0:{...firstOf(0),defender:q(A,s4[0])},1:{...firstOf(1),defender:q(A,s4[1])},2:{...firstOf(2),defender:plain(2)}},'quote',s4[1]],['same closing sentence, different earlier passages',{0:{...firstOf(0),defender:q(A,s4[0])},1:{...firstOf(1),defender:q(B,s4[0])},2:{...firstOf(2),defender:plain(2)}},'earlier_quote',B]]){
   const sec={1:{...firstOf(1),defender:other(3)}};const l=await full(L,f0,sec),c=await full(N,f0,sec);const who=x=>x.f.filter(y=>y.side==='defender'&&y[key]===val).map(y=>y.judge);
   console.log('     R14 '+nm+': first faults '+S(c.c.map(j=>j.faults.defender.length))+'; candidate returns '+sum(c.c)+'; judges asking about chatgpt\'s own passage at the end: live ['+who(l).join(', ')+'], candidate ['+who(c).join(', ')+']');
   chk('R14 '+nm+': chatgpt\'s distinct question is not lost',!(who(l).length>0&&who(c).length===0));}}

 {// R15
  const A='and I accepted that order.',B="The finding is dated before the pair's coming together.",AB=A+' '+B;const q=(eq,cq)=>({round:'CR4',quote:cq,earlier_round:'CR3',earlier_quote:eq,question:'How do these two passages agree?'});
  const c4=String(F.cr4);const i4=c4.indexOf(s4[0]);const wide4=c4.slice(i4,c4.indexOf(s4[1])+s4[1].length);const adj=i4>=0&&c4.indexOf(s4[1])>i4&&wide4.length<600;
  const run15=async(nm,f0,key,part,expectLossFree)=>{const sec={1:{...firstOf(1),defender:other(3)}};const l=await full(L,f0,sec),c=await full(N,f0,sec);const who=x=>x.f.filter(y=>y.side==='defender'&&y[key]&&String(y[key]).includes(part)).map(y=>y.judge);console.log('     R15 '+nm+': first faults '+S(c.c.map(j=>j.faults.defender.length))+'; candidate returns '+sum(c.c)+'; judges whose final question contains the part: live ['+who(l).join(', ')+'], candidate ['+who(c).join(', ')+']');chk('R15 '+nm,!(who(l).length>0&&who(c).length===0));return c;};
  await run15('wider earlier passage: the extra part keeps an asker',{0:{...firstOf(0),defender:q(A,s4[0])},1:{...firstOf(1),defender:q(AB,s4[0])},2:{...firstOf(2),defender:plain(2)}},'earlier_quote',B);
  if(adj)await run15('wider closing passage: the extra part keeps an asker',{0:{...firstOf(0),defender:q(A,s4[0])},1:{...firstOf(1),defender:q(A,wide4)},2:{...firstOf(2),defender:plain(2)}},'quote',s4[1]);else console.log('     R15 wider closing passage: no adjacent closing sentences found for the plant (not run)');
  const c=await run15('c. narrower passage inside the standing one: nothing lost',{0:{...firstOf(0),defender:q(AB,s4[0])},1:{...firstOf(1),defender:q(A,s4[0])},2:{...firstOf(2),defender:plain(2)}},'earlier_quote',A);chk('R15c the narrower question is redirected',!!(c.c[1].redirect||{}).defender);}
 console.log(ok?'ALL CHECKS OK':'SOME CHECK FAILED');
})().catch(e=>{console.log('RUNNER ERROR '+e.stack);});
