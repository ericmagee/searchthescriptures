# Per-node call timings for debate executions, read from the n8n API (status, start, duration, error message only; no payloads kept).
import json,os,sys,urllib.request,datetime
H={'X-N8N-API-KEY':os.environ['N8N_API_KEY'],'Accept':'application/json'}
CALLS=('Call','Judge','Reserve','Verdict','Synthesis','Diagnostic','Alternate')
out={}
for ex in sys.argv[1:]:
    e=json.load(urllib.request.urlopen(urllib.request.Request(f'https://truthapp.app.n8n.cloud/api/v1/executions/{ex}?includeData=true',headers=H),timeout=300))
    rd=e['data']['resultData']['runData'];rows=[]
    for node,runs in rd.items():
        if not any(k in node for k in CALLS):continue
        for i,r in enumerate(runs):
            st=r.get('startTime');dur=r.get('executionTime');err=r.get('error')
            msg=(err or {}).get('message') if err else None
            # error items routed to output (continueErrorOutput) carry json.error
            if not msg:
                for o in (r.get('data',{}).get('main') or []):
                    for it in (o or []):
                        j=it.get('json',{}) or {}
                        if isinstance(j.get('error'),(dict,str)):msg=str(j.get('error'))[:160]
            rows.append((datetime.datetime.utcfromtimestamp(st/1000).strftime('%H:%M:%S') if st else None,node,i,round((dur or 0)/1000,1),(msg or '')[:160]))
    rows.sort(key=lambda x:x[0] or '')
    out[ex]=rows
    print('== execution',ex,e.get('status'))
    for r in rows:print('  ',r)
json.dump(out,open('timings.json','w'),indent=1)
