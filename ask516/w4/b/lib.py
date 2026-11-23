import json,sys
def load(f):
    d=json.load(open(f)); N={n['name']:n for n in d['nodes']}
    t=N['Shared Library']['parameters']['jsCode']
    a=t.index('\n/*LIB*/')+8;b=t.rindex('\n/*MAP*/');c=b+8;e=t.rindex('\n/*END*/')
    L=json.loads(t[a:b]);M=json.loads(t[c:e])
    def code(k):
        return '\n'.join((L[x] if isinstance(x,int) else (x[0] if isinstance(x[0],str) else '\n'.join(L[x[0]:x[1]+1]))) for x in M[k]['p'])
    return d,N,L,M,code
