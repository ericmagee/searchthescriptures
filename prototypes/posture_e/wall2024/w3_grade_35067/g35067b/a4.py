import json,pickle
D={}
for f,k in [('ex35067_full','n'),('ex34852_full','o')]:
    d=json.load(open(f'/mnt/project-files/wall2024/{f}.json'))
    D[k]=d['data']['resultData']['runData']
def paths(o,p='',dep=0,out=None):
    out=out if out is not None else {}
    if isinstance(o,dict):
        if not o and p: out[p]='{}empty'
        for k,v in o.items(): paths(v,p+'.'+k,dep+1,out)
    elif isinstance(o,list):
        if not o: out[p]='[]empty'
        else:
            out[p]='list'+str(len(o))
            if dep<4:
                for v in o[:1]: paths(v,p+'[]',dep+1,out)
    else:
        if o is None: out[p]='null'
        elif o=='' : out[p]='emptystr'
        else: out[p]=type(o).__name__
    return out
def short(o,n=120):
    if isinstance(o,str): return o if len(o)<=n else o[:n]+f'...({len(o)})'
    if isinstance(o,dict): return {k:short(v,n) for k,v in list(o.items())[:40]}
    if isinstance(o,list): return [short(v,n) for v in o[:3]]+(['...%d'%len(o)] if len(o)>3 else [])
    return o
R={}
for nm in ['Init with Guards','Accept Build','Accept Final','Early Alternate Build']:
    R[nm]={}
    for k in 'no':
        runs=D[k].get(nm,[])
        R[nm][k]=[]
        for r in runs:
            items=[]
            for b in r['data']['main']:
                for it in (b or []):
                    items.append(it['json'])
            R[nm][k].append(items)
pickle.dump(R,open('special.pkl','wb'))
for nm in R:
    print('=====',nm)
    for k in 'no':
        its=[x for run in R[nm][k] for x in run]
        print(k,'items',len(its))
        keys=set()
        for x in its: keys|=set(x.keys()) if isinstance(x,dict) else set()
        print('  top keys',sorted(keys))
        emp={}
        for ii,x in enumerate(its):
            for p,t in paths(x).items():
                if t in('null','emptystr','[]empty','{}empty'): emp.setdefault(p,[]).append((ii,t))
        print('  empties',{p:v[:6] for p,v in emp.items()})
