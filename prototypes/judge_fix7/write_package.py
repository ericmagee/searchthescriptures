# write_package.py (judge_fix7): the whole flow change as ONE guarded PUT to ORACLE_DEBATE_V1 (moMxiV4Irg1uRBZN) through the n8n public API.
# NOT RUN except with --dry in this package. It replaces the code of the 33 nodes in new/ (byte for byte) and nothing else: no node is added or
# removed and no connection changes. Guards (it refuses and writes nothing unless all hold): the live code of every base/ file equals it (md5;
# base/ is the live 9165fb8a code of those nodes); the live connections and node count equal those of the base read (data/workflow_live.json);
# the live versionId equals the base read's. After the PUT it reads the workflow back and checks the code, the connections and that no other node
# changed. Needs N8N_API_KEY in the environment (never printed). --dry: guards and the plan only.
import json,os,sys,hashlib,copy,urllib.request
DRY='--dry' in sys.argv
KEY=os.environ.get('N8N_API_KEY') or sys.exit('N8N_API_KEY not set')
BASE='https://truthapp.app.n8n.cloud/api/v1/workflows/moMxiV4Irg1uRBZN'
H=os.path.dirname(os.path.abspath(__file__))
md=lambda s:hashlib.md5(s.encode()).hexdigest()
def req(method,data=None):
    r=urllib.request.Request(BASE,method=method,headers={'X-N8N-API-KEY':KEY,'Content-Type':'application/json','Accept':'application/json'},data=None if data is None else json.dumps(data).encode())
    return json.load(urllib.request.urlopen(r,timeout=120))
def links(wf):
    out=set()
    for a,v in wf['connections'].items():
        for typ,outs in v.items():
            for i,o in enumerate(outs or []):
                for t in o or []: out.add((a,typ,i,t['node'],t.get('type','main'),t.get('index',0)))
    return out
changed=sorted(f[:-3] for f in os.listdir(f'{H}/new') if f.endswith('.js'))
base=sorted(f[:-3] for f in os.listdir(f'{H}/base') if f.endswith('.js'))
REF=json.load(open(f'{H}/data/workflow_live.json'))
wf=req('GET');N={n['name']:n for n in wf['nodes']}
print('live versionId',wf.get('versionId'),'| base read versionId',REF.get('versionId'))
bad=[]
if wf.get('versionId')!=REF.get('versionId'): bad.append('versionId moved since the base read: '+str(wf.get('versionId')))
if changed!=base: bad.append('new/ and base/ name different nodes')
for nm in base:
    if nm not in N: bad.append(f'{nm}: not in the live workflow');continue
    live=N[nm]['parameters'].get('jsCode','');b=open(f'{H}/base/{nm}.js').read()
    if md(live)!=md(b): bad.append(f'{nm}: live code moved since the base ({md(live)[:8]} != {md(b)[:8]})')
L0=links(wf)
if L0!=links(REF): bad.append('connections moved since the base read: '+str(sorted(L0^links(REF)))[:600])
if len(wf['nodes'])!=len(REF['nodes']): bad.append(f"node count moved: {len(wf['nodes'])} live, {len(REF['nodes'])} in the base read")
if bad: sys.exit('REFUSED, nothing written:\n  '+'\n  '.join(bad))
print(f'guards passed: base matched for {len(base)} code nodes; versionId, connections ({len(L0)}) and node count ({len(wf["nodes"])}) equal the base read')
new=copy.deepcopy(wf);NN={n['name']:n for n in new['nodes']}
for nm in changed: NN[nm]['parameters']['jsCode']=open(f'{H}/new/{nm}.js').read()
if links(new)!=L0: sys.exit('REFUSED: the connections would change')
for nm in changed: print(f'  {nm:30} base {md(open(f"{H}/base/{nm}.js").read())[:8]} -> new {md(open(f"{H}/new/{nm}.js").read())[:8]}')
body={k:new[k] for k in ('name','nodes','connections','settings') if k in new}
if DRY: print(f'DRY: would PUT {len(changed)} code nodes, 0 nodes added, {len(links(new))} connections (unchanged); nothing written'); sys.exit()
req('PUT',body)
back=req('GET');B={n['name']:n for n in back['nodes']};fail=[]
for nm in changed:
    a=md(B[nm]['parameters'].get('jsCode',''));f=md(open(f'{H}/new/{nm}.js').read())
    print(f'{nm:30} file {f[:8]} live {a[:8]} {"OK" if a==f else "MISMATCH"}');fail+=[nm] if a!=f else []
if links(back)!=L0: fail.append('connections differ from the plan')
other=[n['name'] for n in wf['nodes'] if n['name'] not in changed and json.dumps(n.get('parameters'),sort_keys=True)!=json.dumps(B.get(n['name'],{}).get('parameters'),sort_keys=True)]
print('other nodes changed:',other or 'none','| versionId',back.get('versionId'),'| failures',fail or 'none')
