# dump.py <saved sql result> <prefix>: writes each column of the first row to <prefix>_<column>.txt
import json,sys,re
o=json.load(open(sys.argv[1]))['result']; s=o[o.index('['):o.rindex(']')+1]; r=json.loads(s)[0]
for k,v in r.items():
    open(f'{sys.argv[2]}_{k}.txt','w').write(v if isinstance(v,str) else json.dumps(v,ensure_ascii=False)); print(k,len(v) if isinstance(v,str) else 'json')
