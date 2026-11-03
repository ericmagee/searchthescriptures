#!/usr/bin/env python3
"""Posture v5 build on live ORACLE_DEBATE_V1 cb4b94e0. Reads base/ (live code), writes new/ (changed code nodes) and add/ (new code nodes).
Every anchored replacement must occur exactly once, or the build stops."""
import json, os, re, sys, glob, shutil

ROOT = os.path.dirname(os.path.abspath(__file__))
B = os.path.join(ROOT, 'base'); N = os.path.join(ROOT, 'new'); A = os.path.join(ROOT, 'add')
for d in (N, A):
    shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
REPO = '/home/user/searchthescriptures/prototypes/posture_e/POSTURE_v5.md'

code = {}
def get(name):
    if name not in code:
        code[name] = open(os.path.join(B, name + '.js')).read()
    return code[name]
def rep(name, old, new, count=1):
    c = get(name); n = c.count(old)
    if n != count:
        sys.exit(f'STOP: {name}: anchor found {n} times, expected {count}: {old[:90]!r}')
    code[name] = c.replace(old, new)

# ---------- 1. The posture text (Part A, approved) in every node that carries it ----------
md = open(REPO).read()
s = md.index('You are an adjudicator of a debate record.')
e = md.index('## Part B.')
partA = md[s:e]
partA = re.sub(r'\n\(APPROVED by the operator[^\n]*\)', '', partA).strip()
assert 'Commitment 3. Meaning, not words.' in partA and 'APPROVED' not in partA and partA.count('### Commitment') == 6
NEW_PART2 = 'const PART2=' + json.dumps(partA, ensure_ascii=False) + ';'
OLD_PART2 = 'const PART2=' + open(os.path.join(ROOT, 'old_part2.txt')).read() + ';'
for f in sorted(glob.glob(os.path.join(B, '*.js'))):
    nm = os.path.basename(f)[:-3]
    if OLD_PART2 in open(f).read():
        rep(nm, OLD_PART2, NEW_PART2)
open(os.path.join(ROOT, 'part2_new.txt'), 'w').write(partA)

# ---------- 2. Sentence (B) out of the two judge rulebooks (Part C item 4) ----------
OLD_B = open(os.path.join(ROOT, 'oldB.txt')).read()
NEW_B = ("Scripture does not contradict itself: if a link cannot agree with the meaning of a pressed witness, as the debaters show that meaning with its layers, "
         "the link fails; the verse stands, and the link is the error. You weigh only the meaning the debaters show and add none of your own. The wording of "
         "one verse alone never decides a link: \\\"no verse states it\\\", \\\"the text nowhere narrates it\\\" and \\\"no witness's own words state it\\\" are never a "
         "ground, for either side.")
for nm in ('Panel Build', 'Build Independent Verdict'):
    rep(nm, OLD_B, NEW_B)

# ---------- 3. Panel: no answer form (Part 3 of v4 was not approved); no SILENCE / SAME TEST marks ----------
rep('Panel Build', 'if(S.posture===true)SYS=SYS+NL+NL+POSTURE.ANSWER;\n', '/* posture v5: the v4 answer form (SILENCE, SAME TEST) is not part of the approved posture */\n')
rep('Panel Payloads', ' if(S.posture===true)for(const x of postureCheck(WT,drvPromptText(jd.body)).marks)marks.push(x); // judge_fix8 P2: SILENCE, SAME TEST (TRIAL marks)\n', ' /* posture v5: no SILENCE / SAME TEST marks (v4 answer form not approved) */\n')
rep('Alternate Payloads', "  if($('Init Seats').first().json.posture===true)for(const x of postureCheck(WT,drvPromptText(a.body)).marks)marks.push(x); // judge_fix8 P2\n", '  /* posture v5: no SILENCE / SAME TEST marks */\n')

# ---------- 4. Init Seats: the agreement decides who may judge (Parts B, C) ----------
rep('Init Seats', 'const j=$input.first().json;const b=(j&&j.body&&typeof j.body===\'object\')?j.body:j;',
    "const j0=$input.first().json;const AGR=(j0&&j0.acc&&Array.isArray(j0.acc.seats))?j0.acc:null;const j=AGR?j0.src:j0;const b=(j&&j.body&&typeof j.body==='object')?j.body:j;")
