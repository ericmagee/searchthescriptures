// pkgKSCL test. Run from wall2024/ after build_KSCL.cjs: node pkgKSCL/test_KSCL.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const rd=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(rd('pkgKSCL/plan_KSCL.json'));const F=n=>n.replace(/ /g,'_')+'.js';
T('5 KSC nodes; shas match',plan.nodes.length===5&&plan.nodes.every(p=>sha(rd('pkgKSCL/base/'+F(p.node)))===p.base_sha&&sha(rd('pkgKSCL/patched/'+F(p.node)))===p.final_sha));
const ksc=s=>{const a=s.indexOf('const KSC=(()=>{');const e=s.indexOf('})();',a);return new Function(s.slice(a,e+5)+';return KSC;')();};
const K=plan.nodes.map(p=>[ksc(rd('pkgKSCL/base/'+F(p.node))),ksc(rd('pkgKSCL/patched/'+F(p.node)))]);
T('base LIVE false, patched LIVE true, in all 5',K.every(([a,b])=>a.LIVE===false&&b.LIVE===true));
T('the diff of each node is the one LIVE word',plan.nodes.every(p=>rd('pkgKSCL/patched/'+F(p.node))===rd('pkgKSCL/base/'+F(p.node)).replace('const LIVE=false;','const LIVE=true;')));
const it={ksc:{n:6,tag:'UNEXHIBITED',via:'LINK 6',pmap:{}}};const [a,b]=K[0];
T('the send-back note says ENFORCED, not TRIAL',/ENFORCED/.test(b.note({n:6,tag:'UNEXHIBITED',via:'LINK 6'}))&&!/TRIAL/.test(b.note({n:6,tag:'UNEXHIBITED',via:'LINK 6'}))&&/TRIAL/.test(a.note({n:6,tag:'UNEXHIBITED',via:'LINK 6'})));
T('cure reasons drop "; TRIAL"; cure decisions unchanged',b.cure(it,{ans:'KEEP'}).status==='UNCURED'&&!/TRIAL/.test(b.cure(it,{ans:'KEEP'}).why)&&b.cure(it,{ans:'CHANGE',to:'KEYSTONE: D6 -- WITHDRAWN -- x'}).status==='CURED');
const sbr=rd('pkgKSCL/patched/Send_Back_Record.js');T('Send Back Record counts an uncured E-KSC item in drv_uncured when LIVE',sbr.includes('if(KSC.LIVE){p.drv_uncured=(p.drv_uncured||0)+its.length;'));
console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
