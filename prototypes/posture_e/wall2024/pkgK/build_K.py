# WALL-2024 1611 KJV-only package (pkgK, W2): Part A TEXT AUTHORITY in both debater prompts; Part B Commitment 12 in all 14 agreement copies;
# Part C K-KJV (TRIAL) in the 3 item builders, the cure maps and the 14 cureVerdicts; NOT CHECKED lists to debate_enforcer_log.
# Draft /mnt/project-files/w3/kjv_only_draft.md (rulings WALL-2024 2172). Built from a live fetch (argv[1], must be b2052e19). Writes nothing live.
import json,sys,hashlib,subprocess,os,re
D=os.path.dirname(os.path.abspath(__file__))
live=json.load(open(sys.argv[1]))['workflow'];assert live['versionId'].startswith('b2052e19'),live['versionId']
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
js=lambda t:t.replace('\\','\\\\').replace('"','\\"').replace('\n','\\n')
C12=open(os.path.join(D,'c12.txt')).read().strip('\n');TA=open(os.path.join(D,'textauth.txt')).read().strip('\n')
LIB=open(os.path.join(D,'kkjv_slice.js')).read().strip('\n')
C11_END='does not match my accepted line.";';C11_NEW=C11_END[:-2]+'\\n\\n'+js(C12)+'";'
# Part A
A_LAYER='const LAYER="LAYER RULES:';A_LAYER_NEW='const TEXTAUTH="'+js(TA)+'"; // WALL-2024 Part A (1611 KJV only; operator 2026-11-05 20:26 CST)\n'+A_LAYER
A_USE="'\\n\\n'+LAYER+'\\n\\n'+__PROVE9";A_USE_NEW="'\\n\\n'+TEXTAUTH+'\\n\\n'+LAYER+'\\n\\n'+__PROVE9"
# headings baked into the K-RUL library
ac=[n for n in live['nodes'] if n['name']=='Accept Check'][0]['parameters']['jsCode']
def heads(src):
    i=src.index('const PART2="')+len('const PART2=');j=src.index('";\n',i)+1;return [m.group(1) for m in re.finditer(r'^### (Commitment \d+\. [^\n]+)$',json.loads(src[i:j]),re.M)]
H11=heads(ac);H12=heads(ac.replace(C11_END,C11_NEW));assert len(H11)==11 and len(H12)==12,(len(H11),len(H12))
OLDH=json.dumps(H11,ensure_ascii=False);NEWH=json.dumps(H12,ensure_ascii=False)
LBL="x.rule==='K-RUL')?x.rule+' '+x.link";ASK="x.rule==='K-RUL')?String(x.line||'').trim()"
CV="  {const kr=krulCure(";CV_NEW="  {const kk=kkjvCure(x,reply&&reply.ok?reply.text:'');if(kk)return res(kk.st,kk.why,kk.line?[kk.line]:null);} // K-KJV (TRIAL; Commitment 12)\n"+CV
CALL={'Panel Payloads':("{const KR=krulLines2024(WT,PRS_CTX.R,CPV,krulAcc(jd.body),PT);KR.items.forEach(x=>DRV.items.push(x));KR.marks.forEach(x=>marks.push(x));} // Commitment 11: K-RUL (TRIAL)",
  "{const KK=kkjvLines2024(WT,kkjvRows());KK.items.forEach(x=>DRV.items.push(x));KK.marks.forEach(x=>marks.push(x));} // Commitment 12: K-KJV (TRIAL)"),
 'Alternate Payloads':("{const KR=krulLines2024(WT,PRS_CTX.R,CPV,krulAcc(a.body),PT);KR.items.forEach(x=>DRV.items.push(x));KR.marks.forEach(x=>marks.push(x));} // Commitment 11: K-RUL (TRIAL)",
  "{const KK=kkjvLines2024(WT,kkjvRows());KK.items.forEach(x=>DRV.items.push(x));KK.marks.forEach(x=>marks.push(x));} // Commitment 12: K-KJV (TRIAL)"),
 'Extract Independent Verdict':("{const KR=krulLines2024(raw0,PRS_CTX.R,null,krulAcc(prev&&prev.verdictBody),PT);KR.items.forEach(x=>DRV.items.push(x));KR.marks.forEach(x=>{raw+='\\n\\n'+x;});} // Commitment 11: K-RUL (TRIAL)",
  "{const KK=kkjvLines2024(raw0,kkjvRows());KK.items.forEach(x=>DRV.items.push(x));KK.marks.forEach(x=>{raw+='\\n\\n'+x;});} // Commitment 12: K-KJV (TRIAL; the single judge is cured, WALL-2024 2172)")}
