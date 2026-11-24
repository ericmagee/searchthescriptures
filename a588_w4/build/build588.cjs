// ASK 588 build (W4): the judges' question round, live. Base: live engine 7536d7bf (base_eng.json) and child a7113b8d (base_child.json).
// node build588.cjs [--no-agree] [--answers=A|B]
const fs=require('fs');const crypto=require('crypto');const md5=s=>crypto.createHash('md5').update(s).digest('hex');
const {cut,once}=require('./libpatch.js');
const AGREE=!process.argv.includes('--no-agree');
const QR_ANSWERS_A="Each answer explains only the passage it quotes and is read with the round it came from, as an explanation of that passage. Every quotation you write in your lines, and every concession you count, comes from the eight rounds of the transcript ([CR1] to [DR4]): an answer is never quoted as a round, and a concession is counted only where a round makes it.";
const E=JSON.parse(fs.readFileSync('base_eng.json','utf8'));const C=JSON.parse(fs.readFileSync('base_child.json','utf8'));
const E0=JSON.parse(JSON.stringify(E)),C0=JSON.parse(JSON.stringify(C));
const N=(W,n)=>{const x=W.nodes.find(y=>y.name===n);if(!x)throw new Error('no node '+n);return x;};
const uuid=()=>crypto.randomUUID();
const log=[];
// 1. prelude and the QR code nodes
const PRE=fs.readFileSync('qr_consts.js','utf8')+'const QR_AGREE='+AGREE+';\nconst QR_ANSWERS='+JSON.stringify(QR_ANSWERS_A)+';\n'+fs.readFileSync('qr_common.js','utf8');
const Q=require('./qr_nodes.js');
const setCode=(n,code)=>{const x=N(E,n);x.parameters.jsCode=code;x.onError='stopWorkflow';log.push(n+' code '+md5(code).slice(0,8)+' ('+code.length+')');};
setCode('QR Ask Build',PRE+Q.ASK_BUILD);setCode('QR Check',PRE+Q.CHECK);setCode('QR Final',PRE+Q.FINAL);setCode('QR Merge',PRE+Q.MERGE);
// 2. answer stages: defender then challenger, each routed by the debater's own family
const anth=N(E,'D1 Call anthropic'),qra=N(E,'QR Answer');const [fx,fy]=N(E,'QR Final').position;
const mkCode=(name,code,pos)=>({id:uuid(),name,type:'n8n-nodes-base.code',typeVersion:2,position:pos,onError:'stopWorkflow',parameters:{jsCode:PRE+code}});
const mkSwitch=(name,pos)=>({id:uuid(),name,type:'n8n-nodes-base.switch',typeVersion:3.2,position:pos,parameters:{mode:'expression',numberOutputs:3,output:"={{ $json.route==='anthropic'?0:($json.route==='openrouter'?1:2) }}"}});
const mkAnth=(name,pos)=>{const x=JSON.parse(JSON.stringify(anth));x.id=uuid();x.name=name;x.position=pos;x.parameters.jsonBody='={{ $json.body }}';x.onError='continueRegularOutput';x.retryOnFail=true;x.maxTries=3;x.waitBetweenTries=5000;return x;};
const mkOR=(name,pos)=>{const x=JSON.parse(JSON.stringify(qra));x.id=uuid();x.name=name;x.position=pos;return x;};
const add=[mkCode('QR Answer D Build',Q.ANS_BUILD('defender'),[fx+200,fy-300]),mkSwitch('QR Answer D Route',[fx+400,fy-300]),mkAnth('QR Answer D anthropic',[fx+600,fy-460]),mkCode('QR Answer D Done',Q.ANS_DONE('defender','QR Answer D Build'),[fx+800,fy-300]),
 mkCode('QR Answer C Build',Q.ANS_BUILD('challenger'),[fx+1000,fy-300]),mkSwitch('QR Answer C Route',[fx+1200,fy-300]),mkAnth('QR Answer C anthropic',[fx+1400,fy-460]),mkOR('QR Answer C openrouter',[fx+1400,fy-300]),mkCode('QR Answer C Done',Q.ANS_DONE('challenger','QR Answer C Build'),[fx+1600,fy-300])];
