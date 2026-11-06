# Commitment 11 (K-RUL, TRIAL) + Commitment 10 sentence (W3 Part 1 item 4) + cure handling for K-CON, K-CMT, K-RUL (defect in packages A and B,
# WALL-2024 reply 2150). Built from a fresh live fetch (argv[1], must be 8dd6d614). Writes nothing live.
import json,sys,hashlib,subprocess,os,re
D=os.path.dirname(os.path.abspath(__file__))
live=json.load(open(sys.argv[1]))['workflow'];assert live['versionId'].startswith('8dd6d614'),live['versionId']
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
js=lambda t:t.replace('\\','\\\\').replace('"','\\"').replace('\n','\\n')
C11=open(os.path.join(D,'c11.txt')).read().strip('\n')
C10_ADD=' A contradiction is also one the system finds by checking another line of this kind against the rounds.'
C10_END='So is NONE FOUND written where the engine found one.";'
NEW_END=C10_END[:-2]+C10_ADD+'\\n\\n'+js(C11)+'";'
bad=[];plan={'live_version':live['versionId'],'nodes':[]}
def one(c,a,b,name,tag,done):
    k=c.count(a)
    if k!=1: bad.append(f'{name}: {tag} anchor x{k}');return c
    done.append(tag);return c.replace(a,b)
# headings for krulOwn come from the new PART2 (computed below from Accept Check)
ac=[n for n in live['nodes'] if n['name']=='Accept Check'][0]['parameters']['jsCode']
ac2=ac.replace(C10_END,NEW_END)
i=ac2.index('const PART2="')+len('const PART2=');j=ac2.index('";\n',i)+1;P2NEW=json.loads(ac2[i:j])
i0=ac.index('const PART2="')+len('const PART2=');j0=ac.index('";\n',i0)+1;P2OLD_LIT=ac[i0:j0];P2NEW_LIT=ac2[i:j]
HEADS=[m.group(1) for m in re.finditer(r'^### (Commitment \d+\. [^\n]+)$',P2NEW,re.M)]
assert len(HEADS)==11,HEADS
KRUL=open(os.path.join(D,'krul_slice.js')).read().strip('\n').replace('__KRUL_HEADS_JSON__',json.dumps(HEADS,ensure_ascii=False))
CALL={'Panel Payloads':("const CI=drvPressWith(WT,PT,p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,LN);for(const x of CI.items)DRV.items.push(x);for(const x of CI.marks)marks.push(x);",
   "{const KR=krulLines2024(WT,PRS_CTX.R,CPV,krulAcc(jd.body),PT);KR.items.forEach(x=>DRV.items.push(x));KR.marks.forEach(x=>marks.push(x));} // Commitment 11: K-RUL (TRIAL)"),
 'Alternate Payloads':("const CI=drvPressWith(WT,PT,p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,LN);for(const x of CI.items)DRV.items.push(x);for(const x of CI.marks)marks.push(x);",
   "{const KR=krulLines2024(WT,PRS_CTX.R,CPV,krulAcc(a.body),PT);KR.items.forEach(x=>DRV.items.push(x));KR.marks.forEach(x=>marks.push(x));} // Commitment 11: K-RUL (TRIAL)"),
 'Extract Independent Verdict':("const CI=drvPressWith(raw0,PT,conceded_links,challenger_conceded_links,defense_standing,challenge_standing,LN);for(const x of CI.items)DRV.items.push(x);for(const x of CI.marks)raw+='\\n\\n'+x;",
   "{const KR=krulLines2024(raw0,PRS_CTX.R,null,krulAcc(prev&&prev.verdictBody),PT);KR.items.forEach(x=>DRV.items.push(x));KR.marks.forEach(x=>{raw+='\\n\\n'+x;});} // Commitment 11: K-RUL (TRIAL)")}
LBL="x.rule==='K-SC'||x.rule==='K-K')?x.rule+' '+x.link:'K-G3 '+x.side)"
ASK="x.rule==='K-SC'||x.rule==='K-K')?String(x.line||'').trim()"
NEWR="||x.rule==='K-CON'||x.rule==='K-CMT'||x.rule==='K-RUL'"
FALL="  return res('UNCURED','unknown rule',null);});}"
FALL_NEW="  {const kr=krulCure(x,reply&&reply.ok?reply.text:'',R,(x.rule==='K-CMT'?respOf(x):null));if(kr)return res(kr.st,kr.why,kr.line?[kr.line]:null);} // K-CON, K-CMT, K-RUL (TRIAL; form only; WALL-2024 reply 2150)\n"+FALL[:-4]+"}).concat(krulRestated(items,reply,R)); // R7 (W3, reply 2157): RESTATED lines of the cure reply need a card\n}"
for n in live['nodes']:
    c0=n.get('parameters',{}).get('jsCode') or '';c=c0;done=[];nm=n['name']
    if 'const PART2="' in c:
        c=one(c,C10_END,NEW_END,nm,'PART2 C10+C11',done)
    if "'K-V':6,'K-CON':10}" in c:
        k=c.count("'K-V':6,'K-CON':10}");c=c.replace("'K-V':6,'K-CON':10}","'K-V':6,'K-CON':10,'K-RUL':11}");done.append(f'RULE_C/RC K-RUL:11 x{k}')
    if 'function kwLines421(' in c:
        c=one(c,"'K-CON':'TRIAL','K-CMT':'TRIAL'};","'K-CON':'TRIAL','K-CMT':'TRIAL','K-RUL':'TRIAL'};",nm,'ENF_STATUS',done)
        c=one(c,'function kconLines2024(',KRUL+'\nfunction kconLines2024(',nm,'krul lib',done)
    if LBL in c or ASK in c or FALL in c:
        c=one(c,LBL,LBL.replace("x.rule==='K-K')","x.rule==='K-K'"+NEWR+")"),nm,'cureLabel',done)
        c=one(c,ASK,ASK.replace("x.rule==='K-K')","x.rule==='K-K'"+NEWR+")"),nm,'cureAsk',done)
        c=one(c,FALL,FALL_NEW,nm,'cureVerdicts',done)
    if nm in CALL:
        a,b=CALL[nm];c=one(c,a,a+'\n  '+b,nm,'K-RUL call',done)
    if '__JAGR' in c:
        c=one(c,P2OLD_LIT,P2NEW_LIT,nm,'JAGR PART2 refresh',done)
    if c!=c0:
        open('/tmp/_c.js','w').write('(async function(){'+c+'\n})')
        r=subprocess.run(['node','-e',"new Function('return '+require('fs').readFileSync('/tmp/_c.js','utf8'))"],capture_output=True,text=True)
        if r.returncode: bad.append('PARSE '+nm+r.stderr[:300])
        os.makedirs(os.path.join(D,'patched'),exist_ok=True);open(os.path.join(D,'patched',nm.replace(' ','_')+'.js'),'w').write(c)
        plan['nodes'].append({'name':nm,'id':n['id'],'live_sha':sha(c0),'final_sha':sha(c),'delta':len(c)-len(c0),'edits':done})
json.dump(plan,open(os.path.join(D,'plan_D.json'),'w'),indent=1)
print(live['versionId'],len(plan['nodes']),'nodes');[print(' ',x['name'].ljust(28),x['live_sha'],'->',x['final_sha'],x['edits']) for x in plan['nodes']]
print('BAD',bad) if bad else print('anchors unique, all parse')
