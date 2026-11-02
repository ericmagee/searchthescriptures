# Reads the relay executions of the cache probes (tag zz_cp_<model>_<n>) and prints each call's cache write/read tokens.
import json,os,urllib.request,re
H={'X-N8N-API-KEY':os.environ['N8N_API_KEY'],'Accept':'application/json'}
d=json.load(urllib.request.urlopen(urllib.request.Request('https://truthapp.app.n8n.cloud/api/v1/executions?workflowId=nyqJ0SOvwdtbSiqE&limit=14&includeData=true',headers=H),timeout=180))['data']
rows=[]
for e in d:
    rd=(e.get('data') or {}).get('resultData',{}).get('runData',{});tag=None;usage=None;err=None
    for node,runs in rd.items():
        for r in runs:
            if r.get('error'):err=str(r['error'].get('message'))[:120]
            for o in (r.get('data',{}).get('main') or []):
                for it in (o or []):
                    j=it.get('json',{})
                    t=j.get('tag') or (j.get('body') or {}).get('tag') if isinstance(j,dict) else None
                    if t and str(t).startswith('zz_cp_'):tag=t
                    if 'usage' in j and usage is None:usage=j['usage']
    if tag:
        pd=(usage or {}).get('prompt_tokens_details') or {}
        rows.append((tag,e['id'],e.get('status'),(usage or {}).get('prompt_tokens'),pd.get('cache_write_tokens'),pd.get('cached_tokens'),err))
for r in sorted(rows):print(r)
json.dump(sorted(rows),open('probe/result.json','w'),indent=1)
