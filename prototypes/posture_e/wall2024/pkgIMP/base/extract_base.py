# pkgIMP posture bases taken from W4's fetch-back of live 98daac9e (nodes not in the n19 or n20 writes). Run from wall2024/: python3 pkgIMP/base/extract_base.py
import json
d=json.load(open('/mnt/project-files/wall2024/fetchback_98daac9e.json'))
for n in d['nodes']:
  if n['name'] in ('Panel Build','Reserve Build','Accept Build','Accept Check','Accept Return Build','Accept Final','Accept DS Return Build','Enforcer Build','Judge Enforcer Build','Alt Judge Enforcer Build'):
    open('pkgIMP/base/'+n['name'].replace(' ','_')+'.js','w').write(n['parameters']['jsCode'])
