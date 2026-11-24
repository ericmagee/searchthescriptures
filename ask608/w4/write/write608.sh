#!/bin/bash
# ASK 608 engine write: Resolve Seats (backup enforcer glm when luna is of a debater family). Engine only; child untouched.
# Key from the environment only. Refuses while any engine or child execution runs, when live is not 3cef3eab, or when the standing set (with S4 compile) fails.
set -u
: "${N8N_API_KEY:?N8N_API_KEY not set; NOTHING WRITTEN}"
H=https://truthapp.app.n8n.cloud/api/v1; O=/mnt/project-files/ask608/w4/write; B=/mnt/project-files/ask608/w4/b1; E=moMxiV4Irg1uRBZN; C=MqQHRl7mQQ0z8QdT; BASE=/mnt/project-files/ask611/w4/fix1/fetchback_eng_611f1.json; CB=/mnt/project-files/ask611/w4/fix1/fetchback_child_611f1.json
RUN=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/executions?status=running&limit=100" | python3 -I -c "import json,sys;d=json.load(sys.stdin).get('data') or [];print(' '.join(x['id'] for x in d if x.get('workflowId') in ('$E','$C')))") || { echo "RUN CHECK FAILED; NOTHING WRITTEN"; exit 1; }
[ -z "$RUN" ] || { echo "ENGINE OR CHILD RUN LIVE ($RUN); NOTHING WRITTEN"; exit 1; }
( cd $B && node build608.cjs && node t608.cjs > $O/t608_at_write.txt 2>&1 ); tail -1 $O/t608_at_write.txt | grep -q "T1 ALL PASS" || { echo "BUILD/T608 FAILED; NOTHING WRITTEN"; exit 1; }
node /mnt/project-files/standing/run.cjs $B/target_engine_608.json $CB > $O/standing_at_write.txt 2>&1 || { echo "STANDING FAILED; NOTHING WRITTEN"; exit 1; }; tail -1 $O/standing_at_write.txt
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o $O/prewrite_eng.json || exit 1
python3 -I - $O $BASE $B <<'PY' || { echo "LIVE IS NOT THE BASE (3cef3eab); NOTHING WRITTEN"; exit 1; }
import json,sys
O,BS,B=sys.argv[1],sys.argv[2],sys.argv[3]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
a=json.load(open(f'{O}/prewrite_eng.json'));b=json.load(open(BS));T=json.load(open(f'{B}/target_engine_608.json'))
assert P(a)==P(b) and a['connections']==b['connections']
json.dump({k:a[k] for k in ('name','nodes','connections','settings')},open(f'{O}/revert_eng_608.json','w'),ensure_ascii=False)
json.dump({'name':a['name'],'nodes':T['nodes'],'connections':T['connections'],'settings':a['settings']},open(f'{O}/put_eng.json','w'),ensure_ascii=False)
PY
code=$(curl -s -o $O/putreply_eng.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H 'Content-Type: application/json' --data-binary @$O/put_eng.json $H/workflows/$E) || code=000
echo "PUT eng http $code"; [ "$code" = 200 ] || { echo "PUT FAILED"; exit 1; }
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o $O/fetchback_eng_608.json
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$C -o $O/fetchback_child_608.json
python3 -I - $O $B <<'PY'
import json,sys
O,B=sys.argv[1],sys.argv[2]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
f=json.load(open(f'{O}/fetchback_eng_608.json'));T=json.load(open(f'{B}/target_engine_608.json'));r=json.load(open(f'{O}/revert_eng_608.json'))
print('eng',f['versionId'],'active',f.get('active'),'nodes',len(f['nodes']),'params equal target',P(f)==P(T),'conn equal',f['connections']==T['connections'],'changed',[k for k in P(f) if P(f)[k]!=P(r).get(k)])
PY
node /mnt/project-files/standing/run.cjs $O/fetchback_eng_608.json $O/fetchback_child_608.json
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/fetchback_eng_608.json $O/fetchback_child_608.json | tail -1
rm -f $O/put_eng.json $O/prewrite_eng.json
