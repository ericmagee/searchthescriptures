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
 console.log(ok?'ALL CHECKS OK':'SOME CHECK FAILED');
})().catch(e=>{console.log('RUNNER ERROR '+e.stack);});
