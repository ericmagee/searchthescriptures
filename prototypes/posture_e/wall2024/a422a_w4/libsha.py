#!/usr/bin/env python3
"""ASK 422(a) readback: fetch the live engine and child; print each library body sha (first 16 hex of SHA-256 of JSON.stringify of the LIB line array),
the sha each header names, and EQUAL or DIFFER. Exit 1 on DIFFER. With two file arguments it reads those fetches instead of the live workflows."""
import json,os,sys,hashlib,re,urllib.request
def get(i):
  r=urllib.request.Request('https://truthapp.app.n8n.cloud/api/v1/workflows/'+i,headers={'X-N8N-API-KEY':os.environ['N8N_API_KEY'],'Accept':'application/json'});return json.load(urllib.request.urlopen(r,timeout=180))
W=[json.load(open(f)) for f in sys.argv[1:3]] if len(sys.argv)>=3 else [get('moMxiV4Irg1uRBZN'),get('MqQHRl7mQQ0z8QdT')];S=[]
for k,w in zip(('engine','child'),W):
  w=w.get('data',w);c=[n for n in w['nodes'] if n['name']=='Shared Library'][0]['parameters']['jsCode'];a=c.index('\n/*LIB*/')+8;b=c.index('\n/*MAP*/')
  s=hashlib.sha256(json.dumps(json.loads(c[a:b]),ensure_ascii=False,separators=(',',':')).encode('utf-8')).hexdigest()[:16];S.append(s)
  print(k,w.get('versionId'),'body',s,'header',(re.search(r'library sha ([0-9a-f]{16})',c) or [None,None])[1])
print('EQUAL' if S[0]==S[1] else 'DIFFER');sys.exit(0 if S[0]==S[1] else 1)
