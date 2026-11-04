#!/usr/bin/env python3
"""Ruling 421 DeepSeek enforcer (TRIAL): a structural guarded write over live e998c971. Adds Enforcer Build, Enforcer Needed?, Enforcer Call deepseek,
Enforcer Record between Panel Cure Check and Alternate Needed?, and joins the enforcer rows to the log in Alternate Merge. Dry by default; --write writes."""
import json, os, sys, copy, uuid, subprocess, urllib.request
ROOT=os.path.dirname(os.path.abspath(__file__));URL='https://truthapp.app.n8n.cloud/api/v1/workflows/moMxiV4Irg1uRBZN';KEY=os.environ['N8N_API_KEY'];WRITE='--write' in sys.argv
def req(m,b=None):
    r=urllib.request.Request(URL,method=m,data=None if b is None else json.dumps(b).encode(),headers={'X-N8N-API-KEY':KEY,'Content-Type':'application/json','Accept':'application/json'})
    return json.load(urllib.request.urlopen(r,timeout=180))
BASE=json.load(open(os.path.join(ROOT,'..','s421i','fetchback_s421i.json')))
live=req('GET');bad=[]
if live.get('versionId')!=BASE.get('versionId'):bad.append('versionId moved: '+str(live.get('versionId')))
if len(live['nodes'])!=len(BASE['nodes']):bad.append('node count moved')
if json.dumps(live['connections'],sort_keys=True)!=json.dumps(BASE['connections'],sort_keys=True):bad.append('connections moved')
LN={n['name']:n for n in live['nodes']}
NEWN=['Enforcer Build','Enforcer Needed?','Enforcer Call deepseek','Enforcer Record']
for n in NEWN:
    if n in LN:bad.append('node exists: '+n)
if live['connections'].get('Panel Cure Check',{}).get('main')!=[[{'node':'Alternate Needed?','type':'main','index':0}]]:bad.append('Panel Cure Check wiring is not as read')
AM=LN['Alternate Merge']['parameters']['jsCode']
A="const enforcer_log=[].concat(PP.enforcer_log||[]);try{if($('Cure Check').isExecuted)($('Cure Check').first().json.enforcer_log||[]).forEach(x=>enforcer_log.push(x));}catch(e){}"
if AM.count(A)!=1:bad.append('Alternate Merge anchor count '+str(AM.count(A)))
AMn=AM.replace(A,A+"\ntry{if($('Enforcer Record').isExecuted)($('Enforcer Record').first().json.enf421_rows||[]).forEach(x=>enforcer_log.push(x));}catch(e){} // ruling 421: the DeepSeek enforcer's rows (TRIAL)")
code={'Enforcer Build':open(os.path.join(ROOT,'enforcer_build.js')).read(),'Enforcer Record':open(os.path.join(ROOT,'enforcer_record.js')).read(),'Alternate Merge':AMn}
for nm,c in code.items():
    pr=subprocess.run(['node','-e',"new Function(require('fs').readFileSync(0,'utf8'))"],input=c,capture_output=True,text=True)
    if pr.returncode!=0:bad.append('PARSE FAIL '+nm)
if bad:print('REFUSED:',bad);sys.exit(1)
new=copy.deepcopy(live);N={n['name']:n for n in new['nodes']}
N['Alternate Merge']['parameters']['jsCode']=AMn
px,py=LN['Panel Cure Check']['position']
cn=lambda name,pos,c:{'id':str(uuid.uuid4()),'name':name,'type':'n8n-nodes-base.code','typeVersion':LN['Panel Cure Check']['typeVersion'],'position':pos,'parameters':{'jsCode':c}}
ifn=copy.deepcopy(LN['Alternate Needed?']);ifn['id']=str(uuid.uuid4());ifn['name']='Enforcer Needed?';ifn['position']=[px+220,py+360]
ifn['parameters']['conditions']['conditions'][0]['id']='enforcer-needed-421';ifn['parameters']['conditions']['conditions'][0]['leftValue']='={{ $json.enf_skip !== true }}'
call=copy.deepcopy(LN['Accept Call deepseek']);call['id']=str(uuid.uuid4());call['name']='Enforcer Call deepseek';call['position']=[px+440,py+300];call['parameters']['jsonBody']='={{ $json.body }}';call['onError']='continueRegularOutput'
new['nodes']+= [cn('Enforcer Build',[px,py+360],code['Enforcer Build']),ifn,call,cn('Enforcer Record',[px+660,py+360],code['Enforcer Record'])]
C=new['connections'];M=lambda n:{'node':n,'type':'main','index':0}
C['Panel Cure Check']={'main':[[M('Enforcer Build')]]}
C['Enforcer Build']={'main':[[M('Enforcer Needed?')]]}
C['Enforcer Needed?']={'main':[[M('Enforcer Call deepseek')],[M('Enforcer Record')]]}
C['Enforcer Call deepseek']={'main':[[M('Enforcer Record')]]}
C['Enforcer Record']={'main':[[M('Alternate Needed?')]]}
print(f"guards passed on live {live['versionId']}; nodes {len(live['nodes'])} -> {len(new['nodes'])}; call node creds {call.get('credentials')}")
if not WRITE:print('DRY: nothing written');sys.exit()
req('PUT',{k:new[k] for k in ('name','nodes','connections','settings')})
back=req('GET');BN={n['name']:n for n in back['nodes']};fail=[]
for nm in NEWN:
    if nm not in BN:fail.append('missing '+nm)
for nm in ['Enforcer Build','Enforcer Record','Alternate Merge']:
    if nm in BN and BN[nm]['parameters'].get('jsCode')!=code[nm]:fail.append('code differs '+nm)
for nm,n in LN.items():
    if nm!='Alternate Merge' and json.dumps(BN[nm]['parameters'],sort_keys=True)!=json.dumps(n['parameters'],sort_keys=True):fail.append('moved '+nm)
for k in ['Panel Cure Check','Enforcer Build','Enforcer Needed?','Enforcer Call deepseek','Enforcer Record']:
    if json.dumps(back['connections'].get(k),sort_keys=True)!=json.dumps(C[k],sort_keys=True):fail.append('wiring '+k)
for k,v in live['connections'].items():
    if k!='Panel Cure Check' and json.dumps(back['connections'].get(k),sort_keys=True)!=json.dumps(v,sort_keys=True):fail.append('wiring moved '+k)
json.dump(back,open(os.path.join(ROOT,'fetchback_s421j.json'),'w'))
if back.get('activeVersionId')!=back.get('versionId') or not back.get('active'):fail.append('NOT PUBLISHED')
print('FETCH-BACK','OK' if not fail else 'FAIL '+str(fail),'| versionId',back.get('versionId'),'| activeVersionId',back.get('activeVersionId'),'| active',back.get('active'),'| nodes',len(back['nodes']))
