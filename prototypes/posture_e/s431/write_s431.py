#!/usr/bin/env python3
"""s431 (rulings 435, 436: Commitment 9 in the judges' Posture for Acceptance): writes the twelve new/ nodes over live e250a807. Dry by default;
--write writes. Guards: live versionId e250a807; 332 nodes; live code of each of the twelve equals base/; every new node parses; no running
execution. After: fetch back; the twelve equal new/, every other node's parameters and the connections unchanged; published."""
import json, os, sys, subprocess, urllib.request
R = os.path.dirname(os.path.abspath(__file__))
H = {'X-N8N-API-KEY': os.environ['N8N_API_KEY'], 'Content-Type': 'application/json', 'Accept': 'application/json'}
API = 'https://truthapp.app.n8n.cloud/api/v1/'
URL = API + 'workflows/moMxiV4Irg1uRBZN'
WRITE = '--write' in sys.argv
M = json.load(open(os.path.join(R, 'manifest.json')))

def req(u, m='GET', b=None):
    r = urllib.request.Request(u, method=m, data=None if b is None else json.dumps(b).encode(), headers=H)
    return json.load(urllib.request.urlopen(r, timeout=180))

live = req(URL)
bad = []
if live.get('versionId') != M['base_versionId']:
    bad.append('versionId moved: ' + str(live.get('versionId')))
if len(live['nodes']) != 332:
    bad.append('node count ' + str(len(live['nodes'])))
LN = {n['name']: n for n in live['nodes']}
NEWC = {}
for nm in M['nodes']:
    if LN[nm]['parameters'].get('jsCode') != open(os.path.join(R, 'base', nm + '.js')).read():
        bad.append('live differs from base: ' + nm)
    NEWC[nm] = open(os.path.join(R, 'new', nm + '.js')).read()
    pr = subprocess.run(['node', '-e', "new Function(require('fs').readFileSync(0,'utf8'))"], input=NEWC[nm], capture_output=True, text=True)
    if pr.returncode != 0:
        bad.append('PARSE FAIL ' + nm)
running = req(API + 'executions?status=running&limit=50')['data']
if running:
    bad.append('running executions: ' + str([x['id'] for x in running]))
if bad:
    print('REFUSED:', bad)
    sys.exit(1)
print('guards passed on live', live['versionId'], '| nodes', len(live['nodes']), '| changing', len(NEWC))
if not WRITE:
    print('DRY: nothing written')
    sys.exit()
new = json.loads(json.dumps(live))
for n in new['nodes']:
    if n['name'] in NEWC:
        n['parameters']['jsCode'] = NEWC[n['name']]
req(URL, 'PUT', {k: new[k] for k in ('name', 'nodes', 'connections', 'settings')})
back = req(URL)
BN = {n['name']: n for n in back['nodes']}
fail = []
for nm, n in LN.items():
    want = NEWC[nm] if nm in NEWC else None
    if want is not None:
        if BN[nm]['parameters'].get('jsCode') != want:
            fail.append(nm)
    elif json.dumps(BN[nm]['parameters'], sort_keys=True) != json.dumps(n['parameters'], sort_keys=True):
        fail.append('moved ' + nm)
if json.dumps(back['connections'], sort_keys=True) != json.dumps(live['connections'], sort_keys=True):
    fail.append('connections')
if back.get('activeVersionId') != back.get('versionId') or not back.get('active'):
    fail.append('NOT PUBLISHED')
print('FETCH-BACK', 'OK' if not fail else 'FAIL ' + str(fail), '| versionId', back.get('versionId'), '| nodes', len(back['nodes']))
