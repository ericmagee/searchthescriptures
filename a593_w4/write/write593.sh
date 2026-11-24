#!/bin/bash
# ASK 593 write, engine part: Haiku out of the debate engine in full. Engine then child. The database part (mig593.sql) is applied AFTER this
# script succeeds: with haiku inactive in model_config but still in Accept Build's ORDER, every run would stop at Accept Build.
# Works on either live base: 9bec145c / 2d5bdc94 (before ASK 590), or the ASK 590 write (its node text must equal the 590 targets).
# The API key is read from the environment (N8N_API_KEY); no key is held in this file.
set -u
: "${N8N_API_KEY:?N8N_API_KEY not set; NOTHING WRITTEN}"
H=https://truthapp.app.n8n.cloud/api/v1; B=/mnt/project-files/ask593/w4/build; O=/mnt/project-files/ask593/w4/write; A=/mnt/project-files/ask590/w4/build
E=moMxiV4Irg1uRBZN; C=MqQHRl7mQQ0z8QdT
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o $O/prewrite_eng593.json || exit 1
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$C -o $O/prewrite_child593.json || exit 1
python3 -I - $O $B $A <<'PY' || { echo "PREP FAILED; NOTHING WRITTEN"; exit 1; }
import json,sys
O,B,A=sys.argv[1:4]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
bases=[('live 9bec145c/2d5bdc94',f'{B}/base_eng.json',f'{B}/base_child.json',f'{B}/target_engine_593.json',f'{B}/target_child_593.json'),
       ('the ASK 590 write',f'{A}/target_engine_590s.json',f'{A}/target_child_590s.json',f'{B}/target_engine_593_on590.json',f'{B}/target_child_593_on590.json')]
pe=json.load(open(f'{O}/prewrite_eng593.json'));pc=json.load(open(f'{O}/prewrite_child593.json'))
hit=None
for name,be,bc,te,tc in bases:
  BE=json.load(open(be));BC=json.load(open(bc))
  if P(pe)==P(BE) and pe['connections']==BE['connections'] and P(pc)==P(BC) and pc['connections']==BC['connections']:hit=(name,te,tc);break
assert hit,'the live engine and child match neither build base; NOTHING WRITTEN'
print('base:',hit[0],'| live versions',pe['versionId'],pc['versionId'])
for kind,pre,tgt in (('eng',pe,hit[1]),('child',pc,hit[2])):
  T=json.load(open(tgt))
  json.dump({k:pre[k] for k in ('name','nodes','connections','settings')},open(f'{O}/revert_{kind}593.json','w'),ensure_ascii=False)
  json.dump({'name':pre['name'],'nodes':T['nodes'],'connections':T['connections'],'settings':pre['settings']},open(f'{O}/put_{kind}593.json','w'),ensure_ascii=False)
  json.dump({'target':tgt},open(f'{O}/target_{kind}593.json','w'))
  pt,pp=P(T),P(pre);print(kind,'put nodes',len(T['nodes']),'changed',sorted(n for n in pt if pt[n]!=pp.get(n)))
PY
( cd $B && node t593.cjs > $O/t593_at_write.txt 2>&1 ) && grep -q 'ALL PASS' $O/t593_at_write.txt || { echo "t593 FAILED; NOTHING WRITTEN"; exit 1; }
grep RESULT $O/t593_at_write.txt
TE=$(python3 -c "import json;print(json.load(open('$O/target_eng593.json'))['target'])"); TC=$(python3 -c "import json;print(json.load(open('$O/target_child593.json'))['target'])")
node /mnt/project-files/ask557/w4/build/test557.js --pair $TE $TC | tail -1 | grep -q PASSES || { echo "PAIR FAILED; NOTHING WRITTEN"; exit 1; }
for kind in eng child; do W=$E; [ $kind = child ] && W=$C
  code=$(curl -s -o $O/putreply_${kind}593.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H 'Content-Type: application/json' --data-binary @$O/put_${kind}593.json $H/workflows/$W) || code=000
  echo "PUT $kind http $code"; [ "$code" = 200 ] || { echo "PUT $kind FAILED; STOP (engine written: $([ $kind = child ] && echo yes || echo no))"; exit 1; }
  curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$W -o $O/fetchback_${kind}593.json
done
python3 -I - $O $TE $TC <<'PY'
import json,sys
O,TE,TC=sys.argv[1:4]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
for kind,tgt in (('eng',TE),('child',TC)):
  f=json.load(open(f'{O}/fetchback_{kind}593.json'));T=json.load(open(tgt));r=json.load(open(f'{O}/revert_{kind}593.json'))
  print(kind,'fetchback version',f['versionId'],'active',f.get('active'),'nodes',len(f['nodes']),'| params equal target:',P(f)==P(T),'| connections equal target:',f['connections']==T['connections'],'| settings equal:',f.get('settings')==r.get('settings'))
  print(' changed from revert:',sorted(n for n in P(f) if P(f)[n]!=P(r).get(n)))
PY
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/fetchback_eng593.json $O/fetchback_child593.json | tail -1
