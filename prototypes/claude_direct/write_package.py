# write_package.py (claude_direct): the change as ONE guarded PUT to ORACLE_DEBATE_V1 (moMxiV4Irg1uRBZN) through the n8n public API.
# NOT RUN except with --dry in this package. It replaces the code of the 18 nodes in new/ (byte for byte); it adds no node and changes no
# connection or HTTP node (the 8 "<round> Call anthropic" nodes already exist, wired from each Route's output 0 to the round's Extract).
# Guards (it refuses and writes nothing unless all hold): the live code of every base/ file equals it (md5; base/ is the live 57222efa code);
# the live connections and node count equal the base read (data/workflow_live.json); each "<round> Call anthropic" node still posts
# {{ $json.call.body }} to https://api.anthropic.com/v1/messages with credential anthropicApi rGnzgJBTBRDmDPA4, anthropic-version 2023-06-01,
# timeout 900000, retryOnFail, onError continueErrorOutput; each Route's output 0 goes to it and its output 0 to the round's Extract.
# After the PUT it reads the workflow back and checks the code and that no other node changed. Needs N8N_API_KEY (never printed).
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
if changed!=base: bad.append('new/ and base/ name different nodes')
for nm in base:
    if nm not in N: bad.append(f'{nm}: not in the live workflow');continue
    live=N[nm]['parameters'].get('jsCode','');b=open(f'{H}/base/{nm}.js').read()
    if md(live)!=md(b): bad.append(f'{nm}: live code moved since the base ({md(live)[:8]} != {md(b)[:8]})')
L0=links(wf)
if L0!=links(REF): bad.append('connections moved since the base read: '+str(sorted(L0^links(REF)))[:600])
if len(wf['nodes'])!=len(REF['nodes']): bad.append(f"node count moved: {len(wf['nodes'])} live, {len(REF['nodes'])} in the base read")
for r in ['D1','C1','D2','C2','D3','C3','D4','C4']:
    c=N.get(r+' Call anthropic')
    if not c: bad.append(r+' Call anthropic: missing');continue
    p=c['parameters'];hd={h['name']:h['value'] for h in (p.get('headerParameters') or {}).get('parameters',[])}
    want=[(p.get('method'),'POST'),(p.get('url'),'https://api.anthropic.com/v1/messages'),(p.get('authentication'),'predefinedCredentialType'),(p.get('nodeCredentialType'),'anthropicApi'),
          ((c.get('credentials') or {}).get('anthropicApi',{}).get('id'),'rGnzgJBTBRDmDPA4'),(hd.get('anthropic-version'),'2023-06-01'),(p.get('jsonBody'),'={{ $json.call.body }}'),
          ((p.get('options') or {}).get('timeout'),900000),(c.get('retryOnFail'),True),(c.get('onError'),'continueErrorOutput'),(c.get('disabled',False),False)]
    for got,exp in want:
        if got!=exp: bad.append(f'{r} Call anthropic: {got!r} where {exp!r} is required')
    if (r+' Route','main',0,r+' Call anthropic','main',0) not in L0: bad.append(f'{r} Route output 0 does not go to {r} Call anthropic')
    if (r+' Call anthropic','main',0,r+' Extract','main',0) not in L0: bad.append(f'{r} Call anthropic output 0 does not go to {r} Extract')
if bad: sys.exit('REFUSED, nothing written:\n  '+'\n  '.join(bad))
print(f'guards passed: base matched for {len(base)} code nodes; connections ({len(L0)}) and node count ({len(wf["nodes"])}) equal the base read; the 8 Call anthropic nodes and their links are as required')
new=copy.deepcopy(wf);NN={n['name']:n for n in new['nodes']}
for nm in changed: NN[nm]['parameters']['jsCode']=open(f'{H}/new/{nm}.js').read()
if links(new)!=L0: sys.exit('REFUSED: the connections would change')
for nm in changed: print(f'  {nm:20} base {md(open(f"{H}/base/{nm}.js").read())[:8]} -> new {md(open(f"{H}/new/{nm}.js").read())[:8]}')
body={k:new[k] for k in ('name','nodes','connections','settings') if k in new}
if DRY: print(f'DRY: would PUT {len(changed)} code nodes, 0 added nodes, {len(L0)} connections unchanged; nothing written'); sys.exit()
req('PUT',body)
back=req('GET');Bk={n['name']:n for n in back['nodes']};fail=[]
for nm in changed:
    a=md(Bk[nm]['parameters'].get('jsCode',''));f=md(open(f'{H}/new/{nm}.js').read())
    print(f'{nm:20} file {f[:8]} live {a[:8]} {"OK" if a==f else "MISMATCH"}');fail+=[nm] if a!=f else []
if links(back)!=L0: fail.append('connections changed')
other=[n['name'] for n in wf['nodes'] if n['name'] not in changed and json.dumps(n.get('parameters'),sort_keys=True)!=json.dumps(Bk.get(n['name'],{}).get('parameters'),sort_keys=True)]
print('other nodes changed:',other or 'none','| versionId',back.get('versionId'),'| failures',fail or 'none')
