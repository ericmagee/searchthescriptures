import hashlib
def md5(s): return hashlib.md5((s if s.endswith('\n') else s+'\n').encode()).hexdigest()[:8]
A2="A verse on a side's 'cited in' line counts as an unanswered witness only when the judge quotes the sentence of the earlier round that pressed it against that link or a listed premise and names that round; a verse cited there but not pressed against the link does not count."
B="A judge who grades a link BROKEN because the witnesses exclude, deny or establish something must quote the words that state it; where the quoted words, read in their own context and with the other verses the judge quotes, do not state it, the ground is the judge's own [L4] inference, and it counts only when the judge exhibits two lower layers ([L1]-[L3]) for it, as submitted evidence must; otherwise it is no ground for BROKEN, and the link is graded under the remaining rules."
assert hashlib.md5(A2.encode()).hexdigest()=='a1828be53085a0b670e17f4a164e1dfe' and hashlib.md5(B.encode()).hexdigest()=='571fc39d2c317ae61d206b76edf9f519'
PD="In your LINK ROUND, quote every verse the challenger pressed against a link and show from the text why it does not overturn the link: a verse you pass over is graded unanswered and costs the link."
PC="In your LINK ROUND, quote every verse the defender pressed against your chain and show from the text why it does not overturn your link: a verse you pass over is graded unanswered and costs the link."
s=open('base/Init_with_Guards.js').read()
for p in (PD,PC): assert s.count(p)==1
t=s.replace(PD,A2+' '+B).replace(PC,A2+' '+B)
assert t.count(A2+' '+B)==2 and 'a verse you pass over' not in t
open('Init_with_Guards.new.js','w').write(t)
print('Init with Guards',md5(s),len(s),'->',md5(t),len(t),'%+d'%(len(t)-len(s)))
