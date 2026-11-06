// pkgCM (W3 grade_33040, Wall 2394 and 2395; run 33040). Base: live ec44727f (= 83ef4d98 plus the judging order; these nodes are the
// 83ef4d98 code, read from /mnt/project-files/wall2024/prewrite_glm_83ef4d98.json into pkgCM/base). Run from wall2024/: node pkgCM/build_CM.cjs
// (a) SB_FORM accepts the CHAIN MARK form (spec section 13): "DEFENDER|CHALLENGER CHAIN MARK: FOOTED|STRAINED|SLACK [-- clause]". A change
//     whose CHANGE TO or flagged line is a CHAIN MARK line applies only when both are CHAIN MARK lines of the same side. (6 gate nodes)
// (b) Judge Enforcer Build and Alt Judge Enforcer Build read each verdict as E-APPLY reads it: cureJText(raw,true), the JSON-unwrapped
//     reasoning. When the verdict does not unwrap, the old plain unescape stands. (grok 33040 S20: the flagged line kept the JSON tail '"}')
// (c) Send Back Build and Alt Send Back Build: an E-HOLD item whose enforcer says "right: BROKEN" carries the rule of ruling 421 (a break
//     of meaning on an answered witness counts only with a FORCED line) and of ruling 392 (an unanswered witness needs the quoted pressing
//     sentence and its round). It stays record-only. (chatgpt 33040 S19, S20)
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const one=(s,a,b,n)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(n+': anchor count '+k+' for '+a.slice(0,60));return s.split(a).join(b);};
// (a)
const A1="|(?:DEFENSE|CHALLENGE) STANDING\\s*:|KEYSTONE\\s*:|CLAUSE\\s*:|ANSWER CHECK\\s*:|FORCED(?:\\s*\\(\\s*Commitment\\s+\\d+\\s*\\))?\\s*:|PREMISE\\s+\\d+\\b|RULING\\b)/i;";
const B1="|(?:DEFENSE|CHALLENGE) STANDING\\s*:|KEYSTONE\\s*:|CLAUSE\\s*:|ANSWER CHECK\\s*:|FORCED(?:\\s*\\(\\s*Commitment\\s+\\d+\\s*\\))?\\s*:|PREMISE\\s+\\d+\\b|RULING\\b|(?:DEFENDER|CHALLENGER)\\s+CHAIN MARK\\s*:\\s*(?:FOOTED|STRAINED|SLACK)\\b)/i; /* pkgCM (a): the CHAIN MARK form, spec section 13 (W3 2395) */";
const A2="  if(!to||!SB_FORM.test(to)){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the CHANGE TO line has no line form the engine reads',to,lines:[o]});continue;} /* pkgCL (33025 chatgpt): the gate item names the refused line */\n";
const B2=A2+"  {const CM=/^\\s*(?:[-\\u2022]|\\d+[.)])?\\s*(DEFENDER|CHALLENGER)\\s+CHAIN MARK\\s*:/i;const ct=nrm(to).match(CM),co=nrm(o).match(CM); /* pkgCM (a): a CHAIN MARK change applies only over the same side's CHAIN MARK line (W3 2395) */\n"
 +"   if((ct||co)&&!(ct&&co&&ct[1].toUpperCase()===co[1].toUpperCase())){items.push({sid:x.sid,kind:'NOT APPLIED',why:ct&&co?'the change moves the '+co[1].toUpperCase()+' CHAIN MARK to the '+ct[1].toUpperCase()+' side (W3 2395: a CHAIN MARK change applies only over the same side\\'s CHAIN MARK line)':ct?'a CHAIN MARK line may replace only a CHAIN MARK line of the same side (W3 2395), and the flagged line is not one':'the change drops the '+co[1].toUpperCase()+' CHAIN MARK (W3 2395: a change to a CHAIN MARK line must be a CHAIN MARK line of the same side)',to,lines:[o]});continue;}}\n";
