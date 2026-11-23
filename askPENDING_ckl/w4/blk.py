import json,re
R=json.load(open('rounds.json'))
def N(s): 
    s=re.sub(r'[“”"’‘\'*_`\[\]]','',str(s).lower());s=re.sub(r'[^a-z0-9:\s]',' ',s);return re.sub(r'\s+',' ',s).strip()
def blk(q,raw):
    L=raw.split('\n');x=N(q.split('...')[0])
    I=[i for i,l in enumerate(L) if x in N(l)]
    if len(I)!=1: return ('ambig',len(I))
    for j in range(I[0]-1,-1,-1):
        h=re.match(r'^\s*(?:#{1,4}\s*[*_]*|[*_]{2})(.*)$',L[j])
        if h and re.match(r'^\s*[*_]{2}\s*ANSWER\b',L[j],re.I): continue
        if not h:
            if re.match(r'^\s*-{3,}\s*$',L[j]): return None
            continue
        ns=set(int(m) for m in re.findall(r'\b(?:C|LINK\s+)(\d+)\b',h.group(1),re.I))
        return (list(ns)[0] if len(ns)==1 and re.search(r'\b(?:C|LINK\s+)(\d+)\b',h.group(1)[:12],re.I) else None, h.group(1)[:90])
    return None
def head(raw,n):
    for l in raw.split('\n'):
        if re.match(r'^\s*(?:#{1,4}\s*[*_]*|[*_]{2})\s*(?:LINK\s+|C)'+str(n)+r'\b',l): return l.strip()[:110]
rows=[(45542,'ODV1-40891-umeouul3',1,'LINK 6: NARROWED TO: Joseph functioned as husband and legal father, not biological sire.'),(45543,'ODV1-40891-umeouul3',5,'LINK 6: NARROWED TO: Joseph functioned as husband and legal father, not biological sire.'),(48277,'ODV1-41102-8tdxwzkn',1,'I drop any claim that the rows exclude the reading outright.'),(48278,'ODV1-41102-8tdxwzkn',4,'I grant it for Cain.'),(48279,'ODV1-41102-8tdxwzkn',2,'My link does not rest on a verdict in 1:19.'),(47150,'ODV1-41024-2wbmceb5',6,'I drop the wording "the step to Joseph\'s body is the defender\'s addition".'),(48692,'ODV1-41117-2xbwme8t',6,'I drop the clause "and it names no man as sowing it".'),(51653,'ODV1-41736-qtw0w6t1',1,'I drop the limb "the clause names no human father."')]
for id,t,n,q in rows:
    d=R[t]['challenger_r3'] or ''
    print(id,t[5:10],'named',n,'earlier blk',blk(q,d),'| DR3 head n:',head(d,n))
def block_text(raw,n):
    L=raw.split('\n');out=[];on=False
    for l in L:
        if re.match(r'^\s*(?:#{1,4}\s*[*_]*|[*_]{2})\s*(?:LINK\s+|C)\d+\b',l):
            on=bool(re.match(r'^\s*(?:#{1,4}\s*[*_]*|[*_]{2})\s*(?:LINK\s+|C)'+str(n)+r'\b',l))
        if on: out.append(l)
    return '\n'.join(out)
STOP=set('the a an and of to in is it its that this not no by as be for on with his her he she was were are which who from at or into these those there their them they than then so'.split())
for id,t,n,cq in [(51653,'ODV1-41736-qtw0w6t1',1,'Therefore the begetting of Christ is assigned to the Holy Ghost and not to a man, and no human biological father stands in it.'),(48277,'ODV1-41102-8tdxwzkn',1,'Together these give Joseph as husband and reckoned father, with the begetting attributed to the Holy Ghost.'),(47150,'ODV1-41024-2wbmceb5',6,"So Romans 1:3 is met by the seed of David received through the woman, and no row requires Joseph's body for it.")]:
    b=N(block_text(R[t]['challenger_r3'],n));bw=set(b.split())
    w=[x for x in N(cq).split() if x not in STOP]
    print(id,'closing content words in DR3 LINK',n,'block:',sum(x in bw for x in w),'/',len(w),[x for x in w if x not in bw])
