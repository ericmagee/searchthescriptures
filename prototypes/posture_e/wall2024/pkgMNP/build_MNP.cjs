// pkgMNP build (see src_MNP.js). Send Back Build, Alt: base pkgUNA/patched; Send Back Record, Alt: base pkgPAB/patched (pkgUNA leaves them as is).
// E-MNP items, ENFORCED; UNCURED counts once in drv_uncured, AUDIT v45. Run from wall2024/: node pkgMNP/build_MNP.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const SRC=fs.readFileSync('pkgMNP/src_MNP.js','utf8')+'\n';const OUT='pkgMNP/patched';fs.mkdirSync(OUT,{recursive:true});const plan={base:'pkgUNA/patched (Build) + pkgPAB/patched (Record)',nodes:[]};
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor '+n+': '+a.slice(0,70));return s.replace(a,()=>b);};
const ins=s0=>{const i=s0.indexOf('const PAB=(()=>{');if(i<0)throw new Error('no PAB');return s0.slice(0,i)+SRC+s0.slice(i);};
const save=(f,base,s0,s,edits)=>{new Function('$','$input','$json',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base,base_sha:sha(s0),final_sha:sha(s),edits});console.log(f.padEnd(26),sha(s0),'->',sha(s));};
for(const [f,role] of [['Send_Back_Build.js','panel'],['Alt_Send_Back_Build.js','alternate']]){const B='pkgUNA/patched';const s0=fs.readFileSync(B+'/'+f,'utf8');let s=ins(s0);
 s=rep(s,"/* pkgPAB (W3 ruling; Commitment 3 with Commitment 5)","/* pkgMNP (W3): an ANSWER CHECK that says its press has no MEANS, read against the press ledger, ENFORCED */\n"
  +"try{const __seats=new Set([].concat(E421,E428).filter(x=>x&&x.seat_role==='"+role+"').map(x=>x.seat));const __tx=r=>String(r||'').replace(/\\\\n/g,'\\n').replace(/\\\\\"/g,'\"');\n"
  +" for(const __b of ((PCC&&PCC.bodies)||[])){let __p;try{__p=(typeof __b==='string'?JSON.parse(__b):__b).payload||{};}catch(e){continue;}if(!__seats.has(__p.judge_seat))continue;\n"
  +"  const __j=PB&&Array.isArray(PB.judges)?PB.judges.find(q=>q.seat===__p.judge_seat):null;if(!__j||!__j.body||!Array.isArray(__j.body.messages))continue;\n"
  +"  const __pt=__j.body.messages.map(m=>typeof m.content==='string'?m.content:(Array.isArray(m.content)?m.content.map(c=>c&&c.text||'').join('\\n'):'')).join('\\n');\n"
  +"  const __t=__tx(__p.verdict_raw).split('\\n').filter(l=>!/^\\s*\\[AUDIT\\b/.test(l)).join('\\n');const __seen=new Set();\n"
  +"  for(const __c of MNP.check(__t,UND.rounds(__pt))){if(__seen.has(__c.line))continue;__seen.add(__c.line);dis.push({seat:__p.judge_seat,seat_role:'"+role+"',rule:'E-MNP',item:'ANSWER CHECK '+__c.ref+' ['+__c.round+'] (MEANS NONE)',flagged_line:__c.line,response_line:__c.line,cure_reason:'ENFORCER DISAGREE: MEANS AGAINST THE LEDGER (pkgMNP): '+__c.why,mnp:{key:__c.key,ref:__c.ref,round:__c.round,premise:__c.premise,ledger_means:__c.ledger_means,ledger_cls:__c.ledger_cls}});}}}catch(e){}\n"
  +"/* pkgPAB (W3 ruling; Commitment 3 with Commitment 5)",f);
 s=rep(s,"pab:x.pab||null,src:x}));","pab:x.pab||null,mnp:x.mnp||null,src:x}));",f);
 s=rep(s,"const __pabR=i=>","const __mnpR=i=>!i.mnp?'':'\\nTHE MEANS RULE (E-MNP, ENFORCED, pkgMNP): your ANSWER CHECK says this press has no MEANS. The press ledger reads its MEANS in ['+(i.mnp.round[0]==='C'?'DR2':'CR3')+'] (premise '+i.mnp.premise+'): \"'+i.mnp.ledger_means+'\". The ledger marks the press '+i.mnp.ledger_cls+'. CHANGE TO the ANSWER CHECK line for '+i.mnp.ref+' with that MEANS quoted (at least 6 words in a row of it, or all of it if shorter) and the answer graded MEETS or MISSES'+(i.mnp.ledger_cls==='UNPROVEN'?' (or UNPROVEN, as the ledger marks it)':'')+'. A KEEP does not cure this item.';\nconst __pabR=i=>",f);
 s=rep(s,"+__absR(i)+__pabR(i))","+__absR(i)+__pabR(i)+__mnpR(i))",f);
 s=rep(s,"pab:i.pab||null}))","pab:i.pab||null,mnp:i.mnp||null}))",f);
 save(f,B,s0,s,6);}
