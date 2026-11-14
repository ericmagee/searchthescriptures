import json,os,sys,subprocess,urllib.request
H={'X-N8N-API-KEY':os.environ['N8N_API_KEY'],'Content-Type':'application/json','Accept':'application/json'}
API='https://truthapp.app.n8n.cloud/api/v1/';URL=API+'workflows/moMxiV4Irg1uRBZN'
D='/tmp/claude-0/-home-user/86d59483-62fd-5fa0-b8c4-6322500f4823/scratchpad/'
def req(u,m='GET',b=None):
  r=urllib.request.Request(u,method=m,data=None if b is None else json.dumps(b).encode(),headers=H);return json.load(urllib.request.urlopen(r,timeout=180))
js=lambda x:json.dumps(x,sort_keys=True);WR='--write' in sys.argv
live=req(URL);bad=[]
json.dump(live,open(D+'w197/fresh.json','w'))
G=json.load(open(D+'k3/live.json'))
LN={n['name']:n for n in live['nodes']};GN={n['name']:n for n in G['nodes']}
if set(LN)!=set(GN): bad.append('node set')
bad+=['changed since grade '+k for k in LN if js(LN[k])!=js(GN[k])]
if live.get('versionId')!='6af02d02-8ab1-41fe-af0c-13412c211856': bad.append('version')
if req(API+'executions?status=running&limit=50')['data']: bad.append('running')
print(subprocess.run(['node',D+'epc/build.cjs',D+'w197/fresh.json',D+'w197/target.json'],capture_output=True,text=True).stdout)
T=json.load(open(D+'w197/target.json'));TN={n['name']:n for n in T['nodes']}
diff=sorted(k for k in TN if js(TN[k])!=js(LN[k]))
WANT=sorted(['Shared Library','Panel Build','Build Independent Verdict','D4 Build','Build Save Body','Citation Scan'])
print('target differs in',diff)
if diff!=WANT or js(T['connections'])!=js(live['connections']): bad.append('diff '+str(diff))
lib=[n for n in T['nodes'] if n['name']=='Shared Library'][0]['parameters']['jsCode']
if '// library sha ac509148efc92395,' not in lib or len(lib)!=925348: bad.append('not the graded build')
if bad: print('REFUSED',bad[:10]);sys.exit(1)
if not WR: json.dump(live,open(D+'w197/prewrite_s197_EPC_full.json','w'));print('DRY ok');sys.exit()
req(URL,'PUT',{'name':live['name'],'nodes':T['nodes'],'connections':T['connections'],'settings':live['settings']})
back=req(URL);KN={n['name']:n for n in back['nodes']};fail=[]
if set(KN)!=set(TN): fail.append('node set')
fail+=['param '+k for k in TN if js(TN[k]['parameters'])!=js(KN.get(k,{}).get('parameters'))]
if js(back['connections'])!=js(T['connections']): fail.append('connections')
if back.get('activeVersionId')!=back.get('versionId') or not back.get('active'): fail.append('NOT PUBLISHED')
json.dump(back,open(D+'w197/fetchback_live_s197.json','w'))
print('back',back.get('versionId'),len(KN),'FAIL' if fail else 'READBACK OK',fail[:10])
