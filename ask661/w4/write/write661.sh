#!/bin/bash
# ASK 661 write (W4): Shared Library header comment names the LIB body (fb8658437cad8fbf, 3910). Base engine 5d43650d. Engine only, one node, one comment line.
# The target is built inside this script from a fresh live fetch (W1 F1, Wall 12266: never from a stripped saved file).
# Operator press: Eric, "Write it live", W4 card cmsg_017ZQamDMHrS6fqMHnQDVo586rdt9SWY33g6hgMB54AW5g, 18:29 CST 2026-11-25. W1 PASS WITH N1 Wall 12269.
set -u
: "${N8N_API_KEY:?N8N_API_KEY not set; NOTHING WRITTEN}"
H=https://truthapp.app.n8n.cloud/api/v1; W=/mnt/project-files/ask661/w4; O=$W/write; E=moMxiV4Irg1uRBZN; C=MqQHRl7mQQ0z8QdT; cd $O
RUN=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/executions?status=running&limit=100" | python3 -I -c "import json,sys;d=json.load(sys.stdin).get('data') or [];print(' '.join(x['id'] for x in d if x.get('workflowId') in ('$E','$C')))") || { echo "RUN CHECK FAILED; NOTHING WRITTEN"; exit 1; }
[ -z "$RUN" ] || { echo "ENGINE OR CHILD RUN LIVE ($RUN); NOTHING WRITTEN"; exit 1; }
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o prewrite_eng.json || exit 1
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$C -o prewrite_child.json || exit 1
node $W/b661.cjs prewrite_eng.json target.json > build.txt 2>&1 || { echo "BUILD FAILED; NOTHING WRITTEN"; exit 1; }; cat build.txt
python3 -I - $O <<'PY' || { echo "BASE OR TARGET CHECK FAILED; NOTHING WRITTEN"; exit 1; }
import json,sys
O=sys.argv[1]
P=lambda d:{n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
a=json.load(open(f'{O}/prewrite_eng.json'));T=json.load(open(f'{O}/target.json'))
assert a['versionId'].startswith('5d43650d'),('live engine',a['versionId'])
ch=sorted(n for n in P(a) if P(T)[n]!=P(a)[n]);assert ch==['Shared Library'],ch
assert T['connections']==a['connections'] and len(T['nodes'])==len(a['nodes'])
assert all(json.dumps(x['parameters'].get('headerParameters'))==json.dumps(y['parameters'].get('headerParameters')) for x,y in zip(a['nodes'],T['nodes'])),'headers moved'
c=json.load(open(f'{O}/prewrite_child.json'));assert c['versionId'].startswith('aad0ad9c'),('child',c['versionId'])
json.dump({x:a[x] for x in ('name','nodes','connections','settings')},open(f'{O}/revert_eng_661.json','w'),ensure_ascii=False)
json.dump({x:T[x] for x in ('name','nodes','connections','settings')},open(f'{O}/put_eng.json','w'),ensure_ascii=False)
print('engine base',a['versionId'],'changed',ch,'; child',c['versionId'])
PY
(cd $O && cp target.json target_661.json && cp prewrite_eng.json base_5d43650d.json && node $W/t661.cjs | tail -1 && rm base_5d43650d.json target_661.json) | grep -q "4 PASS, 0 FAIL" || { echo "TESTS FAILED; NOTHING WRITTEN"; exit 1; }
node /mnt/project-files/standing/run.cjs $O/put_eng.json $O/prewrite_child.json > standing.txt 2>&1 || { echo "STANDING FAILED; NOTHING WRITTEN"; tail -3 standing.txt; exit 1; }; tail -n 1 standing.txt
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/put_eng.json $O/prewrite_child.json | tail -n 1 | grep -q "Library Check PASSES" || { echo "PAIR CHECK FAILED; NOTHING WRITTEN"; exit 1; }
node -e "const c=require('$O/put_eng.json').nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=c.indexOf('\\n/*LIB*/'),b=c.indexOf('\\n/*MAP*/');const L=JSON.parse(c.slice(a+8,b));const s=require('crypto').createHash('sha256').update(JSON.stringify(L)).digest('hex').slice(0,16);const m=c.match(/library sha ([0-9a-f]{16}), (\\d+) lines/);if(!m||m[1]!==s||+m[2]!==L.length){console.log('HEADER',m&&m[1],m&&m[2],'BODY',s,L.length);process.exit(1)}console.log('header equals body',s,L.length)" || { echo "LIBRARY HEADER DIFFERS FROM BODY; NOTHING WRITTEN"; exit 1; }
code=$(curl -s -o putreply_eng.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H 'Content-Type: application/json' --data-binary @put_eng.json $H/workflows/$E) || code=000
echo "PUT engine http $code"; [ "$code" = 200 ] || { echo "PUT engine FAILED; revert_eng_661.json restores it"; exit 1; }
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o fetchback_eng_661.json; curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$C -o fetchback_child_661.json
python3 -I - $O <<'PY'
import json,sys
O=sys.argv[1]
P=lambda d:{n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
f=json.load(open(f'{O}/fetchback_eng_661.json'));p=json.load(open(f'{O}/put_eng.json'));r=json.load(open(f'{O}/revert_eng_661.json'))
print('eng',f['versionId'],'active',f.get('active'),'nodes',len(f['nodes']),'params equal put',P(f)==P(p),'conn equal',f['connections']==p['connections'],'changed',[x for x in P(r) if P(f).get(x)!=P(r)[x]])
c=json.load(open(f'{O}/fetchback_child_661.json'));c0=json.load(open(f'{O}/prewrite_child.json'));print('child',c['versionId'],'unchanged',c['versionId']==c0['versionId'] and P(c)==P(c0))
PY
node /mnt/project-files/standing/run.cjs fetchback_eng_661.json fetchback_child_661.json | tail -n 1
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/fetchback_eng_661.json $O/fetchback_child_661.json | tail -n 1
rm -f put_eng.json prewrite_eng.json prewrite_child.json target.json
