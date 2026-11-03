#!/usr/bin/env python3
"""Posture v5: one guarded write of ORACLE_DEBATE_V1. Default is a dry run (one GET, nothing written); --write writes.
Guards: live versionId equals the base read; every changed node's live code equals base/; node count and connections equal the base read;
added names free. After the write: read back, every code node compared with new/ and add/; active version reported."""
import json, os, sys, uuid, hashlib, copy, urllib.request

ROOT = os.path.dirname(os.path.abspath(__file__))
URL = 'https://truthapp.app.n8n.cloud/api/v1/workflows/moMxiV4Irg1uRBZN'
KEY = os.environ['N8N_API_KEY']
WRITE = '--write' in sys.argv
def req(method, body=None, url=URL):
    r = urllib.request.Request(url, method=method, data=None if body is None else json.dumps(body).encode(),
                               headers={'X-N8N-API-KEY': KEY, 'Content-Type': 'application/json', 'Accept': 'application/json'})
    return json.load(urllib.request.urlopen(r, timeout=180))
md5 = lambda s: hashlib.md5(s.encode()).hexdigest()

BASE = json.load(open(os.path.join(ROOT, 'live.json')))
live = req('GET')
bad = []
if live.get('versionId') != BASE.get('versionId'): bad.append('versionId moved: ' + str(live.get('versionId')))
if len(live['nodes']) != len(BASE['nodes']): bad.append('node count moved')
if json.dumps(live['connections'], sort_keys=True) != json.dumps(BASE['connections'], sort_keys=True): bad.append('connections moved')
LN = {n['name']: n for n in live['nodes']}
NEWDIR, ADDDIR = os.path.join(ROOT, 'new'), os.path.join(ROOT, 'add')
changed = {f[:-3]: open(os.path.join(NEWDIR, f)).read() for f in os.listdir(NEWDIR)}
added_code = {f[:-3]: open(os.path.join(ADDDIR, f)).read() for f in os.listdir(ADDDIR)}
for nm in changed:
    if nm not in LN: bad.append('missing live node ' + nm); continue
    if LN[nm]['parameters'].get('jsCode') != open(os.path.join(ROOT, 'base', nm + '.js')).read(): bad.append('live code differs from base: ' + nm)
if bad: print('REFUSED:', bad); sys.exit(1)

new = copy.deepcopy(live)
N = {n['name']: n for n in new['nodes']}
for nm, c in changed.items(): N[nm]['parameters']['jsCode'] = c
def nid(name): return str(uuid.uuid5(uuid.NAMESPACE_URL, 'posture-v5/' + name))
def ifnode(name, pos, expr):
    n = copy.deepcopy(N['Accept Return?']); n['id'] = nid(name); n['name'] = name; n['position'] = pos
    n['parameters']['conditions']['conditions'][0]['id'] = 'posture-v5-' + name.lower().replace(' ', '-').replace('?', '')
    n['parameters']['conditions']['conditions'][0]['leftValue'] = expr; return n
def codenode(name, pos, code):
    n = copy.deepcopy(N['Accept Build']); n['id'] = nid(name); n['name'] = name; n['position'] = pos; n['parameters'] = {'jsCode': code}; return n
def dsnode(name, pos):
    n = copy.deepcopy(N['Independent Verdict Call']); n['id'] = nid(name); n['name'] = name; n['position'] = pos
    for k in ('retryOnFail', 'maxTries', 'waitBetweenTries'): n.pop(k, None)
    n['onError'] = 'continueRegularOutput'; n['parameters']['jsonBody'] = '={{ $json.acc.body }}'; return n
mods = copy.deepcopy(N['Fetch Models']); mods['id'] = nid('Accept Models'); mods['name'] = 'Accept Models'; mods['position'] = [0, -640]
for k in ('onError',): mods.pop(k, None)
ADD = [mods,
       codenode('Accept DS Build', [9352, -840], added_code['Accept DS Build']),
       ifnode('Accept DS?', [9552, -840], '={{ $json.skip !== true }}'),
       dsnode('Accept Call deepseek', [9752, -840]),
       ifnode('Accept OR Return?', [9952, -840], '={{ $json.skip !== true }}'),
       codenode('Accept DS Return Build', [10152, -840], added_code['Accept DS Return Build']),
       ifnode('Accept DS Return?', [10352, -840], '={{ $json.skip !== true }}'),
       dsnode('Accept Return Call deepseek', [10552, -840])]
