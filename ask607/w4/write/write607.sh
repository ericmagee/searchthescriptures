#!/bin/bash
# ASK 607 write: the Shared Library of the engine, then of the child (one LIB line: rfs 'pkgFRM' on the sbApply2024 form refusal). No other node changes.
# Takes each workflow as it is live and replaces only its Shared Library, so it holds whether or not ASK 623 was written first.
# Refuses while any engine or child execution runs, when a live Shared Library is not the 94b682a0 / b9cd4e5c one (LIB 802077b0878612c9), or when C1 to C3 or the standing set fail.
set -u
: "${N8N_API_KEY:?N8N_API_KEY not set; NOTHING WRITTEN}"
H=https://truthapp.app.n8n.cloud/api/v1; O=/mnt/project-files/ask607/w4/write; B=/mnt/project-files/ask607/w4/b1; E=moMxiV4Irg1uRBZN; C=MqQHRl7mQQ0z8QdT
RUN=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/executions?status=running&limit=100" | python3 -I -c "import json,sys;d=json.load(sys.stdin).get('data') or [];print(' '.join(x['id'] for x in d if x.get('workflowId') in ('$E','$C')))") || { echo "RUN CHECK FAILED; NOTHING WRITTEN"; exit 1; }
[ -z "$RUN" ] || { echo "ENGINE OR CHILD RUN LIVE ($RUN); NOTHING WRITTEN"; exit 1; }
( cd $B && node build607.cjs >/dev/null && node c1_607.cjs > $O/c1_at_write.txt 2>&1 && node c2_607.cjs > $O/c2_at_write.txt 2>&1 && node c3_607.cjs > $O/c3_at_write.txt 2>&1 ) || { echo "BUILD OR C1 TO C3 FAILED; NOTHING WRITTEN"; exit 1; }
for f in c1 c2 c3; do tail -1 $O/${f}_at_write.txt | grep -q "ALL PASS" || { echo "$f FAILED; NOTHING WRITTEN"; exit 1; }; done
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o $O/prewrite_eng.json || exit 1
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$C -o $O/prewrite_child.json || exit 1
python3 -I - $O $B <<'PY' || { echo "LIVE SHARED LIBRARY IS NOT THE BASE; NOTHING WRITTEN"; exit 1; }
import json,sys
O,B=sys.argv[1],sys.argv[2]
SL=lambda d:next(n for n in d['nodes'] if n['name']=='Shared Library')
for k,base,tgt in [('eng','base_moMxiV4Irg1uRBZN.json','target_engine_607.json'),('child','base_MqQHRl7mQQ0z8QdT.json','target_child_607.json')]:
  a=json.load(open(f'{O}/prewrite_{k}.json'));b=json.load(open(f'{B}/{base}'));T=json.load(open(f'{B}/{tgt}'))
  assert json.dumps(SL(a)['parameters'],sort_keys=True)==json.dumps(SL(b)['parameters'],sort_keys=True), k
  json.dump({x:a[x] for x in ('name','nodes','connections','settings')},open(f'{O}/revert_{k}_607.json','w'),ensure_ascii=False)
  for n in a['nodes']:
    if n['name']=='Shared Library': n['parameters']=SL(T)['parameters']
  json.dump({'name':a['name'],'nodes':a['nodes'],'connections':a['connections'],'settings':a['settings']},open(f'{O}/put_{k}.json','w'),ensure_ascii=False)
PY
node /mnt/project-files/standing/run.cjs $O/put_eng.json $O/put_child.json > $O/standing_at_write.txt 2>&1 || { echo "STANDING FAILED; NOTHING WRITTEN"; exit 1; }; tail -1 $O/standing_at_write.txt
for k in eng child; do W=$E; [ $k = child ] && W=$C
 code=$(curl -s -o $O/putreply_$k.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H 'Content-Type: application/json' --data-binary @$O/put_$k.json $H/workflows/$W) || code=000
 echo "PUT $k http $code"; [ "$code" = 200 ] || { echo "PUT $k FAILED (engine already written if this is the child: run the pair check and revert or finish)"; exit 1; }
 curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$W -o $O/fetchback_${k}_607.json; done
python3 -I - $O <<'PY'
import json,sys
O=sys.argv[1]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
for k in ('eng','child'):
  f=json.load(open(f'{O}/fetchback_{k}_607.json'));p=json.load(open(f'{O}/put_{k}.json'));r=json.load(open(f'{O}/revert_{k}_607.json'))
  print(k,f['versionId'],'active',f.get('active'),'nodes',len(f['nodes']),'params equal put',P(f)==P(p),'conn equal',f['connections']==p['connections'],'changed',[x for x in P(f) if P(f)[x]!=P(r).get(x)])
PY
node /mnt/project-files/standing/run.cjs $O/fetchback_eng_607.json $O/fetchback_child_607.json | tail -1
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/fetchback_eng_607.json $O/fetchback_child_607.json | tail -1
rm -f $O/put_eng.json $O/put_child.json $O/prewrite_eng.json $O/prewrite_child.json
