// pkgKSC build (see src_KSC.js; W3 B6, design approved Wall 2665). Every edit is text-exact (it must match once or the build stops), so the
// build runs on any base that holds these anchors, in any order with pkgPTA, pkgL2R and pkgLNX; W4 runs it on its own fresh fetch-back.
// Default base: fetchback_live_1b49671d with pkgSLA laid on it (= live n24). Run from wall2024/: node pkgKSC/build_KSC.cjs [in] [out]
//  Send Back Build, Alt: E-KSC items (5 edits). Send Back Record, Alt: the cure, AUDIT v48; TRIAL (W3 2671): recorded, not counted in drv_uncured,
//  until KSC.LIVE is set true after one run with zero false items (7 edits).
//  The 6 sbApply nodes: an E-KSC change goes over the judge's one line with its label (1 edit). Commitment 15 in the 15 PART2 nodes (1 edit).
//  Extract Independent Verdict: the single judge, a review line, record-only (1 edit).
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const SRC=fs.readFileSync('pkgKSC/src_KSC.js','utf8')+'\n';
const IN=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_1b49671d.json',OUTW=process.argv[3]||'pkgKSC/out/workflow_KSC.json';
let w=JSON.parse(fs.readFileSync(IN,'utf8'));w=w.nodes?w:(w.data||w);const N=Object.fromEntries(w.nodes.map(n=>[n.name,n]));
if(!process.argv[2]){const SP=JSON.parse(fs.readFileSync('pkgSLA/plan_SLA.json','utf8'));for(const x of SP.nodes){const n=x.file.slice(0,-3).replace(/_/g,' ');const cur=N[n].parameters.jsCode;
 if(sha(cur)===x.final_sha)continue;if(sha(cur)!==x.base_sha)throw new Error('pkgSLA '+n+': sha '+sha(cur)+' is neither its base nor its final');N[n].parameters.jsCode=fs.readFileSync('pkgSLA/patched/'+x.file,'utf8');}}
for(const d of ['patched','base','out'])fs.mkdirSync('pkgKSC/'+d,{recursive:true});const plan={base:IN+(process.argv[2]?'':' + pkgSLA'),nodes:[]};
const rep=(s,a,b,f)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(f+': anchor found '+k+' times: '+a.slice(0,80));return s.replace(a,()=>b);};
const node=(name,fn,edits)=>{const n=N[name];if(!n)throw new Error('no node '+name);const s0=n.parameters.jsCode;const s=fn(s0);new Function('$','$input','$json',s);
 const f=name.replace(/ /g,'_')+'.js';fs.writeFileSync('pkgKSC/base/'+f,s0);fs.writeFileSync('pkgKSC/patched/'+f,s);n.parameters.jsCode=s;plan.nodes.push({node:name,base_sha:sha(s0),final_sha:sha(s),edits});};
// ---- the send-back: E-KSC items ----
for(const [name,role] of [['Send Back Build','panel'],['Alt Send Back Build','alternate']])node(name,s0=>{let s=SRC+s0;
 s=rep(s,"/* pkgIMP (Eric 17:08 CST; W3 2627; Commitment 14)","/* pkgKSC (W3 B6, Wall 2665; Commitment 15): a keystone graded STANDS on a premise the same verdict counts UNEXHIBITED, CONCEDED or WITHDRAWN: one E-KSC item per seat, ENFORCED */\n"
  +"try{const __tx=r=>String(r||'').replace(/\\\\n/g,'\\n').replace(/\\\\\"/g,'\"');\n"
  +" for(const __b of ((PCC&&PCC.bodies)||[])){let __p;try{__p=(typeof __b==='string'?JSON.parse(__b):__b).payload||{};}catch(e){continue;}if(!__p.judge_seat)continue;\n"
  +"  const __t=__tx(__p.verdict_raw).split('\\n').filter(l=>!/^\\s*\\[(?:AUDIT|EXTRACTOR)\\b/.test(l)).join('\\n');\n"
  +"  const __j=PB&&Array.isArray(PB.judges)?PB.judges.find(q=>q.seat===__p.judge_seat):null;const __pt=__j&&__j.body&&Array.isArray(__j.body.messages)?__j.body.messages.map(m=>typeof m.content==='string'?m.content:(Array.isArray(m.content)?m.content.map(c=>c&&c.text||'').join('\\n'):'')).join('\\n'):'';\n"
  +"  const __dr2=__pt?(UND.rounds(__pt).DR2||''):''; /* W3 2671: a Premise p of CONCEDED LINKS is read through the [DR2] list's LINK labels */\n"
  +"  for(const __k of KSC.items(__t,__dr2))dis.push({seat:__p.judge_seat,seat_role:'"+role+"',rule:'E-KSC',item:'KEYSTONE D'+__k.n+' on LINK '+__k.n+' '+__k.tag,flagged_line:__k.keystone_line,response_line:__k.conceded_line,cure_reason:'ENFORCER DISAGREE: KEYSTONE CONSISTENCY (pkgKSC, Commitment 15'+(KSC.LIVE?'':'; TRIAL')+'): KEYSTONE D'+__k.n+' STANDS while the same verdict\\'s CONCEDED LINKS counts '+__k.via+' '+__k.tag+': \"'+String(__k.conceded_line).slice(0,300)+'\"',ksc:__k});}}catch(e){}\n"
  +"/* pkgIMP (Eric 17:08 CST; W3 2627; Commitment 14)",name);
 s=rep(s,"imp:x.imp||null,src:x}));","imp:x.imp||null,ksc:x.ksc||null,src:x}));",name);
 s=rep(s,"const __impR=i=>","const __kscR=i=>!i.ksc?'':'\\n'+KSC.note(i.ksc); /* pkgKSC */\nconst __impR=i=>",name);
 s=rep(s,"+__impR(i))","+__impR(i)+__kscR(i))",name);
 s=rep(s,"imp:i.imp||null}))","imp:i.imp||null,ksc:i.ksc||null}))",name);return s;},5);
