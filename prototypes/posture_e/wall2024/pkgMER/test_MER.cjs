// pkgMER test. Run from wall2024/: node pkgMER/test_MER.cjs
// 1. Retry Build on every saved run with an Enforcer Call deepseek: which calls retry, and why; parts are whole ITEMs, every id once, heads unchanged.
// 2. Record, no-retry path (Retry Call unexecuted): output byte-equal to the live Record on the saved inputs, every run.
// 3. Record, retry path on 33705 with synthetic part replies (offline makes no call): every id read; a part that fails again stays NO VERDICT with that part's error.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s62.json','utf8'));const REC0=W.nodes.find(n=>n.name==='Enforcer Record').parameters.jsCode;
const REC1=fs.readFileSync('pkgMER/out/Enforcer_Record.js','utf8');const RB=fs.readFileSync('pkgMER/retry_build.js','utf8');
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK   '+m);}else{bad++;log('FAIL '+m);}};
const st=x=>JSON.stringify(x,(k,v)=>k==='at'?undefined:v);
const runs=fs.readdirSync(D).filter(f=>/^\d+_Enforcer_Call_deepseek\.json$/.test(f)).map(f=>f.split('_')[0]).sort();
const runs2=runs.filter(r=>fs.existsSync(D+r+'_Enforcer_Build.json'));log('runs with Enforcer Call deepseek saved: '+runs.length+'; with Enforcer Build saved: '+runs2.length+' (the rest: '+runs.filter(r=>!runs2.includes(r)).join(', ')+')');
const fired=[];
for(const RUN of runs2){const B=harness(RUN)("return $('Enforcer Build').first().json;",'Enforcer Call deepseek');
 let rb;try{rb=harness(RUN)(RB,'Enforcer Call deepseek').map(x=>x.json);}catch(e){T(false,RUN+' Retry Build threw '+e.message);continue;}
 const rep=harness(RUN)('return $input.all();','Enforcer Call deepseek').map(x=>x.json)[0]||{};const c=(rep.choices||[])[0]||{};
 const desc='finish '+(c.finish_reason||'-')+', content '+String((c.message&&c.message.content)||'').length+' chars, ids '+(B.ids||[]).length;
 if(rb[0].esr_retry){fired.push(RUN);const msg=B.body.messages[1].content;const head=msg.split(/\n\n(?=ITEM G?\d+(?: OF \d+)? \()/)[0];
  const allIds=rb.flatMap(x=>x.ids.map(y=>y.id));const once=allIds.length===B.ids.length&&new Set(allIds).size===B.ids.length;
  const heads=rb.every(x=>x.body.messages[0].content===B.body.messages[0].content&&x.body.messages[1].content.startsWith(head+'\n\nITEM ')&&x.body.max_tokens===B.body.max_tokens&&x.body.model===B.body.model);
  const itemsBack=rb.map(x=>x.body.messages[1].content.slice(head.length+2)).join('\n\n')===msg.slice(head.length+2);
  T(once&&heads&&itemsBack,RUN+': RETRY ('+rb[0].esr_why+'); '+rb.length+' parts of ['+rb.map(x=>new Set(x.ids.map(y=>y.id.split('.')[0])).size+' items/'+x.ids.length+' ids/'+Math.round(x.body.messages[1].content.length/1000)+'K chars').join(', ')+'] ; every id once, system and rules head unchanged, item texts byte-equal in order');}
 else T(rb.length===1,RUN+': no retry ('+desc+')');
 const r0=harness(RUN)(REC0,'Enforcer Call deepseek'),r1=harness(RUN)(REC1,'Enforcer Call deepseek');
 T(st(r0)===st(r1),RUN+': Record, no-retry path, output equal to live ('+((r0[0].json.enf421_rows)||[]).length+' rows)');}
// 3. retry path, 33705
const RUN='33705';const rb=harness(RUN)(RB,'Enforcer Call deepseek').map(x=>x.json);
const mk=(x,f)=>({id:'syn',choices:[{finish_reason:'stop',message:{role:'assistant',content:x.ids.map(y=>'ENFORCER: '+y.id+' -- '+f(y)+' -- NEEDS: NO -- synthetic').join('\n')}}]});
const V=['AGREE','DISAGREE'];const f=y=>V[+y.id.split('.')[1]%2];
const ov=(reps)=>({'Enforcer Retry Build':rb.map(j=>({json:j})),'Enforcer Retry Call deepseek':reps.map(j=>({json:j}))});
let R=harness(RUN,ov(rb.map(x=>mk(x,f))))(REC1,'Enforcer Retry Call deepseek')[0].json;const ta=R.enf421.tally;
const want=rb.flatMap(x=>x.ids).reduce((a,y)=>(a[f(y)]=(a[f(y)]||0)+1,a),{});
T(ta['NO VERDICT']===0&&ta.AGREE===want.AGREE&&ta.DISAGREE===want.DISAGREE&&R.enf421_rows.every(r=>r.reply_error===null)&&R.enf421.mer.parts===rb.length&&R.enf421.mer.failed_parts.length===0,
 RUN+': all parts answer: NO VERDICT 0, tally '+JSON.stringify(ta)+', mer '+JSON.stringify(R.enf421.mer));
const base=harness(RUN)(REC0,'Enforcer Call deepseek')[0].json;
T(st(R.enf421_rows.map(r=>({...r,cure_reason:0,full_reply:0,reply_error:0})))===st(base.enf421_rows.map(r=>({...r,cure_reason:0,full_reply:0,reply_error:0}))),RUN+': rows keep every other field (seat, rule, item, lines, prompt_sent) equal to live');
const reps2=rb.map((x,i)=>i===1?{id:'syn',choices:[{finish_reason:'length',message:{role:'assistant',content:''}}],usage:{completion_tokens:64000}}:mk(x,f));
R=harness(RUN,ov(reps2))(REC1,'Enforcer Retry Call deepseek')[0].json;const p2=new Set(rb[1].ids.map(y=>y.id));
const ids5=harness(RUN)("return $('Enforcer Build').first().json.ids;",'Enforcer Call deepseek').map(y=>y.id);
log('     mer '+JSON.stringify(R.enf421.mer)+'; rows with part-2 error '+R.enf421_rows.filter(r=>r.reply_error&&/retry part 2 of/.test(r.reply_error)).length);
T(R.enf421_rows.every((r,i)=>/^ENFORCER NO VERDICT/.test(r.cure_reason)===p2.has(ids5[i]))&&R.enf421.tally['NO VERDICT']===p2.size&&R.enf421.mer.failed_parts.join()==='2'&&R.enf421_rows.filter(r=>r.reply_error&&/retry part 2 of/.test(r.reply_error)).length===p2.size,
 RUN+': part 2 fails again: its '+p2.size+' ids stay NO VERDICT with the part error; the others are read; tally '+JSON.stringify(R.enf421.tally));
const reps3=rb.map(()=>({error:{message:'timeout'}}));R=harness(RUN,ov(reps3))(REC1,'Enforcer Retry Call deepseek')[0].json;
T(R.enf421.tally['NO VERDICT']===rb.flatMap(x=>x.ids).length&&R.enf421_rows.every(r=>/every retry part failed/.test(r.reply_error)),RUN+': every part fails: all NO VERDICT, error kept on each row');
{const B5=harness(RUN)("return $('Enforcer Build').all();",'Enforcer Call deepseek');B5[0].json.ids=B5[0].json.ids.slice(1); /* one id has no item text owner left out: the whole-item check fails */
 const B5b=JSON.parse(JSON.stringify(B5));B5b[0].json.ids.push({...B5[0].json.ids[0],id:'A99.1'});
 const mk5=harness(RUN,{'Enforcer Build':B5b})(RB,'Enforcer Call deepseek');
 const R5=harness(RUN,{'Enforcer Build':B5b,'Enforcer Retry Build':mk5,'Enforcer Retry Call deepseek':null})(REC1,'Enforcer Retry Needed?')[0].json;
 T(mk5.length===1&&mk5[0].json.esr_retry===false&&/finish_reason length/.test(mk5[0].json.esr_unsplit||'')&&R5.enf421.mer&&R5.enf421.mer.retried===false&&R5.enf421.tally['NO VERDICT']===B5b[0].json.ids.length,
  RUN+': a failed call whose ids cannot all be placed in whole items: marker names it, no retry, Record shows mer '+JSON.stringify(R5.enf421.mer).slice(0,140));}
log('retry fired in: '+fired.join(', '));log('TOTAL '+ok+' OK, '+bad+' FAIL');
fs.writeFileSync('pkgMER/test_MER.txt',out.join('\n')+'\n');
