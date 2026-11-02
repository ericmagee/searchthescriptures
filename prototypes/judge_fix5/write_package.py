# write_package.py (judge_fix5): the whole flow change as ONE guarded PUT to ORACLE_DEBATE_V1 (moMxiV4Irg1uRBZN) through the n8n public API.
# NOT RUN except with --dry in this package. It replaces the code of the 44 nodes in new/ (byte for byte), adds the 10 nodes of flow/nodes.json
# (G9: "Panel Judge 1 Empty?", "Panel Judge 1 deepseek retry"; G11: "<round> Verse Sheet" x 8) and makes the connection changes listed there
# (9 links removed, 20 added); nothing else. Guards (it refuses and writes nothing unless all hold): the live code of every base/ file equals it
# (md5; base/ is the live 681c085a code of those nodes); the live connections and node count equal those of the base read (data/workflow_live.json);
# no node of flow/nodes.json exists yet; every link to remove exists. After the PUT it reads the workflow back and checks the code, the links and
# that no other node changed. Needs N8N_API_KEY in the environment (never printed). --dry: guards and the plan only.
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
FL=json.load(open(f'{H}/flow/nodes.json'))
changed=sorted(f[:-3] for f in os.listdir(f'{H}/new') if f.endswith('.js'))
base=sorted(f[:-3] for f in os.listdir(f'{H}/base') if f.endswith('.js'))
REF=json.load(open(f'{H}/data/workflow_live.json'))
wf=req('GET');N={n['name']:n for n in wf['nodes']}
print('live versionId',wf.get('versionId'),'| base read versionId',REF.get('versionId'))
bad=[]
if changed!=base: bad.append('new/ and base/ name different nodes')
for nm in base:
    if nm not in N: bad.append(f'{nm}: not in the live workflow');continue
    live=N[nm]['parameters'].get('jsCode','');b=open(f'{H}/base/{nm}.js').read()
    if md(live)!=md(b): bad.append(f'{nm}: live code moved since the base ({md(live)[:8]} != {md(b)[:8]})')
L0=links(wf)
if L0!=links(REF): bad.append('connections moved since the base read: '+str(sorted(L0^links(REF)))[:600])
if len(wf['nodes'])!=len(REF['nodes']): bad.append(f"node count moved: {len(wf['nodes'])} live, {len(REF['nodes'])} in the base read")
for n in FL['add_nodes']:
    if n['name'] in N: bad.append(f"{n['name']}: already in the live workflow")
for a,i,b,j in FL['remove_links']:
    if (a,'main',i,b,'main',j) not in L0: bad.append(f'link to remove not found: {a}[{i}] -> {b}')
if bad: sys.exit('REFUSED, nothing written:\n  '+'\n  '.join(bad))
print(f'guards passed: base matched for {len(base)} code nodes; connections ({len(L0)}) and node count ({len(wf["nodes"])}) equal the base read; {len(FL["add_nodes"])} nodes to add are absent; {len(FL["remove_links"])} links to remove exist')
new=copy.deepcopy(wf);NN={n['name']:n for n in new['nodes']}
for nm in changed: NN[nm]['parameters']['jsCode']=open(f'{H}/new/{nm}.js').read()
new['nodes']+=copy.deepcopy(FL['add_nodes'])
C=new['connections']
for a,i,b,j in FL['remove_links']:
    C[a]['main'][i]=[t for t in C[a]['main'][i] if not (t['node']==b and t.get('index',0)==j)]
for a,i,b,j in FL['add_links']:
    C.setdefault(a,{}).setdefault('main',[])
    while len(C[a]['main'])<=i: C[a]['main'].append([])
    C[a]['main'][i].append({'node':b,'type':'main','index':j})
want=(L0-{(a,'main',i,b,'main',j) for a,i,b,j in FL['remove_links']})|{(a,'main',i,b,'main',j) for a,i,b,j in FL['add_links']}
if links(new)!=want: sys.exit('REFUSED: the planned connections do not come out as listed')
for nm in changed: print(f'  {nm:30} base {md(open(f"{H}/base/{nm}.js").read())[:8]} -> new {md(open(f"{H}/new/{nm}.js").read())[:8]}')
for n in FL['add_nodes']: print(f"  ADD {n['name']:30} {n['type']}")
for a,i,b,j in FL['remove_links']: print(f'  UNLINK {a}[{i}] -> {b}')
for a,i,b,j in FL['add_links']: print(f'  LINK   {a}[{i}] -> {b}')
body={k:new[k] for k in ('name','nodes','connections','settings') if k in new}
if DRY: print(f'DRY: would PUT {len(changed)} code nodes, {len(FL["add_nodes"])} added nodes, {len(links(new))} connections ({len(L0)} before); nothing written'); sys.exit()
req('PUT',body)
back=req('GET');B={n['name']:n for n in back['nodes']};fail=[]
for nm in changed:
    a=md(B[nm]['parameters'].get('jsCode',''));f=md(open(f'{H}/new/{nm}.js').read())
    print(f'{nm:30} file {f[:8]} live {a[:8]} {"OK" if a==f else "MISMATCH"}');fail+=[nm] if a!=f else []
for n in FL['add_nodes']:
    if n['name'] not in B: fail.append('missing added node '+n['name'])
if links(back)!=want: fail.append('connections differ from the plan')
other=[n['name'] for n in wf['nodes'] if n['name'] not in changed and json.dumps(n.get('parameters'),sort_keys=True)!=json.dumps(B.get(n['name'],{}).get('parameters'),sort_keys=True)]
print('other nodes changed:',other or 'none','| versionId',back.get('versionId'),'| failures',fail or 'none')
