# ASK 520 build (W4): K-UNX general path not raised on a premise whose press the judge's own ANSWER CHECK grades MISSES or FAILS. Base: W1's ASK 517 targets.
import json,sys,hashlib,re
OLD="const id=side+' premise '+j;if(items.some(x=>x.link===id))continue;const why='counted UNEXHIBITED in '+lab+', but its ['+rk+'] block exhibits "
NEW="const id=side+' premise '+j;if(items.some(x=>x.link===id))continue;if(PR.filter(p=>p.n===j).some(p=>unxAcFail(text,p.ref,rk)))continue;/* ASK 520: a press of this premise the judge's own ANSWER CHECK grades MISSES or FAILS leaves the witness unanswered (ruling 372), so Commitment 5 counts it; no K-UNX item */const why='counted UNEXHIBITED in '+lab+', but its ['+rk+'] block exhibits "
def patch(src,dst):
    d=json.load(open(src));N={n['name']:n for n in d['nodes']}
    t=N['Shared Library']['parameters']['jsCode']
    a=t.index('\n/*LIB*/')+8;b=t.rindex('\n/*MAP*/');c=b+8;e=t.rindex('\n/*END*/')
    L=json.loads(t[a:b]);M=json.loads(t[c:e])
    assert L[479].count(OLD)==1 and sum(l.count(OLD) for l in L)==1,'OLD'
    L[479]=L[479].replace(OLD,NEW)
    newsha=hashlib.sha256(json.dumps(L,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()[:16]
    head=re.sub(r'library sha [0-9a-f]{16}','library sha '+newsha,t[:a-8],count=1)
    def code(k): return '\n'.join((L[x] if isinstance(x,int) else (x[0] if isinstance(x[0],str) else '\n'.join(L[x[0]:x[1]+1]))) for x in M[k]['p'])
    ch=[]
    for k in M:
        nl=len(code(k))
        if M[k].get('n')!=nl: M[k]['n']=nl;ch.append(k)
    N['Shared Library']['parameters']['jsCode']=head+'\n/*LIB*/'+json.dumps(L,ensure_ascii=False)+'\n/*MAP*/'+json.dumps(M,ensure_ascii=False)+'\n/*END*/'+t[e+8:]
    json.dump(d,open(dst,'w'),ensure_ascii=False);print(dst,len(L),newsha,'MAP n changed',ch);return L
L1=patch('/mnt/project-files/ask517/w1/target_engine_517.json','target_engine_520.json')
L2=patch('/mnt/project-files/ask517/w1/target_child_517.json','target_child_520.json')
assert L1==L2
