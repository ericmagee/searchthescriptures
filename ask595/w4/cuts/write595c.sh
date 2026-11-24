#!/bin/bash
# ASK 595 follow-on write (option A, 01:58 CST): QR DROPPED replies stored whole; reversed-close quotations shown whole; mlsBlock whole.
# Base: live engine 04273989 (J6), child c9acb53a. Key from the environment only. Refuses while any engine or child execution is running.
set -u
: "${N8N_API_KEY:?N8N_API_KEY not set; NOTHING WRITTEN}"
H=https://truthapp.app.n8n.cloud/api/v1; B=/mnt/project-files/ask595/w4/cuts; O=$B/write; F=/mnt/project-files/ask586/w4/j6recut
E=moMxiV4Irg1uRBZN; C=MqQHRl7mQQ0z8QdT; VE=04273989-a679-4315-9b40-c84d5260dbce; VC=c9acb53a-ddcc-4ccc-9149-900f6e9e140a
RUN=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/executions?status=running&limit=100" | python3 -I -c "import json,sys;d=json.load(sys.stdin).get('data') or [];print(' '.join(x['id'] for x in d if x.get('workflowId') in ('$E','$C')))") || { echo "RUN CHECK FAILED; NOTHING WRITTEN"; exit 1; }
[ -z "$RUN" ] || { echo "ENGINE OR CHILD RUN LIVE ($RUN); NOTHING WRITTEN"; exit 1; }
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o $O/prewrite_eng595c.json || exit 1
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$C -o $O/prewrite_child595c.json || exit 1
python3 -I - $O $B $F $VE $VC <<'PY' || { echo "PREP FAILED; NOTHING WRITTEN"; exit 1; }
import json,sys
O,B,F,VE,VC=sys.argv[1:6]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
for kind,v,base,tgt in (('eng',VE,f'{F}/fetchback_eng586j6.json','target_engine_cuts.json'),('child',VC,f'{F}/fetchback_child586j6.json','target_child_cuts.json')):
  pre=json.load(open(f'{O}/prewrite_{kind}595c.json'));assert pre['versionId']==v,f'{kind} live version {pre["versionId"]} is not the base {v}'
  L=json.load(open(base));T=json.load(open(f'{B}/{tgt}'))
  assert P(pre)==P(L) and pre['connections']==L['connections'],f'{kind}: the fresh fetch differs from the build base'
  json.dump({k:pre[k] for k in ('name','nodes','connections','settings')},open(f'{O}/revert_{kind}595c.json','w'),ensure_ascii=False)
  json.dump({'name':pre['name'],'nodes':T['nodes'],'connections':T['connections'],'settings':pre['settings']},open(f'{O}/put_{kind}595c.json','w'),ensure_ascii=False)
  pt,pp=P(T),P(pre);print(kind,'put nodes',len(T['nodes']),'changed',sorted(n for n in pt if pt[n]!=pp.get(n)))
PY
( cd $B && node tcuts.cjs > $O/tcuts_at_write.txt 2>&1 ) && tail -1 $O/tcuts_at_write.txt | grep -q 'ALL PASS' || { echo "tcuts FAILED; NOTHING WRITTEN"; exit 1; }; echo "tcuts $(tail -1 $O/tcuts_at_write.txt)"
node /mnt/project-files/ask557/w4/build/test557.js --pair $B/target_engine_cuts.json $B/target_child_cuts.json | tail -1 | grep -q PASSES || { echo "PAIR FAILED; NOTHING WRITTEN"; exit 1; }
for kind in eng child; do W=$E; [ $kind = child ] && W=$C
  code=$(curl -s -o $O/putreply_${kind}595c.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H 'Content-Type: application/json' --data-binary @$O/put_${kind}595c.json $H/workflows/$W) || code=000
  echo "PUT $kind http $code"; [ "$code" = 200 ] || { echo "PUT $kind FAILED; STOP (engine written: $([ $kind = child ] && echo yes || echo no))"; exit 1; }
  curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$W -o $O/fetchback_${kind}595c.json
done
python3 -I - $O $B <<'PY'
import json,sys
O,B=sys.argv[1:3]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
for kind,tgt in (('eng','target_engine_cuts.json'),('child','target_child_cuts.json')):
  f=json.load(open(f'{O}/fetchback_{kind}595c.json'));T=json.load(open(f'{B}/{tgt}'));r=json.load(open(f'{O}/revert_{kind}595c.json'))
  print(kind,'fetchback version',f['versionId'],'active',f.get('active'),'nodes',len(f['nodes']),'| params equal target:',P(f)==P(T),'| connections equal target:',f['connections']==T['connections'],'| settings equal:',f.get('settings')==r.get('settings'))
  print(' changed from revert:',sorted(n for n in P(f) if P(f)[n]!=P(r).get(n)))
PY
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/fetchback_eng595c.json $O/fetchback_child595c.json | tail -1
# storage (ASK 600): the put body and the pre-write fetch are not kept; the revert copy holds the pre-write workflow.
rm -f $O/put_eng595c.json $O/put_child595c.json $O/prewrite_eng595c.json $O/prewrite_child595c.json
