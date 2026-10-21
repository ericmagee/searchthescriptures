# rebuild v82 from v81 and a pairs file; every old must occur exactly once in v81, and pairs must not overlap
import json,sys,hashlib
s=open(sys.argv[1]).read();P=[]
for f in sys.argv[2:-1]:P+=json.load(open(f))
spans=[]
for o,n in P:
    c=s.count(o);assert c==1,(c,o[:60]);i=s.index(o);spans.append((i,i+len(o),n))
spans.sort()
for a,b in zip(spans,spans[1:]):assert a[1]<=b[0],'overlap'
out=s
for i,j,n in reversed(spans):out=out[:i]+n+out[j:]
open(sys.argv[-1],'w').write(out)
print('v81',hashlib.md5(s.encode()).hexdigest(),'pairs',len(P),'v82',hashlib.md5(out.encode()).hexdigest(),len(s),'->',len(out))
