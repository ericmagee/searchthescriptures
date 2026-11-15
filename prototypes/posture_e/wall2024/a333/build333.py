import json,hashlib,sys
base=json.load(open('rdf/fetchback_s221_329.json'))
OLD="\\n\\nFinal round. Close your challenge. Then END your response"
NEW="\\n\\nThis is round 2 of 4, your premise-list round. Press your challenge against this reply. Your link round (round 3) and your close (round 4) follow, so do not write this round as a close. Then END your response"
t=json.loads(json.dumps(base))
hits=0
for n in t['nodes']:
    for k,v in n['parameters'].items():
        if isinstance(v,str) and OLD in v:
            assert v.count(OLD)==1; n['parameters'][k]=v.replace(OLD,NEW); hits+=1; print('edit',n['name'],k)
assert hits==1
json.dump(t,open('a333/target_333.json','w'))
# PRE/POST diff: every node other than C2 Build identical
for a,b in zip(base['nodes'],t['nodes']):
    if a!=b: print('changed node:',a['name'])
    pa=a['parameters'].get('jsCode','');pb=b['parameters'].get('jsCode','')
    if pa!=pb:
        import difflib
        i=next(i for i in range(len(pa)) if pa[i]!=pb[i]); print('first diff at',i,'len',len(pa),'->',len(pb),'delta',len(pb)-len(pa))
print('base sha',hashlib.sha256(json.dumps(base['nodes'],sort_keys=True).encode()).hexdigest()[:12],'target sha',hashlib.sha256(json.dumps(t['nodes'],sort_keys=True).encode()).hexdigest()[:12])
print('connections same',base['connections']==t['connections'])
