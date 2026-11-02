import json,os,time,urllib.request
H={'X-N8N-API-KEY':os.environ['N8N_API_KEY'],'Accept':'application/json'}
def ex():
    r=urllib.request.Request('https://truthapp.app.n8n.cloud/api/v1/executions?workflowId=moMxiV4Irg1uRBZN&limit=3',headers=H)
    return json.load(urllib.request.urlopen(r,timeout=60))['data']
t0=time.time()
while time.time()-t0<5400:
    try:
        d=[e for e in ex() if int(e['id'])>32200]
        line=time.strftime('%H:%M:%S')+' '+' '.join(f"{e['id']}:{e.get('status')}" for e in d)
        print(line,flush=True); open('polls.txt','a').write(line+'\n')
        if d and all(e.get('status') not in ('running','new','waiting') for e in d): break
    except Exception as e: print('poll error',e,flush=True)
    time.sleep(120)
