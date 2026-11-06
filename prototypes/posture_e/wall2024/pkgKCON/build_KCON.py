# pkgKCON: K-CON back to TRIAL (W3 2243 item D). Base: pkgR2/patched (= merged_PWQA + pkgR2).
import os,hashlib,json
B='pkgR2/patched';O='pkgKCON/patched'
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
E1=("'K-CON':'LIVE'","'K-CON':'TRIAL'")
E2=("or REASSERTED IN with the quote. LIVE rule: left uncured after the cure, it removes the seat.","or REASSERTED IN with the quote. TRIAL rule: answer it in the cure; it removes no seat.")
plan={'base':'pkgR2/patched','nodes':[]}
for n in sorted(os.listdir(B)):
    o=open(os.path.join(B,n)).read();s=o
    assert s.count(E1[0])==1,(n,'E1')
    s=s.replace(*E1)
    k=s.count(E2[0]);assert k in (1,2),(n,'E2',k)
    s=s.replace(*E2)
    assert "'K-CON':'LIVE'" not in s and 'LIVE rule: left uncured' not in s,(n,'left')
    open(os.path.join(O,n),'w').write(s)
    plan['nodes'].append({'file':n,'name':n[:-3].replace('_',' '),'base_sha':sha(o),'final_sha':sha(s),'edits':['ENF_STATUS K-CON TRIAL','K-CON item text TRIAL x%d'%k]})
json.dump(plan,open('pkgKCON/plan_KCON.json','w'),indent=1)
print(len(plan['nodes']),'nodes')
