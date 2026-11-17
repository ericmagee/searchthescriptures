# ASK 364 Part B writer: wgen.py plus an exact allowance for the six D1B nodes and their edges.
# Lessons kept: ASK 340 (T['connections'] is set to the allowance, and every new node's edges are read back).
# usage: python3 rdf/wgen364b.py <expect_versionId> <base_fetch.json> <target.json> <tag> [--write]
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
LN={x['name']:x for x in live['nodes']}
TG=json.load(open(tgt));TN={x['name']:x for x in TG['nodes']}
NEW=['D1B Build','D1B Route','D1B Call anthropic','D1B Call openrouter','D1B Call deepseek','D1B Extract']
SRC={'D1B Build':'D2B Build','D1B Route':'D2B Route','D1B Call anthropic':'D1 Call anthropic','D1B Call openrouter':'D1 Call openrouter','D1B Call deepseek':'D1 Call deepseek','D1B Extract':'D1 Extract'}
assert sorted(set(TN)-set(LN))==sorted(NEW),'new nodes differ from the allowance'
assert all(n in TN for n in LN),'a live node is missing from the target'
T=json.loads(json.dumps(live));T['nodes']=[TN[x['name']] for x in live['nodes']]+[TN[n] for n in NEW]
e=lambda n:{'node':n,'type':'main','index':0}
EC=json.loads(json.dumps(live['connections']))
assert EC['D1 Extract']['main'][0]==[e('C1 Verse Sheet')],'D1 Extract edge drifted'
for n in NEW: assert n not in EC,'edges of '+n+' already live'
EC['D1 Extract']['main'][0]=[e('D1B Build')]
EC['D1B Build']={'main':[[e('D1B Route')]]}
EC['D1B Route']={'main':[[e('D1B Call anthropic')]]+[[e('Provider Removed Stop')]]*4+[[e('D1B Call openrouter')],[e('D1B Call deepseek')],[e('D1B Extract')]]}
for f in ['anthropic','openrouter','deepseek']: EC['D1B Call '+f]={'main':[[e('D1B Extract')],[e('D1B Extract')]]}
EC['D1B Extract']={'main':[[e('C1 Verse Sheet')]]}
assert js(TG['connections'])==js(EC),'connections differ from the allowance'
T['connections']=EC
print('connection allowance OK: 1 edge replaced (D1 Extract -> C1 Verse Sheet), 16 added (Build 1, Route 8, Calls 6, Extract 1)')
for f in ['anthropic','openrouter','deepseek']:
  a,b=LN['D1 Call '+f],TN['D1B Call '+f]
  for k in ['type','typeVersion','parameters','credentials','retryOnFail','maxTries','waitBetweenTries','onError']: assert js(a.get(k))==js(b.get(k)),'D1B Call '+f+' differs from D1 Call '+f+' at '+k
print('D1B Call nodes equal the D1 Call nodes in every setting')
diff=[a['name'] for a,b in zip(live['nodes'],T['nodes']) if js(a)!=js(b)];print('diff',len(diff),diff,'| new',NEW)
P=json.loads(json.dumps(live))
for n in NEW:
  s=json.loads(json.dumps(LN[SRC[n]]));s['name']=n
  if n=='D1B Extract': s['parameters']['jsCode']=s['parameters']['jsCode'].replace("$('D1 Build')","$('D1B Build')")
  P['nodes'].append(s)
json.dump(P,open(D+'_guardsrc_'+tag+'.json','w'));json.dump(T,open(D+'_guard_'+tag+'.json','w'))
print('reasoning guard: each new node is compared with its source:',SRC)
if subprocess.call(['node','gw/prototypes/posture_e/wall2024/guards/reasoning_guard.cjs',D+'_guardsrc_'+tag+'.json',D+'_guard_'+tag+'.json'])!=0: print('REFUSED');sys.exit(1)
if '--write' not in sys.argv: sys.exit()
req(URL,'PUT',{'name':live['name'],'nodes':T['nodes'],'connections':T['connections'],'settings':live['settings']})
back=req(URL);KN={x['name']:x for x in back['nodes']};fail=['param '+x['name'] for x in T['nodes'] if js(x['parameters'])!=js(KN.get(x['name'],{}).get('parameters'))]
if js(back['connections'])!=js(EC): fail.append('connections')
for n in NEW:
  if n not in back['connections']: fail.append('no edges from '+n)
if back.get('activeVersionId')!=back.get('versionId') or not back.get('active'): fail.append('NOT PUBLISHED')
json.dump(back,open(D+'fetchback_'+tag+'.json','w'))
print('back',back.get('versionId'),len(KN),'FAIL' if fail else 'READBACK OK',fail[:10])
