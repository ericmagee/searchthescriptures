# patch_p.py (judge_fix8 part P: the test instruments of the judge posture protocol, JUDGE_POSTURE_DRAFT_v4 Part 7): run by patch.py, in its
# namespace (OUT, get, rep, cut, lib, CURE). Offline; anchored, refusing on a wrong count. Every change acts only when its request flag is set
# (Init Seats: posture, accept_probe; each in a dry regrade only, one at a time); a run without them sends byte-identical bodies.
# P1 (swap mode) was dropped by the operator ("sides are not swapped until the bugs are worked through"): no swap code is built.
#  P2 posture (lib/posture.js, lib/posture_check.js; the acceptance subflow add/): v4 Part 2 as the first turn of each judge's conversation, the
#     code check, one return, refusals recorded; the accepted exchange at the head of the judging conversation (panel, reserve, alternate);
#     the cure quote-back; the SILENCE and SAME TEST lines in the answer form, checked as TRIAL marks.
#  P3 accept_probe: the acceptance turn alone for the panel, reserve and alternate seats; Replay Rows records it; no debate is judged.
#  P4 (the negative control) is a unit fixture (test/unitP.cjs).
import os
P=lib('posture.js');PC=lib('posture_check.js')
LIVE=H+'/data/live_code'
def getlive(nm):
    # a node fix set 8 did not change: its base is the live cfcbb37b code (copied to base/ by this script, so write_package guards it)
    if nm not in OUT:
        src=open(f'{LIVE}/{nm}.js').read()
        if not os.path.exists(f'{B}/{nm}.js') or open(f'{B}/{nm}.js').read()!=src: open(f'{B}/{nm}.js','w').write(src)
        OUT[nm]=src
    return OUT[nm]

# ---------------- Init Seats: the three flags ----------------
s=getlive('Init Seats')
s=rep(s,"const q=(b.queue_id===undefined||b.queue_id===null)?null:b.queue_id;",
 "// judge_fix8 P (JUDGE_POSTURE_DRAFT_v4 Part 7): the posture test instruments. posture (P2: the acceptance turn and the posture answer form),\n"
 "// accept_probe (P3: the acceptance turn alone). Each runs only in a dry regrade on the current rulebook, one at a time, and with no other test\n"
 "// input; absent, the run is unchanged.\n"
 "['posture','accept_probe'].forEach(k=>{if(b[k]!==undefined&&b[k]!==null&&typeof b[k]!=='boolean')fail(k+' must be true or false.');});\n"
 "const PPO=b.posture===true,PAP=b.accept_probe===true;\n"
 "if((PPO||PAP)&&!DRY)fail('posture and accept_probe run only in a dry regrade.');\n"
 "if(PPO&&PAP)fail('posture and accept_probe are separate tests (one change per run); send one.');\n"
 "if((PPO||PAP)&&RB!=='current')fail('posture and accept_probe run on the current rulebook only.');\n"
 "if((PPO||PAP)&&(TFS!==null||TFR||TNF||QA!==null))fail('posture and accept_probe are not combined with test_fail_seat, test_fail_reserve, test_no_fallback or qualify_alternate.');\n"
 "if(PPO||PAP)$execution.customData.set('posture_test',PPO?'posture':'accept_probe');\n"
 "const q=(b.queue_id===undefined||b.queue_id===null)?null:b.queue_id;",'Init Seats')
s=rep(s,"regrade:!!RG,dry:DRY,rulebook:RB,","regrade:!!RG,dry:DRY,rulebook:RB,...(PPO?{posture:true}:{}),...(PAP?{accept_probe:true}:{}),",'Init Seats')
OUT['Init Seats']=s

# ---------------- Panel Build: the posture head and answer form ----------------
s=get('Panel Build')
s=rep(s,"const JIDX={openai:0,gemini:1,grok:2,mimo:3,openrouter:4};const JIDX0={deepseek:0,openai:1,gemini:2,grok:3,mimo:4,openrouter:5};\nconst judges=RS.judges.map(",
 "// judge_fix8 P2 (JUDGE_POSTURE_DRAFT_v4 Part 7; a posture dry regrade only, Init Seats): the seat's accepted exchange (Accept Final) heads its\n"
 "// conversation and the answer form carries\n"
 "// SILENCE and SAME TEST. Without the flags every body is byte-identical to the live one.\n"
 +P+"\n"
 "const __PACC=(()=>{if(S.posture!==true)return null;let A=null;try{A=$('Accept Final').first().json.acc;}catch(e){A=null;}\n"
 " if(!A||!Array.isArray(A.seats))throw new Error('FAIL-CLOSED: posture regrade without the acceptance turn (Accept Final).'+RT);const o={};A.seats.forEach(x=>{o[x.seat]=x;});return o;})();\n"
 "if(S.posture===true)SYS=SYS+NL+NL+POSTURE.ANSWER;\n"
 "const __PH=(seat,gem)=>__PACC?POSTURE.head(__PACC[seat],gem):[];\n"
 "const __PJ=seat=>__PACC?{posture:{status:(__PACC[seat]||{}).status||'ERROR',placed:!!(__PACC[seat]||{}).placed,lines:(__PACC[seat]||{}).lines||{}}}:{};\n"
 "const JIDX={openai:0,gemini:1,grok:2,mimo:3,openrouter:4};const JIDX0={deepseek:0,openai:1,gemini:2,grok:3,mimo:4,openrouter:5};\nconst judges=RS.judges.map(",'Panel Build')
