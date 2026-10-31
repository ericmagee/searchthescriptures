import json,hashlib
md=lambda s: hashlib.md5(s.encode()).hexdigest()
A=json.load(open('/home/user/searchthescriptures/prototypes/bb8634/a3/p3fetch/v8a7f48d3_active.json'))['workflow']
N={n['name']:n['parameters']['jsCode'] for n in A['nodes'] if 'jsCode' in n.get('parameters',{})}
print('my copy versionId', A['versionId'], 'updatedAt', A['updatedAt'])
for name,f in (('Panel Build','e/live/Panel_Build.js'),('Build Independent Verdict','e/live/Build_Independent_Verdict.js')):
    e=open(f).read(); live=N[name]
    print(name, 'mine', md(live), 'E', md(e), 'EQUAL' if e==live else ('EQUAL after one trailing newline' if e.rstrip('\n')==live.rstrip('\n') else 'DIFFER'))
R=json.load(open('e/prompt/rules.json'))
print('rules.json keys', list(R) if isinstance(R,dict) else type(R))
items = R.items() if isinstance(R,dict) else []
for k,v in items:
    t = v if isinstance(v,str) else v.get('text', '')
    print(k, 'md5', md(t)[:8], 'len', len(t), 'in Panel Build', N['Panel Build'].count(t), 'in BIV', N['Build Independent Verdict'].count(t))
