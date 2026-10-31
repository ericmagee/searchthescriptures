import json,hashlib,difflib
S='/tmp/claude-0/-home-user-searchthescriptures/b26695b3-56b9-5f42-92b7-63fcf7fb72c9/scratchpad/'
A=S+'v8679/prototypes/bb8634/e/p3/new/'   # part A files I passed (a878948)
B=S+'v8684/prototypes/bb8634/e/p3/'
md=lambda s: hashlib.md5(s.encode()).hexdigest()
d=json.load(open('/home/user/searchthescriptures/prototypes/bb8403/a3/s2fetch/vbb147946_active.json'))
nodes={n['name']:n['parameters'].get('jsCode','') for n in d['workflow']['nodes']}
c3=nodes['C3 Build']; print('C3 active',md(c3),'E base',md(open(B+'base/C3_Build.js').read()))
J1a="tag it CONCEDED (stated) or CONCEDED (conditional: <condition>). w = their number."
J1=" A withdrawn link that carries a witness pressed against it and left unanswered, by the UNANSWERED WITNESS test, in every round of its side before the round that withdraws it is still graded at its collision."
J2o="A link counted in w: D<i>: WITHDRAWN."
J2n="A link counted in w: D<i>: WITHDRAWN; or, for a link withdrawn after an unanswered witness, D<i> vs C<j> (<verse>): WITHDRAWN AFTER AN UNANSWERED WITNESS -- <grade> -- the grade counting as any collision grade."
Lo1="in exactly one of two forms"; Ln1="in exactly one of three forms"
La="or LINK n: CONCEDED -- it floats free"; Ladd="; or LINK n: NARROWED TO: <the limb you keep> -- exhibit that limb's footing as for SUPPORTED; the limb you drop leaves the link; the link is judged in its narrowed form"
def delim(s,a):
    i=s.index(a); j=i
    while j>0:
        j-=1
        if s[j] in "\"'`" and s[j-1]!='\\': return s[j]
def enc(t,q):
    t=t.replace('\\','\\\\'); return t.replace(q,'\\'+q) if q in "'\"" else t
def one(s,o,n):
    c=s.count(o); assert c==1,(c,o[:40]); return s.replace(o,n)
out={}
for k in ['Panel_Build','Build_Independent_Verdict']:
    s=open(A+k+'.js').read()
    q=delim(s,J1a); s=one(s,J1a,J1a+enc(J1,q)); q=delim(s,J2o); s=one(s,J2o,enc(J2n,q)); out[k]=s
for k,src in [('C3_Build',c3),('D3_Build',open(A+'D3_Build.js').read())]:
    s=one(src,Lo1,Ln1); q=delim(s,La); s=one(s,La,La+enc(Ladd,q)); out[k]=s
for k,v in out.items():
    e=open(B+'new/'+k+'.js').read(); print(k,'mine',md(v),'E',md(e),'EQUAL' if v==e else 'DIFFER')
    if v!=e:
        for op,i1,i2,j1,j2 in difflib.SequenceMatcher(None,v,e,autojunk=False).get_opcodes():
            if op!='equal': print('  ',op,repr(v[max(0,i1-40):i2+10])[:300],'=>',repr(e[max(0,j1-40):j2+10])[:300])
# Extract IV: diff part A -> part B
a=open(A+'Extract_Independent_Verdict.js').read(); b=open(B+'new/Extract_Independent_Verdict.js').read()
print('EIV A',md(a),'B',md(b))
for op,i1,i2,j1,j2 in difflib.SequenceMatcher(None,a,b,autojunk=False).get_opcodes():
    if op!='equal': print('EIV',op,'OLD:',repr(a[max(0,i1-100):i2+40]),'\n    NEW:',repr(b[max(0,j1-100):j2+40]),'\n')
