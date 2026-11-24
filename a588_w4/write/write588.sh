#!/bin/bash
# ASK 588 write: the question round live. Engine then child, one write, on the press of the card in W4's thread.
# Bases: engine 7536d7bf-06ad-44b1-b852-aaab6388ee2c, child a7113b8d-3379-48ce-944c-a40f6f4eb5c9. Revert restores both together.
# The API key is read from the environment (N8N_API_KEY); no key is held in this file.
set -u
: "${N8N_API_KEY:?N8N_API_KEY not set; NOTHING WRITTEN}"
H=https://truthapp.app.n8n.cloud/api/v1; B=/mnt/project-files/ask588/w4/build; O=/mnt/project-files/ask588/w4/write
E=moMxiV4Irg1uRBZN; C=MqQHRl7mQQ0z8QdT; VE=7536d7bf-06ad-44b1-b852-aaab6388ee2c; VC=a7113b8d-3379-48ce-944c-a40f6f4eb5c9
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o $O/prewrite_eng588.json || exit 1
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$C -o $O/prewrite_child588.json || exit 1
python3 -I - $O $B $VE $VC <<'PY' || { echo "PREP FAILED; NOTHING WRITTEN"; exit 1; }
import json,sys
O,B,VE,VC=sys.argv[1:5]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
for kind,v,base,tgt in (('eng',VE,'base_eng.json','target_engine_588.json'),('child',VC,'base_child.json','target_child_588.json')):
  pre=json.load(open(f'{O}/prewrite_{kind}588.json'));assert pre['versionId']==v,f'{kind} live version {pre["versionId"]} is not the base {v}'
  L=json.load(open(f'{B}/{base}'));T=json.load(open(f'{B}/{tgt}'))
  assert P(pre)==P(L),f'{kind}: the fresh fetch differs from the build base'
  assert pre['connections']==L['connections'],f'{kind}: connections differ from the build base'
  json.dump({k:pre[k] for k in ('name','nodes','connections','settings')},open(f'{O}/revert_{kind}588.json','w'),ensure_ascii=False)
  json.dump({'name':pre['name'],'nodes':T['nodes'],'connections':T['connections'],'settings':pre['settings']},open(f'{O}/put_{kind}588.json','w'),ensure_ascii=False)
  pt,pp=P(T),P(pre);print(kind,'put nodes',len(T['nodes']),'changed',sum(1 for n in pt if pt[n]!=pp.get(n)))
PY
( cd $B && node t588.cjs > $O/t588_at_write.txt 2>&1 ) || { echo "t588 FAILED; NOTHING WRITTEN"; tail -3 $O/t588_at_write.txt; exit 1; }
tail -1 $O/t588_at_write.txt
for kind in eng child; do W=$E; [ $kind = child ] && W=$C
  code=$(curl -s -o $O/putreply_${kind}588.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H 'Content-Type: application/json' --data-binary @$O/put_${kind}588.json $H/workflows/$W) || code=000
  echo "PUT $kind http $code"; [ "$code" = 200 ] || { echo "PUT $kind FAILED; STOP (engine written: $([ $kind = child ] && echo yes || echo no))"; exit 1; }
  curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$W -o $O/fetchback_${kind}588.json
done
python3 -I - $O $B <<'PY'
import json,sys
O,B=sys.argv[1:3]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
for kind,tgt in (('eng','target_engine_588.json'),('child','target_child_588.json')):
  f=json.load(open(f'{O}/fetchback_{kind}588.json'));T=json.load(open(f'{B}/{tgt}'));r=json.load(open(f'{O}/revert_{kind}588.json'))
  print(kind,'fetchback version',f['versionId'],'active',f.get('active'),'nodes',len(f['nodes']),'| params equal target:',P(f)==P(T),'| connections equal target:',f['connections']==T['connections'],'| settings equal:',f.get('settings')==r.get('settings'))
  print(' added:',sorted(set(P(f))-set(P(r))),'removed:',sorted(set(P(r))-set(P(f))))
PY
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/fetchback_eng588.json $O/fetchback_child588.json | tail -1
