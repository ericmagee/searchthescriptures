import json,os,sys,subprocess,urllib.request
H={'X-N8N-API-KEY':os.environ['N8N_API_KEY'],'Content-Type':'application/json','Accept':'application/json'}
API='https://truthapp.app.n8n.cloud/api/v1/';URL=API+'workflows/moMxiV4Irg1uRBZN'
D='/tmp/claude-0/-home-user/86d59483-62fd-5fa0-b8c4-6322500f4823/scratchpad/'
def req(u,m='GET',b=None):
  r=urllib.request.Request(u,method=m,data=None if b is None else json.dumps(b).encode(),headers=H);return json.load(urllib.request.urlopen(r,timeout=180))
js=lambda x:json.dumps(x,sort_keys=True);WR='--write' in sys.argv
live=req(URL);bad=[]
json.dump(live,open(D+'w194/fresh.json','w'))
G=json.load(open(D+'jbc/live.json'))
LN={n['name']:n for n in live['nodes']};GN={n['name']:n for n in G['nodes']}
if set(LN)!=set(GN): bad.append('node set')
bad+=['changed since grade '+k for k in LN if js(LN[k])!=js(GN[k])]
if live.get('versionId')!='36ce08f1-2f60-486d-b2f6-29a4f1ff50e0': bad.append('version')
if req(API+'executions?status=running&limit=50')['data']: bad.append('running')
r=subprocess.run(['python3',D+'jbc/build.py',D+'w194/fresh.json',D+'w194/target.json'],capture_output=True,text=True);print(r.stdout,r.stderr)
T=json.load(open(D+'w194/target.json'));TN={n['name']:n for n in T['nodes']}
GT={n['name']:n for n in json.load(open(D+'jbc/target.json'))['nodes']}
diff=sorted(k for k in TN if js(TN[k])!=js(LN[k]))
print('target differs in',diff)
if diff!=['Build Independent Verdict','Panel Build'] or js(T['connections'])!=js(live['connections']): bad.append('diff '+str(diff))
if any(js(TN[k])!=js(GT[k]) for k in TN): bad.append('not the graded target')
for k in diff:
  c=TN[k]['parameters']['jsCode'];print(k,len(LN[k]['parameters']['jsCode']),'->',len(c))
  p=subprocess.run(['node','-e','new Function(require("fs").readFileSync(0,"utf8"))'],input=c,capture_output=True,text=True)
  if p.returncode: bad.append('parse '+k)
if bad: print('REFUSED',bad[:10]);sys.exit(1)
if not WR: json.dump(live,open(D+'w194/prewrite_s194_JBC.json','w'));print('DRY ok');sys.exit()
req(URL,'PUT',{'name':live['name'],'nodes':T['nodes'],'connections':T['connections'],'settings':live['settings']})
back=req(URL);KN={n['name']:n for n in back['nodes']};fail=[]
if set(KN)!=set(TN): fail.append('node set')
fail+=['param '+k for k in TN if js(TN[k]['parameters'])!=js(KN.get(k,{}).get('parameters'))]
if js(back['connections'])!=js(T['connections']): fail.append('connections')
if back.get('activeVersionId')!=back.get('versionId') or not back.get('active'): fail.append('NOT PUBLISHED')
json.dump(back,open(D+'w194/fetchback_live_s194.json','w'))
print('back',back.get('versionId'),len(KN),'FAIL' if fail else 'READBACK OK',fail[:10])
