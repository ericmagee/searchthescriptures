# write_package.py (judge_fix9): the whole flow change as ONE guarded PUT to ORACLE_DEBATE_V1 (moMxiV4Irg1uRBZN) through the n8n public API.
# READ-ONLY BY DEFAULT: it writes only when run with the explicit flag --write. With no flag, or with --dry, it makes one GET, checks the guards
# and prints the plan, and writes nothing. (Fix set 8's script wrote unless --dry was given; this one does not.)
# The change: the code of the nodes in new/ (byte for byte), the nodes of add/nodes_9.json (the [L2] reads; a code node's jsCode from its
# @file:), and exactly the links that file names (7 removed, 23 added); nothing else.
# Guards (it refuses and writes nothing unless all hold): the live code of every base/ node equals base/ (md5; base/ is the live cb4b94e0 code
# of the nodes changed); the live connections and node count equal those of the base read (data/workflow_live.json); the live versionId equals
# the base read's; no added name or id exists live; every link to remove is live; every node an added link names exists after the add; no
# connection outside the planned sources changes. After a PUT (--write only) it reads the workflow back and checks the code, the added nodes,
# the connections and that no other node changed. Needs N8N_API_KEY in the environment (never printed).
import json,os,sys,hashlib,copy,urllib.request
WRITE='--write' in sys.argv
if WRITE and '--dry' in sys.argv: sys.exit('REFUSED: --write and --dry together')
KEY=os.environ.get('N8N_API_KEY') or sys.exit('N8N_API_KEY not set')
BASE='https://truthapp.app.n8n.cloud/api/v1/workflows/moMxiV4Irg1uRBZN'
H=os.path.dirname(os.path.abspath(__file__))
md=lambda s:hashlib.md5(s.encode()).hexdigest()
def req(method,data=None):
    if method!='GET' and not WRITE: sys.exit('REFUSED: a '+method+' without --write')
    r=urllib.request.Request(BASE,method=method,headers={'X-N8N-API-KEY':KEY,'Content-Type':'application/json','Accept':'application/json'},data=None if data is None else json.dumps(data).encode())
    return json.load(urllib.request.urlopen(r,timeout=120))
def links(wf):
    out=set()
    for a,v in wf['connections'].items():
        for typ,outs in v.items():
            for i,o in enumerate(outs or []):
                for t in o or []: out.add((a,typ,i,t['node'],t.get('type','main'),t.get('index',0)))
    return out
def editlinks(wf):
    C=wf['connections']
    for (a,typ,i,b,bt,bi) in sorted(RM):
        lst=C[a][typ][i];k=[j for j,t in enumerate(lst) if t['node']==b and t.get('type','main')==bt and t.get('index',0)==bi]
        if len(k)!=1: sys.exit(f'REFUSED: link to remove found {len(k)} times: {a} -> {b}')
        del lst[k[0]]
    for (a,typ,i,b,bt,bi) in sorted(AL):
        outs=C.setdefault(a,{}).setdefault(typ,[])
        while len(outs)<=i: outs.append([])
        outs[i].append({'node':b,'type':bt,'index':bi})
changed=sorted(f[:-3] for f in os.listdir(f'{H}/new') if f.endswith('.js'))
base=sorted(f[:-3] for f in os.listdir(f'{H}/base') if f.endswith('.js'))
SPEC=json.load(open(f'{H}/add/nodes_9.json'))
ADD=[]
for n in SPEC['nodes']:
    n=copy.deepcopy(n);jc=n['parameters'].get('jsCode')
    if isinstance(jc,str) and jc.startswith('@file:'): n['parameters']['jsCode']=open(f'{H}/'+jc[6:]).read()
    ADD.append(n)
