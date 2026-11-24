#!/bin/bash
# ASK 611 fix 2 write: the Shared Library of the engine, then of the child (the QR judges rebuild put on the MAP entries Send Back Build and Late Gate Build). No other node changes.
# Takes each workflow as it is live and replaces only its Shared Library. Refuses while any engine or child execution runs, when a live Shared Library is not the 3afa1c1f / cd97165c one,
# or when the rebuild, tf2, standing set or pair check fail.
set -u
: "${N8N_API_KEY:?N8N_API_KEY not set; NOTHING WRITTEN}"
H=https://truthapp.app.n8n.cloud/api/v1; O=/mnt/project-files/ask611/w4/fix2; E=moMxiV4Irg1uRBZN; C=MqQHRl7mQQ0z8QdT; cd $O
RUN=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/executions?status=running&limit=100" | python3 -I -c "import json,sys;d=json.load(sys.stdin).get('data') or [];print(' '.join(x['id'] for x in d if x.get('workflowId') in ('$E','$C')))") || { echo "RUN CHECK FAILED; NOTHING WRITTEN"; exit 1; }
[ -z "$RUN" ] || { echo "ENGINE OR CHILD RUN LIVE ($RUN); NOTHING WRITTEN"; exit 1; }
mkdir -p atw && node buildf2.cjs base_eng_3afa1c1f.json base_child_cd97165c.json atw > atw/build.txt 2>&1 && cmp -s atw/target_engine_f2.json target_engine_f2.json && cmp -s atw/target_child_f2.json target_child_f2.json || { echo "REBUILD DIFFERS FROM THE GRADED TARGET; NOTHING WRITTEN"; exit 1; }
node tf2.cjs base_eng_3afa1c1f.json base_child_cd97165c.json target_engine_f2.json target_child_f2.json > atw/tf2.txt 2>&1; tail -1 atw/tf2.txt | grep -q "^ALL PASS" || { echo "TF2 FAILED; NOTHING WRITTEN"; exit 1; }
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o prewrite_eng.json || exit 1
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$C -o prewrite_child.json || exit 1
python3 -I - $O <<'PY' || { echo "LIVE SHARED LIBRARY IS NOT THE BASE; NOTHING WRITTEN"; exit 1; }
import json,sys
O=sys.argv[1]
SL=lambda d:next(n for n in d['nodes'] if n['name']=='Shared Library')
for k,base,tgt in [('eng','base_eng_3afa1c1f.json','target_engine_f2.json'),('child','base_child_cd97165c.json','target_child_f2.json')]:
  a=json.load(open(f'{O}/prewrite_{k}.json'));b=json.load(open(f'{O}/{base}'));T=json.load(open(f'{O}/{tgt}'))
  assert json.dumps(SL(a)['parameters'],sort_keys=True)==json.dumps(SL(b)['parameters'],sort_keys=True), k
  json.dump({x:a[x] for x in ('name','nodes','connections','settings')},open(f'{O}/revert_{k}_f2.json','w'),ensure_ascii=False)
  for n in a['nodes']:
    if n['name']=='Shared Library': n['parameters']=SL(T)['parameters']
  json.dump({'name':a['name'],'nodes':a['nodes'],'connections':a['connections'],'settings':a['settings']},open(f'{O}/put_{k}.json','w'),ensure_ascii=False)
PY
node /mnt/project-files/standing/run.cjs $O/put_eng.json $O/put_child.json > atw/standing.txt 2>&1 || { echo "STANDING FAILED; NOTHING WRITTEN"; exit 1; }; tail -1 atw/standing.txt
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/put_eng.json $O/put_child.json | tail -1 | grep -q "Library Check PASSES" || { echo "PAIR CHECK FAILED; NOTHING WRITTEN"; exit 1; }
for k in eng child; do W=$E; [ $k = child ] && W=$C
 code=$(curl -s -o putreply_$k.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H 'Content-Type: application/json' --data-binary @put_$k.json $H/workflows/$W) || code=000
 echo "PUT $k http $code"; [ "$code" = 200 ] || { echo "PUT $k FAILED (engine already written if this is the child: the pair check fails until the child is written or the engine reverted)"; exit 1; }
 curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$W -o fetchback_${k}_f2.json; done
python3 -I - $O <<'PY'
import json,sys
O=sys.argv[1]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
for k in ('eng','child'):
  f=json.load(open(f'{O}/fetchback_{k}_f2.json'));p=json.load(open(f'{O}/put_{k}.json'));r=json.load(open(f'{O}/revert_{k}_f2.json'))
  print(k,f['versionId'],'active',f.get('active'),'nodes',len(f['nodes']),'params equal put',P(f)==P(p),'conn equal',f['connections']==p['connections'],'changed',[x for x in P(f) if P(f)[x]!=P(r).get(x)])
PY
node /mnt/project-files/standing/run.cjs $O/fetchback_eng_f2.json $O/fetchback_child_f2.json | tail -1
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/fetchback_eng_f2.json $O/fetchback_child_f2.json | tail -1
node tf2.cjs base_eng_3afa1c1f.json base_child_cd97165c.json fetchback_eng_f2.json fetchback_child_f2.json | tail -1
rm -f put_eng.json put_child.json prewrite_eng.json prewrite_child.json
