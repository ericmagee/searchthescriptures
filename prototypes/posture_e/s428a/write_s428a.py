#!/usr/bin/env python3
"""s428a ruling 428 judge enforcer steps 1-3 (RECORD-ONLY TRIAL): structural guarded write over live e2ac11a2. Adds Judge Enforcer Build,
Judge Enforcer Needed?, Judge Enforcer Call deepseek, Judge Enforcer Record between Enforcer Record and Alternate Needed?; K-W fact test in
Enforcer Build; Alternate Merge logs the new rows. Dry by default; --write writes."""
import json, os, sys, copy, uuid, subprocess, urllib.request
ROOT=os.path.dirname(os.path.abspath(__file__));URL='https://truthapp.app.n8n.cloud/api/v1/workflows/moMxiV4Irg1uRBZN';KEY=os.environ['N8N_API_KEY'];WRITE='--write' in sys.argv
def req(m,b=None):
    r=urllib.request.Request(URL,method=m,data=None if b is None else json.dumps(b).encode(),headers={'X-N8N-API-KEY':KEY,'Content-Type':'application/json','Accept':'application/json'})
    return json.load(urllib.request.urlopen(r,timeout=180))
BASE=json.load(open(os.path.join(ROOT,'..','s427e','fetchback_s427e.json')))
live=req('GET');bad=[]
if live.get('versionId')!=BASE.get('versionId'):bad.append('versionId moved: '+str(live.get('versionId')))
if len(live['nodes'])!=len(BASE['nodes']):bad.append('node count moved')
if json.dumps(live['connections'],sort_keys=True)!=json.dumps(BASE['connections'],sort_keys=True):bad.append('connections moved')
LN={n['name']:n for n in live['nodes']}
NEWN=['Judge Enforcer Build','Judge Enforcer Needed?','Judge Enforcer Call deepseek','Judge Enforcer Record']
for n in NEWN:
    if n in LN:bad.append('node exists: '+n)
M=lambda n,i=0:{'node':n,'type':'main','index':i}
if live['connections'].get('Enforcer Record',{}).get('main')!=[[M('Alternate Needed?')]]:bad.append('Enforcer Record wiring not as read')
CH=['Enforcer Build','Alternate Merge']
for nm in CH:
    if LN[nm]['parameters'].get('jsCode')!=open(os.path.join(ROOT,'base',nm+'.js')).read():bad.append('live differs from base: '+nm)
code={nm:open(os.path.join(ROOT,'new',nm+'.js')).read() for nm in CH+['Judge Enforcer Build','Judge Enforcer Record']}
for nm,c in code.items():
    pr=subprocess.run(['node','-e',"new Function(require('fs').readFileSync(0,'utf8'))"],input=c,capture_output=True,text=True)
    if pr.returncode!=0:bad.append('PARSE FAIL '+nm)
if bad:print('REFUSED:',bad);sys.exit(1)
new=copy.deepcopy(live);N={n['name']:n for n in new['nodes']}
for nm in CH:N[nm]['parameters']['jsCode']=code[nm]
px,py=LN['Enforcer Record']['position']
cn=lambda name,pos,c:{'id':str(uuid.uuid4()),'name':name,'type':'n8n-nodes-base.code','typeVersion':LN['Enforcer Build']['typeVersion'],'position':pos,'parameters':{'jsCode':c}}
ifn=copy.deepcopy(LN['Enforcer Needed?']);ifn['id']=str(uuid.uuid4());ifn['name']='Judge Enforcer Needed?';ifn['position']=[px+220,py+200]
ifn['parameters']['conditions']['conditions'][0]['id']='judge-enforcer-needed-428';ifn['parameters']['conditions']['conditions'][0]['leftValue']='={{ $json.je_skip !== true }}'
call=copy.deepcopy(LN['Enforcer Call deepseek']);call['id']=str(uuid.uuid4());call['name']='Judge Enforcer Call deepseek';call['position']=[px+440,py+160]
assert call['parameters']['jsonBody']=='={{ $json.body }}' and call.get('onError')=='continueRegularOutput'
new['nodes']+=[cn('Judge Enforcer Build',[px,py+200],code['Judge Enforcer Build']),ifn,call,cn('Judge Enforcer Record',[px+660,py+200],code['Judge Enforcer Record'])]
C=new['connections']
C['Enforcer Record']={'main':[[M('Judge Enforcer Build')]]}
C['Judge Enforcer Build']={'main':[[M('Judge Enforcer Needed?')]]}
C['Judge Enforcer Needed?']={'main':[[M('Judge Enforcer Call deepseek')],[M('Judge Enforcer Record')]]}
C['Judge Enforcer Call deepseek']={'main':[[M('Judge Enforcer Record')]]}
C['Judge Enforcer Record']={'main':[[M('Alternate Needed?')]]}
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
WK=['Enforcer Record','Judge Enforcer Build','Judge Enforcer Needed?','Judge Enforcer Call deepseek','Judge Enforcer Record']
for k in WK:
    if json.dumps(back['connections'].get(k),sort_keys=True)!=json.dumps(C[k],sort_keys=True):fail.append('wiring '+k)
for k,v in live['connections'].items():
    if k not in WK and json.dumps(back['connections'].get(k),sort_keys=True)!=json.dumps(v,sort_keys=True):fail.append('wiring moved '+k)
json.dump(back,open(os.path.join(ROOT,'fetchback_s428a.json'),'w'))
if back.get('activeVersionId')!=back.get('versionId') or not back.get('active'):fail.append('NOT PUBLISHED')
print('FETCH-BACK','OK' if not fail else 'FAIL '+str(fail),'| versionId',back.get('versionId'),'| activeVersionId',back.get('activeVersionId'),'| active',back.get('active'),'| nodes',len(back['nodes']))
