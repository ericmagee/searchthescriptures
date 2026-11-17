import json,os,time,urllib.request
H={'X-N8N-API-KEY':os.environ['N8N_API_KEY'],'Content-Type':'application/json'};B='https://truthapp.app.n8n.cloud/api/v1/';WF='kOtIN8QDQHSwItfw'
D='/tmp/claude-0/-home-user/86d59483-62fd-5fa0-b8c4-6322500f4823/scratchpad/a368/'
def g(u,m='GET',b=None):
  return json.load(urllib.request.urlopen(urllib.request.Request(B+u,method=m,headers=H,data=None if b is None else json.dumps(b).encode()),timeout=600))
def post(body):
  urllib.request.urlopen(urllib.request.Request('https://truthapp.app.n8n.cloud/webhook/w4-ask368-ds',method='POST',headers={'Content-Type':'application/json'},data=json.dumps(body).encode()),timeout=120).read()
calls=json.load(open(D+'calls.json'));res={}
if os.path.exists(D+'results.json'):res=json.load(open(D+'results.json'))
CAP=2.05;spent=sum(r.get('usd',0) for r in res.values())
print('active',g('workflows/'+WF+'/activate','POST').get('active'),flush=True)
seen=set(x['id'] for x in g('executions?workflowId='+WF+'&limit=250')['data'])
todo=[c for c in calls if c['key'] not in res];BATCH=8
try:
 for i in range(0,len(todo),BATCH):
  if spent>=CAP: print('CAP reached',spent,flush=True);break
  if g('executions?workflowId=moMxiV4Irg1uRBZN&status=running&limit=5')['data']: print('debate run started; pausing',flush=True);break
  bat=todo[i:i+BATCH]
  for c in bat: post({'key':c['key'],'body':c['body']});time.sleep(0.5)
  want=set(c['key'] for c in bat)
  while want:
   time.sleep(15)
   for x in g('executions?workflowId='+WF+'&limit=50')['data']:
    if x['id'] in seen or x['status'] in ('running','new','waiting'):continue
    seen.add(x['id']);d=g('executions/'+x['id']+'?includeData=true');rd=d['data']['resultData']['runData']
    k=rd['In'][0]['data']['main'][0][0]['json']['body']['key']
    try:
     j=rd['Call deepseek'][0]['data']['main'][0][0]['json'];u=j.get('usage',{});cr=(u.get('prompt_cache_hit_tokens') or 0)
     usd=(u.get('prompt_tokens',0)-cr)*0.15e-6+cr*0.03e-6+u.get('completion_tokens',0)*0.6e-6
     res[k]={'exec':x['id'],'content':j['choices'][0]['message'].get('content'),'finish':j['choices'][0].get('finish_reason'),'usage':u,'usd':usd}
    except Exception as e:
     res[k]={'exec':x['id'],'error':str(rd.get('Call deepseek',[{}])[0].get('error',e))[:400],'usd':0}
    spent+=res[k]['usd'];want.discard(k);json.dump(res,open(D+'results.json','w'))
  print('done',len(res),'of',len(calls),'spent %.3f'%spent,flush=True)
finally:
 print('active',g('workflows/'+WF+'/deactivate','POST').get('active'),flush=True)
