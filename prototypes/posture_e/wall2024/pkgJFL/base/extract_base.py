# pkgJFL base: Init Seats from the export of live 57c7fffd (n18 to n21 do not touch Init Seats). Run from wall2024/.
import json
d=json.load(open('/mnt/project-files/wall2024/prewrite_ogs_57c7fffd.json'));w=d.get('data',d);nodes=w['nodes'] if 'nodes' in w else w['workflow']['nodes']
n=[x for x in nodes if x['name']=='Init Seats'][0];open('pkgJFL/base/Init_Seats.js','w').write(n['parameters']['jsCode'])
for x in nodes:
    if x['name'] in('Accept Models','Fetch Models'):print(x['name'],x['parameters']['url'])
