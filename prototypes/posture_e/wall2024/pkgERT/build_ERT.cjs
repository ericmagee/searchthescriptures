// pkgERT (W2, 11-07; lane 1 DeepSeek fix asked for the run after 33490). Run 33482: "Enforcer Call deepseek" (the K-W / K-S3 DeepSeek check, one
// call of ~155 KB) came back {"error":"aborted"} after 61 s (its usual time is 86-236 s), and nothing retried it, so every one of its ~65 checks was
// NO VERDICT. That node has no retry at all. A node-level retryOnFail would not help: with onError continueRegularOutput, the n8n 2.15.1 HTTP node
// (HttpRequestV3.node.ts, lines ~796-830) catches a failed request and returns {error} as an item instead of throwing, so the engine's retry loop
// never sees a failure. The judge enforcer has the same setting, which is why pkgESR retries in code. This package gives the main enforcer the same
// one-shot code retry:
//  - new Code "Enforcer Retry Build": if the reply is an error, has no choices, or has empty content, it resends the same body once (esr_retry:true);
//    otherwise it emits {esr_retry:false}. (No split: the call is one item and its size has answered in every saved run; finish "length" is not resent,
//    because the same body would be cut the same way.)
//  - new IF "Enforcer Retry Needed?" and new HTTP "Enforcer Retry Call deepseek" (the same request settings and credentials as the Call).
//  - Enforcer Record: when the retry call ran and has reply text, the Record reads it in place of the first reply; the first error and the retry are
//    noted in enf421.ert. No other change to the Record.
// Base: live s50. Run from wall2024/: node pkgERT/build_ERT.cjs   (writes patched/ and patched.wiring.json, patched.plan.json)
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s50.json','utf8'));const N=n=>W.nodes.find(z=>z.name===n);
const OUT=__dirname+'/patched';fs.mkdirSync(OUT,{recursive:true});const plan={source:'W2 pkgERT, coordinator 16:24 CST 11-07 (33482 Enforcer Call aborted)',base:'fetchback_live_s50',nodes:[]};
const RETRY=`// pkgERT (W2, 11-07): the main DeepSeek enforcer call ("Enforcer Call deepseek") is sent once more when its reply is an error (33482: "aborted"
// after 61 s), has no choices, or has empty content. The HTTP node returns a failed request as an {error} item (onError continueRegularOutput),
// so its own retry setting never fires. Emits {esr_retry:false} when the reply is good or no call was meant.
const B=$('Enforcer Build').first().json;const r=$input.first().json;
const why=(()=>{if(!r)return 'no reply';if(r.error)return 'error: '+String(typeof r.error==='string'?r.error:(r.error.message||JSON.stringify(r.error))).slice(0,160);
 const c=Array.isArray(r.choices)&&r.choices[0];if(!c)return 'no choices ('+String(r.message||Object.keys(r).slice(0,6).join(',')).slice(0,120)+')';
 if(!String((c.message&&c.message.content)||'').trim())return 'empty content'+(c.finish_reason?' (finish_reason '+c.finish_reason+')':'');return null;})();
if(B.enf_skip||!B.body||!Array.isArray(B.body.messages)||!why)return [{json:{esr_retry:false}}];
return [{json:{esr_retry:true,esr_why:why,body:B.body,model:B.model,run_token:B.run_token}}];`;
const RA=["let rep=null;try{if($('Enforcer Call deepseek').isExecuted)rep=$('Enforcer Call deepseek').first().json;}catch(e){rep=null;}",
 "let rep=null;try{if($('Enforcer Call deepseek').isExecuted)rep=$('Enforcer Call deepseek').first().json;}catch(e){rep=null;}\n"+
 "let __ert=null;try{if($('Enforcer Retry Call deepseek').isExecuted){const rr=$('Enforcer Retry Call deepseek').first().json;let w=null;try{w=$('Enforcer Retry Build').first().json.esr_why||null;}catch(e){}const ok=!!(rr&&Array.isArray(rr.choices)&&rr.choices[0]&&rr.choices[0].message&&String(rr.choices[0].message.content||'').trim());__ert={first:w,retried:true,answered:ok};if(ok)rep=rr;else __ert.retry_error=String(rr&&rr.error?(typeof rr.error==='string'?rr.error:(rr.error.message||JSON.stringify(rr.error))):'no reply text').slice(0,200);}}catch(e){__ert={error:String(e&&e.message||e).slice(0,200)};} /* pkgERT: 33482 Enforcer Call aborted after 61 s, no retry */"];
