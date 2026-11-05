#!/usr/bin/env python3
"""One write of s435 (pieces 3 and 4a with ruling 445: 3 code nodes) and s436 (ruling 446, caching: 27 call-node bodies). Dry by default; --write
writes. Guards: live versionId equals both bases; 332 nodes; live code of the 3 code nodes equals s435 base/; live body of the 27 call nodes equals
base_bodies.json; every new code node parses; no running execution. After: fetch back; changed nodes equal their new value, every other node's
parameters and the connections unchanged; published."""
import json, os, sys, subprocess, urllib.request
R = os.path.dirname(os.path.abspath(__file__)); P = os.path.join(R, '..', 's435')
H = {'X-N8N-API-KEY': os.environ['N8N_API_KEY'], 'Content-Type': 'application/json', 'Accept': 'application/json'}
API = 'https://truthapp.app.n8n.cloud/api/v1/'
URL = API + 'workflows/moMxiV4Irg1uRBZN'
WRITE = '--write' in sys.argv
M = json.load(open(os.path.join(P, 'manifest.json')))
BB = json.load(open(os.path.join(R, 'base_bodies.json'))); NB = json.load(open(os.path.join(R, 'new_bodies.json')))
def req(u, m='GET', b=None):
    r = urllib.request.Request(u, method=m, data=None if b is None else json.dumps(b).encode(), headers=H)
    return json.load(urllib.request.urlopen(r, timeout=180))
live = req(URL)
bad = []
for v in (M['base_versionId'], BB['base_versionId']):
    if live.get('versionId') != v: bad.append('versionId moved: ' + str(live.get('versionId')) + ' vs ' + v)
if len(live['nodes']) != 332: bad.append('node count ' + str(len(live['nodes'])))
LN = {n['name']: n for n in live['nodes']}
NEWC = {}
for nm in M['nodes']:
    if LN[nm]['parameters'].get('jsCode') != open(os.path.join(P, 'base', nm + '.js')).read(): bad.append('live differs from base: ' + nm)
    NEWC[nm] = open(os.path.join(P, 'new', nm + '.js')).read()
    pr = subprocess.run(['node', '-e', "new Function(require('fs').readFileSync(0,'utf8'))"], input=NEWC[nm], capture_output=True, text=True)
    if pr.returncode != 0: bad.append('PARSE FAIL ' + nm)
for nm, (k, v) in BB['nodes'].items():
    if LN[nm]['parameters'].get(k) != v: bad.append('live body differs from base: ' + nm)
if set(NEWC) & set(NB): bad.append('overlap')
running = req(API + 'executions?status=running&limit=50')['data']
if running: bad.append('running executions: ' + str([x['id'] for x in running]))
if bad:
    print('REFUSED:', bad); sys.exit(1)
print('guards passed on live', live['versionId'], '| nodes', len(live['nodes']), '| code nodes', len(NEWC), '| call bodies', len(NB))
if not WRITE:
    print('DRY: nothing written'); sys.exit()
new = json.loads(json.dumps(live))
for n in new['nodes']:
    if n['name'] in NEWC: n['parameters']['jsCode'] = NEWC[n['name']]
    if n['name'] in NB: n['parameters'][NB[n['name']][0]] = NB[n['name']][1]
req(URL, 'PUT', {k: new[k] for k in ('name', 'nodes', 'connections', 'settings')})
back = req(URL)
BN = {n['name']: n for n in back['nodes']}
NN = {n['name']: n for n in new['nodes']}
fail = [nm for nm in NN if json.dumps(BN.get(nm, {}).get('parameters'), sort_keys=True) != json.dumps(NN[nm]['parameters'], sort_keys=True)]
if len(back['nodes']) != 332: fail.append('node count')
if json.dumps(back['connections'], sort_keys=True) != json.dumps(live['connections'], sort_keys=True): fail.append('connections')
if back.get('activeVersionId') != back.get('versionId') or not back.get('active'): fail.append('NOT PUBLISHED')
json.dump(back, open(os.path.join(R, 'fetchback_s436.json'), 'w'))
print('FETCH-BACK', 'OK' if not fail else 'FAIL ' + str(fail), '| versionId', back.get('versionId'), '| nodes', len(back['nodes']))
