#!/bin/bash
# ASK 586 J3 write (option A, record-only): THE GRANTS LISTS served to every judge; a break line that says a side granted something names the grant.
# Base C: J2 live (engine 489b977b / child e086bb3a), target onj2/. Base A: live engine 04273989 / child c9acb53a (J6). Base B: the ASK 595 follow-on, if it is written first (params equal ask595/w4/cuts/target_*_cuts.json).
# Key from the environment only. Refuses while any engine or child execution is running, or when the live flow is neither base.
set -u
: "${N8N_API_KEY:?N8N_API_KEY not set; NOTHING WRITTEN}"
H=https://truthapp.app.n8n.cloud/api/v1; B=/mnt/project-files/ask586/w4/j3; O=$B/write; F=/mnt/project-files/ask586/w4/j6recut; K=/mnt/project-files/ask595/w4/cuts
E=moMxiV4Irg1uRBZN; C=MqQHRl7mQQ0z8QdT
RUN=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$H/executions?status=running&limit=100" | python3 -I -c "import json,sys;d=json.load(sys.stdin).get('data') or [];print(' '.join(x['id'] for x in d if x.get('workflowId') in ('$E','$C')))") || { echo "RUN CHECK FAILED; NOTHING WRITTEN"; exit 1; }
[ -z "$RUN" ] || { echo "ENGINE OR CHILD RUN LIVE ($RUN); NOTHING WRITTEN"; exit 1; }
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$E -o $O/prewrite_eng586j3.json || exit 1
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$C -o $O/prewrite_child586j3.json || exit 1
BASE=$(python3 -I - $O $F $K <<'PY'
import json,sys
O,F,K=sys.argv[1:4]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
pe=json.load(open(f'{O}/prewrite_eng586j3.json'));pc=json.load(open(f'{O}/prewrite_child586j3.json'))
def same(pre,b):b=json.load(open(b));return P(pre)==P(b) and pre['connections']==b['connections']
if same(pe,f'{F}/fetchback_eng586j6.json') and same(pc,f'{F}/fetchback_child586j6.json'):print('A')
elif same(pe,f'{K}/target_engine_cuts.json') and same(pc,f'{K}/target_child_cuts.json'):print('B')
elif same(pe,'/mnt/project-files/ask586/w4/j2/write/fetchback_eng586j2.json') and same(pc,'/mnt/project-files/ask586/w4/j2/write/fetchback_child586j2.json'):print('C')
else:print('NONE')
PY
) || { echo "BASE CHECK FAILED; NOTHING WRITTEN"; exit 1; }
case $BASE in
 A) TE=$B/target_engine_j3.json; TC=$B/target_child_j3.json; BE=$F/fetchback_eng586j6.json; BC=$F/fetchback_child586j6.json;;
 B) TE=$B/target_engine_j3_on595c.json; TC=$B/target_child_j3_on595c.json; BE=$K/target_engine_cuts.json; BC=$K/target_child_cuts.json;;
 C) TE=$B/onj2/target_engine_j3_onj2.json; TC=$B/onj2/target_child_j3_onj2.json; BE=/mnt/project-files/ask586/w4/j2/write/fetchback_eng586j2.json; BC=/mnt/project-files/ask586/w4/j2/write/fetchback_child586j2.json;;
 *) echo "LIVE FLOW IS NEITHER BASE (J6 live, or the ASK 595 follow-on); NOTHING WRITTEN"; exit 1;;
esac
echo "base $BASE: target $(basename $TE)"
( cd $B && J3_BASE_E=$BE J3_BASE_C=$BC J3_TGT_E=$TE J3_TGT_C=$TC node t_j3.cjs > $O/t_j3_at_write.txt 2>&1 ) ; tail -1 $O/t_j3_at_write.txt | grep -q 'ALL PASS' || { echo "t_j3 FAILED; NOTHING WRITTEN"; exit 1; }; echo "t_j3 $(tail -1 $O/t_j3_at_write.txt)"
node /mnt/project-files/standing/run.cjs $TE $TC > $O/standing_at_write.txt 2>&1 || { echo "STANDING SET FAILED; NOTHING WRITTEN"; tail -1 $O/standing_at_write.txt; exit 1; }; echo "$(tail -1 $O/standing_at_write.txt)"
node /mnt/project-files/ask557/w4/build/test557.js --pair $TE $TC | tail -1 | grep -q PASSES || { echo "PAIR FAILED; NOTHING WRITTEN"; exit 1; }
python3 -I - $O $TE $TC <<'PY' || { echo "PREP FAILED; NOTHING WRITTEN"; exit 1; }
import json,sys
O,TE,TC=sys.argv[1:4]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
for kind,tgt in (('eng',TE),('child',TC)):
  pre=json.load(open(f'{O}/prewrite_{kind}586j3.json'));T=json.load(open(tgt))
  json.dump({k:pre[k] for k in ('name','nodes','connections','settings')},open(f'{O}/revert_{kind}586j3.json','w'),ensure_ascii=False)
  json.dump({'name':pre['name'],'nodes':T['nodes'],'connections':T['connections'],'settings':pre['settings']},open(f'{O}/put_{kind}586j3.json','w'),ensure_ascii=False)
  pt,pp=P(T),P(pre);print(kind,'put nodes',len(T['nodes']),'changed',sorted(n for n in pt if pt[n]!=pp.get(n)))
PY
for kind in eng child; do W=$E; [ $kind = child ] && W=$C
  code=$(curl -s -o $O/putreply_${kind}586j3.json -w '%{http_code}' -X PUT -H "X-N8N-API-KEY: $N8N_API_KEY" -H 'Content-Type: application/json' --data-binary @$O/put_${kind}586j3.json $H/workflows/$W) || code=000
  echo "PUT $kind http $code"; [ "$code" = 200 ] || { echo "PUT $kind FAILED; STOP (engine written: $([ $kind = child ] && echo yes || echo no))"; exit 1; }
  curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" $H/workflows/$W -o $O/fetchback_${kind}586j3.json
done
python3 -I - $O $TE $TC <<'PY'
import json,sys
O,TE,TC=sys.argv[1:4]
def P(d):return {n['name']:json.dumps(n['parameters'],sort_keys=True) for n in d['nodes']}
for kind,tgt in (('eng',TE),('child',TC)):
  f=json.load(open(f'{O}/fetchback_{kind}586j3.json'));T=json.load(open(tgt));r=json.load(open(f'{O}/revert_{kind}586j3.json'))
  print(kind,'fetchback version',f['versionId'],'active',f.get('active'),'nodes',len(f['nodes']),'| params equal target:',P(f)==P(T),'| connections equal target:',f['connections']==T['connections'],'| settings equal:',f.get('settings')==r.get('settings'))
  print(' changed from revert:',sorted(n for n in P(f) if P(f)[n]!=P(r).get(n)))
PY
node /mnt/project-files/ask557/w4/build/test557.js --pair $O/fetchback_eng586j3.json $O/fetchback_child586j3.json | tail -1
rm -f $O/put_eng586j3.json $O/put_child586j3.json $O/prewrite_eng586j3.json $O/prewrite_child586j3.json