const RB=["return [{json:{...PCC,enf421:{skipped:!!B.enf_skip,why:B.why||null,groups:B.groups||0,answers:(B.ids||[]).length,tally},enf421_rows:rows}}];",
 "return [{json:{...PCC,enf421:{skipped:!!B.enf_skip,why:B.why||null,groups:B.groups||0,answers:(B.ids||[]).length,tally,...(__ert?{ert:__ert}:{})},enf421_rows:rows}}];"];
{const s0=N('Enforcer Record').parameters.jsCode;let s=s0;for(const [a,b] of [RA,RB]){const c=s.split(a).length-1;if(c!==1)throw new Error('Enforcer Record anchor x'+c+': '+a.slice(0,60));s=s.replace(a,()=>b);}
 new Function('$','$input',s);fs.writeFileSync(OUT+'/Enforcer_Record.js',s);plan.nodes.push({name:'Enforcer Record',file:'Enforcer_Record.js',base_sha:sha(s0),final_sha:sha(s)});}
new Function('$','$input',RETRY);fs.writeFileSync(OUT+'/Enforcer_Retry_Build.js',RETRY);plan.nodes.push({name:'Enforcer Retry Build',file:'Enforcer_Retry_Build.js',base_sha:'(new)',final_sha:sha(RETRY)});
const uid=s=>{const h=crypto.createHash('sha256').update('pkgERT '+s).digest('hex');return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20,32);};
const call=N('Enforcer Call deepseek'),rec=N('Enforcer Record'),need=N('Enforcer Needed?');const [x,y]=call.position;const rb='Enforcer Retry Build',rn='Enforcer Retry Needed?',rc='Enforcer Retry Call deepseek';
const wiring={add:[],connections_set:{}};
wiring.add.push({id:uid(rb),name:rb,type:'n8n-nodes-base.code',typeVersion:2,position:[x+110,y-220],parameters:{jsCode:'(from patched/Enforcer_Retry_Build.js)'}});
wiring.add.push({id:uid(rn),name:rn,type:'n8n-nodes-base.if',typeVersion:2.2,position:[x+220,y-220],parameters:{conditions:{combinator:'and',conditions:[{id:uid(rn+' c'),leftValue:'={{ $json.esr_retry === true }}',operator:{operation:'true',singleValue:true,type:'boolean'},rightValue:''}],options:{caseSensitive:true,leftValue:'',typeValidation:'loose'}},options:{}}});
wiring.add.push({...JSON.parse(JSON.stringify(call)),id:uid(rc),name:rc,position:[x+330,y-220]});
wiring.connections_set[call.name]={main:[[{node:rb,type:'main',index:0}]]};wiring.connections_set[rb]={main:[[{node:rn,type:'main',index:0}]]};
wiring.connections_set[rn]={main:[[{node:rc,type:'main',index:0}],[{node:rec.name,type:'main',index:0}]]};wiring.connections_set[rc]={main:[[{node:rec.name,type:'main',index:0}]]};
wiring.unchanged_note=need.name+' keeps its false branch to '+rec.name+' (the enf_skip path). Enforcer Call deepseek itself is unchanged (settings and credentials).';
wiring.check_before={[call.name]:W.connections[call.name]};
fs.writeFileSync(OUT+'.wiring.json',JSON.stringify(wiring,null,1));fs.writeFileSync(OUT+'.plan.json',JSON.stringify(plan,null,1));console.log(plan.nodes.map(n=>n.name+' '+n.base_sha+' -> '+n.final_sha).join('\n'));
