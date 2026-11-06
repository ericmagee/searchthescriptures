// pkgECL (W3 Wall 2547; Eric's requirement 2026-11-06): a judge that breaks or FORCES a link explains itself in the debaters' layered form.
// Base: live 862c3d54 (pkgECF + pkgECF2 written; pkgLIB reverted, so every node is a full source). Run from wall2024/: node pkgECL/build_ECL.cjs
//  (1) Send Back Build, Alt: each E-COL line (from the enforcer Build's ids) is run through the layer check (ECL, src_ECL.js). A FORCED line, or a
//      LINK BROKEN line not resting on an unanswered press, with no counted [L1], or turning on a word's meaning with no counted [L2], is sent back
//      (ENFORCED) whether or not the DeepSeek enforcer disagreed; the send-back states the layer form and the cure.
//  (2) Send Back Record, Alt: such an item cures only by CHANGE TO RETRACTED / a non-BROKEN regrade, or a CHANGE TO line that passes the layer
//      check (and, when DeepSeek also disagreed, the pkgECF2 both-sides test). A KEEP does not cure it. UNCURED counts in drv_uncured (pkgECF path).
//  (3) PART2 Commitment 13 (the form, with one example), byte-identical in all 15 nodes that carry PART2.
//  (4) The judge's collision instructions (Panel Build, Build Independent Verdict): the FORCED form and the COLLISION POINTS line add GROUND layers.
//  (5) Judge Enforcer Build, Alt: RULE E-COL says the GROUND layers are counted in code; the FAILS note reads a FAILS quote followed by GROUND.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const LIVE=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/prewrite_lib_66adcc25.json','utf8'));const W=LIVE.data||LIVE;
const liveSrc=n=>{const x=W.nodes.find(z=>z.name===n);if(!x)throw new Error('no live node '+n);return x.parameters.jsCode;};
const LIB=['src_REFP.js','src_L2C.js','src_kkjv.js','src_ECL.js'].map(f=>fs.readFileSync('pkgECL/'+f,'utf8')).join('\n')+'\n';
const OUT='pkgECL/patched';fs.mkdirSync(OUT,{recursive:true});const plan={base:'live 862c3d54 (pkgECF2 on pkgECF; library nodes pkgKVP)',nodes:[]};
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor found '+n+' times: '+a.slice(0,80));return s.replace(a,()=>b);};
const save=(f,base,s0,s,edits)=>{new Function('$','$input','$json',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base,base_sha:sha(s0),final_sha:sha(s),edits});console.log(f.padEnd(30),sha(s0),'->',sha(s),edits+' edits');};

// ---- (1) Send Back Build ----
for(const [f,jeb,role] of [['Send_Back_Build.js','Judge Enforcer Build','panel'],['Alt_Send_Back_Build.js','Alt Judge Enforcer Build','alternate']]){
 const s0=fs.readFileSync('pkgECF2/patched/'+f,'utf8');let s=LIB+s0;
 s=rep(s,"if(!dis.length)return skip(","/* pkgECL (W3 2547): the layer check on every E-COL line, ENFORCED: a fault is sent back even when the enforcer agreed */\n"
  +"try{const __ctx=ECL.ctxLive();const __seen=new Set();for(const __it of $('"+jeb+"').all())for(const __x of ((__it.json&&__it.json.ids)||[])){if(!__x||__x.rule!=='E-COL')continue;const __k=__x.seat+'|'+__x.flagged_line;if(__seen.has(__k))continue;__seen.add(__k);\n"
  +" const __c=ECL.check(__x.flagged_line,__ctx);if(!__c.faults.length)continue;const __d=dis.find(y=>y.rule==='E-COL'&&y.seat===__x.seat&&String(y.flagged_line||'')===String(__x.flagged_line||''));\n"
  +" if(__d){__d.ecl={...__c,ds:true};__d.cure_reason=String(__d.cure_reason||'')+' | LAYER CHECK (pkgECL, Commitment 13): '+__c.why;}\n"
  +" else dis.push({seat:__x.seat,seat_role:'"+role+"',rule:'E-COL',item:__x.item,flagged_line:__x.flagged_line,response_line:__x.response_line,cure_reason:'ENFORCER DISAGREE: LAYER CHECK (pkgECL, Commitment 13): '+__c.why,ecl:{...__c,ds:false}});}}catch(e){}\n"
  +"if(!dis.length)return skip(",f);
 s=rep(s,"reason:why(x),src:x}));","reason:why(x),ecl:x.ecl||null,src:x}));",f);
 s=rep(s,"const __ecfR=i=>","const __eclR=i=>!i.ecl?'':'\\nTHE LAYER CHECK (E-COL, ENFORCED, pkgECL; Commitment 13): '+i.ecl.why+'. A break line gives its grounds after GROUND: in layers: [L1] <reference> \"<the KJV words the answer cannot agree with>\" (counted when the words stand in that verse); [L2] <word> (<Strong\\'s number>, <gloss>) when the break turns on a word\\'s meaning (counted when the word stands in a verse the line cites); [L3] <reference> \"<KJV words>\" for any cross-reference relied on. To keep the break, CHANGE TO the line with its counted layers. Otherwise CHANGE TO: RETRACTED: <pair>, or the pair regraded. A KEEP does not cure this item.';\nconst __ecfR=i=>",f);
 s=rep(s,"+hold421(i)+__ecfR(i))","+hold421(i)+__ecfR(i)+__eclR(i))",f);
 s=rep(s,"items:items.map(i=>({sid:i.sid,rule:i.rule,item:i.item,line:i.line,reason:i.reason}))","items:items.map(i=>({sid:i.sid,rule:i.rule,item:i.item,line:i.line,reason:i.reason,ecl:i.ecl||null}))",f);
 save(f,'pkgECF2/patched',s0,s,6);}

