#!/bin/bash
# ASK 578 write (re-cut on 579, base engine 634afc23 / child 85515391): engine Alternate Pass Call sends the library text; then the child:
# its 14 library readers read it from the call, its Library Check checks it, and its Shared Library node is removed. No other node changes.
# Refuses while any engine or child execution runs, when a live node is not the base one, or when the rebuild, t578b, standing set or pair check fail.
set -u
: "${N8N_API_KEY:?N8N_API_KEY not set; NOTHING WRITTEN}"
H=https://truthapp.app.n8n.cloud/api/v1; B=/mnt/project-files/ask578/w4/b3; O=/mnt/project-files/ask578/w4/write2; E=moMxiV4Irg1uRBZN; C=MqQHRl7mQQ0z8QdT; cd $O
RUN=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/executions?status=running&limit=100" | python3 -I -c "import json,sys;d=json.load(sys.stdin).get('data') or [];print(' '.join(x['id'] for x in d if x.get('workflowId') in ('$E','$C')))") || { echo "RUN CHECK FAILED; NOTHING WRITTEN"; exit 1; }
[ -z "$RUN" ] || { echo "ENGINE OR CHILD RUN LIVE ($RUN); NOTHING WRITTEN"; exit 1; }
mkdir -p atw && NODE_PATH=/mnt/project-files/ask578/w4/build/node_modules node $B/t578c.js $B/base_eng.json $B/base_child.json $O/atw > atw/t578c.txt 2>&1; tail -1 atw/t578c.txt | grep -q "^ALL PASS" || { echo "T578C FAILED; NOTHING WRITTEN"; exit 1; }
cmp -s atw/target_engine_578.json $B/target_engine_578.json && cmp -s atw/target_child_578.json $B/target_child_578.json || { echo "REBUILD DIFFERS FROM THE GRADED TARGET; NOTHING WRITTEN"; exit 1; }
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o prewrite_eng.json || exit 1
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$C -o prewrite_child.json || exit 1
python3 -I - $O $B <<'PY' || { echo "A LIVE NODE IS NOT THE BASE; NOTHING WRITTEN"; exit 1; }
import json,sys
O,B=sys.argv[1],sys.argv[2]
P=lambda d:{n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
for k,base,tgt in [('eng','base_eng.json','target_engine_578.json'),('child','base_child.json','target_child_578.json')]:
  a=json.load(open(f'{O}/prewrite_{k}.json'));b=json.load(open(f'{B}/{base}'));T=json.load(open(f'{B}/{tgt}'))
  ch=[n for n in P(b) if P(T).get(n)!=P(b)[n]]                       # nodes the target changes or removes
  for nm in ch: assert P(a).get(nm)==P(b)[nm], (k,nm)
  assert a['connections']==b['connections'], (k,'connections moved')
  json.dump({x:a[x] for x in ('name','nodes','connections','settings')},open(f'{O}/revert_{k}_578.json','w'),ensure_ascii=False)
  TN={n['name']:n for n in T['nodes']}
  a['nodes']=[({**n,'parameters':TN[n['name']]['parameters']} if n['name'] in ch else n) for n in a['nodes'] if n['name'] in TN]
  print(k,'nodes changed',len([n for n in ch if n in TN]),'removed',[n for n in ch if n not in TN])
  json.dump({'name':a['name'],'nodes':a['nodes'],'connections':a['connections'],'settings':a['settings']},open(f'{O}/put_{k}.json','w'),ensure_ascii=False)
PY
node /mnt/project-files/standing/run.cjs $O/put_eng.json $O/put_child.json > atw/standing.txt 2>&1 || { echo "STANDING FAILED; NOTHING WRITTEN"; exit 1; }; tail -1 atw/standing.txt
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/put_eng.json $O/put_child.json | tail -1 | grep -q "Library Check PASSES" || { echo "PAIR CHECK FAILED; NOTHING WRITTEN"; exit 1; }
for k in eng child; do W=$E; [ $k = child ] && W=$C
 code=$(curl -s -o putreply_$k.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H 'Content-Type: application/json' --data-binary @put_$k.json $H/workflows/$W) || code=000
 echo "PUT $k http $code"; [ "$code" = 200 ] || { echo "PUT $k FAILED (engine already written if this is the child; the engine change alone is safe: the old child ignores the extra field; revert_eng_578.json restores it)"; exit 1; }
 curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$W -o fetchback_${k}_578.json; done
python3 -I - $O <<'PY'
import json,sys
O=sys.argv[1]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
for k in ('eng','child'):
  f=json.load(open(f'{O}/fetchback_{k}_578.json'));p=json.load(open(f'{O}/put_{k}.json'));r=json.load(open(f'{O}/revert_{k}_578.json'))
  print(k,f['versionId'],'active',f.get('active'),'nodes',len(f['nodes']),'params equal put',P(f)==P(p),'conn equal',f['connections']==p['connections'],'changed',[x for x in P(r) if P(f).get(x)!=P(r)[x]])
PY
node /mnt/project-files/standing/run.cjs $O/fetchback_eng_578.json $O/fetchback_child_578.json | tail -1
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/fetchback_eng_578.json $O/fetchback_child_578.json | tail -1
rm -f put_eng.json put_child.json prewrite_eng.json prewrite_child.json
