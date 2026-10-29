# fetch-back check for the 9-node write (BB-8148): each node's live jsCode vs git cd1f401 new/ and dfa2da34
import json,sys,hashlib,glob,os
R='/home/user/searchthescriptures/prototypes/debate_fixed/run28489_e/run28689/'
def nodes_of(x):
    if isinstance(x,dict):
        if isinstance(x.get('nodes'),list): return x
        for v in x.values():
            r=nodes_of(v)
            if r: return r
d=nodes_of(json.load(open(sys.argv[1])));b=nodes_of(json.load(open(R+'p14e/p9/v_dfa2da34.json')))
L={n['name']:n for n in d['nodes']};B={n['name']:n for n in b['nodes']}
w=json.load(open(sys.argv[1]))['workflow'];print('version',w['versionId'][:8],'active',w['activeVersionId'][:8],'updated',w['updatedAt'])
m=lambda s:hashlib.md5(s.encode()).hexdigest()[:8]
tw=set()
for f in sorted(glob.glob(R+'p16e/a3/new/*.js')):
    n=os.path.basename(f)[:-3].replace('_',' ');tw.add(n);live=L[n]['parameters'].get('jsCode','');t=open(f).read()
    print(('NEW ' if live==t else 'BASE' if live==B[n]['parameters'].get('jsCode') else 'OTHR'),n,'live',m(live),'file',m(t))
print('others differ:',[k for k in L if k not in tw and json.dumps(L[k]['parameters'],sort_keys=True)!=json.dumps(B[k]['parameters'],sort_keys=True)])
print('connections equal dfa2da34:',json.dumps(d.get('connections'),sort_keys=True)==json.dumps(b.get('connections'),sort_keys=True))
