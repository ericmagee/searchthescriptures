// pkgECF (W3 Wall 2534, on W2 2533): E-COL's rival-reading test ENFORCED on collision lines (FORCED, and "... LINK BROKEN"). Side-neutral.
// Run from wall2024/: node pkgECF/build_ECF.cjs. Bases: Judge Enforcer Build and Alt from pkgJEC/patched (live since 2a23bc90);
// Send Back Build / Record and the Alt pair from the live revert copy prewrite_lib_66adcc25.json (pkgECF/base, unchanged by the 2a23bc90 write).
// Why the feed first: in 33083 no E-COL item was raised at all. (1) gemini wrote "D1 vs C1 (Matthew 1:16): CHALLENGER LINK BROKEN", and the feed
// read a pair only when the colon follows it at once; (2) a FORCED line a judge writes in its CURE reply (gemini's five, 33083) was never fed,
// since the feed reads only the verdicts.
// A. Judge Enforcer Build (and Alt): (A1) the feed reads "D<i> vs C<j> (<reference>):" too; (A2) it also reads the FORCED and LINK BROKEN lines of each
//    seat's cure reply (Panel Cure Normalize 1-3; Alternate Cure Normalize for Alt); (A3) RULE E-COL says a rival reading is not a break.
// B. Send Back Build (and Alt): an E-COL item states the cure rule.
// C. Send Back Record (and Alt): the E-COL cure is read, and an UNCURED E-COL item counts in the seat's drv_uncured (ENFORCED; AUDIT v41 line).
//    CURED by: CHANGE TO a line that grades the pair neither BROKEN nor FORCED (RETRACTED, UNDERDETERMINED, STANDS, ...), or KEEP / CHANGE TO a
//    FORCED line whose sentence or line quotes, in quotation marks, 6 or more words in a row of the ANSWERING side's rounds (the words the judge
//    says the meaning cannot agree with). Silence is already counted by pkgSBS and is not counted twice.
//    The judge keeps the decision (ruling 428): the code checks the form and the quote, not whether the reading is a rival one.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const OUT='pkgECF';
const FEED_A="if(!(/^FORCED(?:\\s*\\(\\s*Commitment\\s+\\d+\\s*\\))?\\s*:/.test(l)||(/^(?:[DC]\\d+\\s*(?:vs\\.?\\s*[DC]\\d+)?)\\s*:/.test(l)&&/LINK BROKEN/.test(l))))continue;";
const FEED_B="if(!__ecfColl(l))continue; /* pkgECF (A1) */";
const LOOP_A="const CG=[];\nfor(const j of judges)for(const l0 of j.t.split('\\n')){";
const LOOP_B=(nodes)=>"const CG=[];\n/* pkgECF (A1): a collision line may carry its reference before the colon (\"D1 vs C1 (Matthew 1:16): CHALLENGER LINK BROKEN\", 33083 gemini) */\nconst __ecfColl=l=>/^FORCED(?:\\s*\\(\\s*Commitment\\s+\\d+\\s*\\))?\\s*:/.test(l)||(/^(?:[DC]\\d+\\s*(?:vs\\.?\\s*[DC]\\d+)?)\\s*(?:\\([^()\\n]{0,160}\\))?\\s*:/.test(l)&&/LINK BROKEN/.test(l));\n"
 +"/* pkgECF (A2): the FORCED and LINK BROKEN lines a seat writes in its cure reply are fed too (33083 gemini D1-D5 FORCED) */\nconst __ecfJ=judges.map(j=>({seat:j.seat,t:j.t}));for(const __n of "+JSON.stringify(nodes)+"){try{if(!$(__n).isExecuted)continue;for(const __it of $(__n).all()){const __c=__it.json&&__it.json.cure,__r=__it.json&&__it.json.reply;if(!__c||!__r||!__r.text||!judges.some(j=>j.seat===__c.seat))continue;__ecfJ.push({seat:__c.seat,t:String(__r.text).replace(/\\\\n/g,'\\n').replace(/\\\\\"/g,'\"').split('\\n').map(x=>x.replace(/^\\s*\"(?:reasoning|reason)\"\\s*:\\s*\"/,'')).join('\\n')});}}catch(e){}}\n"
 +"for(const j of __ecfJ)for(const l0 of j.t.split('\\n')){";
