# ASK 584 engine manual entry: behaviour only (section 0: no provenance in the body). Three parts; part 11.0 has two pairs (draft 2, W1 D1 Wall 11253).
# Bases are the parts of the ASK 583 cut (version 242), which equal slices of engine_manual v241.
import sys,hashlib,json
sys.path.insert(0,'/mnt/project-files/manual1123/w3/a583')
from split583 import split
c=open(sys.argv[1],encoding='utf-8').read(); assert hashlib.md5(c.encode()).hexdigest()=='d0e9efda3280624ce987050bc9568197'
parts=split(c); m=lambda s:hashlib.md5(s.encode()).hexdigest()
idx={'02.0':3,'11.0':20,'17.0':28}
P={'02.0':[{'old':"so qwen is refused and haiku, opus, qwen4max and spark are accepted.",'new':"so qwen is refused and haiku, opus, qwen4max, spark and sol62 are accepted."}],
 '11.0':[{'old':"lists the 10 debaters (claude, chatgpt, gemini, grok, mimo, haiku, opus, glm, qwen4max, spark)",'new':"lists the 11 debaters (claude, chatgpt, gemini, grok, mimo, haiku, opus, glm, qwen4max, spark, sol62)"},
  {'old':"the two drop-downs list the 10 debaters, each named",'new':"the two drop-downs list the 11 debaters, each named"}],
 '17.0':[{'old':"Haiku 5.5 (`haiku`) and Opus 5.5 (`opus`) debate, through OpenRouter (model_config provider openrouter).",'new':"Haiku 5.5 (`haiku`) and Opus 5.5 (`opus`) debate, through OpenRouter (model_config provider openrouter). Sol 6.2 (`sol62`, `openai/gpt-6.2-sol`) debates as well as judges: Init Seats' engine map and `dash_debaters()` both hold the key sol62, and the Any vs Any page offers it as \"Sol 6.2\". When Sol 6.2 debates, Init Seats takes the openai family (chatgpt, sol, sol62) off the panel, as it does when chatgpt debates. Not yet shown by a run that seats Sol 6.2."}]}
out={}
for part,i in idx.items():
    t=parts[i]; base=m(t); n0=len(t)
    for p in P[part]: assert t.count(p['old'])==1,(part,t.count(p['old'])); t=t.replace(p['old'],p['new'])
    out[part]={'base_md5':base,'base_len':n0,'new_md5':m(t),'new_len':len(t),'pairs':P[part],'first_line':[l for l in parts[i].split('\n') if l.strip()][0][:60]}
    print(part,base,n0,'->',m(t),len(t),'|',out[part]['first_line'])
json.dump(out,open('em_pairs_584_draft.json','w'),ensure_ascii=False,indent=1)
