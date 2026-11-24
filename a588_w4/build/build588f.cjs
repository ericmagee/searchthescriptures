// ASK 588 D7 build (W4): the one continuation (follow-up) pass, behind its own switch qr_follow. Base: the graded 588 targets (target_engine_588.json 024290a7, target_child_588.json 16ed1670).
const fs=require('fs');const crypto=require('crypto');const md5=s=>crypto.createHash('md5').update(s).digest('hex');const {once}=require('./libpatch.js');
const E=JSON.parse(fs.readFileSync('target_engine_588.json','utf8'));const E0=JSON.parse(JSON.stringify(E));
if(md5(JSON.stringify(E)).slice(0,8)!=='024290a7')throw new Error('the base is not the graded 588 engine target');
const N=n=>{const x=E.nodes.find(y=>y.name===n);if(!x)throw new Error('no node '+n);return x;};const uuid=()=>crypto.randomUUID();const log=[];
const QR_ANSWERS_A="Each answer explains only the passage it quotes and is read with the round it came from, as an explanation of that passage. Every quotation you write in your lines, and every concession you count, comes from the eight rounds of the transcript ([CR1] to [DR4]): an answer is never quoted as a round, and a concession is counted only where a round makes it.";
const PRE=fs.readFileSync('qr_consts.js','utf8')+'const QR_AGREE=true;\nconst QR_ANSWERS='+JSON.stringify(QR_ANSWERS_A)+';\n'+fs.readFileSync('qr_common.js','utf8');
if(!N('QR Merge').parameters.jsCode.startsWith(PRE))throw new Error('the prelude does not match the 588 build');
const Q=require('./qr_nodes.js'),QF=require('./qr_follow.js');const P2=PRE+QF.QF_COMMON;
// 1. QR Merge takes the follow-ups (same output as 588 when the pass is off)
N('QR Merge').parameters.jsCode=P2+QF.MERGE2;log.push('QR Merge code '+md5(P2+QF.MERGE2).slice(0,8));
// 2. new nodes
const [mx,my]=N('QR Merge').position;
const mkCode=(name,code,pos)=>({id:uuid(),name,type:'n8n-nodes-base.code',typeVersion:2,position:pos,onError:'stopWorkflow',parameters:{jsCode:code}});
const cp=(src,name,pos)=>{const x=JSON.parse(JSON.stringify(N(src)));x.id=uuid();x.name=name;x.position=pos;return x;};
const swD=cp('QR Answer D Route','QR Follow D Route',[0,0]);
const fb=s=>s.split("$('QR Final')").join("$('QR Follow Final')");
const ab=side=>fb(Q.ANS_BUILD(side)).split("'QR Answer "+(side==='defender'?'D':'C')+" Build'").join("'QR Follow "+(side==='defender'?'D':'C')+" Build'");
const ad=(side,build)=>Q.ANS_DONE(side,build).split("'QR Answer "+(side==='defender'?'D':'C')+" Done'").join("'QR Follow "+(side==='defender'?'D':'C')+" Done'");
const y=my+300;
const add=[mkCode('QR Follow Build',P2+QF.F_BUILD,[mx,y]),cp('QR Ask','QR Follow Ask',[mx+200,y]),mkCode('QR Follow Final',P2+QF.F_FINAL,[mx+400,y]),
 mkCode('QR Follow D Build',PRE+ab('defender'),[mx+600,y]),cp('QR Answer D Route','QR Follow D Route',[mx+800,y]),cp('QR Answer D anthropic','QR Follow D anthropic',[mx+1000,y-160]),cp('QR Answer','QR Follow D openrouter',[mx+1000,y]),mkCode('QR Follow D Done',PRE+ad('defender','QR Follow D Build'),[mx+1200,y]),
 mkCode('QR Follow C Build',PRE+ab('challenger'),[mx+1400,y]),cp('QR Answer C Route','QR Follow C Route',[mx+1600,y]),cp('QR Answer C anthropic','QR Follow C anthropic',[mx+1800,y-160]),cp('QR Answer C openrouter','QR Follow C openrouter',[mx+1800,y]),mkCode('QR Follow C Done',PRE+ad('challenger','QR Follow C Build'),[mx+2000,y])];
