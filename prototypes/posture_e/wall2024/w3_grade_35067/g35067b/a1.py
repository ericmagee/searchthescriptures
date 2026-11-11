import json,pickle
out={}
for f,k in [('ex35067_full','n'),('ex34852_full','o')]:
    d=json.load(open(f'/mnt/project-files/wall2024/{f}.json'))
    rr=d['data']['resultData']
    rd=rr['runData']
    print(k,'resultData keys',list(rr.keys()),'err',json.dumps(rr.get('error'))[:500],'lastNode',rr.get('lastNodeExecuted'))
    nodes={}
    for n,runs in rd.items():
        nodes[n]=[]
        for r in runs:
            m=r.get('data',{}).get('main') if r.get('data') else None
            items=[]
            if m:
                for b in m:
                    items.append(len(b) if b else 0)
            first=None
            if m and m[0]:
                j=m[0][0].get('json'); first=sorted(j.keys()) if isinstance(j,dict) else ['<'+type(j).__name__+'>']
            nodes[n].append(dict(status=r.get('executionStatus'),err=r.get('error'),st=r.get('startTime'),t=r.get('executionTime'),items=items,first=first))
    out[k]=nodes
    print(k,len(nodes),sum(len(v) for v in nodes.values()))
    print('errors',[(n,i) for n,v in nodes.items() for i,r in enumerate(v) if r['err'] or r['status']!='success'])
pickle.dump(out,open('nodes.pkl','wb'))
