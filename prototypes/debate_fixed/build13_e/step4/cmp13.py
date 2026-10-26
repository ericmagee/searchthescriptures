# Step 4 compare (Worker_E, rev 9): a fetched version against new13 and base13 (code nodes) and against the 75dcb465 fetch (every other node,
# and the connections). Usage: python3 step4/cmp13.py <version json>
import json,hashlib,sys,os
md5=lambda s:hashlib.md5(s.encode()).hexdigest()
B=json.load(open('step4/v_75dcb465.json'));V=json.load(open(sys.argv[1]))
bn={n['name']:n for n in B['nodes']};vn={n['name']:n for n in V['nodes']}
fn=lambda f:f[:-3].replace('_',' ')
ch=set(fn(f) for f in open('CHANGED13.txt').read().split())
new={fn(f):md5(open('new13/'+f,encoding='utf-8').read()) for f in os.listdir('new13')}
base={fn(f):md5(open('base13/'+f,encoding='utf-8').read()) for f in os.listdir('base13')}
code=lambda n:vn[n]['parameters'].get('jsCode','')
w=[k for k in ch if md5(code(k))==new[k]];bs=[k for k in ch if md5(code(k))==base[k]]
nei=[k for k in ch if md5(code(k)) not in (new[k],base[k])]
uncode=[k for k in base if k not in ch and md5(code(k))!=base[k]]
strip=lambda n:{k:v for k,v in n.items() if k!='parameters'} | {'p':{k:v for k,v in n['parameters'].items() if k!='jsCode'}}
oth=[k for k in bn if json.dumps(strip(bn[k]),sort_keys=True)!=json.dumps(strip(vn[k]),sort_keys=True) if k in vn]
print(V.get('versionId','?')[:8],'| nodes',len(vn),'| changed set',len(ch),'written',len(w),'at base',len(bs),'neither',sorted(nei),
 '| unchanged code nodes off base',uncode,'| non-code fields differ',oth,'| node names equal',set(bn)==set(vn),
 '| connections equal',json.dumps(B['connections'],sort_keys=True)==json.dumps(V['connections'],sort_keys=True))
