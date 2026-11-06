// pkgIMP build (see src_IMP.js; W3 spec Wall 2627; Eric 17:08 CST). Bases: live 98daac9e + n19 (pkgUAP/KVE/KWA/MNP) + n20 (pkgOAN).
//  Send Back Build, Alt Send Back Build, Send Back Record, Alt Send Back Record: pkgMNP/patched (n19 finals).
//  Commitment 14 in PART2: Panel Cure Build 1-3, Alternate Build, Alternate Cure Build from pkgKWA/patched (n19 finals); the other 10 PART2 nodes
//  from the fetch-back (pkgIMP/base/, written by base/extract_base.py; none is in n19 or n20).
// E-IMP items, ENFORCED; UNCURED counts once in drv_uncured, AUDIT v46. Run from wall2024/: node pkgIMP/build_IMP.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const SRC=fs.readFileSync('pkgIMP/src_IMP.js','utf8')+'\n';const OUT='pkgIMP/patched';fs.mkdirSync(OUT,{recursive:true});const plan={base:'live 98daac9e + n19 + n20',nodes:[]};
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor '+n+': '+a.slice(0,70));return s.replace(a,()=>b);};
const ins=s0=>{const i=s0.indexOf('const PAB=(()=>{');if(i<0)throw new Error('no PAB');return s0.slice(0,i)+SRC+s0.slice(i);};
const save=(f,base,s0,s,edits)=>{new Function('$','$input','$json',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base,base_sha:sha(s0),final_sha:sha(s),edits});console.log(f.padEnd(28),sha(s0),'->',sha(s));};
// ---- the send-back: E-IMP items ----
for(const [f,role] of [['Send_Back_Build.js','panel'],['Alt_Send_Back_Build.js','alternate']]){const B='pkgMNP/patched';const s0=fs.readFileSync(B+'/'+f,'utf8');let s=ins(s0);
 s=rep(s,"\nif(!dis.length)return skip(","\n/* pkgIMP (Eric 17:08 CST; W3 2627; Commitment 14): every debater sentence that imposes a requirement on scripture, one E-IMP item per judge, ENFORCED */\n"
  +"try{const __tx=r=>String(r||'').replace(/\\\\n/g,'\\n').replace(/\\\\\"/g,'\"');\n"
  +" for(const __b of ((PCC&&PCC.bodies)||[])){let __p;try{__p=(typeof __b==='string'?JSON.parse(__b):__b).payload||{};}catch(e){continue;}if(!__p.judge_seat)continue;\n"
  +"  const __j=PB&&Array.isArray(PB.judges)?PB.judges.find(q=>q.seat===__p.judge_seat):null;if(!__j||!__j.body||!Array.isArray(__j.body.messages))continue;\n"
  +"  const __pt=__j.body.messages.map(m=>typeof m.content==='string'?m.content:(Array.isArray(m.content)?m.content.map(c=>c&&c.text||'').join('\\n'):'')).join('\\n');\n"
  +"  const __t=__tx(__p.verdict_raw).split('\\n').filter(l=>!/^\\s*\\[AUDIT\\b/.test(l)).join('\\n');\n"
  +"  const __R=UND.rounds(__pt);for(const __c of IMP.items(__t,IMP.harvest(__R),__R)){if(__c.kind==='IMPOSED')dis.push({seat:__p.judge_seat,seat_role:'"+role+"',rule:'E-IMP',item:'IMPOSED '+__c.id+' ['+__c.round+'] ('+__c.side+': \"'+__c.phrase+'\")',flagged_line:'['+__c.round+'] \"'+__c.sentence+'\"',response_line:'',cure_reason:'ENFORCER DISAGREE: IMPOSED REQUIREMENT (pkgIMP, Commitment 14): the '+__c.side.toLowerCase()+' rests an answer on a verse not stating something (\"'+__c.phrase+'\"), and your reasoning holds no IMPOSED line for it',imp:{kind:'IMPOSED',id:__c.id,round:__c.round,side:__c.side,sentence:__c.sentence,phrase:__c.phrase}});\n"
  +"   else dis.push({seat:__p.judge_seat,seat_role:'"+role+"',rule:'E-IMP',item:'CONTRADICTION '+__c.id,flagged_line:__c.line,response_line:__c.line,cure_reason:'ENFORCER DISAGREE: IMPOSED REQUIREMENT CONTRADICTION (pkgIMP, Commitment 14): this ANSWER CHECK is graded MEETS on an answer your own line flags NO ROW SETS IT: '+__c.imposed,imp:{kind:'CONTRADICTION',id:__c.id,round:__c.round,ref:__c.ref,imposed:__c.imposed}});}}}catch(e){}\n"
  +"if(!dis.length)return skip(",f); /* last of the item blocks: E-IMP items come after every other item of a seat, so the 60-item cap never pushes another rule's item out */
 s=rep(s,"pab:x.pab||null,mnp:x.mnp||null,src:x}));","pab:x.pab||null,mnp:x.mnp||null,imp:x.imp||null,src:x}));",f);
 s=rep(s,"const __mnpR=i=>","const __impR=i=>!i.imp?'':(i.imp.kind==='CONTRADICTION'?'\\nTHE IMPOSED REQUIREMENT RULE (E-IMP, ENFORCED, pkgIMP; Commitment 14): you grade MEETS an answer your own IMPOSED line flags NO ROW SETS IT. A requirement no row sets is not an answer. CHANGE TO this ANSWER CHECK graded MISSES or FAILS, or CHANGE TO the IMPOSED line SET BY [L1] <reference> \"<the KJV words that set it>\". A KEEP does not cure this item.'"
  +":'\\nTHE IMPOSED REQUIREMENT RULE (E-IMP, ENFORCED, pkgIMP; Commitment 14): the sentence above rests an answer on a verse not stating something (\"'+i.imp.phrase+'\"). That asks the verse to hold a requirement; it is an answer only when a row of scripture sets that requirement. CHANGE TO one line: IMPOSED: ['+i.imp.round+'] \"<the sentence, quoted>\" -- asks <verse> to <what it is asked to state> -- NO ROW SETS IT, or SET BY [L1] <reference> \"<the KJV words that set it>\". The KJV words are counted. A KEEP does not cure this item.');\nconst __mnpR=i=>",f);
 s=rep(s,"+__absR(i)+__pabR(i)+__mnpR(i))","+__absR(i)+__pabR(i)+__mnpR(i)+__impR(i))",f);
 s=rep(s,"pab:i.pab||null,mnp:i.mnp||null}))","pab:i.pab||null,mnp:i.mnp||null,imp:i.imp||null}))",f);
 save(f,B,s0,s,6);}
