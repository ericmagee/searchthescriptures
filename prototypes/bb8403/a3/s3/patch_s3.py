# BB-8403 S3 (P2D revision 5/5a, BB-8455/8458): chatgpt (model prefix openai/) at reasoning effort medium with
# max_tokens max(mt*2,8000) at its 12 OpenRouter body sites; Panel Build's glm primary judge at effort medium.
import os,sys
B,N='base','new'
CM="// BB-8403 S3: chatgpt via OpenRouter (openai/) at reasoning effort medium; at max it spent the whole 32,000 in reasoning and returned no text (ODV1-29876 C1). Token budget as its openai branch: max(mt*2,8000).\n"
DEB_OLD=" if(fam==='openrouter')return {model,max_tokens:tok,reasoning:{effort:/^(?:qwen\\/|z-ai\\/glm-)/.test(model)?'medium':'max'},messages:m};\n"
DEB_NEW=" "+CM+" if(fam==='openrouter'&&/^openai\\//.test(model))return {model,max_tokens:Math.max(tok*2,8000),reasoning:{effort:'medium'},messages:m};\n"+DEB_OLD
SYN_OLD="else if(__fam2==='openrouter')__nb={model:__model2,max_tokens:__base2,reasoning:{effort:'max'},messages:__m2};\n"
SYN_NEW=CM+"else if(__fam2==='openrouter'&&/^openai\\//.test(__model2))__nb={model:__model2,max_tokens:Math.max(__base2*2,8000),reasoning:{effort:'medium'},messages:__m2};\n"+SYN_OLD
PAN_OLD="  else if(j.fam==='openrouter')body={model:j.api_model,max_tokens:j.max_tokens,reasoning:{effort:'max'},messages:m};\n"
PAN_NEW=("  "+CM+"  // BB-8403 S3: glm as a primary judge takes the reserve's glm body, effort medium (Reserve Build; BB-5693 rev 6).\n"
 "  else if(j.fam==='openrouter'&&/^openai\\//.test(j.api_model))body={model:j.api_model,max_tokens:Math.max(j.max_tokens*2,8000),reasoning:{effort:'medium'},messages:m};\n"
 "  else if(j.fam==='openrouter'&&j.seat==='glm')body={model:j.api_model,max_tokens:j.max_tokens,reasoning:{effort:'medium'},messages:m};\n"+PAN_OLD)
RES_OLD=" else if(j.fam==='openrouter'&&j.seat==='glm')body={model:j.api_model,max_tokens:j.max_tokens,reasoning:{effort:'medium'},messages:m};\n"
RES_NEW=" "+CM+" else if(j.fam==='openrouter'&&/^openai\\//.test(j.api_model))body={model:j.api_model,max_tokens:Math.max(j.max_tokens*2,8000),reasoning:{effort:'medium'},messages:m};\n"+RES_OLD
ALT_OLD=" const body=a.seat==='glm'?"
ALT_NEW=" "+CM+" const body=/^openai\\//.test(a.api_model)?{model:a.api_model,max_tokens:Math.max(a.max_tokens*2,8000),reasoning:{effort:'medium'},messages:msgs}:a.seat==='glm'?"
P={'D1_Build':[(DEB_OLD,DEB_NEW)],'C1_Build':[(DEB_OLD,DEB_NEW)],'D2_Build':[(DEB_OLD,DEB_NEW)],'C2_Build':[(DEB_OLD,DEB_NEW)],'D3_Build':[(DEB_OLD,DEB_NEW)],'C3_Build':[(DEB_OLD,DEB_NEW)],
 'Build_Synthesis':[(SYN_OLD,SYN_NEW)],'Build_Independent_Verdict':[(SYN_OLD,SYN_NEW)],'Build_Diagnostic_Prompt':[(SYN_OLD,SYN_NEW)],
 'Panel_Build':[(PAN_OLD,PAN_NEW)],'Reserve_Build':[(RES_OLD,RES_NEW)],'Alternate_Build':[(ALT_OLD,ALT_NEW)]}
n=0
for f,reps in P.items():
  c=open(f'{B}/{f}.js').read()
  for o,nw in reps:
    k=c.count(o)
    if k!=1: sys.exit(f'ANCHOR {f}: count {k}')
    c=c.replace(o,nw); n+=1
  open(f'{N}/{f}.js','w').write(c)
print('replacements',n)
