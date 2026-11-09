// pkgFUM test (W3 Wall 3552): replay run 34016 row 27609 (luna, Panel Cure 1) with the follow-up answered: 27621 (K-W CHALLENGER DR3 LINK 3 #3) cures;
// a reply that answers everything (terra, sol) sends no follow-up; the Haiku alternate reply (row 27957) is asked once; a failed follow-up leaves the first reply.
// Run from wall2024/: node pkgFUM/test_FUM.cjs
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const A='pkgLIB/strip_KNL/patched/',B='pkgLIB/strip_FUM/patched/';const R=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK   '+m);}else{bad++;log('FAIL '+m);}};
const st=x=>JSON.stringify(x,(k,v)=>k==='at'?undefined:v);
const KEEP=()=>{const t=R(B+'Panel_Cure_Normalize_1.js');const km=t.slice(t.indexOf('function krulMatch('),t.indexOf('\n',t.indexOf('function krulMatch(')+1));const km2=t.slice(t.indexOf('function krulMatch('),t.indexOf('const KRUL_BAD'));return new Function(km2+t.match(/function fumKey2024[\s\S]*?\n(?=\/\* pkgFUM: the kept)/)[0]+';return fumKeep2024;')();};const H=harness('34016');const MG=JSON.parse(R('pkgFUM/plan_FUM.json')).nodes_added.find(n=>n.name==='FUM Merge Panel 1').parameters.jsCode;
// 1. complete replies: no follow-up, output byte-equal to live
for(const n of [2,3]){const a=H(R(A+'Panel_Cure_Normalize_'+n+'.js'),'Panel Cure Call '+n+' openrouter'),b=H(R(B+'Panel_Cure_Normalize_'+n+'.js'),'Panel Cure Call '+n+' openrouter');
 T(st(a)===st(b)&&!b[0].json.fum,'Panel Cure Normalize '+n+' ('+b[0].json.cure.model+'): every item answered, no follow-up, output byte-equal');}
