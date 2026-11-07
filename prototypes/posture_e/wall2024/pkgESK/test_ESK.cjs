// pkgESK test. Run from wall2024/: node pkgESK/test_ESK.cjs
// 1. Retry Build, every saved run 33218+ with a Call: base vs patched; every call newly retried is listed with its answered count (must be a real short reply).
// 2. 33430: call 5 (1 of 26 answered) sends its 25 unanswered ids again, Y1.1 kept; the halves' text is the call's head plus whole items.
// 3. Record on 33430 with synthetic half replies: NO VERDICT 25 -> 0, Y1.1 keeps its original verdict, every other row unchanged; a half failing again stays NO VERDICT.
// 4. Record without retry nodes: rows equal to base in every saved run.
// (DBG=1 prints any not-retried row that differs from base.)
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const RB='pkgESR/patched_on_pkgEAX/',EB='pkgEIS/patched/',P=__dirname+'/patched/';
const rf=(d,n)=>fs.readFileSync(d+n.replace(/ /g,'_')+'.js','utf8');let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;out.push('OK '+m);}else{bad++;log('FAIL '+m);}};
const st=x=>JSON.stringify(x,(k,v)=>k==='at'?undefined:v);const key=x=>x.seat+'|'+x.item+'|'+x.flagged_line+'|'+x.rule;const NV=x=>/^ENFORCER NO VERDICT/.test(x.cure_reason||'');
const runs=fs.readdirSync(D).filter(f=>/^\d+_Judge_Enforcer_Call_deepseek\.json$/.test(f)).map(f=>f.split('_')[0]).filter(r=>+r>=33218).sort();
for(const RUN of runs)for(const pre of ['','Alt ']){const jc=pre+'Judge Enforcer Call deepseek',rb=pre+'Judge Enforcer Retry Build',jr=pre+'Judge Enforcer Record',jb=pre+'Judge Enforcer Build';
 if(!fs.existsSync(D+RUN+'_'+jc.replace(/ /g,'_')+'.json'))continue;const H=harness(RUN);
 let a,b;try{a=H(rf(RB,rb),jc).map(x=>x.json);b=H(rf(P,rb),jc).map(x=>x.json);}catch(e){T(false,RUN+' '+rb+' threw '+String(e.message).slice(0,100));continue;}
 const nw=b.filter(x=>x.esr_short);const old=b.filter(x=>x.esr_retry&&!x.esr_short);T(st(old)===st(a.filter(x=>x.esr_retry)),RUN+' '+rb+': failed-call halves unchanged ('+a.filter(x=>x.esr_retry).length+')'+(nw.length?'; NEW short-reply retry: '+[...new Set(nw.map(x=>'call '+(x.esr_of+1)+' '+x.esr_why))].join('; ')+' -> '+nw.map(x=>x.ids.length+' ids').join(' + '):''));
 const bS=H("return $('"+jb+"').all();",jc).map(x=>x.json);
 for(const x of nw){const src=bS[x.esr_of].body.messages[1].content;const head=src.split(/\n\n(?=ITEM [A-Z]\d+ \()/)[0];const blocks=x.body.messages[1].content.slice(head.length+2).split(/\n\n(?=ITEM [A-Z]\d+ \()/);
  T(x.body.messages[1].content.startsWith(head)&&blocks.every(t=>src.includes(t))&&x.ids.some(y=>!(x.esr_keep||[]).includes(y.id)),RUN+' call '+(x.esr_of+1)+' half '+x.esr_half+': head + '+blocks.length+' whole items, each half carries an unanswered id');}
 if(nw.length){const of=nw[0].esr_of;const sent=new Set(nw.filter(x=>x.esr_of===of).flatMap(x=>x.ids.map(y=>y.id)));const keep=new Set(nw[0].esr_keep);T(bS[of].ids.every(y=>keep.has(y.id)||sent.has(y.id)),RUN+' call '+(of+1)+': every unanswered id is sent again (answered '+keep.size+', sent '+sent.size+')');
  const base=H(rf(EB,jr),jc)[0].json.enf428_rows;const halves=b.filter(x=>x.esr_retry);
  const synth=(h,fail)=>fail?{choices:[{message:{content:'ENFORCER: x'},finish_reason:'length'}]}:{choices:[{message:{content:h.ids.map(y=>'ENFORCER: '+y.id+' -- AGREE -- RIGHT: '+({'E-ANS':'MEETS','E-PREM':'SPARED','E-RES':'FOLLOWS','E-SYN':'TRUE','E-VOID':'VOID','E-B7':'SAME GROUND'}[y.rule]||'STANDS')+' -- synthetic').join('\n')},finish_reason:'stop'}]};
  for(const fail of [false,true]){const RC=halves.map((h,k)=>({json:synth(h,fail&&k===halves.length-1)}));const r=harness(RUN,{[rb]:halves.map(h=>({json:h})),[pre+'Judge Enforcer Retry Call deepseek']:RC})(rf(P,jr),pre+'Judge Enforcer Retry Call deepseek')[0].json;
   const rows=r.enf428_rows;const mb=new Map(base.map(x=>[key(x),x]));const retried=new Set(halves.filter((h,k)=>!(fail&&k===halves.length-1)).flatMap(h=>h.ids.filter(y=>!(h.esr_keep||[]).includes(y.id)).map(y=>y.seat+'|'+y.item+'|'+y.flagged_line)));
   const k3=x=>x.seat+'|'+x.item+'|'+x.flagged_line;const others=rows.filter(x=>!retried.has(k3(x)));const same=others.every(x=>{const y=mb.get(key(x));return y&&st({...x,prompt_sent:0,full_reply:0})===st({...y,prompt_sent:0,full_reply:0});});
   const nv0=base.filter(NV).length,nv1=rows.filter(NV).length;if(process.env.DBG)for(const x of others){const y=mb.get(key(x));if(!y||st({...x,prompt_sent:0,full_reply:0})!==st({...y,prompt_sent:0,full_reply:0}))console.log('DIFF',key(x).slice(0,80),'\n  base',y&&String(y.cure_reason).slice(0,160),'\n  new ',String(x.cure_reason).slice(0,160));}T(rows.length===base.length&&same&&(fail?nv1>0&&nv1<=nv0:nv1===base.filter(x=>NV(x)&&!retried.has(k3(x))).length)&&r.enf428.esr.short===1,RUN+' '+jr+': short-reply retry'+(fail?' (last half fails again)':'')+', NO VERDICT '+nv0+' -> '+nv1+', rows not retried unchanged, esr '+JSON.stringify(r.enf428.esr));}}
 // 4. Record without retry
 let r0,r1;try{r0=H(rf(EB,jr),jc)[0].json;r1=H(rf(P,jr),jc)[0].json;T(st(r0.enf428_rows)===st(r1.enf428_rows),RUN+' '+jr+': no retry ran, rows equal to base');}catch(e){T(false,RUN+' '+jr+' threw '+String(e.message).slice(0,100));}}
log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync(__dirname+'/test_ESK.txt',out.join('\n')+'\n');
