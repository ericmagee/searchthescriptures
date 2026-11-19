# ASK 500 A2 (W4): Debate Start gets header auth with the n8n credential "ODV1 start webhook". Touched node only.
# usage: python3 build500a2.py <live_engine.json> <credential_id> <out.json>
# The credential id is a placeholder until the operator makes the credential (A0); the seat reads its id by NAME from the n8n credential list, never its value.
import json,sys,copy
src,cid,dst=sys.argv[1],sys.argv[2],sys.argv[3]
assert cid and cid!='CRED_ID_PLACEHOLDER', 'give the real credential id read by name after A0'
base=json.load(open(src)); t=copy.deepcopy(base); done=0
for n in t['nodes']:
    if n['name']=='Debate Start':
        assert n['type']=='n8n-nodes-base.webhook'
        p=n['parameters']
        assert p=={'httpMethod':'POST','path':'oracle-debate-v1','responseMode':'responseNode','options':{}}, p
        assert 'credentials' not in n
        p['authentication']='headerAuth'
        n['credentials']={'httpHeaderAuth':{'id':cid,'name':'ODV1 start webhook'}}
        done+=1
assert done==1
b={n['name']:n for n in base['nodes']}
for n in t['nodes']:
    if n['name']!='Debate Start': assert n==b[n['name']], n['name']
assert t['connections']==base['connections']
json.dump({k:t[k] for k in ('name','nodes','connections','settings')},open(dst,'w'),ensure_ascii=False,indent=1)
print('ok')
