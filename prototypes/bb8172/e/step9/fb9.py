# step 9c fetch-back: python3 fb9.py <saved get_workflow_details> [<reference fac469ef details>]
# the 3 step-9 nodes must equal step9/new; every other node and the connections must equal the reference (fac469ef).
import json,sys,os,hashlib
H=os.path.dirname(os.path.abspath(__file__))
REF=sys.argv[2] if len(sys.argv)>2 else '/root/.claude/projects/-home-user-searchthescriptures/58ba9d31-f07a-5e6e-a230-4fe44a036213/tool-results/mcp-n8n-get_workflow_details-1793339644330.txt'
def wf(p):
    d=json.load(open(p));w=d['workflow'];return w
m=lambda s:hashlib.md5(s.encode()).hexdigest()
L,R=wf(sys.argv[1]),wf(REF)
LN={n['name']:n for n in L['nodes']};RN={n['name']:n for n in R['nodes']}
S={'Format Markdown':'Format_Markdown.js','Build Independent Verdict':'Build_Independent_Verdict.js','Panel Build':'Panel_Build.js'}
res=[]
for nm,f in S.items():
    t=open(os.path.join(H,'new',f),encoding='utf-8').read();live=LN[nm]['parameters'].get('jsCode','')
    res.append((nm,'EQUAL' if live==t else 'MISMATCH',m(live)[:8],m(t)[:8]))
oth=[k for k in RN if k not in S];eq=sum(1 for k in oth if json.dumps(LN.get(k),sort_keys=True)==json.dumps(RN[k],sort_keys=True))
rest=[k for k in oth if json.dumps(LN.get(k),sort_keys=True)!=json.dumps(RN[k],sort_keys=True)]
# within the 3 nodes, everything but jsCode must equal the reference too
other_fields=all(json.dumps({**LN[k],'parameters':{**LN[k]['parameters'],'jsCode':None}},sort_keys=True)==json.dumps({**RN[k],'parameters':{**RN[k]['parameters'],'jsCode':None}},sort_keys=True) for k in S)
conn=json.dumps(L.get('connections'),sort_keys=True)==json.dumps(R.get('connections'),sort_keys=True)
for r in res: print(*r)
print('draft',L['versionId'],'active',L['activeVersionId'],'nodes',len(L['nodes']),'| other',len(oth),'equal',eq,'unequal',rest[:5],'| 3-node non-code fields equal',other_fields,'| connections equal',conn)
