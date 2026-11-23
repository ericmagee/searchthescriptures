import json,re
R=json.load(open('rounds.json'))
rows=[(45541,'ODV1-40891-umeouul3',6,'DR3','LINK 6: NARROWED TO: Joseph functioned as husband and legal father'),(45542,'ODV1-40891-umeouul3',1,'DR3','LINK 6: NARROWED TO: Joseph functioned as husband and legal father'),(45543,'ODV1-40891-umeouul3',5,'DR3','LINK 6: NARROWED TO: Joseph functioned as husband and legal father'),(45544,'ODV1-40891-umeouul3',6,'DR3','LINK 6: NARROWED TO: Joseph functioned'),
(46695,'ODV1-40995-inaaza3z',5,'DR2','Then the finding with child stands before it'),(47148,'ODV1-41024-2wbmceb5',5,'DR3','I drop the wording "they do not name Joseph'),(47150,'ODV1-41024-2wbmceb5',6,'DR3','I drop the wording "the step to Joseph'),(48277,'ODV1-41102-8tdxwzkn',1,'DR3','I drop any claim that the rows exclude the reading outright'),(48278,'ODV1-41102-8tdxwzkn',4,'DR3','I grant it for Cain'),(48279,'ODV1-41102-8tdxwzkn',2,'DR3','My link does not rest on a verdict in 1:19'),(48692,'ODV1-41117-2xbwme8t',6,'DR3','I drop the clause "and it names no man as sowing it"'),(51653,'ODV1-41736-qtw0w6t1',1,'DR3','I drop the limb "the clause names no human father."')]
col={'DR2':'engine_r2','DR3':'challenger_r3'}
H=re.compile(r'(?m)^[#*\s>-]*(?:\*\*)?(?:LINK|C)\s*(\d+)\b')
for id,t,n,er,q in rows:
    s=R[t][col[er]] or ''
    s2=s.replace('“','"').replace('”','"').replace('’',"'")
    i=s2.find(q.replace('“','"').replace('”','"'))
    if i<0: print(id,t[5:10],'n',n,'quote NOT FOUND');continue
    hs=[(m.start(),m.group(1)) for m in H.finditer(s2) if m.start()<=i]
    m=hs[-1][1] if hs else None
    print(id,t[5:10],'named LINK',n,'earlier block',m,'CROSS' if m and int(m)!=n else '')
