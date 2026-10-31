import hashlib,sys
S='/tmp/claude-0/-home-user-searchthescriptures/b26695b3-56b9-5f42-92b7-63fcf7fb72c9/scratchpad/v8673/'
E=S+'e/prototypes/bb8634/e/'
md=lambda s: hashlib.md5(s.encode()).hexdigest()
T1="DG-61 binds your own case: no verse is required to state a conclusion, for either side. Argue from the rows that affirm your reading; never rest a premise on the demand that a verse state an exclusion or a denial in its own words, and never charge the defender with lacking such a verse."
T2="The same holds against the challenger: a challenger premise or answer whose support is that no verse states the defender's link, or an exclusion, in its own words is that retired test and is not SUPPORTED on that ground. A reading cited from the Septuagint (LXX) is a citation error for either side: name it at the citation check and give it no weight as footing."
T3=" A Septuagint (LXX) reading is not footing: cite the KJV row, and for [L2] the Hebrew or Greek of that row. A count or universal taken from a served sight (every row, no row, fifty rows) is written with that sight's label and the count as served."
A1="it binds you exactly as it binds the defender): tag every load-bearing objection with its layer."
A2="that demand is the retired stating-verse test, at a collision as everywhere else."
A3=" Concise wins:"
O4="a pressed verse left off the list is not counted"; N4="a pressed verse left off the list is weaker: it reaches the judges only if the other side never names it"
def delim(s,a):
    # find the quote char opening the string literal that contains anchor a (scan back for unescaped quote)
    i=s.index(a); j=i
    while j>0:
        j-=1
        c=s[j]
        if c in "\"'`" and s[j-1]!='\\': return c
def enc(t,q):
    t=t.replace('\\','\\\\')
    return t.replace(q,'\\'+q) if q in "'\"" else t
def one(s,old,new):
    assert s.count(old)==1,(old[:50]); return s.replace(old,new)
base={'Init_with_Guards':E+'p3/base/Init_with_Guards.js','C2_Build':E+'p3/base/C2_Build.js','Panel_Build':E+'new/Panel_Build.js','Build_Independent_Verdict':E+'new/Build_Independent_Verdict.js','D3_Build':E+'new/D3_Build.js'}
s={k:open(v).read() for k,v in base.items()}
q1=delim(s['Init_with_Guards'],A1); q3=delim(s['Init_with_Guards'],A3)
s['Init_with_Guards']=one(s['Init_with_Guards'],A1,A1+' '+enc(T1,q1))
s['Init_with_Guards']=one(s['Init_with_Guards'],A3,enc(T3,q3)+A3)
for k in ('Panel_Build','Build_Independent_Verdict'):
    q=delim(s[k],A2); print(k,'delim',q); s[k]=one(s[k],A2,A2+' '+enc(T2,q))
for k in ('C2_Build','D3_Build'): s[k]=one(s[k],O4,N4)
print('Init delims',q1,q3)
import os; os.makedirs(S+'mine',exist_ok=True)
for k,v in s.items():
    open(S+'mine/'+k+'.js','w').write(v)
    e=open(E+'p3/new/'+k+'.js').read()
    print(k,'mine',md(v),'E',md(e),'equal' if v==e else 'DIFFER')
