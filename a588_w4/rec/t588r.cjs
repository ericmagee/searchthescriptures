// ASK 588 R tests (W4): the record node, its place in the graph, its body. Offline.
const fs=require('fs');const E=JSON.parse(fs.readFileSync('target_engine_588r.json','utf8'));const B=JSON.parse(fs.readFileSync('/mnt/project-files/ask590/w4/build/base_eng.json','utf8'));
let pass=0,fail=0;const ok=(c,w)=>{if(c){pass++;console.log('PASS '+w);}else{fail++;console.log('FAIL '+w);}};
const out=(W,n)=>((W.connections[n]||{}).main||[]).flat().filter(Boolean).map(x=>x.node);
const reach=(W,s)=>{const seen=new Set([s]);const q=[s];while(q.length){const a=q.shift();for(const b of out(W,a))if(!seen.has(b)){seen.add(b);q.push(b);}}return seen;};
// T1 order: the defect and the fix
ok(reach(B,'Build Save Body').has('QR Merge')&&!reach(B,'QR Merge').has('Build Save Body'),'T1.1 control (live 06ba53ad): Build Save Body runs before QR Merge, so its record line cannot see the round');
{const r=reach(B,'Regrade After Quotes?');ok(r.has('QR Merge'),'T1.3 the regrade branch reaches QR Merge (Build Save Body on it: '+r.has('Build Save Body')+')');}
ok(JSON.stringify(out(E,'QR Merge'))===JSON.stringify(['Panel Judges Prep','QR Record Build'])&&JSON.stringify(out(E,'QR Record Build'))==='["QR Record"]'&&out(E,'QR Record').length===0,'T1.4 QR Merge feeds Panel Judges Prep (first, unchanged) and QR Record Build; QR Record ends the branch');
{const fresh=reach(E,'Check Save'),rg=reach(E,'Regrade After Quotes?');ok(fresh.has('QR Record')&&rg.has('QR Record'),'T1.5 QR Record is reached on the fresh path and on the regrade path, after QR Merge');}
{const ch=B.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(E.nodes.find(x=>x.name===n.name))).map(n=>n.name);ok(ch.length===0&&E.nodes.length===B.nodes.length+2,'T1.6 no existing node changes; two nodes added');}
// T2 the record node
const code=E.nodes.find(x=>x.name==='QR Record Build').parameters.jsCode;
const run=nodes=>new Function('$','return (()=>{'+code+'\n})();')(n=>{if(!(n in nodes))throw new Error('no node '+n);return {first:()=>({json:nodes[n]})};})[0].json;
const mg={qr_ok:true,skips:['follow-up challenger: x'],qa:[{n:1,judge:'gemini',side:'defender',form:'MEANING',round:'CR3',quote:'q',question:'What does "x" in this passage mean?',answer:'a',new_verses:[],finish:'stop',route:'anthropic',error:null},{n:7,judge:'spark',side:'defender',form:'FOLLOW-UP',round:'CR3',quote:'q',question:'Your answer to Q1 did not answer: "q". Please explain that part.',answer:'b',new_verses:[],finish:'stop',route:'anthropic',error:null,of:1}],record:[{judge:'gemini',status:'PASSED'},{pass:'follow',judge:'spark',status:'PASSED'}],judges:[{body:{huge:true}}],qa_text:'T'};
{const r=run({'Init Seats':{run_token:'ODV1-1-x',regrade:false,dry:false,qr_follow:true},'QR Merge':mg});ok(r.p_run_token==='ODV1-1-x'&&r.p_status==='RAN'&&r.p_record.qa.length===2&&r.p_record.qa[1].of===1&&r.p_record.checks.length===2&&r.p_record.follow===true&&!JSON.stringify(r).includes('huge'),'T2.1 RAN: every question and answer, the follow-up with its Q<n>, the checks, the skips; no judge bodies');}
{const r=run({'Init Seats':{run_token:'R',regrade:true,dry:true},'QR Merge':{qr_ok:false,qr_skip:'QR Ask Build: x',record:[]}});ok(r.p_status==='SKIPPED'&&r.p_record.why==='QR Ask Build: x'&&r.p_regrade===true&&r.p_dry===true,'T2.2 SKIPPED with its reason; a dry regrade is marked');}
{const r=run({'Init Seats':{run_token:'Z'}});ok(r.p_status==='SKIPPED'&&/QR Record Build/.test(r.p_record.why)&&r.p_run_token==='Z','T2.3 a fault in the node is a SKIPPED record, not a stop');}
// T3 the HTTP node
{const q=E.nodes.find(x=>x.name==='QR Record'),w=B.nodes.find(x=>x.name==='Write Tokens');
 ok(q.parameters.url==='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/rpc/odv1_record_question_round'&&q.onError==='continueRegularOutput'&&JSON.stringify(q.credentials)===JSON.stringify(w.credentials)&&q.parameters.authentication===w.parameters.authentication,'T3.1 QR Record: the new RPC, the same Supabase credential as Write Tokens, errors continue');
 const j={p_run_token:'A',p_regrade:false,p_dry:false,p_status:'RAN',p_record:{x:1}};const body=new Function('$json','return '+q.parameters.jsonBody.slice(4,-3))(j);ok(JSON.stringify(body)===JSON.stringify(j),'T3.2 the body names the five RPC arguments');}
// T4 the migration text
{const s=fs.readFileSync('mig588r.sql','utf8');ok(/create table if not exists public\.odv1_question_round_log/.test(s)&&/security definer/.test(s)&&/grant execute on function public\.odv1_record_question_round\(text,boolean,boolean,text,jsonb\) to service_role, lab_seat/.test(s)&&/enable row level security/.test(s)&&!/drop |delete |update /i.test(s),'T4.1 the migration: one new table (RLS on), one insert function, execute for service_role and lab_seat as Write Tokens has; no drop, delete or update');}
console.log('RESULT: '+(fail?'FAIL ('+fail+' fail, '+pass+' pass)':'ALL PASS ('+pass+' pass)'));