s=rep(s,"contents:[{role:'user',parts:[{text:user}]}]","contents:__PH(j.seat,true).concat([{role:'user',parts:[{text:user}]}])",'Panel Build')
s=rep(s,"else{const m=[{role:'system',content:SYS},{role:'user',content:user}];","else{const m=[{role:'system',content:SYS}].concat(__PH(j.seat,false),[{role:'user',content:user}]);",'Panel Build')
s=rep(s,"api_model:j.api_model,body:__orc(body,j.fam,j.api_model,TOK+':panel:'+j.seat)};});","api_model:j.api_model,body:__orc(body,j.fam,j.api_model,TOK+':panel:'+j.seat),...__PJ(j.seat)};});",'Panel Build')
OUT['Panel Build']=s

# ---------------- the checkers' prompt text skips the posture head (Panel Payloads, Alternate Payloads) ----------------
HEADFN=("// judge_fix8 P2: the posture head (the acceptance exchange) is not the debate record; the prompt text the checks read skips it.\n"
 "function __pIsHead(a,i){const tx=c=>typeof c==='string'?c:Array.isArray(c)?c.map(p=>p&&p.text||'').join(''):'';const R=/^POSTURE (?:FOR ACCEPTANCE|RETURNED)/;const m=a[i];if(!m)return false;\n"
 " if(m.role==='user')return R.test(tx(m.content));if(m.role==='assistant'){const p=a[i-1];return !!p&&p.role==='user'&&R.test(tx(p.content));}return false;}\n")
for nm in ['Panel Payloads','Alternate Payloads']:
    s=get(nm)
    s=rep(s,"function drvPromptText(body){",HEADFN+"function drvPromptText(body){",nm)
    s=rep(s," (b.messages||[]).forEach(m=>{const c=m&&m.content;"," (b.messages||[]).filter((m,i,a)=>!__pIsHead(a,i)).forEach(m=>{const c=m&&m.content;",nm)
    OUT[nm]=s

s=get('Panel Payloads')
s=rep(s,"const bodies=[];const summary=[];","// judge_fix8 P2 (posture): the posture checks (TRIAL marks).\n"+PC+"\nconst bodies=[];const summary=[];",'Panel Payloads')
s=rep(s," p.drv_uncured=DRV.items.filter(enfLive).length;",
 " if(S.posture===true)for(const x of postureCheck(WT,drvPromptText(jd.body)).marks)marks.push(x); // judge_fix8 P2: SILENCE, SAME TEST (TRIAL marks)\n"
 " p.drv_uncured=DRV.items.filter(enfLive).length;",'Panel Payloads')
OUT['Panel Payloads']=s

s=get('Alternate Payloads')
s=rep(s,"const ALTB=$('Alternate Build').all()","// judge_fix8 P2: the posture checks (TRIAL marks) on an alternate's judgment in a posture regrade.\n"+PC+"\nconst ALTB=$('Alternate Build').all()",'Alternate Payloads')
s=rep(s,"  p.drv_uncured=DRV.items.filter(enfLive).length; // judge_fix6 H8: LIVE items only. 5B fail-closed",
 "  if($('Init Seats').first().json.posture===true)for(const x of postureCheck(WT,drvPromptText(a.body)).marks)marks.push(x); // judge_fix8 P2\n"
 "  p.drv_uncured=DRV.items.filter(enfLive).length; // judge_fix6 H8: LIVE items only. 5B fail-closed",'Alternate Payloads')
OUT['Alternate Payloads']=s

# ---------------- Reserve Build, Alternate Build: the transcript is the last user turn; the seat's own acceptance head ----------------
s=getlive('Reserve Build')
s=rep(s,"if(b0.systemInstruction){SYS=b0.systemInstruction.parts[0].text;user=b0.contents[0].parts[0].text;}\nelse{SYS=b0.messages[0].content;user=b0.messages[1].content;}",
 "// judge_fix8 P2: the transcript is the slot's last user turn (in a posture regrade the slot's acceptance exchange comes before it)\n"
 "if(b0.systemInstruction){SYS=b0.systemInstruction.parts[0].text;user=b0.contents[b0.contents.length-1].parts[0].text;}\nelse{SYS=b0.messages[0].content;user=b0.messages[b0.messages.length-1].content;}",'Reserve Build')
