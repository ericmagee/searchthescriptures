// pkgABS (W3 ruling 2026-11-06; Commitment 3, ruling 421): a MEETS / STANDS / UNDERDETERMINED grade that rests on an absence or a non-denial.
// Base: pkgUND/patched (W1 f3f0610, itself on pkgECL/patched = live 36e9c423; pkgKVQ touches only the 22 library nodes, none of these four). Run from wall2024/: node pkgABS/build_ABS.cjs
//  (1) Send Back Build, Alt: each E-ANS MEETS line and each E-HOLD STANDS/UNDERDETERMINED line (from the enforcer Build's ids) is read by ABS
//      (src_ABS.js). An absence or non-denial with no counted [L1] positive fit is sent back, ENFORCED, whether or not the DeepSeek enforcer
//      disagreed; the send-back states the rule and the cure.
//  (2) Send Back Record, Alt: such an item cures only by CHANGE TO MISSES/FAILS (E-ANS), a BROKEN/FORCED line that passes the layer check
//      (pkgECL), RETRACTED, or a line that quotes a counted [L1] positive fit. A KEEP does not cure. UNCURED counts in drv_uncured (AUDIT v43).
//  No PART2 or library node changes (pkgLIB v2 needs no repack).
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const ABSSRC=fs.readFileSync('pkgABS/src_ABS.js','utf8')+'\n';const BASE='pkgUND/patched';const OUT='pkgABS/patched';fs.mkdirSync(OUT,{recursive:true});
const plan={base:'pkgUND/patched (f3f0610, on pkgECL/patched = live 36e9c423)',nodes:[]};
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor found '+n+' times: '+a.slice(0,80));return s.replace(a,()=>b);};
const save=(f,s0,s,edits)=>{new Function('$','$input','$json',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base:BASE,base_sha:sha(s0),final_sha:sha(s),edits});console.log(f.padEnd(26),sha(s0),'->',sha(s),edits+' edits');};
// ---- (1) Send Back Build ----
for(const [f,jeb,role] of [['Send_Back_Build.js','Judge Enforcer Build','panel'],['Alt_Send_Back_Build.js','Alt Judge Enforcer Build','alternate']]){
 const s0=fs.readFileSync(BASE+'/'+f,'utf8');let s=ABSSRC+s0;
 s=rep(s,"if(!dis.length)return skip(","/* pkgABS (W3 ruling; Commitment 3, ruling 421): a MEETS, STANDS or UNDERDETERMINED grade resting on an absence, ENFORCED: sent back even when the enforcer agreed */\n"
  +"try{const __ctx=ECL.ctxLive();const __seen=new Set();for(const __it of $('"+jeb+"').all())for(const __x of ((__it.json&&__it.json.ids)||[])){if(!__x||(__x.rule!=='E-ANS'&&__x.rule!=='E-HOLD'))continue;const __k=__x.rule+'|'+__x.seat+'|'+__x.flagged_line;if(__seen.has(__k))continue;__seen.add(__k);\n"
  +" const __c=ABS.check(__x,__ctx);if(!__c.raise)continue;const __d=dis.find(y=>y.rule===__x.rule&&y.seat===__x.seat&&String(y.flagged_line||'')===String(__x.flagged_line||''));\n"
  +" if(__d){__d.abs={...__c,ds:true};__d.cure_reason=String(__d.cure_reason||'')+' | ABSENCE CHECK (pkgABS): '+__c.why;}\n"
  +" else dis.push({seat:__x.seat,seat_role:'"+role+"',rule:__x.rule,item:__x.item,flagged_line:__x.flagged_line,response_line:__x.response_line,cure_reason:'ENFORCER DISAGREE: ABSENCE CHECK (pkgABS): '+__c.why,abs:{...__c,ds:false}});}}catch(e){}\n"
  +"if(!dis.length)return skip(",f);
 s=rep(s,"reason:why(x),ecl:x.ecl||null,und:x.und||null,src:x}));","reason:why(x),ecl:x.ecl||null,und:x.und||null,abs:x.abs||null,src:x}));",f);
 s=rep(s,"const __eclR=i=>","const __absR=i=>!i.abs?'':'\\nTHE ABSENCE CHECK ('+i.rule+', ENFORCED, pkgABS; Commitment 3, ruling 421): '+i.abs.why+'. An answer meets a press, and a link stands, by a positive fit: the KJV words that show it, quoted with the reference under an [L1] tag ([L1] <reference> \"<the KJV words>\"). That a verse does not deny, does not name or leaves room for a reading is not a fit, and two readings both retained is not a fit. To keep the grade, CHANGE TO the line with the positive fit quoted under [L1]. Otherwise CHANGE TO the line regraded'+(i.rule==='E-ANS'?' MISSES':' (a BROKEN or FORCED grade gives its layers, Commitment 13)')+'. A KEEP does not cure this item.';\nconst __eclR=i=>",f);
 s=rep(s,"+__eclR(i)+__undR(i))","+__eclR(i)+__undR(i)+__absR(i))",f);
 s=rep(s,"reason:i.reason,ecl:i.ecl||null,und:i.und||null}))","reason:i.reason,ecl:i.ecl||null,und:i.und||null,abs:i.abs||null}))",f);
 save(f,s0,s,5);}
