// W1 regrade of pkgVP3 rev 2: planted true cases through the whole Send Back Record node (run 33798, terra, E-ANS Job 14:1 [CR3]).
// A true case: the defender's only answer to Job 14:1 from [CR3] on is the bare grant, and the judge keeps MEETS without reading any answer.
process.chdir(__dirname+'/..');const fs=require('fs');const H=require('../harness.cjs');
const P=JSON.parse(fs.readFileSync('parent_s90_VP3.json','utf8'));const code=P.nodes.find(n=>n.name==='Send Back Record').parameters.jsCode;
let L=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s90.json','utf8'));L=L.data||L;L=L.workflow||L;const live=L.nodes.find(n=>n.name==='Send Back Record').parameters.jsCode;
const cl=x=>JSON.parse(JSON.stringify(x));const RUN='33798';
const PCN=H.out(RUN,'Panel Cure Normalize 1'),CALL=H.out(RUN,'Send Back Call openrouter');
const R0=PCN.flat()[0].json.cure.rounds;
// planted rounds: the defender says nothing else of Job 14:1 from [CR3] on
const R1=Object.assign({},R0,{CR3:R0.CR3.replace(' (Job 14:1)',''),CR4:R0.CR4.split('\n').filter(l=>!/Job 14:1/.test(l)).join('\n')});
const left=['CR3','CR4'].map(k=>R1[k].split('\n').filter(l=>/Job 14:1/.test(l)));
const pcn=R=>{const m=cl(PCN);m.forEach(a=>a&&a.forEach(it=>{if(it&&it.json&&it.json.cure&&it.json.cure.rounds)it.json.cure.rounds=R;}));return m;};
const T0=CALL.flat()[2].json.choices[0].message.content;const a=T0.indexOf('SENDBACK: S3 ||'),b=T0.indexOf('\\nSENDBACK: S4');if(a<0||b<a)throw new Error('terra S3 anchor');
const call=line=>{const m=cl(CALL);const it=m.flat()[2];it.json.choices[0].message.content=T0.slice(0,a)+line+T0.slice(b);return m;};
let ok=0,bad=0;const chk=(c,s)=>{if(c){ok++;console.log('OK   '+s);}else{bad++;console.log('FAIL '+s);}};
const row=async(src,R,line)=>{const o=await H.run(src,RUN,'Send Back Call openrouter',{'Panel Cure Normalize 1':pcn(R),'Send Back Call openrouter':line?call(line):CALL});const r=o[0].json.sb_rows.find(r=>r.seat==='chatgpt'&&/Job 14:1/.test(r.item));return {r,v:o[0].json.sendback.vp3_trial,note:String(r.cure_reason).slice(String(r.cure_reason).indexOf('TRIAL pkgVP3'))};};
(async()=>{
 console.log('planted rounds: lines naming Job 14:1 left in [CR3]/[CR4]: '+JSON.stringify(left));
 chk(left[0].length===1&&/I grant it is said of all men\.$/.test(left[0][0])&&left[1].length===0,'planted rounds: the only line naming Job 14:1 from [CR3] on is the bare grant');
 const K1='SENDBACK: S3 || KEEP || The grant of the phrase is enough for MEETS.';
 // 1 true case: KEEP with no answer read
 {const {r,v,note}=await row(code,R1,K1);console.log('     '+r.cure_status+' | '+note.slice(0,260));chk(r.cure_status==='UNCURED','1 live cure reading of the planted KEEP is UNCURED');chk(/TWO READERS AGREE on Job 14:1/.test(note)&&/WOULD REMOVE chatgpt/.test(note),'1 TRUE CASE LISTED: WOULD REMOVE chatgpt');chk(v&&v.would_remove&&JSON.stringify(v.would_remove.chatgpt||[]).includes('Job 14:1'),'1 vp3_trial.would_remove names chatgpt Job 14:1');
  const {r:r0}=await row(live,R1,K1);chk(r0.cure_status===r.cure_status&&String(r.cure_reason).startsWith(String(r0.cure_reason)),'1 the row is live s90 plus the note only');}
 // 2 true case: CHANGE TO MEETS quoting only the bare grant
 {const {r,note}=await row(code,R1,'SENDBACK: S3 || CHANGE TO: ANSWER CHECK: Job 14:1 -- [CR3] -- MEANS: "the phrase is said of all men" -- ANSWER: "I grant it is said of all men." -- MEETS -- The grant meets it. || The defender grants it.');console.log('     '+r.cure_status+' | '+note.slice(0,260));chk(r.cure_status==='UNCURED'?/WOULD REMOVE chatgpt/.test(note):/not listed/.test(note),'2 CHANGE TO MEETS on the bare grant: listed when the live reading is UNCURED (live: '+r.cure_status+')');}
 // 3 the judge cures: CHANGE TO MISSES
 {const {note}=await row(code,R1,'SENDBACK: S3 || CHANGE TO: ANSWER CHECK: Job 14:1 -- [CR3] -- MEANS: "the phrase is said of all men" -- ANSWER: "I grant it is said of all men." -- MISSES -- a bare grant. || The answer is only a grant.');chk(/CURED by the reply/.test(note)&&!/WOULD REMOVE/.test(note),'3 CHANGE TO MISSES: cured, not listed');}
 // 4 KEEP quoting the bare grant itself
 {const {r,note}=await row(code,R1,'SENDBACK: S3 || KEEP || [CR3] says, "I grant it is said of all men."');console.log('     '+r.cure_status+' | '+note.slice(0,260));chk(true,'4 KEEP quoting only the bare grant: live reading '+r.cure_status+', '+(/WOULD REMOVE/.test(note)?'listed':'not listed'));}
 // 5 control: stored rounds (the defender names Job 14:1 again), same KEEP: not listed
 {const {note}=await row(code,R0,K1);chk(/code check does not agree/.test(note),'5 stored rounds with the planted KEEP: code does not agree, not listed');}
 // 6 control: the stored reply on planted rounds (terra's CHANGE TO MEETS citing [CR2], read CURED live): not listed
 {const {r,note}=await row(code,R1,null);chk(!/WOULD REMOVE/.test(note),'6 stored reply on planted rounds: not listed (live '+r.cure_status+')');}
 console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);})();
