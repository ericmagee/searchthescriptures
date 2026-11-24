# ASK 583 N3: for ten engine ASKs written 2026-11-23, in which parts of the v241 cut does "ASK <n>" occur?
import sys,re
sys.path.insert(0,'/mnt/project-files/manual1123/w3/a583')
from split583 import split
c=open(sys.argv[1],encoding='utf-8').read(); parts=split(c)
names=[];sec='00';k=0
for p in parts:
    m=re.match(r'\n?## (\d+)\. ',p)
    if m:
        ns='%02d'%int(m.group(1)); k=k+1 if (ns==sec and names) else 0; sec=ns
    else: k=k+1 if names else 0
    names.append('%s.%d'%(sec,k))
for a in [550,556,549,573,575,576,581,562,571,561]:
    hit=[(n,len(re.findall(r'ASK %d\b'%a,p))) for n,p in zip(names,parts) if re.search(r'ASK %d\b'%a,p)]
    print('ASK',a,'parts',len(hit),hit)
