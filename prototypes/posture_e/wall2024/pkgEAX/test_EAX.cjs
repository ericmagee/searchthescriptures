// pkgEAX tests on run 33389 (Build: pkgEID; Record base pkgEID vs pkgEAX LIVE/TRIAL) plus lib controls.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const rf=f=>fs.readFileSync(f,'utf8');let ok=0,bad=0;const T=(n,c)=>{console.log((c?'OK   ':'FAIL ')+n);c?ok++:bad++;};
const {eaxHold}=new Function(rf('pkgEAX/eax_lib.js')+';return {eaxHold};')();
const RR={DR3:'**ANSWER: Acts 1:1 -- D1 --** "x"\n- [L1] I grant the coming of the wind.\n\n**ANSWER: Acts 2:2 -- D1 --** "y"\n- [L1] Acts 2:2.\n- [L2] word G1 is "z".\n- [L3] Acts 3:3 says "w".\n- [L4] I grant the wind came first. So the house fits the sign of the link.'};
T('lib: a truly bare grant (one tag, no fit sentence) is sent',eaxHold('The answer only says "I grant the coming of the wind," giving no fit.','ANSWER CHECK Acts 1:1 [DR3]',RR)===null);
T('lib: a layered grant with a fit sentence is held',!!eaxHold('The answer only grants that "I grant the wind came first," giving no fit.','ANSWER CHECK Acts 2:2 [DR3]',RR));
T('lib: a reason that is not grant-worded is never held',eaxHold('The answer names the wrong verse "the wind came first".','ANSWER CHECK Acts 2:2 [DR3]',RR)===null);
T('lib: quoted words not found and no own answer block for the verse -> not held',eaxHold('The answer only says "nothing like this appears anywhere," giving no fit.','ANSWER CHECK Acts 9:9 [DR3]',RR)===null);
T('lib: a reason naming another defect (omits the press) is not held',eaxHold('The answer only says "I grant the wind came first," and omits the pressed words.','ANSWER CHECK Acts 2:2 [DR3]',RR)===null);
T('lib: the item\'s own ANSWER block (3+ tags) decides when the quote sits elsewhere',/own answer block/.test(eaxHold('The answer only says "something not in the round at all," giving no fit.','ANSWER CHECK Acts 2:2 [DR3]',RR)||''));
T('lib: a withdrawal claim is not held',eaxHold('The answer is only a withdrawal: "I grant the wind came first."','ANSWER CHECK Acts 2:2 [DR3]',RR)===null);
T('lib: wrong round named -> not held',eaxHold('The answer only grants that "I grant the wind came first," giving no fit.','ANSWER CHECK Acts 2:2 [CR3]',RR)===null);
const b=harness('33389')(rf('pkgEAI/patched_on_pkgEID/Judge_Enforcer_Build.js'),'Enforcer Record');const S=harness('33389',{'Judge Enforcer Build':b.map(j=>({json:j.json||j}))});
const B0=S(rf('pkgEAI/patched_on_pkgEID/Judge_Enforcer_Record.js'),'Judge Enforcer Call deepseek')[0].json,L=S(rf('pkgEAX/patched_live/Judge_Enforcer_Record.js'),'Judge Enforcer Call deepseek')[0].json,TR=S(rf('pkgEAX/patched/Judge_Enforcer_Record.js'),'Judge Enforcer Call deepseek')[0].json;
const ch=B0.enf428_rows.map((r,k)=>[r,L.enf428_rows[k]]).filter(([r,q])=>r.cure_reason!==q.cure_reason);
ch.forEach(([r,q])=>console.log('     HELD '+q.seat+' '+q.item));
T('33389 LIVE: the 5 false grant pushes pkgEAI leaves are held (1 Chronicles 28:6 [CR4] x2, Matthew 1:21 [CR4] and [DR3], sol Matthew 1:18 [DR3])',ch.length===5&&ch.every(([r,q])=>/^ENFORCER DISAGREE \(right: MISSES\)/.test(r.cure_reason)&&/^ENFORCER HELD \(pkgEAX, not sent;/.test(q.cure_reason)));
const left=L.enf428_rows.filter(r=>r.rule==='E-ANS'&&/^ENFORCER DISAGREE \(right: MISSES\)/.test(r.cure_reason)).map(r=>r.item);
T('33389 LIVE: the 3 arguable pushes are still sent (Matthew 11:11, Galatians 4:4, Job 14:1)',left.length===3&&['Matthew 11:11','Galatians 4:4','Job 14:1'].every(v=>left.some(i=>i.includes(v))));
T('33389 LIVE: no other row changes',B0.enf428_rows.length===L.enf428_rows.length&&B0.enf428_rows.every((r,k)=>JSON.stringify(r)===JSON.stringify(L.enf428_rows[k])||(r.cure_reason!==L.enf428_rows[k].cure_reason&&JSON.stringify({...r,cure_reason:0})===JSON.stringify({...L.enf428_rows[k],cure_reason:0}))));
const sbf=/^ENFORCER (?:DISAGREE|NO ANSWER)\b/;T('33389 LIVE: held rows fail the send-back filter',ch.every(([r,q])=>!sbf.test(q.cure_reason)));
const tch=B0.enf428_rows.map((r,k)=>[r,TR.enf428_rows[k]]).filter(([r,q])=>r.cure_reason!==q.cure_reason);
T('33389 TRIAL: the same 5 rows get only the TRIAL mark and are still sent',tch.length===5&&tch.every(([r,q])=>q.cure_reason.startsWith(r.cure_reason+' (TRIAL pkgEAX: would not be sent:')&&sbf.test(q.cure_reason)));
{const tenF=['1 Chronicles 28:6 [CR4]','Hebrews 7:10 [DR3]','Ezra 2:61 [DR3]','Matthew 1:18 [DR3]','Luke 1:31 [DR3]','Luke 2:48 [CR4]','Matthew 1:21 [CR4]','Matthew 1:21 [DR3]'];const sent=L.enf428_rows.filter(r=>r.rule==='E-ANS'&&/^ENFORCER DISAGREE \(right: MISSES\)/.test(r.cure_reason));
 T('33389 pkgEAI + pkgEAX: all 10 false pushes held; only the 3 arguable are sent',sent.length===3&&!sent.some(r=>tenF.some(v=>r.item.endsWith(v))));}
console.log(ok+' OK, '+bad+' FAIL');
