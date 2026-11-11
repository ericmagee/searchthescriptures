import json,pickle
S={}
for f,k in [('ex35067_full','n'),('ex34852_full','o')]:
    d=json.load(open(f'/mnt/project-files/wall2024/{f}.json'))
    rd=d['data']['resultData']['runData']
    S[k]={'meta':{x:d[x] for x in ['id','status','startedAt','stoppedAt','workflowVersionId']},'nodes':{}}
    for n,runs in rd.items():
        L=[]
        for r in runs:
            m=(r.get('data') or {}).get('main') or []
            fk=None;br=None
            for bi,b in enumerate(m):
                if b:
                    j=b[0].get('json')
                    fk=sorted(j.keys()) if isinstance(j,dict) else ['<%s>'%type(j).__name__]
                    br=bi;break
            L.append(dict(status=r.get('executionStatus'),err=r.get('error'),t=r.get('executionTime'),st=r.get('startTime'),items=[len(b) if b else 0 for b in m],fk=fk,br=br,
              source=[s.get('previousNode') for s in (r.get('source') or [])][:1]))
        S[k]['nodes'][n]=L
pickle.dump(S,open('S.pkl','wb'))
for k in 'no':
    N=S[k]['nodes']
    tot=sum(r['t'] or 0 for v in N.values() for r in v)
    print(k,S[k]['meta'],len(N),sum(len(v) for v in N.values()),'sum node ms',tot)
