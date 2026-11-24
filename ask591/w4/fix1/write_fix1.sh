#!/bin/bash
# ASK 591 fix 1 engine write: Build Save Body's review line stops naming a single judge. Engine only; child untouched.
# Key from the environment only. Refuses while any engine or child execution is running, or when live is not the base (137378eb).
set -u
: "${N8N_API_KEY:?N8N_API_KEY not set; NOTHING WRITTEN}"
H=https://truthapp.app.n8n.cloud/api/v1; O=/mnt/project-files/ask591/w4/fix1; E=moMxiV4Irg1uRBZN; C=MqQHRl7mQQ0z8QdT
RUN=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/executions?status=running&limit=100" | python3 -I -c "import json,sys;d=json.load(sys.stdin).get('data') or [];print(' '.join(x['id'] for x in d if x.get('workflowId') in ('$E','$C')))") || { echo "RUN CHECK FAILED; NOTHING WRITTEN"; exit 1; }
[ -z "$RUN" ] || { echo "ENGINE OR CHILD RUN LIVE ($RUN); NOTHING WRITTEN"; exit 1; }
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o $O/prewrite_eng.json || exit 1
python3 -I - $O <<'PY' || { echo "LIVE IS NOT THE BASE; NOTHING WRITTEN"; exit 1; }
import json,sys
O=sys.argv[1]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
a=json.load(open(f'{O}/prewrite_eng.json'));b=json.load(open(f'{O}/base_eng.json'));T=json.load(open(f'{O}/target_engine_fix1.json'))
assert P(a)==P(b) and a['connections']==b['connections']
json.dump({k:a[k] for k in ('name','nodes','connections','settings')},open(f'{O}/revert_eng_fix1.json','w'),ensure_ascii=False)
json.dump({'name':a['name'],'nodes':T['nodes'],'connections':T['connections'],'settings':a['settings']},open(f'{O}/put_eng.json','w'),ensure_ascii=False)
PY
node /mnt/project-files/standing/run.cjs $O/target_engine_fix1.json $O/base_child.json > $O/standing_at_write.txt 2>&1 || { echo "STANDING FAILED; NOTHING WRITTEN"; exit 1; }; tail -1 $O/standing_at_write.txt
code=$(curl -s -o $O/putreply_eng.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H 'Content-Type: application/json' --data-binary @$O/put_eng.json $H/workflows/$E) || code=000
echo "PUT eng http $code"; [ "$code" = 200 ] || { echo "PUT FAILED"; exit 1; }
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o $O/fetchback_eng_fix1.json
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$C -o $O/fetchback_child_fix1.json
python3 -I - $O <<'PY'
import json,sys
O=sys.argv[1]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
f=json.load(open(f'{O}/fetchback_eng_fix1.json'));T=json.load(open(f'{O}/target_engine_fix1.json'));r=json.load(open(f'{O}/revert_eng_fix1.json'));c=json.load(open(f'{O}/fetchback_child_fix1.json'));bc=json.load(open(f'{O}/base_child.json'))
print('eng',f['versionId'],'active',f.get('active'),'nodes',len(f['nodes']),'params equal target',P(f)==P(T),'conn equal',f['connections']==T['connections'],'changed',[k for k in P(f) if P(f)[k]!=P(r).get(k)])
print('child',c['versionId'],'untouched',P(c)==P(bc))
PY
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/fetchback_eng_fix1.json $O/fetchback_child_fix1.json | tail -1
rm -f $O/put_eng.json $O/prewrite_eng.json
