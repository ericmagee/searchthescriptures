# Order BB-8510 S2 (P2D BB-8511): gemini seat to OpenRouter (google/gemini-3.8-flash): route maps to 'openrouter'; a google/ branch at
# the 11 body sites the gemini branch had, effort medium, max_tokens and temperature as the gemini branch gave. S3: qwen alternate and
# reserve bodies at effort medium, max_tokens max(mt*2,8000), JSON kept. Base: live 6ffe5f8d (s1/new + s3/new); re-applies on S1's version.
import sys
B,N='base','new'
CM="// BB-8510 S2: gemini via OpenRouter (google/), effort medium; max_tokens and temperature as its former generationConfig (KB-0042, KB-0077).\n"
MAP=[("Init_Seats","gemini:{fam:'gemini',mc:'gemini'}","gemini:{fam:'openrouter',mc:'gemini'}"),
     ("Init_Seats","const JFAM_I={deepseek:'deepseek',gemini:'gemini',","const JFAM_I={deepseek:'deepseek',gemini:'openrouter',"),
     ("Resolve_Seats","const JFAM={deepseek:'deepseek',gemini:'gemini',","const JFAM={deepseek:'deepseek',gemini:'openrouter',")]
for f in ['Build_Synthesis','Build_Independent_Verdict','Build_Diagnostic_Prompt']:
    MAP.append((f,"const __JFAM2={deepseek:'deepseek',gemini:'gemini',","const __JFAM2={deepseek:'deepseek',gemini:'openrouter',"))
DEB_A=" if(fam==='openrouter'&&/^openai\\//.test(model))return "
DEB_I=" "+CM+" if(fam==='openrouter'&&/^google\\//.test(model))return {model,max_tokens:tok,reasoning:{effort:'medium'},messages:m};\n"
SYN_A="else if(__fam2==='openrouter'&&/^openai\\//.test(__model2))"
SYN_I=CM+"else if(__fam2==='openrouter'&&/^google\\//.test(__model2))__nb={model:__model2,max_tokens:__base2+8192,temperature:0,reasoning:{effort:'medium'},messages:__m2};\n"
PAN_A="  else if(j.fam==='openrouter'&&/^openai\\//.test(j.api_model))"
PAN_I="  "+CM+"  else if(j.fam==='openrouter'&&/^google\\//.test(j.api_model))body={model:j.api_model,max_tokens:j.max_tokens+8192,temperature:0,reasoning:{effort:'medium'},messages:m};\n"
RES_A=" else if(j.fam==='openrouter'&&/^openai\\//.test(j.api_model))"
RES_I=" "+CM+" else if(j.fam==='openrouter'&&/^google\\//.test(j.api_model))body={model:j.api_model,max_tokens:j.max_tokens+8192,temperature:0,reasoning:{effort:'medium'},messages:m};\n"
CQ="// BB-8510 S3: qwen as reserve or alternate at effort medium, max_tokens max(mt*2,8000); at effort max, 32,000 it returned content null (29912).\n"
RQ_O=" else if(j.fam==='openrouter'&&j.seat==='qwen')body={model:j.api_model,max_tokens:j.max_tokens,reasoning:{effort:'max'},messages:m,response_format:{type:'json_object'}};\n"
RQ_N=" "+CQ+" else if(j.fam==='openrouter'&&j.seat==='qwen')body={model:j.api_model,max_tokens:Math.max(j.max_tokens*2,8000),reasoning:{effort:'medium'},messages:m,response_format:{type:'json_object'}};\n"
AQ_O="a.seat==='qwen'?{model:a.api_model,max_tokens:a.max_tokens,reasoning:{effort:'max'},messages:msgs,response_format:{type:'json_object'}}"
AQ_N="a.seat==='qwen'?{model:a.api_model,max_tokens:Math.max(a.max_tokens*2,8000),reasoning:{effort:'medium'},messages:msgs,response_format:{type:'json_object'}}"
P={}
for f,o,n in MAP: P.setdefault(f,[]).append((o,n))
for f in ['D1_Build','C1_Build','D2_Build','C2_Build','D3_Build','C3_Build']: P.setdefault(f,[]).append((DEB_A,DEB_I+DEB_A))
for f in ['Build_Synthesis','Build_Independent_Verdict','Build_Diagnostic_Prompt']: P.setdefault(f,[]).append((SYN_A,SYN_I+SYN_A))
P.setdefault('Panel_Build',[]).append((PAN_A,PAN_I+PAN_A))
P.setdefault('Reserve_Build',[]).append((RES_A,RES_I+RES_A)); P['Reserve_Build'].append((RQ_O,RQ_N))
P.setdefault('Alternate_Build',[]).append((AQ_O,AQ_N))
n=0
for f,reps in P.items():
  c=open(f'{B}/{f}.js').read()
  for o,nw in reps:
    k=c.count(o)
    if k!=1: sys.exit(f'ANCHOR {f}: count {k}: {o[:60]}')
    c=c.replace(o,nw); n+=1
  open(f'{N}/{f}.js','w').write(c)
print('nodes',len(P),'replacements',n)
