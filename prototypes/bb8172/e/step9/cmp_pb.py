import json
from texts import C3,QR,SV,CL
def prompts(f):
    o=json.load(open(f))[0]['json']; out=[]
    for j in o['judges']:
        out.append(json.dumps(j.get('body',j),ensure_ascii=False))
    return out
B=prompts('pb_out_base.json'); N=prompts('pb_out_new.json'); fail=0
def ok(c,m):
    global fail; print(('PASS ' if c else 'FAIL ')+m); fail+=(not c)
dec=lambda s: json.loads(s)
for i,(b,n) in enumerate(zip(B,N)):
    tb=json.dumps(dec(b),ensure_ascii=False); tn=json.dumps(dec(n),ensure_ascii=False)
    for k,s in [('C3',C3),('QR',QR),('SV',SV),('CL',CL)]:
        sj=json.dumps(s,ensure_ascii=False)[1:-1]
        ok(tn.count(sj)==1 and tb.count(sj)==0, 'judge %d %s once in served body'%(i,k))
    a=tn.find('PRE-CHECK -- decides nothing'); c=tn.find('COUNTING RULE -- BINDING')
    ok(a>0 and c>a and tn.count('PRE-CHECK -- decides nothing')==1,'judge %d block once before COUNTING RULE'%i)
print('judges', len(B), len(N)); print('ALL PASS' if not fail else 'FAILED %d'%fail)
