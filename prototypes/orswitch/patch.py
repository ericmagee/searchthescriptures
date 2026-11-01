# Grok and MiMo to OpenRouter in ORACLE_DEBATE_V1 (base: active 8a7f48d3, live_fetch.json). Every anchor must match its expected count.
import json,hashlib,os
d=json.load(open('live_fetch.json'))['workflow']; N={n['name']:n for n in d['nodes']}
MAP_OLD="grok:'grok',chatgpt:'openrouter',mimo:'mimo'"; MAP_NEW="grok:'openrouter',chatgpt:'openrouter',mimo:'openrouter'"
P={}  # node -> list of (old,new,expected count)
for nm in ['Init Seats','Resolve Seats','Build Synthesis','Build Independent Verdict','Build Diagnostic Prompt']: P.setdefault(nm,[]).extend([(MAP_OLD,MAP_NEW,None),("{deepseek:'deepseek',gemini:'openrouter'","{deepseek:'openrouter',gemini:'openrouter'",1)])
P['Init Seats']+= [("grok:{fam:'grok',mc:'grok'},mimo:{fam:'mimo',mc:'mimo'}","grok:{fam:'openrouter',mc:'grok'},mimo:{fam:'openrouter',mc:'mimo'}",1),
  ("free.slice(4).filter(s=>JFAM_I[s]==='openrouter')","free.slice(4).filter(s=>JFAM_I[s]==='openrouter'&&s!=='grok'&&s!=='mimo'&&s!=='deepseek')",1),
  ("claude:{fam:'anthropic',mc:'claude_synthesis'}","claude:{fam:'openrouter',mc:'claude_synthesis'}",1),
  ("deepseek:{fam:'deepseek',mc:'deepseek_debate'}","deepseek:{fam:'openrouter',mc:'deepseek_debate'}",1)]
DB="if(fam==='openrouter'&&/^google\\//.test(model))"
for nm in ['D1 Build','C1 Build','D2 Build','C2 Build','D3 Build','C3 Build']:
    P[nm]=[(DB,"if(fam==='openrouter'&&/^anthropic\\//.test(model))return {model,max_tokens:tok,messages:[{role:'system',content:[{type:'text',text:sys,cache_control:{type:'ephemeral',ttl:'1h'}}]},...msgs]};  if(fam==='openrouter'&&/^(?:x-ai|xiaomi|deepseek)\\//.test(model))return {model,max_tokens:tok,messages:m};  "+DB,1)]
SB="else if(__fam2==='openrouter'&&/^google\\//.test(__model2))"
for nm in ['Build Synthesis','Build Independent Verdict','Build Diagnostic Prompt']:
    DS="Math.max(__base2,65536)" if nm=='Build Independent Verdict' else "__base2"
    P[nm].append((SB,"else if(__fam2==='openrouter'&&/^x-ai\\//.test(__model2))__nb={model:__model2,max_tokens:__base2,temperature:0,messages:__m2}; else if(__fam2==='openrouter'&&/^xiaomi\\//.test(__model2))__nb={model:__model2,max_tokens:__base2,messages:__m2}; else if(__fam2==='openrouter'&&/^deepseek\\//.test(__model2))__nb={model:__model2,max_tokens:"+DS+",messages:__m2}; "+SB,1))
PB="else if(j.fam==='openrouter'&&/^google\\//.test(j.api_model))"
for nm in ['Panel Build','Reserve Build']:
    P[nm]=[(PB,"else if(j.fam==='openrouter'&&/^x-ai\\//.test(j.api_model))body={model:j.api_model,max_tokens:j.max_tokens,temperature:0,messages:m};  else if(j.fam==='openrouter'&&/^xiaomi\\//.test(j.api_model))body={model:j.api_model,max_tokens:Math.max(j.max_tokens,65536),messages:m,reasoning:{enabled:false}};  else if(j.fam==='openrouter'&&/^deepseek\\//.test(j.api_model))body={model:j.api_model,max_tokens:Math.max(j.max_tokens,65536),temperature:0,messages:m};  "+PB,None)]
P['Format Markdown']=[("(r.defender_engine === 'mimo' && /\\//.test(r.defender_model || ''))","(r.defender_engine === 'mimo' && /\\//.test(r.defender_model || '') && !/^xiaomi\\//.test(r.defender_model || ''))",1),
  ("(r.challenger_engine === 'mimo' && /\\//.test(r.challenger_model || ''))","(r.challenger_engine === 'mimo' && /\\//.test(r.challenger_model || '') && !/^xiaomi\\//.test(r.challenger_model || ''))",1),
  ("/^grok/.test(jm) ? 'Grok'","/(^|\\/)grok/.test(jm) ? 'Grok'",1)]
os.makedirs('new',exist_ok=True); os.makedirs('base',exist_ok=True); rep=[]
for nm,ps in P.items():
    c0=N[nm]['parameters']['jsCode']; c=c0
    for old,new,exp in ps:
        k=c.count(old); assert k>=1 and (exp is None or k==exp),(nm,old,k)
        c=c.replace(old,new); rep.append((nm,old[:50],k))
    open(f'base/{nm}.js','w').write(c0); open(f'new/{nm}.js','w').write(c)
    print(f"{nm:28} base {hashlib.md5(c0.encode()).hexdigest()[:8]} new {hashlib.md5(c.encode()).hexdigest()[:8]} +{len(c)-len(c0)}")
for r in rep: print('  ',r)
