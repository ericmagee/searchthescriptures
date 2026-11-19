# ASK 460 writer (W4): refuses unless live versionId equals the base and no execution of the engine or this workflow runs; PUT; readback.
import json,os,sys,urllib.request
H={'X-N8N-API-KEY':os.environ['N8N_API_KEY'],'Content-Type':'application/json','Accept':'application/json'};API='https://truthapp.app.n8n.cloud/api/v1/'
def req(u,m='GET',b=None):return json.load(urllib.request.urlopen(urllib.request.Request(u,method=m,data=None if b is None else json.dumps(b).encode(),headers=H),timeout=120))
WF='Y1VIsNB6KBrs1znP';base,tgt=json.load(open(sys.argv[1])),json.load(open(sys.argv[2]));js=lambda x:json.dumps(x,sort_keys=True)
live=req(API+'workflows/'+WF)
if live['versionId']!=base['versionId']:sys.exit('REFUSED: versionId moved '+live['versionId'])
if js(live['nodes'])!=js(base['nodes']) or js(live['connections'])!=js(base['connections']):sys.exit('REFUSED: live drifted from base')
for w in [WF,'moMxiV4Irg1uRBZN','MqQHRl7mQQ0z8QdT']:
  if req(API+'executions?status=running&workflowId=%s&limit=5'%w)['data']:sys.exit('REFUSED: running execution on '+w)
json.dump(live,open('rdf/prewrite_w460_ppj.json','w'))
if '--write' not in sys.argv:print('DRY: checks pass, nothing written');sys.exit()
req(API+'workflows/'+WF,'PUT',{'name':live['name'],'nodes':tgt['nodes'],'connections':tgt['connections'],'settings':live['settings']})
b=req(API+'workflows/'+WF);json.dump(b,open('rdf/fetchback_w460_ppj.json','w'))
A={n['name']:n['parameters'] for n in b['nodes']};B={n['name']:n['parameters'] for n in tgt['nodes']}
d=[n for n in set(A)|set(B) if js(A.get(n))!=js(B.get(n))]
print('back',b['versionId'],'nodes',len(A),'diffs',d,'conn equal',js(b['connections'])==js(tgt['connections']),'active',b.get('active'),'published',b.get('activeVersionId')==b.get('versionId'))
