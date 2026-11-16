# ASK 344b build: add seats qwen4max (qwen/qwen4-max, family qwen) and dsv41 (deepseek/deepseek-v4.1-flash-1017,
# family deepseek) and ernie55 (baidu/ernie-5.5-flash-preview:free, family baidu, Eric 14:28) to the END of the alternate order. Eric 14:24 CST 11-16 + card "Alternates only" 14:25.
# usage: python3 a344/build344.py <live.json> <out_target.json>
# Every edit is an exact string that must occur exactly once in its node; nothing else changes.
import json,sys,hashlib
src,out=sys.argv[1:3]
W=json.load(open(src))
OLD_ORDER="['chatgpt','sol','luna','hydrogen','gemini','grok','argon','haiku','spark','qwen']"
NEW_ORDER="['chatgpt','sol','luna','hydrogen','gemini','grok','argon','haiku','spark','qwen','qwen4max','dsv41','ernie55']"
JF_OLD="hydrogen:'openrouter',spark:'openrouter'}"
JF_NEW="hydrogen:'openrouter',spark:'openrouter',qwen4max:'openrouter',dsv41:'openrouter',ernie55:'openrouter'}"
E={
 'Init Seats':[
  (OLD_ORDER,NEW_ORDER),
  ("argon:'google',spark:'meta'}","argon:'google',spark:'meta',qwen4max:'qwen',dsv41:'deepseek',ernie55:'baidu'}"),
  ("const __ALT=['hydrogen','gemini','grok','argon','haiku','spark'];","const __ALT=['hydrogen','gemini','grok','argon','haiku','spark','qwen4max','dsv41','ernie55'];"),
  (JF_OLD,JF_NEW)],
 'Resolve Seats':[(JF_OLD,JF_NEW)],
 'Accept Build':[
  ("hydrogen:'hydrogen',spark:'spark'};","hydrogen:'hydrogen',spark:'spark',qwen4max:'qwen4max',dsv41:'dsv41',ernie55:'ernie55'};"),
  (OLD_ORDER,NEW_ORDER)],
}
done=[]
for n in W['nodes']:
  if n['name'] in E:
    c=n['parameters']['jsCode']
    for a,b in E[n['name']]:
      k=c.count(a); assert k==1,(n['name'],a,k)
      c=c.replace(a,b); done.append((n['name'],a[:50]))
    n['parameters']['jsCode']=c
assert len(done)==7,done
json.dump(W,open(out,'w'))
print('edits',len(done)); [print(' ',d) for d in done]
print('sha',hashlib.sha256(json.dumps(W['nodes'],sort_keys=True).encode()).hexdigest()[:12])
