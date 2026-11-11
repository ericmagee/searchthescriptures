import json,pickle
D={}
for f,k in [('ex35067_full','n'),('ex34852_full','o')]:
    d=json.load(open(f'/mnt/project-files/wall2024/{f}.json'))
    D[k]=d['data']['resultData']['runData']
T={}
for nm in ['Format Markdown','Citation Scan','Quote Report','Build Save Body','Build Synthesis']:
    T[nm]={}
    for k in 'no':
        runs=D[k].get(nm,[])
        T[nm][k]=[[it['json'] for b in r['data']['main'] for it in (b or [])] for r in runs]
        print(nm,k,'runs',len(runs),[len(x) for x in T[nm][k]])
        for ri,items in enumerate(T[nm][k]):
            for ii,j in enumerate(items[:2]):
                print('   item',ii,{kk:(len(v) if isinstance(v,(str,list,dict)) else v) for kk,v in j.items()})
pickle.dump(T,open('T.pkl','wb'))
