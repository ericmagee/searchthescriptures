// pkgFUK rev 2 probe on run 34108 (Panel Cure Normalize 1 / Panel Cure Check, judge luna, item K-S3 S3 DEFENDER CR4: #1). strip_FUK (rev 1) against strip_FUK2.
process.chdir(require('path').resolve(__dirname,'..'));
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const R=f=>fs.readFileSync(f,'utf8');
const L1='pkgLIB/strip_FUK/patched/',L2='pkgLIB/strip_FUK2/patched/';
const C0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34108_Panel_Cure_Call_1_openrouter.json'))[0].data.main[0][0].json;const T0=C0.choices[0].message.content;
const K='K-S3 S3 DEFENDER CR4: #1';const LINE=T0.split('\n').find(x=>x.startsWith('RESPONSE: '+K+' |'));if(!LINE)throw new Error('no stored line');
let ok=0,bad=0;const chk=(c,m)=>{if(c){ok++;console.log('OK   '+m);}else{bad++;console.log('FAIL '+m);}};
const call=t=>{const c=JSON.parse(JSON.stringify(C0));c.choices[0].message.content=t;return c;};
const norm=(L,text)=>harness('34108',{'Panel Cure Call 1 openrouter':[{json:call(text)}]})(R(L+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter');
const second=(L,first,fol)=>harness('34108',{'FUM Merge Panel 1':[{json:{fum_done:true,fum_asked:first.fum.asked,fum_items:first.fum.items,fum_others:first.fum.others||[],fum_first:first.fum.first,fum_call:call(fol)}}]})(R(L+'Panel_Cure_Normalize_1.js'),'FUM Merge Panel 1');
const check=(L,n)=>harness('34108',{'Panel Cure Normalize 1':n})(R(L+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json;
const row=(L,n)=>check(L,n).enforcer_log.find(r=>r.judge_model==='openai/gpt-6-luna'&&r.rule==='K-S3'&&/#1/.test(r.item));
const lunaIdx=j=>j.summary.findIndex(s=>/luna/.test(JSON.stringify(s.api_model||s.seat||s)));
const rep=r=>T0.replace(LINE,'RESPONSE: '+K+' | '+r);
// A
for(const [r,w1,w2] of [['NOT COUNTED, it is not a concession.','CURED','UNCURED'],['It is not to be COUNTED.','CURED','UNCURED'],["COUNTED isn't right; it grants titles.",'CURED','CURED'],['COUNTED','CURED','CURED'],['COUNTED. I do not dispute it.','CURED','CURED']]){
 const a=row(L1,norm(L1,rep(r))),b=row(L2,norm(L2,rep(r)));chk(a.cure_status===w1&&b.cure_status===w2,'A "'+r+'": rev 1 '+a.cure_status+', rev 2 '+b.cure_status);}
{const n=norm(L2,rep('NOT COUNTED, it is not a concession.'));chk(n[0].json.fum&&n[0].json.fum.asked.length===1&&n[0].json.fum.asked[0].startsWith('NO REASON '+K),'A rev 2: NOT COUNTED is asked once, as NO REASON');}
// B
const nb=norm(L2,T0.replace(LINE,'RESPONSE: '+K+' |'));{const n1=norm(L1,T0.replace(LINE,'RESPONSE: '+K+' |'));chk(!n1[0].json.fum,'B rev 1: nothing after the bar, no follow-up (the gap)');}
chk(nb[0].json.fum&&nb[0].json.fum.asked.length===1&&nb[0].json.fum.asked[0].startsWith('NO ANSWER '+K),'B rev 2: asked alone, as NO ANSWER ('+(nb[0].json.fum&&nb[0].json.fum.asked.join(' ; '))+')');
{const P=nb[0].json.fum.body.messages.slice(-1)[0].content;chk(/Items whose RESPONSE line has nothing after the bar \(1\):/.test(P),'B rev 2: prompt section present');console.log('---- B prompt ----\n'+P+'\n------------------');}
chk(norm(L2,T0.replace(LINE,'RESPONSE: '+K+' |   '))[0].json.fum,'B rev 2: trailing spaces after the bar are asked too');
{const n=second(L2,nb[0].json,'RESPONSE: '+K+' | TOUCHES NO LINK: it grants the legal titles husband and wife, not a declared link or listed premise.');chk(!n[0].json.fum&&row(L2,n).cure_status==='CURED','B rev 2: a full follow-up answer cures it, no second ask');}
{const n=second(L2,nb[0].json,'RESPONSE: '+K+' |');chk(!n[0].json.fum&&row(L2,n).cure_status==='UNCURED','B rev 2: an empty follow-up stays UNCURED, no second ask');}
{const n=norm(L2,T0.replace(LINE,'RESPONSE: '+K+' | x'));chk(!(n[0].json.fum&&n[0].json.fum.asked.some(a=>a.startsWith('NO ANSWER'))),'B rev 2: a line with text after the bar is not NO ANSWER');}
// C1 follow-up keeps the corrected count; C2 it is written
const na=norm(L2,rep('TOUCHES NO LINK: titles.'));chk(na[0].json.fum&&na[0].json.fum.asked[0].startsWith('NO REASON'),'C setup: short reason asked');
{const fol='RESPONSE: '+K+' | COUNTED\nCORRECTED COUNT: DEFENDER 4\nCORRECTED COUNT: CHALLENGER 9';
 const n1=second(L1,{fum:norm(L1,rep('TOUCHES NO LINK: titles.'))[0].json.fum},fol),n2=second(L2,na[0].json,fol);
 chk(n1[0].json.reply.fum.kept===1,'C1 rev 1: only the RESPONSE line kept (the gap)');chk(n2[0].json.reply.fum.kept===2&&/CORRECTED COUNT: DEFENDER 4/.test(n2[0].json.reply.text)&&!/CHALLENGER 9/.test(n2[0].json.reply.text),'C1 rev 2: the asked side\'s CORRECTED COUNT kept, the other side\'s not');
 chk(row(L2,n2).cure_status==='CURED','C1 rev 2: the item reads CURED (COUNTED)');
 const j1=check(L1,n1),j2=check(L2,n2);const i1=lunaIdx(j1),i2=lunaIdx(j2);console.log('     luna idx',i1,i2,'rev1 cs',JSON.stringify(j1.summary[i1].corrected_standing),'rev2 cs',JSON.stringify(j2.summary[i2].corrected_standing));
 chk(!j1.summary[i1].corrected_standing&&j2.summary[i2].corrected_standing&&j2.summary[i2].corrected_standing.DEFENDER&&j2.summary[i2].corrected_standing.DEFENDER.n===4,'C2 rev 2: the corrected count DEFENDER 4 is written for luna (rev 1 writes none)');
 const pb=JSON.parse(j2.bodies[i2]).payload;chk(/CORRECTED STANDING -- SEAT: [^;]*; SIDE: DEFENDER/.test(pb.verdict_raw),'C2 rev 2: the CORRECTED STANDING audit line is in luna\'s verdict_raw');}
// C2 in a first reply
{const t=rep('COUNTED')+'\nCORRECTED COUNT: DEFENDER 4';const j1=check(L1,norm(L1,t)),j2=check(L2,norm(L2,t));const i=lunaIdx(j2);chk(!j1.summary[i].corrected_standing&&j2.summary[i].corrected_standing&&j2.summary[i].corrected_standing.DEFENDER.n===4,'C2 first reply: COUNTED with CORRECTED COUNT: DEFENDER 4 is written in rev 2, not in rev 1');}
// C1 the first reply's count of the side is replaced
{const t=rep('TOUCHES NO LINK: titles.')+'\nCORRECTED COUNT: DEFENDER 7';const f=norm(L2,t);const n=second(L2,f[0].json,'RESPONSE: '+K+' | COUNTED\nCORRECTED COUNT: DEFENDER 4');const tx=n[0].json.reply.text;chk(/DEFENDER 4/.test(tx)&&!/DEFENDER 7/.test(tx),'C1: the follow-up count replaces the first reply\'s count of the side');}
// stored reply: byte-equal rev 1 vs rev 2
{const a=JSON.stringify(harness('34108',{})(R(L1+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter')),b=JSON.stringify(harness('34108',{})(R(L2+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter'));chk(a===b,'stored 34108 reply: Normalize output byte-equal');
 const c=JSON.stringify(harness('34108',{})(R(L1+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')),d=JSON.stringify(harness('34108',{})(R(L2+'Panel_Cure_Check.js'),'Panel Cure Normalize 3'));chk(c===d,'stored 34108: Panel Cure Check output byte-equal');}
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
