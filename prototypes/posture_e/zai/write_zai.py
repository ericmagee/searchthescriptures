#!/usr/bin/env python3
"""Pin GLM to Z.AI on OpenRouter: every OpenRouter HTTP node's JSON body, when its model starts with z-ai/, gets provider {order:['z-ai'], allow_fallbacks:false}.
Guarded write over the committed live copy trim1/fetchback_trim1.json. Dry by default; --write writes."""
import json, os, sys, copy, urllib.request
ROOT=os.path.dirname(os.path.abspath(__file__));URL='https://truthapp.app.n8n.cloud/api/v1/workflows/moMxiV4Irg1uRBZN';KEY=os.environ['N8N_API_KEY'];WRITE='--write' in sys.argv
def req(m,b=None):
    r=urllib.request.Request(URL,method=m,data=None if b is None else json.dumps(b).encode(),headers={'X-N8N-API-KEY':KEY,'Content-Type':'application/json','Accept':'application/json'})
    return json.load(urllib.request.urlopen(r,timeout=180))
BASE=json.load(open(os.path.join(ROOT,'fetchback_rollback.json')))
W1="={{ (__b=>(__b&&typeof __b==='object'&&/^z-ai\\//.test(String(__b.model||'')))?Object.assign({},__b,{provider:{order:['z-ai'],allow_fallbacks:false} }):__b)("
W2=") }}"
def targets(wf):
    out=[]
    for n in wf['nodes']:
        p=n.get('parameters') or {}
        if not n['type'].endswith('httpRequest') or 'openrouter.ai' not in json.dumps(p): continue
        jb=p.get('jsonBody')
        if isinstance(jb,str) and jb.startswith('={{') and jb.rstrip().endswith('}}') and 'z-ai' not in jb: out.append(n['name'])
    return out
live=req('GET');bad=[]
if live.get('versionId')!=BASE.get('versionId'):bad.append('versionId moved: '+str(live.get('versionId')))
if json.dumps(live['nodes'],sort_keys=True)!=json.dumps(BASE['nodes'],sort_keys=True):bad.append('live nodes differ from the committed copy')
if bad:print('REFUSED:',bad);sys.exit(1)
T=targets(live);new=copy.deepcopy(live);N={n['name']:n for n in new['nodes']};changed={}
for nm in T:
    jb=N[nm]['parameters']['jsonBody'].strip();inner=jb[3:-2].strip()
    N[nm]['parameters']['jsonBody']=W1+inner+W2;changed[nm]=N[nm]['parameters']['jsonBody']
json.dump(changed,open(os.path.join(ROOT,'changed_bodies.json'),'w'),indent=1)
print(f"guards passed on live {live['versionId']}; {len(T)} OpenRouter HTTP nodes wrapped: {T}")
if not WRITE:print('DRY: nothing written');sys.exit()
req('PUT',{k:new[k] for k in ('name','nodes','connections','settings')})
back=req('GET');BN={n['name']:n for n in back['nodes']};fail=[]
for nm,v in changed.items():
    if BN[nm]['parameters'].get('jsonBody')!=v:fail.append(nm)
LN={n['name']:n for n in live['nodes']}
for nm,n in LN.items():
    if nm not in changed and json.dumps(BN[nm]['parameters'],sort_keys=True)!=json.dumps(n['parameters'],sort_keys=True):fail.append('moved '+nm)
if json.dumps(back['connections'],sort_keys=True)!=json.dumps(live['connections'],sort_keys=True):fail.append('connections')
json.dump(back,open(os.path.join(ROOT,'fetchback_zai2.json'),'w'))
if back.get('activeVersionId')!=back.get('versionId') or not back.get('active'):fail.append('NOT PUBLISHED')
print('FETCH-BACK','OK' if not fail else 'FAIL '+str(fail),'| versionId',back.get('versionId'),'| active',back.get('active'),'| nodes',len(back['nodes']))
