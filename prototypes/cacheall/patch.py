# cacheall: prompt caching for every model in the flow.
#  - every OpenRouter request gets session_id = <run token>:<role> (OpenRouter sticky routing; automatic caches for OpenAI, Grok, GLM, MiMo, Gemini
#    hit only on the same provider), copied into cures by cureBody's deep copy;
#  - Gemini (google/) and Qwen (qwen/) get a cache_control marker on the system message (Gemini explicit; Qwen explicit-only);
#  - Claude markers stay as cachefix set them; DeepSeek (own provider) caches automatically, and the round readers now also read prompt_cache_hit_tokens.
import json,os,hashlib,sys
w=json.load(open(sys.argv[1])); N={n['name']:n for n in w['nodes']}
os.makedirs('base',exist_ok=True); os.makedirs('new',exist_ok=True)
H=("// cacheall: OpenRouter session id for cache stickiness; Gemini and Qwen system message marked for caching.\n"
   "const __orc=(b,fam,model,key)=>{if(fam!=='openrouter'||!b||!Array.isArray(b.messages))return b;const o={...b,session_id:String(key).slice(0,128)};"
   "if(/^(?:google|qwen)\\//.test(String(model)))o.messages=b.messages.map(m=>m.role==='system'&&typeof m.content==='string'?{role:'system',content:[{type:'text',text:m.content,cache_control:{type:'ephemeral'}}]}:m);return o;};\n")
P={}
for r in ['D1','C1','D2','C2','D3','C3']:
    P[r+' Build']=[("body:bodyFor(seat.fam,seat.model,seat.tok,sys,msgs)};};","body:__orc(bodyFor(seat.fam,seat.model,seat.tok,sys,msgs),seat.fam,seat.model,TOK+':'+(seat===R.defender?'defender':'challenger'))};};",1)]
    P[r+' Extract']=[("cache_read_input_tokens:(x.prompt_tokens_details&&x.prompt_tokens_details.cached_tokens)||0};","cache_read_input_tokens:(x.prompt_tokens_details&&x.prompt_tokens_details.cached_tokens)||x.prompt_cache_hit_tokens||0};",1)]
for nm,role in [('Build Independent Verdict','single'),('Build Synthesis','synthesis'),('Build Diagnostic Prompt','diagnostic')]:
    P[nm]=[("__out[__bf]=__nb;","__out[__bf]=__orc(__nb,__fam2,__model2,__S2.run_token+':"+role+":'+__sj2);",1)]
P['Panel Build']=[("api_model:j.api_model,body};});","api_model:j.api_model,body:__orc(body,j.fam,j.api_model,TOK+':panel:'+j.seat)};});",1)]
P['Reserve Build']=[("return [{json:{run_token:TOK,seat:j.seat,fam:j.fam,jidx0,api_model:j.api_model,body}}];","return [{json:{run_token:TOK,seat:j.seat,fam:j.fam,jidx0,api_model:j.api_model,body:__orc(body,j.fam,j.api_model,TOK+':reserve:'+j.seat)}}];",1)]
P['Alternate Build']=[("api_model:a.api_model,max_tokens:a.max_tokens,body}}});});","api_model:a.api_model,max_tokens:a.max_tokens,body:__orc(body,'openrouter',a.api_model,$('Init Seats').first().json.run_token+':alternate:'+a.seat)}}});});",1)]
for nm,reps in P.items():
    s=N[nm]['parameters']['jsCode'];t=s
    for a,b,k in reps:
        assert t.count(a)==k,(nm,a[:60],t.count(a)); t=t.replace(a,b)
    if 'Build' in nm or nm in ('Build Independent Verdict','Build Synthesis','Build Diagnostic Prompt'): t=H+t
    open(f'base/{nm}.js','w').write(s); open(f'new/{nm}.js','w').write(t)
    print(f"{nm:26} {hashlib.md5(s.encode()).hexdigest()[:8]}->{hashlib.md5(t.encode()).hexdigest()[:8]}")
