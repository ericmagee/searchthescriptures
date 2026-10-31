# BB-8634 portion 3 read-back: each of the 7 nodes against p3/new (NEW) and the bb147946 base fetch (BASE); whole-flow diff against the base fetch.
import json,sys,hashlib
f=json.load(open(sys.argv[1]))['workflow'];b=json.load(open(sys.argv[2]))['workflow']
NODES={'Init with Guards':'Init_with_Guards','C2 Build':'C2_Build','C3 Build':'C3_Build','D3 Build':'D3_Build','Panel Build':'Panel_Build','Build Independent Verdict':'Build_Independent_Verdict','Extract Independent Verdict':'Extract_Independent_Verdict'}
md=lambda s:hashlib.md5(s.encode()).hexdigest()
nf={n['name']:n for n in f['nodes']};nb={n['name']:n for n in b['nodes']}
print('version',f['versionId'][:8],'active',f['activeVersionId'][:8],'nodes',len(f['nodes']))
for k,fn in NODES.items():
    c=nf[k]['parameters'].get('jsCode','');new=open('p3/new/'+fn+'.js').read();base=nb[k]['parameters'].get('jsCode','')
    print(f"{k:28s} {md(c)[:8]} {'NEW' if c==new else ('BASE' if c==base else 'OTHER')}")
diff=[];other=[]
for k in nb:
    if nf.get(k)!=nb[k]:
        diff.append(k)
        keys=[x for x in set(nf[k])|set(nb[k]) if nf[k].get(x)!=nb[k].get(x)]
        pk=[x for x in set(nf[k].get('parameters',{}))|set(nb[k].get('parameters',{})) if nf[k].get('parameters',{}).get(x)!=nb[k].get('parameters',{}).get(x)]
        if keys!=['parameters'] or pk!=['jsCode']: other.append((k,keys,pk))
print('diff nodes',sorted(diff),'| outside jsCode:',other,'| names equal',set(nf)==set(nb),'| connections equal',f['connections']==b['connections'],'| settings equal',f.get('settings')==b.get('settings'))
