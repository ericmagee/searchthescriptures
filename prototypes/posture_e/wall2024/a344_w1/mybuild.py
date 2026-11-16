import json,hashlib,sys
W=json.load(open(sys.argv[1]))
N=['qwen4max','ernie55']
def add_list(c,old):  # append three seats to an exact list literal
    assert c.count(old)==1,old; return c.replace(old,old[:-1]+','+','.join("'%s'"%s for s in N)+']')
def add_map(c,old,vals):
    assert c.count(old)==1,old; return c.replace(old,old[:-1]+','+','.join("%s:'%s'"%(s,v) for s,v in zip(N,vals))+'}')
O="['chatgpt','sol','luna','hydrogen','gemini','grok','argon','haiku','spark','qwen']"
for n in W['nodes']:
  c=n['parameters'].get('jsCode')
  if n['name']=='Init Seats':
    c=add_list(c,O); c=add_list(c,"['hydrogen','gemini','grok','argon','haiku','spark']")
    c=add_map(c,"argon:'google',spark:'meta'}",['qwen','baidu'])
    c=add_map(c,"hydrogen:'openrouter',spark:'openrouter'}",['openrouter']*2)
  elif n['name']=='Resolve Seats':
    c=add_map(c,"hydrogen:'openrouter',spark:'openrouter'}",['openrouter']*2)
  elif n['name']=='Accept Build':
    c=add_list(c,O); c=add_map(c,"hydrogen:'hydrogen',spark:'spark'}",N)
  else: continue
  n['parameters']['jsCode']=c
json.dump(W,open(sys.argv[2],'w'))
print('src',hashlib.sha256(json.dumps(json.load(open(sys.argv[1]))['nodes'],sort_keys=True).encode()).hexdigest()[:12])
print('mine',hashlib.sha256(json.dumps(W['nodes'],sort_keys=True).encode()).hexdigest()[:12])
