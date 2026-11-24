#!/bin/bash
# ASK 571 write (engine then child) on the operator press of W4 card: the L2C consolidation, built at write time from the fresh pre-write fetch.
# Usage: bash write571.sh <engine versionId> <child versionId>
set -e; WD=/mnt/project-files/ask571/w4/write; EV="$1"; CV="$2"; B=/mnt/project-files/ask571/w4/build; TEST="node $B/test571.js"; cd "$WD"
H="https://truthapp.app.n8n.cloud/api/v1/workflows"; P=/mnt/project-files/fairjudge/w4build/patch_lib.js
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/moMxiV4Irg1uRBZN" -o prewrite_engine.json
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/MqQHRl7mQQ0z8QdT" -o prewrite_child.json
ce=$(python3 -c 'import json,sys;print(json.load(open(sys.argv[1]))["versionId"])' prewrite_engine.json); cc=$(python3 -c 'import json,sys;print(json.load(open(sys.argv[1]))["versionId"])' prewrite_child.json)
[ "$ce" = "$EV" ] && [ "$cc" = "$CV" ] || { echo "MOVED before any PUT: engine $ce child $cc"; exit 1; }
for w in engine child; do python3 -c 'import json,sys;d=json.load(open(sys.argv[1]));json.dump({k:d[k] for k in ["name","nodes","connections","settings"]},open(sys.argv[2],"w"),ensure_ascii=False)' prewrite_$w.json revert_$w.json; done
node $B/build571.js $PWD/prewrite_engine.json $PWD/prewrite_child.json $PWD/put_full_engine.json $PWD/put_full_child.json > patchlog.txt
for w in engine child; do python3 -c 'import json,sys;d=json.load(open(sys.argv[1]));json.dump({k:d[k] for k in ["name","nodes","connections","settings"]},open(sys.argv[2],"w"),ensure_ascii=False)' put_full_$w.json put_$w.json; done
node /mnt/project-files/ask557/w4/build/test557.js --pair $PWD/put_full_engine.json $PWD/put_full_child.json || { echo "pair check fails before PUT; stop"; exit 1; }
$TEST $PWD/prewrite_engine.json $PWD/put_full_engine.json $PWD/prewrite_child.json $PWD/put_full_child.json | tail -1 | grep -q "ALL PASS" || { echo "test fails before PUT; stop"; exit 1; }
code=$(curl -s -o putreply_engine.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H "Content-Type: application/json" --data-binary @put_engine.json "$H/moMxiV4Irg1uRBZN"); echo "PUT engine HTTP $code"; [ "$code" = "200" ] || { echo "engine PUT failed; child not written"; exit 1; }
code=$(curl -s -o putreply_child.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H "Content-Type: application/json" --data-binary @put_child.json "$H/MqQHRl7mQQ0z8QdT"); echo "PUT child HTTP $code"
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/moMxiV4Irg1uRBZN" -o fetchback_engine.json; curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/MqQHRl7mQQ0z8QdT" -o fetchback_child.json
for w in engine child; do python3 - put_$w.json fetchback_$w.json <<'PY'
import json,sys
t=json.load(open(sys.argv[1]));f=json.load(open(sys.argv[2]))
T={n['name']:n['parameters'] for n in t['nodes']};F={n['name']:n['parameters'] for n in f['nodes']}
bad=[k for k in set(T)|set(F) if json.dumps(T.get(k),sort_keys=True)!=json.dumps(F.get(k),sort_keys=True)]
print(f['name'],'version',f['versionId'],'active',f.get('active'),'param mismatches',bad,'connections equal',json.dumps(t['connections'],sort_keys=True)==json.dumps(f['connections'],sort_keys=True))
PY
done
node /mnt/project-files/ask519/w4/libcheck/runcheck.js fetchback_engine.json fetchback_child.json
node /mnt/project-files/ask557/w4/build/test557.js --pair $PWD/fetchback_engine.json $PWD/fetchback_child.json
$TEST $PWD/prewrite_engine.json $PWD/fetchback_engine.json $PWD/prewrite_child.json $PWD/fetchback_child.json | tail -1
