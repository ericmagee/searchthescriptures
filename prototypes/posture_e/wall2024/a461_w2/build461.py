# ASK 461 (W2): WALL-2024 Panel Judge Call (Y1VIsNB6KBrs1znP): remove the unreachable direct call nodes Call openai, Call gemini, Call grok and
# Call mimo (removed from the engine by pkgRPN). Provider Route outputs 1 to 4 go to Provider Removed Reply (ASK 460), as output 0 does.
# Provider Route expression and output count unchanged (index-aligned with the engine's Panel Judges Prep P1/P23). Usage: build461.py BASE TARGET
import json,sys
w=json.load(open(sys.argv[1]));t=json.loads(json.dumps(w))
RM=['Call openai','Call gemini','Call grok','Call mimo']
names=[n['name'] for n in t['nodes']];assert all(names.count(x)==1 for x in RM+['Provider Removed Reply','Provider Route','Call openrouter','Wrap'])
other=json.dumps([n for n in t['nodes'] if n['name'] not in RM])
for x in RM:assert x not in other,x+' is referenced by a kept node'
t['nodes']=[n for n in t['nodes'] if n['name'] not in RM]
r=t['connections']['Provider Route']['main'];assert len(r)==6
for i,x in enumerate(RM,1):
 assert r[i]==[{"node":x,"type":"main","index":0}],(i,r[i])
 r[i]=[{"node":"Provider Removed Reply","type":"main","index":0}]
 assert t['connections'].pop(x)=={"main":[[{"node":"Wrap","type":"main","index":0}]]},x
assert r[0]==[{"node":"Provider Removed Reply","type":"main","index":0}] and r[5]==[{"node":"Call openrouter","type":"main","index":0}]
s=json.dumps({'n':t['nodes'],'c':t['connections']})
for h in ['api.openai.com','generativelanguage','api.x.ai','xiaomimimo','api.deepseek','OpenAI Key','Gemini API Key','Grok API Key','MiMo-V2.6-Pro','DeepSeek Key']:assert h not in s,h
json.dump(t,open(sys.argv[2],'w'));print('nodes',len(w['nodes']),'->',len(t['nodes']))
