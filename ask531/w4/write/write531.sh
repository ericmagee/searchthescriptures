#!/bin/bash
# ASK 531 write (engine + child): only on the operator's card press in W4's thread. Usage: write531.sh <engine versionId at write time> <child versionId at write time>
# Bodies are built at write time from the fresh fetches by body531.py (patch531.py; only the named nodes may differ). The pre-write fetch is the revert copy.
# The audit_log row is written after, by hand SQL with SET LOCAL truth.session_id and truth.card.
set -e; cd /mnt/project-files/ask531/w4/write/
H="https://truthapp.app.n8n.cloud/api/v1/workflows"; EV="$1"; CV="$2"; [ -n "$EV" ] && [ -n "$CV" ] || { echo "need engine and child versions"; exit 1; }
for pair in "moMxiV4Irg1uRBZN:$EV:engine" "MqQHRl7mQQ0z8QdT:$CV:child"; do
 IFS=: read W V K <<<"$pair"
 curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/$W" -o "prewrite_$K.json"
 cur=$(python3 -c 'import json,sys;print(json.load(open(sys.argv[1]))["versionId"])' "prewrite_$K.json")
 [ "$cur" = "$V" ] || { echo "MOVED before any PUT: $W $cur"; exit 1; }
 python3 -c 'import json,sys;d=json.load(open(sys.argv[1]));json.dump({k:d[k] for k in ["name","nodes","connections","settings"]},open(sys.argv[2],"w"),ensure_ascii=False)' "prewrite_$K.json" "revert_$K.json"
done
[ "$(md5sum ../build/patch531.py | cut -c1-8)" = "d73ad624" ] || { echo "patch531.py is not the graded d73ad624; stop before any PUT"; exit 1; }
[ "$(md5sum body531.py | cut -c1-8)" = "bcca8552" ] || { echo "body531.py is not bcca8552; stop before any PUT"; exit 1; }
python3 body531.py prewrite_engine.json prewrite_child.json put_engine.json put_child.json
for pair in "moMxiV4Irg1uRBZN:engine" "MqQHRl7mQQ0z8QdT:child"; do
 IFS=: read W K <<<"$pair"
 code=$(curl -s -o putreply_$K.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H "Content-Type: application/json" --data-binary @put_$K.json "$H/$W"); echo "PUT $K HTTP $code"
 curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/$W" -o fetchback_${K}_531.json
 python3 - put_$K.json fetchback_${K}_531.json <<'PY'
import json,sys
t=json.load(open(sys.argv[1]));f=json.load(open(sys.argv[2]))
T={n['name']:n['parameters'] for n in t['nodes']};F={n['name']:n['parameters'] for n in f['nodes']}
bad=[k for k in T if json.dumps(T[k],sort_keys=True)!=json.dumps(F.get(k),sort_keys=True)]
print(f['name'],'version',f['versionId'],'active',f.get('active'),'param mismatches',bad)
sys.exit(1 if bad else 0)
PY
 node /mnt/project-files/ask519/w4/libcheck/runcheck.js fetchback_${K}_531.json
done
