#!/usr/bin/env python3
"""ASK 422(a) readback: fetch the live engine and child; print each library body sha (first 16 hex of SHA-256 of JSON.stringify of the LIB line array),
the sha each header names, each map_sha (rev 3 item 10-11), and EQUAL or DIFFER. Exit 1 on DIFFER. With two file arguments it reads those fetches instead.
map_sha: first 16 hex of SHA-256 of JSON.stringify([[key, entry], ...]) over the MAP keys in sorted order; the engine leaves out the named
engine-only keys MAPEXTRA and gives none unless every one of them is present."""
import json,os,sys,hashlib,re,urllib.request
MAPEXTRA=['REFP']
def served(w): return not any(n['name']=='Shared Library' for n in w['nodes']) and any(n['name'].startswith('Library Check') and '__p.lib' in (n['parameters'].get('jsCode') or '') for n in w['nodes'])  # ASK 578
def get(i):
  r=urllib.request.Request('https://truthapp.app.n8n.cloud/api/v1/workflows/'+i,headers={'X-N8N-API-KEY':os.environ['N8N_API_KEY'],'Accept':'application/json'});return json.load(urllib.request.urlopen(r,timeout=180))
js=lambda x:json.dumps(x,ensure_ascii=False,separators=(',',':'))
h16=lambda s:hashlib.sha256(s.encode('utf-8')).hexdigest()[:16]
def shas(w,side):
  c=[n for n in w['nodes'] if n['name']=='Shared Library'][0]['parameters']['jsCode'];a=c.index('\n/*LIB*/')+8;b=c.index('\n/*MAP*/')
  lib=h16(js(json.loads(c[a:b])));M=json.loads(c[c.rindex('\n/*MAP*/')+8:c.rindex('\n/*END*/')]);k=list(M)
  if side=='engine':
    if not all(x in k for x in MAPEXTRA): return lib,None,c
    k=[x for x in k if x not in MAPEXTRA]
  return lib,h16(js([[x,M[x]] for x in sorted(k)])),c
if __name__=='__main__':
  W=[json.load(open(f)) for f in sys.argv[1:3]] if len(sys.argv)>=3 else [get('moMxiV4Irg1uRBZN'),get('MqQHRl7mQQ0z8QdT')];S=[]
  for k,w in zip(('engine','child'),W):
    w=w.get('data',w)
    if k=='child' and served(w):
      ap=[x for x in W[0].get('data',W[0])['nodes'] if x['name']=='Alternate Pass Call'];snd=bool(ap) and json.dumps(ap[0]['parameters']).count("lib: $('Shared Library').params.jsCode")==1
      print(k,w.get('versionId'),'no Shared Library node: served the engine library in the call (ASK 578); engine sends it:',snd);S.append(S[0] if snd else ('none',None));continue
    if k=='engine':
      _n=[x for x in w['nodes'] if x['name'].startswith('Library Sha')];_m=re.search(r'const __MAPEXTRA422=(\[[^\]]*\]);',_n[0]['parameters']['jsCode']) if _n else None
      if _m: MAPEXTRA[:]=json.loads(_m.group(1))  # ASK 578: the engine's own list
    lib,m,c=shas(w,k);S.append((lib,m))
    print(k,w.get('versionId'),'body',lib,'header',(re.search(r'library sha ([0-9a-f]{16})',c) or [None,None])[1],'map_sha',m)
  ok=S[0][0]==S[1][0] and S[0][1] is not None and S[0][1]==S[1][1]
  print('EQUAL' if ok else 'DIFFER');sys.exit(0 if ok else 1)
