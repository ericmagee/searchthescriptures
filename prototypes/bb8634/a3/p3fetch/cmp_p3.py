import json,hashlib,sys
P='/tmp/claude-0/-home-user-searchthescriptures/b26695b3-56b9-5f42-92b7-63fcf7fb72c9/scratchpad/v8689/prototypes/bb8634/e/p3/new/'
md=lambda s: hashlib.md5(s.encode()).hexdigest()
new=json.load(open('v8a7f48d3_active.json'))['workflow']
old=json.load(open('/home/user/searchthescriptures/prototypes/bb8403/a3/s2fetch/vbb147946_active.json'))['workflow']
print('versionId',new.get('versionId'),'activeVersionId',new.get('activeVersionId'),'active',new.get('active'),'nodes',len(new['nodes']),'updatedAt',new.get('updatedAt'))
files={'Init with Guards':'Init_with_Guards','C2 Build':'C2_Build','C3 Build':'C3_Build','D3 Build':'D3_Build','Panel Build':'Panel_Build','Build Independent Verdict':'Build_Independent_Verdict','Extract Independent Verdict':'Extract_Independent_Verdict'}
N={n['name']:n for n in new['nodes']}; O={n['name']:n for n in old['nodes']}
print('names equal', set(N)==set(O))
diff=[]
for k in N:
    a=json.dumps(O[k],sort_keys=True); b=json.dumps(N[k],sort_keys=True)
    if a!=b:
        oa=dict(O[k]); nb=dict(N[k]); op=dict(oa['parameters']); np_=dict(nb['parameters'])
        op.pop('jsCode',None); np_.pop('jsCode',None); oa['parameters']=op; nb['parameters']=np_
        diff.append((k, json.dumps(oa,sort_keys=True)==json.dumps(nb,sort_keys=True)))
print('differing nodes',len(diff),diff)
for k,f in files.items():
    c=N[k]['parameters']['jsCode']; e=open(P+f+'.js').read()
    print(k, md(c), 'EQUAL git 8d90569' if c==e else 'DIFFER')
print('connections equal', json.dumps(new['connections'],sort_keys=True)==json.dumps(old['connections'],sort_keys=True))
print('settings equal', json.dumps(new.get('settings'),sort_keys=True)==json.dumps(old.get('settings'),sort_keys=True))
