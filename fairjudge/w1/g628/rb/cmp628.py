import json,sys,hashlib
def load(p):
    d=json.load(open(p)); d=d.get('workflow',d); return d
def nodes(d): return {n['name']:n for n in d['nodes']}
def h(x): return hashlib.sha256(json.dumps(x,sort_keys=True).encode()).hexdigest()[:12]
T='/mnt/project-files/ask628/w4/b1/'
for lab,live,tgt,base in [('eng','live_eng628.json',T+'target_engine_628.json',T+'base_eng.json'),('child','live_child628.json',T+'target_child_628.json',T+'base_child.json')]:
    L,G,B=load(live),load(tgt),load(base)
    ln,gn,bn=nodes(L),nodes(G),nodes(B)
    print(lab,'nodes live/target/base',len(ln),len(gn),len(bn))
    print(' names equal live=target',set(ln)==set(gn))
    dif=[k for k in ln if k in gn and h(ln[k]['parameters'])!=h(gn[k]['parameters'])]
    print(' param diffs live vs target',dif)
    ch=[k for k in ln if k not in bn or h(ln[k]['parameters'])!=h(bn.get(k,{}).get('parameters'))]
    print(' changed vs base',ch, 'removed',[k for k in bn if k not in ln])
    print(' connections equal target',h(L['connections'])==h(G['connections']),'base',h(L['connections'])==h(B['connections']))
    # other node fields
    od=[k for k in ln if k in gn and h({x:y for x,y in ln[k].items() if x not in('parameters','position','id')})!=h({x:y for x,y in gn[k].items() if x not in('parameters','position','id')})]
    print(' other-field diffs vs target',od)
