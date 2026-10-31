# usage: python3 rb3.py <get_workflow_details file> : 4 nodes vs new/ and base/, plus whole-flow diff vs the base fetch
import json,sys,hashlib
BASE='/root/.claude/projects/-home-user-searchthescriptures/58ba9d31-f07a-5e6e-a230-4fe44a036213/tool-results/mcp-n8n-get_workflow_details-1793412441229.txt'
w=json.load(open(sys.argv[1]))['workflow']; b=json.load(open(BASE))['workflow']
print('version',w['versionId'][:8],'active',w['activeVersionId'][:8],'nodes',len(w['nodes']))
for n in ['C2 Build','D3 Build','Panel Build','Build Independent Verdict']:
  f=n.replace(' ','_')+'.js'; c=[x for x in w['nodes'] if x['name']==n][0]['parameters']['jsCode']
  h=hashlib.md5(c.encode()).hexdigest()
  st='NEW' if h==hashlib.md5(open('new/'+f,'rb').read()).hexdigest() else ('BASE' if h==hashlib.md5(open('base/'+f,'rb').read()).hexdigest() else 'DIFF')
  print(n.ljust(26),h[:8],st)
B={x['name']:x for x in b['nodes']}; W={x['name']:x for x in w['nodes']}
print('same names',set(B)==set(W))
for k in sorted(W):
  if W[k]!=B.get(k):
    ks=[q for q in set(W[k])|set(B[k]) if W[k].get(q)!=B[k].get(q)]
    ps=[q for q in set(W[k]['parameters'])|set(B[k]['parameters']) if W[k]['parameters'].get(q)!=B[k]['parameters'].get(q)]
    print('DIFF',k,ks,ps)
print('connections equal',w['connections']==b['connections'],'settings equal',w.get('settings')==b.get('settings'))
