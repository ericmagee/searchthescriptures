#!/bin/bash
# ASK 379 write, run ONLY on Eric's card press. usage: bash a379/write379.sh <cap> <tag>   (from the scratchpad root)
set -euo pipefail; CAP=$1; TAG=$2; B=https://truthapp.app.n8n.cloud/api/v1; H=(-H "X-N8N-API-KEY: $N8N_API_KEY" -H 'content-type: application/json')
A379_CAP=$CAP node a379/build379.cjs rdf/fetchback_s260.json CHILD_ID_AT_WRITE a379/w_engine_pre.json a379/w_child.json
node a379/drift379.cjs rdf/fetchback_s260.json a379/w_child.json
CID=$(curl -sS -X POST "${H[@]}" --data-binary @a379/w_child.json $B/workflows | python3 -c 'import sys,json;print(json.load(sys.stdin)["id"])'); echo "child $CID"
curl -sS -X POST "${H[@]}" $B/workflows/$CID/activate | python3 -c 'import sys,json;d=json.load(sys.stdin);print("child active",d.get("active"),d.get("versionId"),d.get("activeVersionId"))'
A379_CAP=$CAP node a379/build379.cjs rdf/fetchback_s260.json $CID a379/w_engine.json a379/w_child_check.json
python3 rdf/wgen379.py ec5b5cde-a4fa-4bbd-9058-3baaa6c502b7 rdf/fetchback_s260.json a379/w_engine.json $TAG --write --allow-reasoning
curl -sS "${H[@]}" $B/workflows/$CID > a379/w_child_back.json; node -e 'const fs=require("fs");const a=JSON.parse(fs.readFileSync("a379/w_child.json")),b=JSON.parse(fs.readFileSync("a379/w_child_back.json"));const js=JSON.stringify;const B=Object.fromEntries(b.nodes.map(n=>[n.name,n]));const bad=a.nodes.filter(n=>!B[n.name]||js(n.parameters)!==js(B[n.name].parameters)).map(n=>n.name);console.log("child readback",bad.length?"FAIL "+bad.join(", "):"OK",a.nodes.length,b.nodes.length,"active",b.active)'
