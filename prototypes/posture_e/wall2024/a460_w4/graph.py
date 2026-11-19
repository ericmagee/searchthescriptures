import json,re,os,subprocess,sys,urllib.request
K=os.environ['N8N_API_KEY'];B='https://truthapp.app.n8n.cloud/api/v1/'
def get(p):
  r=urllib.request.Request(B+p,headers={'X-N8N-API-KEY':K});return json.load(urllib.request.urlopen(r))
# all workflows + webhook paths
allw=[];cur=None
while True:
  d=get('workflows?limit=250'+(f'&cursor={cur}' if cur else ''))
  allw+=d['data'];cur=d.get('nextCursor')
  if not cur:break
hook={}
for w in allw:
  for n in w['nodes']:
    if n['type'].endswith('.webhook'):
      hook.setdefault(n['parameters'].get('path'),[]).append((w['id'],w['name'],w.get('active')))
json.dump(allw,open('a460/wf/all.json','w'))
byid={w['id']:w for w in allw}
print('workflows',len(allw))
seen={};q=[('moMxiV4Irg1uRBZN','root'),('MqQHRl7mQQ0z8QdT','root')]
while q:
  wid,frm=q.pop(0)
  if wid in seen: seen[wid]['from'].add(frm);continue
  w=get('workflows/'+wid);json.dump(w,open(f'a460/wf/{wid}.json','w'))
  s=json.dumps(w)
  ds=[n['name'] for n in w['nodes'] if re.search(r'(?i)deepseek',json.dumps(n))]
  cds=re.findall(r'(?i)deepseek',json.dumps(w['connections']))
  calls=set()
  for n in w['nodes']:
    p=json.dumps(n['parameters'])
    if 'executeWorkflow' in n['type'] and not n['type'].endswith('Trigger'):
      wi=n['parameters'].get('workflowId');wi=wi.get('value') if isinstance(wi,dict) else wi
      calls.add(('exec',str(wi),n['name']))
    for m in re.findall(r'webhook(?:-test)?/([A-Za-z0-9_\-/]+)',p):
      calls.add(('hook',m,n['name']))
  # also any workflow id strings of known workflows
  for oid in byid:
    if oid!=wid and oid in s: calls.add(('idref',oid,'-'))
  seen[wid]={'name':w['name'],'from':{frm},'ver':w.get('versionId'),'pub':w.get('activeVersionId')==w.get('versionId'),'active':w.get('active'),'ds_nodes':ds,'ds_conn':len(cds),'calls':sorted(calls)}
  for kind,t,nn in calls:
    if kind in('exec','idref') and t in byid: q.append((t,wid))
    elif kind=='hook':
      for (hid,hn,ha) in hook.get(t,[]): q.append((hid,wid))
      if t not in hook: print('UNRESOLVED hook',t,'from',w['name'],nn)
    elif kind=='exec': print('UNRESOLVED exec',t,'from',w['name'],nn)
for k,v in seen.items():
  print('==',k,v['name'],'ver',v['ver'][:8],'pub',v['pub'],'active',v['active'],'from',sorted(v['from']))
  print('   deepseek nodes',v['ds_nodes'],'conn hits',v['ds_conn'])
  print('   calls',sorted(set((c[0],c[1]) for c in v['calls'])))