for(const n of add){if(E.nodes.some(z=>z.name===n.name))throw new Error('exists '+n.name);E.nodes.push(n);log.push('NEW '+n.name+' '+n.type.split('.').pop()+' '+md5(JSON.stringify(n.parameters)).slice(0,8));}
N('QR Merge').position=[mx+2200,my];
// 3. wiring: QR Answer C Done -> the follow-up pass -> QR Merge
const cn=E.connections;const to=n=>({node:n,type:'main',index:0});
if(JSON.stringify(cn['QR Answer C Done'])!==JSON.stringify({main:[[to('QR Merge')]]}))throw new Error('QR Answer C Done wiring differs');
cn['QR Answer C Done']={main:[[to('QR Follow Build')]]};
cn['QR Follow Build']={main:[[to('QR Follow Ask')]]};cn['QR Follow Ask']={main:[[to('QR Follow Final')]]};cn['QR Follow Final']={main:[[to('QR Follow D Build')]]};
cn['QR Follow D Build']={main:[[to('QR Follow D Route')]]};cn['QR Follow D Route']={main:[[to('QR Follow D anthropic')],[to('QR Follow D openrouter')],[to('QR Follow D Done')]]};
cn['QR Follow D anthropic']={main:[[to('QR Follow D Done')]]};cn['QR Follow D openrouter']={main:[[to('QR Follow D Done')]]};cn['QR Follow D Done']={main:[[to('QR Follow C Build')]]};
cn['QR Follow C Build']={main:[[to('QR Follow C Route')]]};cn['QR Follow C Route']={main:[[to('QR Follow C anthropic')],[to('QR Follow C openrouter')],[to('QR Follow C Done')]]};
cn['QR Follow C anthropic']={main:[[to('QR Follow C Done')]]};cn['QR Follow C openrouter']={main:[[to('QR Follow C Done')]]};cn['QR Follow C Done']={main:[[to('QR Merge')]]};
// 4. Init Seats: the switch qr_follow, on with the round unless qr_follow:false is sent
{const x=N('Init Seats');let s=x.parameters.jsCode;
 s=once(s,"if(b.question_trial!==undefined&&b.question_trial!==null&&typeof b.question_trial!=='boolean')fail('question_trial must be true or false.');","if(b.question_trial!==undefined&&b.question_trial!==null&&typeof b.question_trial!=='boolean')fail('question_trial must be true or false.');if(b.qr_follow!==undefined&&b.qr_follow!==null&&typeof b.qr_follow!=='boolean')fail('qr_follow must be true or false.');",'Init check');
 s=once(s,"...((RG!==null?b.question_trial===true:b.question_trial!==false)?{question_trial:true}:{})","...((RG!==null?b.question_trial===true:b.question_trial!==false)?{question_trial:true}:{}),...(((RG!==null?b.question_trial===true:b.question_trial!==false)&&b.qr_follow!==false)?{qr_follow:true}:{}) /* ASK 588 D7: the follow-up pass runs with the round unless qr_follow:false is sent */",'Init default');
 x.parameters.jsCode=s;log.push('Init Seats edited '+md5(JSON.stringify(x.parameters)).slice(0,8));}
fs.writeFileSync('target_engine_588f.json',JSON.stringify(E));
const diff=(A,B)=>{const out=[];const m=new Map(A.nodes.map(n=>[n.name,n]));for(const n of B.nodes){const o=m.get(n.name);if(!o)out.push('+ '+n.name);else if(JSON.stringify(o)!==JSON.stringify(n))out.push('~ '+n.name+' '+md5(JSON.stringify(o.parameters)).slice(0,8)+'->'+md5(JSON.stringify(n.parameters)).slice(0,8));}return out;};
console.log(JSON.stringify({log,engine_diff:diff(E0,E),nodes:E.nodes.length,eng_md5:md5(JSON.stringify(E)).slice(0,8)},null,1));
