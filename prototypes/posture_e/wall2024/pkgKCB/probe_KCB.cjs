// pkgKCB probe (W3) on run 34108 (Panel Cure Normalize 1 / Panel Cure Check, judge luna, item K-S3 S3 DEFENDER CR4: #1). Base strip_KCB_base (FUK rev 3 + FCD + KNL rev 5) against strip_KCB.
process.chdir(require('path').resolve(__dirname,'..'));
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const R=f=>fs.readFileSync(f,'utf8');
const L1='pkgLIB/strip_KCB_base/patched/',L2='pkgLIB/strip_KCB/patched/';
const C0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34108_Panel_Cure_Call_1_openrouter.json'))[0].data.main[0][0].json;const T0=C0.choices[0].message.content;
const K='K-S3 S3 DEFENDER CR4: #1';const LINE=T0.split('\n').find(x=>x.startsWith('RESPONSE: '+K+' |'));if(!LINE)throw new Error('no stored line');
let ok=0,bad=0;const chk=(c,m)=>{if(c){ok++;console.log('OK   '+m);}else{bad++;console.log('FAIL '+m);}};
const call=t=>{const c=JSON.parse(JSON.stringify(C0));c.choices[0].message.content=t;return c;};
const norm=(L,text)=>harness('34108',{'Panel Cure Call 1 openrouter':[{json:call(text)}]})(R(L+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter');
const second=(L,first,fol)=>harness('34108',{'FUM Merge Panel 1':[{json:{fum_done:true,fum_asked:first.fum.asked,fum_items:first.fum.items,fum_others:first.fum.others||[],fum_first:first.fum.first,fum_call:call(fol)}}]})(R(L+'Panel_Cure_Normalize_1.js'),'FUM Merge Panel 1');
const check=(L,n)=>harness('34108',{'Panel Cure Normalize 1':n})(R(L+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json;
const row=(L,n)=>check(L,n).enforcer_log.find(r=>r.judge_model==='openai/gpt-6-luna'&&r.rule==='K-S3'&&/#1/.test(r.item));
const rep=r=>T0.replace(LINE,'RESPONSE: '+K+' | '+r);const strip=r=>{const c={...r};delete c.at;return JSON.stringify(c);};
// 1. the gap and its near forms: base CURED, candidate UNCURED
const GAP=['COUNTED, but that is wrong.','COUNTED. That is not right.','COUNTED. However, the count stays as written.','COUNTED; I refuse to add it.','COUNTED: under protest.','COUNTED. I object to this item.','COUNTED, although it grants only titles.','COUNTED. This is an error of the engine.','COUNTED: I retract nothing.','COUNTED. I disagree with the item.','COUNTED, yet the link stands.','COUNTED. It is not a concession.','COUNTED. The sentence does not apply to D6.','COUNTED, unless the titles are excluded.','COUNTED: wrongly asked.','COUNTED. I DO NOT ACCEPT THIS.','COUNTED. It isn’t correct.'];
for(const r of GAP){const a=row(L1,norm(L1,rep(r))),b=row(L2,norm(L2,rep(r)));chk(a.cure_status==='CURED'&&b.cure_status==='UNCURED','gap "'+r+'": base '+a.cure_status+', candidate '+b.cure_status);}
// 2. answers that stay CURED (pkgFUK rev 3's accepted table, and plain reasons)
const KEEPC=['COUNTED','COUNTED.','**COUNTED**','"COUNTED"','COUNTED. I do not dispute it.','COUNTED, and the count is corrected below.','COUNTED: the defender gave up D6 in [DR3].','COUNTED -- the close round grants it.','COUNTED. No objection.','COUNTED. My count did not include this grant; corrected to 5.','COUNTED: it concedes the premise of D2, as the flagged sentence says.','COUNTED. I don’t contest it.'];
for(const r of KEEPC){const a=row(L1,norm(L1,rep(r))),b=row(L2,norm(L2,rep(r)));chk(a.cure_status==='CURED'&&b.cure_status==='CURED'&&strip(a)===strip(b),'stays CURED "'+r+'", row equal to the base');}
// 3. answers pkgFUK rev 3 already refuses stay UNCURED, row equal
for(const r of ['NOT COUNTED, it is not a concession.','This cannot be COUNTED.','COUNTED is wrong here.','Counted.','COUNTED: it is not a concession of any link.','COUNTED (under protest; I do not agree)','COUNTED? No.','COUNTED - refused','UNCOUNTED']){const a=row(L1,norm(L1,rep(r))),b=row(L2,norm(L2,rep(r)));chk(a.cure_status==='UNCURED'&&strip(a)===strip(b),'stays UNCURED "'+r+'", row equal to the base');}
// 4. other forms untouched: TOUCHES NO LINK and the stored reply, whole Check output
for(const [nm,t] of [['stored reply',T0],['TOUCHES NO LINK',rep('TOUCHES NO LINK: it grants the legal titles, but not a declared link or premise.')],['NOT HELD',rep('NOT HELD: however read, it grants no link.')]]){const a=check(L1,norm(L1,t)),b=check(L2,norm(L2,t));chk(a.enforcer_log.length===b.enforcer_log.length&&a.enforcer_log.every((r,i)=>strip(r)===strip(b.enforcer_log[i]))&&JSON.stringify(a.bodies)===JSON.stringify(b.bodies),nm+': all '+a.enforcer_log.length+' log rows and the bodies equal the base');}
// 5. the refused answer is asked once, as NO REASON; a bare COUNTED in the follow-up cures it; the same refusal in the follow-up leaves it UNCURED with no second ask
{const n=norm(L2,rep(GAP[0]));const f=n[0].json.fum;chk(f&&f.asked.length===1&&f.asked[0].startsWith('NO REASON '+K),'"'+GAP[0]+'" is asked once, as NO REASON'+(f?' ('+f.asked.join(' ; ').slice(0,60)+')':''));
 const n0=norm(L1,rep(GAP[0]));chk(!n0[0].json.fum,'base: no follow-up for it (read CURED)');
 if(f){const s1=second(L2,n[0].json,'RESPONSE: '+K+' | COUNTED\nCORRECTED COUNT: DEFENDER 1');chk(!s1[0].json.fum&&row(L2,s1).cure_status==='CURED','follow-up answer COUNTED with its count: CURED, no second ask');
  const s2=second(L2,n[0].json,'RESPONSE: '+K+' | '+GAP[0]);chk(!s2[0].json.fum&&row(L2,s2).cure_status==='UNCURED','the same refusal in the follow-up: UNCURED, no second ask');}}
// 6. only the K-S3 #1 row differs in the whole Check output for a gap answer; rows pass the table CHECKs
{const a=check(L1,norm(L1,rep(GAP[0]))),b=check(L2,norm(L2,rep(GAP[0])));const d=a.enforcer_log.filter((r,i)=>strip(r)!==strip(b.enforcer_log[i]));chk(a.enforcer_log.length===b.enforcer_log.length&&d.length===1&&d[0].rule==='K-S3','gap answer: '+a.enforcer_log.length+' rows, only the K-S3 #1 row differs');
 const bad1=b.enforcer_log.filter(r=>!['panel','reserve','alternate','single','synthesis'].includes(r.seat_role)||![null,'CURED','UNCURED'].includes(r.cure_status)||!['cure','alternate_reply','failed_reply','enforcer_check','send_back'].includes(r.kind));chk(bad1.length===0,'all rows pass the table CHECKs');
 const k=row(L2,norm(L2,rep(GAP[0])));console.log('     row: '+k.cure_status+' | '+k.cure_reason+' | response_line '+k.response_line);fs.writeFileSync(__dirname+'/kcb_row.json',JSON.stringify(k));}
// 7. files: 26 changed, each by the one K-S3 line
{let ch=0,one=0;for(const f of fs.readdirSync(L1)){const x=R(L1+f).split('\n'),y=R(L2+f).split('\n');const d=x.map((l,i)=>l!==y[i]?i:-1).filter(i=>i>=0);if(x.length!==y.length||d.length){ch++;if(x.length===y.length&&d.length===1&&y[d[0]].includes('pkgKCB'))one++;}}chk(ch===26&&one===26,ch+' files differ from the base, '+one+' by the one K-S3 line');}
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
