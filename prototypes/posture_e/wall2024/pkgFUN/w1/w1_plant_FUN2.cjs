// W1 own plants on pkgFUN rev 2 (beyond W3's table): legitimate COUNTED answers whose reason describes the concession in words on pkgKCB's lists (34108 luna, K-S3 S3 DEFENDER CR4: #1).
process.chdir(require('path').resolve(__dirname,'../..'));
const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');const R=f=>fs.readFileSync(f,'utf8');
const L1='pkgLIB/strip_KCB_base/patched/',L2='pkgLIB/strip_FUN2/patched/';
const C0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34108_Panel_Cure_Call_1_openrouter.json'))[0].data.main[0][0].json;const T0=C0.choices[0].message.content;
const K='K-S3 S3 DEFENDER CR4: #1';const LINE=T0.split('\n').find(x=>x.startsWith('RESPONSE: '+K+' |'));
const call=t=>{const c=JSON.parse(JSON.stringify(C0));c.choices[0].message.content=t;return c;};
const norm=(L,text)=>harness('34108',{'Panel Cure Call 1 openrouter':[{json:call(text)}]})(R(L+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter');
const check=(L,n)=>harness('34108',{'Panel Cure Normalize 1':n})(R(L+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json;
const row=(L,n)=>check(L,n).enforcer_log.find(r=>r.judge_model==='openai/gpt-6-luna'&&r.rule==='K-S3'&&/#1/.test(r.item));
const rep=r=>T0.replace(LINE,'RESPONSE: '+K+' | '+r);
const A=["COUNTED: in [DR2] he wrote \"I do not accept the title\" and now he grants it.","COUNTED. The defender said D6 does not apply to Joseph; this grant gives D6 up.","COUNTED: the challenger showed the defender's reading is wrong, and the defender granted it.","COUNTED. He conceded it, which is not a mere courtesy.","COUNTED; the grant should not be read as courtesy.","COUNTED. Before the close the defender would not concede it.","COUNTED: it is a concession, not a courtesy.","COUNTED, and it was wrongly left out of my first count.","COUNTED: the defender cannot hold D6 and this grant together.","COUNTED. I could not count it before the close; now I do."];
let n=0;for(const a of A){const b=row(L1,norm(L1,rep(a))),c=row(L2,norm(L2,rep(a)));const f=norm(L2,rep(a))[0].json.fum;console.log((b.cure_status!==c.cure_status?'CHANGED ':'same    ')+b.cure_status+' -> '+c.cure_status+(f?' (asked: '+f.asked.length+')':'')+' | '+a);if(b.cure_status!==c.cure_status)n++;}
console.log(n+' of '+A.length+' changed from live');
