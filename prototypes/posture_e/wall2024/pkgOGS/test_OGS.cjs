// pkgOGS test: the send-back chain run whole on 33149's rounds with stand-in provider replies. Run from wall2024/: node pkgOGS/test_OGS.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const rd=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(rd('pkgOGS/plan_OGS.json'));T('4 nodes; shas match the plan',plan.nodes.every(n=>sha(rd('pkgOGS/patched/'+n.file))===n.final_sha));
const OGR=new Function(rd('pkgOGR/src_OGR.js')+';return OGR;')();const UND=new Function(rd('pkgUNL/src_UNL.js')+';return UND;')();
const PB=JSON.parse(rd('corpus/raw/gate_33149.json'))['Panel Build'].slice(-1)[0][0];const R=UND.rounds(PB.judges[0].body.messages.map(m=>typeof m.content==='string'?m.content:(m.content||[]).map(c=>c&&c.text||'').join('\n')).join('\n'));
const nodes={'Init Seats':{run_token:'t',cpos:'the record\'s reading'},'Init with Guards':{csys:'sys',topic:'topic',lab:{C:'CHALLENGER'}},'Resolve Seats':{challenger:{fam:'openai',model:'m',tok:1000},defender:{fam:'openai',model:'d',tok:1000}},
 'C1 Extract':{raw:R.DR1},'C2 Extract':{raw:R.DR2},'C3 Extract':{raw:R.DR3},'D1 Extract':{raw:R.CR1},'D2 Extract':{raw:R.CR2},'D3 Extract':{raw:R.CR3},'D4 Extract':{raw:R.CR4}};
const mk=v=>({isExecuted:true,first:()=>({json:v}),all:()=>[{json:v}]});const $=n=>nodes[n]?mk(nodes[n]):{isExecuted:false,first:()=>{throw new Error("Node '"+n+"' hasn't been executed");},all:()=>[]};
const run=(f,input)=>new Function('$','$input','$json',rd(f))($,{first:()=>({json:input||{}}),all:()=>[{json:input||{}}]},input||{})[0].json;
const reply=t=>({choices:[{message:{content:t},finish_reason:'stop'}],usage:{prompt_tokens:1,completion_tokens:1}});
nodes['C4 Build']=run('pkgOGR/patched/C4_Build.js');const G=nodes['C4 Build'].grants;
const sec=G.map(x=>'G'+x.g+' ['+x.round+'] "'+x.text+'" -- SUPPORTS: none -- not one of my claims').join('\n');
// 1 first round with no section: the send-back is built
let X1;try{X1=run('pkgOGR/patched/C4_Extract.js',reply(R.DR4));}catch(e){T('C4 Extract reads a stand-in reply',false,String(e.stack).slice(0,300));}
nodes['C4 Extract']=X1;T('C4 Extract: no section, all '+G.length+' grants missing',X1&&X1.grants_check&&!X1.grants_check.section&&X1.grants_check.missing.length===G.length);
const B1=run('pkgOGS/patched/C4G_Build.js');nodes['C4G Build']=B1;const ms=B1.call&&B1.call.body.messages||[];
T('C4G Build: resend, same seat and model, the conversation continued (assistant = the first round, user = the note naming the faults)',B1.resend&&B1.call.fam==='openai'&&B1.call.model==='m'&&ms[ms.length-2].role==='assistant'&&ms[ms.length-2].content===X1.raw&&ms[ms.length-1].role==='user'&&/leaves out G1/.test(ms[ms.length-1].content)&&ms.length===nodes['C4 Build'].call.body.messages.length+2);
const E2=run('pkgOGS/patched/C4G_Extract.js',reply("OPPONENT'S GRANTS:\n"+sec+'\n\n'+R.DR4));T('C4G Extract: a corrected reply is kept (second), its check passes, the round fields are its own',E2.grants_resend.kept==='second'&&E2.grants_check.pass&&/^OPPONENT'S GRANTS/.test(E2.raw)&&/CHALLENGER -- ROUND 4/.test(E2.labelled),JSON.stringify(E2.grants_resend).slice(0,200));
T('C4G Extract: the section\'s quoted verses are not NEW IN CLOSE (same new-press list as the first round)',JSON.stringify(E2.new_press)===JSON.stringify(X1.new_press),JSON.stringify(E2.new_press)+' vs '+JSON.stringify(X1.new_press));
const E3=run('pkgOGS/patched/C4G_Extract.js',reply(R.DR4+'\n(no section again)'));T('C4G Extract: a reply that does not improve keeps the first round',E3.grants_resend.kept==='first'&&E3.raw===X1.raw);
const E4=run('pkgOGS/patched/C4G_Extract.js',{error:{message:'503'}});T('C4G Extract: a failed re-call keeps the first round',E4.grants_resend.kept==='first'&&/failed/.test(E4.grants_resend.why)&&E4.raw===X1.raw);
const E5=run('pkgOGS/patched/C4G_Extract.js',reply(''));T('C4G Extract: an empty re-call reply keeps the first round (no throw)',E5.grants_resend.kept==='first'&&E5.raw===X1.raw,E5.grants_resend.why);
// 2 a first round that passes: no call
const X2=run('pkgOGR/patched/C4_Extract.js',reply("OPPONENT'S GRANTS:\n"+sec+'\n\n'+R.DR4));nodes['C4 Extract']=X2;const B2=run('pkgOGS/patched/C4G_Build.js');nodes['C4G Build']=B2;
T('C4G Build: a passing section is not sent back (resend false, no call)',B2.resend===false&&!B2.call&&X2.grants_check.pass);
const E6=run('pkgOGS/patched/C4G_Extract.js',B2);T('C4G Extract: the pass-through item returns C4 Extract\'s round unchanged',E6.raw===X2.raw&&E6.labelled===X2.labelled&&E6.grants_resend.resent===false);
// 3 readers
T('Build Synthesis reads the close round from C4G Extract',/const dr4=\$\('C4G Extract'\)\.first\(\)\.json\.labelled;/.test(rd('pkgOGS/patched/Build_Synthesis.js'))&&!/\$\('C4 Extract'\)/.test(rd('pkgOGS/patched/Build_Synthesis.js')));
T('Failure Salvage reads C4G Extract, falling back to C4 Extract',/challenger_r4:P\('C4G Extract',j=>j\.labelled\)\|\|P\('C4 Extract',j=>j\.labelled\)/.test(rd('pkgOGS/patched/Failure_Salvage.js')));
const {needs}=require('../pkgLIB/runner_model.cjs');const nx=needs(rd('pkgOGS/patched/C4G_Extract.js'));
T('runner: C4G Extract names C4 Extract, C4G Build and every node C4 Extract reads, as literal $() calls',['C4 Extract','C4G Build','C1 Extract','C2 Extract','C3 Extract','D1 Extract','D2 Extract','D3 Extract','D4 Extract','Init with Guards','Init Seats'].every(n=>nx.nodes.has(n)),[...nx.nodes].join(', '));
console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
