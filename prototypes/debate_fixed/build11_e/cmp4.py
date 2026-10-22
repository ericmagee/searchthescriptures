# Step 4 fetch-back compare (Worker_E): a fetched draft version against new11 (the written set) and 207435d3 (all else).
import json,sys,hashlib,os
f,B,BASE=sys.argv[1],sys.argv[2],sys.argv[3]
D=json.load(open(f));A=json.load(open(BASE))
M=json.load(open(B+'/NEW11_MD5S.json'))
md5=lambda s:hashlib.md5(s.encode()).hexdigest()
dn={n['name']:n for n in D['nodes']};an={n['name']:n for n in A['nodes']}
written=[];pending=[];bad=[]
for name,v in sorted(M.items()):
    if v['base11']==v['new11']:continue
    c=dn[name]['parameters'].get('jsCode','');m=md5(c)
    if m==v['new11']:written.append(name)
    elif m==v['base11']:pending.append(name)
    else:bad.append((name,m))
other=[n for n in dn if n not in M or M[n]['base11']==M[n]['new11']]
diff=[]
for n in other:
    a=json.loads(json.dumps(dn[n],sort_keys=True));b=json.loads(json.dumps(an.get(n),sort_keys=True))
    if a!=b:diff.append(n)
# changed nodes: fields other than jsCode equal to base
fx=[]
for name in written+pending:
    a=dict(dn[name]);b=dict(an[name]);a['parameters']={k:v for k,v in a['parameters'].items() if k!='jsCode'};b['parameters']={k:v for k,v in b['parameters'].items() if k!='jsCode'}
    if json.dumps(a,sort_keys=True)!=json.dumps(b,sort_keys=True):fx.append(name)
print(json.dumps({'version':D['versionId'][:8],'nodes':len(dn),'written_equal_new11':len(written),'still_base':len(pending),'neither':bad,'others_differing_from_207435d3':diff,'changed_nodes_other_fields_differ':fx,'connections_equal':json.dumps(D['connections'],sort_keys=True)==json.dumps(A['connections'],sort_keys=True),'written':written}))
