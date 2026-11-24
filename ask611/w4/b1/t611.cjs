// ASK 611 T1/T2 (W4): old (live ff7ab4cf) against new (target) on run 42234's and 42071's stored rows. No n8n call.
// Checks: every request body sent is byte-equal (md5), the readers' outputs are equal, the child input piece is equal; sizes before and after.
const fs=require('fs');const crypto=require('crypto');const md5=s=>crypto.createHash('md5').update(s).digest('hex');
const OLD=require('/mnt/project-files/ask601/w4/b1/base_eng.json'),NEW=require(__dirname+'/target_engine_611.json');
const code=(W,n)=>W.nodes.find(x=>x.name===n).parameters.jsCode;const par=(W,n)=>W.nodes.find(x=>x.name===n).parameters;
const mk$=(W,nodes)=>n=>{const it=nodes[n];const ex=it!==undefined;return {isExecuted:ex,params:{jsCode:n==='Shared Library'?code(W,'Shared Library'):''},first:()=>{if(!ex)throw new Error('stub missing: '+n);return {json:it[0]};},all:()=>(it||[]).map(json=>({json})),item:{json:(it||[{}])[0]}};};
const run=async(W,n,nodes,input)=>{const $=mk$(W,nodes);const $execution={id:'4242',customData:{set(){}}};const $input={all:()=>(input||[{}]).map(json=>({json})),first:()=>({json:(input||[{}])[0]})};
 const r=await new Function('$','$input','$execution','return (async()=>{\n'+code(W,n)+'\n})();')($,$input,$execution);return r.map(x=>x.json);};
