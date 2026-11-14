# pkgJBC (ASK 262): the judges get the pkgBCL borrowed-footing rule. Panel Build and Build Independent Verdict only. usage: python3 build.py <live s193 json> <target json>
import json,sys,hashlib
W=json.load(open(sys.argv[1]))
assert W['versionId']=='36ce08f1-2f60-486d-b2f6-29a4f1ff50e0','not s193'
A1="(at least two prior layers exhibited; a shown chain counts equally)."
B1="(at least two prior layers exhibited; a shown chain counts equally, save a step borrowed from its own side\\'s contested links, which carries nothing (pkgBCL))."
A2="an inferred act, such as a begetting or a knowing, is never an ASSUMES. "
B2=A2+"A shown chain is footing only through its rows and what the other side has granted (pkgBCL). When a step of a link\\'s [L4] takes as given the conclusion of the same side\\'s own other links (it names them, as \"(Links 1 to 3)\"), and the other side has not granted that conclusion, that step is the disputed point itself and is not footing: the premise is UNEXHIBITED, written (UNEXHIBITED: [L4] footing borrowed from contested Links <n>) with the step quoted, NARROWED or not. This is not a missing-row charge (DG-61): it applies only to a step that rests on the side\\'s own contested links. When that conclusion is granted, or the [L4] reaches the premise from its rows without the borrowed step, the premise is not counted for it. "
out=[]
for n in W['nodes']:
  if n['name'] in ('Panel Build','Build Independent Verdict'):
    s=n['parameters']['jsCode'];assert s.count(A1)==1 and s.count(A2)==2,n['name']
    t=s.replace(A1,B1).replace(A2,B2);n['parameters']['jsCode']=t
    out.append('%s %d->%d (+%d)'%(n['name'],len(s),len(t),len(t)-len(s)))
json.dump(W,open(sys.argv[2],'w'))
print(' | '.join(out))
