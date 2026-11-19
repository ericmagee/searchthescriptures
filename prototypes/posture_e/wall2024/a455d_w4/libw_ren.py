#!/usr/bin/env python3
"""ASK 455 D variant (W4): adds --renames (target nodes matched to live by node id; renamed nodes declared). ASK 422(a): one writer for the engine and its child ("two copies, one writer, checked at load"). Joins rdf/wgen.py and rdf/wchild.py.
usage: python3 a422a/libw.py <eng_versionId> <child_versionId> <eng_base.json> <child_base.json> <tag>
         (--pairs pairs.json | --targets eng_target.json child_target.json) [--add-eng n1,n2] [--add-child n1,n2] [--allow-reasoning] [--write]
--pairs: one set of library pairs, applied to both Shared Libraries by a422a/lib_apply.cjs (refuses unless both bodies give one sha).
--targets: whole targets (a package that also changes other nodes). Every route: versions, no running execution, live equals the base,
the reasoning guard on each, the ASK 385 one-copy check on the pair, and the two library shas equal. Writes the engine, then the child; reads both back."""
import json,os,sys,subprocess,urllib.request,hashlib
H={'X-N8N-API-KEY':os.environ['N8N_API_KEY'],'Content-Type':'application/json','Accept':'application/json'}
API='https://truthapp.app.n8n.cloud/api/v1/';WF={'engine':'moMxiV4Irg1uRBZN','child':'MqQHRl7mQQ0z8QdT'};D='rdf/';A=sys.argv
def req(u,m='GET',b=None):
  r=urllib.request.Request(u,method=m,data=None if b is None else json.dumps(b).encode(),headers=H);return json.load(urllib.request.urlopen(r,timeout=180))
js=lambda x:json.dumps(x,sort_keys=True)
def libsha(w):
  c=[n for n in w['nodes'] if n['name']=='Shared Library'][0]['parameters']['jsCode'];a=c.index('\n/*LIB*/')+8;b=c.index('\n/*MAP*/')
  return hashlib.sha256(json.dumps(json.loads(c[a:b]),ensure_ascii=False,separators=(',',':')).encode('utf-8')).hexdigest()[:16]
ver={'engine':A[1],'child':A[2]};base={'engine':A[3],'child':A[4]};tag=A[5];arg=lambda k:A[A.index(k)+1] if k in A else None
if bool(arg('--pairs'))==bool(arg('--targets')):sys.exit('give --pairs or --targets')
live={};
for k in WF:
  live[k]=req(API+'workflows/'+WF[k])
  if live[k]['versionId']!=ver[k]:sys.exit('REFUSED: %s versionId moved: %s'%(k,live[k]['versionId']))
  if req(API+'executions?status=running&workflowId=%s&limit=50'%WF[k])['data']:sys.exit('REFUSED: %s has a running execution'%k)
  SN={x['name']:x for x in json.load(open(base[k]))['nodes']}
  if not all(x['name'] in SN and js(x)==js(SN[x['name']]) for x in live[k]['nodes']):sys.exit('REFUSED: %s live drifted from the base'%k)
  json.dump(live[k],open(D+'prewrite_%s_%s.json'%(tag,k),'w'))
tg={}
if arg('--pairs'):
  tg={'engine':D+'_lib_%s_engine.json'%tag,'child':D+'_lib_%s_child.json'%tag}
  if subprocess.call(['node','a422a/lib_apply.cjs',base['engine'],base['child'],arg('--pairs'),tg['engine'],tg['child']])!=0:sys.exit('REFUSED by lib_apply')