// ---- (2) Send Back Record ----
for(const f of ['Send_Back_Record.js','Alt_Send_Back_Record.js']){const s0=fs.readFileSync('pkgECF2/patched/'+f,'utf8');let s=LIB+s0;
 s=rep(s," if(it.rule==='E-COL'){"," if(it.rule==='E-COL'){if(it.ecl&&Array.isArray(it.ecl.faults)&&it.ecl.faults.length){ /* pkgECL (W3 2547): a layer fault cures only by a CHANGE TO */\n"
  +"  if(a.ans!=='CHANGE')return res(false,'a KEEP does not cure a layer fault (pkgECL, Commitment 13): '+it.ecl.why);const __to=String(a.to||'').replace(/\\\\+\"/g,'\"');\n"
  +"  if(/^\\s*RETRACTED\\b/i.test(__to))return res(true,'CHANGE TO RETRACTED (pkgECL)');if(!/\\b(?:BROKEN|FORCED)\\b/.test(__to))return res(true,'CHANGE TO a line that does not grade the pair BROKEN or FORCED (pkgECL)');\n"
  +"  const __c=ECL.check(__to,ECL.ctxLive());if(__c.faults.length)return res(false,'CHANGE TO still fails the layer check (pkgECL): '+__c.why);if(!it.ecl.ds)return res(true,'CHANGE TO carries its layers (pkgECL): '+__c.why);}\n",f);
 s=rep(s,"enf428Cure({rule:it.rule,item:it.item,line:it.line,reason:it.reason}","enf428Cure({rule:it.rule,item:it.item,line:it.line,reason:it.reason,ecl:it.ecl||null}",f);
 save(f,'pkgECF2/patched',s0,s,3);}