for(const n of add){if(E.nodes.some(y=>y.name===n.name))throw new Error('exists '+n.name);E.nodes.push(n);log.push('NEW '+n.name+' '+n.type.split('.').pop());}
qra.position=[fx+600,fy-300];N(E,'QR Merge').position=[fx+1800,fy-300];
const cn=E.connections;const to=n=>({node:n,type:'main',index:0});
cn['QR Final']={main:[[to('QR Answer D Build')]]};
cn['QR Answer D Build']={main:[[to('QR Answer D Route')]]};
cn['QR Answer D Route']={main:[[to('QR Answer D anthropic')],[to('QR Answer')],[to('QR Answer D Done')]]};
cn['QR Answer D anthropic']={main:[[to('QR Answer D Done')]]};
cn['QR Answer']={main:[[to('QR Answer D Done')]]};
cn['QR Answer D Done']={main:[[to('QR Answer C Build')]]};
cn['QR Answer C Build']={main:[[to('QR Answer C Route')]]};
cn['QR Answer C Route']={main:[[to('QR Answer C anthropic')],[to('QR Answer C openrouter')],[to('QR Answer C Done')]]};
cn['QR Answer C anthropic']={main:[[to('QR Answer C Done')]]};
cn['QR Answer C openrouter']={main:[[to('QR Answer C Done')]]};
cn['QR Answer C Done']={main:[[to('QR Merge')]]};
// 3. Init Seats: the round runs on every fresh run; a regrade runs it only when asked
{const x=N(E,'Init Seats');let s=x.parameters.jsCode;
 s=once(s,"if(b.question_trial===true&&!DRY)fail('question_trial runs only in a dry regrade (md_notes_rulings 413).');","/* ASK 588: the question round runs live (operator 23:36 CST 11-23); the dry-only gate of ruling 413's trial is removed */",'Init gate');
 s=once(s,"...(b.question_trial===true?{question_trial:true}:{})","...((RG!==null?b.question_trial===true:b.question_trial!==false)?{question_trial:true}:{}) /* ASK 588: on by default on a fresh run; off when question_trial:false is sent; a regrade runs it only when question_trial:true is sent */",'Init default');
 x.parameters.jsCode=s;log.push('Init Seats edited');}
// 4. Panel Judges Prep: the merged bodies only when the round ran whole
{const x=N(E,'Panel Judges Prep');x.parameters.jsCode=once(x.parameters.jsCode,"let body=qt ? $('QR Merge').first().json.judges[k-1].body : PB.judges[k-1].body;","let body=(()=>{try{if(qt&&$('QR Merge').isExecuted){const __m=$('QR Merge').first().json;if(__m&&__m.qr_ok===true&&Array.isArray(__m.judges)&&__m.judges[k-1]&&__m.judges[k-1].body)return __m.judges[k-1].body;}}catch(e){}return PB.judges[k-1].body;})(); /* ASK 588 D5 */",'PJP');log.push('Panel Judges Prep edited');}
// 5. every reader of the Panel Build judges reads the merged bodies when the round ran whole (send-back, gate, late gate, cure, reserve, alternates, payloads)
const PBJ="$('Panel Build').first().json";
const H="((__p)=>{try{const __q=$('QR Merge');if(__p&&__q&&__q.isExecuted){const __m=__q.first().json;if(__m&&__m.qr_ok===true&&Array.isArray(__m.judges)&&Array.isArray(__p.judges)&&__m.judges.length===__p.judges.length)return Object.assign({},__p,{judges:__m.judges,qa588:__m.qa_text});}}catch(e){}return __p;})("+PBJ+")";
const libEdit=(W,tag)=>{const {N:SL,T,a,b,c0,e,L,M}=cut(W);let nl=0,nm=0;const ch=[];
 L.forEach((l,i)=>{const k=l.split(PBJ).length-1;if(k){L[i]=l.split(PBJ).join(H);nl+=k;ch.push(i);}});
 for(const [key,v] of Object.entries(M)){if(!v||!Array.isArray(v.p))continue;v.p.forEach(x=>{if(Array.isArray(x)&&typeof x[0]==='string'){const k=x[0].split(PBJ).length-1;if(k){x[0]=x[0].split(PBJ).join(H);nm+=k;}}});}
 const rebuild=p=>p.map(x=>typeof x==='number'?L[x]:typeof x[0]==='string'?x[0]:L.slice(x[0],x[1]+1).join('\n')).join('\n');
 const mt=[];for(const [key,v] of Object.entries(M)){if(!v||!Array.isArray(v.p))continue;const n=rebuild(v.p).length;if(n!==v.n){mt.push(key);v.n=n;}}
 let head=T.slice(0,a);const LIBJ=JSON.stringify(L);const LS=fs.readFileSync('/mnt/project-files/ask519/w4/libcheck/libcheck.js','utf8');const SHA=new Function(LS.slice(0,LS.indexOf('const __LIBSHA422'))+'\nreturn __SHA422;')();const sha=SHA(LIBJ).slice(0,16);
 head=head.replace(/library sha [0-9a-f]{16}/,'library sha '+sha);SL.parameters.jsCode=head+LIBJ+T.slice(b,c0)+JSON.stringify(M)+T.slice(e);
 log.push(tag+' library: '+nl+' LIB reads in lines '+ch.join(',')+', '+nm+' MAP string reads; MAP n changed: '+mt.length+'; sha '+sha);return {sha,mt};};
