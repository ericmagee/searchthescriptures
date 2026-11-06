# Copies the base nodes of pkgOAN from W4's fetch-back of live 98daac9e. Run from wall2024/: python3 pkgOAN/base/extract_base.py
import json
d=json.load(open('/mnt/project-files/wall2024/fetchback_98daac9e.json'))
for n in d['nodes']:
  if n['name'] in ('C3 Build','C3 Extract','Build Synthesis','Failure Salvage','D4 Build','D4 Extract','C4 Build','C4 Extract','C4G Extract','D4 Words Plan'):
    open('pkgOAN/base/'+n['name'].replace(' ','_')+'.js','w').write(n['parameters']['jsCode'])