// (b)
const A3="const textOf=raw=>String(raw||'').replace(/\\\\n/g,'\\n').replace(/\\\\\"/g,'\"');\n";
const SRC=rd('pkgCM/base/Alternate_Merge_Seat.js');const {fnText}=require('../pkgGD/fn.cjs');
const cuw=(SRC.match(/\nconst cureUnwrap=[^\n]*\n/)||[])[0];if(!cuw)throw new Error('cureUnwrap not found');
const B3="// pkgCM (b) (W3 2394, 2395; run 33040 grok S20): each verdict is read as E-APPLY reads it, cureJText(raw,true) (copied from the gate nodes), so a\n"
 +"// flagged line equals the judge's line; the old plain unescape left the JSON tail '\"}' on the last line. A verdict that does not unwrap is read as before.\n"
 +fnText(SRC,'rcObjEnd')+'\n'+cuw.trim()+'\n'+fnText(SRC,'cureJText')+'\n'
 +"const textOf0=raw=>String(raw||'').replace(/\\\\n/g,'\\n').replace(/\\\\\"/g,'\"');\n"
 +"// the system's lines after the JSON object (the [AUDIT ...] block: RECOMPUTED AFTER CURE, the cure reports) stay readable, as before.\n"
 +"const textOf=raw=>{const s=String(raw||'');const t=cureJText(s,true);if(t===s)return textOf0(s);const a=s.indexOf('{');const b=a<0?-1:rcObjEnd(s,a);return String(t)+(b>0?textOf0(s.slice(b)):'');};\n";
// (c)
const A4="+items.map(i=>'ITEM '+i.sid+' ('+i.rule+(i.item?', '+cut(i.item,200):'')+'):\\nYOUR LINE: '+cut(i.line,1500)+'\\nTHE ENFORCER: '+cut(i.reason,900)).join('\\n\\n')";
const B4="+items.map(i=>'ITEM '+i.sid+' ('+i.rule+(i.item?', '+cut(i.item,200):'')+'):\\nYOUR LINE: '+cut(i.line,1500)+'\\nTHE ENFORCER: '+cut(i.reason,900)+hold421(i)).join('\\n\\n')";
const A5=" const msg='An enforcer has read some of your lines";
const B5=" // pkgCM (c) (W3 2394; run 33040 chatgpt S19, S20): an E-HOLD item that proposes BROKEN states the gate's rule for a BROKEN grade, so the\n"
 +" // send-back never asks for a grade the gate then charges. Record-only as before.\n"
 +" const hold421=i=>{if(i.rule!=='E-HOLD'||!/\\(right:\\s*BROKEN\\)/i.test(String((i.src&&i.src.cure_reason)||i.reason||'')))return '';const pm=String(i.item||'').match(/\\b(D\\d+\\s+vs\\.?\\s+C\\d+)\\b/i);const pr=pm?pm[1].replace(/\\s+vs\\.?\\s+/i,' vs '):'D<i> vs C<j>';\n"
 +"  return '\\nTHE RULE FOR A BROKEN GRADE (the gate checks it, K-G4): if the answering side answered the witness, the link can break only by meaning, and that break counts only with a FORCED line for the pair (ruling 421): FORCED: '+pr+' -- MEANS [<round>]: \"<the pressing sentence, quoted>\" -- ANSWER [<round>]: \"<the answer, quoted>\" -- FAILS: \"<the words that cannot agree, quoted>\". If the witness was left unanswered, the BROKEN line must quote the pressing sentence and name its round (ruling 392). A CHANGE TO here replaces only this line and cannot add the FORCED line.';};\n"
 +A5;
const plan={base:'live ec44727f (83ef4d98 node code; /mnt/project-files/wall2024/prewrite_glm_83ef4d98.json)',nodes:[]};fs.mkdirSync('pkgCM/patched',{recursive:true});
const put=(n,s,b)=>{fs.writeFileSync('pkgCM/patched/'+n+'.js',s);plan.nodes.push({file:n+'.js',name:n.replace(/_/g,' '),base_sha:sha(b),final_sha:sha(s)});};
for(const n of ['Gate_Build','Alt_Gate_Build','Gate_Record','Alt_Gate_Record','Alternate_Merge','Alternate_Merge_Seat']){const b=rd('pkgCM/base/'+n+'.js');put(n,one(one(b,A1,B1,n+' a1'),A2,B2,n+' a2'),b);}
for(const n of ['Judge_Enforcer_Build','Alt_Judge_Enforcer_Build']){const b=rd('pkgCM/base/'+n+'.js');put(n,one(b,A3,B3,n+' b'),b);}
for(const n of ['Send_Back_Build','Alt_Send_Back_Build']){const b=rd('pkgCM/base/'+n+'.js');put(n,one(one(b,A4,B4,n+' c1'),A5,B5,n+' c2'),b);}
fs.writeFileSync('pkgCM/plan_CM.json',JSON.stringify(plan,null,1));plan.nodes.forEach(x=>console.log(x.name,x.base_sha,'->',x.final_sha));