const RULE_A="it is not broken because no verse states it, or because of an absence. When the item says";
const RULE_B="it is not broken because no verse states it, or because of an absence, and it is not broken by a rival reading: an answer that reads a contested word another way, with its own layers quoted in its round, can agree with the meaning on its own reading (pkgECF, W3 2534; either side alike). A link is also broken when a proven press against it was left unanswered (Commitment 5) and the line quotes the pressing sentence and names its round (ruling 392); that is not a break by absence. When the item says";
// B. Send Back Build
const SB_A="const msg='An enforcer has read some of your lines";
const SB_B="const __ecfR=i=>i.rule!=='E-COL'?'':'\\nTHE RULE (E-COL, ENFORCED, pkgECF): a collision line breaks a link by meaning only when the answer\\'s own words cannot agree with the meaning pressed; a rival reading of a contested word, footed by the answer\\'s own layers, is not a break. To keep the line, KEEP it with a sentence that quotes at least 6 words in a row of the answering side\\'s round that the meaning cannot agree with (or, for a line resting on an unanswered press, the pressing sentence with its round, ruling 392). Otherwise CHANGE TO: RETRACTED: <pair>, or the pair regraded (UNDERDETERMINED or STANDS). An item left without either counts against your seat.';\n const msg='An enforcer has read some of your lines";
const SB2_A="+cut(i.reason,900)+hold421(i)).join('\\n\\n')";
const SB2_B="+cut(i.reason,900)+hold421(i)+__ecfR(i)).join('\\n\\n')";
// C. Send Back Record
const REC1_A=" return res(false,'not an E-ANS or E-PREM item');}";
const REC1_B=String.raw` if(it.rule==='E-COL'){const L=String(it.line||'').replace(/\\+"/g,'"');const pm=(L.match(/\b(D\d+)\s*vs\.?\s*(C\d+)\b/i)||String(it.item||'').match(/\b(D\d+)\s*vs\.?\s*(C\d+)\b/i));
  const am=L.match(/ANSWER\s*\[\s*(?:([CD])R|(Defender|Challenger))/i);const fs=am?(am[1]?am[1].toUpperCase():(/^d/i.test(am[2])?'C':'D')):/CHALLENGER LINK BROKEN/.test(L)?'D':/DEFENDER LINK BROKEN/.test(L)?'C':null; /* pkgECF: the answering side; its rounds are CR (defender) or DR (challenger) */
  if(!fs)return res(false,'the line names no answering side');const FORC=/^\s*FORCED\b/i.test(L);const SR=Object.keys(R||{}).filter(k=>FORC?side(k)===fs:!!side(k)); /* a FORCED line keeps by the answering side's words; a LINK BROKEN line also by the quoted pressing sentence (ruling 392) */
  const qd=s=>six(String(s||'').replace(/\\+"/g,'"'),SR); /* 6 words in a row of those rounds, anywhere in the sentence (inner quotation marks split a quoted span) */
  if(a.ans==='CHANGE'){const to=String(a.to||'');const pr=pm?new RegExp('\\b'+pm[1]+'\\s*vs\\.?\\s*'+pm[2]+'\\b','i'):null;
   if(!/\b(?:BROKEN|FORCED)\b/.test(to)&&(!pr||pr.test(to)||/^\s*RETRACTED\b/i.test(to)))return res(true,'CHANGE TO a line that does not grade the pair BROKEN or FORCED');
   const q=qd(to+' '+(a.why||''));return res(!!q,q?'CHANGE TO keeps the break and quotes the answering side\'s round: "'+q+'"':'CHANGE TO keeps the break (BROKEN or FORCED) and quotes no 6 words in a row of the answering side\'s round');}
  const q=qd(a.why);return res(!!q,q?(FORC?'KEEP whose sentence quotes the answering side\'s round: "':'KEEP whose sentence quotes a round: "')+q+'"':(FORC?'KEEP whose sentence quotes no 6 words in a row of the answering side\'s round':'KEEP whose sentence quotes no 6 words in a row of any round'));}
 return res(false,'not an E-ANS, E-PREM or E-COL item');}`;
