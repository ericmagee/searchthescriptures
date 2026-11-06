// pkgUNA (W3 2026-11-06, Wall; 33107 chatgpt D6 vs C6 "does not dispute those descriptions", sol D6 vs C2 "jointly accepted but receive
// competing causal explanations"): every UNDERDETERMINED collision line of every judge is read in code, without waiting for an E-HOLD item.
// A line that fails UND.undOk (no counted [L1], or it does not state what the record leaves open) is sent back, ENFORCED, as E-HOLD on
// UNDERDETERMINED, with the pkgUND cures (UND.cure: regrade BROKEN in its layers, STANDS with the answer's fit and a counted [L1], RETRACTED,
// or UNDERDETERMINED kept with a counted [L1] and the open point). An absence phrase (ABS.absence) is named in the reason. A line the
// enforcer already sent as E-HOLD is not sent twice: the existing item takes the mark. Send Back Record already counts marked items (UNDF,
// AUDIT v42), so only the two Build nodes change. Base: pkgPAB/patched be77682 (live 98daac9e). Run from wall2024/: node pkgUNA/build_UNA.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const BASE='pkgPAB/patched',OUT='pkgUNA/patched';fs.mkdirSync(OUT,{recursive:true});const plan={base:BASE+' be77682 (live 98daac9e)',nodes:[]};
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor '+n+': '+a.slice(0,60));return s.replace(a,()=>b);};
for(const [f,role] of [['Send_Back_Build.js','panel'],['Alt_Send_Back_Build.js','alternate']]){const s0=fs.readFileSync(BASE+'/'+f,'utf8');let s=s0;
 s=rep(s,"/* pkgPAB (W3 ruling; Commitment 3 with Commitment 5)","/* pkgUNA (W3): every UNDERDETERMINED collision line read for its grounds, ENFORCED, without waiting for an E-HOLD item */\n"
  +"try{const __ctx=ECL.ctxLive();const __seats=new Set([].concat(E421,E428).filter(x=>x&&x.seat_role==='"+role+"').map(x=>x.seat));const __tx=r=>String(r||'').replace(/\\\\n/g,'\\n').replace(/\\\\\"/g,'\"');const __nl=s=>String(s||'').replace(/\\\\+/g,'').replace(/[*_`]+/g,'').replace(/\\s+/g,' ').trim();\n"
  +" const __UD=/^[\\s>*_-]*(D\\d+)\\s+vs\\.?\\s+(C\\d+)\\b[^\\n]{0,200}?:\\s*\\**\\s*UNDERDETERMINED\\b/i;\n"
  +" for(const __b of ((PCC&&PCC.bodies)||[])){let __p;try{__p=(typeof __b==='string'?JSON.parse(__b):__b).payload||{};}catch(e){continue;}if(!__seats.has(__p.judge_seat))continue;\n"
  +"  for(const __l of __tx(__p.verdict_raw).split('\\n')){if(/^\\s*\\[AUDIT\\b/.test(__l))continue;const __m=__l.match(__UD);if(!__m)continue;const __u=UND.undOk(__l,__ctx);if(__u.ok)continue;const __ab=ABS.absence(__l);\n"
  +"   const __why='UNDERDETERMINED WITHOUT ITS GROUNDS (E-HOLD on UNDERDETERMINED, ENFORCED, pkgUNA): '+__u.why+(__ab?' | it rests on an absence: \"'+__ab+'\"':'');\n"
  +"   const __d=dis.find(y=>y.seat===__p.judge_seat&&y.rule==='E-HOLD'&&__nl(y.flagged_line)===__nl(__l));\n"
  +"   if(__d){if(!__d.und){__d.und={kind:'E-HOLD-UNA'};__d.cure_reason=String(__d.cure_reason||'')+' | '+__why;}continue;}\n"
  +"   dis.push({seat:__p.judge_seat,seat_role:'"+role+"',rule:'E-HOLD',item:'COLLISION '+__m[1]+' vs '+__m[2]+' (UNDERDETERMINED; pkgUNA)',flagged_line:__l.trim(),response_line:__l.trim(),cure_reason:'ENFORCER DISAGREE: '+__why,und:{kind:'E-HOLD-UNA'}});}}}catch(e){}\n"
  +"/* pkgPAB (W3 ruling; Commitment 3 with Commitment 5)",f);
 s=rep(s,"(i.rule==='E-UNG'?UND.CURE_UNG(i.und.n):UND.CURE_UND);","(i.rule==='E-UNG'?UND.CURE_UNG(i.und.n):i.und.kind==='E-HOLD-UNA'?UND.CURE_UND.replace('the enforcer reads this line as BROKEN; the decision stays yours.','an UNDERDETERMINED line gives its grounds: a counted [L1] and what the record leaves open; this line does not. The decision stays yours.').replace('pkgUND)','pkgUND, pkgUNA)'):UND.CURE_UND);",f);
 new Function('$','$input','$json',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base:BASE,base_sha:sha(s0),final_sha:sha(s),edits:2});console.log(f.padEnd(26),sha(s0),'->',sha(s));}
fs.writeFileSync('pkgUNA/plan_UNA.json',JSON.stringify(plan,null,1));
