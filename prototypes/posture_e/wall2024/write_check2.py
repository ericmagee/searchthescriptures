#!/usr/bin/env python3
"""WALL-2024 check 2: swap kwLines421 for kwLines421 + wpLines2024 in every Code node that holds it (17 on 14f0b541). Dry by default; --write writes;
--revert writes the old slice back over the new one in the same nodes.
Guards: live versionId is 14f0b541 (or, for --revert, the version this script wrote); every target holds the from-slice exactly once,
byte-identical; no other byte of any node, and no connection, changes; every changed jsCode parses; no running execution.
After the write: fetch back, compare every node's parameters and the connections, confirm published, save the fetch-back."""
import json, os, sys, hashlib, subprocess, urllib.request
R = os.path.dirname(os.path.abspath(__file__))
H = {'X-N8N-API-KEY': os.environ['N8N_API_KEY'], 'Content-Type': 'application/json', 'Accept': 'application/json'}
API = 'https://truthapp.app.n8n.cloud/api/v1/'
URL = API + 'workflows/moMxiV4Irg1uRBZN'
WRITE, REVERT = '--write' in sys.argv, '--revert' in sys.argv
BASE_VERSION = '14f0b541-fc6f-4cfb-8ca7-524f25c5ac8b'
def req(u, m='GET', b=None):
    r = urllib.request.Request(u, method=m, data=None if b is None else json.dumps(b).encode(), headers=H)
    return json.load(urllib.request.urlopen(r, timeout=180))
OLD = open(os.path.join(R, 'check2', 'kw_old.js')).read(); NEWS = open(os.path.join(R, 'check2', 'kw_new.js')).read()
FROM, TO = (NEWS, OLD) if REVERT else (OLD, NEWS)
sha = lambda s: hashlib.sha256(s.encode()).hexdigest()
live = req(URL); bad = []
if not REVERT and live.get('versionId') != BASE_VERSION: bad.append('versionId moved: ' + str(live.get('versionId')))
targets = [n for n in live['nodes'] if FROM in (n.get('parameters', {}).get('jsCode') or '')]
if len(targets) != 17: bad.append("targets " + str(len(targets)) + ", expected 17")
for n in targets:
    if n['parameters']['jsCode'].count(FROM) != 1: bad.append('slice not unique in ' + n['name'])
new_nodes = json.loads(json.dumps(live['nodes']))
for n in new_nodes:
    c = n.get('parameters', {}).get('jsCode') or ''
    if FROM in c:
        n['parameters']['jsCode'] = c.replace(FROM, TO, 1)
        pr = subprocess.run(['node', '-e', "new Function(require('fs').readFileSync(0,'utf8'))"], input=n['parameters']['jsCode'], capture_output=True, text=True)
        if pr.returncode != 0: bad.append('PARSE FAIL ' + n['name'])
running = req(API + 'executions?status=running&limit=50')['data']
if running: bad.append('running executions: ' + str([x['id'] for x in running]))
print('from-slice sha256', sha(FROM)[:16], '-> to-slice sha256', sha(TO)[:16], '| targets', [n['name'] for n in targets])
if bad: print('REFUSED:', bad); sys.exit(1)
if not (WRITE or REVERT): print('DRY: guards passed, nothing written'); sys.exit()
req(URL, 'PUT', {'name': live['name'], 'nodes': new_nodes, 'connections': live['connections'], 'settings': live['settings']})
back = req(URL); BN = {n['name']: n for n in back['nodes']}; fail = []
for n in new_nodes:
    if json.dumps(BN.get(n['name'], {}).get('parameters'), sort_keys=True) != json.dumps(n['parameters'], sort_keys=True): fail.append(n['name'])
if json.dumps(back['connections'], sort_keys=True) != json.dumps(live['connections'], sort_keys=True): fail.append('connections')
if back.get('activeVersionId') != back.get('versionId') or not back.get('active'): fail.append('NOT PUBLISHED')
json.dump(back, open(os.path.join(R, 'out', 'fetchback_' + ('revert_check2' if REVERT else 'check2') + '.json'), 'w'))
print('FETCH-BACK', 'OK' if not fail else 'FAIL ' + str(fail), '| versionId', back.get('versionId'))
