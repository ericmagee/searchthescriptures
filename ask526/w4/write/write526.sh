#!/bin/bash
# ASK 526 write (engine only: Alternate Merge + one Shared Library MAP entry "Alternate Merge CPD"). Only on the operator's card press in W4's thread.
# Usage: write526.sh <engine versionId at write time>. Built at write time from a fresh fetch by patch526.py (0356771b), which asserts the library is
# 1baf759d74aecb36 or a383650b705f3fb7 (after 527) and that the lines it loads define cpdSync, psGrades, ri3Count2024 and ri3Head2024.
# This script asserts that only Shared Library and Alternate Merge differ and that no LIB line changes. Write after 527 (lib527.py expects the post-520 MAP).
# The pre-write fetch is the revert copy. The audit_log row is written after, by hand SQL with SET LOCAL truth.session_id and truth.card.
set -e; cd /mnt/project-files/ask526/w4/write/
H="https://truthapp.app.n8n.cloud/api/v1/workflows"; W=moMxiV4Irg1uRBZN; EV="$1"; [ -n "$EV" ] || { echo "need engine version"; exit 1; }
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/$W" -o prewrite_engine.json
cur=$(python3 -c 'import json,sys;print(json.load(open(sys.argv[1]))["versionId"])' prewrite_engine.json); [ "$cur" = "$EV" ] || { echo "MOVED $cur"; exit 1; }
python3 -c 'import json,sys;d=json.load(open(sys.argv[1]));json.dump({k:d[k] for k in ["name","nodes","connections","settings"]},open(sys.argv[2],"w"),ensure_ascii=False)' prewrite_engine.json revert_engine.json
[ "$(md5sum ../patch526.py | cut -c1-8)" = "0356771b" ] || { echo "patch526.py changed"; exit 1; }
python3 ../patch526.py prewrite_engine.json target_write.json
python3 - prewrite_engine.json target_write.json put_engine.json <<'PY'
import json,sys
a=json.load(open(sys.argv[1]));b=json.load(open(sys.argv[2]))
A={n['name']:n for n in a['nodes']};B={n['name']:n for n in b['nodes']}
diff=sorted(k for k in A if json.dumps(A[k],sort_keys=True)!=json.dumps(B.get(k),sort_keys=True))
lib=lambda N:(lambda t:t[t.index('\n/*LIB*/'):t.rindex('\n/*MAP*/')])(N['Shared Library']['parameters']['jsCode'])
assert diff==['Alternate Merge','Shared Library'] and len(A)==len(B) and a['connections']==b['connections'] and a.get('settings')==b.get('settings') and lib(A)==lib(B),diff
json.dump({k:b[k] for k in ['name','nodes','connections','settings']},open(sys.argv[3],'w'),ensure_ascii=False);print('put body: nodes changed',diff,'| LIB lines unchanged')
PY
code=$(curl -s -o putreply_engine.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H "Content-Type: application/json" --data-binary @put_engine.json "$H/$W"); echo "PUT engine HTTP $code"
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/$W" -o fetchback_engine_526.json
python3 - put_engine.json fetchback_engine_526.json <<'PY'
import json,sys
t=json.load(open(sys.argv[1]));f=json.load(open(sys.argv[2]))
T={n['name']:n['parameters'] for n in t['nodes']};F={n['name']:n['parameters'] for n in f['nodes']}
bad=[k for k in T if json.dumps(T[k],sort_keys=True)!=json.dumps(F.get(k),sort_keys=True)]
print(f['name'],'version',f['versionId'],'active',f.get('active'),'param mismatches',bad);sys.exit(1 if bad else 0)
PY
node /mnt/project-files/ask519/w4/libcheck/runcheck.js fetchback_engine_526.json
