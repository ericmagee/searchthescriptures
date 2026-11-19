#!/usr/bin/env python3
"""ASK 463 (from the ASK 459-461 writers): write ONE n8n workflow through the REST API, then read it back and record its audit_log row.
usage: python3 restw.py <workflowId> <base.json> <target.json> <tag> --seat <seat name> --card "<card text and time>" [--allow-reasoning] [--write]
Refuses unless: the live versionId equals the base; live nodes and connections equal the base; no running execution of this workflow,
the engine or the child; the reasoning guard passes. Saves $RDF/prewrite_<tag>.json (RDF default ./rdf/). With --write: PUT name, nodes,
connections and settings; fetch back to $RDF/fetchback_<tag>.json; check 0 diffs in parameters, type, typeVersion, credentials, onError and id, equal connections, active and published
(activeVersionId = versionId); only then write the audit_log row (tools/audit_row.py). A failed readback writes no row and names the revert file."""
import json,os,sys,subprocess,urllib.request
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));import audit_row
H={'X-N8N-API-KEY':os.environ['N8N_API_KEY'],'Content-Type':'application/json','Accept':'application/json'};API='https://truthapp.app.n8n.cloud/api/v1/'
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));D=os.environ.get('RDF','rdf/');A=sys.argv
def req(u,m='GET',b=None):return json.load(urllib.request.urlopen(urllib.request.Request(u,method=m,data=None if b is None else json.dumps(b).encode(),headers=H),timeout=120))
arg=lambda k:A[A.index(k)+1] if k in A else None;js=lambda x:json.dumps(x,sort_keys=True)
un=lambda w:w['data'] if 'nodes' not in w and 'data' in w else w
WF,base,tgt,tag=A[1],un(json.load(open(A[2]))),un(json.load(open(A[3]))),A[4];seat,card=arg('--seat'),arg('--card')
if '--write' in A and not (seat and card):sys.exit('REFUSED: --write needs --seat and --card')
live=req(API+'workflows/'+WF)
if live['versionId']!=base['versionId']:sys.exit('REFUSED: versionId moved '+live['versionId'])
if js(live['nodes'])!=js(base['nodes']) or js(live['connections'])!=js(base['connections']):sys.exit('REFUSED: live drifted from base')
for w in sorted({WF,'moMxiV4Irg1uRBZN','MqQHRl7mQQ0z8QdT'}):
  if req(API+'executions?status=running&workflowId=%s&limit=5'%w)['data']:sys.exit('REFUSED: running execution on '+w)
pre=D+'prewrite_%s.json'%tag;json.dump(live,open(pre,'w'));open(D+'_target_%s.json'%tag,'w').write(json.dumps(tgt))
if subprocess.call(['node',os.path.join(R,'guards','reasoning_guard.cjs'),pre,D+'_target_%s.json'%tag]+(['--allow'] if '--allow-reasoning' in A else []))!=0:sys.exit('REFUSED: reasoning guard')
rm,add,ch,cc=audit_row.diff(live,tgt);print('PLAN removed',rm,'added',add,'changed',ch,'connections',cc)
if '--write' not in A:print('DRY: checks pass, nothing written');sys.exit()
req(API+'workflows/'+WF,'PUT',{'name':live['name'],'nodes':tgt['nodes'],'connections':tgt['connections'],'settings':live['settings']})
b=req(API+'workflows/'+WF);json.dump(b,open(D+'fetchback_%s.json'%tag,'w'))
K=('parameters','type','typeVersion','credentials','onError','id')
P={n['name']:{k:n.get(k) for k in K} for n in b['nodes']};T={n['name']:{k:n.get(k) for k in K} for n in tgt['nodes']}
d=[n for n in set(P)|set(T) if js(P.get(n))!=js(T.get(n))];ce=js(b['connections'])==js(tgt['connections']);pub=b.get('activeVersionId')==b.get('versionId')
print('back',b['versionId'],'nodes',len(P),'diffs',d,'conn equal',ce,'active',b.get('active'),'published',pub)
if d or not ce or not pub or not b.get('active'):sys.exit('READBACK FAILED: no audit row written; revert from '+pre)
audit_row.post('n8n_workflow_publish',audit_row.notes(seat,card,live,b,'Tag %s; revert %s.'%(tag,pre)))
