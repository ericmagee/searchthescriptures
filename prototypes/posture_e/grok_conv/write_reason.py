#!/usr/bin/env python3
"""Write the Grok reasoning hand-back (reason/manifest.json, 28 nodes). Guards: live versionId 77926cf1; 332 nodes; each node's live value equals
the manifest base; Send Back Build parses; no running execution. After: fetch back; the 28 equal new; every other node and the connections unchanged."""
import json, os, sys, subprocess, urllib.request
R = os.path.dirname(os.path.abspath(__file__))
H = {'X-N8N-API-KEY': os.environ['N8N_API_KEY'], 'Content-Type': 'application/json', 'Accept': 'application/json'}
API = 'https://truthapp.app.n8n.cloud/api/v1/'; URL = API + 'workflows/moMxiV4Irg1uRBZN'
M = json.load(open(f'{R}/reason/manifest.json'))
def req(u, m='GET', b=None):
    r = urllib.request.Request(u, method=m, data=None if b is None else json.dumps(b).encode(), headers=H)
    return json.load(urllib.request.urlopen(r, timeout=180))
live = req(URL); bad = []
if live['versionId'] != M['base_versionId']: bad.append('versionId moved ' + live['versionId'])
if len(live['nodes']) != 332: bad.append('nodes ' + str(len(live['nodes'])))
LN = {n['name']: n for n in live['nodes']}
for nm, (k, base, new) in M['nodes'].items():
    if LN[nm]['parameters'].get(k) != base: bad.append('live differs from base: ' + nm)
    if k == 'jsCode' and subprocess.run(['node', '-e', "new Function('$','$input','$execution',require('fs').readFileSync(0,'utf8'))"], input=new, text=True, capture_output=True).returncode: bad.append('PARSE ' + nm)
if req(API + 'executions?status=running&limit=50')['data']: bad.append('running execution')
if bad: print('REFUSED', bad); sys.exit(1)
print('guards passed', live['versionId'], len(M['nodes']))
if '--write' not in sys.argv: print('DRY'); sys.exit()
new = json.loads(json.dumps(live))
for n in new['nodes']:
    if n['name'] in M['nodes']: k, _, v = M['nodes'][n['name']]; n['parameters'][k] = v
req(URL, 'PUT', {k: new[k] for k in ('name', 'nodes', 'connections', 'settings')})
back = req(URL); BN = {n['name']: n for n in back['nodes']}
fail = [n['name'] for n in new['nodes'] if json.dumps(BN.get(n['name'], {}).get('parameters'), sort_keys=True) != json.dumps(n['parameters'], sort_keys=True)]
if len(back['nodes']) != 332: fail.append('nodes')
if json.dumps(back['connections'], sort_keys=True) != json.dumps(live['connections'], sort_keys=True): fail.append('connections')
if back.get('activeVersionId') != back.get('versionId') or not back.get('active'): fail.append('NOT PUBLISHED')
json.dump(back, open(f'{R}/reason/fetchback.json', 'w'))
print('FETCH-BACK', 'OK' if not fail else 'FAIL ' + str(fail), back['versionId'], len(back['nodes']))
