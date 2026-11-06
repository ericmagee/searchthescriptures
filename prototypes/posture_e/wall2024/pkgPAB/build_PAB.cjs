// pkgPAB (W3 ruling 2026-11-06, Wall; Commitment 3 with Commitment 5; run 33149 gemini premise 6): a judge's break or concession that charges a
// press as unanswered, where that press's MEANS rests on an absence clause (the pkgABS/pkgABW AB pattern), is sent back, ENFORCED.
// Base: pkgABW/patched 082f0f3 (on pkgUNL/patched 2ad8e0d = live ff8967bb + pkgUNL). Run from wall2024/: node pkgPAB/build_PAB.cjs
//  (1) Send Back Build, Alt: for each judge seat, the press rows of its own rounds (UND.rounds of its prompt) are read against its verdict text
//      (PAB.check, src_PAB.js). Each raise is an E-PAB item, sent even when the DeepSeek enforcer raised nothing; the send-back states the cure.
//  (2) Send Back Record, Alt: an E-PAB item cures by a reply quoting the MEANS' positive part (6 words in a row, or all of it when shorter),
//      by CHANGE TO: RETRACTED, or by a CHANGE TO line that no longer charges that press as unanswered. A KEEP without the quote does not cure.
//      UNCURED counts once in drv_uncured (AUDIT v44). No library node changes.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const PSRC=fs.readFileSync('pkgPAB/src_PAB.js','utf8')+'\n';const BASE='pkgABW/patched';const OUT='pkgPAB/patched';fs.mkdirSync(OUT,{recursive:true});
const plan={base:'pkgABW/patched (082f0f3, on pkgUNL/patched 2ad8e0d)',nodes:[]};
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor found '+n+' times: '+a.slice(0,80));return s.replace(a,()=>b);};
const save=(f,s0,s,edits)=>{new Function('$','$input','$json',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base:BASE,base_sha:sha(s0),final_sha:sha(s),edits});console.log(f.padEnd(26),sha(s0),'->',sha(s),edits+' edits');};
const absEnd=s=>{const i=s.indexOf('const ABS=(()=>{');if(i<0)throw new Error('no ABS');const e=s.indexOf('})();',i)+5;return e;};
const ins=(s0)=>{const e=absEnd(s0);return s0.slice(0,e)+'\n'+PSRC+s0.slice(e);};
// ---- (1) Send Back Build ----
for(const [f,role] of [['Send_Back_Build.js','panel'],['Alt_Send_Back_Build.js','alternate']]){
 const s0=fs.readFileSync(BASE+'/'+f,'utf8');let s=ins(s0);
 s=rep(s,"if(!dis.length)return skip(","/* pkgPAB (W3 ruling; Commitment 3 with Commitment 5): a break or concession charging a press as unanswered whose MEANS rests on an absence, ENFORCED */\n"
  +"try{const __seats=new Set([].concat(E421,E428).filter(x=>x&&x.seat_role==='"+role+"').map(x=>x.seat));const __tx=r=>String(r||'').replace(/\\\\n/g,'\\n').replace(/\\\\\"/g,'\"');\n"
  +" for(const __b of ((PCC&&PCC.bodies)||[])){let __p;try{__p=(typeof __b==='string'?JSON.parse(__b):__b).payload||{};}catch(e){continue;}if(!__seats.has(__p.judge_seat))continue;\n"
  +"  const __j=PB&&Array.isArray(PB.judges)?PB.judges.find(q=>q.seat===__p.judge_seat):null;if(!__j||!__j.body||!Array.isArray(__j.body.messages))continue;\n"
  +"  const __pt=__j.body.messages.map(m=>typeof m.content==='string'?m.content:(Array.isArray(m.content)?m.content.map(c=>c&&c.text||'').join('\\n'):'')).join('\\n');\n"
  +"  const __t=__tx(__p.verdict_raw).split('\\n').filter(l=>!/^\\s*\\[AUDIT\\b/.test(l)).join('\\n');\n"
  +"  for(const __c of PAB.check(__t,UND.rounds(__pt)))dis.push({seat:__p.judge_seat,seat_role:'"+role+"',rule:'E-PAB',item:__c.kind+' '+__c.label+' on '+__c.ref,flagged_line:__c.clause,response_line:__c.line,cure_reason:'ENFORCER DISAGREE: PRESS ABSENCE (pkgPAB): '+__c.why,pab:{kind:__c.kind,label:__c.label,ref:__c.ref,round:__c.round,means:__c.means,absence:__c.absence,positive:__c.positive}});}}catch(e){}\n"
  +"if(!dis.length)return skip(",f);
 s=rep(s,"abs:x.abs||null,src:x}));","abs:x.abs||null,pab:x.pab||null,src:x}));",f);
 s=rep(s,"const __absR=i=>","const __pabR=i=>!i.pab?'':'\\nTHE PRESS ABSENCE RULE (E-PAB, ENFORCED, pkgPAB; Commitment 3 with Commitment 5): your line charges the press '+i.pab.ref+' ['+i.pab.round+'] as unanswered. A press proves only what its quoted words show; its MEANS reads \"'+i.pab.means+'\", and the part \"'+i.pab.absence.join('; ')+'\" is an absence (what a verse does not state), which presses nothing. '+(i.pab.positive?'To keep the line, KEEP it with a sentence that quotes the positive part of that MEANS the charge rests on (at least 6 words in a row of \"'+i.pab.positive+'\", or all of it if shorter) and says why that part was left unanswered. ':'This MEANS has no positive part, so a KEEP cannot cure it. ')+'Otherwise CHANGE TO: RETRACTED, or CHANGE TO the line regraded so it no longer charges '+i.pab.ref+' as unanswered.';\nconst __absR=i=>",f);
 s=rep(s,"+__undR(i)+__absR(i))","+__undR(i)+__absR(i)+__pabR(i))",f);
 s=rep(s,"abs:i.abs||null}))","abs:i.abs||null,pab:i.pab||null}))",f);
 save(f,s0,s,6);}
