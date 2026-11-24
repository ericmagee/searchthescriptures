#!/bin/bash
# ASK 591 engine write: the judge order is read from the table odv1_judge_order at run start (node "Judge Order Read"; Accept Build, Init Seats, Build Save Body). Child untouched.
# RUN ONLY AFTER mig591.sql is applied and read back (the new node calls odv1_judge_order_read; without it every run stops at the read).
# Base C: J2 live (engine 489b977b / child e086bb3a) -> b1/target_engine_591.json. Base D: J3 written on J2 (j3/onj2 targets) -> b1/onj3/target_engine_591_onj3.json.
# Key from the environment only. Refuses while any engine or child execution is running, or when the live flow is neither base.
set -u
: "${N8N_API_KEY:?N8N_API_KEY not set; NOTHING WRITTEN}"
H=https://truthapp.app.n8n.cloud/api/v1; B=/mnt/project-files/ask591/w4/b1; O=/mnt/project-files/ask591/w4/write; J2=/mnt/project-files/ask586/w4/j2/write; J3=/mnt/project-files/ask586/w4/j3/onj2
E=moMxiV4Irg1uRBZN; C=MqQHRl7mQQ0z8QdT
RUN=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/executions?status=running&limit=100" | python3 -I -c "import json,sys;d=json.load(sys.stdin).get('data') or [];print(' '.join(x['id'] for x in d if x.get('workflowId') in ('$E','$C')))") || { echo "RUN CHECK FAILED; NOTHING WRITTEN"; exit 1; }
[ -z "$RUN" ] || { echo "ENGINE OR CHILD RUN LIVE ($RUN); NOTHING WRITTEN"; exit 1; }
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o $O/prewrite_eng591.json || exit 1
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$C -o $O/prewrite_child591.json || exit 1
BASE=$(python3 -I - $O $J2 $J3 <<'PY'
import json,sys
O,J2,J3=sys.argv[1:4]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
pe=json.load(open(f'{O}/prewrite_eng591.json'));pc=json.load(open(f'{O}/prewrite_child591.json'))
def same(pre,b):b=json.load(open(b));return P(pre)==P(b) and pre['connections']==b['connections']
if same(pe,f'{J2}/fetchback_eng586j2.json') and same(pc,f'{J2}/fetchback_child586j2.json'):print('C')
elif same(pe,f'{J3}/target_engine_j3_onj2.json') and same(pc,f'{J3}/target_child_j3_onj2.json'):print('D')
else:print('NONE')
PY
) || { echo "BASE CHECK FAILED; NOTHING WRITTEN"; exit 1; }
case $BASE in
 C) BE=$J2/fetchback_eng586j2.json; TE=$B/target_engine_591.json; TC=$J2/fetchback_child586j2.json;;
 D) BE=$J3/target_engine_j3_onj2.json; TE=$B/onj3/target_engine_591_onj3.json; TC=$J3/target_child_j3_onj2.json;;
 *) echo "LIVE FLOW IS NEITHER BASE (J2 live, or J3 on J2); NOTHING WRITTEN"; exit 1;;
esac
echo "base $BASE: target $(basename $TE)"
( cd $B && T591_BASE=$BE T591_TGT=$TE node t591.cjs > $O/t591_at_write.txt 2>&1 ); tail -1 $O/t591_at_write.txt | grep -q 'ALL PASS' || { echo "t591 FAILED; NOTHING WRITTEN"; exit 1; }; echo "t591 $(tail -1 $O/t591_at_write.txt)"
node /mnt/project-files/standing/run.cjs $TE $TC > $O/standing_at_write.txt 2>&1 || { echo "STANDING SET FAILED; NOTHING WRITTEN"; tail -1 $O/standing_at_write.txt; exit 1; }; echo "$(tail -1 $O/standing_at_write.txt)"
node /mnt/project-files/ask557/w4/build/test557.js --pair $TE $TC | tail -1 | grep -q PASSES || { echo "PAIR FAILED; NOTHING WRITTEN"; exit 1; }
python3 -I - $O $TE <<'PY' || { echo "PREP FAILED; NOTHING WRITTEN"; exit 1; }
import json,sys
O,TE=sys.argv[1:3]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
pre=json.load(open(f'{O}/prewrite_eng591.json'));T=json.load(open(TE))
json.dump({k:pre[k] for k in ('name','nodes','connections','settings')},open(f'{O}/revert_eng591.json','w'),ensure_ascii=False)
json.dump({'name':pre['name'],'nodes':T['nodes'],'connections':T['connections'],'settings':pre['settings']},open(f'{O}/put_eng591.json','w'),ensure_ascii=False)
pt,pp=P(T),P(pre);print('eng put nodes',len(T['nodes']),'changed or added',sorted(n for n in pt if pt[n]!=pp.get(n)))
PY
code=$(curl -s -o $O/putreply_eng591.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H 'Content-Type: application/json' --data-binary @$O/put_eng591.json $H/workflows/$E) || code=000
echo "PUT eng http $code"; [ "$code" = 200 ] || { echo "PUT eng FAILED; STOP"; exit 1; }
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o $O/fetchback_eng591.json
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$C -o $O/fetchback_child591.json
python3 -I - $O $TE $TC <<'PY'
import json,sys
O,TE,TC=sys.argv[1:4]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
f=json.load(open(f'{O}/fetchback_eng591.json'));T=json.load(open(TE));r=json.load(open(f'{O}/revert_eng591.json'))
print('eng fetchback version',f['versionId'],'active',f.get('active'),'nodes',len(f['nodes']),'| params equal target:',P(f)==P(T),'| connections equal target:',f['connections']==T['connections'],'| settings equal:',f.get('settings')==r.get('settings'))
print(' changed from revert:',sorted(n for n in P(f) if P(f)[n]!=P(r).get(n)))
c=json.load(open(f'{O}/fetchback_child591.json'));tc=json.load(open(TC));print('child untouched:',P(c)==P(tc) and c['connections']==tc['connections'])
PY
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/fetchback_eng591.json $O/fetchback_child591.json | tail -1
rm -f $O/put_eng591.json $O/prewrite_eng591.json $O/prewrite_child591.json