// ---- (3) PART2 Commitment 13, (4) collision instructions, (5) enforcer Build ----
const C13=`

### Commitment 13. I give the layers of every break I grade.
When I grade a link broken because its meaning cannot take a verse, and in every FORCED line, I give my grounds after GROUND: in the layers the debaters use:
[L1] the verse words the answer cannot agree with, quoted exactly from the KJV with the reference;
[L2] when the break turns on a word's meaning, the Hebrew or Greek word with its Strong's number and gloss, a word that stands in a verse my line cites;
[L3] any cross-reference I rely on, quoted with its reference.
The line also quotes the answer words that fail. A bare reason, such as "cannot overcome" or "directly contradicts", is not a ground. For example:
D2 vs C1 (Genesis 2:24): CHALLENGER LINK BROKEN -- <one clause of why> -- GROUND: [L1] Genesis 2:24 "shall cleave unto his wife: and they shall be one flesh" | [L2] dabaq (H1692, to cling, adhere) | [L3] Matthew 19:5 "shall cleave to his wife"
FORCED: D2 vs C1 -- MEANS [<round>]: "<the pressing sentence>" -- ANSWER [<round>]: "<the answer>" -- FAILS: "<the answer words that fail>" -- GROUND: [L1] Genesis 2:24 "shall cleave unto his wife" | [L2] dabaq (H1692, to cling, adhere)
The system counts each layer: an [L1] whose words do not stand in the verse named, or an [L2] whose word does not stand in a verse my line cites, is not counted. A break with no counted [L1], or a break on a word's meaning with no counted [L2], is sent back to me; if I neither add the counted layers nor retract it, it is recorded against my seat. A break that rests on an unanswered press quotes the pressing sentence instead (Commitment 5).`;
const C13JS=C13.replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\n/g,'\\n');
const P2END="A quote of mine that is not in the KJV's words is recorded against my seat.\";";
const R396A='-- FAILS: \\"<the words of the layer of that answer that fails to show the fit, quoted from the ANSWER round>\\".';
const R396B='-- FAILS: \\"<the words of the layer of that answer that fails to show the fit, quoted from the ANSWER round>\\" -- GROUND: [L1] <reference> \\"<the KJV words the answer cannot agree with>\\" | [L2] <word> (<Strong\'s number>, <gloss>), when the break turns on a word\'s meaning | [L3] <reference> \\"<KJV words>\\", for any cross-reference relied on (Commitment 13).';
const COLA="DEFENDER LINK BROKEN | CHALLENGER LINK BROKEN | UNDERDETERMINED -- one clause of why -- GROUND: <reason>;";
const COLB="DEFENDER LINK BROKEN | CHALLENGER LINK BROKEN | UNDERDETERMINED -- one clause of why -- GROUND: <reason; a BROKEN grade gives it in layers: [L1] <reference> \\\"<KJV words>\\\" | [L2] <word> (<Strong's number>, <gloss>) when it turns on a word's meaning | [L3] <reference> \\\"<KJV words>\\\" (Commitment 13)>;";
const ECOLA="or the line rests on an absence or on a demand for a stating verse.\\n'";
const ECOLB="or the line rests on an absence or on a demand for a stating verse. A line\\'s layers after GROUND ([L1], [L2], [L3]; Commitment 13) are counted in code, not by you: read them as the judge\\'s grounds.\\n'";
const FNA='const f=l.match(/--\\s*FAILS\\s*:\\s*"([\\s\\S]+)"\\s*$/);';
const FNB='const f=l.match(/--\\s*FAILS\\s*:\\s*"([\\s\\S]+?)"\\s*(?:--\\s*GROUND\\s*:[\\s\\S]*)?$/); /* pkgECL: a FORCED line may end with its GROUND layers */';
const LIBN=['Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Alternate Build','Alternate Cure Build'];
const P2N=['Panel Build','Reserve Build','Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Alternate Build','Alternate Cure Build','Accept Build','Accept Check','Accept Return Build','Accept Final','Accept DS Return Build','Enforcer Build','Judge Enforcer Build','Alt Judge Enforcer Build','Build Independent Verdict'];
for(const n of P2N){const f=n.replace(/ /g,'_')+'.js';let base,s0;
 if(LIBN.includes(n)){base='pkgKVP/patched';s0=fs.readFileSync(base+'/'+f,'utf8');}else if(/Judge Enforcer Build/.test(n)){base='pkgECF/patched';s0=fs.readFileSync(base+'/'+f,'utf8');}else if(n==='Accept Build'){base='pkgECL/base';s0=liveSrc(n).split("const ORDER=['gemini','chatgpt','qwen','sol','grok','glm'];").join("const ORDER=['gemini','chatgpt','qwen','sol','grok'];");fs.mkdirSync(base,{recursive:true});fs.writeFileSync(base+'/'+f,s0);} /* live 862c3d54: GLM removed from ORDER (Eric); W3 2556 */
 else{base='live prewrite_lib_66adcc25';s0=liveSrc(n);}
 let s=s0,k=0;
 if(n!=='Build Independent Verdict'){s=rep(s,P2END,P2END.slice(0,-2)+C13JS+'";',f);k++;}
 if(n==='Panel Build'||n==='Build Independent Verdict'){s=rep(s,R396A,R396B,f);s=rep(s,COLA,COLB,f);k+=2;}
 if(/Judge Enforcer Build/.test(n)){s=rep(s,ECOLA,ECOLB,f);s=rep(s,FNA,FNB,f);k+=2;}
 save(f,base,s0,s,k);}
fs.writeFileSync('pkgECL/plan_ECL.json',JSON.stringify(plan,null,1));
