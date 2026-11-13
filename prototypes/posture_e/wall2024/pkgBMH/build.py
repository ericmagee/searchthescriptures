import json,hashlib,sys
src='/mnt/project-files/wall2024/fetchback_live_s179.json'
d=json.load(open(src)); w=d.get('data',d)
A_OLD=r"\bno\s+(?:verse|row|text|word|witness)s?\s+(?:states?"
A_NEW=r"\bno\s+(?:verse|row|text|word|witness)s?\s+(?:(?:that|which)\s+)?(?:states?"
B_OLD=r"const ANS=/\banswers?\s+to\b|"
B_NEW=r"const ANS=/\banswers?\s+to\b|\bagainst\s+[CD]\d|"
names=[f"{p}B {k}" for p in ['C1','C2','C3','C4','D2','D3','D4'] for k in ['Build','Extract']]
tot=0
for n in w['nodes']:
    if n['name'] in names:
        s=n['parameters']['jsCode']
        assert s.count(A_OLD)==1 and s.count(B_OLD)==1, n['name']
        t=s.replace(A_OLD,A_NEW).replace(B_OLD,B_NEW)
        n['parameters']['jsCode']=t; tot+=len(t)-len(s); print(n['name'],len(t)-len(s))
print('total',tot)
out='/mnt/project-files/wall2024/parent_s179_BMH.json'
b=json.dumps(d,ensure_ascii=False).encode()
open(out,'wb').write(b); print('sha',hashlib.sha256(b).hexdigest()[:16])
