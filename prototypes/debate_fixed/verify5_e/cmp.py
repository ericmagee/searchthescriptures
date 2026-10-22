import json,hashlib,os,sys
S=sys.argv[1]
def load(p):
    d=json.load(open(p))
    if 'nodes' not in d and 'result' in d: d=json.loads(d['result'])
    return d
D=load(S+'/draft_207435d3.json'); B=load(S+'/v428fbdc3.json')
print('ids',D['versionId'],B['versionId'],'nodes',len(D['nodes']),len(B['nodes']))
md5=lambda s:hashlib.md5(s.encode()).hexdigest()
dn={n['name']:n for n in D['nodes']}; bn={n['name']:n for n in B['nodes']}
print('same names',set(dn)==set(bn))
M=json.load(open(S+'/NEW10_MD5S.json'))
changed=set()
ok=0
for f in sorted(os.listdir(S+'/new10')):
    k=f[:-3]; name=k.replace('_',' ')
    if name not in dn: print('MISSING',name); continue
    changed.add(name)
    code=dn[name]['parameters'].get('jsCode')
    filec=open(S+'/new10/'+f).read()
    basec=open(S+'/base10/'+f).read()
    e=(code==filec); m=md5(code)
    bl=bn[name]['parameters'].get('jsCode')==basec
    # other fields equal to 428 except jsCode
    a=json.loads(json.dumps(dn[name])); b=json.loads(json.dumps(bn[name]))
    a['parameters'].pop('jsCode',None); b['parameters'].pop('jsCode',None)
    rest=(a==b)
    good=e and m==M[k]['new10'] and bl and md5(basec)==M[k]['base10'] and rest
    ok+=good
    print(('OK ' if good else 'BAD'),name,m[:8],'file_eq',e,'md5json',m==M[k]['new10'],'base428_eq',bl,'otherfields_eq',rest)
print('changed ok',ok,'of',len(changed))
diff=[n for n in dn if n not in changed and json.dumps(dn[n],sort_keys=True)!=json.dumps(bn.get(n),sort_keys=True)]
print('unchanged nodes differing from 428:',len(diff),diff[:5])
print('connections equal',json.dumps(D['connections'],sort_keys=True)==json.dumps(B['connections'],sort_keys=True))
