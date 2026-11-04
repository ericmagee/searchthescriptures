#!/usr/bin/env python3
"""Ruling 421 enforcer excerpt finder (accents, quote marks): guarded write over live 0381869a. Dry by default; --write writes."""
import json, os, sys, copy, urllib.request
ROOT=os.path.dirname(os.path.abspath(__file__));URL='https://truthapp.app.n8n.cloud/api/v1/workflows/moMxiV4Irg1uRBZN';KEY=os.environ['N8N_API_KEY'];WRITE='--write' in sys.argv
def req(m,b=None):
    r=urllib.request.Request(URL,method=m,data=None if b is None else json.dumps(b).encode(),headers={'X-N8N-API-KEY':KEY,'Content-Type':'application/json','Accept':'application/json'})
    return json.load(urllib.request.urlopen(r,timeout=180))
BASE=json.load(open(os.path.join(ROOT,'..','s421m','fetchback_s421m.json')))
live=req('GET');bad=[]
if live.get('versionId')!=BASE.get('versionId'):bad.append('versionId moved: '+str(live.get('versionId')))
if len(live['nodes'])!=len(BASE['nodes']):bad.append('node count moved')
if json.dumps(live['connections'],sort_keys=True)!=json.dumps(BASE['connections'],sort_keys=True):bad.append('connections moved')
LN={n['name']:n for n in live['nodes']}
changed={f[:-3]:open(os.path.join(ROOT,'new',f)).read() for f in os.listdir(os.path.join(ROOT,'new'))}
for nm in changed:
    if nm not in LN:bad.append('missing '+nm);continue
    if LN[nm]['parameters'].get('jsCode')!=open(os.path.join(ROOT,'base',nm+'.js')).read():bad.append('live differs from base: '+nm)
import subprocess
for nm,c in changed.items():
    pr=subprocess.run(['node','-e',"new Function(require('fs').readFileSync(0,'utf8'))"],input=c,capture_output=True,text=True)
    if pr.returncode!=0:bad.append('PARSE FAIL '+nm+': '+pr.stderr.strip().splitlines()[-1][:200] if pr.stderr.strip() else 'PARSE FAIL '+nm)
if bad:print('REFUSED:',bad);sys.exit(1)
new=copy.deepcopy(live);N={n['name']:n for n in new['nodes']}
for nm,c in changed.items():N[nm]['parameters']['jsCode']=c
print(f"guards passed on live {live['versionId']}; {len(changed)} code nodes changed; nodes {len(live['nodes'])}")
if not WRITE:print('DRY: nothing written');sys.exit()
res=req('PUT',{k:new[k] for k in ('name','nodes','connections','settings')})
back=req('GET');BN={n['name']:n for n in back['nodes']};fail=[]
for nm,c in changed.items():
    if BN[nm]['parameters'].get('jsCode')!=c:fail.append(nm)
for nm,n in LN.items():
    if nm not in changed and json.dumps(BN[nm]['parameters'],sort_keys=True)!=json.dumps(n['parameters'],sort_keys=True):fail.append('moved '+nm)
if json.dumps(back['connections'],sort_keys=True)!=json.dumps(live['connections'],sort_keys=True):fail.append('connections')
json.dump(back,open(os.path.join(ROOT,'fetchback_s421n.json'),'w'))
if back.get('activeVersionId')!=back.get('versionId') or not back.get('active'):fail.append('NOT PUBLISHED: activeVersionId '+str(back.get('activeVersionId'))+' versionId '+str(back.get('versionId')))
print('FETCH-BACK','OK' if not fail else 'FAIL '+str(fail),'| versionId',back.get('versionId'),'| activeVersionId',back.get('activeVersionId'),'| active',back.get('active'),'| nodes',len(back['nodes']))
