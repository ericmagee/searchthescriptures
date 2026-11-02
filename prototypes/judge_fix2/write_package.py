# write_package.py (judge_fix2): the whole flow change as ONE guarded PUT to ORACLE_DEBATE_V1 (moMxiV4Irg1uRBZN) through the n8n public API.
#  1. replaces the code of the 24 nodes in new/ (byte for byte);
#  2. adds the node "Write Enforcer Log" from flow/write_enforcer_log_node.json (POST rpc/record_enforcer_log, Supabase Anon Key, as Write Judgment 1-3);
#  3. rewires: Write Judgment 3 (main 0) -> Write Enforcer Log; Write Enforcer Log (main 0 and its error output, main 1) -> Derive Outcome.
#     Write Judgment 3's error output (-> Panel Failure Note) and every other path are kept.
# Guards (it refuses and writes nothing unless all hold): the live code of each of the 24 nodes equals base/<node>.js (md5); the live
# connections leaving Write Judgment 3 and Derive Outcome, and the set of links into Derive Outcome, equal those of the base read
# (data/workflow_live.json, version 52b05334); no node named "Write Enforcer Log" exists yet.
# After the PUT it reads the workflow back and checks each node's code, the new node, the new connections, and that no other node's
# parameters and no other connection changed. Needs N8N_API_KEY in the environment (never printed). --dry: guards and diff only.
import json,os,sys,hashlib,copy,uuid,urllib.request
DRY='--dry' in sys.argv
KEY=os.environ.get('N8N_API_KEY') or sys.exit('N8N_API_KEY not set')
BASE='https://truthapp.app.n8n.cloud/api/v1/workflows/moMxiV4Irg1uRBZN'
H=os.path.dirname(os.path.abspath(__file__))
md=lambda s:hashlib.md5(s.encode()).hexdigest()
def req(method,data=None):
    r=urllib.request.Request(BASE,method=method,headers={'X-N8N-API-KEY':KEY,'Content-Type':'application/json','Accept':'application/json'},data=None if data is None else json.dumps(data).encode())
    return json.load(urllib.request.urlopen(r,timeout=120))
names=sorted(f[:-3] for f in os.listdir(f'{H}/new') if f.endswith('.js'))
SPEC=json.load(open(f'{H}/flow/write_enforcer_log_node.json'));NEWN=SPEC['node']['name']
REF=json.load(open(f'{H}/data/workflow_live.json'))
def links(wf):  # every connection as a tuple (from, type, output index, to, to type, to index)
    out=set()
    for a,v in wf['connections'].items():
        for typ,outs in v.items():
            for i,o in enumerate(outs or []):
                for t in o or []: out.add((a,typ,i,t['node'],t.get('type','main'),t.get('index',0)))
    return out
around=lambda L:{x for x in L if x[0] in ('Write Judgment 3','Derive Outcome') or x[3]=='Derive Outcome'}

wf=req('GET');N={n['name']:n for n in wf['nodes']}
print('live versionId',wf.get('versionId'))
bad=[]
for nm in names:
    if nm not in N: bad.append(f'{nm}: not in the live workflow');continue
    live=N[nm]['parameters'].get('jsCode','');base=open(f'{H}/base/{nm}.js').read()
    if md(live)!=md(base): bad.append(f'{nm}: live code moved since the base ({md(live)[:8]} != {md(base)[:8]})')
if NEWN in N: bad.append(f'{NEWN}: already in the workflow')
L0=links(wf)
if around(L0)!=around(links(REF)): bad.append('connections around Write Judgment 3 / Derive Outcome moved since the base: '+str(sorted(around(L0)^around(links(REF)))))
if bad: sys.exit('REFUSED, nothing written:\n  '+'\n  '.join(bad))
print(f'guards passed: base matched for {len(names)} nodes; connections of Write Judgment 3 and Derive Outcome match the base; {NEWN} absent')

new=copy.deepcopy(wf);NN={n['name']:n for n in new['nodes']}
for nm in names: NN[nm]['parameters']['jsCode']=open(f'{H}/new/{nm}.js').read()
node=copy.deepcopy(SPEC['node']);node['id']=str(uuid.uuid5(uuid.NAMESPACE_URL,'judge_fix2/'+NEWN));new['nodes'].append(node)
C=new['connections']
C['Write Judgment 3']['main'][0]=[{'node':NEWN,'type':'main','index':0}]
C[NEWN]={'main':[[{'node':'Derive Outcome','type':'main','index':0}],[{'node':'Derive Outcome','type':'main','index':0}]]}
L1=links(new)
print('connection diff (- removed, + added):')
for x in sorted(L0-L1): print('  -',x)
for x in sorted(L1-L0): print('  +',x)
kept=[x for x in L0 if x[0]=='Write Judgment 3' and x[2]==1];print('  kept: Write Judgment 3 error output ->',[x[3] for x in kept])
body={k:new[k] for k in ('name','nodes','connections','settings') if k in new}
if DRY: print(f'DRY: would PUT {len(names)} code nodes, add "{NEWN}", rewire as above; nothing written'); sys.exit()

req('PUT',body)
back=req('GET');B={n['name']:n for n in back['nodes']};fail=[]
for nm in names:
    a=md(B[nm]['parameters'].get('jsCode',''));f=md(open(f'{H}/new/{nm}.js').read())
    print(f'{nm:30} file {f[:8]} live {a[:8]} {"OK" if a==f else "MISMATCH"}');fail+=[nm] if a!=f else []
if NEWN not in B or json.dumps(B[NEWN]['parameters'],sort_keys=True)!=json.dumps(SPEC['node']['parameters'],sort_keys=True): fail.append(NEWN+' parameters')
LB=links(back)
if LB!=L1: fail.append('connections differ from the plan: '+str(sorted(LB^L1)))
other=[n['name'] for n in wf['nodes'] if n['name'] not in names and json.dumps(n.get('parameters'),sort_keys=True)!=json.dumps(B.get(n['name'],{}).get('parameters'),sort_keys=True)]
print('other nodes changed:',other or 'none','| connections as planned:',LB==L1,'| versionId',back.get('versionId'),'| failures',fail or 'none')
