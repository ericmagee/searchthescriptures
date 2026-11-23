# ASK 518 build (W1), S1 only: the NOT-a-contradiction sentence in Close Enforcer Build and Judge Contradiction Build (engine), per plan rev 3 (cf658c3b) S1.
import json,hashlib
import os
SRC=os.environ.get('SRC','/mnt/project-files/ask516/w4/b/live_moMxiV4Irg1uRBZN.json');print('base',SRC)
OLD="; or differs only in wording."
NEW=("; differs only in wording; or differs only by a reference: it ties its point to a verse whose words, as the debater's own rounds quote them, do not give that point "
     "(a wrong reference, or one grouped with the verse that does give it). Read such a sentence with that reference set aside; if its point then agrees with the earlier sentence, "
     "it is not a contradiction. A sentence whose point itself cannot be true with the earlier sentence is still a contradiction, whatever its references.")
d=json.load(open(SRC))
for name in ['Close Enforcer Build','Judge Contradiction Build']:
    n=[x for x in d['nodes'] if x['name']==name][0]; s=n['parameters']['jsCode']
    assert s.count(OLD)==1,(name,s.count(OLD))
    n['parameters']['jsCode']=s.replace(OLD,NEW)
    print(name, hashlib.md5(s.encode()).hexdigest()[:8],'->',hashlib.md5(n['parameters']['jsCode'].encode()).hexdigest()[:8], len(s),'->',len(n['parameters']['jsCode']))
json.dump(d,open('target_engine_518.json','w'),ensure_ascii=False)
