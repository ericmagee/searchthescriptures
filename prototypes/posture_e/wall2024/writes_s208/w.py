import json,os,sys,urllib.request,glob,hashlib
H={'X-N8N-API-KEY':os.environ['N8N_API_KEY'],'Content-Type':'application/json','Accept':'application/json'}
API='https://truthapp.app.n8n.cloud/api/v1/';URL=API+'workflows/moMxiV4Irg1uRBZN'
D='/tmp/claude-0/-home-user/86d59483-62fd-5fa0-b8c4-6322500f4823/scratchpad/'
def req(u,m='GET',b=None):
  r=urllib.request.Request(u,method=m,data=None if b is None else json.dumps(b).encode(),headers=H);return json.load(urllib.request.urlopen(r,timeout=180))
js=lambda x:json.dumps(x,sort_keys=True);WR='--write' in sys.argv
live=req(URL);bad=[];json.dump(live,open(D+'w208/fresh.json','w'))
GF=max(glob.glob(D+'w20*/fetchback_live_s2*.json'),key=os.path.getmtime);G=json.load(open(GF));print('guard base',GF.split('/')[-2:],G.get('versionId'))
LN={n['name']:n for n in live['nodes']};GN={n['name']:n for n in G['nodes']}
if set(LN)!=set(GN): bad.append('node set')
bad+=['changed since grade '+k for k in LN if js(LN[k])!=js(GN[k])]
if live.get('versionId')!='9a6d6d51-b1cf-45ba-83ca-a37a1bf19a04': bad.append('version '+str(live.get('versionId')))
if req(API+'executions?status=running&limit=50')['data']: bad.append('running')
T=json.load(open(D+'r383/f6r2/target_F6R2.json'));TN={n['name']:n for n in T['nodes']}
if set(TN)!=set(LN): bad.append('target node set')
diff=sorted(k for k in TN if js(TN[k])!=js(LN[k]))
EXP={'Shared Library':(944510,'ddda428484bc'),'Assume Check Record':(8164,'cad74a6dd29d'),'Close Enforcer Build':(35282,'f6a9f2b5d423'),'Anticheat Record':(5502,'142a570df81e'),'Build Save Body':(80067,'e6f133a0e64d')}
print('target differs in',diff)
if diff!=sorted(EXP) or js(T['connections'])!=js(live['connections']): bad.append('diff '+str(diff))
for k,(n,h) in EXP.items():
  c=TN[k]['parameters']['jsCode'];got=(len(c),hashlib.sha256(c.encode()).hexdigest()[:12])
  if got!=(n,h): bad.append('not graded '+k+' '+str(got))
  if js({**TN[k],'parameters':None})!=js({**LN[k],'parameters':None}): bad.append('non-param change '+k)
if bad: print('REFUSED',bad[:10]);sys.exit(1)
json.dump(live,open(D+'w208/prewrite_s207_full.json','w'))
if not WR: print('DRY ok');sys.exit()
req(URL,'PUT',{'name':live['name'],'nodes':T['nodes'],'connections':T['connections'],'settings':live['settings']})
back=req(URL);KN={n['name']:n for n in back['nodes']};fail=[]
if set(KN)!=set(TN): fail.append('node set')
fail+=['param '+k for k in TN if js(TN[k]['parameters'])!=js(KN.get(k,{}).get('parameters'))]
if js(back['connections'])!=js(T['connections']): fail.append('connections')
if back.get('activeVersionId')!=back.get('versionId') or not back.get('active'): fail.append('NOT PUBLISHED')
json.dump(back,open(D+'w208/fetchback_live_s208.json','w'))
print('back',back.get('versionId'),len(KN),'FAIL' if fail else 'READBACK OK',fail[:10])
