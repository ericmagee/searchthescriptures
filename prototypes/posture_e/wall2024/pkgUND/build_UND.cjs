// pkgUND (W3 ruling after Wall 2566): missing collision grades (E-UNG) and UNDERDETERMINED-gives-its-grounds (E-HOLD on UNDERDETERMINED), both ENFORCED.
// Base: live 36e9c423 = pkgECL/patched for the 6 nodes below (pkgKVQ touches none of them). Run from wall2024/: node pkgUND/build_UND.cjs
//  (1) Send Back Build (+Alt): per seat, every defender link pressed by the list closing [DR2] with no graded D<i> vs C<j> line becomes an E-UNG item,
//      sent whether or not an enforcer row exists; an E-HOLD DISAGREE item proposing BROKEN on an UNDERDETERMINED line is marked und and its cure
//      rule is stated. (2) Send Back Record (+Alt): both cure by UND.cure; an UNCURED answer counts in drv_uncured (silence is counted already).
//  (3) Panel Build, Build Independent Verdict: the COLLISION POINTS instruction says a pressed link takes a graded line, and what an
//      UNDERDETERMINED ground carries.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const UNDSRC=fs.readFileSync('pkgUND/src_UND.js','utf8')+'\n';
const OUT='pkgUND/patched';fs.mkdirSync(OUT,{recursive:true});const plan={base:'live 36e9c423 (pkgECL/patched)',nodes:[]};
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor found '+n+' times: '+a.slice(0,80));return s.replace(a,()=>b);};
const save=(f,s0,s,edits)=>{new Function('$','$input','$json',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base:'pkgECL/patched',base_sha:sha(s0),final_sha:sha(s),edits});console.log(f.padEnd(30),sha(s0),'->',sha(s),edits+' edits');};
const ECLEND='return {check,ground,ctxLive};})();\n';

// ---- (1) Send Back Build ----
for(const [f,role] of [['Send_Back_Build.js','panel'],['Alt_Send_Back_Build.js','alternate']]){
 const s0=fs.readFileSync('pkgECL/patched/'+f,'utf8');let s=rep(s0,ECLEND,ECLEND+UNDSRC,f);
 s=rep(s,"if(!dis.length)return skip(","/* pkgUND (E-UNG, E-HOLD on UNDERDETERMINED; ENFORCED) */\n"
  +"try{for(const __x of dis)if(UND.isUndBroken(__x)){__x.und={kind:'E-HOLD-UND'};__x.cure_reason=String(__x.cure_reason||'')+' | '+UND.CURE_UND;}\n"
  +" const __seats=new Set([].concat(E421,E428).filter(x=>x&&x.seat_role==='"+role+"').map(x=>x.seat));const __tx=r=>String(r||'').replace(/\\\\n/g,'\\n').replace(/\\\\\"/g,'\"');\n"
  +" for(const __b of ((PCC&&PCC.bodies)||[])){let __p;try{__p=(typeof __b==='string'?JSON.parse(__b):__b).payload||{};}catch(e){continue;}if(!__seats.has(__p.judge_seat))continue;\n"
  +"  const __j=PB&&Array.isArray(PB.judges)?PB.judges.find(q=>q.seat===__p.judge_seat):null;if(!__j||!__j.body||!Array.isArray(__j.body.messages))continue;\n"
  +"  const __pt=__j.body.messages.map(m=>typeof m.content==='string'?m.content:(Array.isArray(m.content)?m.content.map(c=>c&&c.text||'').join('\\n'):'')).join('\\n');\n"
  +"  const __t=__tx(__p.verdict_raw).split('\\n').filter(l=>!/^\\s*\\[AUDIT\\b/.test(l)).join('\\n');\n"
  +"  for(const __m of UND.missing(__pt,__t))dis.push({seat:__p.judge_seat,seat_role:'"+role+"',rule:'E-UNG',item:'COLLISION D'+__m.n+' (pressed: [DR2] premise '+__m.n+')',flagged_line:__m.line||('(no COLLISION POINTS line for D'+__m.n+')'),response_line:__m.line||'',cure_reason:'ENFORCER DISAGREE: '+UND.CURE_UNG(__m.n)+' THE PREMISE: '+__m.premise,und:{kind:'E-UNG',n:__m.n}});}}catch(e){}\n"
  +"if(!dis.length)return skip(",f);
 s=rep(s,"reason:why(x),ecl:x.ecl||null,src:x}));","reason:why(x),ecl:x.ecl||null,und:x.und||null,src:x}));",f);
 s=rep(s,"const __eclR=i=>","const __undR=i=>!i.und?'':'\\nTHE COLLISION RULE (pkgUND, ENFORCED): '+(i.rule==='E-UNG'?UND.CURE_UNG(i.und.n):UND.CURE_UND);\nconst __eclR=i=>",f);
 s=rep(s,"+hold421(i)+__ecfR(i)+__eclR(i))","+hold421(i)+__ecfR(i)+__eclR(i)+__undR(i))",f);
 s=rep(s,"reason:i.reason,ecl:i.ecl||null}))","reason:i.reason,ecl:i.ecl||null,und:i.und||null}))",f);
 save(f,s0,s,6);}

