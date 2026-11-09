// pkgSJR probe (W2). Runs the four new nodes' code and the patched Extract Independent Verdict and Cure Check (pkgLIB/strip_SJR full sources)
// on saved runs, through pkgGSL/harness.cjs (the gate's own $ model). Run: node pkgSJR/probe_SJR.cjs > pkgSJR/probe_SJR.txt
const fs=require('fs'),path=require('path');const W=path.resolve(__dirname,'..');const {harness}=require(W+'/pkgGSL/harness.cjs');const S=require('./sjr_nodes.cjs');
const SRC=n=>fs.readFileSync(W+'/pkgLIB/strip_SJR/patched/'+n.replace(/ /g,'_')+'.js','utf8');const EXT=SRC('Extract Independent Verdict'),CC=SRC('Cure Check');
const D='/mnt/project-files/wall2024/inputs/';const items=(run,n)=>{const d=JSON.parse(fs.readFileSync(D+run+'_'+n.replace(/ /g,'_')+'.json','utf8'));const r=Array.isArray(d)?d[0]:d;return r.data.main[0];};
let ok=0,bad=0;const T=(name,c,info)=>{if(c){ok++;console.log('OK   '+name+(info?': '+info:''));}else{bad++;console.log('FAIL '+name+(info?': '+info:''));}};
const IFX=S.IF_EXPR.replace(/^=\{\{\s*/,'').replace(/\s*\}\}$/,'');
const ifRun=(run,over,json)=>{const h=harness(run,over);return h('return '+IFX+';','Extract Independent Verdict');};
const J=x=>[{json:x}];
// 1. 34108 as it ran: terra's reply has no verdict and no chain marks.
const E1=items('34108','Extract Independent Verdict')[0].json;const B1=items('34108','Build Independent Verdict')[0].json;const VN1=items('34108','Verdict Normalizer')[0].json;
T('1a IF fires on 34108 (verdict '+E1.verdict_tag+', marks '+E1.defender_chain_mark+'/'+E1.challenger_chain_mark+', jidx '+B1.jidx+')',ifRun('34108',{})===true);
T('1b IF does not fire a second time (SJ Re-ask Build executed)',ifRun('34108',{'SJ Re-ask Build':J({})})===false);
T('1c IF does not fire for a non-OpenRouter single judge (jidx 0)',ifRun('34108',{'Build Independent Verdict':J({...B1,jidx:0})})===false);
T('1d IF does not fire on a readable reply (34016)',ifRun('34016',{})===false,'34016 verdict '+items('34016','Extract Independent Verdict')[0].json.verdict_tag);
// 2. Build on 34108.
const h1=harness('34108',{});const BO=h1(S.BUILD,'Extract Independent Verdict')[0].json;const m0=B1.verdictBody.messages,m1=BO.verdictBody.messages;
T('2a Build: mode full, three things missing',BO.sjr.mode==='full'&&BO.sjr.miss.length===3,BO.sjr.miss.join('; '));
T('2b Build: same model and token budget, the judge\'s own conversation kept, + its reply + one ask',BO.verdictBody.model===B1.verdictBody.model&&JSON.stringify(m1.slice(0,m0.length))===JSON.stringify(m0)&&m1.length===m0.length+2&&m1[m0.length].role==='assistant'&&m1[m0.length].content===VN1.choices[0].message.content&&m1[m0.length+1].role==='user',BO.verdictBody.model+', '+m0.length+' -> '+m1.length+' messages');
T('2c Build: routing fields kept (jidx, audit_prompt)',BO.jidx===B1.jidx&&BO.audit_prompt===B1.audit_prompt);
console.log('     ask: '+m1[m1.length-1].content);
// 2d-2e (rev 2, W1 3702 and W4 3701): evaluate SJ Re-ask Call openrouter's jsonBody from the parent on SJ Re-ask Build's output.
const PAR=JSON.parse(fs.readFileSync(__dirname+'/parent_s82_SJR.json','utf8'));const CALL=PAR.nodes.find(n=>n.name==='SJ Re-ask Call openrouter');
const bodyOf=(bo,b1)=>new Function('$','$json','return '+CALL.parameters.jsonBody.replace(/^=\{\{\s*/,'').replace(/\s*\}\}$/,'')+';')(n=>({first:()=>({json:n==='SJ Re-ask Build'?bo:n==='Build Independent Verdict'?b1:null})}),bo);
const CB=bodyOf(BO,B1);const cm=CB.messages,lt=x=>typeof x.content==='string'?x.content:x.content.map(p=>p.text).join('');
T('2d Call body (full mode, 34108): '+cm.length+' messages, the last two are the judge\'s reply and the ask, model '+CB.model,cm.length===m0.length+2&&cm[cm.length-2].role==='assistant'&&lt(cm[cm.length-2])===VN1.choices[0].message.content&&cm[cm.length-1].role==='user'&&lt(cm[cm.length-1])===BO.sjr.ask&&CB.model===B1.verdictBody.model);
{const B0=items('33482','Build Independent Verdict')[0].json;const BOm=harness('33482',{'Build Independent Verdict':J({...B0,jidx:5})})(S.BUILD,'Extract Independent Verdict')[0].json;const MB=bodyOf(BOm,B0).messages;
 T('2e Call body (marks mode, 33482): ends with the ask for the missing CHAIN MARK lines only',/^Your judgment above has no DEFENDER CHAIN MARK line; no CHALLENGER CHAIN MARK line\. Write only the missing lines/.test(lt(MB[MB.length-1]))&&MB.length===B0.verdictBody.messages.length+2,lt(MB[MB.length-1]).slice(0,120));}
