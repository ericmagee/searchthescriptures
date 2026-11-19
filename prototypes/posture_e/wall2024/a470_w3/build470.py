import json,sys,hashlib
w=json.load(open(sys.argv[1]));W=w.get('data',w);P=json.load(open(sys.argv[3]))
n=[x for x in W['nodes'] if x['name']=='Alternate Merge'][0];c=n['parameters']['jsCode']
for p in P:
  k=c.count(p['old']);assert k==1,(p['old'][:60],k);c=c.replace(p['old'],p['new'])
n['parameters']['jsCode']=c
s=json.dumps(w,ensure_ascii=False);open(sys.argv[2],'w').write(s);print('target md5',hashlib.md5(s.encode()).hexdigest())
