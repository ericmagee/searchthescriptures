# ASK 519 build (W4): K-W / K-S3 not raised on a grant-class sentence that names no id. Base: W1's ASK 517 targets (517 is written first).
import json,sys,hashlib,copy
sys.path.insert(0,'/mnt/project-files/ask516/w4/b')
from lib import load
ID=r"/\b(?:[DC][1-9]\d*|(?:LINK|[Ll]ink)\s*\d+|[Pp]remise\s*\d+|P\d+\.\d+)\b/"
OLD1="if(pg&&!/\\b(?:[DC][1-9]|LINK\\s*\\d|[Ll]ink\\s+\\d)\\b/.test(s)&&gn++>=10)continue;n++;"
NEW1="if(/(?:grant|concede|admit|accept|agree)$/i.test(m[0])&&!"+ID+".test(s)){n++;continue;}/* ASK 519: a grant-class sentence that names no link, premise or press is not raised; n still counts it */n++;"
OLD2="{let __k3=0;for(const n of orcLines(text)){__k3++;items.push("
NEW2=("{let __k3=0;for(const n of orcLines(text)){__k3++;{const __b519=String(n).replace(/^(?:DEFENDER|CHALLENGER)\\s+(?:CR4|DR4):\\s*/i,'');"
      "if(/(?<!\\b(?:my|his|her|their|our|its|the|these|those|of|no|any)\\s)\\b(?:grant(?:s|ed)?|concede[sd]?|admit(?:s|ted)?|accept(?:s|ed)?\\s+that|agree(?:s|d)?\\s+that)\\b/i.test(__b519)"
      "&&!/\\b(?:withdraw(?:s|n)?|drop(?:s|ped)?|retract(?:s|ed)?|give[sn]?\\s+up|gave\\s+up|(?:do|does)\\s+not\\s+(?:claim|rest)|no\\s+longer\\s+(?:claim|rest))\\b/i.test(__b519)"
      "&&!"+ID+".test(__b519))continue;}/* ASK 519: a grant-class line that names no link, premise or press is not raised; __k3 still counts it */items.push(")
def patch(src,dst):
    d=json.load(open(src));N={n['name']:n for n in d['nodes']}
    t=N['Shared Library']['parameters']['jsCode']
    a=t.index('\n/*LIB*/')+8;b=t.rindex('\n/*MAP*/');c=b+8;e=t.rindex('\n/*END*/')
    L=json.loads(t[a:b]);M=json.loads(t[c:e])
    assert L[2213].count(OLD1)==1, 'OLD1'
    assert L[792].count(OLD2)==1, 'OLD2'
    oldsha=hashlib.sha256(json.dumps(L,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()[:16]
    L[2213]=L[2213].replace(OLD1,NEW1);L[792]=L[792].replace(OLD2,NEW2)
    newsha=hashlib.sha256(json.dumps(L,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()[:16]
    head=t[:a-8]
    import re
    head=re.sub(r'library sha [0-9a-f]{16}','library sha '+newsha,head,count=1)  # header set to the computed sha (Library Check compares them)
    def code(k):
        return '\n'.join((L[x] if isinstance(x,int) else (x[0] if isinstance(x[0],str) else '\n'.join(L[x[0]:x[1]+1]))) for x in M[k]['p'])
    ch=[]
    for k in M:
        nl=len(code(k))
        if M[k].get('n')!=nl: M[k]['n']=nl;ch.append(k)
    t2=head+'\n/*LIB*/'+json.dumps(L,ensure_ascii=False)+'\n/*MAP*/'+json.dumps(M,ensure_ascii=False)+'\n/*END*/'+t[e+8:]
    N['Shared Library']['parameters']['jsCode']=t2
    json.dump(d,open(dst,'w'),ensure_ascii=False)
    print(src.split('/')[-1],'->',dst,len(L),oldsha,'->',newsha,'MAP n changed',ch)
    return L
L1=patch('/mnt/project-files/ask517/w1/target_engine_517.json','target_engine_519.json')
L2=patch('/mnt/project-files/ask517/w1/target_child_517.json','target_child_519.json')
assert L1==L2
json.dump(L1,open('lib519.json','w'),ensure_ascii=False)
