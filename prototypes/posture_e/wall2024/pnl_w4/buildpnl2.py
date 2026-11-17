# Panel change rev 2 (operator 13:16 CST 11-17; GLM 5.3 and mimo 2.6 failed the check call, Wall 7812): luna and grok removed; haiku on the panel; glm and mimo NOT added.
import json,sys
w=json.load(open(sys.argv[1]));N={n['name']:n for n in w['nodes']}
def rep(nm,old,new):
    j=N[nm]['parameters']['jsCode'];assert j.count(old)==1,(nm,j.count(old),old[:60]);N[nm]['parameters']['jsCode']=j.replace(old,new)
O_OLD="['chatgpt','sol','luna','hydrogen','gemini','argon','haiku','spark','qwen','grok']"
O_NEW="['chatgpt','sol','haiku','hydrogen','gemini','argon','spark','qwen']"
rep('Init Seats',"const ORDER0="+O_OLD+";","const ORDER0="+O_NEW+"; /* operator 13:16 CST 11-17: luna and grok removed; haiku on the panel */")
rep('Init Seats',"const __ALT=['hydrogen','gemini','argon','haiku','spark','grok']; /* ASK 358: grok last (operator 11-17) */","const __ALT=['hydrogen','gemini','argon','spark']; /* operator 13:16 CST 11-17: haiku to the panel; grok removed */")
rep('Accept Build',"const ORDER="+O_OLD+";","const ORDER="+O_NEW+"; /* operator 13:16 CST 11-17, same list as Init Seats ORDER0 */")
json.dump(w,open(sys.argv[2],'w'))
print('ok')
