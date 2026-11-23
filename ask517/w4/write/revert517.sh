#!/bin/bash
# ASK 517 REVERT to 516b (library); revert517_s6.sql (W1, 82fcafab) reverts the SQL: only on the operator's card press in W4's thread. Asserts the live version equals the base before each PUT.
set -e; cd /mnt/project-files/ask517/w4/write/
H="https://truthapp.app.n8n.cloud/api/v1/workflows"
for pair in "moMxiV4Irg1uRBZN:ENGINE_V_AFTER_WRITE:revert_engine_517.json:fetchback_engine_revert517.json" "MqQHRl7mQQ0z8QdT:CHILD_V_AFTER_WRITE:revert_child_517.json:fetchback_child_revert517.json"; do
 IFS=: read W V T F <<<"$pair"
 cur=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/$W" | python3 -c 'import json,sys;print(json.load(sys.stdin)["versionId"])')
 [ "$cur" = "$V" ] || { echo "MOVED $W $cur"; exit 1; }
 curl -s -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H "Content-Type: application/json" --data-binary @"$T" "$H/$W" -o put_$W.json
 curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/$W" -o "$F"
 python3 - "$T" "$F" <<'PY'
import json,sys
t=json.load(open(sys.argv[1]));f=json.load(open(sys.argv[2]))
T={n['name']:n['parameters'] for n in t['nodes']};F={n['name']:n['parameters'] for n in f['nodes']}
bad=[k for k in T if json.dumps(T[k],sort_keys=True)!=json.dumps(F.get(k),sort_keys=True)]
print(f['name'],'version',f['versionId'],'active',f.get('active'),'param mismatches',bad)
PY
done
