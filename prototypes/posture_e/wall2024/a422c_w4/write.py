#!/usr/bin/env python3
# ASK 422(c) guarded write (operator card 22:51:53Z in W4's thread). Usage: write.py WFID BASE_VERSIONID PRE.json TARGET.json BACK.json
import json, os, sys, urllib.request
wid,basev,pre,tgt,back_out=sys.argv[1:6];KEY=os.environ['N8N_API_KEY'];URL='https://truthapp.app.n8n.cloud/api/v1/workflows/'+wid
def req(m,b=None):
    r=urllib.request.Request(URL,method=m,data=None if b is None else json.dumps(b).encode(),headers={'X-N8N-API-KEY':KEY,'Content-Type':'application/json','Accept':'application/json'})
    return json.load(urllib.request.urlopen(r,timeout=180))
PRE=json.load(open(pre));T=json.load(open(tgt));live=req('GET');bad=[]
if live.get('versionId')!=basev:bad.append('versionId moved: '+str(live.get('versionId')))
if json.dumps(live['nodes'],sort_keys=True)!=json.dumps(PRE['nodes'],sort_keys=True):bad.append('live nodes differ from the pre-write fetch')
if bad:print('REFUSED',bad);sys.exit(1)
req('PUT',{'name':live['name'],'nodes':T['nodes'],'connections':live['connections'],'settings':live['settings']})
back=req('GET');json.dump(back,open(back_out,'w'))
fail=[]
if json.dumps(back['nodes'],sort_keys=True)!=json.dumps(T['nodes'],sort_keys=True):fail.append('nodes differ from target')
if json.dumps(back['connections'],sort_keys=True)!=json.dumps(live['connections'],sort_keys=True):fail.append('connections')
if back.get('activeVersionId')!=back.get('versionId') or not back.get('active'):fail.append('NOT PUBLISHED')
print(wid,'FETCH-BACK','OK' if not fail else 'FAIL '+str(fail),'| versionId',back.get('versionId'),'| active',back.get('active'),'| updatedAt',back.get('updatedAt'),'| nodes',len(back['nodes']))