const re=libEdit(E,'engine'),rc=libEdit(C,'child');
// engine library node stubs declare the QR Merge reference
{const {L,M}=cut(E);const srcOf=k=>M[k].p.map(x=>typeof x==='number'?L[x]:typeof x[0]==='string'?x[0]:L.slice(x[0],x[1]+1).join('\n')).join('\n');let n=0;
 for(const x of E.nodes){const s=x.parameters&&x.parameters.jsCode;if(typeof s!=='string'||!s.startsWith('if(false){')||!M[x.name])continue;if(!srcOf(x.name).includes("$('QR Merge')"))continue;if(s.includes('$("QR Merge")'))continue;x.parameters.jsCode='if(false){$("QR Merge");'+s.slice(10);n++;}
 log.push('engine stubs given $("QR Merge"): '+n);}
// plain nodes
for(const nm of ['Reserve Build','Panel Check']){const x=N(E,nm);const k=x.parameters.jsCode.split(PBJ).length-1;if(k!==1)throw new Error(nm+' reads '+k);x.parameters.jsCode=x.parameters.jsCode.split(PBJ).join(H);log.push(nm+' edited');}
// 6. the child receives the merged Panel Build through the alternate pass
{const x=N(E,'Alternate Pass Call');const v=x.parameters.workflowInputs.value;const A='$("Panel Build").all().map(i => i.json)';
 v.pass=once(v.pass,A,'$("Panel Build").all().map(i => (($("QR Merge").isExecuted && $("QR Merge").first().json.qr_ok === true && Array.isArray($("QR Merge").first().json.judges) && Array.isArray(i.json.judges) && $("QR Merge").first().json.judges.length === i.json.judges.length) ? Object.assign({}, i.json, { judges: $("QR Merge").first().json.judges, qa588: $("QR Merge").first().json.qa_text }) : i.json))','APC');log.push('Alternate Pass Call edited');}
// 7. the row records the round
{const x=N(E,'Build Save Body');x.parameters.jsCode=once(x.parameters.jsCode,"saveBody:{engine:S.challenger.engine,review_notes:RN,","saveBody:{engine:S.challenger.engine,review_notes:RN+(()=>{try{const q=$('QR Merge');if(!q||!q.isExecuted)return '';const j=q.first().json;return '\\n\\n[QUESTION ROUND v1: '+JSON.stringify(j.qr_ok===true?{status:'RAN',skips:j.skips||[],qa:(j.qa||[]).map(z=>({n:z.n,judge:z.judge,side:z.side,form:z.form,round:z.round,quote:z.quote,earlier_round:z.earlier_round,earlier_quote:z.earlier_quote,question:z.question,answer:z.answer,new_verses:z.new_verses,finish:z.finish,route:z.route,error:z.error})),checks:j.record||[]}:{status:'SKIPPED',why:j.qr_skip||null,checks:j.record||[]})+']';}catch(e){return '';}})() /* ASK 588 */,",'BSB');log.push('Build Save Body edited');}
fs.writeFileSync('target_engine_588.json',JSON.stringify(E));fs.writeFileSync('target_child_588.json',JSON.stringify(C));
// per-node diff
const diff=(A,B)=>{const out=[];const m=new Map(A.nodes.map(n=>[n.name,n]));for(const n of B.nodes){const o=m.get(n.name);if(!o)out.push('+ '+n.name);else if(JSON.stringify(o)!==JSON.stringify(n))out.push('~ '+n.name+' '+md5(JSON.stringify(o.parameters)).slice(0,8)+'->'+md5(JSON.stringify(n.parameters)).slice(0,8));}for(const n of A.nodes)if(!B.nodes.some(x=>x.name===n.name))out.push('- '+n.name);return out;};
console.log(JSON.stringify({agree:AGREE,log,engine_diff:diff(E0,E),child_diff:diff(C0,C),connections_changed:JSON.stringify(E0.connections)!==JSON.stringify(E.connections),eng_md5:md5(JSON.stringify(E)).slice(0,8),child_md5:md5(JSON.stringify(C)).slice(0,8)},null,1));
