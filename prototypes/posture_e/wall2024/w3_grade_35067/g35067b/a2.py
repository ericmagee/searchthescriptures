import json,re,pickle
pats={'undefined_sub':r'undefined','NaN_sub':r'NaN','is not defined':r'is not defined','ReferenceError':r'ReferenceError','TypeError':r'TypeError','is not a function':r'is not a function','is not iterable':r'is not iterable','Cannot read properties':r'Cannot read propert','undefined':r'\bundefined\b','[object Object]':r'\[object Object\]','NaN':r'\bNaN\b'}
cp={k:re.compile(v) for k,v in pats.items()}
res={}
def walk(o,path,node,run,hits):
    if isinstance(o,str):
        for k,c in cp.items():
            for m in c.finditer(o):
                hits.append((k,node,run,path,o[max(0,m.start()-150):m.end()+150],m.start(),len(o)))
        # nested JSON strings
        if len(o)>2 and o[0] in '{[' and o[-1] in '}]':
            try:
                j=json.loads(o)
                walk(j,path+'<json>',node,run,hits)
            except Exception: pass
    elif isinstance(o,dict):
        for k,v in o.items():
            walk(v,path+'.'+k,node,run,hits)
    elif isinstance(o,list):
        for i,v in enumerate(o):
            walk(v,path+f'[{i}]',node,run,hits)
for f,k in [('ex35067_full','n'),('ex34852_full','o')]:
    d=json.load(open(f'/mnt/project-files/wall2024/{f}.json'))
    hits=[]
    cnt=0
    for node,runs in d['data']['resultData']['runData'].items():
        for i,r in enumerate(runs):
            walk(r,'',node,i,hits)
    for kk,v in d['data'].items():
        if kk!='resultData': walk(v,'data.'+kk,'<'+kk+'>',0,hits)
    for kk,v in d.items():
        if kk!='data': walk(v,kk,'<top>',0,hits)
    # also executionData (workflowData etc.)? just runData + others
    res[k]=hits
    print(k,len(hits))
pickle.dump(res,open('hits.pkl','wb'))