// ---- the record: the cure, counted once ----
for(const [name,bsrc] of [['Send Back Record',"$('Panel Cure Check').first().json.bodies"],['Alt Send Back Record',"$('Alt Seated').first().json.bodies"]])node(name,s0=>{let s=SRC+s0;
 s=rep(s,"const IMPM={};","const IMPM={};const KSCM={}; /* pkgKSC: seat -> uncured E-KSC items */",name);
 s=rep(s,"  if(it.imp){try{__ec=IMP.cure(","  if(it.ksc){try{__ec=KSC.cure(it,a||{ans:'NO ANSWER'});}catch(e){__ec={status:'UNREAD',why:'keystone consistency cure reading error: '+String(e&&e.message||e).slice(0,160)};}} /* pkgKSC: ENFORCED */\n  if(it.imp){try{__ec=IMP.cure(",name);
 s=rep(s,"(__ec?(it.imp?","(__ec?(it.ksc?' | CURE (KEYSTONE CONSISTENCY ENFORCED, pkgKSC): ':it.imp?",name);
 s=rep(s,"  else if(it.imp&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';",
  "  else if(it.imp&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';\n"
  +"  if(it.ksc&&__ec&&__ec.status!=='CURED'&&!silent&&!err){if(rows[rows.length-1].cure_status!=='UNCURED')(KSCM[b.seat]=KSCM[b.seat]||[]).push(it.sid+' (E-KSC '+String(it.item||'').slice(0,60)+': '+String(__ec.why).slice(0,160)+')');rows[rows.length-1].cure_status='UNCURED';} /* pkgKSC: counts once; silence is counted already (pkgSBS) */\n"
  +"  else if(it.ksc&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';",name);
 s=rep(s,"const imp_counted=[];","const imp_counted=[];const ksc_counted=[];",name);
 s=rep(s,"/* pkgIMP: each seat's uncured imposed-requirement items","/* pkgKSC: each seat's uncured keystone consistency items are added to its drv_uncured */\n"
  +"if(Object.keys(KSCM).length){bodies=(bodies||(Array.isArray(PASS.bodies)?PASS.bodies:"+bsrc+")).slice();\n"
  +" for(const [seat,its] of Object.entries(KSCM)){const i=bodies.findIndex(x=>{try{return JSON.parse(x).payload.judge_seat===seat;}catch(e){return false;}});if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;\n"
  +"  if(KSC.LIVE){p.drv_uncured=(p.drv_uncured||0)+its.length;anySil=true;}ksc_counted.push({seat,items:its,counted:KSC.LIVE}); /* W3 2671: TRIAL for one run, recorded and not counted */\n"
  +"  p.verdict_raw=p.verdict_raw+'\\n[AUDIT v48: KEYSTONE CONSISTENCY UNCURED (pkgKSC, Commitment 15'+(KSC.LIVE?'':'; TRIAL')+') -- SEAT: '+seat+'; ITEMS: '+its.join('; ')+(KSC.LIVE?'; counted in drv_uncured':'; TRIAL rule: recorded, not counted in drv_uncured; it removes no seat')+'. REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}\n"
  +"/* pkgIMP: each seat's uncured imposed-requirement items",name);
 s=rep(s,"imp_counted},sb_rows","imp_counted,ksc_counted},sb_rows",name);return s;},7);
