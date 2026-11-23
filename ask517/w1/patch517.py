# ASK 517 build (W1): S1 (L1346, L1488), S2 (L1177), S3 (L790, L810, L811), S5 (L1286 rd386) on the live engine and child (W4 07:53Z fetches).
import sys,json,hashlib
sys.path.insert(0,'/mnt/project-files/ask516/w4/b')
from lib import load
SRC='/mnt/project-files/ask516/w4/b/'
EDITS={
 790:("  if(st==='SELF-SUPPORTED'&&cnt[side]>0){items.push({rule:'K-G3',side,link:null,line:null});marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G3) -- '+lab+' STANDING SELF-SUPPORTED while '+cnt[side]+' '+side+' LINK BROKEN line'+(cnt[side]===1?'':'s')+' stand. REVIEW THIS ROW.]');}}",
      "  /* K-G3 retired by ASK 517: a standing follows its count only (engine_manual s8); a LINK BROKEN line does not decide it. */}"),
 810:("+\"K-G3 (a standing graded SELF-SUPPORTED while links of that side are graded BROKEN): cure it either with CORRECTED STANDING for that side, \"","+\"\""),
 811:("+\"PROP-DEPENDENT or COLLAPSED, or with RETRACTED for each BROKEN link of that side, each with its reason (the round in brackets, then its words quoted or the verse it cites), and the one CORRECTED RESULT of your whole reply. \"","+\"\""),
 1177:(("  const brk=((broken||{})[x.side]||[]).filter(l=>!wd.has(U(l))).length>0;  const want=ns[0]===0?(brk?'PROP-DEPENDENT':'SELF-SUPPORTED'):","  const want=ns[0]===0?'SELF-SUPPORTED':")),
 1346:("  if(n>=1||brk[sd]>0)return ","  if(n>=1)return "),
 1488:("if(n>=1||brk[sd]>0)return ","if(n>=1)return "),
 1286:("r=i.cst==='SELF-SUPPORTED'?'CHALLENGER WINS':'UNDERDETERMINED';","r=(i.cst==='SELF-SUPPORTED'&&!col.some(z=>z.grade==='CHALLENGER LINK BROKEN'))?'CHALLENGER WINS':'UNDERDETERMINED'; /* ASK 517 S5: BROKEN gives CHALLENGER WINS only with no collision graded CHALLENGER LINK BROKEN (operator 22:26 CST 11-19) */"),
}
def patch(fn,out):
    d,N,L,M,_=load(fn if fn.startswith('/') else SRC+fn)
    t=N['Shared Library']['parameters']['jsCode']
    a=t.index('\n/*LIB*/')+8;b=t.rindex('\n/*MAP*/')
    assert json.dumps(L,separators=(',',':'),ensure_ascii=False)==t[a:b]
    L2=list(L)
    for i,(o,n) in EDITS.items():
        if i in (790,810,811):
            assert L2[i].strip()==o.strip(),(i,L2[i][:120]); L2[i]=n if i==790 else L2[i].replace(o.strip(),n)
        else:
            assert L2[i].count(o)==1,(i,L2[i].count(o)); L2[i]=L2[i].replace(o,n)
    assert len(L2)==len(L)==3560
    ch=[i for i in range(len(L)) if L[i]!=L2[i]]; assert ch==sorted(EDITS),ch
    c0=b+8;e0=t.rindex('\n/*END*/')
    assert json.dumps(M,separators=(',',':'),ensure_ascii=False)==t[c0:e0]
    def code(LL,k): return '\n'.join((LL[x] if isinstance(x,int) else (x[0] if isinstance(x[0],str) else '\n'.join(LL[x[0]:x[1]+1]))) for x in M[k]['p'])
    for k in M:
        assert M[k]['n']==len(code(L,k)),k   # n is the JS string length; ASCII check below
        M[k]['n']=len(code(L2,k))
    t2=t[:a]+json.dumps(L2,separators=(',',':'),ensure_ascii=False)+t[b:c0]+json.dumps(M,separators=(',',':'),ensure_ascii=False)+t[e0:]
    N['Shared Library']['parameters']['jsCode']=t2
    json.dump(d,open(out,'w'),ensure_ascii=False)
    return hashlib.md5(t.encode()).hexdigest(),hashlib.md5(t2.encode()).hexdigest(),L2
import os
ENG=os.environ.get('ENG','live_moMxiV4Irg1uRBZN.json');CHI=os.environ.get('CHI','live_MqQHRl7mQQ0z8QdT.json');print('base',ENG,CHI)
e=patch(ENG,'target_engine_517.json')
c=patch(CHI,'target_child_517.json')
print('engine lib',e[0][:8],'->',e[1][:8]); print('child lib',c[0][:8],'->',c[1][:8]); print('libs equal',e[2]==c[2])
for i in sorted(EDITS): print(i, e[2][i][:200])
