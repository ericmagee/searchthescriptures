import json,sys,hashlib
sys.path.insert(0,'/mnt/project-files/ask516/w4/b');from lib import load
for wf in ('engine','child'):
  A=json.load(open(f'../../w4/live/live_{wf}.json'));B=json.load(open(f'target_{wf}_533.json'))
  na={n['name']:n for n in A['nodes']};nb={n['name']:n for n in B['nodes']}
  diff=[k for k in na if json.dumps(na[k],sort_keys=True)!=json.dumps(nb.get(k),sort_keys=True)]
  print(wf,'nodes',len(na),len(nb),'differ:',diff,'| connections equal',A['connections']==B['connections'],'| settings equal',A.get('settings')==B.get('settings'))
  _,_,La,Ma,_=load(f'../../w4/live/live_{wf}.json');_,_,Lb,Mb,_=load(f'target_{wf}_533.json')
  print('  lines',len(La),len(Lb),'changed',[i for i in range(len(La)) if La[i]!=Lb[i]],'| MAP keys equal',list(Ma)==list(Mb),'| MAP p equal',all(Ma[k]['p']==Mb[k]['p'] for k in Ma),'| MAP n changed',sum(Ma[k]['n']!=Mb[k]['n'] for k in Ma))
