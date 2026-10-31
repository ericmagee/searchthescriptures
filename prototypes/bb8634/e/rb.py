import json,sys,hashlib
w=json.load(open(sys.argv[1]))['workflow']; B={x['name']:x for x in json.load(open(sys.argv[2]))['workflow']['nodes']}
print('version',w['versionId'][:8],'active',w['activeVersionId'][:8],'nodes',len(w['nodes']))
for n in ['Panel Build','Build Independent Verdict','D3 Build','Extract Independent Verdict']:
  f=n.replace(' ','_')+'.js'; c=[x for x in w['nodes'] if x['name']==n][0]['parameters']['jsCode']; h=hashlib.md5(c.encode()).hexdigest()
  print(n.ljust(28),h[:8],'NEW' if h==hashlib.md5(open('new/'+f,'rb').read()).hexdigest() else ('BASE' if h==hashlib.md5(open('base/'+f,'rb').read()).hexdigest() else 'DIFF'))
W={x['name']:x for x in w['nodes']}
print('diff nodes',[k for k in W if W[k]!=B.get(k)],'names equal',set(W)==set(B))