rep('Init Seats', "const ORDER=['deepseek','gemini','glm','chatgpt','mimo','qwen','grok','sol'];",
    "const ORDER0=['deepseek','gemini','glm','chatgpt','mimo','qwen','grok','sol'];\n"
    "// posture v5 (rulings 405-407): every judge accepts the posture before the debate is judged; a judge that refuses or fails the agreement twice\n"
    "// does not judge. The agreement ran before this node (Accept Build .. Accept Final); a seat not placed there is dropped from the order, so the\n"
    "// panel, the reserve, the alternates and the single judge are all seats that accepted. One rule for all judges.\n"
    "if(!AGR)throw new Error('ORACLE_DEBATE_V1 Init refused: the judges\\' agreement did not run (Accept Final).'+RT);\n"
    "const __AOK=new Set(AGR.seats.filter(x=>x.placed).map(x=>x.seat));const __AASKED=new Set(AGR.seats.map(x=>x.seat));\n"
    "const AGREE_OUT=ORDER0.filter(s=>__AASKED.has(s)&&!__AOK.has(s));\n"
    "const ORDER=ORDER0.filter(s=>!__AASKED.has(s)||__AOK.has(s));")
rep('Init Seats', "if(panel_order.length!==3)fail('the derived panel is '+panel_order.length+' seat(s) ['+panel_order.join(', ')+']; the roster is exactly three.');",
    "if(panel_order.length!==3)fail('NOT GRADED: the derived panel is '+panel_order.length+' seat(s) ['+panel_order.join(', ')+']; the roster is exactly three'+(AGREE_OUT.length?' (did not accept the posture: '+AGREE_OUT.join(', ')+')':'')+'.');")
rep('Init Seats', "const PPO=b.posture===true,PAP=b.accept_probe===true;\nif((PPO||PAP)&&!DRY)fail('posture and accept_probe run only in a dry regrade.');\nif(PPO&&PAP)fail('posture and accept_probe are separate tests (one change per run); send one.');\nif((PPO||PAP)&&RB!=='current')fail('posture and accept_probe run on the current rulebook only.');\nif((PPO||PAP)&&(TFS!==null||TFR||TNF||QA!==null))fail('posture and accept_probe are not combined with test_fail_seat, test_fail_reserve, test_no_fallback or qualify_alternate.');\nif(PPO||PAP)$execution.customData.set('posture_test',PPO?'posture':'accept_probe');",
    "// posture v5: the posture runs on every debate, live or regrade; the old test switches are gone.\nconst PPO=true,PAP=false;if(b.accept_probe===true)fail('accept_probe is retired: the agreement runs on every debate (posture v5).');\n$execution.customData.set('posture_accept',AGR.seats.map(x=>x.seat+':'+x.status).join(','));")
rep('Init Seats', "single_judge:free[0],", "single_judge:free[0],agreement_out:AGREE_OUT,")

# ---------- 5. The single judge takes the same agreement (Part C, "one rule for all judges") ----------
rep('Build Independent Verdict', "const __JFAM2={deepseek:'deepseek',gemini:'openrouter',grok:'openrouter',chatgpt:'openrouter',mimo:'openrouter',glm:'openrouter',qwen:'openrouter'};",
    "const __JFAM2={deepseek:'deepseek',gemini:'openrouter',grok:'openrouter',chatgpt:'openrouter',mimo:'openrouter',glm:'openrouter',qwen:'openrouter',sol:'openrouter'};")
rep('Build Independent Verdict', "const __bf='verdictBody';const __b0=__out[__bf];const __sys2=__b0.messages[0].content;const __usr2=__b0.messages[1].content;const __m2=[{role:'system',content:__sys2},{role:'user',content:__usr2}];",
    "const __bf='verdictBody';const __b0=__out[__bf];const __sys2=__b0.messages[0].content;const __usr2=__b0.messages[1].content;\n"
    "// posture v5: the single judge's own accepted exchange heads its conversation, as the panel's does (Accept Final). A single judge that did not\n"
    "// accept is never seated (Init Seats), so a missing exchange is a fault.\n"
    "const __A2=(()=>{let A=null;try{A=$('Accept Final').first().json.acc;}catch(e){A=null;}return A&&Array.isArray(A.seats)?A.seats.find(x=>x.seat===__sj2)||null:null;})();\n"
    "if(!__A2||!__A2.placed||!Array.isArray(__A2.exchange))throw new Error('FAIL-CLOSED: single judge \"'+__sj2+'\" has no accepted posture exchange (Accept Final).'+__RT2);\n"
    "const __H2=__A2.exchange.map(m=>({role:m.role,content:m.content}));\n"
    "const __m2=[{role:'system',content:__sys2}].concat(__H2,[{role:'user',content:__usr2}]);")
