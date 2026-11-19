# ASK 459 (W4): ODV1 Cure Call (c7366RPLb8vdMQg6): remove "Cure Call deepseek"; Cure Call Route output 0 -> Provider Removed Stop;
# Provider Removed Stop error text names deepseek among the removed providers. Usage: python3 build459.py LIVE.json TARGET.json
import json,sys
w=json.load(open(sys.argv[1]));t=json.loads(json.dumps(w))
assert [n['name'] for n in t['nodes']].count('Cure Call deepseek')==1
t['nodes']=[n for n in t['nodes'] if n['name']!='Cure Call deepseek']
r=t['connections']['Cure Call Route']['main'];assert r[0]==[{"node":"Cure Call deepseek","type":"main","index":0}]
r[0]=[{"node":"Provider Removed Stop","type":"main","index":0}];t['connections'].pop('Cure Call deepseek',None)
p=[n for n in t['nodes'] if n['name']=='Provider Removed Stop'][0]['parameters'];c=p['jsCode']
for o,nw in [("(openai, gemini, grok or mimo)","(openai, gemini, grok, mimo or deepseek)"),("Seats must resolve to openrouter or deepseek (","Seats must resolve to openrouter ("),("(every seat runs through openrouter or deepseek)","(every seat runs through openrouter)")]:
  assert c.count(o)==1,o;c=c.replace(o,nw)
p['jsCode']=c
assert 'deepseek' not in json.dumps(t['connections']).lower()
json.dump(t,open(sys.argv[2],'w'));print('nodes',len(w['nodes']),'->',len(t['nodes']));print(c)
