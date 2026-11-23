# ASK 519 (W4): per run, items dropped and added by 519 against the 517 base, #n ignored; each dropped sentence tested for withdrawal-class and id the way 519 tests it.
import json,re,sys
from collections import Counter
W=re.compile(r"\b(?:withdraw(?:s|n)?|drop(?:s|ped)?|retract(?:s|ed)?|give[sn]?\s+up|gave\s+up|(?:do|does)\s+not\s+(?:claim|rest)|no\s+longer\s+(?:claim|rest))\b",re.I)
ID=re.compile(r"\b(?:[DC][1-9]\d*|(?:LINK|[Ll]ink)\s*\d+|[Pp]remise\s*\d+|P\d+\.\d+)\b")
def sent(x):
    rule,ln=x.split(' | ')[1],x.split(' | ',3)[3]
    if rule=='K-W':
        m=re.match(r'^\[[^\]]+\][^:]*:\s*"(.*)"$',ln,re.S);return m.group(1) if m else ln
    return re.sub(r'^(?:DEFENDER|CHALLENGER)\s+(?:CR4|DR4):\s*','',ln,flags=re.I)
for e in sys.argv[1:]:
    for r in json.load(open(f'items519_full_{e}.json')):
        norm=lambda L:Counter(re.sub(r' #\d+ ',' # ',x) for x in L)
        A,B=norm(r['base']),norm(r['b519']);add=B-A;drop=A-B
        k=lambda C,t:sum(v for x,v in C.items() if f'| {t} |' in x)
        fw=[x for x in drop if W.search(sent(x))];fi=[x for x in drop if ID.search(sent(x))]
        print(f"== {e} {r['node']}: K-W {k(A,'K-W')} -> {k(B,'K-W')}, K-S3 {k(A,'K-S3')} -> {k(B,'K-S3')}; dropped {sum(drop.values())} ({len(drop)} distinct): withdrawal-class {len(fw)}, naming an id {len(fi)}; added {sum(add.values())}")
        for x in fw+fi: print('   FLAG',x[:240])
        for x in add: print('   +',x[:240])
