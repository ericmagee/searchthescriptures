# write_package.py (judge_fix3): the whole flow change as ONE guarded PUT to ORACLE_DEBATE_V1 (moMxiV4Irg1uRBZN) through the n8n public API.
# Adapted from judge_fix2/write_package.py. NOT RUN except with --dry in this package.
#  1. replaces the code of every node in new/ that exists live (byte for byte; 30 nodes);
#  2. adds the close rounds, 20 nodes copied from the live D3 and C3 groups (same type, version, credentials, retry, timeout, error output):
#     D4 Build, D4 Route, D4 Call {anthropic,openai,gemini,grok,mimo,openrouter,deepseek}, D4 Extract, and the same for C4; the four code
#     nodes take their code from new/ (D4 Build.js, D4 Extract.js, C4 Build.js, C4 Extract.js);
#  3. rewires: - C3 Extract main 0 -> Build Synthesis; + C3 Extract main 0 -> D4 Build; D4 Build -> D4 Route -> D4 Call <fam> (output i as D3 Route);
#     each D4 Call main 0 -> D4 Extract, main 1 (error) -> Failure Salvage; D4 Extract main 0 -> C4 Build, main 1 -> Failure Salvage; the same for
#     C4; + C4 Extract main 0 -> Build Synthesis. Every other connection is kept.
# Guards (it refuses and writes nothing unless all hold): the live code of every base/ file equals it (md5; base/ holds the 30 changed nodes and
# the four D3/C3 templates); the connections leaving C3 Extract and the links into Build Synthesis and Failure Salvage equal those of the base
# read (data/workflow_live.json, version e9f2a2dd); no node named D4 * or C4 * exists yet; the template nodes' parameters equal the base read.
# After the PUT it reads the workflow back and checks each node's code, the 20 new nodes, the connections, and that no other node changed.
# Needs N8N_API_KEY in the environment (never printed). --dry: guards and the planned diff only; writes flow/close_round_nodes.json (the plan).
import json,os,sys,hashlib,copy,uuid,urllib.request
DRY='--dry' in sys.argv
KEY=os.environ.get('N8N_API_KEY') or sys.exit('N8N_API_KEY not set')
BASE='https://truthapp.app.n8n.cloud/api/v1/workflows/moMxiV4Irg1uRBZN'
H=os.path.dirname(os.path.abspath(__file__))
md=lambda s:hashlib.md5(s.encode()).hexdigest()
def req(method,data=None):
    r=urllib.request.Request(BASE,method=method,headers={'X-N8N-API-KEY':KEY,'Content-Type':'application/json','Accept':'application/json'},data=None if data is None else json.dumps(data).encode())
    return json.load(urllib.request.urlopen(r,timeout=120))
FAMS=['anthropic','openai','gemini','grok','mimo','openrouter','deepseek']
NEWCODE={'D4 Build','D4 Extract','C4 Build','C4 Extract'}
base_names=sorted(f[:-3] for f in os.listdir(f'{H}/base') if f.endswith('.js'))
changed=sorted(f[:-3] for f in os.listdir(f'{H}/new') if f.endswith('.js') and f[:-3] not in NEWCODE)
REF=json.load(open(f'{H}/data/workflow_live.json'))
def links(wf):
    out=set()
    for a,v in wf['connections'].items():
        for typ,outs in v.items():
            for i,o in enumerate(outs or []):
                for t in o or []: out.add((a,typ,i,t['node'],t.get('type','main'),t.get('index',0)))
    return out
around=lambda L:{x for x in L if x[0]=='C3 Extract' or x[3] in ('Build Synthesis','Failure Salvage')}
group=lambda r:[f'{r} Build',f'{r} Route']+[f'{r} Call {f}' for f in FAMS]+[f'{r} Extract']

wf=req('GET');N={n['name']:n for n in wf['nodes']};RN={n['name']:n for n in REF['nodes']}
print('live versionId',wf.get('versionId'))
bad=[]
for nm in base_names:
    if nm not in N: bad.append(f'{nm}: not in the live workflow');continue
    live=N[nm]['parameters'].get('jsCode','');b=open(f'{H}/base/{nm}.js').read()
    if md(live)!=md(b): bad.append(f'{nm}: live code moved since the base ({md(live)[:8]} != {md(b)[:8]})')
for r in ('D4','C4'):
    for nm in group(r):
        if nm in N: bad.append(f'{nm}: already in the workflow')
for r in ('D3','C3'):
    for nm in group(r):
        if nm not in N or json.dumps(N[nm]['parameters'],sort_keys=True)!=json.dumps(RN[nm]['parameters'],sort_keys=True): bad.append(f'{nm}: template node moved since the base read')
