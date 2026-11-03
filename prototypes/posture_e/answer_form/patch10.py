#!/usr/bin/env python3
"""The agreed posture draft v4, Part 3 (the answer form: SILENCE and SAME TEST, with their TRIAL checks), restored for every judge.
Operator 2026-11-03 03:4x CST: "i want the posture and acceptance that was agreed on"."""
import os,sys,shutil
H=os.path.dirname(os.path.abspath(__file__));B=H+'/base';N=H+'/new'
shutil.rmtree(N,ignore_errors=True);os.makedirs(N)
code={f[:-3]:open(B+'/'+f).read() for f in os.listdir(B)}
def rep(nm,old,new,count=1):
    c=code[nm].count(old)
    if c!=count:sys.exit(f'STOP {nm}: {c}x: {old[:100]!r}')
    code[nm]=code[nm].replace(old,new)
def fn(src,name):
    i=src.index('function '+name+'(');k=src.index('{',i);d=0
    for k in range(k,len(src)):
        if src[k]=='{':d+=1
        elif src[k]=='}':
            d-=1
            if d==0:return src[i:k+1]
# panel (and the reserve and alternates, whose bodies are built from the panel's): the answer form back in the rulebook
rep('Panel Build',"/* posture v5: the v4 answer form (SILENCE, SAME TEST) is not part of the approved posture */\n",
    "if(S.posture===true)SYS=SYS+NL+NL+POSTURE.ANSWER; /* the agreed posture draft v4, Part 3: the answer form, restored */\n")
rep('Panel Payloads'," /* posture v5: no SILENCE / SAME TEST marks (v4 answer form not approved) */\n",
    " if(S.posture===true)for(const x of postureCheck(WT,drvPromptText(jd.body)).marks)marks.push(x); // agreed posture v4 Part 3: SILENCE, SAME TEST (TRIAL marks), restored\n")
rep('Alternate Payloads',"  /* posture v5: no SILENCE / SAME TEST marks */\n",
    "  if($('Init Seats').first().json.posture===true)for(const x of postureCheck(WT,drvPromptText(a.body)).marks)marks.push(x); // agreed posture v4 Part 3, restored\n")
# the single judge: one rule for all judges (ruling 407)
ANS=code['Panel Build'][code['Panel Build'].index("const ANSWER='"):]
ANS=ANS[:ANS.index("';")+2]
rep('Build Independent Verdict',"const __sys2=__b0.messages[0].content;",
    "const __ANS2"+ANS[len("const ANSWER"):]+" /* agreed posture v4 Part 3, for the single judge as for the panel (ruling 407) */\nconst __sys2=__b0.messages[0].content+(__S2.posture===true?'\\n\\n'+__ANS2:'');")
PP=code['Panel Payloads']
lib="// agreed posture v4 Part 3: the SILENCE and SAME TEST checks (TRIAL marks), as the panel's checker reads them\n"+fn(PP,'postureBlock')+"\n"+fn(PP,'postureCheck')+"\n"
rep('Extract Independent Verdict',"function drvPromptText(",lib+"function drvPromptText(")
rep('Extract Independent Verdict',"const DRV=drvCheck(raw0,conceded_links,challenger_conceded_links,defense_standing,challenge_standing,askedD,drvLinks(drvPromptText(prev&&prev.verdictBody)));for(const x of DRV.marks)raw+='\\n\\n'+x;",
    "const DRV=drvCheck(raw0,conceded_links,challenger_conceded_links,defense_standing,challenge_standing,askedD,drvLinks(drvPromptText(prev&&prev.verdictBody)));for(const x of DRV.marks)raw+='\\n\\n'+x;\n{let __po=false;try{__po=$('Init Seats').first().json.posture===true;}catch(e){__po=false;}if(__po)for(const x of postureCheck(raw0,drvPromptText(prev&&prev.verdictBody)).marks)raw+='\\n\\n'+x;} /* agreed posture v4 Part 3 */")
for k,v in code.items():
    if v!=open(B+'/'+k+'.js').read():open(N+'/'+k+'.js','w').write(v)
print('changed',sorted(os.listdir(N)))
