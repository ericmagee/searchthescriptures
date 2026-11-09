// pkgVP1 part 1 probe (W3). node pkgVP1/probe_VP1_p1.cjs   The second reading and the send-back record, replayed on run 34108's stored node outputs.
// No DeepSeek call is made offline: the enforcer's reply is written by hand.
const fs=require('fs'),path=require('path');const H=require('./harness.cjs');const RUN='34108';
let ok=0,bad=0;const T=(c,m)=>{if(c)ok++;else bad++;console.log((c?'OK   ':'FAIL ')+m);};
const P=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s86.json','utf8'));const by={};P.nodes.forEach(n=>by[n.name]=n);
let LV=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s83.json','utf8'));LV=LV.data||LV;LV=LV.workflow||LV;const lv={};LV.nodes.forEach(n=>lv[n.name]=n);
const strip=o=>JSON.parse(JSON.stringify(o,(k,v)=>k==='at'?undefined:v));
(async()=>{
 // A. Send Back Record: live code against the package's code on the stored inputs
 const a=await H.run(lv['Send Back Record'].parameters.jsCode,RUN,'Send Back Call openrouter');const b=await H.run(by['Send Back Record'].parameters.jsCode,RUN,'Send Back Call openrouter');
 const st=H.out(RUN,'Send Back Record')[0][0].json;T(JSON.stringify(strip(a[0].json.sb_rows))===JSON.stringify(strip(st.sb_rows)),'A0 the harness reproduces the stored Send Back Record rows from live code ('+a[0].json.sb_rows.length+' rows)');
 const ra=a[0].json.sb_rows,rb=b[0].json.sb_rows;let diff=[];ra.forEach((r,i)=>{const q=rb[i];for(const k of Object.keys(r))if(k!=='at'&&JSON.stringify(r[k])!==JSON.stringify(q[k]))diff.push({i,seat:r.seat,rule:r.rule,item:r.item,k,from:r[k],to:k==='cure_reason'?String(q[k]).slice(String(r[k]).length):q[k]});});
 T(ra.length===rb.length&&diff.every(x=>(x.k==='cure_status'&&x.from===null&&/^(E-ANS|E-PREM|E-OOR)$/.test(x.rule))||(x.k==='cure_reason'&&x.rule==='E-OOR'&&/^ \| CURE \(E-OOR code reading/.test(x.to))),'A1 rows changed only in cure_status (from empty) on E-ANS, E-PREM, E-OOR rows, and the E-OOR reading added to its cure_reason');
 for(const x of diff)console.log('     '+x.seat+' '+x.rule+' '+String(x.item).slice(0,44)+' | '+x.k+': '+JSON.stringify(x.from===null?null:'...')+' -> '+String(x.to).slice(0,330));
 const rest=o=>{const c={...o};delete c.sb_rows;return JSON.stringify(strip(c));};T(rest(a[0].json)===rest(b[0].json),'A2 everything else in the node output is byte-equal (bodies, drv_uncured, alt_needed, sb_items, tallies)');
 const left=rb.filter(r=>r.cure_status==null);console.log('     rows still without a cure status: '+left.map(r=>r.seat+' '+r.rule+' ('+String(r.cure_reason).slice(10,24)+')').join('; '));
 // B. Reread Build
 const rbuild=await H.run(by['Reread Build'].parameters.jsCode,RUN,'Send Back Record');const j0=rbuild[0].json;
 T(rbuild.length===1&&j0.rr_skip===false&&j0.model==='deepseek-flash','B1 one DeepSeek call is built, model '+j0.model);
 const want=st.sb_items.filter(x=>x.ans==='CHANGE'&&/^\(right/.test(x.reason));const got=j0.ids.map(x=>x.seat+' '+x.sid+' '+x.rule+' '+x.id);console.log('     asked: '+got.join('; '));
 T(j0.ids.length===want.length&&want.every(w=>j0.ids.some(x=>x.seat===w.seat&&x.sid===w.sid))&&!j0.not_checked.length,'B2 every replaced line that DeepSeek had flagged is asked once ('+want.length+'), none left out; code-check items and KEEP answers are not asked');
 const u=j0.body.messages[1].content;T(u.length<60000,'B3 prompt size '+u.length+' characters');
 const JB=H.out(RUN,'Judge Enforcer Build')[0].map(x=>x.json);T(j0.body.messages[0].content===JB[0].body.messages[0].content&&u.startsWith(JB[0].body.messages[1].content.slice(0,5000)),'B4 the system text and the rules are the first call\'s own');
 const lu=st.sb_items.find(x=>x.seat==='luna'&&x.rule==='E-RES');T(u.includes('THE REPLACED LINE of ')&&u.includes(lu.to.trim())&&!/REPLY LINES DUE FOR THIS ITEM/.test(u.slice(u.indexOf('SECOND READING'))),'B5 luna\'s reworded RESULT reason is in the prompt; the first call\'s multi-line reply instruction is not');
 const blk=u.slice(u.indexOf('\n\nITEM',u.indexOf('SECOND READING')));console.log('     --- first item as sent ---\n'+blk.slice(2,blk.indexOf('\n\nITEM',10)).split('\n').map(l=>'     | '+l.slice(0,230)).join('\n'));
 // skip cases
 const ov=o=>({'Send Back Record':[[{json:o}]]});
 let r=await H.run(by['Reread Build'].parameters.jsCode,RUN,'Send Back Record',ov({...st,sb_items:st.sb_items.filter(x=>x.ans!=='CHANGE')}));T(r[0].json.rr_skip===true,'B6 no CHANGE answer: skipped ('+r[0].json.rr_why+')');
 r=await H.run(by['Reread Build'].parameters.jsCode,RUN,'Send Back Record',{'Judge Enforcer Build':[[{json:{je_skip:true,why:'x',items:[]}}]]});T(r[0].json.rr_skip===true&&r[0].json.not_checked.length===want.length,'B7 first calls not readable: skipped, each line listed as not read ('+r[0].json.rr_why+')');
 r=await H.run(by['Reread Build'].parameters.jsCode,RUN,'Send Back Record',ov({...st,sb_items:st.sb_items.map(x=>x.seat==='sol'&&x.rule==='E-PREM'?{...x,item:'premise listed against the challenger 9'}:x)}));T(r[0].json.rr_skip===false&&r[0].json.not_checked.length===1&&/^sol /.test(r[0].json.not_checked[0])&&r[0].json.ids.length===want.length-1,'B8 a line whose first reading cannot be found is listed, not guessed ('+r[0].json.not_checked[0]+')');
 // C. Reread Record on a hand-written reply
 const ids=j0.ids;const reply=ids.map((x,i)=>i===0?'ENFORCER: '+x.id+' -- AGREE -- RIGHT: MISSES -- "I answer it fully under LINK 4" defers the fit.':i===1?'**ENFORCER: '+x.id+' ('+x.seat+') -- DISAGREE -- RIGHT: DOES NOT FOLLOW -- the reason still rests on what "the record does not settle".**':i===2?'':'- ENFORCER: '+x.id+' -- NO ANSWER -- the line is not in its form.').join('\n');
 const rec=await H.run(by['Reread Record'].parameters.jsCode,RUN,'x',{'Reread Build':[[{json:j0}]],x:[[{json:{choices:[{message:{content:reply}}]}}]]});const R=rec[0].json;
 T(Object.keys(R).sort().join()==='reread,rr_rows'&&R.rr_rows.length===ids.length,'C1 the record node returns only the reread summary and '+R.rr_rows.length+' rows (no bodies copied on)');
 T(R.rr_rows[0].cure_status==='CURED'&&R.rr_rows[1].cure_status==='UNCURED'&&R.rr_rows[2].cure_status===null&&R.rr_rows[3].cure_status===null,'C2 AGREE = CURED, DISAGREE = UNCURED, no line = empty (NO VERDICT), NO ANSWER = empty: '+JSON.stringify(R.reread.tally));
 T(R.rr_rows.every(x=>x.kind==='send_back'&&x.rule==='E-REREAD'&&x.seat_role==='panel'&&x.seat&&x.run_token===RUN_TOKEN()&&/RECORD-ONLY/.test(x.cure_reason))&&R.rr_rows[0].judge_model==='openai/gpt-6-luna','C3 rows fit the log table: kind send_back, rule E-REREAD, seat, seat role, model, run token, RECORD-ONLY in the reason');
 console.log('     row 2: '+R.rr_rows[1].seat+' | '+R.rr_rows[1].item+' | '+R.rr_rows[1].cure_status+' | '+R.rr_rows[1].cure_reason.slice(0,330));
 const fail=await H.run(by['Reread Record'].parameters.jsCode,RUN,'x',{'Reread Build':[[{json:j0}]],x:[[{json:{error:{message:'timeout'}}}]]});T(fail[0].json.rr_rows.length===ids.length&&fail[0].json.rr_rows.every(x=>x.cure_status===null&&x.reply_error==='timeout')&&fail[0].json.reread.errors.length===1,'C4 a failed call: every row empty with the error, nothing counted');
 const sk=await H.run(by['Reread Record'].parameters.jsCode,RUN,'Reread Build',{'Reread Build':[[{json:{rr_skip:true,rr_why:'none',not_checked:[]}}]]});T(sk[0].json.reread.skipped===true&&sk[0].json.rr_rows.length===0,'C5 skipped build: no rows');
 // D. the alternate path code differs only in its node names and role
 const f=(s,pre)=>s.split(pre+'Send Back Record').join('SBR').split(pre+'Send Back Build').join('SBB').split(pre+'Judge Enforcer Build').join('JEB').split(pre+'Reread Build').join('RRB').split(pre+'Reread Record').join('RRR');
 for(const pre of ['Alt ','R2 Alt '])T(f(by[pre+'Reread Build'].parameters.jsCode,pre)===f(by['Reread Build'].parameters.jsCode,'')&&f(by[pre+'Reread Record'].parameters.jsCode,pre).replace("'alternate'","'panel'").replace("'alternate'","'panel'")===f(by['Reread Record'].parameters.jsCode,''),'D '+pre+'path: same code, its own node names, role alternate');
 // E. wiring
 const K=P.connections;const nx=n=>(K[n].main||[]).map(o=>(o||[]).map(x=>x.node).join(','));
 for(const pre of ['','Alt ','R2 Alt '])T(nx(pre+'Send Back Record').join('|')===pre+'Reread Build'&&nx(pre+'Reread Build').join('|')===pre+'Reread Needed?'&&nx(pre+'Reread Needed?').join('|')===pre+'Reread Call deepseek|'+pre+'Reread Record'&&nx(pre+'Reread Call deepseek').join('|')===pre+'Reread Record'&&nx(pre+'Reread Record').join('|')===pre+'Gate Build','E '+(pre||'panel ')+'wiring: Send Back Record -> Reread Build -> Needed? -> Call / Record -> Gate Build');
 const c=by['Reread Call deepseek'];T(c.credentials.httpHeaderAuth.name==='DeepSeek Key'&&c.onError==='continueRegularOutput'&&c.retryOnFail===true&&c.parameters.jsonBody==='={{ $json.body }}','E the call node is a copy of Anticheat Call deepseek (DeepSeek Key, 3 tries, continues on error)');
 {const NN=({s83:406,s84:414,s85:414})[process.env.TAG||'s85'];T(P.nodes.length===NN&&new Set(P.nodes.map(n=>n.name)).size===NN&&new Set(P.nodes.map(n=>n.id)).size===NN,'E '+NN+' nodes, names and ids unique');}
 // F. stub heads name the nodes their code reads
 for(const [n,need] of [['Gate Build','Send Back Record'],['Alt Gate Build','Alt Send Back Record'],['R2 Alt Gate Build','R2 Alt Send Back Record'],['Alternate Merge Seat','Reread Record'],['R2 Alternate Merge Seat','Reread Record'],['Alternate Merge 1','Alt Reread Record'],['R2 Alternate Merge','R2 Alt Reread Record']]){const s=by[n].parameters.jsCode;T(s.includes('$("'+need+'")')||s.includes("$('"+need+"')"),'F '+n+' names '+need+' in a literal read (task runner)');}
 console.log('\nprobe_VP1_p1: '+ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
})().catch(e=>{console.error('ERR',e);process.exit(2);});
function RUN_TOKEN(){return 'ODV1-34108-3to8dgrt';}
