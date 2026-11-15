import json,os,sys,urllib.request,hashlib
H={'X-N8N-API-KEY':os.environ['N8N_API_KEY'],'Content-Type':'application/json','Accept':'application/json'}
API='https://truthapp.app.n8n.cloud/api/v1/';URL=API+'workflows/moMxiV4Irg1uRBZN';D='rdf/'
def req(u,m='GET',b=None):
  r=urllib.request.Request(u,method=m,data=None if b is None else json.dumps(b).encode(),headers=H);return json.load(urllib.request.urlopen(r,timeout=180))
js=lambda x:json.dumps(x,sort_keys=True)
live=req(URL)
assert live['versionId']=='123b7df7-0ddc-4266-abf3-98b8febf9ec0',live['versionId']
assert not req(API+'executions?status=running&limit=50')['data'],'running'
json.dump(live,open(D+'prewrite_s211_full.json','w'))
T=json.loads(json.dumps(live));TG=json.load(open(D+'target_rdf.json'));TN={x['name']:x for x in TG['nodes']}
S10=json.load(open('rdf/live.json'));SN={x['name']:x for x in S10['nodes']}
assert all(js(x)==js(SN[x['name']]) for x in live['nodes']),'live drifted from s211 fetch'
T['nodes']=[TN[x['name']] for x in live['nodes']]
diff=[a['name'] for a,b in zip(live['nodes'],T['nodes']) if js(a)!=js(b)];print('diff',diff)
json.dump(T,open(D+'_guard_target.json','w'))
import subprocess
if subprocess.call(['node','gw/prototypes/posture_e/wall2024/guards/reasoning_guard.cjs',D+'prewrite_s211_full.json',D+'_guard_target.json']+(['--allow'] if '--allow-reasoning' in sys.argv else []))!=0: print('REFUSED by reasoning guard');sys.exit(1)
if '--write' not in sys.argv: sys.exit()
req(URL,'PUT',{'name':live['name'],'nodes':T['nodes'],'connections':T['connections'],'settings':live['settings']})
back=req(URL);KN={x['name']:x for x in back['nodes']};fail=[]
fail+=['param '+x['name'] for x in T['nodes'] if js(x['parameters'])!=js(KN.get(x['name'],{}).get('parameters'))]
if js(back['connections'])!=js(T['connections']): fail.append('connections')
if back.get('activeVersionId')!=back.get('versionId') or not back.get('active'): fail.append('NOT PUBLISHED')
json.dump(back,open(D+'fetchback_live_s212.json','w'))
print('back',back.get('versionId'),len(KN),'FAIL' if fail else 'READBACK OK',fail[:10])
