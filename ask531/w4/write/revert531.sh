#!/bin/bash
# ASK 531 revert: on the operator's word only. PUT the pre-write copies (revert_engine.json, revert_child.json saved by write531.sh).
# Usage: revert531.sh <engine version after 531> <child version after 531>
set -e; cd /mnt/project-files/ask531/w4/write/; H="https://truthapp.app.n8n.cloud/api/v1/workflows"
for pair in "moMxiV4Irg1uRBZN:$1:engine" "MqQHRl7mQQ0z8QdT:$2:child"; do IFS=: read W V K <<<"$pair"
 cur=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/$W" | python3 -c 'import json,sys;print(json.load(sys.stdin)["versionId"])'); [ "$cur" = "$V" ] || { echo "MOVED $W $cur"; exit 1; }
 code=$(curl -s -o revertreply_$K.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H "Content-Type: application/json" --data-binary @revert_$K.json "$H/$W"); echo "REVERT PUT $K HTTP $code"; done
