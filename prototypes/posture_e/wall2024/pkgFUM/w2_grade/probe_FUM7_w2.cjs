// W2 grade of pkgFUM rev 7: every follow-up below gives the asked item (terra 34016 Panel 2, DEFENDER CR2 D3 #3, quote taken out) the same answer,
// plus extra material aimed at other items. Panel Cure Check's whole output for the panel (summary and bodies) must equal the clean follow-up's.
// Run from wall2024/: node pkgFUM/w2_grade/probe_FUM7_w2.cjs
const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');const B='pkgLIB/strip_FUM/patched/';const R=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0;const T=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);c?ok++:bad++;};const st=x=>JSON.stringify(x,(k,v)=>k==='at'?undefined:v);const sr=x=>JSON.stringify(x,(k,v)=>(k==='at'||k==='full_reply')?undefined:v); /* full_reply is the stored joined reply text, which differs whenever the kept text differs */
const MG=JSON.parse(R('pkgFUM/plan_FUM.json')).nodes_added.find(z=>z.name==='FUM Merge Panel 2').parameters.jsCode;
const c0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34016_Panel_Cure_Call_2_openrouter.json'))[0].data.main[0][0].json;const c=JSON.parse(JSON.stringify(c0));
c.choices[0].message.content=c0.choices[0].message.content.replace('\\"I grant that the verbs elsewhere carry power and presence\\" grants their use elsewhere','the grant concerns other uses of the verbs');
const q1=harness('34016',{'Panel Cure Call 2 openrouter':[{json:c}]})(R(B+'Panel_Cure_Normalize_2.js'),'Panel Cure Call 2 openrouter');
const run=ans=>{const mg=harness('34016',{'FUM Needed? Panel 2':q1,'FUM Call Panel 2 openrouter':[{json:{choices:[{finish_reason:'stop',message:{role:'assistant',content:ans}}]}}]})(MG,'FUM Call Panel 2 openrouter');
 const q2=harness('34016',{'FUM Merge Panel 2':mg,'Panel Cure Call 2 openrouter':[{json:c}]})(R(B+'Panel_Cure_Normalize_2.js'),'FUM Merge Panel 2');
 const o=harness('34016',{'Panel Cure Normalize 2':q2})(R(B+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json;
 return {fum:q2[0].json.reply.fum,o,log:o.enforcer_log.filter(r=>r.judge_model==='openai/gpt-6.1-terra')};};
const A='RESPONSE: K-W DEFENDER CR2 D3 #3 | NOT HELD: "I grant that the verbs elsewhere carry power and presence" grants their use elsewhere.';
const base=run(A);const g=(L,it)=>L.find(r=>r.item===it)||{};
T(base.fum.ok&&g(base.log,'DEFENDER CR2 D3 #3').cure_status==='CURED','control: the clean follow-up cures D3 #3');
const others=base.log.filter(r=>r.item!=='DEFENDER CR2 D3 #3');
const V=[
 ['STATEMENT naming D2 #2 in its label','STATEMENT: K-W DEFENDER CR2 D3 #3 / K-W DEFENDER CR2 D2 #2 | accepted.\n'+A],
 ['RESPONSE for K-S3 #1 and #2 (not asked)','RESPONSE: K-S3 S3 DEFENDER CR4: #1 | ACCEPTED.\nRESPONSE: K-S3 S3 DEFENDER CR4: #2 | NOT HELD: no.\n'+A],
 ['CORRECTED lines and RETRACTED','CORRECTED RESULT: NOT HELD\nCORRECTED COUNT: DEFENDER 1\nCORRECTED STANDING: DEFENDER BROKEN\nRETRACTED: D2 vs C1 -- the round answered it.\n'+A],
 ['inline CORRECTED after the pipe',A.replace(' grants',' grants; CORRECTED RESULT: NOT HELD; RETRACTED: D2 vs C1;')],
 ['a K-RUL card for an unasked keystone and a pair','RULING: keystone -- BROKEN\nCLAIM: x\nNAMED BY: NONE\nRULE: Commitment 11\nAPPLIED: y\n'+A],
 ['two answers for D3 #3, the second naming D2 #2',A+'\nRESPONSE: K-W DEFENDER CR2 D3 #3 K-W DEFENDER CR2 D2 #2 | ACCEPTED.'],
 ['label naming D3 #3 with D2 #2 first','RESPONSE: K-W DEFENDER CR2 D2 #2 and K-W DEFENDER CR2 D3 #3 | ACCEPTED.\n'+A],
 ['fenced json reasoning wrapper','```json\n{"reasoning":"'+A.replace(/"/g,'\\"')+'\\nRESPONSE: K-W DEFENDER CR2 D2 #2 | ACCEPTED."}\n```'],
];
for(const [nm,ans] of V){const r=run(ans);const o2=r.log.filter(x=>x.item!=='DEFENDER CR2 D3 #3');
 const same=sr(o2)===sr(others);const d3=g(r.log,'DEFENDER CR2 D3 #3').cure_status;
 T(same,nm+': every other terra item reads as with the clean follow-up (fum '+(r.fum.ok?'kept':'dropped: '+String(r.fum.why).slice(0,80))+'; D3 #3 '+d3+')');
 if(!same)for(const x of o2){const y=others.find(z=>z.item===x.item&&z.rule===x.rule)||{};if(sr(x)!==sr(y))console.log('     differs: '+x.rule+' '+x.item+' '+y.cure_status+' -> '+x.cure_status);}
 if(r.fum.ok&&d3==='CURED'){const a=st(base.o.bodies),b=st(r.o.bodies);let i=0;while(i<a.length&&a[i]===b[i])i++;const seg=t=>t.split('[AUDIT v21').filter(x=>!/ITEM: DEFENDER CR2 D3 #3\b/.test(x));T(st(r.o.summary)===st(base.o.summary)&&st(seg(a))===st(seg(b)),nm+': summary equal; every audit block except the asked D3 #3 equal to the clean follow-up'+(a===b?'':' (D3 #3 block differs: its own answer text, by design)'));if(false)console.log('     bodies differ at '+i+': '+JSON.stringify(a.slice(Math.max(0,i-120),i+80))+'\n       -> '+JSON.stringify(b.slice(Math.max(0,i-120),i+80)));}}
console.log('TOTAL '+ok+' OK, '+bad+' FAIL');