rep('Build Independent Verdict', "if(__fam2==='gemini')__nb={systemInstruction:{parts:[{text:__sys2}]},contents:[{role:'user',parts:[{text:__usr2}]}],generationConfig:{maxOutputTokens:__base2,temperature:0}};",
    "if(__fam2==='gemini')__nb={systemInstruction:{parts:[{text:__sys2}]},contents:__H2.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}]})).concat([{role:'user',parts:[{text:__usr2}]}]),generationConfig:{maxOutputTokens:__base2,temperature:0}};")
# the single judge's checker reads the debate from the body: it skips the posture exchange, as the panel's checker does
rep('Extract Independent Verdict', "(b.messages||[]).forEach(m=>{const c=m&&m.content;if(typeof c==='string')out.push(c);",
    "(b.messages||[]).filter((m,i,a)=>{const tx=x=>typeof x==='string'?x:Array.isArray(x)?x.map(p=>p&&p.text||'').join(''):'';const H=/^POSTURE (?:FOR ACCEPTANCE|RETURNED)/;if(m&&m.role==='user')return !H.test(tx(m.content));if(m&&m.role==='assistant'){const p=a[i-1];return !(p&&p.role==='user'&&H.test(tx(p.content)));}return true;}).forEach(m=>{const c=m&&m.content;if(typeof c==='string')out.push(c);")
# the single judge's cure quotes back its own accepted line (Part B item 6)
rep('Cure Build', "body:cureBody(fam,B.verdictBody,answer,cureAsk(items,cureBroken(answer)))}}}];",
    "body:cureBody(fam,B.verdictBody,answer,cureAsk(items,cureBroken(answer))+__sjQuote(items))}}}];")
rep('Cure Build', "const E=$input.first().json;const B=$('Build Independent Verdict').first().json;",
    "const E=$input.first().json;const B=$('Build Independent Verdict').first().json;\n"
    "// posture v5 (Part B item 6): at the cure, the single judge's own accepted line for the commitment the flagged line breaks.\n"
    "const __sjQuote=(items)=>{let a=null;try{const sj=$('Init Seats').first().json.single_judge;a=($('Accept Final').first().json.acc.seats||[]).find(x=>x.seat===sj)||null;}catch(e){a=null;}\n"
    " if(!a||!a.placed||!a.lines)return '';const RC={'K-LXX':1,'K-LB':2,'K-C':3,'K-S':3,'K-S2':3,'K-G1':5,'K-G4':5,'K-G6':5,'K-G7':5,'K-G10':5,'K-G11':5,'K-U':5,'K-V':6};const out=[];\n"
    " for(const x of (items||[])){const c=RC[x&&x.rule];if(!c||!a.lines[c])continue;const ln=String(x.line||'').replace(/\\s+/g,' ').trim();if(!ln)continue;\n"
    "  out.push('- '+(x.link?x.link+' ':'')+'('+x.rule+', commitment '+c+'): You accepted: \"'+a.lines[c]+'\". Your line: \"'+ln.slice(0,600)+'\".');}\n"
    " return out.length?'\\n\\nTHE POSTURE YOU ACCEPTED, QUOTED BACK (your own words at the acceptance turn, beside the line the item flags):\\n'+out.join('\\n'):'';};")

# ---------- 6. The debaters: prove every position (Part E, ruling 408) ----------
md_e = md[md.index('## Part E.'):]
pe = md_e[md_e.index('**Prove every position'):]
pe = pe[:pe.index('\n\n## ')] if '\n\n## ' in pe else pe
pe = pe.replace('**', '').strip()
assert pe.startswith('Prove every position with the layers. A statement of your position is not proof of it.')
PROVE = 'const PROVE=' + json.dumps('\n\nPROVE YOUR POSITIONS. ' + pe, ensure_ascii=False) + ';\n'
rep('Init with Guards', "const dsys=build('DEFENDER',S.defender,S.dpos);const csys=build('CHALLENGER',S.challenger,S.cpos);",
    "// posture v5 Part E (ruling 397, approved 408): both debaters, the Debate Oracle and the other seat alike.\n" + PROVE +
    "const dsys=build('DEFENDER',S.defender,S.dpos)+PROVE;const csys=build('CHALLENGER',S.challenger,S.cpos)+PROVE;")