const expr=(s,$,$json)=>{const body=s.replace(/^=\{\{\s*/,'').replace(/\s*\}\}$/,'');return new Function('$','$json','$execution','return ('+body+');')($,$json,{id:'4242'});};
let fails=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fails++;};
(async()=>{for(const file of ['row_42234.json','row_42071.json']){
 const row=JSON.parse(fs.readFileSync('/mnt/project-files/aar/w4/m42234/data/'+file,'utf8'))[0];console.log('=== '+row.run_token);
 const S={run_token:row.run_token,topic:row.topic,defender:{engine:row.defender_engine,profile:row.defender_profile},challenger:{engine:row.challenger_engine,profile:row.challenger_profile},panel_expected:row.panel_expected.slice().sort(),dpos:'',cpos:'',dry:true,posture:false,question_trial:true};
 const JUD=[['sol','openai/gpt-6.1-sol'],['sol62','openai/gpt-6.2-sol'],['spark','meta/muse-spark-1.3']].map(([seat,api_model])=>({seat,api_model,fam:'openrouter',max_tokens:64000}));
 const RS={judges:JUD,gt:'',tt:'',enforcer:{api_model:'openai/gpt-6-luna',max_tokens:64000}};
 const base={'Shared Library':[{}],'Init Seats':[S],'Resolve Seats':[RS],'Regrade Row':[row],'Regrade Judgments':[],'Regrade Served Conclusions':[],'Regrade Served Sights':[]};
 base['Regrade Load']=await run(OLD,'Regrade Load',base);
 const PB=(await run(OLD,'Panel Build',base))[0];base['Panel Build']=[PB];
 // QR Merge output, old and new form, built with QR Merge's own qrAdd text (as the target's QRA) on a question-round text.
 const TXT='=== QUESTION ROUND ===\nQ1 sol to DEFENDER: "x" -- why?\nA: because.\n=== END QUESTION ROUND ===';
 const QM=code(OLD,'QR Merge');const QRAT=QM.match(/const QR_AT='[^']*';/)[0];const h='function qrAdd(body,TXT){';const a=QM.indexOf(h);let d=0,i=a+h.length-1;for(;i<QM.length;i++){if(QM[i]==='{')d++;else if(QM[i]==='}'){d--;if(d===0)break;}}
 const qrAdd=new Function(QRAT+'\nreturn '+QM.slice(a,i+1)+';')();
 const Mold={qr_ok:true,run_token:S.run_token,judges:PB.judges.map(j=>({...j,body:qrAdd(j.body,TXT)})),qa:[],record:{},qa_text:TXT,skips:[]};
 const Mnew={...Mold,judges:PB.judges.map(j=>{qrAdd(j.body,TXT);const o={...j};delete o.body;return o;})};
 // (1) the reader snippet, in each form
 const snip=(W,M)=>{const c=code(W,'Panel Check');const s=c.indexOf('const P=((__p)=>');const e=c.indexOf("($('Panel Build')",s);return new Function('$','return '+c.slice(s+8,e)+';')(mk$(W,{...base,'QR Merge':[M]}))(PB);};
 const r1o=snip(OLD,Mold),r1n=snip(NEW,Mnew);ok(JSON.stringify(r1o)===JSON.stringify(r1n),'readers: Panel Build as QR-merged, old = new (md5 '+md5(JSON.stringify(r1n)).slice(0,8)+')');
 const lpx=require('/mnt/project-files/ask588/w4/build/libpatch.js');for(const k of ['Panel Payloads','Alternate Build','Panel Cure Build 1','Gate Build']){const so=lpx.src(OLD,k),sn=lpx.src(NEW,k);ok(so.split('{judges:__m.judges,qa588').length-1===sn.split('__m.judges.map((j,i)=>').length-1&&sn.indexOf('{judges:__m.judges,qa588')<0,'Library key '+k+' carries the rebuild at every site');}
 // (1c) Alternate Pass Call: the "Panel Build" piece of the child input
 const apc=W=>{const s=par(W,'Alternate Pass Call').workflowInputs.value.pass;const a=s.indexOf('"Panel Build": (');const b=s.indexOf(', "Panel Check":',a);return expr('={{ '+s.slice(a+15,b)+' }}',mk$(W,{...base,'QR Merge':[W===OLD?Mold:Mnew]}),{});};
 const co=JSON.stringify(apc(OLD)),cn=JSON.stringify(apc(NEW));ok(co===cn,'child input "Panel Build" piece old = new (md5 '+md5(cn).slice(0,8)+', '+cn.length+' chars)');
 // (2) Prep + Parallel: the three bodies posted
 const pp=async(W,M)=>{const nodes={...base,'QR Merge':[M]};const items=await run(W,'Panel Judges Prep',nodes);const j=par(W,'Panel Judges Parallel').jsonBody;return items.map(it=>{const o=j==='={{ $json }}'?it:expr(j,mk$(W,nodes),it);const x={...o};delete x.ppj_nonce;delete x.ppj_t0;return {sent:JSON.stringify(x),item:JSON.stringify(it).length};});};
 const po=await pp(OLD,Mold),pn=await pp(NEW,Mnew);po.forEach((x,k)=>ok(x.sent===pn[k].sent,'judge '+(k+1)+' request posted old = new (md5 '+md5(pn[k].sent).slice(0,8)+', '+pn[k].sent.length+' chars)'));
 // QR not run (question_trial false or QR Merge absent): Prep falls back to Panel Build bodies the same way
 {const b2={...base,'Init Seats':[{...S,question_trial:false}]};const f=async W=>{const it=await run(W,'Panel Judges Prep',b2);const j=par(W,'Panel Judges Parallel').jsonBody;return it.map(x=>{const o=j==='={{ $json }}'?x:expr(j,mk$(W,b2),x);const y={...o};delete y.ppj_nonce;delete y.ppj_t0;return JSON.stringify(y);});};const a1=await f(OLD),a2=await f(NEW);ok(a1.join('|')===a2.join('|'),'no question round: posted requests old = new');}
 // (3)(4) close enforcer: Build, Batch Build, Batch Call bodies, Retry, Record prompts
 const ACX={acx_skip:false,body:{model:'x',messages:[{role:'system',content:'S'},{role:'user',content:'ASSUME CHECK'}]},prem:[],presses:[],model:'x',run_token:S.run_token};
 const close=async W=>{const nodes={...base};nodes['Close Enforcer Build']=await run(W,'Close Enforcer Build',nodes);nodes['Assume Check Build']=[ACX];const BB=await run(W,'Close Group Batch Build',nodes);nodes['Close Group Batch Build']=BB;
  const j=par(W,'Close Group Batch Call openrouter').jsonBody;const sent=BB.map(it=>JSON.stringify(j==='={{ $json.body }}'?it.body:expr(j,mk$(W,nodes),it)));
  const errs=BB.map(()=>({error:'x'}));const RB=await run(W,'Close Group Retry Build',nodes,errs);
  const rec=code(W,'Close Enforcer Record');const s=rec.indexOf('const BA=');const e=rec.indexOf('const B=BA[0];',s);const BA=new Function('$','return (()=>{'+rec.slice(s,e)+'\n;return BA;})();')(mk$(W,nodes));
  const held=JSON.stringify(nodes['Close Enforcer Build']).length+JSON.stringify(BB).length;
  return {sent,retry:RB.map(x=>JSON.stringify(x)),prompts:BA.map(b=>(((b.body||{}).messages||[])[1]||{}).content||null),held};};
 const co2=await close(OLD),cn2=await close(NEW);
 co2.sent.forEach((x,k)=>ok(x===cn2.sent[k],'close batch request '+(k+1)+' sent old = new (md5 '+md5(cn2.sent[k]).slice(0,8)+', '+x.length+' chars)'));
 ok(co2.retry.join('|')===cn2.retry.join('|'),'retry requests old = new ('+cn2.retry.length+')');
 ok(JSON.stringify(co2.prompts)===JSON.stringify(cn2.prompts),'Close Enforcer Record prompts old = new ('+cn2.prompts.length+')');
 // T2 sizes held as step output
 const sz=x=>JSON.stringify(x).length;
 const qmO=sz(Mold),qmN=sz(Mnew);const prepO=po.reduce((a,x)=>a+x.item,0),prepN=pn.reduce((a,x)=>a+x.item,0);
 console.log('T2 held: QR Merge '+qmO+' -> '+qmN+'; Panel Judges Prep '+prepO+' -> '+prepN+'; Close Enforcer Build + Batch Build '+co2.held+' -> '+cn2.held+'; saved '+((qmO-qmN)+(prepO-prepN)+(co2.held-cn2.held)));
}
console.log(fails?'T1 FAIL '+fails:'T1 ALL PASS');})().catch(e=>{console.log('ERR',e.stack.slice(0,800));});
