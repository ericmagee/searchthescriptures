#!/usr/bin/env python3
"""s427a ruling 427 closing-round anti-cheat (TRIAL): structural guarded write over live 1a3cf903. Adds Anticheat Build, Anticheat Needed?,
Anticheat Call deepseek, Anticheat Record between (Check Save, Regrade After Quotes? true) and Panel Build; hooks Panel Build, Build Independent
Verdict and Build Save Body. Dry by default; --write writes."""
import json, os, sys, copy, uuid, subprocess, urllib.request
ROOT=os.path.dirname(os.path.abspath(__file__));URL='https://truthapp.app.n8n.cloud/api/v1/workflows/moMxiV4Irg1uRBZN';KEY=os.environ['N8N_API_KEY'];WRITE='--write' in sys.argv
def req(m,b=None):
    r=urllib.request.Request(URL,method=m,data=None if b is None else json.dumps(b).encode(),headers={'X-N8N-API-KEY':KEY,'Content-Type':'application/json','Accept':'application/json'})
    return json.load(urllib.request.urlopen(r,timeout=180))
BASE=json.load(open(os.path.join(ROOT,'..','s425b','fetchback_s425b.json')))
live=req('GET');bad=[]
if live.get('versionId')!=BASE.get('versionId'):bad.append('versionId moved: '+str(live.get('versionId')))
if len(live['nodes'])!=len(BASE['nodes']):bad.append('node count moved')
if json.dumps(live['connections'],sort_keys=True)!=json.dumps(BASE['connections'],sort_keys=True):bad.append('connections moved')
LN={n['name']:n for n in live['nodes']}
NEWN=['Anticheat Build','Anticheat Needed?','Anticheat Call deepseek','Anticheat Record']
for n in NEWN:
    if n in LN:bad.append('node exists: '+n)
M=lambda n,i=0:{'node':n,'type':'main','index':i}
if live['connections'].get('Check Save',{}).get('main')!=[[M('Panel Build')],[M('Failure Salvage')]]:bad.append('Check Save wiring not as read')
if live['connections'].get('Regrade After Quotes?',{}).get('main')!=[[M('Panel Build')],[M('Build Independent Verdict')]]:bad.append('Regrade After Quotes? wiring not as read')
CH=['Panel Build','Build Independent Verdict','Build Save Body']
for nm in CH:
    if LN[nm]['parameters'].get('jsCode')!=open(os.path.join(ROOT,'base',nm+'.js')).read():bad.append('live differs from base: '+nm)
code={nm:open(os.path.join(ROOT,'new',nm+'.js')).read() for nm in CH+['Anticheat Build','Anticheat Record']}
for nm,c in code.items():
    pr=subprocess.run(['node','-e',"new Function(require('fs').readFileSync(0,'utf8'))"],input=c,capture_output=True,text=True)
    if pr.returncode!=0:bad.append('PARSE FAIL '+nm)
if bad:print('REFUSED:',bad);sys.exit(1)
new=copy.deepcopy(live);N={n['name']:n for n in new['nodes']}
for nm in CH:N[nm]['parameters']['jsCode']=code[nm]
px,py=LN['Check Save']['position']
cn=lambda name,pos,c:{'id':str(uuid.uuid4()),'name':name,'type':'n8n-nodes-base.code','typeVersion':LN['Enforcer Build']['typeVersion'],'position':pos,'parameters':{'jsCode':c}}
ifn=copy.deepcopy(LN['Enforcer Needed?']);ifn['id']=str(uuid.uuid4());ifn['name']='Anticheat Needed?';ifn['position']=[px+60,py+420]
ifn['parameters']['conditions']['conditions'][0]['id']='anticheat-needed-427';ifn['parameters']['conditions']['conditions'][0]['leftValue']='={{ $json.acx_skip !== true }}'
call=copy.deepcopy(LN['Enforcer Call deepseek']);call['id']=str(uuid.uuid4());call['name']='Anticheat Call deepseek';call['position']=[px+120,py+300]
assert call['parameters']['jsonBody']=='={{ $json.body }}' and call.get('onError')=='continueRegularOutput'
new['nodes']+=[cn('Anticheat Build',[px,py+300],code['Anticheat Build']),ifn,call,cn('Anticheat Record',[px+180,py+420],code['Anticheat Record'])]
C=new['connections']
C['Check Save']={'main':[[M('Anticheat Build')],[M('Failure Salvage')]]}
C['Regrade After Quotes?']={'main':[[M('Anticheat Build')],[M('Build Independent Verdict')]]}
C['Anticheat Build']={'main':[[M('Anticheat Needed?')]]}
C['Anticheat Needed?']={'main':[[M('Anticheat Call deepseek')],[M('Anticheat Record')]]}
C['Anticheat Call deepseek']={'main':[[M('Anticheat Record')]]}
C['Anticheat Record']={'main':[[M('Panel Build')]]}
print(f"guards passed on live {live['versionId']}; nodes {len(live['nodes'])} -> {len(new['nodes'])}; call creds {call.get('credentials')}")
if not WRITE:print('DRY: nothing written');sys.exit()
req('PUT',{k:new[k] for k in ('name','nodes','connections','settings')})
back=req('GET');BN={n['name']:n for n in back['nodes']};fail=[]
for nm in NEWN:
    if nm not in BN:fail.append('missing '+nm)
for nm,c in code.items():
    if nm in BN and BN[nm]['parameters'].get('jsCode')!=c:fail.append('code differs '+nm)
for nm,n in LN.items():
    if nm not in CH and json.dumps(BN[nm]['parameters'],sort_keys=True)!=json.dumps(n['parameters'],sort_keys=True):fail.append('moved '+nm)
WK=['Check Save','Regrade After Quotes?','Anticheat Build','Anticheat Needed?','Anticheat Call deepseek','Anticheat Record']
for k in WK:
    if json.dumps(back['connections'].get(k),sort_keys=True)!=json.dumps(C[k],sort_keys=True):fail.append('wiring '+k)
for k,v in live['connections'].items():
    if k not in WK and json.dumps(back['connections'].get(k),sort_keys=True)!=json.dumps(v,sort_keys=True):fail.append('wiring moved '+k)
json.dump(back,open(os.path.join(ROOT,'fetchback_s427a.json'),'w'))
if back.get('activeVersionId')!=back.get('versionId') or not back.get('active'):fail.append('NOT PUBLISHED')
print('FETCH-BACK','OK' if not fail else 'FAIL '+str(fail),'| versionId',back.get('versionId'),'| activeVersionId',back.get('activeVersionId'),'| active',back.get('active'),'| nodes',len(back['nodes']))