for(const [f,bsrc] of [['Send_Back_Record.js',"$('Panel Cure Check').first().json.bodies"],['Alt_Send_Back_Record.js',"$('Alt Seated').first().json.bodies"]]){const B='pkgPAB/patched';const s0=fs.readFileSync(B+'/'+f,'utf8');let s=ins(s0);
 s=rep(s,"const PABM={};","const PABM={};const MNPM={}; /* pkgMNP: seat -> uncured items */",f);
 s=rep(s,"  if(it.pab){try{__ec=PAB.cure(","  if(it.mnp){try{__ec=MNP.cure(it,a||{ans:'NO ANSWER'});}catch(e){__ec={status:'UNREAD',why:'MEANS cure reading error: '+String(e&&e.message||e).slice(0,160)};}} /* pkgMNP: ENFORCED */\n  if(it.pab){try{__ec=PAB.cure(",f);
 s=rep(s,"(__ec?(it.pab?","(__ec?(it.mnp?' | CURE (MEANS AGAINST THE LEDGER ENFORCED, pkgMNP): ':it.pab?",f);
 s=rep(s,"  else if(it.pab&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';});});",
  "  else if(it.pab&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';\n"
  +"  if(it.mnp&&__ec&&__ec.status!=='CURED'&&!silent&&!err){if(rows[rows.length-1].cure_status!=='UNCURED')(MNPM[b.seat]=MNPM[b.seat]||[]).push(it.sid+' (E-MNP '+String(it.item||'').slice(0,60)+': '+String(__ec.why).slice(0,160)+')');rows[rows.length-1].cure_status='UNCURED';} /* pkgMNP: counts once; silence is counted already (pkgSBS) */\n"
  +"  else if(it.mnp&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';});});",f);
 s=rep(s,"const pab_counted=[];","const pab_counted=[];const mnp_counted=[];",f);
 s=rep(s,"/* pkgPAB: each seat's uncured press-absence items","/* pkgMNP: each seat's uncured MEANS items are added to its drv_uncured */\n"
  +"if(Object.keys(MNPM).length){bodies=(bodies||(Array.isArray(PASS.bodies)?PASS.bodies:"+bsrc+")).slice();\n"
  +" for(const [seat,its] of Object.entries(MNPM)){const i=bodies.findIndex(x=>{try{return JSON.parse(x).payload.judge_seat===seat;}catch(e){return false;}});if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;\n"
  +"  p.drv_uncured=(p.drv_uncured||0)+its.length;anySil=true;mnp_counted.push({seat,items:its});\n"
  +"  p.verdict_raw=p.verdict_raw+'\\n[AUDIT v45: MEANS AGAINST THE LEDGER UNCURED (pkgMNP) -- SEAT: '+seat+'; ITEMS: '+its.join('; ')+'; counted in drv_uncured. REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}\n"
  +"/* pkgPAB: each seat's uncured press-absence items",f);
 s=rep(s,"abs_counted,pab_counted},sb_rows","abs_counted,pab_counted,mnp_counted},sb_rows",f);
 save(f,B,s0,s,7);}
fs.writeFileSync('pkgMNP/plan_MNP.json',JSON.stringify(plan,null,1));
