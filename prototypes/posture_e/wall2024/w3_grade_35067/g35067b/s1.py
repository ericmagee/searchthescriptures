import json,sys
for f in ['ex35067_full','ex34852_full']:
    d=json.load(open(f'/mnt/project-files/wall2024/{f}.json'))
    print(f,list(d.keys())[:20])
    r=d.get('data',d)
    print(type(r), list(r.keys())[:20] if isinstance(r,dict) else '')
    rd=None
    def find(o,dep=0):
        if isinstance(o,dict):
            if 'runData' in o: return o['runData']
            for k,v in o.items():
                x=find(v,dep+1) if dep<5 else None
                if x: return x
    rd=find(d)
    print(len(rd))
    k=list(rd)[0]; e=rd[k][0]
    print(k,list(e.keys()), e.get('executionStatus'), e.get('startTime'),e.get('executionTime'))
    print({k:d.get(k) for k in d if not isinstance(d[k],(dict,list))})