for(const [f,bsrc] of [['Send_Back_Record.js',"$('Panel Cure Check').first().json.bodies"],['Alt_Send_Back_Record.js',"$('Alt Seated').first().json.bodies"]]){const B='pkgMNP/patched';const s0=fs.readFileSync(B+'/'+f,'utf8');let s=ins(s0);
 s=rep(s,"const MNPM={};","const MNPM={};const IMPM={}; /* pkgIMP: seat -> uncured items */",f);
 s=rep(s,"  if(it.mnp){try{__ec=MNP.cure(","  if(it.imp){try{__ec=IMP.cure(it,a||{ans:'NO ANSWER'},{...ECL.ctxLive(),R:IMP.roundsOf(b)});}catch(e){__ec={status:'UNREAD',why:'imposed-requirement cure reading error: '+String(e&&e.message||e).slice(0,160)};}} /* pkgIMP: ENFORCED */\n  if(it.mnp){try{__ec=MNP.cure(",f);
 s=rep(s,"(__ec?(it.mnp?","(__ec?(it.imp?' | CURE (IMPOSED REQUIREMENT ENFORCED, pkgIMP): ':it.mnp?",f);
 s=rep(s,"  else if(it.mnp&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';});});",
  "  else if(it.mnp&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';\n"
  +"  if(it.imp&&__ec&&__ec.status!=='CURED'&&!silent&&!err){if(rows[rows.length-1].cure_status!=='UNCURED')(IMPM[b.seat]=IMPM[b.seat]||[]).push(it.sid+' (E-IMP '+String(it.item||'').slice(0,60)+': '+String(__ec.why).slice(0,160)+')');rows[rows.length-1].cure_status='UNCURED';} /* pkgIMP: counts once; silence is counted already (pkgSBS) */\n"
  +"  else if(it.imp&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';});});",f);
 s=rep(s,"const mnp_counted=[];","const mnp_counted=[];const imp_counted=[];",f);
 s=rep(s,"/* pkgMNP: each seat's uncured MEANS items","/* pkgIMP: each seat's uncured imposed-requirement items are added to its drv_uncured */\n"
  +"if(Object.keys(IMPM).length){bodies=(bodies||(Array.isArray(PASS.bodies)?PASS.bodies:"+bsrc+")).slice();\n"
  +" for(const [seat,its] of Object.entries(IMPM)){const i=bodies.findIndex(x=>{try{return JSON.parse(x).payload.judge_seat===seat;}catch(e){return false;}});if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;\n"
  +"  p.drv_uncured=(p.drv_uncured||0)+its.length;anySil=true;imp_counted.push({seat,items:its});\n"
  +"  p.verdict_raw=p.verdict_raw+'\\n[AUDIT v46: IMPOSED REQUIREMENT UNCURED (pkgIMP, Commitment 14) -- SEAT: '+seat+'; ITEMS: '+its.join('; ')+'; counted in drv_uncured. REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}\n"
  +"/* pkgMNP: each seat's uncured MEANS items",f);
 s=rep(s,"pab_counted,mnp_counted},sb_rows","pab_counted,mnp_counted,imp_counted},sb_rows",f);
 save(f,B,s0,s,7);}