# ---------- 7. The record: the agreement saved with the debate and printed in the transcript (Part C item 3) ----------
rep('Build Save Body', "const RN=FF.length?FF.join(' '):null;",
    "// posture v5 (Part C item 3): each judge's agreement, saved with the debate.\n"
    "try{const AG=$('Accept Final').first().json.acc;(AG.seats||[]).forEach(x=>FF.push('[AGREEMENT -- seat '+x.seat+' ('+x.api_model+'): '+x.status+(x.placed?'; may judge':'; did not accept, not seated')+((x.faults||[]).length?'; first reply faults: '+x.faults.join('; '):'')+(x.return_status?'; after the return: '+x.return_status:'')+']'));}catch(e){FF.push('[AGREEMENT -- record not found: '+String(e.message||e).slice(0,120)+'. REVIEW THIS ROW.]');}\n"
    "const RN=FF.length?FF.join(' '):null;")
rep('Plain Rule Lines', "const md = md0 + TAIL;",
    "// posture v5 (Part C item 3): the judges' agreement, printed in the transcript before what the judges were sent.\n"
    "let AGM='';try{const AG=$('Accept Final').first().json.acc;const q=t=>String(t==null?'':t).split('\\n').map(l=>'> '+l).join('\\n');\n"
    " AGM='\\n## The judges\\' agreement\\n\\nBefore the debate was judged, every judge was sent the posture and asked to accept it. A judge that refused, or failed the check twice, did not judge.\\n\\n'+\n"
    "  (AG.seats||[]).map(x=>'### '+x.seat+' ('+x.api_model+'): '+x.status+(x.placed?'':' -- not seated')+'\\n\\n'+q(x.first_text)+(x.return_text!=null?'\\n\\nReturned once ('+(x.faults||[]).join('; ')+'):\\n\\n'+q(x.return_text):'')).join('\\n\\n')+'\\n';}catch(e){AGM='\\n## The judges\\' agreement\\n\\nThe agreement record was not found.\\n';}\n"
    "const md = md0 + AGM + TAIL;")

# ---------- 8. The GLM retraction fix (run 32341) in every cure parser ----------
OLD_R = r"!/\bLINK\s+BROKEN\b/i.test(m[3].replace(/\bnot\s+(?:a\s+)?(?:\S+\s+)?LINK\s+BROKEN\b/ig,''))"
NEW_R = r"!/\bLINK\s+BROKEN\b/i.test(m[3].replace(/\bnot\s+(?:a\s+)?(?:\S+\s+)?LINK\s+BROKEN\b/ig,'').replace(/\b(?:(?:DEFENDER|CHALLENGER)\s+)?LINK\s+BROKEN\s+(?:grade|ruling|mark|label|line|verdict)s?\b/ig,''))"
for f in sorted(glob.glob(os.path.join(B, '*.js'))):
    nm = os.path.basename(f)[:-3]
    if OLD_R in get(nm):
        rep(nm, OLD_R, NEW_R)

# ---------- 9. The agreement subflow: moved to the start of every debate, all judges, DeepSeek included ----------
def lib_from(name):
    c = get(name); i = c.index('const POSTURE=(()=>{'); j = c.index('})();', c.index('return {PART2,HEADS', i)) + 5
    return c[i:j]
LIB = lib_from('Accept Final')
assert NEW_PART2 in LIB
SRC = ("const __SRC=(()=>{for(const n of ['Debate Start','Dry Run Config']){try{if($(n).isExecuted)return $(n).first().json;}catch(e){}}return {};})();\n"
       "const __B=(__SRC&&__SRC.body&&typeof __SRC.body==='object')?__SRC.body:__SRC;const RT=' execution='+$execution.id;\n")

