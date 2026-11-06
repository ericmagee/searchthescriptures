#!/usr/bin/env python3
"""WALL-2024 agreement package (A + B + C): set the jsCode of the 28 nodes in package_manifest.json to their final files.
Dry by default; --write writes; --revert writes each node's live jsCode back from the saved pre-write fetch (out/prewrite_package.json).
Guards: live versionId is the manifest's (20a559da); every target node's live jsCode sha256 matches the manifest's live_sha; every final file
matches its final_sha and parses; no other node, parameter or connection changes; no running execution.
After the write: fetch back, compare every node's parameters and the connections, confirm published, save the fetch-back."""
import json, os, sys, hashlib, subprocess, urllib.request
R = os.path.dirname(os.path.abspath(__file__))
H = {'X-N8N-API-KEY': os.environ['N8N_API_KEY'], 'Content-Type': 'application/json', 'Accept': 'application/json'}
API = 'https://truthapp.app.n8n.cloud/api/v1/'; URL = API + 'workflows/moMxiV4Irg1uRBZN'
WRITE, REVERT = '--write' in sys.argv, '--revert' in sys.argv
def req(u, m='GET', b=None):
    r = urllib.request.Request(u, method=m, data=None if b is None else json.dumps(b).encode(), headers=H)
    return json.load(urllib.request.urlopen(r, timeout=180))
sha = lambda s: hashlib.sha256(s.encode()).hexdigest()[:16]
M = json.load(open(os.path.join(R, 'package_manifest.json'))); live = req(URL); bad = []
new_nodes = json.loads(json.dumps(live['nodes'])); BY = {n['name']: n for n in new_nodes}
if REVERT:
    pre = json.load(open(os.path.join(R, 'out', 'prewrite_package.json'))); PN = {n['name']: n for n in pre['nodes']}
    for e in M['nodes']: BY[e['name']]['parameters']['jsCode'] = PN[e['name']]['parameters']['jsCode']
else:
    if live.get('versionId') != M['live_version']: bad.append('versionId moved: ' + str(live.get('versionId')))
    for e in M['nodes']:
        n = BY.get(e['name'])
        if not n: bad.append('missing node ' + e['name']); continue
        if sha(n['parameters'].get('jsCode') or '') != e['live_sha']: bad.append('live sha differs: ' + e['name'])
        src = open(os.path.join(R, e['final_file'])).read()
        if sha(src) != e['final_sha']: bad.append('final file sha differs: ' + e['name'])
        pr = subprocess.run(['node', '-e', "new Function('return '+require('fs').readFileSync(0,'utf8'))"], input='(async function(){' + src + '\n})', capture_output=True, text=True)
        if pr.returncode: bad.append('PARSE FAIL ' + e['name'])
        n['parameters']['jsCode'] = src
running = req(API + 'executions?status=running&limit=50')['data']
if running: bad.append('running executions: ' + str([x['id'] for x in running]))
print('targets', len(M['nodes']), '| live', live.get('versionId'))
if bad: print('REFUSED:', bad); sys.exit(1)
if not (WRITE or REVERT): print('DRY: guards passed, nothing written'); sys.exit()
if WRITE: json.dump(live, open(os.path.join(R, 'out', 'prewrite_package.json'), 'w'))
req(URL, 'PUT', {'name': live['name'], 'nodes': new_nodes, 'connections': live['connections'], 'settings': live['settings']})
back = req(URL); BN = {n['name']: n for n in back['nodes']}; fail = []
for n in new_nodes:
    if json.dumps(BN.get(n['name'], {}).get('parameters'), sort_keys=True) != json.dumps(n['parameters'], sort_keys=True): fail.append(n['name'])
if len(back['nodes']) != len(new_nodes): fail.append('node count')
if json.dumps(back['connections'], sort_keys=True) != json.dumps(live['connections'], sort_keys=True): fail.append('connections')
if back.get('activeVersionId') != back.get('versionId') or not back.get('active'): fail.append('NOT PUBLISHED')
json.dump(back, open(os.path.join(R, 'out', 'fetchback_' + ('revert_package' if REVERT else 'package') + '.json'), 'w'))
print('FETCH-BACK', 'OK' if not fail else 'FAIL ' + str(fail), '| versionId', back.get('versionId'))
