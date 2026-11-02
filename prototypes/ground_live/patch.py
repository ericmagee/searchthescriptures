# GROUND on every judge (single judge = Build Independent Verdict; panel, reserves and alternates = Panel Build prompt)
# plus single-judge GLM/Qwen bodies as the panel's (empty replies at effort max, g4), and a Qwen primary panel body as Reserve Build's.
import hashlib,os
G=[('UNDERDETERMINED -- one clause of why;','UNDERDETERMINED -- one clause of why -- GROUND: <reason>;'),
   ('D<i>: WITHDRAWN;','D<i>: WITHDRAWN -- GROUND: <reason>;'),
   ('Any other link: D<i>: STANDS.','Any other link: D<i>: STANDS -- GROUND: <reason>. Every COLLISION POINTS line, whatever its grade, each LINK BROKEN line included, ends with GROUND: and one short sentence naming the reason the grade rests on. A line without GROUND is incomplete.')]
BIV_B=[("else if(__fam2==='openrouter')__nb={model:__model2,max_tokens:__base2,reasoning:{effort:'max'},messages:__m2};",
 "// GROUND live: glm and qwen as single judge take the panel's bodies (effort medium); at effort max the whole cap went to reasoning and the reply was empty (g4, 2026-11-01).\n"
 "else if(__fam2==='openrouter'&&__sj2==='glm')__nb={model:__model2,max_tokens:__base2,reasoning:{effort:'medium'},messages:__m2};\n"
 "else if(__fam2==='openrouter'&&__sj2==='qwen')__nb={model:__model2,max_tokens:Math.max(__base2*2,8000),reasoning:{effort:'medium'},messages:__m2};\n"
 "else if(__fam2==='openrouter')__nb={model:__model2,max_tokens:__base2,reasoning:{effort:'max'},messages:__m2};")]
PB_B=[("  else if(j.fam==='openrouter')body={model:j.api_model,max_tokens:j.max_tokens,reasoning:{effort:'max'},messages:m};",
 "  // GROUND live: qwen as a primary judge takes the reserve's qwen body (Reserve Build; BB-8510 S3).\n"
 "  else if(j.fam==='openrouter'&&j.seat==='qwen')body={model:j.api_model,max_tokens:Math.max(j.max_tokens*2,8000),reasoning:{effort:'medium'},messages:m,response_format:{type:'json_object'}};\n"
 "  else if(j.fam==='openrouter')body={model:j.api_model,max_tokens:j.max_tokens,reasoning:{effort:'max'},messages:m};")]
os.makedirs('new',exist_ok=True)
for name,reps in [('Build Independent Verdict',G+BIV_B),('Panel Build',G+PB_B)]:
    s=open('base_'+name.replace(' ','_')+'.js').read()
    for a,b in reps:
        assert s.count(a)==1,(name,a[:40],s.count(a)); s=s.replace(a,b)
    open('new/'+name+'.js','w').write(s)
    print(name, hashlib.md5(open('base_'+name.replace(' ','_')+'.js').read().encode()).hexdigest()[:8],'->',hashlib.md5(s.encode()).hexdigest()[:8], len(s))
