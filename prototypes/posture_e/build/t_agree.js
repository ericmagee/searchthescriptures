const fs=require('fs');
const runNode=(name,store,input,dir)=>{const c=fs.readFileSync((dir? dir: (fs.existsSync('new/'+name+'.js')?'new':'add'))+'/'+name+'.js','utf8');
 const $=n=>{if(!(n in store))return {isExecuted:false,first(){throw new Error('no '+n)},all(){throw new Error('no '+n)}};const v=store[n];return {isExecuted:true,first:()=>({json:v[0]}),all:()=>v.map(j=>({json:j}))};};
 const $input={first:()=>({json:input[0]}),all:()=>input.map(j=>({json:j}))};const $execution={id:'99999',customData:{set(){}}};
 return new Function('$','$input','$execution',c)($,$input,$execution).map(x=>x.json);};
let pass=0,fail=0;const ok=(c,m)=>{if(c){pass++;console.log('PASS',m)}else{fail++;console.log('FAIL',m)}};
const rows=JSON.parse(fs.readFileSync('models.json','utf8'));
const body={topic:'Did Christ have a biological father?',defender:{engine:'claude',profile:'plain'},challenger:{engine:'opus',profile:'oracle'}};
const store={'Debate Start':[{body}]};
// Accept Build
const ab=runNode('Accept Build',store,rows);store['Accept Build']=ab;
ok(ab.length===6&&ab.every(x=>x.acc.fam==='openrouter'),'Accept Build: 6 openrouter seats '+ab.map(x=>x.acc.seat).join(','));
ok(ab[0].ds&&ab[0].ds.seat==='deepseek'&&ab[0].ds.body.model==='deepseek-flash','Accept Build: DeepSeek routed to its own API');
const prompt=ab[0].acc.body.messages[0].content;
ok(/Commitment 3\. Meaning, not words\./.test(prompt)&&!/its own words state the contrary/.test(prompt),'acceptance prompt carries the approved Commitment 3 and not sentence (B)');
ok(!/ruling \d+|DG-\d+/.test(prompt),'acceptance prompt carries no ruling or guard numbers');
const heads=[...prompt.matchAll(/^### (Commitment \d\. [^\n]+)$/gm)].map(m=>m[1]);
const good=heads.map((h,i)=>h+'\nI hold to this, line '+(i+1)+'.').join('\n')+'\nI ACCEPT THIS POSTURE AND WILL BE HELD TO IT.';
const fault=heads.slice(0,5).map(h=>h+'\nok').join('\n')+'\nI ACCEPT THIS POSTURE AND WILL BE HELD TO IT.';
const refuse='I cannot accept this posture.';
const R=s=>({choices:[{message:{content:s},finish_reason:'stop'}],model:'m'});
// replies: gemini good, glm good, chatgpt fault, mimo refuse, grok good, sol good; deepseek good
const reps={gemini:good,glm:good,chatgpt:fault,mimo:refuse,grok:good,sol:good};
store['Accept Call openrouter']=ab.map(x=>R(reps[x.acc.seat]));
store['Accept DS Build']=runNode('Accept DS Build',store,[{}]);ok(store['Accept DS Build'][0].acc&&!store['Accept DS Build'][0].skip,'Accept DS Build builds the DeepSeek call');
store['Accept Call deepseek']=[R(good)];
const ac=runNode('Accept Check',store,[{}]);store['Accept Check']=ac;
const st=Object.fromEntries(ac[0].acc.seats.map(s=>[s.seat,s.first.status]));
ok(st.gemini==='ACCEPT'&&st.deepseek==='ACCEPT'&&st.chatgpt==='FAULT'&&st.mimo==='REFUSE','Accept Check statuses '+JSON.stringify(st));
const arb=runNode('Accept Return Build',store,[{}]);store['Accept Return Build']=arb;
ok(arb.length===1&&arb[0].acc.seat==='chatgpt','Accept Return Build returns chatgpt only');
ok(/POSTURE RETURNED/.test(arb[0].acc.body.messages[2].content)&&/heading 6 missing/.test(arb[0].acc.body.messages[2].content),'the return names the fault');
const adr=runNode('Accept DS Return Build',store,[{}]);ok(adr[0].skip===true,'no DeepSeek return when DeepSeek accepted');store['Accept DS Return Build']=adr;
// chatgpt fails again on return -> FAULT_RECORDED -> not placed
store['Accept Return Call openrouter']=[R(fault)];
const af=runNode('Accept Final',store,[{}]);store['Accept Final']=af;
const fs2=Object.fromEntries(af[0].acc.seats.map(s=>[s.seat,s.status+(s.placed?'+':'-')]));
ok(fs2.chatgpt==='FAULT_RECORDED-'&&fs2.mimo==='REFUSE-'&&fs2.gemini==='ACCEPT+'&&fs2.deepseek==='ACCEPT+','Accept Final '+JSON.stringify(fs2));
ok(af[0].src&&af[0].src.body&&af[0].src.body.topic===body.topic,'Accept Final carries the request on to Init Seats');
// Init Seats
const is=runNode('Init Seats',{},[af[0]]);const S=is[0];
ok(S.panel_order.join(',')==='gemini,glm,grok','panel = first three that accepted: '+S.panel_order.join(','));
ok(S.panel_order.indexOf('chatgpt')<0&&S.panel_order.indexOf('mimo')<0&&S.panel_reserve!=='mimo'&&S.alt_order.indexOf('mimo')<0&&S.alt_order.indexOf('chatgpt')<0,'refused seats are nowhere: reserve '+S.panel_reserve+', alternates '+S.alt_order.join(','));
ok(S.single_judge==='deepseek'&&S.posture===true&&S.agreement_out.join(',')==='chatgpt,mimo','single judge deepseek, posture on, out: '+S.agreement_out.join(','));
// base Init Seats would have put chatgpt and mimo on
const isb=runNode('Init Seats',{},[{body}],'base')[0];ok(isb.panel_order.join(',')==='gemini,glm,chatgpt','base panel was '+isb.panel_order.join(','));
// not enough judges
const af2=JSON.parse(JSON.stringify(af[0]));af2.acc.seats.forEach(s=>{if(['glm','grok','sol'].includes(s.seat)){s.placed=false;s.status='REFUSE';}});
let err='';try{runNode('Init Seats',{},[af2]);}catch(e){err=e.message;}ok(/NOT GRADED/.test(err)&&/did not accept the posture/.test(err),'too few accept: '+err.slice(0,160));
// no agreement at all
err='';try{runNode('Init Seats',{},[{body}]);}catch(e){err=e.message;}ok(/agreement did not run/.test(err),'no agreement: refused');
fs.writeFileSync('af_fixture.json',JSON.stringify(af[0]));
console.log(pass,'pass',fail,'fail');
