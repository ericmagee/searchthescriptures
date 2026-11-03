#!/usr/bin/env python3
"""Fix set 9 on posture v5: one guarded write of ORACLE_DEBATE_V1 over live 1dc2a475. Dry by default; --write writes."""
import json, os, sys, copy, urllib.request
ROOT=os.path.dirname(os.path.abspath(__file__));URL='https://truthapp.app.n8n.cloud/api/v1/workflows/moMxiV4Irg1uRBZN';KEY=os.environ['N8N_API_KEY'];WRITE='--write' in sys.argv
def req(m,b=None):
    r=urllib.request.Request(URL,method=m,data=None if b is None else json.dumps(b).encode(),headers={'X-N8N-API-KEY':KEY,'Content-Type':'application/json','Accept':'application/json'})
    return json.load(urllib.request.urlopen(r,timeout=180))
BASE=json.load(open(os.path.join(ROOT,'..','t9','fetchback9.json')))
live=req('GET');bad=[]
if live.get('versionId')!=BASE.get('versionId'):bad.append('versionId moved: '+str(live.get('versionId')))
if len(live['nodes'])!=len(BASE['nodes']):bad.append('node count moved')
if json.dumps(live['connections'],sort_keys=True)!=json.dumps(BASE['connections'],sort_keys=True):bad.append('connections moved')
LN={n['name']:n for n in live['nodes']}
changed={f[:-3]:open(os.path.join(ROOT,'new',f)).read() for f in os.listdir(os.path.join(ROOT,'new'))}
for nm in changed:
    if nm not in LN:bad.append('missing '+nm);continue
    if LN[nm]['parameters'].get('jsCode')!=open(os.path.join(ROOT,'base',nm+'.js')).read():bad.append('live differs from base: '+nm)
ND={'nodes':[],'remove_links':[],'add_links':[]}
for a in ND['nodes']:
    if a['name'] in LN:bad.append('name taken '+a['name'])
if bad:print('REFUSED:',bad);sys.exit(1)
new=copy.deepcopy(live);N={n['name']:n for n in new['nodes']}
for nm,c in changed.items():N[nm]['parameters']['jsCode']=c
new['nodes']+=ND['nodes'];C=new['connections']
for s,_,i,t,_,_ in ND['remove_links']:
    o=C[s]['main'][i];k=len(o);C[s]['main'][i]=[x for x in o if x['node']!=t]
    if k-len(C[s]['main'][i])!=1:print('REFUSED: link',s,t);sys.exit(1)
for s,_,i,t,_,ti in ND['add_links']:
    C.setdefault(s,{}).setdefault('main',[])
    while len(C[s]['main'])<=i:C[s]['main'].append([])
    C[s]['main'][i].append({'node':t,'type':'main','index':ti})
names={n['name'] for n in new['nodes']}
for s,v in C.items():
    assert s in names,s
    for o in v.get('main',[]):
        for t in o or []:assert t['node'] in names,t['node']
nl=sum(len(o or []) for v in C.values() for o in v.get('main',[]))
print(f"guards passed on live {live['versionId']}; {len(changed)} code nodes changed, {len(ND['nodes'])} added; nodes {len(live['nodes'])} -> {len(new['nodes'])}; links -> {nl}")
if not WRITE:print('DRY: nothing written');sys.exit()
res=req('PUT',{k:new[k] for k in ('name','nodes','connections','settings')})
back=req('GET');BN={n['name']:n for n in back['nodes']};fail=[]
for nm,c in changed.items():
    if BN[nm]['parameters'].get('jsCode')!=c:fail.append(nm)
for a in ND['nodes']:
    if a['name'] not in BN or json.dumps(BN[a['name']]['parameters'],sort_keys=True)!=json.dumps(a['parameters'],sort_keys=True):fail.append('added '+a['name'])
if json.dumps(back['connections'],sort_keys=True)!=json.dumps(C,sort_keys=True):fail.append('connections')
json.dump(back,open(os.path.join(ROOT,'fetchback10.json'),'w'))
print('FETCH-BACK','OK' if not fail else 'FAIL '+str(fail),'| versionId',back.get('versionId'),'| activeVersionId',back.get('activeVersionId'),'| active',back.get('active'),'| nodes',len(back['nodes']))