const REC2_A="let __ec=null;if(it.rule==='E-ANS'||it.rule==='E-PREM'){";
const REC2_B="let __ec=null;if(it.rule==='E-ANS'||it.rule==='E-PREM'||it.rule==='E-COL'){";
const REC3_A="(__ec?' | CURE (record-only until promoted): '+__ec.status+' -- '+String(__ec.why).slice(0,400):''),at:T});";
const REC3_B="(__ec?(it.rule==='E-COL'?' | CURE (E-COL ENFORCED, pkgECF): ':' | CURE (record-only until promoted): ')+__ec.status+' -- '+String(__ec.why).slice(0,400):''),at:T});\n  if(it.rule==='E-COL'&&__ec&&__ec.status!=='CURED'&&!silent&&!err){(ECF[b.seat]=ECF[b.seat]||[]).push(it.sid+' ('+String(it.item||'').slice(0,60)+': '+String(__ec.why).slice(0,160)+')');rows[rows.length-1].cure_status='UNCURED';} /* pkgECF (C): an UNCURED E-COL answer counts; silence is counted already (pkgSBS) */\n  else if(it.rule==='E-COL'&&__ec&&__ec.status==='CURED')rows[rows.length-1].cure_status='CURED';";
const REC4_A="const SIL={}; /* pkgSBS: seat -> silent S numbers */";
const REC4_B="const SIL={}; /* pkgSBS: seat -> silent S numbers */const ECF={}; /* pkgECF: seat -> uncured E-COL items */";
const REC5_A="let bodies=null,anySil=false;const silent_counted=[];";
const REC5_B="let bodies=null,anySil=false;const silent_counted=[];const ecol_counted=[];\n/* pkgECF (C): each seat's uncured E-COL answers are added to its drv_uncured, as silence is */\nif(Object.keys(ECF).length){bodies=(Array.isArray(PASS.bodies)?PASS.bodies:$('Panel Cure Check').first().json.bodies).slice();\n for(const [seat,its] of Object.entries(ECF)){const i=bodies.findIndex(x=>{try{return JSON.parse(x).payload.judge_seat===seat;}catch(e){return false;}});if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;\n  p.drv_uncured=(p.drv_uncured||0)+its.length;anySil=true;ecol_counted.push({seat,items:its});\n  p.verdict_raw=p.verdict_raw+'\\n[AUDIT v41: E-COL UNCURED (pkgECF, W3 2534) -- SEAT: '+seat+'; ITEMS: '+its.join('; ')+'; counted in drv_uncured. REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}";
const REC6_A="if(Object.keys(SIL).length){bodies=(Array.isArray(PASS.bodies)?PASS.bodies:$('Panel Cure Check').first().json.bodies).slice();";
const REC6_B="if(Object.keys(SIL).length){bodies=(bodies||(Array.isArray(PASS.bodies)?PASS.bodies:$('Panel Cure Check').first().json.bodies)).slice();";
const REC7_A="sendback:{skipped:false,calls:B.length,not_sent:ns.length,tally,errors,silent_counted}";
const REC7_B="sendback:{skipped:false,calls:B.length,not_sent:ns.length,tally,errors,silent_counted,ecol_counted}";
const jobs=[
 ['pkgJEC/patched','Judge_Enforcer_Build.js',[[LOOP_A,LOOP_B(['Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3'])],[FEED_A,FEED_B],[RULE_A,RULE_B]]],
 ['pkgJEC/patched','Alt_Judge_Enforcer_Build.js',[[LOOP_A,LOOP_B(['Alternate Cure Normalize'])],[FEED_A,FEED_B],[RULE_A,RULE_B]]],
 ['pkgECF/base','Send_Back_Build.js',[[SB_A,SB_B],[SB2_A,SB2_B]]],
 ['pkgECF/base','Alt_Send_Back_Build.js',[[SB_A,SB_B],[SB2_A,SB2_B]]],
 ['pkgECF/base','Send_Back_Record.js',[[REC1_A,REC1_B],[REC2_A,REC2_B],[REC3_A,REC3_B],[REC4_A,REC4_B],[REC5_A,REC5_B],[REC6_A,REC6_B],[REC7_A,REC7_B]]],
 ['pkgECF/base','Alt_Send_Back_Record.js',[[REC1_A,REC1_B],[REC2_A,REC2_B],[REC3_A,REC3_B],[REC4_A,REC4_B],[REC5_A,REC5_B],[REC6_A,REC6_B],[REC7_A,REC7_B]]],
];
fs.mkdirSync(OUT+'/patched',{recursive:true});const plan={nodes:[]};
for(const [base,file,E0] of jobs){const s0=fs.readFileSync(base+'/'+file,'utf8');let s=s0;const altB=/^Alt_Send_Back_Record/.test(file);const E=altB?E0.map(([a,b])=>[a,b].map(x=>x.split("$('Panel Cure Check').first().json.bodies").join("$('Alt Seated').first().json.bodies"))):E0;for(const [a,b] of E){const n=s.split(a).length-1;if(n!==1)throw new Error(file+': anchor found '+n+' times: '+a.slice(0,80));s=s.replace(a,()=>b);}
 new Function('$','$input','$json',s); /* syntax check */
 fs.writeFileSync(OUT+'/patched/'+file,s);plan.nodes.push({base,file,base_sha:sha(s0),final_sha:sha(s),edits:E.length});console.log(file.padEnd(30),base.padEnd(16),sha(s0),'->',sha(s),E.length+' edits');}
fs.writeFileSync(OUT+'/plan_ECF.json',JSON.stringify(plan,null,1));