# NOT CHECKED lists (2172 ruling 1): per panel seat and the single judge, to debate_enforcer_log
PP_REP_A="\nif(new Set(summary.map(s=>s.api_model)).size!==3)"
PP_REP_B="\nlet kkjv_report=[];try{const __RW=kkjvRows();__VCW.forEach(w=>{const X=kkjvLines2024(w.WT,__RW);if(X.report.length)kkjv_report.push({seat:w.seat,role:'panel',nc:X.not_checked,report:X.report});});const __ST=SJ&&typeof SJ.independent_verdict_raw==='string'?netUnwrap(SJ.independent_verdict_raw):null;if(__ST!=null){const X=kkjvLines2024(__ST,__RW);if(X.report.length)kkjv_report.push({seat:'single',role:'single',nc:X.not_checked,report:X.report,judge_model:(SJ&&(SJ.judge_model||SJ.independent_model))||null});}}catch(e){kkjv_report=[];} // Commitment 12: K-KJV listed-only report (TRIAL)"+PP_REP_A
PP_RET="panel_effective,vc_single,vc_error}}];";PP_RET_NEW="panel_effective,vc_single,vc_error,kkjv_report}}];"
AM_A="(__PV.vc_single||[]).forEach("
AM_B="(__PV.kkjv_report||[]).forEach(x=>enforcer_log.push({run_token:S.run_token,seat:x.seat,seat_role:x.role,judge_model:x.judge_model||null,kind:'enforcer_check',rule:'K-KJV',item:'NOT CHECKED '+x.nc,flagged_line:x.report.join('\\n').slice(0,4000),prompt_sent:null,full_reply:null,reply_error:null,response_line:null,cure_status:null,cure_reason:'TRIAL rule (listed only; Commitment 12): judge quotes of verses this run did not read, quotes that are not verse quotes, and other versions named',at:__T}));"+AM_A
bad=[];plan={'live_version':live['versionId'],'nodes':[]}
def one(c,a,b,name,tag,done):
    k=c.count(a)
    if k!=1: bad.append(f'{name}: {tag} anchor x{k}');return c
    done.append(tag);return c.replace(a,b)
for n in live['nodes']:
    c0=n.get('parameters',{}).get('jsCode') or '';c=c0;done=[];nm=n['name']
    if nm=='Init with Guards':
        c=one(c,A_LAYER,A_LAYER_NEW,nm,'A TEXTAUTH const',done)
        k=c.count(A_USE)
        if k!=2: bad.append(nm+' A use x'+str(k))
        else: c=c.replace(A_USE,A_USE_NEW);done.append('A both seat profiles')
    if C11_END in c: c=one(c,C11_END,C11_NEW,nm,'C12 in agreement',done)
    if "'K-RUL':11}" in c:
        k=c.count("'K-RUL':11}");c=c.replace("'K-RUL':11}","'K-RUL':11,'K-KJV':12}");done.append(f'RULE_C/RC K-KJV:12 x{k}')
    if 'function kwLines421(' in c:
        c=one(c,"'K-RUL':'TRIAL'};","'K-RUL':'TRIAL','K-KJV':'TRIAL'};",nm,'ENF_STATUS',done)
        c=one(c,'function kconLines2024(',LIB+'\nfunction kconLines2024(',nm,'kkjv lib',done)
        if OLDH in c: c=one(c,OLDH,NEWH,nm,'K-RUL heads 12',done)
    if LBL in c: c=one(c,LBL,LBL.replace("x.rule==='K-RUL')","x.rule==='K-RUL'||x.rule==='K-KJV')"),nm,'cureLabel',done)
    if ASK in c: c=one(c,ASK,ASK.replace("x.rule==='K-RUL')","x.rule==='K-RUL'||x.rule==='K-KJV')"),nm,'cureAsk',done)
    if CV in c:
        if 'function kkjvCure(' not in c: bad.append(nm+': cureVerdicts without the kkjv lib')
        c=one(c,CV,CV_NEW,nm,'cureVerdicts',done)
    if nm in CALL:
        a,b=CALL[nm];c=one(c,a,a+'\n  '+b,nm,'K-KJV call',done)
    if nm=='Panel Payloads':
        c=one(c,PP_REP_A,PP_REP_B,nm,'K-KJV report',done);c=one(c,PP_RET,PP_RET_NEW,nm,'return kkjv_report',done)
    if nm=='Alternate Merge': c=one(c,AM_A,AM_B,nm,'K-KJV log rows',done)
    if c!=c0:
        open('/tmp/_ck.js','w').write('(async function(){'+c+'\n})')
        r=subprocess.run(['node','-e',"new Function('return '+require('fs').readFileSync('/tmp/_ck.js','utf8'))"],capture_output=True,text=True)
        if r.returncode: bad.append('PARSE '+nm+r.stderr[:300])
        os.makedirs(os.path.join(D,'patched'),exist_ok=True);open(os.path.join(D,'patched',nm.replace(' ','_')+'.js'),'w').write(c)
        plan['nodes'].append({'name':nm,'id':n['id'],'live_sha':sha(c0),'final_sha':sha(c),'delta':len(c)-len(c0),'edits':done})
json.dump(plan,open(os.path.join(D,'plan_K.json'),'w'),indent=1)
print(live['versionId'],len(plan['nodes']),'nodes');[print(' ',x['name'].ljust(28),x['live_sha'],'->',x['final_sha'],x['edits']) for x in plan['nodes']]
print('BAD',bad) if bad else print('anchors unique, all parse')