RM={tuple(x) for x in SPEC['remove_links']};AL={tuple(x) for x in SPEC['add_links']}
REF=json.load(open(f'{H}/data/workflow_live.json'))
wf=req('GET');N={n['name']:n for n in wf['nodes']}
print('mode',('WRITE' if WRITE else 'DRY (read-only; --write not given)'),'| live versionId',wf.get('versionId'),'| base read versionId',REF.get('versionId'))
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
for n in ADD:
    if n['name'] in N: bad.append(f"{n['name']}: an added node's name exists live")
    if any(n['id']==m.get('id') for m in wf['nodes']): bad.append(f"{n['name']}: an added node's id exists live")
for x in RM:
    if x not in L0: bad.append(f'link to remove not live: {x}')
names=set(N)|{n['name'] for n in ADD}
for x in AL:
    if x[0] not in names or x[3] not in names: bad.append(f'added link names a node that will not exist: {x}')
    if x in L0: bad.append(f'added link already live: {x}')
if bad: sys.exit('REFUSED, nothing written:\n  '+'\n  '.join(bad))
print(f'guards passed: base matched for {len(base)} code nodes; versionId, connections ({len(L0)}) and node count ({len(wf["nodes"])}) equal the base read; {len(ADD)} added names and ids free; {len(RM)} links to remove are live')
new=copy.deepcopy(wf);NN={n['name']:n for n in new['nodes']}
for nm in changed: NN[nm]['parameters']['jsCode']=open(f'{H}/new/{nm}.js').read()
new['nodes']=new['nodes']+ADD
L1=(L0-RM)|AL;editlinks(new)
srcs={x[0] for x in RM|AL}
if any(json.dumps(wf['connections'].get(a),sort_keys=True)!=json.dumps(new['connections'].get(a),sort_keys=True) for a in wf['connections'] if a not in srcs): sys.exit('REFUSED: a connection outside the planned sources would change')
if links(new)!=L1 or (links(new)-L0)!=AL or (L0-links(new))!=RM: sys.exit('REFUSED: the planned connections are not exactly the live ones less the removed and plus the added links')
for nm in changed: print(f'  {nm:30} base {md(open(f"{H}/base/{nm}.js").read())[:8]} -> new {md(open(f"{H}/new/{nm}.js").read())[:8]}')
for n in ADD: print(f"  + {n['name']:28} {n['type'].split('.')[-1]:12} {md(n['parameters']['jsCode'])[:8] if 'jsCode' in n['parameters'] else ''}")
for x in sorted(RM): print('  - link',x[0],'['+str(x[2])+'] ->',x[3])
for x in sorted(AL): print('  + link',x[0],'['+str(x[2])+'] ->',x[3])
body={k:new[k] for k in ('name','nodes','connections','settings') if k in new}
if not WRITE: print(f'DRY: would PUT {len(changed)} code nodes changed, {len(ADD)} nodes added ({len(new["nodes"])} nodes), {len(L1)} connections ({len(RM)} removed, {len(AL)} added); nothing written (run with --write to write)'); sys.exit()
req('PUT',body)
back=req('GET');B={n['name']:n for n in back['nodes']};fail=[]
for nm in changed:
    a=md(B[nm]['parameters'].get('jsCode',''));f=md(open(f'{H}/new/{nm}.js').read())
    print(f'{nm:30} file {f[:8]} live {a[:8]} {"OK" if a==f else "MISMATCH"}');fail+=[nm] if a!=f else []
for n in ADD:
    if n['name'] not in B or json.dumps(B[n['name']].get('parameters'),sort_keys=True)!=json.dumps(n['parameters'],sort_keys=True): fail.append('added node differs: '+n['name'])
if links(back)!=L1: fail.append('connections differ from the plan')
other=[n['name'] for n in wf['nodes'] if n['name'] not in changed and json.dumps(n.get('parameters'),sort_keys=True)!=json.dumps(B.get(n['name'],{}).get('parameters'),sort_keys=True)]
print('other nodes changed:',other or 'none','| versionId',back.get('versionId'),'| failures',fail or 'none')
