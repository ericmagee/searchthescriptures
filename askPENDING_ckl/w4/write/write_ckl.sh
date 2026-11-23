#!/bin/bash
# pkgCKL write (engine only): only on the operator's card press in W4's thread. Usage: write539.sh <engine versionId at write time>
# The body is built at write time from the fresh fetch by patch_ckl.js (it asserts the Close Enforcer Record code is ed6c406e, so it applies on any engine version that keeps that node). The pre-write fetch is the revert copy.
# The audit_log row is written after, by hand SQL with SET LOCAL truth.session_id and truth.card.
set -e; cd /mnt/project-files/askPENDING_ckl/w4/write/
H="https://truthapp.app.n8n.cloud/api/v1/workflows"; W=moMxiV4Irg1uRBZN; EV="$1"; [ -n "$EV" ] || { echo "need engine version"; exit 1; }
[ "$(md5sum ../build/patch_ckl.js | cut -c1-8)" = "1eb50114" ] || { echo "patch_ckl.js is not the graded copy; stop before any PUT"; exit 1; }
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/$W" -o prewrite_engine.json
cur=$(python3 -c 'import json,sys;print(json.load(open(sys.argv[1]))["versionId"])' prewrite_engine.json)
[ "$cur" = "$EV" ] || { echo "MOVED before any PUT: $W $cur"; exit 1; }
python3 -c 'import json,sys;d=json.load(open(sys.argv[1]));json.dump({k:d[k] for k in ["name","nodes","connections","settings"]},open(sys.argv[2],"w"),ensure_ascii=False)' prewrite_engine.json revert_engine.json
node ../build/patch_ckl.js prewrite_engine.json target_engine_ckl_w.json
python3 - prewrite_engine.json target_engine_ckl_w.json put_engine.json <<'PY'
import json,sys
a=json.load(open(sys.argv[1]));b=json.load(open(sys.argv[2]))
A={n['name']:n for n in a['nodes']};Bn={n['name']:n for n in b['nodes']}
d=sorted(k for k in Bn if json.dumps(A.get(k),sort_keys=True)!=json.dumps(Bn[k],sort_keys=True))
assert d==['Close Enforcer Record'] and set(A)==set(Bn) and a['connections']==b['connections'] and a.get('settings')==b.get('settings'),d
json.dump({k:b[k] for k in ['name','nodes','connections','settings']},open(sys.argv[3],'w'),ensure_ascii=False);print('body: only',d,'differ')
PY
code=$(curl -s -o putreply_engine.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H "Content-Type: application/json" --data-binary @put_engine.json "$H/$W"); echo "PUT engine HTTP $code"
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/$W" -o fetchback_engine_ckl.json
python3 - put_engine.json fetchback_engine_ckl.json <<'PY'
import json,sys
t=json.load(open(sys.argv[1]));f=json.load(open(sys.argv[2]))
T={n['name']:n['parameters'] for n in t['nodes']};F={n['name']:n['parameters'] for n in f['nodes']}
bad=[k for k in set(T)|set(F) if json.dumps(T.get(k),sort_keys=True)!=json.dumps(F.get(k),sort_keys=True)]
print(f['name'],'version',f['versionId'],'active',f.get('active'),'param mismatches',bad)
sys.exit(1 if bad else 0)
PY
node /mnt/project-files/ask519/w4/libcheck/runcheck.js fetchback_engine_ckl.json
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/MqQHRl7mQQ0z8QdT" -o fetchback_child_ckl.json
node /mnt/project-files/ask539/w4/build/test539.js --pair "$PWD/fetchback_engine_ckl.json" "$PWD/fetchback_child_ckl.json"
