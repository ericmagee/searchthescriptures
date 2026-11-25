#!/bin/bash
# ASK 628 write: engine (Shared Library, Build Save Body, D4 Build, D4B Build, Panel Build, Build Independent Verdict), then child (Shared Library). No other node changes.
# Takes each workflow as it is live and replaces only that node. Refuses while any engine or child execution runs, when the live node is not the base one,
# or when the rebuild, t628, standing set or pair check fail.
set -u
: "${N8N_API_KEY:?N8N_API_KEY not set; NOTHING WRITTEN}"
H=https://truthapp.app.n8n.cloud/api/v1; B=/mnt/project-files/ask628/w4/b1; O=/mnt/project-files/ask628/w4/write; E=moMxiV4Irg1uRBZN; C=MqQHRl7mQQ0z8QdT; cd $O
RUN=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/executions?status=running&limit=100" | python3 -I -c "import json,sys;d=json.load(sys.stdin).get('data') or [];print(' '.join(x['id'] for x in d if x.get('workflowId') in ('$E','$C')))") || { echo "RUN CHECK FAILED; NOTHING WRITTEN"; exit 1; }
[ -z "$RUN" ] || { echo "ENGINE OR CHILD RUN LIVE ($RUN); NOTHING WRITTEN"; exit 1; }
mkdir -p atw && node $B/b628.cjs $B/base_eng.json $B/base_child.json atw > atw/build.txt 2>&1 && node /mnt/project-files/ask579/w4/b2/fixhdr579.js $O/atw/target_engine_628.json $O/atw/target_child_628.json >> atw/build.txt 2>&1 && cmp -s atw/target_engine_628.json $B/target_engine_628.json && cmp -s atw/target_child_628.json $B/target_child_628.json || { echo "REBUILD DIFFERS FROM THE GRADED TARGET; NOTHING WRITTEN"; exit 1; }
node $B/t628.cjs $B/base_eng.json $B/base_child.json $B/target_engine_628.json $B/target_child_628.json $B/fx/r42373.json > atw/t628.txt 2>&1; tail -1 atw/t628.txt | grep -q "^ALL PASS" || { echo "T628 FAILED; NOTHING WRITTEN"; exit 1; }
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o prewrite_eng.json || exit 1
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$C -o prewrite_child.json || exit 1
python3 -I - $O $B <<'PY' || { echo "A LIVE NODE IS NOT THE BASE; NOTHING WRITTEN"; exit 1; }
import json,sys
O,B=sys.argv[1],sys.argv[2]
ND=lambda d,n:next(x for x in d['nodes'] if x['name']==n)
ENG=['Shared Library','Build Save Body','D4 Build','D4B Build','Panel Build','Build Independent Verdict']
for k,base,tgt,NMS in [('eng','base_eng.json','target_engine_628.json',ENG),('child','base_child.json','target_child_628.json',['Shared Library'])]:
  a=json.load(open(f'{O}/prewrite_{k}.json'));b=json.load(open(f'{B}/{base}'));T=json.load(open(f'{B}/{tgt}'))
  for nm in NMS: assert json.dumps(ND(a,nm)['parameters'],sort_keys=True)==json.dumps(ND(b,nm)['parameters'],sort_keys=True), (k,nm)
  json.dump({x:a[x] for x in ('name','nodes','connections','settings')},open(f'{O}/revert_{k}_628.json','w'),ensure_ascii=False)
  for nm in NMS: ND(a,nm)['parameters']=ND(T,nm)['parameters']
  json.dump({'name':a['name'],'nodes':a['nodes'],'connections':a['connections'],'settings':a['settings']},open(f'{O}/put_{k}.json','w'),ensure_ascii=False)
PY
node /mnt/project-files/standing/run.cjs $O/put_eng.json $O/put_child.json > atw/standing.txt 2>&1 || { echo "STANDING FAILED; NOTHING WRITTEN"; exit 1; }; tail -1 atw/standing.txt
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/put_eng.json $O/put_child.json | tail -1 | grep -q "Library Check PASSES" || { echo "PAIR CHECK FAILED; NOTHING WRITTEN"; exit 1; }
for k in eng child; do W=$E; [ $k = child ] && W=$C
 code=$(curl -s -o putreply_$k.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H 'Content-Type: application/json' --data-binary @put_$k.json $H/workflows/$W) || code=000
 echo "PUT $k http $code"; [ "$code" = 200 ] || { echo "PUT $k FAILED (engine already written if this is the child; revert_eng_628.json restores it)"; exit 1; }
 curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$W -o fetchback_${k}_628.json; done
python3 -I - $O <<'PY'
import json,sys
O=sys.argv[1]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
for k in ('eng','child'):
  f=json.load(open(f'{O}/fetchback_{k}_628.json'));p=json.load(open(f'{O}/put_{k}.json'));r=json.load(open(f'{O}/revert_{k}_628.json'))
  print(k,f['versionId'],'active',f.get('active'),'nodes',len(f['nodes']),'params equal put',P(f)==P(p),'conn equal',f['connections']==p['connections'],'changed',[x for x in P(f) if P(f)[x]!=P(r).get(x)])
PY
node /mnt/project-files/standing/run.cjs $O/fetchback_eng_628.json $O/fetchback_child_628.json | tail -1
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/fetchback_eng_628.json $O/fetchback_child_628.json | tail -1
node $B/t628.cjs $B/base_eng.json $B/base_child.json $O/fetchback_eng_628.json $O/fetchback_child_628.json $B/fx/r42373.json | tail -1
rm -f put_eng.json put_child.json prewrite_eng.json prewrite_child.json
