import json,sys,hashlib,os
S='/tmp/claude-0/-home-user-searchthescriptures/58ba9d31-f07a-5e6e-a230-4fe44a036213/scratchpad'
d=json.load(open(sys.argv[1]))['workflow']
N={n['name']:n for n in d['nodes']}
s3=S+'/v8462/prototypes/bb8403/a3/s3'; s1=S+'/s3'
want={}
for f in os.listdir(s3+'/new'): want[f[:-3].replace('_',' ')]=(open(s3+'/new/'+f).read(), open(s3+'/base/'+f).read())
for nm,f in [('Init Seats','Init_Seats'),('Resolve Seats','Resolve_Seats'),('Format Markdown','Format_Markdown')]: want[nm]=(open(s1+'/new/'+f+'.js').read(), open(s1+'/base/'+f+'.js').read())
print('versionId',d['versionId'],'active',d['activeVersionId'])
done=0
for nm,(nw,b) in sorted(want.items()):
  c=N[nm]['parameters'].get('jsCode','')
  st='NEW' if c==nw else ('BASE' if c==b else 'DIFF')
  done+= st=='NEW'
  print(f'{nm:28s} {hashlib.md5(c.encode()).hexdigest()[:8]} {st}')
print('NEW',done,'of',len(want))
