# usage: python3 rdf/wgen.py <expect_versionId> <base_fetch.json> <target.json> <tag> [--write]
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
assert all(js(x)==js(SN[x['name']]) for x in live['nodes']),'live drifted from base'
TG=json.load(open(tgt));TN={x['name']:x for x in TG['nodes']}
T=json.loads(json.dumps(live));T['nodes']=[TN[x['name']] for x in live['nodes']]
# ASK 382: --topology <names,comma> lets the target add exactly those nodes (appended) and change connections; every live node stays; the connection change is printed
if '--topology' in sys.argv:
  ADD=sys.argv[sys.argv.index('--topology')+1].split(',');LN={x['name'] for x in live['nodes']}
  extra=[x['name'] for x in TG['nodes'] if x['name'] not in LN];assert sorted(extra)==sorted(ADD),('added nodes differ',extra)
  assert not ({x['name'] for x in live['nodes']}-set(TN)),'a live node is missing from the target'
  T['nodes']+= [TN[n] for n in ADD];T['connections']=TG['connections']
  for k in sorted(set(live['connections'])|set(TG['connections'])):
    if js(live['connections'].get(k))!=js(TG['connections'].get(k)):print('CONN',k,':',js(live['connections'].get(k)),'->',js(TG['connections'].get(k)))
  print('ADDED',ADD)
else: assert js(TG['connections'])==js(live['connections']),'connections differ'
diff=[a['name'] for a,b in zip(live['nodes'],T['nodes']) if js(a)!=js(b)];print('diff',diff)  # added nodes are listed by ADDED
json.dump(T,open(D+'_guard_'+tag+'.json','w'))
if subprocess.call(['node','gw/prototypes/posture_e/wall2024/guards/reasoning_guard.cjs',D+'prewrite_'+tag+'.json',D+'_guard_'+tag+'.json']+(['--allow'] if '--allow-reasoning' in sys.argv else []))!=0: print('REFUSED');sys.exit(1)
# ASK 385 (W1 8129 cond 1): the check always covers the ASK 379 child: the target child given with --child, else the live child read now
if '--child' in sys.argv: CH=[sys.argv[sys.argv.index('--child')+1]]
else: json.dump(req(API+'workflows/MqQHRl7mQQ0z8QdT'),open(D+'child_live_'+tag+'.json','w'));CH=[D+'child_live_'+tag+'.json']
if subprocess.call(['node','a385/reg385.cjs',D+'_guard_'+tag+'.json']+CH)!=0: print('REFUSED: ASK 385 one-copy check failed');sys.exit(1)  # ASK 385
if '--write' not in sys.argv: sys.exit()
req(URL,'PUT',{'name':live['name'],'nodes':T['nodes'],'connections':T['connections'],'settings':live['settings']})
back=req(URL);KN={x['name']:x for x in back['nodes']};fail=['param '+x['name'] for x in T['nodes'] if js(x['parameters'])!=js(KN.get(x['name'],{}).get('parameters'))]
if js(back['connections'])!=js(T['connections']): fail.append('connections')
if back.get('activeVersionId')!=back.get('versionId') or not back.get('active'): fail.append('NOT PUBLISHED')
json.dump(back,open(D+'fetchback_'+tag+'.json','w'))
print('back',back.get('versionId'),len(KN),'FAIL' if fail else 'READBACK OK',fail[:10])
