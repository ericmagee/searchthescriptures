#!/usr/bin/env python3
"""Question-round TRIAL (rulings 413, 415): build new/ and add/ from the live base (c7/fetchback_c7.json)."""
import json, os, uuid, copy
R=os.path.dirname(os.path.abspath(__file__));W=json.load(open(os.path.join(R,'..','c7','fetchback_c7.json')))
N={n['name']:n for n in W['nodes']};os.makedirs(os.path.join(R,'base'),exist_ok=True);os.makedirs(os.path.join(R,'new'),exist_ok=True)
COMMON=open(os.path.join(R,'js','common.js')).read()
def once(s,a,b,nm):
    assert s.count(a)==1,(nm,a[:60],s.count(a));return s.replace(a,b)
changed={}
# Init Seats: the trial flag, dry regrade only
s=N['Init Seats']['parameters']['jsCode']
a="['posture','accept_probe'].forEach(k=>{if(b[k]!==undefined&&b[k]!==null&&typeof b[k]!=='boolean')fail(k+' must be true or false.');});"
s=once(s,a,a+"\n// QUESTION ROUND TRIAL (md_notes_rulings 413, 415): question_trial runs only in a dry regrade; absent, the run is unchanged.\nif(b.question_trial!==undefined&&b.question_trial!==null&&typeof b.question_trial!=='boolean')fail('question_trial must be true or false.');if(b.question_trial===true&&!DRY)fail('question_trial runs only in a dry regrade (md_notes_rulings 413).');",'Init Seats')
s=once(s,"...(PAP?{accept_probe:true}:{}),sd:","...(PAP?{accept_probe:true}:{}),...(b.question_trial===true?{question_trial:true}:{}),sd:",'Init Seats')
changed['Init Seats']=s
# the judge calls read the QR Merge bodies when the trial ran
for nm,n in N.items():
    if nm.startswith('Panel Judge') and n['type'].endswith('httpRequest'):
        jb=n['parameters']['jsonBody'];import re
        m=re.fullmatch(r"=\{\{ \$\('Panel Build'\)\.first\(\)\.json\.judges\[(\d)\]\.body \}\}",jb);assert m,(nm,jb)
        changed[nm]=("={{ $('Init Seats').first().json.question_trial === true ? $('QR Merge').first().json.judges["+m.group(1)+"].body : $('Panel Build').first().json.judges["+m.group(1)+"].body }}")
# Replay Rows: the trial's questions and answers ride in each row's replay record
s=N['Replay Rows']['parameters']['jsCode']
a="const rec=__MODE==='posture'?{mode:'posture',acceptance:__ACC(((__AF&&__AF.seats)||[]).find(x=>x.seat===p.judge_seat))}:null;"
s=once(s,a,a+"\n let __QR=null;try{if(S.question_trial===true&&$('QR Merge').isExecuted){const q=$('QR Merge').first().json;__QR={qa:q.qa,checks:q.record};}}catch(e){__QR=null;}if(rec&&__QR)rec.question_trial=__QR;",'Replay Rows')
changed['Replay Rows']=s
for nm,c in changed.items():
    base=N[nm]['parameters'].get('jsCode') if nm in ('Init Seats','Replay Rows') else N[nm]['parameters']['jsonBody']
    ext='.js' if nm in ('Init Seats','Replay Rows') else '.expr'
    open(os.path.join(R,'base',nm+ext),'w').write(base);open(os.path.join(R,'new',nm+ext),'w').write(c)
# new nodes
HTTP=N['Panel Judge 1 openrouter']
def code(nm,f,pos):return {'parameters':{'jsCode':COMMON+'\n'+open(os.path.join(R,'js',f)).read()},'id':str(uuid.uuid4()),'name':nm,'type':'n8n-nodes-base.code','typeVersion':2,'position':pos}
def http(nm,pos):
    n=copy.deepcopy(HTTP);n['id']=str(uuid.uuid4());n['name']=nm;n['position']=pos;n['parameters']['jsonBody']='={{ $json.body }}';return n
IFN=copy.deepcopy(N['Regrade?']);IFN['id']=str(uuid.uuid4());IFN['name']='QR Trial?';IFN['position']=[10240,-400]
IFN['parameters']['conditions']['conditions'][0]['id']='qr-trial-flag';IFN['parameters']['conditions']['conditions'][0]['leftValue']="={{ $('Init Seats').first().json.question_trial === true }}"
x0,y0=10336,-560
nodes=[IFN,code('QR Ask Build','ask_build.js',[x0,y0]),http('QR Ask',[x0+192,y0]),code('QR Check','check.js',[x0+384,y0]),http('QR Retry Ask',[x0+576,y0]),code('QR Final','final.js',[x0+768,y0]),http('QR Answer',[x0+960,y0]),code('QR Merge','merge.js',[x0+1152,y0])]
for n in nodes:
    if n['type'].endswith('code'):n['onError']='stopWorkflow'
links=[('QR Trial?',0,'QR Ask Build'),('QR Trial?',1,'Panel Judge 1 Route'),('QR Ask Build',0,'QR Ask'),('QR Ask',0,'QR Check'),('QR Check',0,'QR Retry Ask'),('QR Retry Ask',0,'QR Final'),('QR Final',0,'QR Answer'),('QR Answer',0,'QR Merge'),('QR Merge',0,'Panel Judge 1 Route')]
json.dump({'nodes':nodes,'links':links,'reroute':['Panel Build',0,'Panel Judge 1 Route','QR Trial?']},open(os.path.join(R,'add_qr.json'),'w'),indent=1)
print('changed',len(changed),'| new nodes',len(nodes))