// 3. Pick.
const R34016=items('34016','Verdict Normalizer')[0].json;const reask={...R34016,usage:{prompt_tokens:100,completion_tokens:50,total_tokens:150}};
const pk=(run,mode,inp)=>harness(run,{'SJ Re-ask Build':J({sjr:{mode}}),'SJ Re-ask Call openrouter':J(inp)})(S.PICK,'SJ Re-ask Call openrouter')[0].json;
const P1=pk('34108','full',reask);T('3a Pick full: the re-ask reply is used; usage is the sum of both calls',P1.sjr_pick.used==='reask'&&P1.choices[0].message.content===R34016.choices[0].message.content&&P1.usage.prompt_tokens===VN1.usage.prompt_tokens+100&&P1.usage.completion_tokens===VN1.usage.completion_tokens+50,'prompt '+P1.usage.prompt_tokens+', completion '+P1.usage.completion_tokens);
const P2=pk('34108','full',{error:{message:'Bad gateway',name:'NodeApiError'}});T('3b Pick on a failed call: the first reply is used and the reason kept',P2.sjr_pick.used==='first'&&P2.choices[0].message.content===VN1.choices[0].message.content&&/Bad gateway/.test(P2.sjr_pick.why),P2.sjr_pick.why);
const P3=pk('34108','full',{choices:[{message:{role:'assistant',content:'   '}}]});T('3c Pick on an empty reply: the first reply is used',P3.sjr_pick.used==='first',P3.sjr_pick.why);
// 4. Extract run 2 reads the re-ask reply (full mode). The re-ask reply here is 34016's readable judgment, run through 34108's Extract.
const E2=harness('34108',{'SJ Re-ask Pick':J(P1)})(EXT,'SJ Re-ask Pick')[0].json;
T('4a Extract on the re-ask reply: verdict and both chain marks read',E2.verdict_tag!=='UNKNOWN'&&!!E2.defender_chain_mark&&!!E2.challenger_chain_mark,'verdict '+E2.verdict_tag+', marks '+E2.defender_chain_mark+'/'+E2.challenger_chain_mark);
T('4b IF after run 2: does not fire again',ifRun('34108',{'SJ Re-ask Build':J(BO),'Extract Independent Verdict':J(E2)})===false);
// 5. Marks mode: 33482 (gemini) gave a verdict but no chain marks.
for(const run of ['33482','33530']){const E0=items(run,'Extract Independent Verdict')[0].json;const VN=items(run,'Verdict Normalizer')[0].json;const B0=items(run,'Build Independent Verdict')[0].json;
 const BOm=harness(run,{'Build Independent Verdict':J({...B0,jidx:5})})(S.BUILD,'Extract Independent Verdict')[0].json;
 T('5a '+run+' Build: mode marks (verdict '+E0.verdict_tag+' read, marks absent)',BOm.sjr.mode==='marks'&&BOm.sjr.miss.length===2,BOm.sjr.miss.join('; '));
 const Pm=pk(run,'marks',{choices:[{message:{role:'assistant',content:'**DEFENDER CHAIN MARK:** STRAINED -- link 3 floats on one layer.\n- CHALLENGER CHAIN MARK: SLACK -- no reading of its own was built.'}}],usage:{prompt_tokens:10,completion_tokens:5,total_tokens:15}});
 T('5b '+run+' Pick marks: the two lines are added to the first reply, nothing else changes',Pm.sjr_pick.used==='marks'&&Pm.sjr_pick.lines===2&&Pm.choices[0].message.content.startsWith(VN.choices[0].message.content.replace(/\s+$/,''))&&/\n\nDEFENDER CHAIN MARK: STRAINED -- link 3 floats on one layer\.\nCHALLENGER CHAIN MARK: SLACK/.test(Pm.choices[0].message.content));
 const Em=harness(run,{'SJ Re-ask Pick':J(Pm)})(EXT,'SJ Re-ask Pick')[0].json;
 const same=['verdict_tag','defense_standing','challenge_standing','conceded_links','challenger_conceded_links','keystone_link'].every(k=>JSON.stringify(Em[k])===JSON.stringify(E0[k]));
 T('5c '+run+' Extract: chain marks now read, verdict and standings unchanged',Em.defender_chain_mark==='STRAINED'&&Em.challenger_chain_mark==='SLACK'&&same,'verdict '+Em.verdict_tag+', marks '+Em.defender_chain_mark+'/'+Em.challenger_chain_mark);
 const Pn=pk(run,'marks',{choices:[{message:{role:'assistant',content:'I stand by my judgment.'}}]});T('5d '+run+' Pick marks with no chain-mark line: the first reply is used',Pn.sjr_pick.used==='first'&&Pn.choices[0].message.content===VN.choices[0].message.content,Pn.sjr_pick.why);}
