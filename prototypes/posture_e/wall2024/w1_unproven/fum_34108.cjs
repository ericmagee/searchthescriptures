// W1 (coordinator ask 22:56Z 11-09): pkgFUM on run 34108's stored text, live library (s87 = strip_VP1_s84), planted cases. Run from wall2024/.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const L='pkgLIB/strip_VP1_s84/patched/';const R=f=>fs.readFileSync(f,'utf8');
const FB=(j=>j.data||j.workflow||j)(JSON.parse(R('/mnt/project-files/wall2024/fetchback_live_s87.json')));const MG=FB.nodes.find(n=>n.name==='FUM Merge Panel 1').parameters.jsCode;
const N1=R(L+'Panel_Cure_Normalize_1.js'),PCC=R(L+'Panel_Cure_Check.js');
const C0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34108_Panel_Cure_Call_1_openrouter.json'))[0].data.main[0][0].json;const T0=C0.choices[0].message.content;
let ok=0,bad=0;const T=(c,m,i)=>{console.log((c?'OK   ':'FAIL ')+m+(i?' :: '+i:''));c?ok++:bad++;};const I=m=>console.log('     '+m);
const withReply=t=>{const c=JSON.parse(JSON.stringify(C0));c.choices[0].message.content=t;return [{json:c}];};
const norm=t=>harness('34108',{'Panel Cure Call 1 openrouter':withReply(t)})(N1,'Panel Cure Call 1 openrouter');
const status=n1=>{const o=harness('34108',{'Panel Cure Normalize 1':n1})(PCC,'Panel Cure Normalize 3');const rows=o[0].json.enforcer_log.filter(r=>r.judge_model==='openai/gpt-6-luna'&&r.kind==='cure');return Object.fromEntries(rows.map(r=>[r.rule+' '+r.item,r.cure_status]));};
const lineOf=k=>T0.split('\n').find(l=>l.startsWith('RESPONSE: '+k+' |'));
const asked=n=>{const f=n[0].json.fum;return f?f.asked.map(s=>s.slice(0,70)):null;};
const follow=(n1,ans,fail)=>{const H=harness('34108',{'FUM Needed? Panel 1':n1,'FUM Call Panel 1 openrouter':[{json:fail?{error:{message:'timeout'}}:{id:'t',choices:[{index:0,finish_reason:'stop',message:{role:'assistant',content:ans}}]}}]});const mg=H(MG,'FUM Call Panel 1 openrouter');if(fail)mg[0].json.fum_call={error:{message:'timeout'}};return harness('34108',{'FUM Merge Panel 1':mg})(N1,'FUM Merge Panel 1');};
const S0=status(norm(T0));
// 0. the stored reply
const n0=norm(T0);T(!n0[0].json.fum,'0 34108 luna as stored: no follow-up (FUM did not fire in 34108; the stored FUM Needed? nodes took the false branch)');
// 1. NO LINE
const k6='K-W DEFENDER CR3 LINK 1 #6';const t1=T0.replace(lineOf(k6)+'\n','');const n1=norm(t1);const S1=status(n1);
T(JSON.stringify(asked(n1))!=='null'&&asked(n1).length===1&&/^NO LINE K-W DEFENDER CR3 LINK 1 #6/.test(asked(n1)[0]),'1 CATCH: a K-W line left out: the follow-up asks for it alone (NO LINE)',JSON.stringify(asked(n1)));
I('without a follow-up answer it reads '+S1['K-W DEFENDER CR3 LINK 1 #6']+' (stored reply: '+S0['K-W DEFENDER CR3 LINK 1 #6']+')');
const f1=follow(n1,lineOf(k6));const SF=status(f1);
T(!f1[0].json.fum&&SF['K-W DEFENDER CR3 LINK 1 #6']==='CURED'&&Object.keys(S0).every(k=>SF[k]===S0[k]),'1b the follow-up answered: that item CURED, every other luna item as stored, no second ask');
const f1x=follow(n1,'',true);T(status(f1x)['K-W DEFENDER CR3 LINK 1 #6']===S1['K-W DEFENDER CR3 LINK 1 #6']&&!f1x[0].json.fum,'1c the follow-up call fails: the first reply is read as before, nothing asked again');
const f1n=follow(n1,'I have nothing to add.');T(!f1n[0].json.fum&&status(f1n)['K-W DEFENDER CR3 LINK 1 #6']==='UNCURED','1d the follow-up again gives no line: UNCURED, and no second follow-up (asked once)',status(f1n)['K-W DEFENDER CR3 LINK 1 #6']);
// 2. NO QUOTE
const k7='K-W DEFENDER CR3 LINK 1 #7';const l7=lineOf(k7);const t2=T0.replace(l7,'RESPONSE: '+k7+' | NOT HELD: the defender accepts legal standing but does not withdraw the link’s source and timing claims.');const n2=norm(t2);
T(asked(n2)&&asked(n2).length===1&&/^NO QUOTE K-W DEFENDER CR3 LINK 1 #7/.test(asked(n2)[0]),'2 CATCH: a K-W NOT HELD reason with the quote taken out: asked for the quote (NO QUOTE)',JSON.stringify(asked(n2)));
// 3. probes of the edges
const t3=T0.replace(l7,'RESPONSE: '+k7+' | NOT HELD: “I grant the legal” accepts legal standing but does not withdraw the link.');const n3=norm(t3);I('3 PROBE a three-word fragment of the flagged sentence as the quote: '+(asked(n3)?'asked '+JSON.stringify(asked(n3)):'not asked')+'; status '+status(n3)[k7]);
const t4=T0.replace(l7,'RESPONSE: '+k7+' | NOT HELD: “I grant that this is the taking, so 1:18 dates the finding before it” shows the link is kept.');const n4=norm(t4);I('4 PROBE the reason quotes a different sentence of the same round (item #6’s): '+(asked(n4)?'asked '+JSON.stringify(asked(n4)):'not asked')+'; status '+status(n4)[k7]);
const k8='K-W DEFENDER CR3 LINK 1 #8';const t5=T0.replace(lineOf(k8),lineOf(k8).replace('RESPONSE: '+k8+' |','RESPONSE '+k8+' -'));const n5=norm(t5);I('5 PROBE a malformed line (no colon, dash for bar): '+(asked(n5)?'asked '+JSON.stringify(asked(n5)):'not asked')+'; status '+status(n5)[k8]);
const kS='K-S D6 vs C5';const t6=T0.replace(lineOf(kS)+'\n','');const n6=norm(t6);I('6 PROBE a K-S line left out (rule outside K-W/K-CON/K-S3): '+(asked(n6)?'asked '+JSON.stringify(asked(n6)):'not asked')+'; status '+status(n6)['K-S D6 vs C5']);
const kC='K-C D6 vs C5';const t7=T0.replace(lineOf(kC),'RESPONSE: '+kC+' | NOT HELD: the restated line is fine.');const n7=norm(t7);I('7 PROBE a K-C NOT HELD with no quote and no reason of substance: '+(asked(n7)?'asked':'not asked')+' (by design only K-W, K-CON, K-S3 are asked for a quote); status '+status(n7)[kC]);
const k3='K-S3 S3 DEFENDER CR4: #1';const t8=T0.replace(lineOf(k3),'RESPONSE: '+k3+' | TOUCHES NO LINK: it grants titles only.');const n8=norm(t8);I('8 PROBE a K-S3 TOUCHES NO LINK answer with no quote (only NOT HELD is asked for a quote): '+(asked(n8)?'asked':'not asked')+'; status '+status(n8)[k3]);
console.log('\nfum_34108: '+ok+' OK, '+bad+' FAIL');
