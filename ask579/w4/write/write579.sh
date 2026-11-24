#!/bin/bash
# ASK 579 write: the engine (nine B/G Extract nodes take their served text from the Shared Library; the Shared Library gains 270 lines and nine MAP entries), then the child (Shared Library only, the same LIB).
# Takes each workflow as it is live and replaces only those nodes. Refuses while any engine or child execution runs, when any of those nodes differs from the 20db58ee / 74353c40 base,
# or when the rebuild, C6 replay (9 of 9), pair check or standing set fail.
set -u
: "${N8N_API_KEY:?N8N_API_KEY not set; NOTHING WRITTEN}"
H=https://truthapp.app.n8n.cloud/api/v1; O=/mnt/project-files/ask579/w4/write; B=/mnt/project-files/ask579/w4/b2; E=moMxiV4Irg1uRBZN; C=MqQHRl7mQQ0z8QdT
RUN=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/executions?status=running&limit=100" | python3 -I -c "import json,sys;d=json.load(sys.stdin).get('data') or [];print(' '.join(x['id'] for x in d if x.get('workflowId') in ('$E','$C')))") || { echo "RUN CHECK FAILED; NOTHING WRITTEN"; exit 1; }
[ -z "$RUN" ] || { echo "ENGINE OR CHILD RUN LIVE ($RUN); NOTHING WRITTEN"; exit 1; }
( cd $B && NODE_PATH=/mnt/project-files/ask579/w4/build/node_modules node t579.js base_eng_579.json base_child_579.json $O > $O/t579_at_write.txt 2>&1 && node fixhdr579.js $O/target_engine_579.json $O/target_child_579.json > $O/hdr_at_write.txt 2>&1 ) || { echo "REBUILD FAILED; NOTHING WRITTEN"; exit 1; }
tail -1 $O/t579_at_write.txt | grep -q "ALL PASS" && tail -1 $O/hdr_at_write.txt | grep -q "ALL PASS" || { echo "REBUILD CHECKS FAILED; NOTHING WRITTEN"; exit 1; }
cmp -s $O/target_engine_579.json $B/target_engine_579.json && cmp -s $O/target_child_579.json $B/target_child_579.json || { echo "REBUILD DIFFERS FROM THE GRADED TARGET; NOTHING WRITTEN"; exit 1; }
node /mnt/project-files/ask579/w4/c6/c6_579.cjs $O/target_engine_579.json /mnt/project-files/ask579/w4/c6/in42071/rundata_42071.json > $O/c6_at_write.txt 2>&1; tail -1 $O/c6_at_write.txt | grep -q "^9 of 9 equal" || { echo "C6 REPLAY FAILED; NOTHING WRITTEN"; exit 1; }
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o $O/prewrite_eng.json || exit 1
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$C -o $O/prewrite_child.json || exit 1
python3 -I - $O $B <<'PY' || { echo "LIVE NODES ARE NOT THE BASE; NOTHING WRITTEN"; exit 1; }
import json,sys
O,B=sys.argv[1],sys.argv[2]
X=['Shared Library']+[s+' Extract' for s in ('C1B','D2B','C2B','D3B','C3G','C3B','D4B','C4G','C4B')]
for k,base,tgt,names in [('eng','base_eng_579.json','target_engine_579.json',X),('child','base_child_579.json','target_child_579.json',['Shared Library'])]:
  a=json.load(open(f'{O}/prewrite_{k}.json'));b=json.load(open(f'{B}/{base}'));T=json.load(open(f'{O}/{tgt}'))
  G=lambda d,n:json.dumps(next(x for x in d['nodes'] if x['name']==n)['parameters'],sort_keys=True)
  for n in names: assert G(a,n)==G(b,n), (k,n)
  json.dump({x:a[x] for x in ('name','nodes','connections','settings')},open(f'{O}/revert_{k}_579.json','w'),ensure_ascii=False)
  for n in a['nodes']:
    if n['name'] in names: n['parameters']=next(x for x in T['nodes'] if x['name']==n['name'])['parameters']
  json.dump({'name':a['name'],'nodes':a['nodes'],'connections':a['connections'],'settings':a['settings']},open(f'{O}/put_{k}.json','w'),ensure_ascii=False)
PY
node /mnt/project-files/standing/run.cjs $O/put_eng.json $O/put_child.json > $O/standing_at_write.txt 2>&1 || { echo "STANDING FAILED; NOTHING WRITTEN"; exit 1; }; tail -1 $O/standing_at_write.txt
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/put_eng.json $O/put_child.json | tail -1 | grep -q "Library Check PASSES" || { echo "PAIR CHECK FAILED; NOTHING WRITTEN"; exit 1; }
for k in eng child; do W=$E; [ $k = child ] && W=$C
 code=$(curl -s -o $O/putreply_$k.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H 'Content-Type: application/json' --data-binary @$O/put_$k.json $H/workflows/$W) || code=000
 echo "PUT $k http $code"; [ "$code" = 200 ] || { echo "PUT $k FAILED (engine already written if this is the child: the pair check fails until the child is written or the engine reverted)"; exit 1; }
 curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$W -o $O/fetchback_${k}_579.json; done
python3 -I - $O <<'PY'
import json,sys
O=sys.argv[1]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
for k in ('eng','child'):
  f=json.load(open(f'{O}/fetchback_{k}_579.json'));p=json.load(open(f'{O}/put_{k}.json'));r=json.load(open(f'{O}/revert_{k}_579.json'))
  print(k,f['versionId'],'active',f.get('active'),'nodes',len(f['nodes']),'params equal put',P(f)==P(p),'conn equal',f['connections']==p['connections'],'changed',[x for x in P(f) if P(f)[x]!=P(r).get(x)])
PY
node /mnt/project-files/standing/run.cjs $O/fetchback_eng_579.json $O/fetchback_child_579.json | tail -1
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/fetchback_eng_579.json $O/fetchback_child_579.json | tail -1
node /mnt/project-files/ask579/w4/c6/c6_579.cjs $O/fetchback_eng_579.json /mnt/project-files/ask579/w4/c6/in42071/rundata_42071.json | tail -1
rm -f $O/put_eng.json $O/put_child.json $O/prewrite_eng.json $O/prewrite_child.json
