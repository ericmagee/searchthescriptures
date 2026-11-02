# cachefix: (1) record OpenRouter cache writes (prompt_tokens_details.cache_write_tokens) in the six round readers, Build Save Body and Panel Tokens;
# (2) Claude debater requests: system split at the DEFENSE DISCIPLINE block so D3 (no DD) reads D1's cached instructions, and the last message
# carries a cache marker so the next round reads the earlier ones; (3) D2 replays D1's own opening message, so D2's prefix matches what D1 cached.
import json,os,hashlib,sys
w=json.load(open(sys.argv[1])); N={n['name']:n for n in w['nodes']}
os.makedirs('base',exist_ok=True); os.makedirs('new',exist_ok=True)
P={}
X1="cache_creation_input_tokens:0,cache_read_input_tokens:(x.prompt_tokens_details&&x.prompt_tokens_details.cached_tokens)||0"
X1N="cache_creation_input_tokens:(x.prompt_tokens_details&&x.prompt_tokens_details.cache_write_tokens)||0,cache_read_input_tokens:(x.prompt_tokens_details&&x.prompt_tokens_details.cached_tokens)||0"
for r in ['D1','C1','D2','C2','D3','C3']: P[r+' Extract']=[(X1,X1N,1)]
for v in ['x','u']:
    P.setdefault('Build Save Body',[]).append((f"cache_creation_input_tokens:0,cache_read_input_tokens:Number(({v}.prompt_tokens_details&&{v}.prompt_tokens_details.cached_tokens)||{v}.prompt_cache_hit_tokens)||0",
      f"cache_creation_input_tokens:Number({v}.prompt_tokens_details&&{v}.prompt_tokens_details.cache_write_tokens)||0,cache_read_input_tokens:Number(({v}.prompt_tokens_details&&{v}.prompt_tokens_details.cached_tokens)||{v}.prompt_cache_hit_tokens)||0",1))
PT="add.r+=Number((u.prompt_tokens_details&&u.prompt_tokens_details.cached_tokens)||u.prompt_cache_hit_tokens)||0;seen.push(n);"
P['Panel Tokens']=[(PT,"add.w+=Number(u.prompt_tokens_details&&u.prompt_tokens_details.cache_write_tokens)||0;"+PT,2)]
B0="const bodyFor=(fam,model,tok,sys,msgs)=>{"
B0N=("// cachefix: Claude cache markers. System split at the DEFENSE DISCIPLINE block (D3 sends the instructions without it); last message marked.\n"
 "const __cc={type:'ephemeral',ttl:'1h'};const __sysB=s=>{const i=s.indexOf('\\n\\n=== DEFENSE DISCIPLINE');return i>0?[{type:'text',text:s.slice(0,i),cache_control:__cc},{type:'text',text:s.slice(i),cache_control:__cc}]:[{type:'text',text:s,cache_control:__cc}];};\n"
 "const __mk=m=>m.map((x,k)=>k===m.length-1&&typeof x.content==='string'?{role:x.role,content:[{type:'text',text:x.content,cache_control:__cc}]}:x);\n"+B0)
A1="if(fam==='anthropic')return {model,max_tokens:tok,system:[{type:'text',text:sys,cache_control:{type:'ephemeral',ttl:'1h'}}],messages:msgs};"
A1N="if(fam==='anthropic')return {model,max_tokens:tok,system:__sysB(sys),messages:__mk(msgs)};"
A2="return {model,max_tokens:tok,messages:[{role:'system',content:[{type:'text',text:sys,cache_control:{type:'ephemeral',ttl:'1h'}}]},...msgs]};"
A2N="return {model,max_tokens:tok,messages:[{role:'system',content:__sysB(sys)},...__mk(msgs)]};"
for r in ['D1','C1','D2','C2','D3','C3']: P[r+' Build']=[(B0,B0N,1),(A1,A1N,1),(A2,A2N,1)]
P['D1 Build'].append(("return [{json:{run_token:TOK,round:'D1',call:call(R.defender,sys,msgs)}}];","return [{json:{run_token:TOK,round:'D1',opening_user:msgs[0].content,call:call(R.defender,sys,msgs)}}];",1))
P['D2 Build'].append(("const msgs=[{role:'user',content:'DEBATE TOPIC: '+I.topic},","const msgs=[{role:'user',content:($('D1 Build').first().json.opening_user||'DEBATE TOPIC: '+I.topic)},",1))
for nm,reps in P.items():
    s=N[nm]['parameters']['jsCode'];t=s
    for a,b,k in reps:
        assert t.count(a)==k,(nm,a[:60],t.count(a)); t=t.replace(a,b)
    open(f'base/{nm}.js','w').write(s); open(f'new/{nm}.js','w').write(t)
    print(f"{nm:18} {hashlib.md5(s.encode()).hexdigest()[:8]}->{hashlib.md5(t.encode()).hexdigest()[:8]}")
