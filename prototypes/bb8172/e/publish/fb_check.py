# BB-8172 step 6 fetch-back: a saved workflow JSON (get_workflow_details / get_workflow_version) against publish/new (24 changed nodes)
# and the f620e9a9 reference for every other node (v_dfa2da34 jsCode, with the 20 cd1f401 nodes from build/base). Usage: fb_check.py <saved.json>
import json,sys,hashlib,os
H=os.path.dirname(os.path.abspath(__file__));ROOT=os.path.abspath(os.path.join(H,'..','..','..','..'))
def nodes_of(x):
    if isinstance(x,dict):
        if isinstance(x.get('nodes'),list): return x
        for v in x.values():
            r=nodes_of(v)
            if r: return r
D=nodes_of(json.load(open(sys.argv[1])));B=nodes_of(json.load(open(os.path.join(ROOT,'prototypes/debate_fixed/run28489_e/run28689/p14e/p9/v_dfa2da34.json'))))
L={n['name']:n for n in D['nodes']};BL={n['name']:n for n in B['nodes']}
base=os.path.join(ROOT,'prototypes/bb8172/e/build/base');ref={f[:-3].replace('_',' '):open(os.path.join(base,f),encoding='utf-8').read() for f in os.listdir(base)}
new={f[:-3].replace('_',' '):open(os.path.join(H,'new',f),encoding='utf-8').read() for f in os.listdir(os.path.join(H,'new'))}
m=lambda s:hashlib.md5(s.encode()).hexdigest()[:8]
ok_new=bad=0;out=[]
for nm,txt in sorted(new.items()):
  live=(L.get(nm) or {}).get('parameters',{}).get('jsCode')
  if live==txt: ok_new+=1
  else: bad+=1;out.append(('NEW MISMATCH',nm,m(live or ''),m(txt)))
other=[n for n in L if n not in new];oth_ok=0
for nm in other:
  exp=dict(BL[nm]['parameters']) if nm in BL else None
  if exp is not None and nm in ref: exp['jsCode']=ref[nm]
  if exp==L[nm]['parameters']: oth_ok+=1
  else: out.append(('OTHER DIFFERS',nm))
print('nodes',len(L),'| 25 files: equal',ok_new,'mismatch',bad,'| other',len(other),'equal',oth_ok,'| connections = dfa2da34:',D.get('connections')==B.get('connections'))
for o in out: print(*o)
