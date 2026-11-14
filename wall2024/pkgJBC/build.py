# pkgJBC rev 2 (ASK 262; W1 6184 F1-F3, W3 6183): the judges get the pkgBCL borrowed-footing rule. Panel Build and Build Independent Verdict only. usage: python3 build.py <live s193 json> <target json>
import json,sys
W=json.load(open(sys.argv[1]))
assert W['versionId']=='36ce08f1-2f60-486d-b2f6-29a4f1ff50e0','not s193'
A1="(at least two prior layers exhibited; a shown chain counts equally)."
B1="(at least two prior layers exhibited; a shown chain counts equally, save a step borrowed from its own side\\'s contested links, which carries nothing (pkgBCL))."
A3="shows the chain from them to the link is SUPPORTED and is not counted"
B3="shows the chain from them to the link, with no borrowed step, is SUPPORTED and is not counted"
A4="demanding a verse that states it is the retired stating-verse test, which is never applied."
B4=A4+" A shown chain is footing only through its rows and what the other side has granted (pkgBCL). When a step of a link\\'s [L4] takes as given the conclusion of the same side\\'s own other links (it names them, as \"(Links 1 to 3)\"), and the other side has not granted that conclusion, that step is the disputed point itself and is not footing, NARROWED or not: count the premise, written exactly Premise <N>: UNEXHIBITED ([L4] footing borrowed from contested Links <n>), with the step quoted after it. This is not a missing-row charge (DG-61): it applies only to a step that rests on the side\\'s own contested links. When that conclusion is granted, or the [L4] reaches the premise from its rows without the borrowed step, the premise is not counted for it."
out=[]
for n in W['nodes']:
  if n['name'] in ('Panel Build','Build Independent Verdict'):
    s=n['parameters']['jsCode'];assert s.count(A1)==1 and s.count(A3)==2 and s.count(A4)==2,n['name']
    t=s.replace(A1,B1).replace(A3,B3).replace(A4,B4);n['parameters']['jsCode']=t
    out.append('%s %d->%d (+%d)'%(n['name'],len(s),len(t),len(t)-len(s)))
json.dump(W,open(sys.argv[2],'w'))
print(' | '.join(out))
