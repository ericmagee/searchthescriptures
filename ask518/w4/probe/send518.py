# ASK 518 paid calls (W4), released by the operator 08:18:15Z (W4 card). Sends each manifest body, unchanged, through the probe workflow; saves the whole response.
import json,os,sys,time,urllib.request,hashlib
K=os.environ['N8N_API_KEY'];H='https://truthapp.app.n8n.cloud'
WF='Mbg1u0rUNze5cMQp';P=open('/mnt/project-files/ask518/w4/probe/path.txt').read().strip()
M=json.load(open('/mnt/project-files/ask518/w1/manifest518.json'))
OUT='/mnt/project-files/ask518/w1/replies518/';os.makedirs(OUT,exist_ok=True)
LOG=open('/mnt/project-files/ask518/w4/probe/send518.log','a')
def api(path):
    r=urllib.request.Request(H+'/api/v1'+path,headers={'X-N8N-API-KEY':K});return json.load(urllib.request.urlopen(r,timeout=120))
def latest():
    d=api(f'/executions?workflowId={WF}&limit=1');return d['data'][0]['id'] if d['data'] else None
only=sys.argv[1:]  # optional limit
n=0
for e in [x for x in M if x.get('file')]:
    raw=open('/mnt/project-files/'+e['file'],'rb').read()
    assert hashlib.md5(raw).hexdigest()==e['md5'],e['file']
    body=json.loads(raw)
    base=os.path.basename(e['file'])[:-5]
    for r in range(1,e.get('repeats',1)+1):
        f=OUT+f'{base}_r{r}.json'
        if os.path.exists(f): continue
        if only and n>=int(only[0]): sys.exit(0)
        before=latest()
        req=urllib.request.Request(H+'/webhook/'+P,data=json.dumps({'body':body}).encode(),headers={'Content-Type':'application/json'},method='POST')
        urllib.request.urlopen(req,timeout=120).read()
        t0=time.time();ex=None
        while True:
            time.sleep(10)
            cur=latest()
            if cur and cur!=before:
                d=api(f'/executions/{cur}')
                if d.get('finished') or d.get('status') in ('success','error','crashed'):
                    ex=api(f'/executions/{cur}?includeData=true');break
            if time.time()-t0>1200: break
        if not ex: LOG.write(f'{base} r{r} TIMEOUT\n');LOG.flush();continue
        out=ex['data']['resultData']['runData'].get('Probe Call openrouter',[{}])[0]
        resp=(out.get('data',{}).get('main',[[{}]])[0] or [{}])[0].get('json') if out else None
        json.dump({'execution':ex['id'],'status':ex['status'],'body_file':e['file'],'body_md5':e['md5'],'repeat':r,'response':resp,'error':out.get('error') if out else None},open(f,'w'))
        LOG.write(f"{base} r{r} exec {ex['id']} {ex['status']} {time.time()-t0:.0f}s\n");LOG.flush();n+=1