code['Accept Build'] = ("// posture v5 (rulings 405-407): the agreement, before anything else in the debate. Every seat that may judge (ORDER less the debaters and qwen,\n"
 "// which judges nowhere) is sent the posture alone: no rulebook, no debate. DeepSeek (the single judge) goes by its own API (Accept DS Build).\n" + LIB + "\n" + SRC +
 "const __orc=(b,model,key)=>{if(!b||!Array.isArray(b.messages))return b;return {...b,session_id:String(key).slice(0,128)};};\n"
 "const ENG_SEAT={deepseek:'deepseek',gemini:'gemini',glm:'glm',chatgpt:'chatgpt',mimo:'mimo',qwen:'qwen',grok:'grok',sol:'sol'};\n"
 "const ORDER=['deepseek','gemini','glm','chatgpt','mimo','qwen','grok','sol'];\n"
 "const deb=[__B.defender,__B.challenger].map(x=>String((x&&x.engine)||'').trim().toLowerCase());\n"
 "const M={};$input.all().forEach(i=>{const x=i.json;if(x&&x.seat)M[x.seat]=x;});\n"
 "const seats=ORDER.filter(s=>deb.indexOf(s)<0&&s!=='qwen');\n"
 "const out=[];let ds=null;\n"
 "for(const s of seats){const x=M[s];if(!x||!x.api_model)throw new Error('FAIL-CLOSED: Accept Build: seat \"'+s+'\" has no ACTIVE model_config row.'+RT);\n"
 " const mt=Math.max(Number(x.max_tokens)||0,8000);const m=[{role:'user',content:POSTURE.PROMPT}];\n"
 " if(s==='deepseek'){ds={seat:s,role:'judge',api_model:x.api_model,fam:'deepseek',body:{model:x.api_model,max_tokens:Math.max(mt,8000),messages:m}};continue;}\n"
 " const body=/^x-ai\\/|^google\\//.test(x.api_model)?{model:x.api_model,max_tokens:mt,temperature:0,messages:m}:/^xiaomi\\//.test(x.api_model)?{model:x.api_model,max_tokens:Math.max(mt,65536),messages:m}:{model:x.api_model,max_tokens:mt,messages:m};\n"
 " out.push({json:{acc:{seat:s,role:'judge',api_model:x.api_model,fam:'openrouter',body:__orc(body,x.api_model,$execution.id+':accept:'+s)},ds}});}\n"
 "if(!out.length)throw new Error('FAIL-CLOSED: Accept Build: no openrouter judge seat to ask.'+RT);\n"
 "out.forEach(o=>{o.json.ds=ds;});\nreturn out;\n")

code['Accept DS Build'] = ("// posture v5: DeepSeek's acceptance call, by its own API, or a skip item when DeepSeek debates.\n"
 "const ds=$('Accept Build').first().json.ds;return [{json:ds?{acc:ds}:{skip:true}}];\n")

code['Accept Check'] = ("// posture v5: the code check of every acceptance reply (headings verbatim, the acceptance line verbatim; own-words lines kept, not graded).\n" + LIB + "\n" + SRC +
 "const B=$('Accept Build').all().map(i=>i.json.acc);const R=$('Accept Call openrouter').all().map(i=>i.json);\n"
 "if(R.length!==B.length)throw new Error('FAIL-CLOSED: Accept Check read '+R.length+' replies for '+B.length+' acceptance calls.'+RT);\n"
 "let DSB=null,DSR=null;try{if($('Accept Call deepseek').isExecuted){DSB=$('Accept DS Build').first().json.acc;DSR=$('Accept Call deepseek').first().json;}}catch(e){DSB=null;}\n"
 "const all=B.map((b,i)=>({b,r:R[i]}));if(DSB)all.push({b:DSB,r:DSR});\n"
 "const seats=all.map(({b,r})=>{const e=POSTURE.env(r);const c=e.ok?POSTURE.check(e.text):{status:'ERROR',faults:['call failed: '+e.why],lines:{},accept_line:false};\n"
 " return {seat:b.seat,role:b.role,api_model:b.api_model,fam:b.fam,first:{...c,text:e.ok?e.text:null,finish:e.ok?e.finish:null,model_served:(r&&r.model)||null}};});\n"
 "const ret=seats.map((s,i)=>s.first.status==='FAULT'?i:-1).filter(i=>i>=0);\n"
 "return [{json:{acc:{seats,ret}}}];\n")

code['Accept Return Build'] = ("// posture v5: the one return (the seat's own exchange, then the fault named), openrouter seats here; DeepSeek in Accept DS Return Build.\n" + LIB + "\n" +
 "const A=$('Accept Check').first().json.acc;const all=$('Accept Build').all().map(i=>i.json.acc);let DSB=null;try{if($('Accept Call deepseek').isExecuted)DSB=$('Accept DS Build').first().json.acc;}catch(e){DSB=null;}if(DSB)all.push(DSB);\n"
 "const out=A.ret.filter(i=>A.seats[i].fam==='openrouter').map(i=>{const s=A.seats[i];const body=JSON.parse(JSON.stringify(all[i].body));\n"
 " body.messages=body.messages.concat([{role:'assistant',content:s.first.text},{role:'user',content:POSTURE.RET(s.first.faults)}]);\n"
 " return {json:{acc:{idx:i,seat:s.seat,body}}};});\n"
 "return out.length?out:[{json:{skip:true}}];\n")