L0=links(wf)
if around(L0)!=around(links(REF)): bad.append('connections around C3 Extract / Build Synthesis / Failure Salvage moved since the base: '+str(sorted(around(L0)^around(links(REF))))[:600])
if bad: sys.exit('REFUSED, nothing written:\n  '+'\n  '.join(bad))
print(f'guards passed: base matched for {len(base_names)} code nodes ({len(changed)} to change, 4 templates); connections match the base; no D4/C4 node; templates unchanged')

new=copy.deepcopy(wf);NN={n['name']:n for n in new['nodes']}
for nm in changed: NN[nm]['parameters']['jsCode']=open(f'{H}/new/{nm}.js').read()
added=[]
for r3,r4,dy in (('D3','D4',1600),('C3','C4',1600)):
    for nm3,nm4 in zip(group(r3),group(r4)):
        n=copy.deepcopy(N[nm3]);n['name']=nm4;n['id']=str(uuid.uuid5(uuid.NAMESPACE_URL,'judge_fix3/'+nm4));n['position']=[n['position'][0],n['position'][1]+dy]
        if nm4 in NEWCODE: n['parameters']['jsCode']=open(f'{H}/new/{nm4}.js').read()
        new['nodes'].append(n);added.append(nm4)
C=new['connections']
for r,nxt in (('D4','C4 Build'),('C4','Build Synthesis')):
    C[f'{r} Build']={'main':[[{'node':f'{r} Route','type':'main','index':0}]]}
    C[f'{r} Route']={'main':[[{'node':f'{r} Call {f}','type':'main','index':0}] for f in FAMS]}
    for f in FAMS: C[f'{r} Call {f}']={'main':[[{'node':f'{r} Extract','type':'main','index':0}],[{'node':'Failure Salvage','type':'main','index':0}]]}
    C[f'{r} Extract']={'main':[[{'node':nxt,'type':'main','index':0}],[{'node':'Failure Salvage','type':'main','index':0}]]}
C['C3 Extract']['main'][0]=[{'node':'D4 Build','type':'main','index':0}]
# the D3 groups must route identically: D3 Route output i -> D3 Call FAMS[i] (checked, not assumed)
for r in ('D3','C3'):
    outs=wf['connections'][f'{r} Route']['main']
    if [o[0]['node'] for o in outs]!=[f'{r} Call {f}' for f in FAMS]: sys.exit(f'REFUSED: {r} Route outputs are not in FAMS order: {[o[0]["node"] for o in outs]}')
    for f in FAMS:
        o=wf['connections'][f'{r} Call {f}']['main']
        if [x[0]['node'] for x in o]!=[f'{r} Extract','Failure Salvage']: sys.exit(f'REFUSED: {r} Call {f} connections differ from the plan copied')
L1=links(new)
print('nodes added ('+str(len(added))+'):',', '.join(added))
print('connection diff (- removed, + added): -',len(L0-L1),'+',len(L1-L0))
for x in sorted(L0-L1): print('  -',x)
for x in sorted(L1-L0):
    if x[0].startswith(('D4 Call','C4 Call')) and x[3] in ('D4 Extract','C4 Extract','Failure Salvage'): continue
    print('  +',x)
print('  + (and each of the 14 close-round call nodes: main 0 -> its Extract, main 1 -> Failure Salvage)')
plan={'added_nodes':[n for n in new['nodes'] if n['name'] in added],'connections_added':sorted(map(list,L1-L0)),'connections_removed':sorted(map(list,L0-L1)),'code_nodes_changed':changed}
json.dump(plan,open(f'{H}/flow/close_round_nodes.json','w'),indent=1)
body={k:new[k] for k in ('name','nodes','connections','settings') if k in new}
if DRY: print(f'DRY: would PUT {len(changed)} code nodes, add {len(added)} nodes, rewire as above; nothing written (plan: flow/close_round_nodes.json)'); sys.exit()

req('PUT',body)
back=req('GET');B={n['name']:n for n in back['nodes']};fail=[]
for nm in changed+sorted(NEWCODE):
    a=md(B[nm]['parameters'].get('jsCode',''));f=md(open(f'{H}/new/{nm}.js').read())
    print(f'{nm:30} file {f[:8]} live {a[:8]} {"OK" if a==f else "MISMATCH"}');fail+=[nm] if a!=f else []
for nm in added:
    if nm not in B: fail.append(nm+' missing')
LB=links(back)
if LB!=L1: fail.append('connections differ from the plan: '+str(sorted(LB^L1))[:600])
other=[n['name'] for n in wf['nodes'] if n['name'] not in changed and json.dumps(n.get('parameters'),sort_keys=True)!=json.dumps(B.get(n['name'],{}).get('parameters'),sort_keys=True)]
print('other nodes changed:',other or 'none','| connections as planned:',LB==L1,'| versionId',back.get('versionId'),'| failures',fail or 'none')