// ---- Commitment 14 in PART2 ----
const C14=`

### Commitment 14. I flag every requirement a debater imposes on scripture.
An answer that rests on a verse failing to state, name or say something ("They do not name the parent", "It does not say through whom") asks that verse to hold a requirement the verse itself does not hold or suggest. It is not an answer unless a row of scripture sets that requirement. This binds both sides alike. For each such sentence of either side I write one line in reasoning, after the ANSWER CHECK lines:
IMPOSED: [<round>] "<the sentence, quoted>" -- asks <verse> to <what it is asked to state> -- NO ROW SETS IT
or, when a row does set it: IMPOSED: [<round>] "<the sentence, quoted>" -- asks <verse> to <what it is asked to state> -- SET BY [L1] <reference> "<the KJV words that set it>"
When the sentence only rebuts a claim of the other side (it denies that a verse says what the other side said it says), I write instead: IMPOSED: [<round>] "<the sentence, quoted>" -- NOT A REQUIREMENT -- rebuts [<the other side's round>] "<the other side's words, quoted word for word, 6 or more>". A sentence that grants, concedes, withdraws or narrows is not read.
I grade no ANSWER CHECK MEETS on an answer I flag NO ROW SETS IT. The system finds these sentences in code and sends back each one my reasoning leaves without an IMPOSED line; the KJV words of SET BY are counted; a KEEP does not cure the item, and an item left uncured is recorded against my seat.`;
const C14JS=C14.replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\n/g,'\\n');const A='quotes the pressing sentence instead (Commitment 5).";';
for(const n of ['Panel Build','Reserve Build','Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Alternate Build','Alternate Cure Build','Accept Build','Accept Check','Accept Return Build','Accept Final','Accept DS Return Build','Enforcer Build','Judge Enforcer Build','Alt Judge Enforcer Build']){
 const f=n.replace(/ /g,'_')+'.js';const B=fs.existsSync('pkgIMP/base/'+f)?'pkgIMP/base':'pkgKWA/patched';const s0=fs.readFileSync(B+'/'+f,'utf8');save(f,B,s0,rep(s0,A,A.slice(0,-2)+C14JS+'";',f),1);}
fs.writeFileSync('pkgIMP/plan_IMP.json',JSON.stringify(plan,null,1));