// ---- (2) Send Back Record ----
for(const [f,bsrc] of [['Send_Back_Record.js',"$('Panel Cure Check').first().json.bodies"],['Alt_Send_Back_Record.js',"$('Alt Seated').first().json.bodies"]]){const s0=fs.readFileSync(BASE+'/'+f,'utf8');let s=ABSSRC+s0;
 s=rep(s,"const ECF={};const UNDF={};","const ECF={};const UNDF={};const ABSM={}; /* pkgABS: seat -> uncured absence items */",f);
 s=rep(s,"  const named=!a&&!err","  if(it.abs){try{const __ac=ABS.cure(it,a||{ans:'NO ANSWER'},ECL.ctxLive());__ec=__ec?{status:__ac.status,why:__ac.why+' | record-only reading: '+__ec.status+' -- '+__ec.why}:__ac;}catch(e){__ec={status:'UNREAD',why:'absence cure reading error: '+String(e&&e.message||e).slice(0,160)};}} /* pkgABS: ENFORCED */\n  const named=!a&&!err",f);
 s=rep(s,"(__ec?(it.rule==='E-COL'?","(__ec?(it.abs?' | CURE (ABSENCE CHECK ENFORCED, pkgABS): ':it.rule==='E-COL'?",f);
 s=rep(s,"   else if(__u.status==='CURED')rows[rows.length-1].cure_status='CURED';}});});",
  "   else if(__u.status==='CURED')rows[rows.length-1].cure_status='CURED';}\n"
  +"  if(it.abs&&__ec&&__ec.status!=='CURED'&&!silent&&!err){if(rows[rows.length-1].cure_status!=='UNCURED')(ABSM[b.seat]=ABSM[b.seat]||[]).push(it.sid+' ('+it.rule+' '+String(it.item||'').slice(0,60)+': '+String(__ec.why).slice(0,160)+')');rows[rows.length-1].cure_status='UNCURED';} /* pkgABS: an UNCURED absence item counts once (not again when pkgUND counted it); silence is counted already (pkgSBS) */\n"
  +"  else if(it.abs&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';});});",f);
 s=rep(s,"const ecol_counted=[];const und_counted=[];","const ecol_counted=[];const und_counted=[];const abs_counted=[];",f);
 s=rep(s,"if(Object.keys(SIL).length){","/* pkgABS: each seat's uncured absence items are added to its drv_uncured, as E-COL's are */\n"
  +"if(Object.keys(ABSM).length){bodies=(bodies||(Array.isArray(PASS.bodies)?PASS.bodies:"+bsrc+")).slice();\n"
  +" for(const [seat,its] of Object.entries(ABSM)){const i=bodies.findIndex(x=>{try{return JSON.parse(x).payload.judge_seat===seat;}catch(e){return false;}});if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;\n"
  +"  p.drv_uncured=(p.drv_uncured||0)+its.length;anySil=true;abs_counted.push({seat,items:its});\n"
  +"  p.verdict_raw=p.verdict_raw+'\\n[AUDIT v43: ABSENCE GRADE UNCURED (pkgABS; Commitment 3, ruling 421) -- SEAT: '+seat+'; ITEMS: '+its.join('; ')+'; counted in drv_uncured. REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}\n"
  +"if(Object.keys(SIL).length){",f);
 s=rep(s,"ecol_counted,und_counted},sb_rows","ecol_counted,und_counted,abs_counted},sb_rows",f);
 save(f,s0,s,7);}
fs.writeFileSync('pkgABS/plan_ABS.json',JSON.stringify(plan,null,1));