s=rep(s,"const j={...RS.reserve,max_tokens:Math.max(Number(RS.reserve.max_tokens)||0,8000)};let body;",
 "const j={...RS.reserve,max_tokens:Math.max(Number(RS.reserve.max_tokens)||0,8000)};let body;\n"
 "//@@POSTURE@@\n"
 "const __RA=(()=>{if($('Init Seats').first().json.posture!==true)return null;const A=$('Accept Final').first().json.acc;return (A.seats||[]).find(x=>x.seat===j.seat)||{status:'ERROR',lines:{}};})(); // judge_fix8 P2: the reserve's own acceptance\n"
 "const __RH=gem=>__RA?POSTURE.head(__RA,gem):[];",'Reserve Build')
s=s.replace('//@@POSTURE@@',P)
s=rep(s,"contents:[{role:'user',parts:[{text:user}]}]","contents:__RH(true).concat([{role:'user',parts:[{text:user}]}])",'Reserve Build')
s=rep(s,"else{const m=[{role:'system',content:SYS},{role:'user',content:user}];","else{const m=[{role:'system',content:SYS}].concat(__RH(false),[{role:'user',content:user}]);",'Reserve Build')
s=rep(s,"api_model:j.api_model,body:__orc(body,j.fam,j.api_model,TOK+':reserve:'+j.seat)}}];","api_model:j.api_model,body:__orc(body,j.fam,j.api_model,TOK+':reserve:'+j.seat),...(__RA?{posture:{status:__RA.status,placed:!!__RA.placed,lines:__RA.lines||{}}}:{})}}];",'Reserve Build')
OUT['Reserve Build']=s

s=get('Alternate Build')
s=rep(s,"let SYS=null,user=null;try{const b0=src.body;if(b0.systemInstruction){SYS=b0.systemInstruction.parts[0].text;user=b0.contents[0].parts[0].text;}else{SYS=b0.messages[0].content;user=b0.messages[1].content;}}catch(e){SYS=null;}",
 "let SYS=null,user=null;try{const b0=src.body;if(b0.systemInstruction){SYS=b0.systemInstruction.parts[0].text;user=b0.contents[b0.contents.length-1].parts[0].text;}else{SYS=b0.messages[0].content;user=b0.messages[b0.messages.length-1].content;}}catch(e){SYS=null;} // judge_fix8 P2: the transcript is the last user turn",'Alternate Build')
s=rep(s," const msgs=[{role:'system',content:SYS},{role:'user',content:user}];",
 " const __AA=__PALT?((__PALT.seats||[]).find(x=>x.seat===a.seat)||{status:'ERROR',lines:{}}):null; // judge_fix8 P2: the alternate's own acceptance (Accept Final)\n"
 " const msgs=[{role:'system',content:SYS}].concat(__AA?POSTURE.head(__AA,false):[],[{role:'user',content:user}]);",'Alternate Build')
s=rep(s,"pool_seat:a.seat,api_model:a.api_model,max_tokens:a.max_tokens,body:__orc(body,'openrouter',a.api_model,$('Init Seats').first().json.run_token+':alternate:'+a.seat)}}});",
 "pool_seat:a.seat,api_model:a.api_model,max_tokens:a.max_tokens,body:__orc(body,'openrouter',a.api_model,$('Init Seats').first().json.run_token+':alternate:'+a.seat),...(__AA?{posture:{status:__AA.status,placed:!!__AA.placed,lines:__AA.lines||{}}}:{})}}});",'Alternate Build')
s=rep(s,"const pool=(RS.alternates||[]);const deb=(RS.debaters||[]);",
 "// judge_fix8 P2 (posture regrade): the alternates' acceptance turn was taken with the panel's (Accept Final).\n"+P+"\n"
 "const __PALT=$('Init Seats').first().json.posture===true?$('Accept Final').first().json.acc:null;\n"
 "const pool=(RS.alternates||[]);const deb=(RS.debaters||[]);",'Alternate Build')
OUT['Alternate Build']=s

# ---------------- the cure quote-back (v4 Part 1, step 6): Panel Cure Build 1-3, Alternate Cure Build ----------------
for k in (1,2,3):
    nm=f'Panel Cure Build {k}';s=get(nm)
    s=rep(s,"const PP=$('Panel Payloads').first().json;const P=$('Panel Build').first().json;",
     "// judge_fix8 P2: in a posture regrade each item whose commitment the seat accepted is quoted back with the flagged line; empty otherwise.\n"+P+"\n"
     "const PP=$('Panel Payloads').first().json;const P=$('Panel Build').first().json;",nm)
    s=rep(s,"cureAsk(items,cureBroken(wt)))}}}];","cureAsk(items,cureBroken(wt))+POSTURE.quote(items,jd.posture))}}}];",nm)
    OUT[nm]=s
