# A5 PUBLISH VERIFY (Worker_A3). Usage: python3 -I a5_publish_verify.py <af3c8f7c details json> <new details json> <nodes.txt>
# Pass = the new version is active; the 7 changed nodes read their target md5; every other node (parameters, type, position,
# credentials) and the connections are identical to af3c8f7c.
import json,sys,hashlib
md5=lambda s:hashlib.md5((s if s.endswith('\n') else s+'\n').encode()).hexdigest()[:8]
old=json.load(open(sys.argv[1]))['workflow']; new=json.load(open(sys.argv[2]))['workflow']
tgt={}
for l in open(sys.argv[3]):
    if l.startswith('#') or '|' not in l: continue
    f=[x.strip() for x in l.split('|')]; tgt[f[0]]=(f[1],f[2])
ok=True
def bad(m):
    global ok; ok=False; print('FAIL',m)
if new['versionId']!=new.get('activeVersionId'): bad('new version not active')
if old['versionId'][:8]!='af3c8f7c': bad('base is not af3c8f7c')
O={n['name']:n for n in old['nodes']}; N={n['name']:n for n in new['nodes']}
if set(O)!=set(N): bad('node names differ: %s'%(set(O)^set(N)))
for k in sorted(set(O)&set(N)):
    if k in tgt:
        c=lambda n:n['parameters'].get('jsCode') or ''
        if md5(c(O[k]))!=tgt[k][0]: bad(k+' base md5 '+md5(c(O[k])))
        if md5(c(N[k]))!=tgt[k][1]: bad(k+' new md5 '+md5(c(N[k])))
        a=dict(O[k]); b=dict(N[k]); a['parameters']={**a['parameters'],'jsCode':''}; b['parameters']={**b['parameters'],'jsCode':''}
        if json.dumps(a,sort_keys=True)!=json.dumps(b,sort_keys=True): bad(k+' changed outside its code')
    elif json.dumps(O[k],sort_keys=True)!=json.dumps(N[k],sort_keys=True): bad(k+' changed and is not in nodes.txt')
if json.dumps(old.get('connections'),sort_keys=True)!=json.dumps(new.get('connections'),sort_keys=True): bad('connections differ')
if json.dumps(old.get('settings'),sort_keys=True)!=json.dumps(new.get('settings'),sort_keys=True): bad('settings differ')
print('PASS' if ok else 'FAIL', new['versionId'], len(N),'nodes')
