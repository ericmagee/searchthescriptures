// pkgVP4 probe (W2): run 34108, written DeepSeek replies (no DeepSeek call offline).   node pkgVP4/probe_VP4.cjs   (from wall2024/)
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const W=__dirname+'/..';
const PAR=JSON.parse(fs.readFileSync(__dirname+'/parent_s87_VP4.json','utf8'));const BASE=(j=>j.data||j.workflow||j)(JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s87.json','utf8')));const ST=r=>String(r.cure_reason||'').split(' -- ')[0];
const code=(d,n)=>d.nodes.find(x=>x.name===n).parameters.jsCode;const J=x=>({json:x});const cl=x=>JSON.parse(JSON.stringify(x));
const run=async(c,over,inp)=>await harness('34108',over||{})('return (async()=>{\n'+c+'\n})();',inp||'Panel Payloads');
let ok=0,bad=0;const T=(n,c,i)=>{if(c){ok++;console.log('OK   '+n+(i?': '+i:''));}else{bad++;console.log('FAIL '+n+(i?': '+i:''));}};
const reply=t=>[J({choices:[{message:{role:'assistant',content:t},finish_reason:'stop'}]})];
const PPs=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/34108_Panel_Payloads.json','utf8'));const PP=(Array.isArray(PPs)?PPs[0]:PPs).data.main[0];
const JCR=[J({...PP[0].json,jcc:{skipped:true,confirmed:[],rows:[]},jcc_log:[]})];
(async()=>{
// 1. Build
const B=(await run(code(PAR,'Assume Check Build'),{'Judge Contradiction Record':JCR},'Judge Contradiction Record'))[0].json;const U=B.body&&B.body.messages[1].content;
T('1a 34108: six premises against the defender carry ASSUMES ([DR2]); none against the challenger ([CR3] list has no ASSUMES)',!B.acx_skip&&B.prem.length===6&&B.prem.every(p=>p.side==='DEFENDER'),B.prem.map(p=>p.side+' '+p.n).join(', '));
const P6=B.prem.find(p=>p.n===6);
T('1b premise 6: ASSUMES read whole, the answering block is [CR3] LINK 6 up to LINK... end (Footing and Answers inside)',P6.assumes==='"of the Holy Ghost" names the begetter of the flesh, and Mary carries the house of David.'&&P6.answer_round==='CR3'&&P6.block.startsWith('**LINK 6: NARROWED TO:**')&&P6.block.includes('**Answers to the pressed witnesses**')&&!P6.block.includes('UNSUPPORTED-L4'),P6.block.length+' chars');
T('1c one DeepSeek body: temperature 0, the prompt quotes the UNEXHIBITED rule, DG-61 and Commitment 3, and every premise block is given',B.body.temperature===0&&U.includes('no quoted row gives that fact')&&U.includes('(DG-61)')&&U.includes('no count of verses decides it')&&[1,2,3,4,5,6].every(n=>U.includes('DEFENDER PREMISE '+n+' ')),U.length+' chars');
const BS=(await run(code(PAR,'Assume Check Build'),{'Resolve Seats':[J({})]}))[0].json;T('1d no DeepSeek row: skipped, says why',BS.acx_skip===true&&/DeepSeek/.test(BS.why));
{const FO=cl(JSON.parse(fs.readFileSync("/mnt/project-files/wall2024/inputs/34108_Final_Output.json","utf8"))[0].data.main[0]);const t=FO[0].json.cr3;const k=t.indexOf("\n6. The reckoning by usage");const e=t.indexOf("\n",k+2);
 FO[0].json.cr3=t.slice(0,e)+" ASSUMES: Joseph was reckoned by the house of his fathers at Luke 3:23. ROWS GIVE: Numbers 1:18 \"by the house of their fathers\"."+t.slice(e);
 const BC=(await run(code(PAR,"Assume Check Build"),{"Final Output":FO}))[0].json;const c6=BC.prem.find(p=>p.side==="CHALLENGER");
 T("1e a planted ASSUMES in the [CR3] list against the challenger: premise 6, answered by [DR3] LINK 6",BC.prem.length===7&&c6&&c6.n===6&&c6.answer_round==="DR3"&&c6.block.startsWith("**LINK 6: SUPPORTED.**")&&/Joseph was reckoned/.test(c6.assumes),c6&&(c6.block.length+" chars, "+c6.quotes.length+" quotes"));}
// 2. Record
const ALLR=[];const rec=async(txt,b,o)=>(x=>{ALLR.push(...(x.acx_log||[]));return x;})((await run(code(PAR,'Assume Check Record'),{'Judge Contradiction Record':JCR,'Assume Check Build':[J(b||B)],'Assume Check Call deepseek':txt==null?[J({error:{message:'timeout'}})]:reply(txt),...(o||{})},'Assume Check Call deepseek'))[0].json);
const F1='ASSUME-CHECK: DEFENDER PREMISE 6 -- FACT 1 "of the Holy Ghost names the begetter of the flesh" -- STATED -- Matthew 1:18 "of the Holy Ghost" -- the block quotes the verse.';
const F2='ASSUME-CHECK: DEFENDER PREMISE 6 -- FACT 2 "Mary carries the house of David" -- NOT STATED -- the quoted verses give the seed of David and a birth of thee; the route through Mary is the block\'s own [L4].';
let R=await rec(F1+'\n'+F2);const f2=R.acx.facts.find(f=>f.n===6&&f.k===2);
T('2a premise 6 fact 2: DeepSeek NOT STATED and code NOT STATED (Mary is in no quoted verse word of the block): both',f2&&f2.both_not_stated&&f2.code==='NOT STATED'&&f2.missing.join()==='Mary',JSON.stringify(f2&&{ds:f2.deepseek,code:f2.code,missing:f2.missing}));
T('2b the judges\' grades of premise 6 read from their CONCEDED LINKS lines: luna, chatgpt (terra), sol SPARED; the single judge not read (its reply was unreadable)',JSON.stringify(f2.grades)===JSON.stringify([{seat:'luna',grade:'SPARED'},{seat:'chatgpt',grade:'SPARED'},{seat:'sol',grade:'SPARED'},{seat:'single judge',grade:null}])||f2.grades.filter(g=>g.grade==='SPARED').length===3,JSON.stringify(f2.grades));
T('2c three E-ASSUME items (TRIAL), one per seat that spared premise 6, all on fact 2',R.acx.items.length===3&&R.acx.items.every(i=>i.n===6&&i.k===2),R.acx.items.map(i=>i.seat).join(', '));
const f1=R.acx.facts.find(f=>f.n===6&&f.k===1);
T('2d fact 1 STATED with verse words found in the block: no item',f1.deepseek==='STATED'&&!f1.both_not_stated);
T('2e premises 1 to 5 not answered by DeepSeek: one NO ANSWER row each, no item',[1,2,3,4,5].every(n=>R.acx.facts.some(f=>f.n===n&&f.deepseek==='NO ANSWER'&&!f.both_not_stated)));
T('2f log: one E-ASSUME row per fact with both readers\' answers, then one row per judge item; record-only wording',R.acx_log.length===R.acx.facts.length+3&&R.acx_log.every(r=>r.rule==='E-ASSUME'&&/RECORD-ONLY TRIAL/.test(r.cure_reason))&&R.acx_log.filter(r=>ST(r)==='ITEM (TRIAL)').length===3&&/DEEPSEEK: NOT STATED -- CODE: NOT STATED/.test(R.acx_log.find(r=>r.item==='DEFENDER PREMISE 6 FACT 2').cure_reason),R.acx_log.map(r=>r.item+'='+ST(r)).join(' | '));
const keys=Object.keys(JCR[0].json);T('2g the item from Judge Contradiction Record passes on unchanged, with acx and acx_log added',keys.every(k=>JSON.stringify(R[k])===JSON.stringify(JCR[0].json[k]))&&Object.keys(R).length===keys.length+2);
R=await rec(F1+'\n'+F2.replace('NOT STATED -- the quoted','STATED -- Luke 1:27 "the virgin\'s name was Mary" -- the quoted'));
T('2h STATED whose verse words are not quoted in the block: STATED (verse words not found), no item',R.acx.facts.find(f=>f.k===2).deepseek==='STATED (verse words not found in the block)'&&R.acx.items.length===0);
R=await rec(F2.replace('NOT STATED','INFERRED ACT'));T('2i INFERRED ACT: no item',R.acx.items.length===0&&R.acx.facts.find(f=>f.k===2).deepseek==='INFERRED ACT');
R=await rec('ASSUME-CHECK: DEFENDER PREMISE 2 -- FACT 1 "Joseph\'s justice rests on doubt of his fatherhood" -- NOT STATED -- none.');
const f22=R.acx.facts.find(f=>f.n===2);T('2j readers differ (DeepSeek NOT STATED, code POSSIBLY STATED: Joseph is quoted): no item, row READERS DIFFER',f22.code==='POSSIBLY STATED'&&R.acx.items.length===0&&ST(R.acx_log.find(r=>r.item==='DEFENDER PREMISE 2 FACT 1'))==='READERS DIFFER');
R=await rec(null);T('2k a failed call: every premise NO REPLY, the error recorded, no item',R.acx.items.length===0&&R.acx.errors.length===1&&R.acx.facts.every(f=>f.deepseek==='NO REPLY'));
R=await rec('**ASSUME-CHECK:** DEFENDER PREMISE 6 -- FACT 2 “Mary carries the house of David” -- NOT STATED -- x');T('2l bold label and curly quotes are read',R.acx.items.length===3);
R=await rec(F2,BS);T('2m Build skipped: one NOT CHECKED row, item passes on',R.acx.skipped===true&&R.acx_log.length===1&&ST(R.acx_log[0])==='NOT CHECKED'&&R.acx.items.length===0);
// a judge who COUNTED premise 6 gets no item
const PP2=cl(PP);const b0=JSON.parse(PP2[0].json.bodies[0]);b0.payload.verdict_raw=String(b0.payload.verdict_raw).replace(/CONCEDED LINKS: 0 -- [^\n]*/,'CONCEDED LINKS: 1 -- Premise 6 is UNEXHIBITED.');PP2[0].json.bodies[0]=JSON.stringify(b0);
R=await rec(F2,null,{'Panel Payloads':PP2});T('2n a seat that COUNTED premise 6 gets no item; the other two do',R.acx.items.length===2&&!R.acx.items.some(i=>i.seat===b0.payload.judge_seat),R.acx.items.map(i=>i.seat).join(', '));
{const bad=ALLR.filter(r=>!['panel','reserve','alternate','single','synthesis'].includes(r.seat_role)||!(r.cure_status==null||r.cure_status==='CURED'||r.cure_status==='UNCURED')||!['cure','alternate_reply','failed_reply','enforcer_check','send_back'].includes(r.kind||'cure'));
 T('2o every E-ASSUME row the probe makes passes debate_enforcer_log\'s seat_role, cure_status and kind checks (W3 3772 fix 1)',ALLR.length>40&&bad.length===0,ALLR.length+' rows, '+bad.length+' fail');
 fs.writeFileSync(__dirname+'/probe_rows.json',JSON.stringify([...new Map(ALLR.map(r=>[ST(r)+'|'+r.seat_role,{...r,prompt_sent:r.prompt_sent&&String(r.prompt_sent).slice(0,200),full_reply:r.full_reply&&String(r.full_reply).slice(0,200)}])).values()]));}
{const Bx=(await run(code(PAR,'Assume Check Build'),{'Init Seats':[J(null)],'Judge Contradiction Record':JCR},'Judge Contradiction Record'))[0].json;
 T('2p a throw inside Assume Check Build: it returns a skip that says why, the debate goes on',Bx.acx_skip===true&&/Assume Check Build failed: /.test(Bx.why),Bx.why);
 const Rx=(await run(code(PAR,'Assume Check Record'),{'Judge Contradiction Record':JCR,'Assume Check Build':[J({acx_skip:false,prem:null,run_token:'t'})],'Assume Check Call deepseek':reply('x')},'Assume Check Call deepseek'))[0].json;
 T('2q a throw inside Assume Check Record: Judge Contradiction Record\'s item passes on, one NOT CHECKED row in the allowed values',Rx.acx.skipped===true&&/Assume Check Record failed/.test(Rx.acx.why)&&Rx.acx_log.length===1&&Rx.acx_log[0].seat_role==='panel'&&Rx.acx_log[0].cure_status===null&&Object.keys(JCR[0].json).every(k=>JSON.stringify(Rx[k])===JSON.stringify(JCR[0].json[k])),Rx.acx&&Rx.acx.why);}
// 3. psG equals library psGrades on every saved run's CONCEDED LINKS lines
{const lib=fs.readFileSync(W+'/pkgLIB/strip_CEC/patched/Gate_Build.js','utf8');const i=lib.indexOf('function psGrades(');const e=lib.indexOf('\nfunction ',i+10);
 const psGrades=new Function('ri3Head2024',lib.slice(i,e)+'\nreturn psGrades;')(()=>null);
 const rc=code(PAR,'Assume Check Record');const k=rc.indexOf('function psG(');const psG=new Function(rc.slice(k,rc.indexOf('\n',rc.indexOf('return {side:',k)))+'\nreturn psG;')();
 let n=0,diff=[];for(const f of fs.readdirSync('/mnt/project-files/wall2024/inputs').filter(f=>/_Panel_Payloads\.json$/.test(f))){let d;try{d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/'+f,'utf8'));}catch(x){continue;}let it=null;try{it=(Array.isArray(d)?d[0]:d).data.main[0];}catch(x){continue;}
  for(const b of ((it&&it[0]&&it[0].json.bodies)||[])){let p;try{p=JSON.parse(b).payload;}catch(x){continue;}for(const l of String(p.verdict_raw||'').replace(/\\n/g,'\n').split('\n')){if(!/CONCEDED LINKS/.test(l))continue;const a=psGrades(l),c=psG(l);if(!a&&!c)continue;n++;if(JSON.stringify(a)!==JSON.stringify(c))diff.push(f+': '+l.slice(0,80));}}}
 T('3a the inlined psG equals the library psGrades on every saved CONCEDED LINKS line (header form aside)',n>50&&diff.length===0,n+' lines, '+diff.length+' differ'+(diff.length?': '+diff.slice(0,2).join(' | '):''));}
// 4. Alternate Merge
{const AM=code(PAR,'Alternate Merge'),AM0=code(BASE,'Alternate Merge');const R2=await rec(F1+'\n'+F2);
 const a0=(await run(AM0,{},'Alternate Merge'))[0].json,a1=(await run(AM,{},'Alternate Merge'))[0].json;T('4a no Assume Check Record: Alternate Merge byte-equal to base',JSON.stringify(a0)===JSON.stringify(a1));
 const a2=(await run(AM,{'Assume Check Record':[J(R2)]},'Alternate Merge'))[0].json;T('4b with the record: the E-ASSUME rows lead enforcer_log; the rest unchanged',JSON.stringify(a2.enforcer_log.slice(0,R2.acx_log.length))===JSON.stringify(R2.acx_log)&&JSON.stringify(a2.enforcer_log.slice(R2.acx_log.length))===JSON.stringify(a0.enforcer_log),a2.enforcer_log.length+' rows');}
// 5. parent
{const nb=new Set(BASE.nodes.map(n=>n.name));const add=PAR.nodes.filter(n=>!nb.has(n.name)).map(n=>n.name);const ch=PAR.nodes.filter(n=>nb.has(n.name)&&JSON.stringify(n)!==JSON.stringify(BASE.nodes.find(m=>m.name===n.name))).map(n=>n.name);
 T('5a parent: +4 nodes, only Alternate Merge changed',add.length===4&&JSON.stringify(ch)==='["Alternate Merge"]',add.join(', ')+' | '+ch.join(', '));}
console.log('\n'+ok+' OK, '+bad+' FAIL');})().catch(e=>console.log('ERROR '+e.stack));
