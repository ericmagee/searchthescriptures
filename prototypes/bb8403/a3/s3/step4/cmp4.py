# BB-8403 S3 step 4: published version fetched back, against git (s1/new + s3/new) and against 4daa72a6.
import json,hashlib,sys
L,B=sys.argv[1],sys.argv[2]
d=json.load(open(L)); w=d.get('workflow',d)
b=json.load(open(B))
G='/home/user/searchthescriptures/prototypes/bb8403/a3/'
git={}
for n in ['Init_Seats','Resolve_Seats','Format_Markdown']: git[n.replace('_',' ')]=open(G+'s1/new/'+n+'.js').read()
for n in ['D1_Build','C1_Build','D2_Build','C2_Build','D3_Build','C3_Build','Build_Synthesis','Build_Independent_Verdict','Build_Diagnostic_Prompt','Panel_Build','Reserve_Build','Alternate_Build']: git[n.replace('_',' ')]=open(G+'s3/new/'+n+'.js').read()
h=lambda s:hashlib.md5(s.encode()).hexdigest()
print('LIVE versionId',w.get('versionId'),'activeVersionId',w.get('activeVersionId'),'active',w.get('active'),'nodes',len(w['nodes']))
print('BASE versionId',b.get('versionId'),'nodes',len(b['nodes']))
ln={x['name']:x for x in w['nodes']}; bn={x['name']:x for x in b['nodes']}
print('name sets equal',set(ln)==set(bn))
eq=0
for k in sorted(git):
  lc=ln[k]['parameters'].get('jsCode',''); 
  o={kk:vv for kk,vv in ln[k].items() if kk!='parameters'}; ob={kk:vv for kk,vv in bn[k].items() if kk!='parameters'}
  pl={kk:vv for kk,vv in ln[k]['parameters'].items() if kk!='jsCode'}; pb={kk:vv for kk,vv in bn[k]['parameters'].items() if kk!='jsCode'}
  ok=h(lc)==h(git[k]); eq+=ok
  print('EQUAL' if ok else 'DIFF',k,'live',h(lc)[:8],'git',h(git[k])[:8],'base',h(bn[k]['parameters'].get('jsCode',''))[:8],'non-code equal base:',json.dumps(o,sort_keys=True)==json.dumps(ob,sort_keys=True) and json.dumps(pl,sort_keys=True)==json.dumps(pb,sort_keys=True))
print('TARGETS EQUAL',eq,'of',len(git))
others=[k for k in ln if k not in git]
diff=[k for k in others if json.dumps(ln[k],sort_keys=True)!=json.dumps(bn[k],sort_keys=True)]
print('OTHER nodes',len(others),'equal base',len(others)-len(diff),'diff',diff)
for f in ['connections','settings','pinData','staticData']:
  print(f,'equal base',json.dumps(w.get(f),sort_keys=True)==json.dumps(b.get(f),sort_keys=True), '(live has' , f in w, ', base has', f in b,')')