for a in ADD:
    if a['name'] in N: print('REFUSED: name taken', a['name']); sys.exit(1)
REMOVE = ['Accept Gate?', 'Accept Probe?']
new['nodes'] = [n for n in new['nodes'] if n['name'] not in REMOVE] + ADD
C = new['connections']
for r in REMOVE: C.pop(r, None)
def drop(src, tgt, idx=None):
    outs = C.get(src, {}).get('main', [])
    hit = 0
    for i, o in enumerate(outs):
        if idx is not None and i != idx: continue
        before = len(o or []); outs[i] = [t for t in (o or []) if t['node'] != tgt]; hit += before - len(outs[i])
    if hit != 1: print('REFUSED: link', src, '->', tgt, 'found', hit); sys.exit(1)
def link(src, tgt, idx=0):
    C.setdefault(src, {}).setdefault('main', [])
    while len(C[src]['main']) <= idx: C[src]['main'].append([])
    C[src]['main'][idx].append({'node': tgt, 'type': 'main', 'index': 0})
drop('Debate Start', 'Init Seats'); drop('Dry Run Config', 'Init Seats')
drop('Regrade After Quotes?', 'Accept Gate?', 0)
drop('Accept Call openrouter', 'Accept Check'); drop('Accept Return Build', 'Accept Return Call openrouter'); drop('Accept Return Call openrouter', 'Accept Final')
drop('Accept Final', 'Accept Probe?')
for s, t, i in [('Debate Start', 'Accept Models', 0), ('Dry Run Config', 'Accept Models', 0), ('Accept Models', 'Accept Build', 0),
                ('Accept Call openrouter', 'Accept DS Build', 0), ('Accept DS Build', 'Accept DS?', 0), ('Accept DS?', 'Accept Call deepseek', 0),
                ('Accept DS?', 'Accept Check', 1), ('Accept Call deepseek', 'Accept Check', 0),
                ('Accept Return Build', 'Accept OR Return?', 0), ('Accept OR Return?', 'Accept Return Call openrouter', 0), ('Accept OR Return?', 'Accept DS Return Build', 1),
                ('Accept Return Call openrouter', 'Accept DS Return Build', 0), ('Accept DS Return Build', 'Accept DS Return?', 0),
                ('Accept DS Return?', 'Accept Return Call deepseek', 0), ('Accept DS Return?', 'Accept Final', 1), ('Accept Return Call deepseek', 'Accept Final', 0),
                ('Accept Final', 'Init Seats', 0), ('Regrade After Quotes?', 'Panel Build', 0)]:
    link(s, t, i)
# every connection names a node that exists
names = {n['name'] for n in new['nodes']}
for s, v in C.items():
    assert s in names, s
    for o in v.get('main', []):
        for t in o or []: assert t['node'] in names, t['node']
json.dump(new, open(os.path.join(ROOT, 'new_workflow.json'), 'w'))
nconn = sum(len(o or []) for v in C.values() for o in v.get('main', []))
print(f"guards passed on live {live['versionId']}; {len(changed)} code nodes changed, {len(ADD)} added, {len(REMOVE)} removed; nodes {len(live['nodes'])} -> {len(new['nodes'])}; links -> {nconn}")
if not WRITE: print('DRY: nothing written'); sys.exit()
body = {k: new[k] for k in ('name', 'nodes', 'connections', 'settings')}
res = req('PUT', body)
print('PUT versionId', res.get('versionId'), 'activeVersionId', res.get('activeVersionId'), 'active', res.get('active'))
back = req('GET'); BN = {n['name']: n for n in back['nodes']}
fail = []
for nm, c in list(changed.items()) + list(added_code.items()):
    if BN.get(nm, {}).get('parameters', {}).get('jsCode') != c: fail.append(nm)
for a in ADD:
    if a['name'] not in BN: fail.append('missing ' + a['name'])
for r in REMOVE:
    if r in BN: fail.append('still present ' + r)
if json.dumps(back['connections'], sort_keys=True) != json.dumps(C, sort_keys=True): fail.append('connections differ')
json.dump(back, open(os.path.join(ROOT, 'fetchback.json'), 'w'))
print('FETCH-BACK', 'OK' if not fail else 'FAIL ' + str(fail), '| versionId', back.get('versionId'), '| activeVersionId', back.get('activeVersionId'), '| active', back.get('active'), '| nodes', len(back['nodes']))
