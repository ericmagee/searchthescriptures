// ASK 588 R build (W4): store the question round's record after QR Merge. Base: live engine 06ba53ad (= target_engine_588f.json 7ede01fb).
const fs=require('fs');const crypto=require('crypto');const md5=s=>crypto.createHash('md5').update(s).digest('hex');
const E=JSON.parse(fs.readFileSync('/mnt/project-files/ask590/w4/build/base_eng.json','utf8'));if(E.versionId!=='06ba53ad-2029-44cb-90fc-21ad420f4028')throw new Error('base is not live 06ba53ad');
const E0=JSON.parse(JSON.stringify(E));const N=n=>{const x=E.nodes.find(y=>y.name===n);if(!x)throw new Error('no node '+n);return x;};
const CODE=`/* ASK 588 R: the question round's record, stored after the round on a live run and on a regrade (Build Save Body runs before the round) */
try{const S=$('Init Seats').first().json;const j=$('QR Merge').first().json;
const rec=j.qr_ok===true?{status:'RAN',skips:j.skips||[],qa:(j.qa||[]).map(z=>({n:z.n,judge:z.judge,side:z.side,form:z.form,round:z.round,quote:z.quote,earlier_round:z.earlier_round,earlier_quote:z.earlier_quote,question:z.question,answer:z.answer,new_verses:z.new_verses,finish:z.finish,route:z.route,error:z.error,...(z.of?{of:z.of}:{})})),checks:j.record||[],follow:S.qr_follow===true}:{status:'SKIPPED',why:j.qr_skip||null,checks:j.record||[],follow:S.qr_follow===true};
return [{json:{p_run_token:S.run_token||null,p_regrade:S.regrade===true,p_dry:S.dry===true,p_status:rec.status,p_record:rec}}];
}catch(e){let t=null;try{t=$('Init Seats').first().json.run_token||null;}catch(x){}return [{json:{p_run_token:t,p_regrade:false,p_dry:false,p_status:'SKIPPED',p_record:{status:'SKIPPED',why:'QR Record Build: '+String(e&&e.message||e).slice(0,300)}}}];}`;
const [mx,my]=N('QR Merge').position;
const rb={id:crypto.randomUUID(),name:'QR Record Build',type:'n8n-nodes-base.code',typeVersion:2,position:[mx+200,my+200],onError:'continueRegularOutput',parameters:{jsCode:CODE}};
const rq=JSON.parse(JSON.stringify(N('Write Tokens')));rq.id=crypto.randomUUID();rq.name='QR Record';rq.position=[mx+400,my+200];rq.onError='continueRegularOutput';
rq.parameters.url='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/rpc/odv1_record_question_round';
rq.parameters.jsonBody="={{ { p_run_token: $json.p_run_token, p_regrade: $json.p_regrade, p_dry: $json.p_dry, p_status: $json.p_status, p_record: $json.p_record } }}";
for(const n of [rb,rq]){if(E.nodes.some(y=>y.name===n.name))throw new Error('exists '+n.name);E.nodes.push(n);}
const cn=E.connections;const to=n=>({node:n,type:'main',index:0});
if(JSON.stringify(cn['QR Merge'])!==JSON.stringify({main:[[to('Panel Judges Prep')]]}))throw new Error('QR Merge wiring differs');
cn['QR Merge']={main:[[to('Panel Judges Prep'),to('QR Record Build')]]};cn['QR Record Build']={main:[[to('QR Record')]]};
fs.writeFileSync('target_engine_588r.json',JSON.stringify(E));
console.log(JSON.stringify({new:[rb.name+' '+md5(JSON.stringify(rb.parameters)).slice(0,8),rq.name+' '+md5(JSON.stringify(rq.parameters)).slice(0,8)],changed:E0.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(E.nodes.find(x=>x.name===n.name))).map(n=>n.name),nodes:E.nodes.length,eng_md5:md5(JSON.stringify(E)).slice(0,8)}));
