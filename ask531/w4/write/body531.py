# ASK 531: put bodies from fresh fetches. Runs patch531.py on the fetched engine and child (anchors asserted inside), then asserts that only the named nodes
# differ from the fetch, connections and settings are unchanged, and both libraries compile. Usage: body531.py <pre_engine.json> <pre_child.json> <put_engine.json> <put_child.json>
import json,sys,subprocess,hashlib
pe,pc,oe,oc=sys.argv[1:5]
P='/mnt/project-files/ask531/w4/build/patch531.py'
print('patch531.py md5',hashlib.md5(open(P,'rb').read()).hexdigest()[:8])
subprocess.run(['python3',P,pe,pc,oe+'.full',oc+'.full'],check=True)
for pre,full,out,want in [(pe,oe+'.full',oe,['Send Back Build','Send Back Record','Alt Send Back Build','Alt Send Back Record','Shared Library','Assume Check Record']),(pc,oc+'.full',oc,['R2 Alt Send Back Build','R2 Alt Send Back Record','Shared Library'])]:
    a=json.load(open(pre));b=json.load(open(full));NA={n['name']:n for n in a['nodes']}
    diff=[n['name'] for n in b['nodes'] if json.dumps(n,sort_keys=True)!=json.dumps(NA[n['name']],sort_keys=True)]
    assert sorted(diff)==sorted(want),diff
    assert a['connections']==b['connections'] and a.get('settings')==b.get('settings')
    json.dump({k:b[k] for k in ['name','nodes','connections','settings']},open(out,'w'),ensure_ascii=False);print(out,'nodes changed',diff)
subprocess.run(['node','/mnt/project-files/ask531/w4/build/compile531.js',oe+'.full',oc+'.full'],check=True)
