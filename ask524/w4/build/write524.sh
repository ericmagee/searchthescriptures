#!/bin/bash
# ASK 524 with 525 stacked: engine write (Assume Check Build, Assume Check Record, D3 Build). Only on the operator's card press in W4's thread.
# Usage: write524.sh <engine versionId at write time>. The body is built at write time from a fresh fetch by W1's patch524.py (4baa2f89; text
# replacements that assert each anchor occurs once), and this script asserts that only those three nodes differ, connections and settings equal.
# The pre-write fetch is the revert copy. The audit_log row is written after, by hand SQL with SET LOCAL truth.session_id and truth.card.
set -e; cd /mnt/project-files/ask524/w4/build/
H="https://truthapp.app.n8n.cloud/api/v1/workflows"; W=moMxiV4Irg1uRBZN; EV="$1"; [ -n "$EV" ] || { echo "need engine version"; exit 1; }
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/$W" -o prewrite_engine.json
cur=$(python3 -c 'import json,sys;print(json.load(open(sys.argv[1]))["versionId"])' prewrite_engine.json); [ "$cur" = "$EV" ] || { echo "MOVED $cur"; exit 1; }
python3 -c 'import json,sys;d=json.load(open(sys.argv[1]));json.dump({k:d[k] for k in ["name","nodes","connections","settings"]},open(sys.argv[2],"w"),ensure_ascii=False)' prewrite_engine.json revert_engine.json
[ "$(md5sum /mnt/project-files/ask524/w1/patch524.py | cut -c1-8)" = "4baa2f89" ] || { echo "patch524.py changed"; exit 1; }
SRC=prewrite_engine.json OUT=target_write.json python3 /mnt/project-files/ask524/w1/patch524.py
python3 - prewrite_engine.json target_write.json put_engine.json <<'PY'
import json,sys
a=json.load(open(sys.argv[1]));b=json.load(open(sys.argv[2]))
A={n['name']:n for n in a['nodes']};B={n['name']:n for n in b['nodes']}
diff=sorted(k for k in A if json.dumps(A[k],sort_keys=True)!=json.dumps(B.get(k),sort_keys=True))
assert diff==['Assume Check Build','Assume Check Record','D3 Build'] and len(A)==len(B) and a['connections']==b['connections'] and a.get('settings')==b.get('settings'),diff
json.dump({k:b[k] for k in ['name','nodes','connections','settings']},open(sys.argv[3],'w'),ensure_ascii=False);print('put body: nodes changed',diff)
PY
code=$(curl -s -o putreply_engine.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H "Content-Type: application/json" --data-binary @put_engine.json "$H/$W"); echo "PUT engine HTTP $code"
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/$W" -o fetchback_engine_524.json
python3 - put_engine.json fetchback_engine_524.json <<'PY'
import json,sys
t=json.load(open(sys.argv[1]));f=json.load(open(sys.argv[2]))
T={n['name']:n['parameters'] for n in t['nodes']};F={n['name']:n['parameters'] for n in f['nodes']}
bad=[k for k in T if json.dumps(T[k],sort_keys=True)!=json.dumps(F.get(k),sort_keys=True)]
print(f['name'],'version',f['versionId'],'active',f.get('active'),'param mismatches',bad);sys.exit(1 if bad else 0)
PY
