# pkgSLA base: the 6 sbApply2024 nodes from the live fetch-back 22e92b40 (n21). Run from wall2024/.
import json
d=json.load(open('/mnt/project-files/wall2024/fetchback_n21.json'));w=d.get('data',d)
for n in w['nodes']:
    c=n['parameters'].get('jsCode','')
    if 'function sbApply2024' in c:open('pkgSLA/base/'+n['name'].replace(' ','_')+'.js','w').write(c)
