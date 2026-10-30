import json,sys,os,hashlib
new=json.load(open(sys.argv[1]))['workflow']; old=json.load(open(sys.argv[2]))['workflow']; exp=sys.argv[3]
m=lambda s:hashlib.md5(s.encode()).hexdigest()[:8]
print('LIVE versionId',new['versionId'],'activeVersionId',new.get('activeVersionId'),'active',new['active'],'nodes',len(new['nodes']))
print('BASE versionId',old['versionId'],'nodes',len(old['nodes']))
N={n['name']:n for n in new['nodes']}; O={n['name']:n for n in old['nodes']}
print('name sets equal',set(N)==set(O), 'only_new',sorted(set(N)-set(O)),'only_old',sorted(set(O)-set(N)))
targets={f[:-3].replace('_',' '):f for f in os.listdir(exp)}
eq=0
for t,f in sorted(targets.items()):
    e=open(os.path.join(exp,f),encoding='utf-8').read()
    n=N.get(t); 
    if n is None: print('MISSING',t); continue
    c=n['parameters'].get('jsCode')
    rest_eq={k:v for k,v in n.items() if k!='parameters'}=={k:v for k,v in O[t].items() if k!='parameters'} and {k:v for k,v in n['parameters'].items() if k!='jsCode'}=={k:v for k,v in O[t]['parameters'].items() if k!='jsCode'}
    ok=(c==e); eq+=ok and rest_eq
    print(('EQUAL ' if ok else 'DIFF  ')+t, 'live',m(c or ''),'git',m(e),'base',m(O[t]['parameters'].get('jsCode','')),'non-code fields equal base:',rest_eq)
print('TARGETS EQUAL',eq,'of',len(targets))
oth=[k for k in N if k not in targets]; d=[k for k in oth if N[k]!=O[k]]
print('OTHER nodes',len(oth),'equal base',len(oth)-len(d),'diff',d)
print('connections equal base',new['connections']==old['connections'])
for k in ('settings','pinData','staticData'):
    print(k,'equal base',new.get(k)==old.get(k))
