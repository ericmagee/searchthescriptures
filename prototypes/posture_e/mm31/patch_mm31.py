#!/usr/bin/env python3
"""GLM removed from the judges; MiniMax M3.1 Flash (model_config seat alt_minimax31, minimax/minimax-m3.1-flash) takes its panel place.
Over the committed live copy zai/fetchback_zai2.json (74f2b9e3)."""
import json, os
ROOT=os.path.dirname(os.path.abspath(__file__))
BASE=json.load(open(os.path.join(ROOT,'..','zai','fetchback_zai2.json')))
E=[("const ORDER0=['deepseek','gemini','glm','chatgpt','qwen','grok','sol'];",
    "const ORDER0=['deepseek','gemini','alt_minimax31','chatgpt','qwen','grok','sol']; // 2026-11-03 (operator: \"replace with minimax/minimax-m3.1-flash\"): GLM judges no more (32500: 1,290 s, all 131,072 tokens, no judgment); MiniMax M3.1 Flash takes its place",1,1),
   ("const ORDER=['deepseek','gemini','glm','chatgpt','mimo','qwen','grok','sol'];",
    "const ORDER=['deepseek','gemini','alt_minimax31','chatgpt','qwen','grok','sol']; // 2026-11-03: GLM and mimo judge no more; MiniMax M3.1 Flash takes GLM's place",1,1),
   ("glm:'glm',","glm:'glm',alt_minimax31:'alt_minimax31',",1,1),
   ("glm:'openrouter',","glm:'openrouter',alt_minimax31:'openrouter',",5,None)]
out={}
for a,b,nn,cc in E:
    hit=0
    for nd in BASE['nodes']:
        c=out.get(nd['name']) or (nd.get('parameters') or {}).get('jsCode')
        if not c or a not in c: continue
        if cc is not None: assert c.count(a)==cc,(nd['name'],a[:40],c.count(a))
        out[nd['name']]=c.replace(a,b);hit+=1
    assert hit==nn,(a[:50],hit,nn)
for nd in BASE['nodes']:
    if nd['name'] in out:
        open(os.path.join(ROOT,'base',nd['name']+'.js'),'w').write(nd['parameters']['jsCode']);open(os.path.join(ROOT,'new',nd['name']+'.js'),'w').write(out[nd['name']])
print('nodes patched',len(out),sorted(out))
