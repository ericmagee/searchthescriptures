#!/usr/bin/env python3
"""s437 (piece 4b): writes workflow_s437.json over live. Dry by default; --write writes. Guards: live versionId as manifest.json; 332 nodes;
every live node's parameters and the connections equal ../s436/fetchback_s436.json (the build base); every code node of the new workflow parses;
no running execution. After: fetch back; every node's parameters and the connections equal workflow_s437.json; 340 nodes; published."""
import json, os, sys, subprocess, urllib.request
R = os.path.dirname(os.path.abspath(__file__))
H = {'X-N8N-API-KEY': os.environ['N8N_API_KEY'], 'Content-Type': 'application/json', 'Accept': 'application/json'}
API = 'https://truthapp.app.n8n.cloud/api/v1/'; URL = API + 'workflows/moMxiV4Irg1uRBZN'
WRITE = '--write' in sys.argv
M = json.load(open(os.path.join(R, 'manifest.json'))); NEW = json.load(open(os.path.join(R, 'workflow_s437.json')))
BASE = json.load(open(os.path.join(R, '..', 's436', 'fetchback_s436.json')))
def req(u, m='GET', b=None):
    r = urllib.request.Request(u, method=m, data=None if b is None else json.dumps(b).encode(), headers=H)
    return json.load(urllib.request.urlopen(r, timeout=180))
js = lambda x: json.dumps(x, sort_keys=True)
live = req(URL); bad = []
if live.get('versionId') != M['base_versionId']: bad.append('versionId moved: ' + str(live.get('versionId')))
if len(live['nodes']) != M['nodes_before']: bad.append('node count ' + str(len(live['nodes'])))
BN = {n['name']: n for n in BASE['nodes']}
for n in live['nodes']:
    if n['name'] not in BN or js(n['parameters']) != js(BN[n['name']]['parameters']): bad.append('live differs from base: ' + n['name'])
if js(live['connections']) != js(BASE['connections']): bad.append('connections moved')
for n in NEW['nodes']:
    c = n.get('parameters', {}).get('jsCode')
    if c is None: continue
    pr = subprocess.run(['node', '-e', "new Function(require('fs').readFileSync(0,'utf8'))"], input=c, capture_output=True, text=True)
    if pr.returncode != 0: bad.append('PARSE FAIL ' + n['name'])
running = req(API + 'executions?status=running&limit=50')['data']
if running: bad.append('running executions: ' + str([x['id'] for x in running]))
if bad: print('REFUSED:', bad[:10]); sys.exit(1)
print('guards passed on live', live['versionId'], '| nodes', len(live['nodes']), '->', len(NEW['nodes']))
if not WRITE: print('DRY: nothing written'); sys.exit()
req(URL, 'PUT', {k: NEW[k] for k in ('name', 'nodes', 'connections', 'settings')})
back = req(URL); K = {n['name']: n for n in back['nodes']}; fail = []
for n in NEW['nodes']:
    if js(K.get(n['name'], {}).get('parameters')) != js(n['parameters']): fail.append(n['name'])
if len(back['nodes']) != M['nodes_after']: fail.append('node count ' + str(len(back['nodes'])))
if js(back['connections']) != js(NEW['connections']): fail.append('connections')
if back.get('activeVersionId') != back.get('versionId') or not back.get('active'): fail.append('NOT PUBLISHED')
json.dump(back, open(os.path.join(R, 'fetchback_s437.json'), 'w'))
print('FETCH-BACK', 'OK' if not fail else 'FAIL ' + str(fail), '| versionId', back.get('versionId'), '| nodes', len(back['nodes']))
