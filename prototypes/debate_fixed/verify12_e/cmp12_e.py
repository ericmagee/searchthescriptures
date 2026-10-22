# Step 5 (Worker_E, 7397 rev 8): a fetched draft against new12 files (git 22a4aec) and my own fetch of 449a4cf2.
import json,sys,hashlib,os
f,N,B,BASE=sys.argv[1:5]
D=json.load(open(f));A=json.load(open(BASE))
md5=lambda b:hashlib.md5(b).hexdigest()
dn={n['name']:n for n in D['nodes']};an={n['name']:n for n in A['nodes']}
key=lambda n:n.replace(' ','_')
files={k[:-3]:k for k in os.listdir(N) if k.endswith('.js')}
code=[n for n in dn if key(n) in files]
eqn=[n for n in code if md5(dn[n]['parameters'].get('jsCode','').encode())==md5(open(N+'/'+files[key(n)],'rb').read())]
chg=[n for n in code if open(N+'/'+files[key(n)],'rb').read()!=open(B+'/'+files[key(n)],'rb').read()]
wr=[n for n in chg if n in eqn]
oth=[n for n in dn if n not in chg]
dif=[n for n in oth if json.dumps(dn[n],sort_keys=True)!=json.dumps(an.get(n),sort_keys=True)]
fx=[]
for n in chg:
    a=dict(dn[n]);b=dict(an[n]);a['parameters']={k:v for k,v in a['parameters'].items() if k!='jsCode'};b['parameters']={k:v for k,v in b['parameters'].items() if k!='jsCode'}
    if json.dumps(a,sort_keys=True)!=json.dumps(b,sort_keys=True):fx.append(n)
print(json.dumps({'version':D['versionId'][:8],'base':A['versionId'][:8],'nodes':len(dn),'base_nodes':len(an),'same_names':set(dn)==set(an),'code_nodes':len(code),'code_equal_new12':len(eqn),'changed_set':len(chg),'changed_written':len(wr),'others_differ_from_base':dif,'changed_nodes_other_fields_differ':fx,'connections_equal':json.dumps(D['connections'],sort_keys=True)==json.dumps(A['connections'],sort_keys=True)}))