// 2. luna: the follow-up lists only what the reply left with no line
const a1=H(R(A+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter'),b1=H(R(B+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter');const F=b1[0].json.fum;
T(!!F&&st(a1[0].json.reply)===st(b1[0].json.reply)&&st(a1[0].json.cure)===st(b1[0].json.cure),'Panel Cure Normalize 1 (luna): reply and cure unchanged, follow-up built');
log('     asked: '+JSON.stringify(F&&F.asked));
T(F&&F.asked.length===1&&/^NO LINE K-W CHALLENGER DR3 LINK 3 #3: /.test(F.asked[0])&&F.items.length===1,'luna follow-up asks exactly 27621 (K-W CHALLENGER DR3 LINK 3 #3), nothing else (27622 K-RUL keystone is cured by its card since KRC, live s76)');
const src=H(R(A+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter')[0];const M0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34016_Panel_Cure_Build_1.json'))[0].data.main[0][0].json.cure.body.messages;
const M=F.body.messages;T(M.length===M0.length+2&&st(M.slice(0,M0.length))===st(M0)&&M[M0.length].role==='assistant'&&M[M0.length].content===a1[0].json.reply.text&&M[M0.length+1].role==='user','follow-up body = the same conversation + the judge\'s own reply + one user turn (model '+F.body.model+')');
log('     follow-up prompt:\n'+M[M.length-1].content.split('\n').map(l=>'       | '+l).join('\n'));
// 3. the follow-up answered (written for the test in luna's form; the flagged sentence is quoted), then Normalize run 2 and Panel Cure Check
const ans='RESPONSE: K-W CHALLENGER DR3 LINK 3 #3 | NOT HELD: the challenger writes "I drop the limb that names what Joseph knew of the cause", which withdraws one limb only; LINK 3 still stands on the record of the tribe.\nRESPONSE: K-RUL keystone | the card follows.';
const call2={id:'gen-test',choices:[{index:0,finish_reason:'stop',message:{role:'assistant',content:ans}}]};
const H2=harness('34016',{'FUM Needed? Panel 1':b1,'FUM Call Panel 1 openrouter':[{json:call2}]});const mg=H2(MG,'FUM Call Panel 1 openrouter');
T(mg[0].json.fum_done===true&&mg[0].json.fum_first&&mg[0].json.fum_first.text===a1[0].json.reply.text,'FUM Merge Panel 1 carries the first reply and the follow-up call');
const H3=harness('34016',{'FUM Merge Panel 1':mg});const n2=H3(R(B+'Panel_Cure_Normalize_1.js'),'FUM Merge Panel 1');
T(!n2[0].json.fum&&n2[0].json.reply.ok&&n2[0].json.reply.fum&&n2[0].json.reply.fum.ok&&n2[0].json.reply.fum.kept===1&&n2[0].json.reply.text===ans.split('\n')[0]+'\n\n'+a1[0].json.reply.text&&st(n2[0].json.cure)===st(a1[0].json.cure),'Normalize run 2: no second follow-up; reply = the asked item\'s line only (the unasked K-RUL line dropped), then the first reply; cure unchanged');
const chk=(n1)=>{const Hc=harness('34016',{'Panel Cure Normalize 1':n1});const o=Hc(R(B+'Panel_Cure_Check.js'),'Panel Cure Normalize 3');return o[0].json.enforcer_log.filter(r=>r.judge_model==='openai/gpt-6-luna');};
const live=chk(a1),fu=chk(n2);const g=(L,it)=>(L.find(r=>r.item===it)||{});
log('     luna live:      '+live.map(r=>r.rule+' '+r.item+' '+r.cure_status).filter(s=>!/ CURED$/.test(s)).join('; '));
log('     luna follow-up: '+fu.map(r=>r.rule+' '+r.item+' '+r.cure_status).filter(s=>!/ CURED$/.test(s)).join('; '));
T(g(live,'CHALLENGER DR3 LINK 3 #3').cure_status==='UNCURED'&&g(fu,'CHALLENGER DR3 LINK 3 #3').cure_status==='CURED','27621 K-W CHALLENGER DR3 LINK 3 #3: live UNCURED (no written response) -> CURED with the follow-up ('+g(fu,'CHALLENGER DR3 LINK 3 #3').cure_reason+')');
T(live.length===fu.length&&live.every(r=>r.item==='CHALLENGER DR3 LINK 3 #3'||r.item==='keystone'||g(fu,r.item).cure_status===r.cure_status),'every other luna item keeps its status ('+live.length+' rows)');
log('     27622 K-RUL keystone: '+g(live,'keystone').cure_status+' -> '+g(fu,'keystone').cure_status+' ('+String(g(fu,'keystone').cure_reason).slice(0,140)+')');
// 4. a failed follow-up leaves the first reply as it was
const H4=harness('34016',{'FUM Needed? Panel 1':b1});const mgE=H4(MG,'Panel Cure Normalize 1');mgE[0].json.fum_call={error:{message:'timeout'}};
const n4=harness('34016',{'FUM Merge Panel 1':mgE})(R(B+'Panel_Cure_Normalize_1.js'),'FUM Merge Panel 1');
T(n4[0].json.reply.text===a1[0].json.reply.text&&n4[0].json.reply.fum&&n4[0].json.reply.fum.ok===false&&!n4[0].json.fum,'failed follow-up: first reply read as before, nothing asked again');
// 5. Haiku alternate (row 27957): asked once
const ha=H(R(A+'Alternate_Cure_Normalize.js'),'Alternate Cure Call openrouter'),hb=H(R(B+'Alternate_Cure_Normalize.js'),'Alternate Cure Call openrouter');
T(st(ha[0].json.reply)===st(hb[0].json.reply)&&!!hb[0].json.fum,'Alternate Cure Normalize (Haiku): reply unchanged, follow-up built for '+(hb[0].json.fum?hb[0].json.fum.asked.length:0)+' item(s)');
log('     Haiku asked: '+JSON.stringify(hb[0].json.fum&&hb[0].json.fum.asked.map(s=>s.slice(0,60))));
// 6. Cure Normalize 34016: unchanged
{const a=H(R(A+'Cure_Normalize.js'),'Cure Call openrouter'),b=H(R(B+'Cure_Normalize.js'),'Cure Call openrouter');T(st(a)===st(b)||!!b[0].json.fum,'Cure Normalize 34016: '+(b[0].json.fum?'follow-up for '+b[0].json.fum.asked.length:'no follow-up, byte-equal'));}
// 7. a NOT HELD answer without the quote (terra's 34016 reply with the quote taken out of DEFENDER CR2 D3 #3): asked once for the quote, then cured
{const c0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34016_Panel_Cure_Call_2_openrouter.json'))[0].data.main[0][0].json;const c=JSON.parse(JSON.stringify(c0));
 const t0=c.choices[0].message.content,old='\\"I grant that the verbs elsewhere carry power and presence\\" grants their use elsewhere';T(t0.includes(old),'terra reply holds the quoted reason for DEFENDER CR2 D3 #3');
 c.choices[0].message.content=t0.replace(old,'the grant concerns other uses of the verbs');
 const Hq=harness('34016',{'Panel Cure Call 2 openrouter':[{json:c}]});const q1=Hq(R(B+'Panel_Cure_Normalize_2.js'),'Panel Cure Call 2 openrouter');const Fq=q1[0].json.fum;
 log('     asked: '+JSON.stringify(Fq&&Fq.asked));T(Fq&&Fq.asked.length===1&&/^NO QUOTE K-W DEFENDER CR2 D3 #3: /.test(Fq.asked[0]),'quote taken out: the follow-up asks only for DEFENDER CR2 D3 #3 (NO QUOTE)');
 log('     follow-up prompt:\n'+Fq.body.messages[Fq.body.messages.length-1].content.split('\n').map(l=>'       | '+l).join('\n'));
 const ans2='RESPONSE: K-W DEFENDER CR2 D3 #3 | NOT HELD: "I grant that the verbs elsewhere carry power and presence" grants their use elsewhere, not a withdrawal of Luke 1:35 as footing for D3.';
 const mg2=harness('34016',{'FUM Needed? Panel 2':q1,'FUM Call Panel 2 openrouter':[{json:{choices:[{finish_reason:'stop',message:{role:'assistant',content:ans2}}]}}]})(JSON.parse(R('pkgFUM/plan_FUM.json')).nodes_added.find(n=>n.name==='FUM Merge Panel 2').parameters.jsCode,'FUM Call Panel 2 openrouter');
 const q2=harness('34016',{'FUM Merge Panel 2':mg2,'Panel Cure Call 2 openrouter':[{json:c}]})(R(B+'Panel_Cure_Normalize_2.js'),'FUM Merge Panel 2');
 const ck=n2=>harness('34016',{'Panel Cure Normalize 2':n2})(R(B+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json.enforcer_log.filter(r=>r.judge_model==='openai/gpt-6.1-terra'&&r.item==='DEFENDER CR2 D3 #3');
 const before=ck(q1),after=ck(q2);T(before.length===1&&before[0].cure_status==='UNCURED'&&after.length===1&&after[0].cure_status==='CURED','DEFENDER CR2 D3 #3: UNCURED without the quote -> CURED with the follow-up ('+(after[0]||{}).cure_reason+')');}
// 8. W1 3581 case B: the follow-up answers 27621 and ALSO writes lines for an item it was not asked about (D2 #2), a RETRACTED line and a CORRECTED RESULT: all dropped
{const ansB=ans.split('\n')[0]+'\nRESPONSE: K-W DEFENDER CR2 D2 #2 | ACCEPTED: the mark is right.\nSTATEMENT: K-W DEFENDER CR2 D2 #2 | accepted.\nRETRACTED: D2 vs C1 because the round answered it.\nCORRECTED RESULT: NOT HELD\nCORRECTED COUNT: DEFENDER 3\nSome prose.';
 const HB=harness('34016',{'FUM Needed? Panel 1':b1,'FUM Call Panel 1 openrouter':[{json:{choices:[{finish_reason:'stop',message:{role:'assistant',content:ansB}}]}}]});const mB=HB(MG,'FUM Call Panel 1 openrouter');
 const nB=harness('34016',{'FUM Merge Panel 1':mB})(R(B+'Panel_Cure_Normalize_1.js'),'FUM Merge Panel 1');T(nB[0].json.reply.text===ans.split('\n')[0]+'\n\n'+a1[0].json.reply.text,'case B: only the 27621 line is kept from the follow-up');
 const cB=chk(nB);const pB=harness('34016',{'Panel Cure Normalize 1':nB})(R(B+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json,p2=harness('34016',{'Panel Cure Normalize 1':n2})(R(B+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json;
 T(g(cB,'DEFENDER CR2 D2 #2').cure_status==='CURED'&&g(cB,'CHALLENGER DR3 LINK 3 #3').cure_status==='CURED'&&st(pB.summary)===st(p2.summary)&&st(pB.bodies)===st(p2.bodies),'case B: D2 #2 keeps CURED, 27621 CURED, summary and bodies equal to the clean follow-up');}
// 9. the kept lines for an asked K-RUL item: its RESPONSE line and the card under it; a card for another subject is dropped
{const k=KEEP();
 const t='RESPONSE: K-RUL keystone | card below\nRULING -- keystone -- HELD\nCLAIM: x\nNAMED BY: "y"\nRULE: z\nAPPLIED: w\nRESPONSE: K-RUL DEFENDER premise 4 | other\nRULING -- DEFENDER premise 4 -- HELD\nRESPONSE: K-W CHALLENGER DR3 LINK 3 #33 | NOT HELD: other item';
 const o=k(t,[{rule:'K-RUL',side:'JUDGE',link:'keystone'}]);T(o===t.split('\n').slice(0,6).join('\n'),'K-RUL keystone: its RESPONSE line and five-line card kept; another K-RUL item and its card dropped; "#33" is not "#3"');
 T(k(t,[{rule:'K-W',side:'CHALLENGER',link:'CHALLENGER DR3 LINK 3 #3'}])==='','"LINK 3 #3" does not match "LINK 3 #33"');}
{const k=KEEP();
 T(k('RESPONSE: K-S3 S3 DEFENDER CR4 #1 | NOT HELD: x\nRESPONSE: K-S3 S3 DEFENDER CR4 #2 | NOT HELD: y',[{rule:'K-S3',side:'DEFENDER',link:'S3 DEFENDER CR4: #1'}])==='RESPONSE: K-S3 S3 DEFENDER CR4: #1 | NOT HELD: x','K-S3 "S3 DEFENDER CR4: #1" matches a label written without the colon (rewritten to the item\'s own label), and not #2');}
// 10. W3 3585: with only K-RUL D2 vs C2 asked, lines of other rules on the same pair, and RETRACTED/RESTATED lines, are dropped
{const k=KEEP();
 const t='RESPONSE: K-G4 D2 vs C2 | RETRACTED: the grade is withdrawn\nRESPONSE: K-G1 D2 vs C2 | CORRECTED COUNT 0\nRESPONSE: K-V D2 vs C2 | NOT HELD\nRETRACTED: D2 vs C2 because x\nRESTATED: D2 vs C2 -- HELD\nRESPONSE: K-RUL D2 vs C2 | card below\nRULING -- D2 vs C2 -- HELD\nCLAIM: a\nNAMED BY: "b"\nRULE: c\nAPPLIED: d\nSTATEMENT: K-RUL D2 vs C2 | as above';
 const o=k(t,[{rule:'K-RUL',side:'JUDGE',link:'D2 vs C2'}]);T(o===t.split('\n').slice(5).join('\n'),'K-RUL D2 vs C2 asked: K-G4, K-G1, K-V lines on the same pair and RETRACTED/RESTATED dropped; its RESPONSE, card and STATEMENT kept');
 T(k('RESPONSE: CHALLENGER DR3 LINK 3 #3 | NOT HELD: x',[{rule:'K-W',side:'CHALLENGER',link:'CHALLENGER DR3 LINK 3 #3'}])==='','a label without the item\'s rule is not read');}
// 11. W3 3588: a blank line before the card; a card with no RESPONSE line; a second card for an unasked pair after the asked card
{const k=KEEP();const Rq=[{rule:'K-RUL',side:'JUDGE',link:'D2 vs C2',ruling:'D2 vs C2'}];const card=['RULING -- D2 vs C2 -- STANDS','CLAIM: x','NAMED BY: y','RULE: z','APPLIED: w'];
 T(k(['RESPONSE: K-RUL D2 vs C2 | card below','',...card].join('\n'),Rq)===['RESPONSE: K-RUL D2 vs C2 | card below',...card].join('\n'),'3588-1: a blank line between the RESPONSE line and the card: the card is kept');
 T(k(card.join('\n'),Rq)===card.join('\n'),'3588-2: a card alone, no RESPONSE line (luna 27609 form): kept');
 T(k(['RESPONSE: K-RUL D2 vs C2 | card',...card,'RULING -- D4 vs C1 -- FALLS','CLAIM: p','NAMED BY: q','RULE: r','APPLIED: s'].join('\n'),Rq)===['RESPONSE: K-RUL D2 vs C2 | card',...card].join('\n'),'3588-3: a second card for the unasked pair D4 vs C1: dropped');
 T(k(['RULING -- D2 vs C2 -- STANDS','CLAIM: x','','NAMED BY: y','RULE: z','APPLIED: w','RESPONSE: K-G4 D2 vs C2 | x'].join('\n'),Rq)===card.join('\n'),'a blank line inside the card is skipped; the card ends at APPLIED; a K-G4 line after it is dropped');}
// 12. W3 3598 / W1 3599: the card reader's 8-line window: wrapped CLAIM, a "---" line, fields in another order; a K-G4 line inside the window is not kept
{const k=KEEP();const Rq=[{rule:'K-RUL',side:'JUDGE',link:'D2 vs C2',ruling:'D2 vs C2'}];
 T(k(['RULING -- D2 vs C2 -- STANDS','CLAIM: x and','  more of the claim','NAMED BY: y','RULE: z','APPLIED: w'].join('\n'),Rq)===['RULING -- D2 vs C2 -- STANDS','CLAIM: x and','NAMED BY: y','RULE: z','APPLIED: w'].join('\n'),'3598-1: CLAIM wrapped onto a second line: all four fields kept');
 T(k(['RULING -- D2 vs C2 -- STANDS','---','CLAIM: x','NAMED BY: y','RULE: z','APPLIED: w'].join('\n'),Rq)===['RULING -- D2 vs C2 -- STANDS','CLAIM: x','NAMED BY: y','RULE: z','APPLIED: w'].join('\n'),'3598-2: a "---" line inside the card: all fields kept');
 T(k(['RULING -- D2 vs C2 -- STANDS','RULE: z','CLAIM: x','APPLIED: w','NAMED BY: y'].join('\n'),Rq)===['RULING -- D2 vs C2 -- STANDS','RULE: z','CLAIM: x','APPLIED: w','NAMED BY: y'].join('\n'),'3599: fields in another order (APPLIED before NAMED BY): all kept');
 T(k(['RULING -- D2 vs C2 -- STANDS','CLAIM: x','RESPONSE: K-G4 D2 vs C2 | RETRACTED','NAMED BY: y','RULE: z','APPLIED: w','x','x','x','CLAIM: late'].join('\n'),Rq)===['RULING -- D2 vs C2 -- STANDS','CLAIM: x','NAMED BY: y','RULE: z','APPLIED: w'].join('\n'),'a K-G4 line inside the window is dropped; a field line past the 8-line window is dropped');
 const t=R(B+'Panel_Cure_Normalize_1.js');const kc=new Function(t.slice(t.indexOf('function krulCards('),t.indexOf('function krulMatch('))+';return krulCards;')();
 const src=['RULING -- D2 vs C2 -- STANDS','RULE: z','CLAIM: x and','  wrapped','---','APPLIED: w','NAMED BY: y'].join('\n');const c1=kc(src)[0],c2=kc(k(src,Rq))[0];T(c1&&c2&&JSON.stringify(c1.f)===JSON.stringify(c2.f)&&Object.keys(c1.f).length===4,'krulCards reads the same four fields from the kept text as from the follow-up');}
// 13. W2 3605: a grouped card or a keystone card that also names an unasked K-RUL item is not read; a card naming only the asked pair is
{const k=KEEP();const A1=[{rule:'K-RUL',side:'JUDGE',link:'D1 vs C2',ruling:'D1 vs C2'}],O1=[{rule:'K-RUL',side:'JUDGE',link:'D2 vs C2',ruling:'D2 vs C2'}];
 const card=t=>['RULING: '+t+' -- DEFENDER LINK BROKEN','CLAIM: x','NAMED BY: y','RULE: z','APPLIED: w'].join('\n');
 T(k(card('D1, D2 vs C2'),A1,O1)==='','3605-a: asked D1 vs C2, card "D1, D2 vs C2" also names the unasked D2 vs C2: not read');
 T(k(card('keystone D3 vs C1'),[{rule:'K-RUL',side:'JUDGE',link:'D3 vs C1',ruling:'D3 vs C1'}],[{rule:'K-RUL',side:'JUDGE',link:'keystone',ruling:'keystone',krul_ctx:{ks:'D3',ps:{}}}])==='','3605-b: asked D3 vs C1, card "keystone D3 vs C1" also names the unasked keystone: not read');
 T(k(card('D1 vs C2'),A1,O1)===card('D1 vs C2'),'3605-c: a card naming only the asked pair is read');
 T(k(card('D1, D2 vs C2'),A1.concat(O1),[])===card('D1, D2 vs C2'),'a grouped card is read when every K-RUL item it names was asked');}
// 14. end to end: the Merge carries fum_others, and Normalize run 2 uses them
{T(Array.isArray(b1[0].json.fum.others)&&mg[0].json.fum_others!==undefined,'fum.others built ('+b1[0].json.fum.others.length+' unasked K-RUL item(s) for luna) and carried by FUM Merge');}
// 15. W1 3608 / W2 3609: inline card for an unasked pair cut; two-item labels rewritten to the asked item only; end to end through Panel Cure Check; the guard
{const k=KEEP();const A1=[{rule:'K-RUL',side:'JUDGE',link:'D1 vs C2',ruling:'D1 vs C2'}],O1=[{rule:'K-RUL',side:'JUDGE',link:'D2 vs C2',ruling:'D2 vs C2'}];
 T(k('RESPONSE: K-RUL D1 vs C2 | RULING -- D1, D2 vs C2 -- BROKEN CLAIM: x NAMED BY: NONE RULE: r APPLIED: w',A1,O1)==='RESPONSE: K-RUL D1 vs C2 |','3608: inline grouped card naming the unasked D2 vs C2 is cut; the RESPONSE line keeps no card');
 T(k('STATEMENT: K-RUL D1 vs C2 | RULING -- D1, D2 vs C2 -- BROKEN CLAIM: x NAMED BY: NONE RULE: r APPLIED: w',A1,O1)==='STATEMENT: K-RUL D1 vs C2 |','3608: the same on a STATEMENT line');
 T(k('RESPONSE: K-RUL D1 vs C2 | RULING -- D1 vs C2 -- STANDS CLAIM: x NAMED BY: "q" RULE: r APPLIED: w',A1,O1)==='RESPONSE: K-RUL D1 vs C2 | RULING -- D1 vs C2 -- STANDS CLAIM: x NAMED BY: "q" RULE: r APPLIED: w','an inline card for the asked pair only is kept');
 const W=[{rule:'K-W',side:'DEFENDER',link:'DEFENDER CR2 D3 #3'}];
 T(k('RESPONSE: K-W DEFENDER CR2 D3 #3 / K-W DEFENDER CR2 D2 #2 | NOT HELD: q',W)==='RESPONSE: K-W DEFENDER CR2 D3 #3 | NOT HELD: q','3609-b: a two-item label is rewritten to the asked item only');
 T(k('RESPONSE: K-W DEFENDER CR2 D3 #3, K-W DEFENDER CR2 D2 #2 | ACCEPTED: q',W)==='RESPONSE: K-W DEFENDER CR2 D3 #3 | ACCEPTED: q','3609-c: the same with a comma');
 // end to end on terra 34016 with the quote taken out of D3 #3 (asked): 3b and 3c leave every other item as it was
 const c0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34016_Panel_Cure_Call_2_openrouter.json'))[0].data.main[0][0].json;const c=JSON.parse(JSON.stringify(c0));
 c.choices[0].message.content=c.choices[0].message.content.replace('\\"I grant that the verbs elsewhere carry power and presence\\" grants their use elsewhere','the grant concerns other uses of the verbs');
 const q1=harness('34016',{'Panel Cure Call 2 openrouter':[{json:c}]})(R(B+'Panel_Cure_Normalize_2.js'),'Panel Cure Call 2 openrouter');const MG2=JSON.parse(R('pkgFUM/plan_FUM.json')).nodes_added.find(n=>n.name==='FUM Merge Panel 2').parameters.jsCode;
 const run=ans=>{const mg2=harness('34016',{'FUM Needed? Panel 2':q1,'FUM Call Panel 2 openrouter':[{json:{choices:[{finish_reason:'stop',message:{role:'assistant',content:ans}}]}}]})(MG2,'FUM Call Panel 2 openrouter');
  const n=harness('34016',{'FUM Merge Panel 2':mg2,'Panel Cure Call 2 openrouter':[{json:c}]})(R(B+'Panel_Cure_Normalize_2.js'),'FUM Merge Panel 2');
  return {n,L:harness('34016',{'Panel Cure Normalize 2':n})(R(B+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json.enforcer_log.filter(r=>r.judge_model==='openai/gpt-6.1-terra')};};
 const base=harness('34016',{'Panel Cure Normalize 2':q1})(R(B+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json.enforcer_log.filter(r=>r.judge_model==='openai/gpt-6.1-terra');
 const Q='"I grant that the verbs elsewhere carry power and presence" grants their use elsewhere.';
 for(const [nm,ans] of [['3609-a control','RESPONSE: K-W DEFENDER CR2 D3 #3 | NOT HELD: '+Q],['3609-b','RESPONSE: K-W DEFENDER CR2 D3 #3 / K-W DEFENDER CR2 D2 #2 | NOT HELD: '+Q],['3609-c','RESPONSE: K-W DEFENDER CR2 D3 #3, K-W DEFENDER CR2 D2 #2 | ACCEPTED: the mark is right.']]){
  const {L}=run(ans);const other=L.filter(r=>r.item!=='DEFENDER CR2 D3 #3');T(other.length===base.filter(r=>r.item!=='DEFENDER CR2 D3 #3').length&&other.every(r=>{const b=base.find(x=>x.rule===r.rule&&x.item===r.item);return b&&b.cure_status===r.cure_status&&b.cure_reason===r.cure_reason;}),nm+': every other terra item reads exactly as without the follow-up (Panel Cure Check, '+other.length+' rows); D3 #3 '+(L.find(r=>r.item==='DEFENDER CR2 D3 #3')||{}).cure_status);}
 // guard: a follow-up that would change an unasked item is dropped whole (fumKeep bypassed by calling fumJoin with a hand-made keep)
 const t=R(B+'Panel_Cure_Normalize_2.js');const n0=q1[0].json;const src=JSON.parse(R('/mnt/project-files/wall2024/inputs/34016_Panel_Cure_Build_2.json'))[0].data.main[0][0].json.cure;
 const hk=harness('34016',{'Panel Cure Call 2 openrouter':[{json:c}]});const G=hk(t.replace(/\nreturn \$input\.all\(\)\.map\(\(it,i\)=>\{let src=null;[\s\S]*$/,"\nfumKeep2024=(t)=>t;return [{json:{f:fumJoin2024}}];"),'Panel Cure Call 2 openrouter')[0].json.f;
 const bad=G(n0.reply,{ok:true,text:'RESPONSE: K-W DEFENDER CR2 D3 #3 | NOT HELD: '+Q+'\nRESPONSE: K-W DEFENDER CR2 D2 #2 | ACCEPTED: x'},[{rule:'K-W',side:'DEFENDER',link:'DEFENDER CR2 D3 #3'}],[],src);
 T(bad.text===n0.reply.text&&bad.fum&&bad.fum.ok===false&&/unasked/.test(bad.fum.why),'guard: with the line filter switched off, a follow-up that would change the unasked D2 #2 is dropped whole ('+(bad.fum&&bad.fum.why||'kept '+(bad.fum&&bad.fum.kept))+')');}
log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgFUM/test_FUM.txt',out.join('\n')+'\n');
