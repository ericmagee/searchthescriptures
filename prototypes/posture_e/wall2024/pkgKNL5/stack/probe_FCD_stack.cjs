// pkgFCD probe on run 34108 (Panel Cure Normalize 1 / Panel Cure Check, judge luna, item K-S3 S3 DEFENDER CR4: #1). strip_FUK3 against strip_FCD.
// count_dropped is set on the Normalize output's reply as pkgFUK rev 2 C1's fallback sets it (the fallback itself was planted and passed by W3, Wall 3817).
process.chdir(require('path').resolve(__dirname,'../..'));
const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');const R=f=>fs.readFileSync(f,'utf8');
const L1='pkgLIB/strip_FUK3/patched/',L2='pkgLIB/strip_FCDKNL5/patched/';
const C0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34108_Panel_Cure_Call_1_openrouter.json'))[0].data.main[0][0].json;const T0=C0.choices[0].message.content;
const K='K-S3 S3 DEFENDER CR4: #1';const LINE=T0.split('\n').find(x=>x.startsWith('RESPONSE: '+K+' |'));if(!LINE)throw new Error('no stored line');
let ok=0,bad=0;const chk=(c,m)=>{if(c){ok++;console.log('OK   '+m);}else{bad++;console.log('FAIL '+m);}};
const call=t=>{const c=JSON.parse(JSON.stringify(C0));c.choices[0].message.content=t;return c;};
const norm=(L,text)=>harness('34108',{'Panel Cure Call 1 openrouter':[{json:call(text)}]})(R(L+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter');
const check=(L,n)=>harness('34108',{'Panel Cure Normalize 1':n})(R(L+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json;
const rep=r=>T0.replace(LINE,'RESPONSE: '+K+' | '+r);
const DROP='the follow-up CORRECTED COUNT was not kept: it changed unasked item(s): K-UNX D2';
const withDrop=n=>{const m=JSON.parse(JSON.stringify(n));m[0].json.reply.fum={ok:true,finish:null,kept:2,count_dropped:DROP};return m;};
const strip=r=>{const c={...r};delete c.at;return JSON.stringify(c);};
const luna=j=>j.enforcer_log.filter(r=>r.judge_model==='openai/gpt-6-luna');
for(const [nm,txt] of [['COUNTED',rep('COUNTED')],['stored reply',T0],['TOUCHES NO LINK',rep('TOUCHES NO LINK: it names titles, not the begetting.')]]){
 // 1 no count_dropped: every row equal
 {const a=check(L1,norm(L1,txt)),b=check(L2,norm(L2,txt));chk(a.enforcer_log.length===b.enforcer_log.length&&a.enforcer_log.every((r,i)=>strip(r)===strip(b.enforcer_log[i])),nm+', no count_dropped: all '+a.enforcer_log.length+' log rows equal');
  chk(JSON.stringify(a.bodies)===JSON.stringify(b.bodies),nm+', no count_dropped: bodies equal');}
 // 2 count_dropped set
 {const a=check(L1,withDrop(norm(L1,txt))),b=check(L2,withDrop(norm(L2,txt)));const la=luna(a),lb=luna(b);
  const ks0=lb.filter(r=>r.rule==='K-S3');const kc=ks0.filter(r=>/^answered: the close concession is counted/.test(String(r.cure_reason)));const ks=kc.length?kc:ks0;const kn=ks0.filter(r=>!ks.includes(r));const oth=lb.map((r,i)=>[r,la[i]]).filter(([r])=>r.rule!=='K-S3');
  console.log('     '+nm+': K-S3 rows '+ks.length+'; '+ks.map(r=>r.cure_status+' | '+String(r.cure_reason).slice(-150)).join(' || '));
  chk(ks.length>0&&ks.every(r=>String(r.cure_reason).endsWith('COUNT NOT WRITTEN: '+DROP)),nm+', count_dropped: every luna K-S3 row ends "COUNT NOT WRITTEN: ..."');
  chk(ks.every(r=>{const o=la.find(z=>z.rule===r.rule&&z.item===r.item&&z.seat===r.seat);const c1={...r},c0={...o};delete c1.at;delete c0.at;delete c1.cure_reason;delete c0.cure_reason;return JSON.stringify(c1)===JSON.stringify(c0)&&String(r.cure_reason).startsWith(String(o.cure_reason||''));}),nm+', count_dropped: K-S3 rows otherwise equal, reason only extended');
  chk(kn.every(r=>!/COUNT NOT WRITTEN/.test(String(r.cure_reason))),nm+', count_dropped: '+kn.length+' K-S3 rows not read COUNTED carry no note'+(kc.length?'':' (none read COUNTED, so all K-S3 rows carry it)'));
  chk(oth.every(([r,o])=>strip(r)===strip(o))&&luna(a).length===lb.length,nm+', count_dropped: '+oth.length+' other luna rows equal');
  chk(a.enforcer_log.filter(r=>r.judge_model!=='openai/gpt-6-luna').every((r,i)=>strip(r)===strip(b.enforcer_log.filter(r=>r.judge_model!=='openai/gpt-6-luna')[i])),nm+', count_dropped: other seats\' rows equal');
  chk(JSON.stringify(a.bodies)===JSON.stringify(b.bodies),nm+', count_dropped: bodies (verdicts) equal');}}
// row CHECKs (debate_enforcer_log): seat_role, cure_status, kind
{const b=check(L2,withDrop(norm(L2,rep('COUNTED'))));const bad1=b.enforcer_log.filter(r=>!['panel','reserve','alternate','single','synthesis'].includes(r.seat_role)||![null,'CURED','UNCURED'].includes(r.cure_status)||!['cure','alternate_reply','failed_reply','enforcer_check','send_back'].includes(r.kind));
 chk(bad1.length===0,'all '+b.enforcer_log.length+' rows pass the table CHECKs');fs.writeFileSync('/tmp/claude-0/fcd_rows_stack.json',JSON.stringify(b.enforcer_log.filter(r=>r.rule==='K-S3'&&r.judge_model==='openai/gpt-6-luna').concat(b.enforcer_log.filter(r=>r.rule!=='K-S3').slice(0,1))));}
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
