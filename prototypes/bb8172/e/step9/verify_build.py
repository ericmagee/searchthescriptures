import sys, hashlib
from texts import C3, QR, SV, CL
from patch_c3 import EDITS, sq  # re-runs the patch (idempotent: base -> new)
fail=0
def ok(c,m):
    global fail; print(('PASS ' if c else 'FAIL ')+m); fail+= (not c)
for f,eds in EDITS.items():
    b=open('base/'+f,encoding='utf-8').read(); n=open('new/'+f,encoding='utf-8').read()
    if f!='Format_Markdown.js':
        for name,s in [('C3',sq(C3)),('QR',sq(QR)),('SV',SV),('CL',CL)]:
            ok(n.count(s)==1 and b.count(s)==0, f+' '+name+' once in new, absent in base')
        ok(n.count('function preCheckSide(')==1 and n.count('function preCheckBlock(')==1, f+' pre-check functions once')
        ok(n.count('preCheckBlock(F)')+n.count('preCheckBlock(d)')==1, f+' block called once')
    else:
        ok(n.count(C3)==1 and n.count(QR)==1 and b.count(C3)==0, f+' C3 and QR quoted once')
    r=n
    for a,rep in eds: r=r.replace(rep,a,1)
    ok(r==b, f+' new minus the inserts == base (byte-equal)')
print('ALL PASS' if not fail else 'FAILED %d'%fail); sys.exit(1 if fail else 0)
