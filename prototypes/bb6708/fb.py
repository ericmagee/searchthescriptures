import json,hashlib,sys
w=json.load(open(sys.argv[1]))['workflow']
base=json.load(open('f4/wf_8059.json'));base=base.get('workflow',base)
B={n['name']:n for n in base['nodes']}
print('versionId',w['versionId'],'active',w['activeVersionId'])
for n in w['nodes']:
  b=B.get(n['name'])
  if n['name'] in ('D3 Build','C3 Build','Build Independent Verdict','Panel Build'):
    c=n['parameters']['jsCode'];f=open('bb6708/'+n['name'].replace(' ','_')+'.new.js').read()
    print(n['name'],hashlib.md5((c+'\n').encode()).hexdigest()[:8],len(c.encode())+1,'equals build file:',c==f,'equals base:',c==b['parameters']['jsCode'])
  elif json.dumps(n,sort_keys=True)!=json.dumps(b,sort_keys=True): print('OTHER NODE CHANGED',n['name'])
print('nodes',len(w['nodes']),'connections same:',json.dumps(w['connections'],sort_keys=True)==json.dumps(base['connections'],sort_keys=True))
