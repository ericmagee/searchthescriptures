#!/usr/bin/env python3
"""s431 (md_notes_rulings 435, 436: "add the JSON requirement to the agreement ... it's the contract with the judge"; WALL-1963): adds Commitment 9
to the judges' Posture for Acceptance (PART2), the same text at the same anchor in all twelve nodes that carry it. The acceptance check's
heading list is read from PART2 (HEADS), so the new heading is checked with no other change. Base: a GET of live e250a807 (path in argv[1])."""
import json,os,sys
R=os.path.dirname(os.path.abspath(__file__))
L=json.load(open(sys.argv[1]));assert L['versionId'].startswith('e250a807'),L['versionId']
N={n['name']:n for n in L['nodes']}
A='or the defender takes down enough of its own links.";'
C9=('or the defender takes down enough of its own links.\\n\\n### Commitment 9. I answer in the form each request gives.\\n'
 'My judgment is the strict JSON the system message gives, and nothing else. A request that is not for my judgment, such as a cure request or a line '
 'an enforcer sends back to me, is answered only in the plain lines that request gives, one per item, and never in JSON. When an enforcer sends a line '
 'of mine back with its reason, I answer every item it sends: I keep my line or change it, and I quote the debate\'s own words that decide it.";')
NODES=[nm for nm,n in N.items() if 'const PART2=' in n.get('parameters',{}).get('jsCode','')]
assert len(NODES)==12,NODES
for nm in NODES:
    c=N[nm]['parameters']['jsCode'];assert c.count(A)==1,nm
    open(f'{R}/base/{nm}.js','w').write(c);open(f'{R}/new/{nm}.js','w').write(c.replace(A,C9))
json.dump({'base_versionId':L['versionId'],'nodes':NODES},open(f'{R}/manifest.json','w'),indent=1)
print('built',len(NODES),'nodes')
