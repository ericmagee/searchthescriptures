# Panel change (operator 13:16 CST 11-17, W4 thread): luna and grok removed; haiku on the panel; glm then mimo at the end of the alternates, mimo last.
import json,sys
w=json.load(open(sys.argv[1]));N={n['name']:n for n in w['nodes']}
def rep(nm,old,new):
    j=N[nm]['parameters']['jsCode'];assert j.count(old)==1,(nm,j.count(old),old[:60]);N[nm]['parameters']['jsCode']=j.replace(old,new)
O_OLD="['chatgpt','sol','luna','hydrogen','gemini','argon','haiku','spark','qwen','grok']"
O_NEW="['chatgpt','sol','haiku','hydrogen','gemini','argon','spark','qwen','glm','mimo']"
rep('Init Seats',"const ORDER0="+O_OLD+";","const ORDER0="+O_NEW+"; /* operator 13:16 CST 11-17: luna and grok removed; haiku on the panel; glm, then mimo last, at the end of the alternates */")
rep('Init Seats',"const __ALT=['hydrogen','gemini','argon','haiku','spark','grok']; /* ASK 358: grok last (operator 11-17) */","const __ALT=['hydrogen','gemini','argon','spark','glm','mimo']; /* operator 13:16 CST 11-17: haiku to the panel; grok removed; glm, then mimo last */")
rep('Init Seats',"s=>JFAM_I[s]==='openrouter'&&s!=='mimo'&&JUDGE_TIME_REMOVED.indexOf(s)<0);","s=>JFAM_I[s]==='openrouter'&&JUDGE_TIME_REMOVED.indexOf(s)<0); /* operator 13:16 CST 11-17: mimo is an alternate (the last) */")
rep('Accept Build',"const ORDER="+O_OLD+";","const ORDER="+O_NEW+"; /* operator 13:16 CST 11-17, same list as Init Seats ORDER0 */")
json.dump(w,open(sys.argv[2],'w'))
print('ok')
