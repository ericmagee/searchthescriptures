#!/bin/bash
# ASK 654 write (W4), base engine a5c3001d / child aad0ad9c. Engine only: Init with Guards, Shared Library, D3B Build, D4 Build, D4B Build. Plan rev 11 4a17e308; b2 (adef22b5) + b3 (9b251b5b), W1 PASS WITH N1 Wall 12065.
# Operator press: Eric, "Write it live", W4 card cmsg_017ZQamDMHrS6fqMHnQDVo58Fxv92Xo6XyHu9T1ETyArkW, 16:51 CST 2026-11-25. Child not written; checked unchanged.
set -u
: "${N8N_API_KEY:?N8N_API_KEY not set; NOTHING WRITTEN}"
H=https://truthapp.app.n8n.cloud/api/v1; W=/mnt/project-files/ask654/w4; O=$W/write; T=/mnt/project-files/ask578/w4/tools; E=moMxiV4Irg1uRBZN; C=MqQHRl7mQQ0z8QdT; cd $O
RUN=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/executions?status=running&limit=100" | python3 -I -c "import json,sys;d=json.load(sys.stdin).get('data') or [];print(' '.join(x['id'] for x in d if x.get('workflowId') in ('$E','$C')))") || { echo "RUN CHECK FAILED; NOTHING WRITTEN"; exit 1; }
[ -z "$RUN" ] || { echo "ENGINE OR CHILD RUN LIVE ($RUN); NOTHING WRITTEN"; exit 1; }
rm -rf atw && mkdir -p atw && node $W/b2/b654b2.cjs $W/b2/tg/live_a5c3001d.json $O/atw/t2.json > atw/build2.txt 2>&1 && node $W/b3/b654b3.cjs $O/atw/t2.json $O/atw/target.json > atw/build3.txt 2>&1 || { echo "REBUILD FAILED; NOTHING WRITTEN"; exit 1; }
cmp -s atw/t2.json $W/b2/tg/target_engine_654b2.json && cmp -s atw/target.json $W/b3/tg/target_engine_654b3.json || { echo "REBUILD DIFFERS FROM THE GRADED TARGETS; NOTHING WRITTEN"; exit 1; }
(cd $W/b3 && node t654b3.cjs tg/target_engine_654b3.json ../b2/tg/live_a5c3001d.json) > atw/t654b3.txt 2>&1; tail -1 atw/t654b3.txt | grep -q " PASS, 0 FAIL" || { echo "TESTS FAILED; NOTHING WRITTEN"; exit 1; }
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o prewrite_eng.json || exit 1
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$C -o prewrite_child.json || exit 1
python3 -I - $O $W <<'PY' || { echo "LIVE IS NOT THE BASE; NOTHING WRITTEN"; exit 1; }
import json,sys
O,W=sys.argv[1],sys.argv[2]
P=lambda d:{n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
a=json.load(open(f'{O}/prewrite_eng.json'));b=json.load(open(f'{W}/b2/tg/live_a5c3001d.json'));T=json.load(open(f'{O}/atw/target.json'))
assert a['versionId']==b['versionId'],('live engine version',a['versionId'],'base',b['versionId'])
assert P(a)==P(b),'live engine nodes are not the base'; assert a['connections']==b['connections'],'engine connections moved'
assert T['connections']==b['connections'] and set(P(T))==set(P(b)),'target changes nodes or connections'
ch=sorted(n for n in P(b) if P(T)[n]!=P(b)[n]);assert ch==['D3B Build','D4 Build','D4B Build','Init with Guards','Shared Library'],ch
c=json.load(open(f'{O}/prewrite_child.json'));assert c['versionId'].startswith('aad0ad9c'),('child',c['versionId'])
json.dump({x:a[x] for x in ('name','nodes','connections','settings')},open(f'{O}/revert_eng_654.json','w'),ensure_ascii=False)
TN={n['name']:n for n in T['nodes']};a['nodes']=[({**n,'parameters':TN[n['name']]['parameters']} if n['name'] in ch else n) for n in a['nodes']]
json.dump({'name':a['name'],'nodes':a['nodes'],'connections':a['connections'],'settings':a['settings']},open(f'{O}/put_eng.json','w'),ensure_ascii=False)
print('engine base',a['versionId'],'nodes changed',len(ch),ch,'; child',c['versionId'])
PY
node /mnt/project-files/standing/run.cjs $O/put_eng.json $O/prewrite_child.json > atw/standing.txt 2>&1 || { echo "STANDING FAILED; NOTHING WRITTEN"; tail -3 atw/standing.txt; exit 1; }; tail -n 1 atw/standing.txt
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/put_eng.json $O/prewrite_child.json | tail -n 1 | grep -q "Library Check PASSES" || { echo "PAIR CHECK FAILED; NOTHING WRITTEN"; exit 1; }
X=$(mktemp -d) && mkdir -p $X/tools/node_modules $X/a385_w4 && cp /mnt/project-files/ask653/w4/write/lib_repo.cjs $X/tools/lib.cjs && cp $T/reg385.cjs $X/a385_w4/ && ln -s /opt/node-tools/node_modules/acorn $X/tools/node_modules/acorn && node $X/a385_w4/reg385.cjs --registry $T/registry_578.json $O/put_eng.json $O/prewrite_child.json | grep -q "RESULT: PASS" || { echo "ONE-COPY CHECK FAILED; NOTHING WRITTEN"; exit 1; }
code=$(curl -s -o putreply_eng.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H 'Content-Type: application/json' --data-binary @put_eng.json $H/workflows/$E) || code=000
echo "PUT engine http $code"; [ "$code" = 200 ] || { echo "PUT engine FAILED; revert_eng_654.json restores it"; exit 1; }
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o $O/fetchback_eng_654.json; curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$C -o $O/fetchback_child_654.json
python3 -I - $O <<'PY'
import json,sys
O=sys.argv[1]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
f=json.load(open(f'{O}/fetchback_eng_654.json'));p=json.load(open(f'{O}/put_eng.json'));r=json.load(open(f'{O}/revert_eng_654.json'))
print('eng',f['versionId'],'active',f.get('active'),'nodes',len(f['nodes']),'params equal put',P(f)==P(p),'conn equal',f['connections']==p['connections'],'changed',[x for x in P(r) if P(f).get(x)!=P(r)[x]])
c=json.load(open(f'{O}/fetchback_child_654.json'));c0=json.load(open(f'{O}/prewrite_child.json'));print('child',c['versionId'],'unchanged',c['versionId']==c0['versionId'] and P(c)==P(c0))
PY
node /mnt/project-files/standing/run.cjs $O/fetchback_eng_654.json $O/fetchback_child_654.json | tail -n 1
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/fetchback_eng_654.json $O/fetchback_child_654.json | tail -n 1
rm -f put_eng.json prewrite_eng.json prewrite_child.json
