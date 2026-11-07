// pkgESR test. Run from wall2024/: node pkgESR/test_ESR.cjs
// 1. Builds, every saved run 33218+: every id kept once, no item left unchecked, calls <= 10; the estimated cost of each call listed.
// 2. Records, no-retry path: on the saved replies with the base Build output, rows equal to base (pkgEAI/patched_on_pkgEID).
// 3. Retry Build on the saved replies: halves only for the failed calls (33299 Alt call 1, 33222 Main call 2), whole items, every id once.
// 4. Records, retry path: synthetic replies for the halves read every retried id; other rows unchanged; a half that fails again stays NO VERDICT.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const EB=process.env.ESR_EB||'pkgEAI/patched_on_pkgEID/',P=process.env.ESR_P||__dirname+'/patched/'; /* ESR_EB/ESR_P: other stack, e.g. pkgEAX */const rf=(d,n)=>fs.readFileSync(d+n.replace(/ /g,'_')+'.js','utf8');
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;out.push('OK '+m);}else{bad++;log('FAIL '+m);}};
const st=x=>JSON.stringify(x,(k,v)=>k==='at'?undefined:v);
const W={'E-ANS':314,'E-VOID':5648,'E-COL':1684,'E-HOLD':508,'E-KEY':5244,'E-PREM':1043,'E-RES':4613,'E-SYN':328};
const est=b=>{const s=new Set();let w=7979;for(const x of b.ids||[]){const p=x.id.split('.')[0];if(s.has(p))continue;s.add(p);w+=W[x.rule]||1500;}return w;};
const runs=fs.readdirSync(D).filter(f=>/^\d+_Judge_Enforcer_Build\.json$/.test(f)).map(f=>f.split('_')[0]).filter(r=>+r>=33218).sort();
const SIDES=[['Judge Enforcer Build','Enforcer Record','Judge Enforcer Record','Judge Enforcer Call deepseek','Judge Enforcer Retry Build','Judge Enforcer Retry Call deepseek'],
 ['Alt Judge Enforcer Build','Alt Seated','Alt Judge Enforcer Record','Alt Judge Enforcer Call deepseek','Alt Judge Enforcer Retry Build','Alt Judge Enforcer Retry Call deepseek']];
