#!/usr/bin/env python3
"""Grok prompt caching per xAI's documentation (Chat Completions: the x-grok-conv-id header routes requests with the same
conversation ID to the same server, where the cache lives). Adds one header, x-grok-conv-id = "odv1-" + the n8n execution id
(one ID per run, the same on every call of that run), to the 19 api.x.ai call nodes and the 27 OpenRouter call nodes.
Nothing else changes. Dry by default; --write writes. Guards: live versionId 94f25fc7, 332 nodes, every target node has
no headers today, no running execution. After: fetch back; targets equal new, all other nodes and connections unchanged."""
import json, os, sys, urllib.request
R = os.path.dirname(os.path.abspath(__file__))
H = {'X-N8N-API-KEY': os.environ['N8N_API_KEY'], 'Content-Type': 'application/json', 'Accept': 'application/json'}
API = 'https://truthapp.app.n8n.cloud/api/v1/'
URL = API + 'workflows/moMxiV4Irg1uRBZN'
BASE = '94f25fc7-aa32-49ea-9b82-7f5764f077e3'
WRITE = '--write' in sys.argv
HDR = {'sendHeaders': True, 'specifyHeaders': 'keypair',
       'headerParameters': {'parameters': [{'name': 'x-grok-conv-id', 'value': '={{ "odv1-" + $execution.id }}'}]}}
def req(u, m='GET', b=None):
    r = urllib.request.Request(u, method=m, data=None if b is None else json.dumps(b).encode(), headers=H)
    return json.load(urllib.request.urlopen(r, timeout=180))
live = req(URL)
json.dump(live, open(os.path.join(R, 'base_get.json'), 'w'))
T = [n['name'] for n in live['nodes'] if n['type'] == 'n8n-nodes-base.httpRequest'
     and any(h in n['parameters'].get('url', '') for h in ('https://api.x.ai/', 'https://openrouter.ai/'))]
bad = []
if live.get('versionId') != BASE: bad.append('versionId moved: ' + str(live.get('versionId')))
if len(live['nodes']) != 332: bad.append('node count ' + str(len(live['nodes'])))
if len(T) != 46: bad.append('target count ' + str(len(T)))
for n in live['nodes']:
    if n['name'] in T and any(k in n['parameters'] for k in HDR): bad.append('already has headers: ' + n['name'])
if req(API + 'executions?status=running&limit=50')['data']: bad.append('running execution')
if bad: print('REFUSED:', bad); sys.exit(1)
new = json.loads(json.dumps(live))
for n in new['nodes']:
    if n['name'] in T: n['parameters'].update(json.loads(json.dumps(HDR)))
json.dump(sorted(T), open(os.path.join(R, 'targets.json'), 'w'), indent=1)
print('guards passed on', live['versionId'], '| targets', len(T), '(x.ai', sum('grok' in t for t in T), ')')
if not WRITE: print('DRY: nothing written'); sys.exit()
req(URL, 'PUT', {k: new[k] for k in ('name', 'nodes', 'connections', 'settings')})
back = req(URL)
BN = {n['name']: n for n in back['nodes']}
fail = [n['name'] for n in new['nodes'] if json.dumps(BN.get(n['name'], {}).get('parameters'), sort_keys=True) != json.dumps(n['parameters'], sort_keys=True)]
if len(back['nodes']) != 332: fail.append('node count')
if json.dumps(back['connections'], sort_keys=True) != json.dumps(live['connections'], sort_keys=True): fail.append('connections')
if back.get('activeVersionId') != back.get('versionId') or not back.get('active'): fail.append('NOT PUBLISHED')
json.dump(back, open(os.path.join(R, 'fetchback.json'), 'w'))
print('FETCH-BACK', 'OK' if not fail else 'FAIL ' + str(fail), '| versionId', back.get('versionId'), '| nodes', len(back['nodes']))
