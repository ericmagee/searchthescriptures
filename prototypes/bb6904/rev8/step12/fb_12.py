# Worker_E step 12 fetch-back: compares a fetched draft version (saved by tool) with new/ and with the live base 5fd3b03c.
import json,sys,hashlib,os
draft=json.load(open(sys.argv[1]));live=json.load(open(sys.argv[2]))
dn={n['name']:n for n in draft['nodes']};ln={n['name']:n for n in live['nodes']}
md=lambda s:hashlib.md5(s.encode('utf-8')).hexdigest()
print('draft',draft['versionId'],draft.get('createdAt'),'nodes',len(dn),'| live',live['versionId'],'nodes',len(ln))
written=set(sys.argv[3].split(',')) if len(sys.argv)>3 and sys.argv[3] else set()
for f in sorted(os.listdir('new')):
    name=f[:-3].replace('_',' ');d=dn[name]['parameters'];want=open('new/'+f,encoding='utf-8').read();base=open('base/'+f,encoding='utf-8').read()
    keys=sorted(d.keys());st='NEW' if d.get('jsCode')==want else ('BASE' if d.get('jsCode')==base else 'OTHER')
    print('%-28s %s md5 %s keys %s'%(name,st,md(d.get('jsCode','')),keys))
other=[k for k in ln if k not in {f[:-3].replace('_',' ') for f in os.listdir('new')}]
diff=[k for k in other if json.dumps(ln[k],sort_keys=True)!=json.dumps(dn.get(k),sort_keys=True)]
print('other nodes',len(other),'| differing from live:',diff or 'none','| connections equal:',json.dumps(draft['connections'],sort_keys=True)==json.dumps(live['connections'],sort_keys=True),'| node sets equal:',set(dn)==set(ln))
