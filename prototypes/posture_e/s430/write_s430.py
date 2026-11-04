#!/usr/bin/env python3
"""s430 (ruling 428 send-back): writes workflow_s430.json over live f2c984c9. Dry by default; --write writes.
Guards: live versionId equals the s429 fetch-back base; node count 328; connections unchanged; live code of the two changed nodes equals base/;
every code node parses; no running execution. After the write: fetch back, every node's parameters and the connections compared, published."""
import json, os, sys, subprocess, urllib.request
R = os.path.dirname(os.path.abspath(__file__))
H = {'X-N8N-API-KEY': os.environ['N8N_API_KEY'], 'Content-Type': 'application/json', 'Accept': 'application/json'}
API = 'https://truthapp.app.n8n.cloud/api/v1/'
URL = API + 'workflows/moMxiV4Irg1uRBZN'
WRITE = '--write' in sys.argv

def req(u, m='GET', b=None):
    r = urllib.request.Request(u, method=m, data=None if b is None else json.dumps(b).encode(), headers=H)
    return json.load(urllib.request.urlopen(r, timeout=180))

BASE = json.load(open(os.path.join(R, '..', 's429', 'fetchback_s429.json')))
NEW = json.load(open(os.path.join(R, 'workflow_s430.json')))
live = req(URL)
bad = []
if live.get('versionId') != BASE.get('versionId'):
    bad.append('versionId moved: ' + str(live.get('versionId')))
if len(live['nodes']) != 328:
    bad.append('node count ' + str(len(live['nodes'])))
if json.dumps(live['connections'], sort_keys=True) != json.dumps(BASE['connections'], sort_keys=True):
    bad.append('connections moved')
LN = {n['name']: n for n in live['nodes']}
for nm in ['Alternate Merge', 'Format Markdown']:
    if LN[nm]['parameters'].get('jsCode') != open(os.path.join(R, 'base', nm + '.js')).read():
        bad.append('live differs from base: ' + nm)
for n in NEW['nodes']:
    c = n.get('parameters', {}).get('jsCode')
    if c is None:
        continue
    pr = subprocess.run(['node', '-e', "new Function(require('fs').readFileSync(0,'utf8'))"], input=c, capture_output=True, text=True)
    if pr.returncode != 0:
        bad.append('PARSE FAIL ' + n['name'])
running = req(API + 'executions?status=running&limit=50')['data']
if running:
    bad.append('running executions: ' + str([x['id'] for x in running]))
if bad:
    print('REFUSED:', bad)
    sys.exit(1)
print('guards passed on live', live['versionId'], '| nodes', len(live['nodes']), '->', len(NEW['nodes']))
if not WRITE:
    print('DRY: nothing written')
    sys.exit()
req(URL, 'PUT', {k: NEW[k] for k in ('name', 'nodes', 'connections', 'settings')})
back = req(URL)
BN = {n['name']: n for n in back['nodes']}
fail = []
for n in NEW['nodes']:
    if json.dumps(BN.get(n['name'], {}).get('parameters'), sort_keys=True) != json.dumps(n['parameters'], sort_keys=True):
        fail.append(n['name'])
if json.dumps(back['connections'], sort_keys=True) != json.dumps(NEW['connections'], sort_keys=True):
    fail.append('connections')
if back.get('activeVersionId') != back.get('versionId') or not back.get('active'):
    fail.append('NOT PUBLISHED')
json.dump(back, open(os.path.join(R, 'fetchback_s430.json'), 'w'))
print('FETCH-BACK', 'OK' if not fail else 'FAIL ' + str(fail), '| versionId', back.get('versionId'), '| nodes', len(back['nodes']))
