#!/usr/bin/env python3
"""s436 (ruling 446, prompt caching for every judge model): the one call wrapper shared by every OpenRouter call node gains a cache marker on the
longest user message (the debate transcript) for google/, qwen/, openai/ and anthropic/ models, at send time only; stored bodies are unchanged, so
no reader of a body sees a new form. The Z.AI pin is kept as it was. Grok, GLM, MiMo, MiniMax and DeepSeek cache automatically at their providers
(OpenRouter docs; endpoint cache-read prices) and keep the session_id sticky key every OpenRouter body already carries. Input: a fetch of live
(argv[1]); output: base_bodies.json and new_bodies.json, {node: [param key, expression]}."""
import json,os,sys
R=os.path.dirname(os.path.abspath(__file__))
live=json.load(open(sys.argv[1]))
OLD="={{ (__b=>(__b&&typeof __b==='object'&&/^z-ai\\//.test(String(__b.model||'')))?Object.assign({},__b,{provider:{order:['z-ai'],allow_fallbacks:false} }):__b)"
NEW="={{ "+open(os.path.join(R,'wrap.txt')).read().strip()
assert '}}' not in NEW[3:] and '{{' not in NEW[3:]
base={};new={}
for n in live['nodes']:
    p=n['parameters']
    for k in ('jsonBody','body'):
        v=p.get(k)
        if isinstance(v,str) and v.startswith(OLD):
            assert v.count(OLD)==1
            base[n['name']]=[k,v];new[n['name']]=[k,NEW+v[len(OLD):]]
json.dump({'base_versionId':live['versionId'],'nodes':base},open(os.path.join(R,'base_bodies.json'),'w'),indent=1)
json.dump(new,open(os.path.join(R,'new_bodies.json'),'w'),indent=1)
print('wrapped',len(new),'call nodes on',live['versionId'])
