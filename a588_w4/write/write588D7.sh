#!/bin/bash
# ASK 588 D7 write: the continuation pass. Engine only, after the 588 write, on the press of the D7 card in W4's thread.
# Base: the live engine after the 588 write (its parameters and connections must equal target_engine_588.json). VE is set to the version the 588 write produced.
# The API key is read from the environment (N8N_API_KEY); no key is held in this file.
set -u
: "${N8N_API_KEY:?N8N_API_KEY not set; NOTHING WRITTEN}"
H=https://truthapp.app.n8n.cloud/api/v1; B=/mnt/project-files/ask588/w4/build; O=/mnt/project-files/ask588/w4/write
E=moMxiV4Irg1uRBZN; C=MqQHRl7mQQ0z8QdT; VE=${VE:?set VE to the engine version id the 588 write produced}; VC=none
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o $O/prewriteD7_eng588.json || exit 1
python3 -I - $O $B $VE $VC <<'PY' || { echo "PREP FAILED; NOTHING WRITTEN"; exit 1; }
import json,sys
O,B,VE,VC=sys.argv[1:5]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
for kind,v,base,tgt in (('eng',VE,'target_engine_588.json','target_engine_588f.json'),):
  pre=json.load(open(f'{O}/prewriteD7_{kind}588.json'));assert pre['versionId']==v,f'{kind} live version {pre["versionId"]} is not the base {v}'
  L=json.load(open(f'{B}/{base}'));T=json.load(open(f'{B}/{tgt}'))
  assert P(pre)==P(L),f'{kind}: the fresh fetch differs from the build base'
  assert pre['connections']==L['connections'],f'{kind}: connections differ from the build base'
  json.dump({k:pre[k] for k in ('name','nodes','connections','settings')},open(f'{O}/revertD7_{kind}588.json','w'),ensure_ascii=False)
  json.dump({'name':pre['name'],'nodes':T['nodes'],'connections':T['connections'],'settings':pre['settings']},open(f'{O}/putD7_{kind}588.json','w'),ensure_ascii=False)
  pt,pp=P(T),P(pre);print(kind,'put nodes',len(T['nodes']),'changed',sum(1 for n in pt if pt[n]!=pp.get(n)))
PY
( cd $B && node t588f.cjs > $O/t588f_at_write.txt 2>&1 ) || { echo "t588f FAILED; NOTHING WRITTEN"; tail -3 $O/t588f_at_write.txt; exit 1; }
tail -1 $O/t588f_at_write.txt
for kind in eng; do W=$E; [ $kind = child ] && W=$C
  code=$(curl -s -o $O/putreplyD7_${kind}588.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H 'Content-Type: application/json' --data-binary @$O/putD7_${kind}588.json $H/workflows/$W) || code=000
  echo "PUT $kind http $code"; [ "$code" = 200 ] || { echo "PUT $kind FAILED; STOP (engine written: $([ $kind = child ] && echo yes || echo no))"; exit 1; }
  curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$W -o $O/fetchbackD7_${kind}588.json
done
python3 -I - $O $B <<'PY'
import json,sys
O,B=sys.argv[1:3]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
for kind,tgt in (('eng','target_engine_588f.json'),):
  f=json.load(open(f'{O}/fetchbackD7_{kind}588.json'));T=json.load(open(f'{B}/{tgt}'));r=json.load(open(f'{O}/revertD7_{kind}588.json'))
  print(kind,'fetchback version',f['versionId'],'active',f.get('active'),'nodes',len(f['nodes']),'| params equal target:',P(f)==P(T),'| connections equal target:',f['connections']==T['connections'],'| settings equal:',f.get('settings')==r.get('settings'))
  print(' added:',sorted(set(P(f))-set(P(r))),'removed:',sorted(set(P(r))-set(P(f))))
PY
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/fetchbackD7_eng588.json $B/target_child_588.json | tail -1
