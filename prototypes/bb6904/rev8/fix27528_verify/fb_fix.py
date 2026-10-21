# fetch-back of the option 1 fix draft against the published 804b870a fetch and the verified patched files
import json,sys,glob,os,hashlib
d=json.load(open(sys.argv[1]))['workflow'];b=json.load(open(sys.argv[2]))['workflow']
P={os.path.basename(f)[:-3].replace('_',' '):open(f).read() for f in glob.glob(sys.argv[3]+'/*.js')}
print('draft versionId',d['versionId'],'active',d['activeVersionId'],'base versionId',b['versionId'])
D={n['name']:n for n in d['nodes']};B={n['name']:n for n in b['nodes']}
print('node sets equal',set(D)==set(B),len(D));print('connections equal',d['connections']==b['connections'])
print('settings equal',d.get('settings')==b.get('settings'))
ok=0;bad=[];other=[]
for n in B:
    x=json.loads(json.dumps(D[n]));y=json.loads(json.dumps(B[n]))
    if n in P:
        if x['parameters'].get('jsCode')==P[n]: ok+=1
        else: bad.append(n)
        x['parameters'].pop('jsCode',None);y['parameters'].pop('jsCode',None)
    if x!=y: other.append(n)
print('patched nodes equal to verified files',ok,'of',len(P),'bad',bad)
print('nodes differing otherwise',other)
