#!/bin/bash
# ASK 524/525 revert: PUT the pre-write copy saved by write524.sh. Usage: revert524.sh <engine version after 524>
set -e; cd /mnt/project-files/ask524/w4/build/; H="https://truthapp.app.n8n.cloud/api/v1/workflows"; W=moMxiV4Irg1uRBZN
cur=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/$W" | python3 -c 'import json,sys;print(json.load(sys.stdin)["versionId"])'); [ "$cur" = "$1" ] || { echo "MOVED $cur"; exit 1; }
code=$(curl -s -o revertreply_engine.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H "Content-Type: application/json" --data-binary @revert_engine.json "$H/$W"); echo "REVERT PUT engine HTTP $code"
