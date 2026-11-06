# WALL-2024 K-CON TRIAL -> LIVE (W2; W3 ruling 2203 on W1's evidence table 2200/2202). Writes nothing live.
# Base: 6b077f9e plus pkgT (7d0a84b), the next live state; pkgT's two nodes are read from ../pkgT/patched when the base is 6b077f9e.
# 1. ENF_STATUS 'K-CON':'TRIAL' -> 'LIVE' in every status-table node (17). An uncured K-CON item now counts in drv_uncured.
# 2. The K-CON marks the judges read said "TRIAL rule: it removes no seat."; that sentence would now be false, so it reads
#    "LIVE rule: left uncured after the cure, it removes the seat." (both K-CON marks: the judge's own, and the verified contradiction).
# usage: python3 build_L.py <live fetch json of 6b077f9e>
import json,sys,os,hashlib
LIVE=sys.argv[1];H=os.path.dirname(os.path.abspath(__file__));sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
W=json.load(open(LIVE))['workflow'];assert W['versionId'].startswith('6b077f9e'),W['versionId']
TP=json.load(open(os.path.join(H,'..','pkgT','plan_T.json')))
for n in W['nodes']:
    x=next((x for x in TP['nodes'] if x['name']==n['name']),None)
    if x:
        assert sha(n['parameters']['jsCode'])==x['live_sha'],n['name'];n['parameters']['jsCode']=open(os.path.join(H,'..','pkgT','patched',n['name'].replace(' ','_')+'.js')).read()
A="'K-CON':'TRIAL'";A2="'K-CON':'LIVE'"
M="or REASSERTED IN with the quote. TRIAL rule: it removes no seat. REVIEW THIS ROW.]'"
M2="or REASSERTED IN with the quote. LIVE rule: left uncured after the cure, it removes the seat. REVIEW THIS ROW.]'"
out=os.path.join(H,'patched');os.makedirs(out,exist_ok=True);plan={'live_version':W['versionId'],'base':'6b077f9e + pkgT 7d0a84b','nodes':[]}
for n in W['nodes']:
    c=(n.get('parameters') or {}).get('jsCode') or ''
    if A not in c:continue
    assert c.count(A)==1,(n['name'],c.count(A));k=c.count(M);assert k in (1,2),(n['name'],k)
    t=c.replace(A,A2).replace(M,M2)
    open(os.path.join(out,n['name'].replace(' ','_')+'.js'),'w').write(t)
    plan['nodes'].append({'name':n['name'],'id':n['id'],'base_sha':sha(c),'final_sha':sha(t),'marks':k,'from':'T+L' if any(x['name']==n['name'] for x in TP['nodes']) else 'L'})
json.dump(plan,open(os.path.join(H,'plan_L.json'),'w'),indent=1);print(len(plan['nodes']),'nodes',{x['name']:x['marks'] for x in plan['nodes'] if x['marks']!=1})