// ---- sbApply: an E-KSC change goes over the judge's one line with the same label ----
const AP="  if(!o){const __lk=sbLabel(to);if(__lk){";
for(const name of ['Gate Build','Gate Record','Alt Gate Build','Alt Gate Record','Alternate Merge','Alternate Merge Seat'])node(name,s0=>rep(s0,AP,
 "  if(x.rule==='E-KSC'){const __lk=sbLabel(to);if(__lk==='KEYSTONE'||__lk==='CONCEDED LINKS'){const __c=lines.filter(l=>sbLabel(l)===__lk);if(__c.length===1)o=__c[0];}} /* pkgKSC: a KEYSTONE or a CONCEDED LINKS change goes over that line, whichever the judge changed */\n"+AP,name),1);
// ---- Commitment 15 in PART2 ----
const C15=`

### Commitment 15. My keystone does not stand on a premise I count unexhibited or conceded.
The keystone is the defender's last declared link, D<n>. I do not grade KEYSTONE: D<n> STANDS while my own CONCEDED LINKS line counts LINK <n> UNEXHIBITED, CONCEDED or WITHDRAWN: a link my verdict counts as not shown cannot be the one the chain stands on. A "LINK <n>" in my CONCEDED LINKS line is D<n>; a "Premise <p>" there is the p-th entry of the challenger's [DR2] UNSUPPORTED-L4 PREMISES list and is read as the link its own LINK label names. When the record leaves LINK <n> unexhibited, my KEYSTONE line grades D<n> WITHDRAWN or BROKEN; when I find LINK <n> shown, my CONCEDED LINKS line does not count it. This binds both sides alike. The system reads these two lines in code and sends back each verdict that has both; a KEEP does not cure the item, and an item left uncured is recorded against my seat.`;
const C15JS=C15.replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\n/g,'\\n');const A15="an item left uncured is recorded against my seat.\\n\\nA sentence the system marks VOID (pkgBAR)";
for(const name of ['Panel Build','Reserve Build','Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Alternate Build','Alternate Cure Build','Accept Build','Accept Check','Accept Return Build','Accept Final','Accept DS Return Build','Enforcer Build','Judge Enforcer Build','Alt Judge Enforcer Build'])
 node(name,s0=>rep(s0,A15,"an item left uncured is recorded against my seat."+C15JS+"\\n\\nA sentence the system marks VOID (pkgBAR)",name),1);
// ---- the single judge: a review line, record-only ----
node('Extract Independent Verdict',s0=>rep(SRC+s0,"  if(k===0){raw+='\\n\\n[EXTRACTOR v16: KEYSTONE SAYS BROKEN BUT THE CLAUSE LINE SAYS k=0. REVIEW THIS ROW.]';}\n }\n}\n",
 "  if(k===0){raw+='\\n\\n[EXTRACTOR v16: KEYSTONE SAYS BROKEN BUT THE CLAUSE LINE SAYS k=0. REVIEW THIS ROW.]';}\n }\n}\n"
 +"/* pkgKSC (W3 2665): the single judge has no send-back; a keystone graded STANDS on a premise its own CONCEDED LINKS line counts is recorded here, record-only */\n"
 +"try{for(const __k of KSC.items(String(raw).split('\\n').filter(l=>!/^\\s*\\[(?:AUDIT|EXTRACTOR)\\b/.test(l)).join('\\n'),prev&&prev.gr2))raw+='\\n\\n[AUDIT v48: SINGLE JUDGE (second opinion): KEYSTONE CONSISTENCY (E-KSC, Commitment 15; record-only, the single judge has no send-back) -- KEYSTONE D'+__k.n+' STANDS while CONCEDED LINKS counts '+__k.via+' '+__k.tag+'. REVIEW THIS ROW.]';}catch(e){}\n","Extract Independent Verdict"),2);
fs.writeFileSync(OUTW,JSON.stringify(w));fs.writeFileSync('pkgKSC/plan_KSC.json',JSON.stringify(plan,null,1));
for(const p of plan.nodes)console.log(p.node.padEnd(28),p.base_sha,'->',p.final_sha,p.edits+' edit'+(p.edits>1?'s':''));console.log(plan.nodes.length+' nodes');
