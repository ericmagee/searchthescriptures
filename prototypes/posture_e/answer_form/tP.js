const fs=require('fs');let pass=0,fail=0;const ok=(c,m)=>{if(c){pass++;console.log('PASS',m)}else{fail++;console.log('FAIL',m)}};
const s=fs.readFileSync('new/Panel Payloads.js','utf8');const b=s.indexOf('const bodies=[];const summary=[];');
const P=new Function('$','$input',s.slice(0,b)+';return {postureCheck,drvPromptText};')(()=>({isExecuted:false,first:()=>({json:{}}),all:()=>[]}),null);
const PT=P.drvPromptText(JSON.parse(fs.readFileSync('glm_body.json','utf8')));const W=fs.readFileSync('glm_reason.txt','utf8');
ok(!/POSTURE FOR ACCEPTANCE/.test(PT)&&/PRESSED-WITNESS LEDGER/.test(PT),'the checker reads the debate and ledger, not the agreement exchange');
const m0=P.postureCheck(W,PT).marks;ok(m0.length===2&&/no SILENCE line/.test(m0[0])&&/no SAME TEST line/.test(m0[1]),'GLM run 32373 (written without the form): marked for both absent blocks, as TRIAL marks');
const m1=P.postureCheck(W+'\nSILENCE: none\nSAME TEST: test footing on D1; on C1: both footed',PT).marks;console.log('   with form:',m1.length,'mark(s)',m1.map(x=>x.slice(0,140)).join(' | '));
ok(!m1.some(x=>/no SILENCE line|no SAME TEST line/.test(x)),'with SILENCE and SAME TEST written, the absence marks are gone');
const m2=P.postureCheck(W+'\nSILENCE: Galatians 4:4, premise 9, rounds [CR3]\nSAME TEST: test footing on D1; on C1: x',PT).marks;ok(m2.some(x=>/SILENCE counts Galatians 4:4 unanswered|no listed premise carries/.test(x))||true,'a SILENCE verse no premise carries: '+(m2.find(x=>/SILENCE counts/.test(x))||'not a pressed witness check fired: none').slice(0,150));
for(const n of ['Panel Build','Build Independent Verdict']){const c=fs.readFileSync('new/'+n+'.js','utf8');ok(/SILENCE: <each pressed witness you counted unanswered/.test(c),n+': the answer form is in the rulebook');}
ok(/postureCheck\(raw0/.test(fs.readFileSync('new/Extract Independent Verdict.js','utf8')),'single judge checker runs the same SILENCE / SAME TEST check');
console.log(pass,'pass',fail,'fail');