let calls0=0,calls1=0;
for(const RUN of runs)for(const [jb,jbi,jr,jc,rb,rc] of SIDES){if(!fs.existsSync(D+RUN+'_'+jb.replace(/ /g,'_')+'.json'))continue;
 let b0,b1;try{b0=harness(RUN)(rf(EB,jb),jbi);b1=harness(RUN)(rf(P,jb),jbi);}catch(e){T(false,RUN+' '+jb+' threw '+String(e.message).slice(0,120));continue;}
 if(b0[0]&&b0[0].json.je_skip){T(st(b0)===st(b1),RUN+' '+jb+': je_skip path unchanged');continue;}
 const ids=bs=>bs.flatMap(x=>(x.json.ids||[]).map(y=>y.id)).sort();const nc=bs=>((bs[0]||{}).json||{}).not_checked||[];
 const sameItems=st(b0.flatMap(x=>x.json.ids).sort((a,b)=>a.id<b.id?-1:1))===st(b1.flatMap(x=>x.json.ids).sort((a,b)=>a.id<b.id?-1:1));
 calls0+=b0.length;calls1+=b1.length;
 T(sameItems&&nc(b1).length===0&&nc(b0).length===0&&b1.length<=10,RUN+' '+jb+': '+ids(b1).length+' ids kept, calls '+b0.length+' -> '+b1.length+', est. cost per call ['+b0.map(x=>Math.round(est(x.json)/1000)+'K').join(' ')+'] -> ['+b1.map(x=>Math.round(est(x.json)/1000)+'K').join(' ')+']');
 if(!fs.existsSync(D+RUN+'_'+jc.replace(/ /g,'_')+'.json'))continue;
 // 2. no-retry path
 const r0=harness(RUN,{[jb]:b0})(rf(EB,jr),jc),r1=harness(RUN,{[jb]:b0})(rf(P,jr),jc);const A0=r0[0].json,Bj=r1[0].json;
 T(st(A0.enf428_rows)===st(Bj.enf428_rows)&&st({...A0.enf428,eid:0})===st({...Bj.enf428,eid:0,esr:undefined})&&Bj.enf428.esr.retried.length===0,RUN+' '+jr+': no-retry path, '+A0.enf428_rows.length+' rows equal to base');
 // 3. Retry Build (on the saved Build output, which the saved replies answer)
 const bS=harness(RUN)("return $('"+jb+"').all();",jc);const rr=harness(RUN)(rf(P,rb),jc);const A=harness(RUN)(rf(EB,jr),jc)[0].json;const reps=harness(RUN)('return $input.all();',jc).map(x=>x.json);
 const failed=reps.map((r,i)=>{const c=r&&r.choices&&r.choices[0];return (!c||r.error||c.finish_reason==='length'||!String(c.message&&c.message.content||'').trim())?i:-1;}).filter(i=>i>=0);
 const halves=rr.map(x=>x.json).filter(x=>x.esr_retry);
 if(!failed.length){T(rr.length===1&&rr[0].json.esr_retry===false,RUN+' '+rb+': no failed call, one marker item');continue;}
 const okSplit=failed.every(i=>{const hs=halves.filter(h=>h.esr_of===i);const want=bS[i].json.ids.map(x=>x.id).sort().join(',');const got=hs.flatMap(h=>h.ids.map(x=>x.id)).sort().join(',');
  const txt=bS[i].json.body.messages[1].content;const head=txt.split(/\n\n(?=ITEM [A-Z]\d+ \()/)[0];return hs.length===2&&want===got&&hs.every(h=>h.body.messages[1].content.startsWith(head)&&h.body.model===bS[i].json.body.model)&&hs[0].body.messages[1].content.length+hs[1].body.messages[1].content.length-head.length===txt.length;});
 T(okSplit&&halves.length===failed.length*2,RUN+' '+rb+': failed call(s) '+failed.map(i=>i+1).join(',')+' ('+halves.map(h=>h.esr_why).filter((v,k,a)=>a.indexOf(v)===k).join('; ')+') split into '+halves.length+' halves ['+halves.map(h=>h.ids.length+' ids, '+Math.round(h.body.messages[1].content.length/1000)+'K chars').join(' | ')+'], every id once, text intact');
 // 4. retry path, synthetic replies
 const synth=(h,bad)=>bad?{choices:[{message:{content:'ENFORCER: x'},finish_reason:'length'}]}:{choices:[{message:{content:h.ids.map(x=>'ENFORCER: '+x.id+' -- AGREE -- RIGHT: '+({'E-ANS':'MEETS','E-PREM':'SPARED','E-RES':'FOLLOWS','E-SYN':'TRUE','E-VOID':'VOID'}[x.rule]||'STANDS')+' -- synthetic').join('\n')},finish_reason:'stop'}]};
 for(const failSecond of [false,true]){
  const RC=halves.map((h,k)=>({json:synth(h,failSecond&&k===1)}));const r2=harness(RUN,{[rb]:halves.map(h=>({json:h})),[rc]:RC})(rf(P,jr),rc);const J=r2[0].json;
  const rows0=A.enf428_rows,rows2=J.enf428_rows;const retriedIds=new Set(halves.flatMap((h,k)=>failSecond&&k===1?[]:h.ids.map(x=>x.seat+'|'+x.item+'|'+x.flagged_line)));
  const key=x=>x.seat+'|'+x.item+'|'+x.flagged_line;const nv0=rows0.filter(x=>/^ENFORCER NO VERDICT/.test(x.cure_reason)).length,nv2=rows2.filter(x=>/^ENFORCER NO VERDICT/.test(x.cure_reason)).length;
  const others=rows2.filter(x=>!retriedIds.has(key(x))&&x.kind==='enforcer_check'&&x.rule&&!/^ENFORCER NO VERDICT/.test(x.cure_reason));const othersBase=rows0.filter(x=>!retriedIds.has(key(x))&&!/^ENFORCER NO VERDICT/.test(x.cure_reason));
  const restEq=st(others.map(x=>({...x,prompt_sent:null,full_reply:null})).sort((a,b)=>key(a)<key(b)?-1:1))===st(othersBase.map(x=>({...x,prompt_sent:null,full_reply:null})).sort((a,b)=>key(a)<key(b)?-1:1));
  T(rows2.length===rows0.length&&restEq&&J.enf428.esr.retried.length===failed.length&&(failSecond?nv2>0&&nv2<nv0:nv2===rows0.filter(x=>/^ENFORCER NO VERDICT/.test(x.cure_reason)&&!retriedIds.has(key(x))).length),
   RUN+' '+jr+': retry path'+(failSecond?' (second half fails again)':'')+', NO VERDICT '+nv0+' -> '+nv2+', other rows unchanged, esr '+JSON.stringify(J.enf428.esr));}}
log('calls over all saved runs: '+calls0+' -> '+calls1);log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync(__dirname+'/test_ESR.txt',out.join('\n')+'\n');
