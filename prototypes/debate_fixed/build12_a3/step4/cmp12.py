# Step 4 compare (Worker_A3): a fetched version against new12 (code nodes) and against the 449a4cf2 fetch (every other node and the connections).
import json,hashlib,sys,os
md5=lambda s:hashlib.md5(s.encode()).hexdigest()
B=json.load(open('step4/v_449a4cf2.json'));V=json.load(open(sys.argv[1]))
bn={n['name']:n for n in B['nodes']};vn={n['name']:n for n in V['nodes']}
ch=set(f[:-3].replace('_',' ') for f in open('CHANGED12.txt').read().split())
new={f[:-3].replace('_',' '):md5(open('new12/'+f,encoding='utf-8').read()) for f in os.listdir('new12')}
w=sum(1 for k in ch if md5(vn[k]['parameters'].get('jsCode',''))==new[k]);bs=sum(1 for k in ch if md5(vn[k]['parameters'].get('jsCode',''))==md5(bn[k]['parameters'].get('jsCode','')))
nei=[k for k in ch if md5(vn[k]['parameters'].get('jsCode',''))not in(new[k],md5(bn[k]['parameters'].get('jsCode','')))]
oth=[k for k in bn if k not in ch and json.dumps(bn[k],sort_keys=True)!=json.dumps(vn.get(k),sort_keys=True)]
code_eq=sum(1 for k in new if k in vn and md5(vn[k]['parameters'].get('jsCode',''))==new[k])
print(V.get('versionId','?')[:8],'nodes',len(vn),'written',w,'base',bs,'neither',nei,'others differ',len(oth),oth[:5],'conn equal',json.dumps(B['connections'],sort_keys=True)==json.dumps(V['connections'],sort_keys=True),'all 63 code = new12:',code_eq)
