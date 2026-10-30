# usage: python3 rb2.py <get_workflow_details file>   (checks the 14 S2 nodes vs s2verify new/ and base/)
import json,sys,hashlib,os
D='/home/user/searchthescriptures/prototypes/bb8508/e/s2verify'
w=json.load(open(sys.argv[1]))['workflow']
print('version',w['versionId'][:8],'active',w['activeVersionId'][:8])
n=0
for f in sorted(os.listdir(D+'/new')):
  name=f[:-3].replace('_',' ')
  c=[x for x in w['nodes'] if x['name']==name][0]['parameters']['jsCode']
  h=hashlib.md5(c.encode()).hexdigest()
  nw=hashlib.md5(open(D+'/new/'+f,'rb').read()).hexdigest(); bs=hashlib.md5(open(D+'/base/'+f,'rb').read()).hexdigest()
  st='NEW' if h==nw else ('BASE' if h==bs else 'DIFF'); n+= st=='NEW'
  print(name.ljust(26),h[:8],st)
print('NEW count',n)
