// pkgOAN test: the [DR3] press check and its send-back chain run whole on 33160's rounds with stand-in provider replies.
// Run from wall2024/: node pkgOAN/test_OAN.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const rd=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(rd('pkgOAN/plan_OAN.json'));T(plan.nodes.length+' nodes; base and final shas match the plan',plan.nodes.every(n=>sha(rd('pkgOAN/patched/'+n.file))===n.final_sha&&(n.base_sha===null||sha(rd('pkgOAN/base/'+n.file))===n.base_sha)));
const OAN=new Function(rd('pkgOAN/src_OAN.js')+';return OAN;')();const UND=new Function(rd('pkgUNL/src_UNL.js')+';return UND;')();
const PB=JSON.parse(rd('corpus/raw/gate_33160.json'))['Panel Build'].slice(-1)[0][0];const R=UND.rounds(PB.judges[0].body.messages.map(m=>typeof m.content==='string'?m.content:(m.content||[]).map(c=>c&&c.text||'').join('\n')).join('\n'));
// library
const P=OAN.harvest(R.CR3);const m19=P.find(p=>p.n===2&&p.ref==='Matthew 1:19');
T('harvest 33160 [CR3]: 6 premises, 14 presses (14 MEANS lines in the list); P2.3 is Matthew 1:19 with its MEANS',new Set(P.map(p=>p.n)).size===6&&P.length===14&&m19&&m19.id==='P2.3'&&m19.means==='a husband who knew himself the father would have no cause to put her away',P.length+' '+JSON.stringify(m19));
const c0=OAN.check(R.DR3,P);T('check 33160 [DR3]: Matthew 1:19 named but its MEANS not quoted (P2.3 missing); the round is sent back',!c0.pass&&c0.missing.includes('P2.3')&&c0.sections===6);
const good=s=>s.replace(/\*\*Answers to the presses\*\*/g,'**Answers to the presses**');
const ans=n=>P.filter(p=>p.n===n).map(p=>'- MEANS [CR3] '+p.id+': "'+p.means+'"\n - [L3] the text answers it.\n - [L4] the chain holds.').join('\n');
const D=[1,2,3,4,5,6].map(n=>'**LINK '+n+': SUPPORTED**\n- [L1] footing\n\n**Answers to the presses**\n'+ans(n)).join('\n\n---\n\n');
T('check: every MEANS quoted and answered with layers passes',OAN.check(D,P).pass);
T('check: a quoted MEANS with no layer after it is unanswered',OAN.check(D.replace(/(MEANS \[CR3\] P2\.3: "[^"]+")\n - \[L3\] the text answers it\.\n - \[L4\] the chain holds\./,'$1\n - no answer.'),P).unanswered.join()==='P2.3');
T('check: a conceded LINK needs no answers',(()=>{const c=OAN.check(D.replace('**LINK 2: SUPPORTED**','**LINK 2: CONCEDED**').replace(ans(2),''),P);return c.pass&&c.conceded.length===P.filter(p=>p.n===2).length;})());
T('check: 8 consecutive MEANS words in a quote count; fewer do not',OAN.check('LINK 2: SUPPORTED\n"a husband who knew himself the father would have" [L4] x',[m19]).pass&&!OAN.check('LINK 2: SUPPORTED\n"a husband who knew himself" [L4] x',[m19]).pass);
T('check: a MEANS with quotes of its own is read whole (Luke 2:49)',(()=>{const p=P.find(x=>x.ref==='Luke 2:49');return p&&OAN.check('LINK 3: SUPPORTED\nMEANS [CR3] '+p.id+': "'+p.means+'"\n[L3] x',[p]).pass;})());
T('check: the MEANS must stand in its own LINK section',!OAN.check('LINK 1: SUPPORTED\nMEANS [CR3] P2.3: "'+m19.means+'" [L4] x\nLINK 2: SUPPORTED\n[L1] y',[m19]).pass);
T('check: no press list -> does not apply',OAN.check(R.DR3,[]).applies===false);
T('block names every press id with its MEANS and the MEANS [CR3] line form',(()=>{const b=OAN.block(P);return P.every(p=>b.includes(p.id+' (LINK '+p.n+') '+p.ref+' -- MEANS: "'+p.means+'"'))&&b.includes('MEANS [CR3] <id>: "<the MEANS above, word for word>"');})());
// harvest across the corpus
{const out=[];for(const f of fs.readdirSync('corpus/raw').filter(f=>/^gate_\d+\.json$/.test(f)).sort()){const G=JSON.parse(rd('corpus/raw/'+f));const pb=(G['Panel Build']||[]).slice(-1)[0];const p0=pb&&(pb[0]||pb['0']);if(!p0||!p0.judges)continue;
 const r=UND.rounds(p0.judges[0].body.messages.map(m=>typeof m.content==='string'?m.content:(m.content||[]).map(c=>c&&c.text||'').join('\n')).join('\n'));const h=OAN.harvest(r.CR3);out.push(f.slice(5,10)+':'+h.length+'/'+new Set(h.map(x=>x.n)).size);}
 T('harvest reads presses on every saved run (run:presses/premises)',out.every(x=>!/:0\//.test(x)),out.join(' '));}
// node chain
const nodes={'Init Seats':{run_token:'t'},'D1 Extract':{raw:R.CR1},'D2 Extract':{raw:R.CR2},'D3 Extract':{raw:R.CR3},'C1 Extract':{raw:R.DR1},'C2 Extract':{raw:R.DR2},'Init with Guards':{csys:'sys',topic:'topic',lab:{C:'CHALLENGER'}}};
const mk=v=>({isExecuted:true,first:()=>({json:v}),all:()=>[{json:v}]});const $=n=>nodes[n]?mk(nodes[n]):{isExecuted:false,first:()=>{throw new Error("Node '"+n+"' hasn't been executed");},all:()=>[]};
const run=(f,input)=>new Function('$','$input','$json',rd(f))($,{first:()=>({json:input||{}}),all:()=>[{json:input||{}}]},input||{})[0].json;
const reply=t=>({choices:[{message:{content:t},finish_reason:'stop'}],usage:{prompt_tokens:1,completion_tokens:1}});
const call0={fam:'openai',fam_idx:1,model:'m',body:{model:'m',messages:[{role:'system',content:'s'},{role:'user',content:'u'}]}};nodes['C3 Build']={run_token:'t',round:'C3',presses:P,call:call0};
let X1;try{X1=run('pkgOAN/patched/C3_Extract.js',reply(R.DR3));}catch(e){T('C3 Extract reads a stand-in reply',false,String(e.stack).slice(0,400));}
nodes['C3 Extract']=X1;T('C3 Extract: presses and press_check on its output (P2.3 missing)',X1&&X1.presses.length===14&&X1.press_check&&X1.press_check.missing.includes('P2.3'),X1&&JSON.stringify(X1.press_check).slice(0,200));
const B1=run('pkgOAN/patched/C3G_Build.js');nodes['C3G Build']=B1;const ms=B1.call&&B1.call.body.messages||[];
T('C3G Build: resend, same seat and model, the conversation continued (assistant = the first round, user = the note naming P2.3 and its MEANS)',B1.resend&&B1.call.model==='m'&&ms.length===4&&ms[2].role==='assistant'&&ms[2].content===X1.raw&&ms[3].role==='user'&&ms[3].content.includes('P2.3 (LINK 2) Matthew 1:19 -- MEANS: "'+m19.means+'"'));
{const g={...call0,fam:'gemini',body:{contents:[{role:'user',parts:[{text:'u'}]}]}};const sv=nodes['C3 Build'];nodes['C3 Build']={...sv,call:g};const Bg=run('pkgOAN/patched/C3G_Build.js');nodes['C3 Build']=sv;const c=Bg.call.body.contents;T('C3G Build: gemini form (model, then user parts)',c.length===3&&c[1].role==='model'&&c[1].parts[0].text===X1.raw&&c[2].role==='user');}
const E2=run('pkgOAN/patched/C3G_Extract.js',reply(D));T('C3G Extract: a corrected reply is kept (second), its check passes',E2.press_resend.kept==='second'&&E2.press_check.pass&&E2.raw===D,JSON.stringify(E2.press_resend).slice(0,200));
const E3=run('pkgOAN/patched/C3G_Extract.js',reply(R.DR3+'\n(again)'));T('C3G Extract: a reply that does not improve keeps the first round',E3.press_resend.kept==='first'&&E3.raw===X1.raw);
const E4=run('pkgOAN/patched/C3G_Extract.js',{error:{message:'503'}});T('C3G Extract: a failed re-call keeps the first round',E4.press_resend.kept==='first'&&/failed/.test(E4.press_resend.why)&&E4.raw===X1.raw);
const E5=run('pkgOAN/patched/C3G_Extract.js',reply(''));T('C3G Extract: an empty re-call reply keeps the first round (no throw)',E5.press_resend.kept==='first'&&E5.raw===X1.raw,E5.press_resend.why);
const X2=run('pkgOAN/patched/C3_Extract.js',reply(D));nodes['C3 Extract']=X2;const B2=run('pkgOAN/patched/C3G_Build.js');nodes['C3G Build']=B2;
T('C3G Build: a passing round is not sent back',B2.resend===false&&!B2.call&&X2.press_check.pass);
const E6=run('pkgOAN/patched/C3G_Extract.js',B2);T('C3G Extract: the pass-through returns C3 Extract\'s round unchanged',E6.raw===X2.raw&&E6.labelled===X2.labelled&&E6.press_resend.resent===false);
// readers
for(const f of ['Build_Synthesis.js','D4_Build.js','D4_Extract.js','C4_Build.js','C4_Extract.js','C4G_Extract.js','D4_Words_Plan.js'])T(f+': reads [DR3] from C3G Extract only',!rd('pkgOAN/patched/'+f).includes("$('C3 Extract')")&&rd('pkgOAN/patched/'+f).includes("$('C3G Extract')"));
T('Failure Salvage: C3G Extract first, C3 Extract as fallback (salvage and format faults)',/challenger_r3:P\('C3G Extract',j=>j\.labelled\)\|\|P\('C3 Extract',j=>j\.labelled\)/.test(rd('pkgOAN/patched/Failure_Salvage.js'))&&rd('pkgOAN/patched/Failure_Salvage.js').includes("(r==='C3'?P('C3G Extract',j=>j.raw):null)||P(r+' Extract',j=>j.raw)"));
const {needs}=require('../pkgLIB/runner_model.cjs');const nx=needs(rd('pkgOAN/patched/C3G_Extract.js'));
T('runner: C3G Extract names C3 Extract, C3G Build and every node C3 Extract reads, as literal $() calls',['C3 Extract','C3G Build','D1 Extract','D2 Extract','D3 Extract','C1 Extract','C2 Extract','Init with Guards','Init Seats'].every(n=>nx.nodes.has(n)),[...nx.nodes].join(', '));
const nb=needs(rd('pkgOAN/patched/C3G_Build.js'));T('runner: C3G Build names C3 Extract and C3 Build',nb.nodes.has('C3 Extract')&&nb.nodes.has('C3 Build'));
console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
