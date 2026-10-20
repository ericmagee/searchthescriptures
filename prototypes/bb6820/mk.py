import hashlib,subprocess
def md5(s): return hashlib.md5((s if s.endswith('\n') else s+'\n').encode()).hexdigest()[:8]
A2="A verse on a side's 'cited in' line counts as an unanswered witness only when the judge quotes the sentence of the earlier round that pressed it against that link or a listed premise and names that round; a verse cited there but not pressed against the link does not count."
B="A judge who grades a link BROKEN because the witnesses exclude, deny or establish something must quote the words that state it; where the quoted words, read in their own context and with the other verses the judge quotes, do not state it, the ground is the judge's own [L4] inference, and it counts only when the judge exhibits two lower layers ([L1]-[L3]) for it, as submitted evidence must; otherwise it is no ground for BROKEN, and the link is graded under the remaining rules."
print('A2 md5',hashlib.md5(A2.encode()).hexdigest(),len(A2)); print('B md5',hashlib.md5(B.encode()).hexdigest(),len(B))
ANCH='In a debate a non-response is never neutral.'
ins=(' '+A2+' '+B).replace('\\','\\\\').replace("'","\\'")
for nm in ['Build_Independent_Verdict','Panel_Build']:
    s=open('../bb6819/'+nm+'.new.js').read(); assert s.count(ANCH)==1
    i=s.index(ANCH)+len(ANCH); t=s[:i]+ins+s[i:]
    assert t[:i]+t[i+len(ins):]==s
    assert t[i:i+len(ins)].replace("\\'","'")==' '+A2+' '+B
    open(nm+'.new.js','w').write(t)
    print(nm,'J4',md5(s),len(s),'-> J3',md5(t),len(t),'+',len(t)-len(s))
