// W2 plants for pkgFCD on 34108 luna (same harness as probe_FCD). strip_FUK3 vs strip_FCD.
process.chdir(require('path').resolve(__dirname,'../..'));
const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');const R=f=>fs.readFileSync(f,'utf8');
const L1='pkgLIB/strip_FUK3/patched/',L2='pkgLIB/strip_FCDKNL5/patched/';
const C0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34108_Panel_Cure_Call_1_openrouter.json'))[0].data.main[0][0].json;const T0=C0.choices[0].message.content;
const K='K-S3 S3 DEFENDER CR4: #1';const LINE=T0.split('\n').find(x=>x.startsWith('RESPONSE: '+K+' |'));
let ok=0,bad=0;const chk=(c,m)=>{if(c){ok++;console.log('OK   '+m);}else{bad++;console.log('FAIL '+m);}};
const call=t=>{const c=JSON.parse(JSON.stringify(C0));c.choices[0].message.content=t;return c;};
const norm=(L,t)=>harness('34108',{'Panel Cure Call 1 openrouter':[{json:call(t)}]})(R(L+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter');
const check=(L,n)=>harness('34108',{'Panel Cure Normalize 1':n})(R(L+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json;
const setD=(n,d)=>{const m=JSON.parse(JSON.stringify(n));m[0].json.reply.fum={ok:true,finish:null,kept:2,count_dropped:d};return m;};
const strip=r=>{const c={...r};delete c.at;return JSON.stringify(c);};
const eqAll=(a,b)=>a.enforcer_log.length===b.enforcer_log.length&&a.enforcer_log.every((r,i)=>strip(r)===strip(b.enforcer_log[i]))&&JSON.stringify(a.bodies)===JSON.stringify(b.bodies);
const txt=T0.replace(LINE,'RESPONSE: '+K+' | COUNTED');
// P1/P2: falsy count_dropped ('' and null, 0) changes nothing
for(const d of ['',null,0]){const a=check(L1,setD(norm(L1,txt),d)),b=check(L2,setD(norm(L2,txt),d));chk(eqAll(a,b),'P1 count_dropped='+JSON.stringify(d)+': every row and body equal to FUK3');}
// P3: fum present without count_dropped key
{const f=n=>{const m=JSON.parse(JSON.stringify(n));m[0].json.reply.fum={ok:true,finish:null,kept:2};return m;};chk(eqAll(check(L1,f(norm(L1,txt))),check(L2,f(norm(L2,txt)))),'P3 fum with no count_dropped key: all equal');}
// P4: hostile reason text (quotes, newline, pipe, 600 chars) only extends the COUNTED K-S3 row; rows pass the table CHECKs
const D="it changed \"unasked\" item(s): K-UNX D2 |\nsecond line "+'x'.repeat(600);
{const a=check(L1,setD(norm(L1,txt),D)),b=check(L2,setD(norm(L2,txt),D));const ch=b.enforcer_log.filter((r,i)=>strip(r)!==strip(a.enforcer_log[i]));
 chk(ch.length>0&&ch.every(r=>r.rule==='K-S3'&&r.judge_model==='openai/gpt-6-luna'&&String(r.cure_reason).endsWith('COUNT NOT WRITTEN: '+D)),'P4 hostile reason: '+ch.length+' changed row(s), all luna K-S3, reason ends with the text unaltered');
 chk(JSON.stringify(a.bodies)===JSON.stringify(b.bodies),'P4 bodies (verdicts) equal');
 chk(b.enforcer_log.every(r=>['panel','reserve','alternate','single','synthesis'].includes(r.seat_role)&&[null,'CURED','UNCURED'].includes(r.cure_status)&&['cure','alternate_reply','failed_reply','enforcer_check','send_back'].includes(r.kind)),'P4 all '+b.enforcer_log.length+' rows pass the table CHECKs');
 fs.writeFileSync('/tmp/claude-0/w2_rows_stack.json',JSON.stringify(ch.map(r=>({...r,run_token:'W2-ROLLBACK-TEST-FCD'}))));}
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
