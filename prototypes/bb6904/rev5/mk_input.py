# Builds qualify_wrongif5.cjs input from the stored rows and the reader's facts file (Worker_A3's rev5facts format, BB-7121):
# finish_reason comes from the facts file's calls block (per alternate seat), not from alternates_tried's why (27383 predates G).
# Usage: python3 mk_input.py <rows.json: [{exec_id, judge_api_model, judge_seat}]> <facts.json>... > input.json
import json,sys
rows=json.load(open(sys.argv[1]));out={'rows':[],'tried':[]}
for p in sys.argv[2:]:
 f=json.load(open(p));e=f['exec_id'];fin={c['seat']:c['finish_reason'] for c in f['calls']}
 out['rows']+=[{**r,'qualify':f['qualify']} for r in rows if r['exec_id']==e]
 out['tried']+=[{'exec_id':e,'removed_seat':t['removed_seat'],'result':t['result'],'finish_reason':fin.get(t.get('alternate'))} for t in f['alternates_tried'] if t['result']=='NOT SEATED']
print(json.dumps(out))
