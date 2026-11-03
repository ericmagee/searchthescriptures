#!/usr/bin/env python3
"""Question-round TRIAL (rulings 413, 415): one guarded write over live f2917b91. Dry by default; --write writes."""
import json, os, sys, copy, urllib.request
ROOT=os.path.dirname(os.path.abspath(__file__));URL='https://truthapp.app.n8n.cloud/api/v1/workflows/moMxiV4Irg1uRBZN';KEY=os.environ['N8N_API_KEY'];WRITE='--write' in sys.argv
def req(m,b=None):
    r=urllib.request.Request(URL,method=m,data=None if b is None else json.dumps(b).encode(),headers={'X-N8N-API-KEY':KEY,'Content-Type':'application/json','Accept':'application/json'})
    return json.load(urllib.request.urlopen(r,timeout=180))
BASE=json.load(open(os.path.join(ROOT,'..','c7','fetchback_c7.json')))
live=req('GET');bad=[]
if live.get('versionId')!=BASE.get('versionId'):bad.append('versionId moved: '+str(live.get('versionId')))
if len(live['nodes'])!=len(BASE['nodes']):bad.append('node count moved')
if json.dumps(live['connections'],sort_keys=True)!=json.dumps(BASE['connections'],sort_keys=True):bad.append('connections moved')
LN={n['name']:n for n in live['nodes']};ch={}
for f in os.listdir(os.path.join(ROOT,'new')):
    nm,ext=f.rsplit('.',1);key='jsCode' if ext=='js' else 'jsonBody';ch[nm]=(key,open(os.path.join(ROOT,'new',f)).read())
    if LN[nm]['parameters'].get(key)!=open(os.path.join(ROOT,'base',f)).read():bad.append('live differs from base: '+nm)
AD=json.load(open(os.path.join(ROOT,'add_qr.json')))
for a in AD['nodes']:
    if a['name'] in LN:bad.append('name taken '+a['name'])
if bad:print('REFUSED:',bad);sys.exit(1)
new=copy.deepcopy(live);N={n['name']:n for n in new['nodes']}
for nm,(k,v) in ch.items():N[nm]['parameters'][k]=v
new['nodes']+=AD['nodes'];C=new['connections']
s,i,old,nw=AD['reroute'];o=C[s]['main'][i];assert [x['node'] for x in o]==[old],o;C[s]['main'][i]=[{'node':nw,'type':'main','index':0}]
for s,i,t in AD['links']:
    C.setdefault(s,{}).setdefault('main',[])
    while len(C[s]['main'])<=i:C[s]['main'].append([])
    C[s]['main'][i].append({'node':t,'type':'main','index':0})
names={n['name'] for n in new['nodes']}
for s,v in C.items():
    assert s in names,s
    for o in v.get('main',[]):
        for t in o or []:assert t['node'] in names,t['node']
print(f"guards passed on live {live['versionId']}; {len(ch)} nodes changed, {len(AD['nodes'])} added; nodes {len(live['nodes'])} -> {len(new['nodes'])}")
if not WRITE:print('DRY: nothing written');sys.exit()
req('PUT',{k:new[k] for k in ('name','nodes','connections','settings')})
back=req('GET');BN={n['name']:n for n in back['nodes']};fail=[]
for nm,(k,v) in ch.items():
    if BN[nm]['parameters'].get(k)!=v:fail.append(nm)
for a in AD['nodes']:
    if a['name'] not in BN or json.dumps(BN[a['name']]['parameters'],sort_keys=True)!=json.dumps(a['parameters'],sort_keys=True):fail.append('added '+a['name'])
for nm,n in LN.items():
    if nm not in ch and json.dumps(BN[nm]['parameters'],sort_keys=True)!=json.dumps(n['parameters'],sort_keys=True):fail.append('moved '+nm)
if json.dumps(back['connections'],sort_keys=True)!=json.dumps(C,sort_keys=True):fail.append('connections')
if back.get('activeVersionId')!=back.get('versionId') or not back.get('active'):fail.append('NOT PUBLISHED')
json.dump(back,open(os.path.join(ROOT,'fetchback_qr.json'),'w'))
print('FETCH-BACK','OK' if not fail else 'FAIL '+str(fail),'| versionId',back.get('versionId'),'| activeVersionId',back.get('activeVersionId'),'| nodes',len(back['nodes']))
