#!/bin/bash
# ASK 611 fix 1 engine write: Panel Judges Parallel and Alternate Pass Call expressions (inner "}}" spaced). Engine only; child untouched.
# Key from the environment only. Refuses while any engine or child execution runs, or when live is not fbc09389.
set -u
: "${N8N_API_KEY:?N8N_API_KEY not set; NOTHING WRITTEN}"
H=https://truthapp.app.n8n.cloud/api/v1; O=/mnt/project-files/ask611/w4/fix1; E=moMxiV4Irg1uRBZN; C=MqQHRl7mQQ0z8QdT; BASE=/mnt/project-files/ask611/w4/write/fetchback_eng611.json
RUN=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/executions?status=running&limit=100" | python3 -I -c "import json,sys;d=json.load(sys.stdin).get('data') or [];print(' '.join(x['id'] for x in d if x.get('workflowId') in ('$E','$C')))") || { echo "RUN CHECK FAILED; NOTHING WRITTEN"; exit 1; }
[ -z "$RUN" ] || { echo "ENGINE OR CHILD RUN LIVE ($RUN); NOTHING WRITTEN"; exit 1; }
node $O/build611f1.cjs || { echo "BUILD/COMPILE CHECK FAILED; NOTHING WRITTEN"; exit 1; }
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o $O/prewrite_eng.json || exit 1
python3 -I - $O $BASE <<'PY' || { echo "LIVE IS NOT THE BASE (fbc09389); NOTHING WRITTEN"; exit 1; }
import json,sys
O,B=sys.argv[1],sys.argv[2]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
a=json.load(open(f'{O}/prewrite_eng.json'));b=json.load(open(B));T=json.load(open(f'{O}/target_engine_611f1.json'))
assert P(a)==P(b) and a['connections']==b['connections']
json.dump({k:a[k] for k in ('name','nodes','connections','settings')},open(f'{O}/revert_eng_611f1.json','w'),ensure_ascii=False)
json.dump({'name':a['name'],'nodes':T['nodes'],'connections':T['connections'],'settings':a['settings']},open(f'{O}/put_eng.json','w'),ensure_ascii=False)
PY
code=$(curl -s -o $O/putreply_eng.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H 'Content-Type: application/json' --data-binary @$O/put_eng.json $H/workflows/$E) || code=000
echo "PUT eng http $code"; [ "$code" = 200 ] || { echo "PUT FAILED"; exit 1; }
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o $O/fetchback_eng_611f1.json
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$C -o $O/fetchback_child_611f1.json
python3 -I - $O <<'PY'
import json,sys
O=sys.argv[1]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
f=json.load(open(f'{O}/fetchback_eng_611f1.json'));T=json.load(open(f'{O}/target_engine_611f1.json'));r=json.load(open(f'{O}/revert_eng_611f1.json'))
print('eng',f['versionId'],'active',f.get('active'),'nodes',len(f['nodes']),'params equal target',P(f)==P(T),'conn equal',f['connections']==T['connections'],'changed',[k for k in P(f) if P(f)[k]!=P(r).get(k)])
PY
node /tmp/claude-0/-home-user/86d59483-62fd-5fa0-b8c4-6322500f4823/scratchpad/tour/all.cjs $O/fetchback_eng_611f1.json $O/fetchback_child_611f1.json
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/fetchback_eng_611f1.json $O/fetchback_child_611f1.json | tail -1
rm -f $O/put_eng.json $O/prewrite_eng.json
