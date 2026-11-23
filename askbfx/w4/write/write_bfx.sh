#!/bin/bash
# pkgBFX write (engine + child Shared Library): only on the operator's card press in W4's thread. Usage: write_bfx.sh <engine versionId> <child versionId>
# Bodies are built at write time from fresh fetches by W1's graded patch_bfx.cjs (1a1c26b7; it asserts the Library text). The pre-write fetches are the revert copies.
set -e; cd /mnt/project-files/askbfx/w4/write/
H="https://truthapp.app.n8n.cloud/api/v1/workflows"; P=/mnt/project-files/askbfx/w1/build/patch_bfx.cjs
[ -n "$2" ] || { echo "need engine and child versions"; exit 1; }
[ "$(md5sum $P | cut -c1-8)" = "1a1c26b7" ] || { echo "patch_bfx.cjs is not the graded copy; stop before any PUT"; exit 1; }
for K in engine:moMxiV4Irg1uRBZN:$1 child:MqQHRl7mQQ0z8QdT:$2; do IFS=: read k W EV <<<"$K"
 curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/$W" -o prewrite_$k.json
 cur=$(python3 -c 'import json,sys;print(json.load(open(sys.argv[1]))["versionId"])' prewrite_$k.json); [ "$cur" = "$EV" ] || { echo "MOVED before any PUT: $W $cur"; exit 1; }
 python3 -c 'import json,sys;d=json.load(open(sys.argv[1]));json.dump({k:d[k] for k in ["name","nodes","connections","settings"]},open(sys.argv[2],"w"),ensure_ascii=False)' prewrite_$k.json revert_$k.json
 node $P prewrite_$k.json target_$k.json $k
 python3 - prewrite_$k.json target_$k.json put_$k.json <<'PY'
import json,sys
a=json.load(open(sys.argv[1]));b=json.load(open(sys.argv[2]))
A={n['name']:n for n in a['nodes']};Bn={n['name']:n for n in b['nodes']}
d=sorted(k for k in Bn if json.dumps(A.get(k),sort_keys=True)!=json.dumps(Bn[k],sort_keys=True))
assert d==['Shared Library'] and set(A)==set(Bn) and a['connections']==b['connections'] and a.get('settings')==b.get('settings'),d
json.dump({k:b[k] for k in ['name','nodes','connections','settings']},open(sys.argv[3],'w'),ensure_ascii=False);print('body: only',d,'differ')
PY
done
node /mnt/project-files/ask539/w4/build/test539.js --pair "$PWD/target_engine.json" "$PWD/target_child.json" | grep -q "Library Check PASSES" || { echo "pair check fails before PUT"; exit 1; }
for K in engine:moMxiV4Irg1uRBZN child:MqQHRl7mQQ0z8QdT; do IFS=: read k W <<<"$K"
 code=$(curl -s -o putreply_$k.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H "Content-Type: application/json" --data-binary @put_$k.json "$H/$W"); echo "PUT $k HTTP $code"; [ "$code" = 200 ] || { echo "PUT $k failed; stop"; exit 1; }
 curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/$W" -o fetchback_${k}_bfx.json
 python3 - put_$k.json fetchback_${k}_bfx.json <<'PY'
import json,sys
t=json.load(open(sys.argv[1]));f=json.load(open(sys.argv[2]))
T={n['name']:n['parameters'] for n in t['nodes']};F={n['name']:n['parameters'] for n in f['nodes']}
bad=[k for k in set(T)|set(F) if json.dumps(T.get(k),sort_keys=True)!=json.dumps(F.get(k),sort_keys=True)]
print(f['name'],'version',f['versionId'],'active',f.get('active'),'param mismatches',bad);sys.exit(1 if bad else 0)
PY
 node /mnt/project-files/ask519/w4/libcheck/runcheck.js fetchback_${k}_bfx.json
done
node /mnt/project-files/ask539/w4/build/test539.js --pair "$PWD/fetchback_engine_bfx.json" "$PWD/fetchback_child_bfx.json"