// ---- (2) Send Back Record ----
for(const f of ['Send_Back_Record.js','Alt_Send_Back_Record.js']){const s0=fs.readFileSync('pkgECL/patched/'+f,'utf8');let s=rep(s0,ECLEND,ECLEND+UNDSRC,f);
 s=rep(s,"const ECF={};","const ECF={};const UNDF={}; /* pkgUND: seat -> uncured E-UNG and E-HOLD-UND items */",f);
 s=rep(s,"else if(it.rule==='E-COL'&&__ec&&__ec.status==='CURED')rows[rows.length-1].cure_status='CURED';});});",
  "else if(it.rule==='E-COL'&&__ec&&__ec.status==='CURED')rows[rows.length-1].cure_status='CURED';\n"
  +"  if(it.rule==='E-UNG'||it.und){let __u;try{__u=UND.cure(it,a||{ans:'NO ANSWER'},ECL.ctxLive());}catch(e){__u={status:'UNREAD',why:'cure reading error: '+String(e&&e.message||e).slice(0,160)};} /* pkgUND (ENFORCED) */\n"
  +"   rows[rows.length-1].cure_reason+=' | CURE (pkgUND, ENFORCED): '+__u.status+' -- '+String(__u.why).slice(0,400);\n"
  +"   if(__u.status==='UNCURED'&&!silent&&!err){(UNDF[b.seat]=UNDF[b.seat]||[]).push(it.sid+' ('+it.rule+(it.rule==='E-UNG'?'':' on UNDERDETERMINED')+' '+String(it.item||'').slice(0,60)+': '+String(__u.why).slice(0,160)+')');rows[rows.length-1].cure_status='UNCURED';}\n"
  +"   else if(__u.status==='CURED')rows[rows.length-1].cure_status='CURED';}});});",f);
 s=rep(s,"let bodies=null,anySil=false;const silent_counted=[];const ecol_counted=[];","let bodies=null,anySil=false;const silent_counted=[];const ecol_counted=[];const und_counted=[];",f);
 /* W2 2026-11-06: after the pkgECF block (which starts bodies afresh) and with bodies||, as the SIL block does; the node's own bodies source */
 const __src=(s.match(/if\(Object\.keys\(SIL\)\.length\)\{bodies=\(bodies\|\|(\(Array\.isArray\(PASS\.bodies\)\?PASS\.bodies:\$\('[^']+'\)\.first\(\)\.json\.bodies\))\)\.slice\(\);/)||[])[1];if(!__src)throw new Error(f+': SIL bodies source not found');
 s=rep(s,"if(Object.keys(SIL).length){bodies=(bodies||","/* pkgUND: each seat's uncured E-UNG and E-HOLD-UND answers are added to its drv_uncured */\n"
  +"if(Object.keys(UNDF).length){bodies=(bodies||"+__src+").slice();\n"
  +" for(const [seat,its] of Object.entries(UNDF)){const i=bodies.findIndex(x=>{try{return JSON.parse(x).payload.judge_seat===seat;}catch(e){return false;}});if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;\n"
  +"  p.drv_uncured=(p.drv_uncured||0)+its.length;anySil=true;und_counted.push({seat,items:its});\n"
  +"  p.verdict_raw=p.verdict_raw+'\\n[AUDIT v42: COLLISION GRADE UNCURED (pkgUND) -- SEAT: '+seat+'; ITEMS: '+its.join('; ')+'; counted in drv_uncured. REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}\n"
  +"if(Object.keys(SIL).length){bodies=(bodies||",f);
 s=rep(s,"tally,errors,silent_counted,ecol_counted}","tally,errors,silent_counted,ecol_counted,und_counted}",f);
 save(f,s0,s,6);}

// ---- (3) the collision instruction ----
const COLA="Any other link: D<i>: STANDS -- GROUND: <reason>.";
const COLB=COLA+" A defender link that a premise of the list closing [DR2] presses is not any other link: it takes a graded D<i> vs C<j> line for the challenger link it collides with, in whatever grade you judge; a D<i>: STANDS line alone does not grade it and is sent back (pkgUND). An UNDERDETERMINED grade gives, after GROUND:, [L1] <reference> \\\"<the KJV words both readings rest on>\\\" and what the record leaves open.";
for(const f of ['Panel_Build.js','Build_Independent_Verdict.js']){const s0=fs.readFileSync('pkgECL/patched/'+f,'utf8');const s=rep(s0,COLA,COLB,f);save(f,s0,s,1);}
fs.writeFileSync('pkgUND/plan_UND.json',JSON.stringify(plan,null,1));
