#!/bin/bash
# ASK 611 write (W4): stop four extra copies of the debate in the judging (engine + child Library mirror).
# Base: live engine ff7ab4cf / child ecdc6218 (fetch-backs in ask601/w4/b1). Refuses while any engine or child run is live, or when live is not the base
# (if ASK 601 is written first, re-cut with B611E/B611C and run again).
set -u
: "${N8N_API_KEY:?N8N_API_KEY not set; NOTHING WRITTEN}"
H=https://truthapp.app.n8n.cloud/api/v1; B=/mnt/project-files/ask611/w4/b1; O=/mnt/project-files/ask611/w4/write
BE=/mnt/project-files/ask601/w4/b1/base_eng.json; BC=/mnt/project-files/ask601/w4/b1/base_child.json; TE=$B/target_engine_611.json; TC=$B/target_child_611.json
E=moMxiV4Irg1uRBZN; C=MqQHRl7mQQ0z8QdT
RUN=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/executions?status=running&limit=100" | python3 -I -c "import json,sys;d=json.load(sys.stdin).get('data') or [];print(' '.join(x['id'] for x in d if x.get('workflowId') in ('$E','$C')))") || { echo "RUN CHECK FAILED; NOTHING WRITTEN"; exit 1; }
[ -z "$RUN" ] || { echo "ENGINE OR CHILD RUN LIVE ($RUN); NOTHING WRITTEN"; exit 1; }
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o $O/prewrite_eng611.json || exit 1
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$C -o $O/prewrite_child611.json || exit 1
python3 -I - $O $BE $BC <<'PY' || { echo "LIVE IS NOT THE BASE (ff7ab4cf / ecdc6218); NOTHING WRITTEN"; exit 1; }
import json,sys
O,BE,BC=sys.argv[1:4]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
for kind,b in (('eng',BE),('child',BC)):
  pre=json.load(open(f'{O}/prewrite_{kind}611.json'));bb=json.load(open(b))
  assert P(pre)==P(bb) and pre['connections']==bb['connections'],kind
PY
( cd $B && node t611.cjs > $O/t611_at_write.txt 2>&1 ); tail -1 $O/t611_at_write.txt | grep -q 'T1 ALL PASS' || { echo "t611 FAILED; NOTHING WRITTEN"; exit 1; }; echo "t611 $(tail -1 $O/t611_at_write.txt)"
node /mnt/project-files/standing/run.cjs $TE $TC > $O/standing_at_write.txt 2>&1 || { echo "STANDING SET FAILED; NOTHING WRITTEN"; exit 1; }; tail -1 $O/standing_at_write.txt
node /mnt/project-files/ask557/w4/build/test557.js --pair $TE $TC | tail -1 | grep -q PASSES || { echo "PAIR FAILED; NOTHING WRITTEN"; exit 1; }
python3 -I - $O $TE $TC <<'PY' || { echo "PREP FAILED; NOTHING WRITTEN"; exit 1; }
import json,sys
O,TE,TC=sys.argv[1:4]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
for kind,tgt in (('eng',TE),('child',TC)):
  pre=json.load(open(f'{O}/prewrite_{kind}611.json'));T=json.load(open(tgt))
  json.dump({k:pre[k] for k in ('name','nodes','connections','settings')},open(f'{O}/revert_{kind}611.json','w'),ensure_ascii=False)
  json.dump({'name':pre['name'],'nodes':T['nodes'],'connections':T['connections'],'settings':pre['settings']},open(f'{O}/put_{kind}611.json','w'),ensure_ascii=False)
  pt,pp=P(T),P(pre);print(kind,'put nodes',len(T['nodes']),'changed',sorted(n for n in pt if pt[n]!=pp.get(n)))
PY
for kind in eng child; do W=$E; [ $kind = child ] && W=$C
  code=$(curl -s -o $O/putreply_${kind}611.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H 'Content-Type: application/json' --data-binary @$O/put_${kind}611.json $H/workflows/$W) || code=000
  echo "PUT $kind http $code"; [ "$code" = 200 ] || { echo "PUT $kind FAILED; STOP (engine written: $([ $kind = child ] && echo yes || echo no))"; exit 1; }
  curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$W -o $O/fetchback_${kind}611.json
done
python3 -I - $O $TE $TC <<'PY'
import json,sys
O,TE,TC=sys.argv[1:4]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
for kind,tgt in (('eng',TE),('child',TC)):
  f=json.load(open(f'{O}/fetchback_{kind}611.json'));T=json.load(open(tgt));r=json.load(open(f'{O}/revert_{kind}611.json'))
  print(kind,'fetchback version',f['versionId'],'active',f.get('active'),'nodes',len(f['nodes']),'| params equal target:',P(f)==P(T),'| connections equal target:',f['connections']==T['connections'],'| settings equal:',f.get('settings')==r.get('settings'))
  print(' changed from revert:',sorted(n for n in P(f) if P(f)[n]!=P(r).get(n)))
PY
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/fetchback_eng611.json $O/fetchback_child611.json | tail -1
rm -f $O/put_eng611.json $O/put_child611.json $O/prewrite_eng611.json $O/prewrite_child611.json