// ---- (2) Send Back Record ----
for(const [f,bsrc] of [['Send_Back_Record.js',"$('Panel Cure Check').first().json.bodies"],['Alt_Send_Back_Record.js',"$('Alt Seated').first().json.bodies"]]){const s0=fs.readFileSync(BASE+'/'+f,'utf8');let s=ins(s0);
 s=rep(s,"const ABSM={};","const ABSM={};const PABM={}; /* pkgPAB: seat -> uncured press-absence items */",f);
 s=rep(s,"  const named=!a&&!err","  if(it.pab){try{__ec=PAB.cure(it,a||{ans:'NO ANSWER'});}catch(e){__ec={status:'UNREAD',why:'press absence cure reading error: '+String(e&&e.message||e).slice(0,160)};}} /* pkgPAB: ENFORCED */\n  const named=!a&&!err",f);
 s=rep(s,"(__ec?(it.abs?","(__ec?(it.pab?' | CURE (PRESS ABSENCE ENFORCED, pkgPAB): ':it.abs?",f);
 s=rep(s,"  else if(it.abs&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';});});",
  "  else if(it.abs&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';\n"
  +"  if(it.pab&&__ec&&__ec.status!=='CURED'&&!silent&&!err){if(rows[rows.length-1].cure_status!=='UNCURED')(PABM[b.seat]=PABM[b.seat]||[]).push(it.sid+' (E-PAB '+String(it.item||'').slice(0,60)+': '+String(__ec.why).slice(0,160)+')');rows[rows.length-1].cure_status='UNCURED';} /* pkgPAB: counts once; silence is counted already (pkgSBS) */\n"
  +"  else if(it.pab&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';});});",f);
 s=rep(s,"const und_counted=[];const abs_counted=[];","const und_counted=[];const abs_counted=[];const pab_counted=[];",f);
 s=rep(s,"if(Object.keys(SIL).length){","/* pkgPAB: each seat's uncured press-absence items are added to its drv_uncured */\n"
  +"if(Object.keys(PABM).length){bodies=(bodies||(Array.isArray(PASS.bodies)?PASS.bodies:"+bsrc+")).slice();\n"
  +" for(const [seat,its] of Object.entries(PABM)){const i=bodies.findIndex(x=>{try{return JSON.parse(x).payload.judge_seat===seat;}catch(e){return false;}});if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;\n"
  +"  p.drv_uncured=(p.drv_uncured||0)+its.length;anySil=true;pab_counted.push({seat,items:its});\n"
  +"  p.verdict_raw=p.verdict_raw+'\\n[AUDIT v44: PRESS ABSENCE UNCURED (pkgPAB; Commitment 3, Commitment 5) -- SEAT: '+seat+'; ITEMS: '+its.join('; ')+'; counted in drv_uncured. REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}\n"
  +"if(Object.keys(SIL).length){",f);
 s=rep(s,"und_counted,abs_counted},sb_rows","und_counted,abs_counted,pab_counted},sb_rows",f);
 save(f,s0,s,7);}
fs.writeFileSync('pkgPAB/plan_PAB.json',JSON.stringify(plan,null,1));
