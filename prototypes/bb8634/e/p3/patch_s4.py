# BB-8634 S4 (merged text 8669, agreed 8670, approved 8681 with 8671's falsifiers): J1, J2 judges; L link rounds; X extractor.
import sys
def esc(s): return s.replace("\\","\\\\").replace("'","\\'")
def patch(path,pairs):
    s=open(path).read()
    for old,new in pairs:
        n=s.count(old)
        if n!=1: sys.exit(f'STOP {path}: count {n}: {old[:70]}')
        s=s.replace(old,new)
    open(path,'w').write(s)
A_J1="tag it CONCEDED (stated) or CONCEDED (conditional: <condition>). w = their number."
J1=" A withdrawn link that carries a witness pressed against it and left unanswered, by the UNANSWERED WITNESS test, in every round of its side before the round that withdraws it is still graded at its collision."
A_J2="A link counted in w: D<i>: WITHDRAWN."
J2="A link counted in w: D<i>: WITHDRAWN; or, for a link withdrawn after an unanswered witness, D<i> vs C<j> (<verse>): WITHDRAWN AFTER AN UNANSWERED WITNESS -- <grade> -- the grade counting as any collision grade."
for f in ['p3/new/Panel_Build.js','p3/new/Build_Independent_Verdict.js']:
    patch(f,[(A_J1,A_J1+esc(J1)),(A_J2,esc(J2))])
A_L1="in exactly one of two forms"; L1="in exactly one of three forms"
A_L2="or LINK n: CONCEDED -- it floats free"
L2="; or LINK n: NARROWED TO: <the limb you keep> -- exhibit that limb's footing as for SUPPORTED; the limb you drop leaves the link; the link is judged in its narrowed form"
patch('p3/new/C3_Build.js',[(A_L1,L1),(A_L2,A_L2+esc(L2))])
A_L2D=A_L2+' (rests on no exhibited prior-layer footing)'  # 8685/8686: in D3 the CONCEDED form carries this tail; L goes after it
patch('p3/new/D3_Build.js',[(A_L1,L1),(A_L2D,A_L2D+esc(L2))])
X=[("const colMap={};const colUnparsed=[];let chBroken=0;","const colMap={};const colUnparsed=[];let chBroken=0;const colWB=new Set(); // BB-8634 S4-X: links on a WITHDRAWN AFTER AN UNANSWERED WITNESS line"),
   ("const rest=m[2];let st=null;","const rest=m[2];if(/WITHDRAWN AFTER AN UNANSWERED WITNESS/.test(rest))colWB.add(+m[1]);let st=null;"),
   ("const dw=colIds.filter(i=>colState(i)==='WITHDRAWN').length;","const dw=colIds.filter(i=>colState(i)==='WITHDRAWN'||colWB.has(i)).length; /* S4-X: such a link is withdrawn (in w) and graded at its collision (in k when BROKEN) */"),
   ("const stands=(i)=>{const s=colState(i);","const stands=(i)=>{if(colWB.has(i))return false;const s=colState(i);"),
   ("colIds.map(i=>'D'+i+'='+colState(i))","colIds.map(i=>'D'+i+'='+colState(i)+(colWB.has(i)?'(WITHDRAWN AFTER WITNESS)':''))")]
patch('p3/new/Extract_Independent_Verdict.js',X)
print('ok')
