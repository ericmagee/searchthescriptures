import json,re,collections,pickle
def walk(o,path,node,out,dep=0):
    if isinstance(o,dict):
        for k,v in o.items():
            if re.search(r'(^|_)(error|errors|err)$|error_|_error',k,re.I) and v not in (None,'',False,[],{}):
                out.append((node,re.sub(r'\[\d+\]','[]',path+'.'+k),json.dumps(v)[:240]))
            walk(v,path+'.'+k,node,out,dep+1)
    elif isinstance(o,list):
        for i,v in enumerate(o): walk(v,path+'[%d]'%i,node,out,dep+1)
    elif isinstance(o,str) and len(o)>2 and o[0] in '{[' and o[-1] in '}]' and dep<12:
        try: walk(json.loads(o),path+'<json>',node,out,dep+1)
        except Exception: pass
R={}
for f,k in [('ex35067_full','n'),('ex34852_full','o')]:
    d=json.load(open(f'/mnt/project-files/wall2024/{f}.json'))
    out=[]
    for n,runs in d['data']['resultData']['runData'].items():
        for i,r in enumerate(runs): walk(r.get('data'),'',n,out)
    R[k]=out
    print(k,len(out))
pickle.dump(R,open('errkeys.pkl','wb'))
for k in 'no':
    c=collections.Counter((n,p,v) for n,p,v in R[k])
    print('====',k,len(c))
    other={(n,p,v) for n,p,v in R['o' if k=='n' else 'n']}
    other_np={(n,p) for n,p,v in R['o' if k=='n' else 'n']}
    for (n,p,v),cnt in c.most_common(80):
        tag='same string at same place in other run' if (n,p,v) in other else ('same node+path other run, different value' if (n,p) in other_np else 'ONLY THIS RUN')
        print(cnt,n,p,v[:170],'|',tag)
