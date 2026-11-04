#!/usr/bin/env python3
"""s427c: anti-cheat record-only switch, sharpened rules, acx_only test stop (new IF 'Anticheat Only?' between Anticheat Record and Panel Build),
and the gloss tag fix (s427b). Guarded write over live 1e1ae467. Dry by default; --write writes."""
import json, os, sys, copy, uuid, subprocess, urllib.request
ROOT=os.path.dirname(os.path.abspath(__file__));URL='https://truthapp.app.n8n.cloud/api/v1/workflows/moMxiV4Irg1uRBZN';KEY=os.environ['N8N_API_KEY'];WRITE='--write' in sys.argv
def req(m,b=None):
    r=urllib.request.Request(URL,method=m,data=None if b is None else json.dumps(b).encode(),headers={'X-N8N-API-KEY':KEY,'Content-Type':'application/json','Accept':'application/json'})
    return json.load(urllib.request.urlopen(r,timeout=180))
BASE=json.load(open(os.path.join(ROOT,'..','s427a','fetchback_s427a.json')))
live=req('GET');bad=[]
if live.get('versionId')!=BASE.get('versionId'):bad.append('versionId moved: '+str(live.get('versionId')))
if len(live['nodes'])!=len(BASE['nodes']):bad.append('node count moved')
if json.dumps(live['connections'],sort_keys=True)!=json.dumps(BASE['connections'],sort_keys=True):bad.append('connections moved')
LN={n['name']:n for n in live['nodes']}
if 'Anticheat Only?' in LN:bad.append('node exists')
M=lambda n:{'node':n,'type':'main','index':0}
if live['connections'].get('Anticheat Record',{}).get('main')!=[[M('Panel Build')]]:bad.append('Anticheat Record wiring not as read')
CH=['Anticheat Build','Anticheat Record','Build Save Body','L2 Count Plan']
for nm in CH:
    if LN[nm]['parameters'].get('jsCode')!=open(os.path.join(ROOT,'base',nm+'.js')).read():bad.append('live differs from base: '+nm)
code={nm:open(os.path.join(ROOT,'new',nm+'.js')).read() for nm in CH}
for nm,c in code.items():
    pr=subprocess.run(['node','-e',"new Function(require('fs').readFileSync(0,'utf8'))"],input=c,capture_output=True,text=True)
    if pr.returncode!=0:bad.append('PARSE FAIL '+nm)
if bad:print('REFUSED:',bad);sys.exit(1)
new=copy.deepcopy(live);N={n['name']:n for n in new['nodes']}
for nm in CH:N[nm]['parameters']['jsCode']=code[nm]
ifn=copy.deepcopy(LN['Anticheat Needed?']);ifn['id']=str(uuid.uuid4());ifn['name']='Anticheat Only?'
x,y=LN['Anticheat Record']['position'];ifn['position']=[x+200,y]
ifn['parameters']['conditions']['conditions'][0]['id']='anticheat-only-427c';ifn['parameters']['conditions']['conditions'][0]['leftValue']='={{ $json.acx_only === true }}'
new['nodes'].append(ifn)
C=new['connections'];C['Anticheat Record']={'main':[[M('Anticheat Only?')]]};C['Anticheat Only?']={'main':[[],[M('Panel Build')]]}
print(f"guards passed on live {live['versionId']}; nodes {len(live['nodes'])} -> {len(new['nodes'])}")
if not WRITE:print('DRY: nothing written');sys.exit()
req('PUT',{k:new[k] for k in ('name','nodes','connections','settings')})
back=req('GET');BN={n['name']:n for n in back['nodes']};fail=[]
if 'Anticheat Only?' not in BN:fail.append('missing IF')
for nm,c in code.items():
    if BN[nm]['parameters'].get('jsCode')!=c:fail.append('code differs '+nm)
for nm,n in LN.items():
    if nm not in CH and json.dumps(BN[nm]['parameters'],sort_keys=True)!=json.dumps(n['parameters'],sort_keys=True):fail.append('moved '+nm)
for k in ['Anticheat Record','Anticheat Only?']:
    if json.dumps(back['connections'].get(k),sort_keys=True)!=json.dumps(C[k],sort_keys=True):fail.append('wiring '+k+' '+json.dumps(back['connections'].get(k)))
for k,v in live['connections'].items():
    if k!='Anticheat Record' and json.dumps(back['connections'].get(k),sort_keys=True)!=json.dumps(v,sort_keys=True):fail.append('wiring moved '+k)
json.dump(back,open(os.path.join(ROOT,'fetchback_s427c.json'),'w'))
if back.get('activeVersionId')!=back.get('versionId') or not back.get('active'):fail.append('NOT PUBLISHED')
print('FETCH-BACK','OK' if not fail else 'FAIL '+str(fail),'| versionId',back.get('versionId'),'| active',back.get('active'),'| nodes',len(back['nodes']))
