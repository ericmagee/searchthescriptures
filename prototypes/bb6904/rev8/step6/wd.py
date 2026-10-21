# whole-draft check: every node and connection of the draft against 95f04001, except the jsCode of the 27 composed nodes
import json,sys,glob,os,hashlib
d=json.load(open(sys.argv[1]));d=d.get('workflow',d)
b=json.load(open(sys.argv[2]))
comp={os.path.basename(f)[:-3].replace('_',' '):open(f).read() for f in glob.glob('composed/*.js')}
base={os.path.basename(f)[:-3].replace('_',' '):open(f).read() for f in glob.glob('../rev8v/live/*.js')}
changed={n for n in comp if comp[n]!=base.get(n)}
D={n['name']:n for n in d['nodes']};B={n['name']:n for n in b['nodes']}
print('node sets equal',set(D)==set(B),len(D),len(B))
print('connections equal',d['connections']==b['connections'])
diff=[]
for n in B:
    x=json.loads(json.dumps(D[n]));y=json.loads(json.dumps(B[n]))
    if n in changed:
        x['parameters'].pop('jsCode',None);y['parameters'].pop('jsCode',None)
    if x!=y: diff.append(n)
print('nodes differing outside allowed jsCode:',diff)
print('changed jsCode count',len(changed))
