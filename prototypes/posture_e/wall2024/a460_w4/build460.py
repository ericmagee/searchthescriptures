# ASK 460 (W4): WALL-2024 Panel Judge Call (Y1VIsNB6KBrs1znP): remove "Call deepseek"; add "Provider Removed Reply" (code) that returns an
# error item; Provider Route output 0 -> Provider Removed Reply -> Wrap (so Store Reply records a FAIL-CLOSED error for the slot at once).
# Provider Route expression is unchanged (its list must stay index-aligned with the engine's Panel Judges Prep P1). Usage: build460.py LIVE TARGET
import json,sys
w=json.load(open(sys.argv[1]));t=json.loads(json.dumps(w))
old=[n for n in t['nodes'] if n['name']=='Call deepseek'];assert len(old)==1;old=old[0]
t['nodes']=[n for n in t['nodes'] if n['name']!='Call deepseek']
t['nodes'].append({"id":"460a0000-0000-4000-8000-00000000d5e1","name":"Provider Removed Reply","type":"n8n-nodes-base.code","typeVersion":2,"position":old['position'],
 "parameters":{"jsCode":"// ASK 460: the direct deepseek call was removed. An item routed here returns an error reply for its slot, so the engine's panel check fails the slot closed at once instead of waiting.\nconst q=$('Panel Judge Call').first().json.body||{};\nreturn [{json:{error:{message:'FAIL-CLOSED (ASK 460): panel slot '+q.ppj_slot+' was routed to the removed direct provider '+String(q.ppj_provider)+'. Panel seats must resolve to openrouter.'}}}];"}})
r=t['connections']['Provider Route']['main'];assert r[0]==[{"node":"Call deepseek","type":"main","index":0}]
r[0]=[{"node":"Provider Removed Reply","type":"main","index":0}]
assert t['connections'].pop('Call deepseek')=={"main":[[{"node":"Wrap","type":"main","index":0}]]}
t['connections']['Provider Removed Reply']={"main":[[{"node":"Wrap","type":"main","index":0}]]}
s=json.dumps(t['nodes'])
assert 'api.deepseek' not in s and 'DeepSeek Key' not in s and 'deepseek' not in json.dumps(t['connections']).lower()
json.dump(t,open(sys.argv[2],'w'));print('nodes',len(w['nodes']),'->',len(t['nodes']))
