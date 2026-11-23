# ASK 518 rev 6 build (W1): S1 only, plan rev 6 (f3ee867a), on the corrected 517 engine (Wall 10447). C4 check: only the two PROMPT sentences change.
import json,hashlib,os,sys
H=os.path.dirname(os.path.abspath(__file__))
SRC=os.environ.get('SRC','/mnt/project-files/ask517/w1/target_engine_517.json')
S=json.load(open(H+'/sentence518r6.json'));OLD,NEW=S['OLD'],S['NEW']
assert "'" not in NEW and '"' not in NEW and '\\' not in NEW
d=json.load(open(SRC));base=json.load(open(SRC))
for name in ['Close Enforcer Build','Judge Contradiction Build']:
    n=[x for x in d['nodes'] if x['name']==name][0]; s=n['parameters']['jsCode']
    assert s.count(OLD)==1,(name,s.count(OLD))
    n['parameters']['jsCode']=s.replace(OLD,NEW)
    print(name, hashlib.md5(s.encode()).hexdigest()[:8],'->',hashlib.md5(n['parameters']['jsCode'].encode()).hexdigest()[:8], len(s),'->',len(n['parameters']['jsCode']))
# C4: every other node and the connections are identical to the base
B={x['name']:x for x in base['nodes']};D={x['name']:x for x in d['nodes']}
assert set(B)==set(D); diff=[k for k in B if json.dumps(B[k],sort_keys=True)!=json.dumps(D[k],sort_keys=True)]
assert sorted(diff)==['Close Enforcer Build','Judge Contradiction Build'],diff
assert json.dumps(base['connections'],sort_keys=True)==json.dumps(d['connections'],sort_keys=True)
for k in diff: assert {a:b for a,b in B[k].items() if a!='parameters'}=={a:b for a,b in D[k].items() if a!='parameters'} and [a for a in B[k]['parameters'] if B[k]['parameters'][a]!=D[k]['parameters'][a]]==['jsCode']
print('C4 ok: changed nodes',diff)
out=os.environ.get('OUT',H+'/target_engine_518r6_on517.json');json.dump(d,open(out,'w'),ensure_ascii=False);print('out',out)
