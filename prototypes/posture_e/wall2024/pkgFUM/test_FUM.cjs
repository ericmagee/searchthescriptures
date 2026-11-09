// pkgFUM test (W3 Wall 3552): replay run 34016 row 27609 (luna, Panel Cure 1) with the follow-up answered: 27621 (K-W CHALLENGER DR3 LINK 3 #3) cures;
// a reply that answers everything (terra, sol) sends no follow-up; the Haiku alternate reply (row 27957) is asked once; a failed follow-up leaves the first reply.
// Run from wall2024/: node pkgFUM/test_FUM.cjs
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const A='pkgLIB/strip_WLG/patched/',B='pkgLIB/strip_FUM/patched/';const R=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK   '+m);}else{bad++;log('FAIL '+m);}};
const st=x=>JSON.stringify(x,(k,v)=>k==='at'?undefined:v);
const H=harness('34016');const MG=JSON.parse(R('pkgFUM/plan_FUM.json')).nodes_added.find(n=>n.name==='FUM Merge Panel 1').parameters.jsCode;
// 1. complete replies: no follow-up, output byte-equal to live
for(const n of [2,3]){const a=H(R(A+'Panel_Cure_Normalize_'+n+'.js'),'Panel Cure Call '+n+' openrouter'),b=H(R(B+'Panel_Cure_Normalize_'+n+'.js'),'Panel Cure Call '+n+' openrouter');
 T(st(a)===st(b)&&!b[0].json.fum,'Panel Cure Normalize '+n+' ('+b[0].json.cure.model+'): every item answered, no follow-up, output byte-equal');}
// 2. luna: the follow-up lists only what the reply left with no line
const a1=H(R(A+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter'),b1=H(R(B+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter');const F=b1[0].json.fum;
T(!!F&&st(a1[0].json.reply)===st(b1[0].json.reply)&&st(a1[0].json.cure)===st(b1[0].json.cure),'Panel Cure Normalize 1 (luna): reply and cure unchanged, follow-up built');
log('     asked: '+JSON.stringify(F&&F.asked));
T(F&&F.asked.length===2&&/^NO LINE K-W CHALLENGER DR3 LINK 3 #3: /.test(F.asked[0])&&/^NO LINE K-RUL keystone: /.test(F.asked[1]),'luna follow-up asks exactly 27621 (K-W CHALLENGER DR3 LINK 3 #3) and 27622 (K-RUL keystone), nothing else');
const src=H(R(A+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter')[0];const M0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34016_Panel_Cure_Build_1.json'))[0].data.main[0][0].json.cure.body.messages;
const M=F.body.messages;T(M.length===M0.length+2&&st(M.slice(0,M0.length))===st(M0)&&M[M0.length].role==='assistant'&&M[M0.length].content===a1[0].json.reply.text&&M[M0.length+1].role==='user','follow-up body = the same conversation + the judge\'s own reply + one user turn (model '+F.body.model+')');
log('     follow-up prompt:\n'+M[M.length-1].content.split('\n').map(l=>'       | '+l).join('\n'));
// 3. the follow-up answered (written for the test in luna's form; the flagged sentence is quoted), then Normalize run 2 and Panel Cure Check
const ans='RESPONSE: K-W CHALLENGER DR3 LINK 3 #3 | NOT HELD: the challenger writes "I drop the limb that names what Joseph knew of the cause", which withdraws one limb only; LINK 3 still stands on the record of the tribe.\nRESPONSE: K-RUL keystone | the card follows.';
const call2={id:'gen-test',choices:[{index:0,finish_reason:'stop',message:{role:'assistant',content:ans}}]};
const H2=harness('34016',{'FUM Needed? Panel 1':b1,'FUM Call Panel 1 openrouter':[{json:call2}]});const mg=H2(MG,'FUM Call Panel 1 openrouter');
T(mg[0].json.fum_done===true&&mg[0].json.fum_first&&mg[0].json.fum_first.text===a1[0].json.reply.text,'FUM Merge Panel 1 carries the first reply and the follow-up call');
const H3=harness('34016',{'FUM Merge Panel 1':mg});const n2=H3(R(B+'Panel_Cure_Normalize_1.js'),'FUM Merge Panel 1');
T(!n2[0].json.fum&&n2[0].json.reply.ok&&n2[0].json.reply.fum&&n2[0].json.reply.fum.ok&&n2[0].json.reply.text.startsWith(ans)&&n2[0].json.reply.text.endsWith(a1[0].json.reply.text)&&st(n2[0].json.cure)===st(a1[0].json.cure),'Normalize run 2: no second follow-up; reply = follow-up then first reply; cure unchanged');
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
log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgFUM/test_FUM.txt',out.join('\n')+'\n');
