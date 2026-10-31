# BB-8634 portion 3: T1-T4 by anchor (8665, agreed 8668). Each anchor must occur exactly once.
import sys
def esc(s): return s.replace("\\","\\\\").replace("'","\\'")
def patch(path, pairs):
    s=open(path).read()
    for old,new in pairs:
        n=s.count(old)
        if n!=1: sys.exit(f'STOP {path}: anchor count {n}: {old[:60]}')
        s=s.replace(old,new)
    open(path,'w').write(s)
T1=" DG-61 binds your own case: no verse is required to state a conclusion, for either side. Argue from the rows that affirm your reading; never rest a premise on the demand that a verse state an exclusion or a denial in its own words, and never charge the defender with lacking such a verse."
T2=" The same holds against the challenger: a challenger premise or answer whose support is that no verse states the defender's link, or an exclusion, in its own words is that retired test and is not SUPPORTED on that ground. A reading cited from the Septuagint (LXX) is a citation error for either side: name it at the citation check and give it no weight as footing."
T3=" A Septuagint (LXX) reading is not footing: cite the KJV row, and for [L2] the Hebrew or Greek of that row. A count or universal taken from a served sight (every row, no row, fifty rows) is written with that sight's label and the count as served."
A1="it binds you exactly as it binds the defender): tag every load-bearing objection with its layer."
A2="that demand is the retired stating-verse test, at a collision as everywhere else."
A3=" Concise wins:"
O4="a pressed verse left off the list is not counted"
N4="a pressed verse left off the list is weaker: it reaches the judges only if the other side never names it"
patch('p3/new/Init_with_Guards.js',[(A1,A1+esc(T1)),(A3,esc(T3)+A3)])
for f in ['p3/new/Panel_Build.js','p3/new/Build_Independent_Verdict.js']: patch(f,[(A2,A2+esc(T2))])
for f in ['p3/new/C2_Build.js','p3/new/D3_Build.js']: patch(f,[(O4,N4)])
print('ok')
