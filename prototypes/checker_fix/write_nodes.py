# write_nodes.py (checker_fix; copied from prototypes/maxtok): writes the patched code nodes into ORACLE_DEBATE_V1 from new/*.js, byte for byte, via the n8n public API,
# then reads the workflow back and compares each node's code hash with its file. Needs N8N_API_KEY in the environment.
# Refuses unless the live workflow's code for each node still equals base/*.js (the version the patch was built on).
import json,os,sys,hashlib,urllib.request
KEY=os.environ.get('N8N_API_KEY') or sys.exit('N8N_API_KEY not set')
BASE='https://truthapp.app.n8n.cloud/api/v1/workflows/moMxiV4Irg1uRBZN'
md=lambda s:hashlib.md5(s.encode()).hexdigest()
def req(method,data=None):
    r=urllib.request.Request(BASE,method=method,headers={'X-N8N-API-KEY':KEY,'Content-Type':'application/json','Accept':'application/json'},data=None if data is None else json.dumps(data).encode())
    return json.load(urllib.request.urlopen(r,timeout=120))
names=["Alternate Build", "Alternate Cure Build", "Alternate Cure Normalize", "Alternate Merge", "Alternate Payloads", "Cure Build", "Cure Check", "Cure Normalize", "Extract Independent Verdict", "Panel Cure Build 1", "Panel Cure Build 2", "Panel Cure Build 3", "Panel Cure Check", "Panel Cure Normalize 1", "Panel Cure Normalize 2", "Panel Cure Normalize 3", "Panel Payloads"]  # checker_fix: the 17 nodes changed (K-C in all 17; K-G4 in the 14 that carry cureVerdicts)
wf=req('GET'); N={n['name']:n for n in wf['nodes']}
for nm in names:
    live=N[nm]['parameters']['jsCode']; base=open(f'base/{nm}.js').read()
    if md(live)!=md(base): sys.exit(f'REFUSED: live code of {nm} moved since the base ({md(live)} != {md(base)})')
for nm in names: N[nm]['parameters']['jsCode']=open(f'new/{nm}.js').read()
body={k:wf[k] for k in ('name','nodes','connections','settings') if k in wf}
if '--dry' in sys.argv: print('DRY: base matched for',len(names),'nodes; nothing written'); sys.exit()
req('PUT',body)
back=req('GET'); B={n['name']:n for n in back['nodes']}; bad=0
for nm in names:
    a=md(B[nm]['parameters']['jsCode']); f=md(open(f'new/{nm}.js').read()); bad+=a!=f
    print(f'{nm:28} file {f[:8]} live {a[:8]} {"OK" if a==f else "MISMATCH"}')
other=[n['name'] for n in wf['nodes'] if n['name'] not in names and json.dumps(n.get('parameters'),sort_keys=True)!=json.dumps(B.get(n['name'],{}).get('parameters'),sort_keys=True)]
print('other nodes changed:',other or 'none','| versionId',back.get('versionId'),'| mismatches',bad)