// 6. Cure Check line (what the run row's review_notes receives).
const RV=/\[(?:EXTRACTOR|AUDIT) v\d+[^\]\n]*REVIEW THIS ROW[^\]\n]*\]/g;const sjl=raw=>(String(raw).match(RV)||[]).filter(l=>/SJR/.test(l));
const cc=(over)=>harness('34108',over)(CC,'Cure Needed?')[0].json;
const C0=cc({});const l0=sjl(C0.independent_verdict_raw);T('6a 34108 as it ran (no re-ask nodes): one SJR line, seat and model named',l0.length===1&&/seat chatgpt \(openai\/gpt-6\.1-terra\)/.test(l0[0])&&/not re-asked \(no re-ask was made in this run\)/.test(l0[0]),l0[0]);
const C1=cc({'Extract Independent Verdict':J(E2),'SJ Re-ask Build':J(BO),'SJ Re-ask Pick':J(P1)});const l1=sjl(C1.independent_verdict_raw);
T('6b 34108 re-asked and answered: the line says so and reads the new state',l1.length===1&&/SINGLE JUDGE RE-ASKED/.test(l1[0])&&/now: readable, verdict /.test(l1[0]),l1[0]);
const E1b={...E1};const C2=cc({'SJ Re-ask Build':J(BO),'SJ Re-ask Pick':J(P2)});const l2=sjl(C2.independent_verdict_raw);
T('6c 34108 re-ask failed: STILL UNREADABLE, the failure reason kept',l2.length===1&&/STILL UNREADABLE/.test(l2[0])&&/Bad gateway/.test(l2[0]),l2[0]);
const base0=harness('34108',{})(fs.readFileSync(W+'/pkgLIB/strip_XKB/patched/Cure_Check.js','utf8'),'Cure Needed?')[0].json;const strip=s=>String(s).replace(/\n\n\[AUDIT v36: SINGLE JUDGE [^\n]*\(SJR\)[^\n]*/g,'');
T('6d Cure Check: apart from the SJR line, the output equals live s82 Cure Check (strip_XKB) on the same input',JSON.stringify({...C0,independent_verdict_raw:strip(C0.independent_verdict_raw)},(k,v)=>k==='at'?undefined:v)===JSON.stringify({...base0,independent_verdict_raw:strip(base0.independent_verdict_raw)},(k,v)=>k==='at'?undefined:v));
const C3=harness('34016',{})(CC,'Cure Needed?')[0].json;T('6e a readable single judge (34016): no SJR line',sjl(C3.independent_verdict_raw).length===0);
console.log('\n'+ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