code['Accept DS Return Build'] = ("// posture v5: DeepSeek's one return, by its own API, or a skip item.\n" + LIB + "\n" +
 "const A=$('Accept Check').first().json.acc;let DSB=null;try{if($('Accept Call deepseek').isExecuted)DSB=$('Accept DS Build').first().json.acc;}catch(e){DSB=null;}\n"
 "const i=A.seats.findIndex(s=>s.fam==='deepseek');\n"
 "if(!DSB||i<0||A.ret.indexOf(i)<0)return [{json:{skip:true}}];\n"
 "const s=A.seats[i];const body=JSON.parse(JSON.stringify(DSB.body));body.messages=body.messages.concat([{role:'assistant',content:s.first.text},{role:'user',content:POSTURE.RET(s.first.faults)}]);\n"
 "return [{json:{acc:{idx:i,seat:s.seat,body}}}];\n")

code['Accept Final'] = ("// posture v5: each seat's final agreement status, and the exchange that heads its judging conversation. A seat whose status is not one of\n"
 "// ACCEPT, HEDGE, ACCEPT_ON_RETURN, HEDGE_ON_RETURN is not placed and does not judge (Init Seats drops it; ruling 406).\n" + LIB + "\n" + SRC +
 "const A=$('Accept Check').first().json.acc;\n"
 "const second={};const take=(bn,cn)=>{let RB=[],RR=[];try{if($(cn).isExecuted){RB=$(bn).all().map(i=>i.json.acc).filter(Boolean);RR=$(cn).all().map(i=>i.json);}}catch(e){RB=[];RR=[];}\n"
 " if(RB.length!==RR.length)throw new Error('FAIL-CLOSED: Accept Final read '+RR.length+' return replies for '+RB.length+' returns ('+cn+').'+RT);\n"
 " RB.forEach((b,k)=>{const e=POSTURE.env(RR[k]);second[b.idx]={...(e.ok?POSTURE.check(e.text):{status:'ERROR',faults:['call failed: '+e.why],lines:{},accept_line:false}),text:e.ok?e.text:null,finish:e.ok?e.finish:null};});};\n"
 "take('Accept Return Build','Accept Return Call openrouter');take('Accept DS Return Build','Accept Return Call deepseek');\n"
 "const seats=A.seats.map((s,i)=>{const r=second[i]||null;const status=POSTURE.final(s.first,r);const use=r&&(status==='ACCEPT_ON_RETURN'||status==='HEDGE_ON_RETURN')?r:s.first;\n"
 " const exchange=[{role:'user',content:POSTURE.PROMPT},{role:'assistant',content:s.first.text||''}].concat(r?[{role:'user',content:POSTURE.RET(s.first.faults)},{role:'assistant',content:r.text||''}]:[]);\n"
 " return {seat:s.seat,role:s.role,api_model:s.api_model,fam:s.fam,status,placed:POSTURE.PLACED.indexOf(status)>=0,lines:use.lines||{},faults:s.first.faults,return_faults:r?r.faults:null,\n"
 "  first_text:s.first.text,return_text:r?r.text:null,first_status:s.first.status,return_status:r?r.status:null,exchange};});\n"
 "$execution.customData.set('posture_accept',seats.map(s=>s.seat+':'+s.status).join(','));\n"
 "return [{json:{acc:{seats,probe:false},src:__SRC}}];\n")

# ---------- write ----------
changed = {k: v for k, v in code.items() if not os.path.exists(os.path.join(B, k + '.js')) or v != open(os.path.join(B, k + '.js')).read()}
for k, v in changed.items():
    d = A if not os.path.exists(os.path.join(B, k + '.js')) else N
    open(os.path.join(d, k + '.js'), 'w').write(v)
print('changed', sorted(k for k in changed if os.path.exists(os.path.join(B, k + '.js'))))
print('added', sorted(k for k in changed if not os.path.exists(os.path.join(B, k + '.js'))))
