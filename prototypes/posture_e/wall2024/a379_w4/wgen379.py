# ASK 379 structural writer (nodes removed and added, connections changed); otherwise as wgen.py.
# usage: python3 rdf/wgen379.py <expect_versionId> <base_fetch.json> <target.json> <tag> [--write]
import json,os,sys,urllib.request,subprocess
H={'X-N8N-API-KEY':os.environ['N8N_API_KEY'],'Content-Type':'application/json','Accept':'application/json'}
API='https://truthapp.app.n8n.cloud/api/v1/';URL=API+'workflows/moMxiV4Irg1uRBZN';D='rdf/'
ver,base,tgt,tag=sys.argv[1:5]
def req(u,m='GET',b=None):
  r=urllib.request.Request(u,method=m,data=None if b is None else json.dumps(b).encode(),headers=H);return json.load(urllib.request.urlopen(r,timeout=180))
js=lambda x:json.dumps(x,sort_keys=True)
live=req(URL);assert live['versionId']==ver,live['versionId']
assert not req(API+'executions?status=running&workflowId=moMxiV4Irg1uRBZN&limit=50')['data'],'running'
json.dump(live,open(D+'prewrite_'+tag+'.json','w'))
SN={x['name']:x for x in json.load(open(base))['nodes']}
BW=json.load(open(base));assert len(live['nodes'])==len(SN) and all(x['name'] in SN and js(x)==js(SN[x['name']]) for x in live['nodes']) and js(live['connections'])==js(BW['connections']),'live drifted from base'
TG=json.load(open(tgt));TN={x['name']:x for x in TG['nodes']}
T=json.loads(json.dumps(live));T['nodes']=TG['nodes'];T['connections']=TG['connections']
assert 'CHILD_ID_AT_WRITE' not in json.dumps(T) or '--write' not in sys.argv,'child id not substituted'
LN={x['name']:x for x in live['nodes']};print('removed',[n for n in LN if n not in TN]);print('added',[n for n in TN if n not in LN]);print('changed',[n for n in TN if n in LN and js(TN[n])!=js(LN[n])])
json.dump(T,open(D+'_guard_'+tag+'.json','w'))
if subprocess.call(['node','gw/prototypes/posture_e/wall2024/guards/reasoning_guard.cjs',D+'prewrite_'+tag+'.json',D+'_guard_'+tag+'.json']+(['--allow'] if '--allow-reasoning' in sys.argv else []))!=0: print('REFUSED');sys.exit(1)
if '--write' not in sys.argv: sys.exit()
req(URL,'PUT',{'name':live['name'],'nodes':T['nodes'],'connections':T['connections'],'settings':live['settings']})
back=req(URL);KN={x['name']:x for x in back['nodes']};fail=['param '+x['name'] for x in T['nodes'] if js(x['parameters'])!=js(KN.get(x['name'],{}).get('parameters'))]
if js(back['connections'])!=js(T['connections']): fail.append('connections')
if back.get('activeVersionId')!=back.get('versionId') or not back.get('active'): fail.append('NOT PUBLISHED')
json.dump(back,open(D+'fetchback_'+tag+'.json','w'))
print('back',back.get('versionId'),len(KN),'FAIL' if fail else 'READBACK OK',fail[:10])
