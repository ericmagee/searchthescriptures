# ASK 340 writer: wgen.py plus an exact allowance for 3 new nodes and their edges (W1 7149 a, W2 7150).
# usage: python3 rdf/wgen340.py <expect_versionId> <base_fetch.json> <target.json> <tag> [--write]
import json,os,sys,urllib.request,subprocess
H={'X-N8N-API-KEY':os.environ['N8N_API_KEY'],'Content-Type':'application/json','Accept':'application/json'}
API='https://truthapp.app.n8n.cloud/api/v1/';URL=API+'workflows/moMxiV4Irg1uRBZN';D='rdf/'
ver,base,tgt,tag=sys.argv[1:5]
def req(u,m='GET',b=None):
  r=urllib.request.Request(u,method=m,data=None if b is None else json.dumps(b).encode(),headers=H);return json.load(urllib.request.urlopen(r,timeout=180))
js=lambda x:json.dumps(x,sort_keys=True)
live=req(URL);assert live['versionId']==ver,live['versionId']
assert not req(API+'executions?status=running&limit=50')['data'],'running'
json.dump(live,open(D+'prewrite_'+tag+'.json','w'))
SN={x['name']:x for x in json.load(open(base))['nodes']}
assert all(js(x)==js(SN[x['name']]) for x in live['nodes']),'live drifted from base'
TG=json.load(open(tgt));TN={x['name']:x for x in TG['nodes']}
NEW=['L2 Gloss Plan','L2 Gloss Any','L2 Gloss Read']
assert sorted(set(TN)-set(x['name'] for x in live['nodes']))==sorted(NEW),'new nodes differ from the allowance'
assert all(x['name'] in TN for x in live['nodes']),'a live node is missing from the target'
T=json.loads(json.dumps(live));T['nodes']=[TN[x['name']] for x in live['nodes']]+[TN[n] for n in NEW]
EC=json.loads(json.dumps(live['connections']))
assert EC['L2 Lexicon']=={'main':[[{'node':'L2 Count Plan','type':'main','index':0}]]},'L2 Lexicon edges drifted'
for n in NEW: assert n not in EC
EC['L2 Lexicon']={'main':[[{'node':'L2 Gloss Plan','type':'main','index':0}]]}
EC['L2 Gloss Plan']={'main':[[{'node':'L2 Gloss Any','type':'main','index':0}]]}
EC['L2 Gloss Any']={'main':[[{'node':'L2 Gloss Read','type':'main','index':0}],[{'node':'L2 Count Plan','type':'main','index':0}]]}
EC['L2 Gloss Read']={'main':[[{'node':'L2 Count Plan','type':'main','index':0}]]}
assert js(TG['connections'])==js(EC),'connections differ from the allowance'
print('connection allowance OK: 1 edge removed (L2 Lexicon -> L2 Count Plan), 5 added')
diff=[a['name'] for a,b in zip(live['nodes'],T['nodes']) if js(a)!=js(b)];print('diff',len(diff),diff,'| new',NEW)
json.dump(T,open(D+'_guard_'+tag+'.json','w'))
if subprocess.call(['node','gw/prototypes/posture_e/wall2024/guards/reasoning_guard.cjs',D+'prewrite_'+tag+'.json',D+'_guard_'+tag+'.json']+(['--allow'] if '--allow-reasoning' in sys.argv else []))!=0: print('REFUSED');sys.exit(1)
if '--write' not in sys.argv: sys.exit()
req(URL,'PUT',{'name':live['name'],'nodes':T['nodes'],'connections':T['connections'],'settings':live['settings']})
back=req(URL);KN={x['name']:x for x in back['nodes']};fail=['param '+x['name'] for x in T['nodes'] if js(x['parameters'])!=js(KN.get(x['name'],{}).get('parameters'))]
if js(back['connections'])!=js(T['connections']): fail.append('connections')
if back.get('activeVersionId')!=back.get('versionId') or not back.get('active'): fail.append('NOT PUBLISHED')
json.dump(back,open(D+'fetchback_'+tag+'.json','w'))
print('back',back.get('versionId'),len(KN),'FAIL' if fail else 'READBACK OK',fail[:10])
