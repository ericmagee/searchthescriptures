import json,os,sys,urllib.request,glob,hashlib
H={'X-N8N-API-KEY':os.environ['N8N_API_KEY'],'Content-Type':'application/json','Accept':'application/json'}
API='https://truthapp.app.n8n.cloud/api/v1/';URL=API+'workflows/moMxiV4Irg1uRBZN'
D='/tmp/claude-0/-home-user/86d59483-62fd-5fa0-b8c4-6322500f4823/scratchpad/'
def req(u,m='GET',b=None):
  r=urllib.request.Request(u,method=m,data=None if b is None else json.dumps(b).encode(),headers=H);return json.load(urllib.request.urlopen(r,timeout=180))
js=lambda x:json.dumps(x,sort_keys=True);WR='--write' in sys.argv
live=req(URL);bad=[];json.dump(live,open(D+'w207/fresh.json','w'))
GF=max(glob.glob(D+'w20*/fetchback_live_s2*.json'),key=os.path.getmtime);G=json.load(open(GF));print('guard base',GF.split('/')[-2:],G.get('versionId'))
LN={n['name']:n for n in live['nodes']};GN={n['name']:n for n in G['nodes']}
if set(LN)!=set(GN): bad.append('node set')
bad+=['changed since grade '+k for k in LN if js(LN[k])!=js(GN[k])]
if live.get('versionId')!='00f22045-515a-4342-8aba-7e15cd5c75aa': bad.append('version '+str(live.get('versionId')))
if req(API+'executions?status=running&limit=50')['data']: bad.append('running')
T=json.load(open(D+'merge/target_all.json'));TN={n['name']:n for n in T['nodes']}
if set(TN)!=set(LN): bad.append('target node set')
diff=sorted(k for k in TN if js(TN[k])!=js(LN[k]))
EXP={'Build Independent Verdict':(124738,'66e76c44f692'),'Panel Build':(150151,'8c94fbce8586'),'Shared Library':(957634,'96d55bfe0b11'),'Assume Check Record':(11392,'38e6173be2a9'),'Close Enforcer Build':(33524,'94e4e0e290b5'),'Alternate Merge':(6003,'476bd2353e94'),'C2B Build':(11806,'517dd25cf6b8'),'C2 Build':(36543,'aad0f2dfff95')}
print('target differs in',diff)
if diff!=sorted(EXP) or js(T['connections'])!=js(live['connections']): bad.append('diff '+str(diff))
for k,(n,h) in EXP.items():
  c=TN[k]['parameters']['jsCode'];got=(len(c),hashlib.sha256(c.encode()).hexdigest()[:12])
  if got!=(n,h): bad.append('not graded '+k+' '+str(got))
  if js({**TN[k],'parameters':None})!=js({**LN[k],'parameters':None}): bad.append('non-param change '+k)
if bad: print('REFUSED',bad[:10]);sys.exit(1)
json.dump(live,open(D+'w207/prewrite_s206_full.json','w'))
if not WR: print('DRY ok');sys.exit()
req(URL,'PUT',{'name':live['name'],'nodes':T['nodes'],'connections':T['connections'],'settings':live['settings']})
back=req(URL);KN={n['name']:n for n in back['nodes']};fail=[]
if set(KN)!=set(TN): fail.append('node set')
fail+=['param '+k for k in TN if js(TN[k]['parameters'])!=js(KN.get(k,{}).get('parameters'))]
if js(back['connections'])!=js(T['connections']): fail.append('connections')
if back.get('activeVersionId')!=back.get('versionId') or not back.get('active'): fail.append('NOT PUBLISHED')
json.dump(back,open(D+'w207/fetchback_live_s207.json','w'))
print('back',back.get('versionId'),len(KN),'FAIL' if fail else 'READBACK OK',fail[:10])
