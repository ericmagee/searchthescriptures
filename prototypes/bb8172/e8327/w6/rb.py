# BB-8327 step 6 read-back: python3 rb.py <saved get_workflow_details> ; compares every target node's jsCode with git, and every other node and the connections with live 0b025942.
import json,sys,os,hashlib
H=os.path.dirname(os.path.abspath(__file__))
REF='/tmp/claude-0/-home-user-searchthescriptures/58ba9d31-f07a-5e6e-a230-4fe44a036213/scratchpad/live_0830.json'
m=lambda s:hashlib.md5(s.encode()).hexdigest()
L=json.load(open(sys.argv[1]))['workflow'];R=json.load(open(REF))['workflow']
LN={n['name']:n for n in L['nodes']};RN={n['name']:n for n in R['nodes']}
T={}
for f in sorted(os.listdir(os.path.join(H,'..','d1','new'))):T[f[:-3].replace('_',' ')]=os.path.join(H,'..','d1','new',f)
T['Build Save Body']=os.path.join(H,'Build_Save_Body.js');T['Format Markdown']=os.path.join(H,'Format_Markdown.js')
eq=ne=base=0;rows=[]
for k,p in T.items():
    want=open(p,encoding='utf-8').read();got=LN[k]['parameters'].get('jsCode','');b=RN[k]['parameters'].get('jsCode','')
    st='EQUAL' if got==want else ('BASE' if got==b else 'OTHER')
    rows.append((k,st,m(got)[:8],m(want)[:8]))
    eq+=st=='EQUAL';base+=st=='BASE';ne+=st=='OTHER'
    nf=json.dumps({**LN[k],'parameters':{**LN[k]['parameters'],'jsCode':None}},sort_keys=True)==json.dumps({**RN[k],'parameters':{**RN[k]['parameters'],'jsCode':None}},sort_keys=True)
    if not nf: rows.append((k,'NON-CODE FIELDS DIFFER','',''))
for r in rows:print(*r)
oth=[k for k in RN if k not in T];oe=sum(json.dumps(LN.get(k),sort_keys=True)==json.dumps(RN[k],sort_keys=True) for k in oth)
print('draft',L['versionId'],'active',L['activeVersionId'],'nodes',len(L['nodes']),'| targets EQUAL',eq,'BASE',base,'OTHER',ne,'| other nodes',len(oth),'equal',oe,'| connections equal',json.dumps(L['connections'],sort_keys=True)==json.dumps(R['connections'],sort_keys=True))