else: tg={'engine':A[A.index('--targets')+1],'child':A[A.index('--targets')+2]}
T={};ADD={'engine':(arg('--add-eng') or '').split(',') if arg('--add-eng') else [],'child':(arg('--add-child') or '').split(',') if arg('--add-child') else []}
for k in WF:
  TG=json.load(open(tg[k]));TG=TG.get('data',TG);TN={x['name']:x for x in TG['nodes']}
  TID={x['id']:x['name'] for x in TG['nodes']};REN={x['name']:TID[x['id']] for x in live[k]['nodes'] if x['id'] in TID and TID[x['id']]!=x['name']}
  if REN and '--renames' not in A:sys.exit('REFUSED: %s renames %s not declared (--renames)'%(k,REN))
  for o,n in REN.items():
    a={kk:v for kk,v in [x for x in live[k]['nodes'] if x['name']==o][0].items() if kk!='name'};b={kk:v for kk,v in TN[n].items() if kk!='name'}
    if js(a)!=js(b):print(k,'RENAMED AND CHANGED',o,'->',n)
  if REN:print(k,'RENAMES',len(REN),REN)
  LN=[REN.get(x['name'],x['name']) for x in live[k]['nodes']]
  if set(LN)-set(TN):sys.exit('REFUSED: %s target lacks live nodes %s'%(k,sorted(set(LN)-set(TN))))
  extra=[n for n in TN if n not in set(LN)]
  if sorted(extra)!=sorted(ADD[k]):sys.exit('REFUSED: %s added nodes %s, declared %s'%(k,extra,ADD[k]))
  t=json.loads(json.dumps(live[k]));t['nodes']=[TN[n] for n in LN]+[TN[n] for n in ADD[k]];t['connections']=TG['connections']
  if not ADD[k] and not REN and js(t['connections'])!=js(live[k]['connections']):sys.exit('REFUSED: %s connections differ with no node added'%k)
  for c in sorted(set(live[k]['connections'])|set(t['connections'])):
    if js(live[k]['connections'].get(c))!=js(t['connections'].get(c)):print(k,'CONN',c,':',js(live[k]['connections'].get(c)),'->',js(t['connections'].get(c)))
  print(k,'changed',[b['name'] for a,b in zip(live[k]['nodes'],t['nodes']) if js({kk:v for kk,v in a.items() if kk!='name'})!=js({kk:v for kk,v in b.items() if kk!='name'})],'added',ADD[k])
  T[k]=t;json.dump(t,open(D+'_guard_%s_%s.json'%(tag,k),'w'))
  if subprocess.call(['node','gw/prototypes/posture_e/wall2024/guards/reasoning_guard.cjs',D+'prewrite_%s_%s.json'%(tag,k),D+'_guard_%s_%s.json'%(tag,k)]+(['--allow'] if '--allow-reasoning' in A else []))!=0:sys.exit('REFUSED: reasoning guard (%s)'%k)
if subprocess.call(['node','a385/reg385.cjs',D+'_guard_%s_engine.json'%tag,D+'_guard_%s_child.json'%tag],stdout=subprocess.DEVNULL)!=0:sys.exit('REFUSED: ASK 385 one-copy check failed')
se,sc=libsha(T['engine']),libsha(T['child']);print('library sha engine',se,'child',sc)
if se!=sc:sys.exit('REFUSED: the two library bodies differ')
if '--write' not in A:print('DRY: nothing written');sys.exit()
out={}
for k in WF:
  t=T[k];req(API+'workflows/'+WF[k],'PUT',{'name':live[k]['name'],'nodes':t['nodes'],'connections':t['connections'],'settings':live[k]['settings']})
  back=req(API+'workflows/'+WF[k]);KN={x['name']:x for x in back['nodes']};fail=[]
  for x in t['nodes']:
    b=KN.get(x['name'])
    if b is None:fail.append('missing '+x['name']);continue
    keys=x.keys() if x['name'] in ADD[k] else ['parameters']
    fail+=[x['name']+' '+kk for kk in keys if js(x.get(kk))!=js(b.get(kk))]
  if js(back['connections'])!=js(t['connections']):fail.append('connections')
  if back.get('activeVersionId')!=back.get('versionId') or not back.get('active'):fail.append('NOT PUBLISHED')
  json.dump(back,open(D+'fetchback_%s_%s.json'%(tag,k),'w'));out[k]=(back['versionId'],libsha(back),back.get('updatedAt'))
  print(k,'back',back['versionId'],'nodes',len(KN),'lib',out[k][1],'FAIL' if fail else 'READBACK OK',fail[:10])
  if fail:sys.exit('STOPPED after %s; revert from %sprewrite_%s_*.json'%(k,D,tag))
print('BOTH LIBRARIES', 'EQUAL' if out['engine'][1]==out['child'][1] else 'DIFFER', out['engine'][1], out['child'][1])
