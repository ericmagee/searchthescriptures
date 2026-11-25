#!/bin/bash
# ASK 645 write (base engine ee4e389d / child aad0ad9c): ENGINE ONLY, QR Merge, QR Follow Build, QR Follow Final (whole-question follow-up, W4 build b1 a47183fd, W1 grade PASS Wall 12062).
# Operator press: PRESS_LINE
# Refuses while any engine or child execution runs, when live is not the base, or when the rebuild, t645, standing set, pair check or one-copy check fail.
set -u
: "${N8N_API_KEY:?N8N_API_KEY not set; NOTHING WRITTEN}"
H=https://truthapp.app.n8n.cloud/api/v1; B=/mnt/project-files/ask645/w4/b1; O=/mnt/project-files/ask645/w4/write; T=/mnt/project-files/ask578/w4/tools; E=moMxiV4Irg1uRBZN; C=MqQHRl7mQQ0z8QdT; cd $O
RUN=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/executions?status=running&limit=100" | python3 -I -c "import json,sys;d=json.load(sys.stdin).get('data') or [];print(' '.join(x['id'] for x in d if x.get('workflowId') in ('$E','$C')))") || { echo "RUN CHECK FAILED; NOTHING WRITTEN"; exit 1; }
[ -z "$RUN" ] || { echo "ENGINE OR CHILD RUN LIVE ($RUN); NOTHING WRITTEN"; exit 1; }
rm -rf atw && mkdir -p atw && node $B/b645.cjs $B/base_eng.json $O/atw/target_engine_645.json > atw/build.txt 2>&1 || { echo "REBUILD FAILED; NOTHING WRITTEN"; exit 1; }
cmp -s atw/target_engine_645.json $B/tg/target_engine_645.json || { echo "REBUILD DIFFERS FROM THE GRADED TARGET; NOTHING WRITTEN"; exit 1; }
(cd $B && node t645.cjs base_eng.json $O/atw/target_engine_645.json fx/follow_fx.json) > atw/t645.txt 2>&1; tail -1 atw/t645.txt | grep -q "ALL PASS" || { echo "T645 FAILED; NOTHING WRITTEN"; exit 1; }
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o prewrite_eng.json || exit 1
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$C -o prewrite_child.json || exit 1
python3 -I - $O $B <<'PY' || { echo "LIVE IS NOT THE BASE; NOTHING WRITTEN"; exit 1; }
import json,sys
O,B=sys.argv[1],sys.argv[2]
P=lambda d:{n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
a=json.load(open(f'{O}/prewrite_eng.json'));b=json.load(open('/mnt/project-files/ask637/w4/write/fetchback_eng_637.json'));T=json.load(open(f'{B}/tg/target_engine_645.json'))
assert a['versionId']==b['versionId'],('live engine version',a['versionId'],'base',b['versionId'])
assert P(a)==P(b),'live engine nodes are not the base'; assert a['connections']==b['connections'],'engine connections moved'
assert T['connections']==b['connections'] and set(P(T))==set(P(b)),'target changes nodes or connections'
ch=[n for n in P(b) if P(T)[n]!=P(b)[n]];assert sorted(ch)==['QR Follow Build','QR Follow Final','QR Merge'],ch
c=json.load(open(f'{O}/prewrite_child.json'));cb=json.load(open('/mnt/project-files/ask637/w4/write/fetchback_child_637.json'));assert P(c)==P(cb) and c['connections']==cb['connections'],'live child is not the base'
json.dump({x:a[x] for x in ('name','nodes','connections','settings')},open(f'{O}/revert_eng_645.json','w'),ensure_ascii=False)
TN={n['name']:n for n in T['nodes']};a['nodes']=[({**n,'parameters':TN[n['name']]['parameters']} if n['name'] in ch else n) for n in a['nodes']]
json.dump({'name':a['name'],'nodes':a['nodes'],'connections':a['connections'],'settings':a['settings']},open(f'{O}/put_eng.json','w'),ensure_ascii=False)
print('engine base',a['versionId'],'nodes changed',len(ch),ch,'; child unchanged',c['versionId'])
PY
node /mnt/project-files/standing/run.cjs $O/put_eng.json $O/prewrite_child.json > atw/standing.txt 2>&1 || { echo "STANDING FAILED; NOTHING WRITTEN"; exit 1; }; tail -n 1 atw/standing.txt
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/put_eng.json $O/prewrite_child.json | tail -n 1 | grep -q "Library Check PASSES" || { echo "PAIR CHECK FAILED; NOTHING WRITTEN"; exit 1; }
X=$(mktemp -d) && mkdir -p $X/tools/node_modules $X/a385_w4 && cp $O/lib_repo.cjs $X/tools/lib.cjs && cp $T/reg385.cjs $X/a385_w4/ && ln -s /opt/node-tools/node_modules/acorn $X/tools/node_modules/acorn && node $X/a385_w4/reg385.cjs --registry $T/registry_578.json $O/put_eng.json $O/prewrite_child.json | grep -q "RESULT: PASS" || { echo "ONE-COPY CHECK FAILED; NOTHING WRITTEN"; exit 1; }
code=$(curl -s -o putreply_eng.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H 'Content-Type: application/json' --data-binary @put_eng.json $H/workflows/$E) || code=000
echo "PUT engine http $code"; [ "$code" = 200 ] || { echo "PUT engine FAILED; revert_eng_645.json restores it"; exit 1; }
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o $O/fetchback_eng_645.json; curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$C -o $O/fetchback_child_645.json; sleep 10; ls -la $O/fetchback_eng_645.json
python3 -I - $O <<'PY'
import json,sys
O=sys.argv[1]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
f=json.load(open(f'{O}/fetchback_eng_645.json'));p=json.load(open(f'{O}/put_eng.json'));r=json.load(open(f'{O}/revert_eng_645.json'))
print('eng',f['versionId'],'active',f.get('active'),'nodes',len(f['nodes']),'params equal put',P(f)==P(p),'conn equal',f['connections']==p['connections'],'changed',len([x for x in P(r) if P(f).get(x)!=P(r)[x]]),[x for x in P(r) if P(f).get(x)!=P(r)[x]])
c=json.load(open(f'{O}/fetchback_child_645.json'));c0=json.load(open(f'{O}/prewrite_child.json'));print('child',c['versionId'],'unchanged',c['versionId']==c0['versionId'] and P(c)==P(c0))
PY
node /mnt/project-files/standing/run.cjs $O/fetchback_eng_645.json $O/fetchback_child_645.json | tail -n 1
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/fetchback_eng_645.json $O/fetchback_child_645.json | tail -n 1
rm -f put_eng.json prewrite_eng.json prewrite_child.json