s=get('Alternate Cure Build')
s=rep(s,"\nconst out=[];\n$('Alternate Payloads').all()","\n// judge_fix8 P2: the cure quote-back for an alternate in a posture regrade.\n"+P+"\nconst out=[];\n$('Alternate Payloads').all()",'Alternate Cure Build')
s=rep(s,"cureAsk(r.drv,cureBroken(wt)))}}});});","cureAsk(r.drv,cureBroken(wt))+POSTURE.quote(r.drv,a.posture))}}});});",'Alternate Cure Build')
OUT['Alternate Cure Build']=s

# ---------------- Replay Rows: the record of each test, and the acceptance probe's rows ----------------
s=getlive('Replay Rows')
s=rep(s,"const P=$('Alternate Merge').first().json;","const P=S.accept_probe===true?null:$('Alternate Merge').first().json; /* judge_fix8 P3: the probe ends before the panel */",'Replay Rows')
s=rep(s,"if(S.dry!==true)throw new Error('FAIL-CLOSED: Replay Rows reached on a run that is not a dry regrade.'+RT);\n",
 "if(S.dry!==true)throw new Error('FAIL-CLOSED: Replay Rows reached on a run that is not a dry regrade.'+RT);\n"
 "// judge_fix8 P: each row of a posture-protocol test carries its record after the judge's text (no schema change: the table's rulebook and\n"
 "// verdict_tag columns are closed sets), fenced so the readers of the JSON and of the [AUDIT lines are not touched.\n"
 "const __MODE=S.posture===true?'posture':S.accept_probe===true?'accept_probe':null;\n"
 "const __REC=o=>'\\n\\n=== REPLAY RECORD (judge_fix8 P; written by the system, not the judge) ===\\n'+JSON.stringify(o)+'\\n=== END REPLAY RECORD ===';\n"
 "const __ACC=s=>s?{status:s.status,role:s.role,api_model:s.api_model,first_status:s.first_status,faults:s.faults,return_status:s.return_status,return_faults:s.return_faults,lines:s.lines,first_text:s.first_text,return_text:s.return_text}:null;\n"
 "if(__MODE==='accept_probe'){const A=$('Accept Final').first().json.acc;const RG=$('Regrade Load').first().json;const pan=A.seats.filter(x=>x.role==='panel');\n"
 " if(pan.length!==3)throw new Error('FAIL-CLOSED: Replay Rows (acceptance probe) found '+pan.length+' panel seats, expected 3.'+RT);const others=A.seats.filter(x=>x.role!=='panel').map(x=>({seat:x.seat,...__ACC(x)}));\n"
 " const rows=pan.map(x=>({debate_id:RG.debate_id,judge_seat:x.seat,judge_api_model:x.api_model,verdict_tag:null,defense_standing:null,challenge_standing:null,conceded_links:null,challenger_conceded_links:null,finish_reason:null,\n"
 "  verdict_raw:'ACCEPTANCE PROBE (judge_fix8 P3): the acceptance turn only; no debate was judged. STATUS: '+x.status+'.\\n\\n'+(x.first_text||'(no reply)')+(x.return_text!=null?'\\n\\n--- returned once ---\\n\\n'+x.return_text:'')+__REC({mode:'accept_probe',seat:x.seat,acceptance:__ACC(x),reserve_and_alternates:others}),\n"
 "  run_token:S.run_token,rulebook:S.rulebook,exec_id:String($execution.id),result_line:null,exclusivity_line:null}));\n"
 " return [{json:{body:JSON.stringify({p_rows:rows})}}];}\n"
 "let __AF=null;try{if(__MODE==='posture')__AF=$('Accept Final').first().json.acc;}catch(e){__AF=null;}\n",'Replay Rows')
s=rep(s,"return {...p,run_token:S.run_token,","const rec=__MODE==='posture'?{mode:'posture',acceptance:__ACC(((__AF&&__AF.seats)||[]).find(x=>x.seat===p.judge_seat))}:null;\n"
 " return {...p,verdict_raw:rec?String(p.verdict_raw||'')+__REC(rec):p.verdict_raw,run_token:S.run_token,",'Replay Rows')
OUT['Replay Rows']=s

# ---------------- the added nodes (add/): the acceptance subflow ----------------
A=H+'/add';os.makedirs(A,exist_ok=True)
for f in sorted(os.listdir(L+'/addP')):
    open(f'{A}/{f}','w').write(open(f'{L}/addP/{f}').read().replace('//@@POSTURE@@',P))
