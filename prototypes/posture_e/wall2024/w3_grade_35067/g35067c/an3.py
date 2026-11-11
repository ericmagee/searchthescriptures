import json,re,sys,io
from collections import Counter,OrderedDict
_o=sys.stdout; sys.stdout=io.StringIO()
from an2 import V,strip,nm,row,ROUND
sys.stdout=_o
st=json.load(open('nodes/Judge_Enforcer_Build.json'))[0]['data']['main'][0]
items=V['130'][1]
def sections(t):
    m=re.search(r"THE ANSWER IN FULL, FROM (\[[^\]]+\]) [^\n]*?: \"(.*?)\"(?=\nTHE SIDE'S OTHER LINES|\nTHE JUDGES' GRADES:)",t,re.S)
    full=(m.group(1),m.group(2)) if m else None
    m2=re.search(r"THE SIDE'S OTHER LINES ON THIS VERSE \([^)]*\): \"(.*?)\"(?=\nTHE JUDGES' GRADES:)",t,re.S)
    oth=m2.group(1) if m2 else None
    m3=re.search(r"\nTHE ANSWER: \"(.*?)\"(?=\nTHE ANSWER IN FULL|\nTHE SIDE'S OTHER|\nTHE JUDGES' GRADES:)",t,re.S)
    ans=m3.group(1) if m3 else None
    pv=re.search(r"PRESSED VERSE: ([^\n]*)",t); mn=re.search(r"WHAT THE PRESS SAYS THE VERSE MEANS: ([^\n]*)",t)
    hdr=re.match(r"ITEM (\S+) \(E-ANS; the answering side wrote this in \[(\w+)\]\)",t)
    return dict(full=full,other=oth,ans=ans,verse=pv.group(1) if pv else None,means=mn.group(1) if mn else None,rnd=hdr.group(2) if hdr else None)
EA={k:dict(x,**sections(x['text'])) for k,x in items.items() if x['rule']=='E-ANS'}
print(len(EA))
# other-section analysis
res=[]
for k,x in EA.items():
    if not x['other']: continue
    o=x['other']
    paras=re.split(r'\n(?=\[(?:CR|DR)\d(?:, LINK \d+)?\] )',o)
    labs=[re.match(r'\[((?:CR|DR)\d(?:, LINK \d+)?)\]',p).group(1) if re.match(r'\[((?:CR|DR)\d(?:, LINK \d+)?)\]',p) else None for p in paras]
    res.append((k,len(o),labs))
print(Counter(len(r[2]) for r in res)); print(max(r[1] for r in res), sorted(r[1] for r in res)[-8:])
print(Counter(l for r in res for l in r[2]))
bad=[(k,l) for k,n,l in res if None in l]; print('unlabelled',bad[:5])
print('-----')
def N(s): return re.sub(r'\s+',' ',s)
D4=N(row['defender_r4']);C4=N(row['challenger_r4'])
for k,x in EA.items():
    if not x['other']: continue
    o=x['other']
    paras=re.split(r'\n(?=\[(?:CR|DR)\d(?:, LINK \d+)?\] )',o)
    for p in paras:
        body=re.sub(r'^\[[^\]]+\] ','',p); body=re.sub(r' \[\.\.\.\]$','',body)
        # body may be multi-line (blank-collapsed?) check each line prefix
        ok=N(body) in D4
        inC=N(body) in C4
        pw=('PRESSED WITH' in p) or ('-- MEANS:' in p)
        if (not ok) or inC or pw: print('CHECK',k,ok,inC,pw,repr(p[:100]))
ptr=[]
for k,x in EA.items():
    t=(x['ans'] or '')+' '+(x['full'][1] if x['full'] else '')
    if re.search(r'under link \d|\(link \d\)|link \d',t,re.I): ptr.append((k,x['rnd'],bool(x['other']),re.findall(r'[^.]*link \d[^.]*',t,re.I)[:2]))
print('pointer-like',len(ptr))
for p in ptr: print(p)
print('=====')
print(Counter(x['rnd'] for x in EA.values()), Counter((x['rnd'],bool(x['other'])) for x in EA.values()))
later={'CR1':['CR2','CR3','CR4'],'CR2':['CR3','CR4'],'CR3':['CR4'],'DR1':['DR2','DR3'],'DR2':['DR3'],'DR3':[],'CR4':[]}
txt={r:row[ROUND[r]] for r in ROUND}
miss=[]
for k,x in EA.items():
    if x['other']: continue
    v=x['verse']
    refs=re.findall(r'((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)? \d+:\d+(?:[-,] ?\d+)?)',v)
    hit=[]
    for r in later[x['rnd']]:
        for ref in refs:
            bookchap=ref.split(':')[0]
            if ref in txt[r]: hit.append((r,ref))
    if hit: miss.append((k,x['rnd'],v,hit))
print('items without OTHER whose verse string appears in a later round of the same side:',len(miss))
for m in miss: print(m)
print([ (k,x['verse']) for k,x in EA.items() if x['other']][:5])
print('#####BS')
for v in ['127','128','129','130']:
    its=V[v][1]
    ea=[k for k,x in its.items() if x['rule']=='E-ANS']
    q=[k for k in ea if '"' in (sections(its[k]['text'])['ans'] or '') or '"' in ((sections(its[k]['text'])['full'] or ('',''))[1])]
    # answer holds a quote mark: use THE ANSWER text and FULL text
    bs=[k for k in ea if '\\' in its[k]['text']]
    bsq=[k for k in ea if re.search(r'\\+["\u201c\u201d\u2018\u2019\']',its[k]['text'])]
    allbs=[k for k,x in its.items() if '\\' in x['text']]
    print(v,'E-ANS items',len(ea),'answer(ANSWER or FULL) holds a double quote mark',len(q),'| items with any backslash',bs,'| backslash before a quote',bsq,'| any-rule items with backslash',allbs)
# stored call system/user all
for i,x in enumerate(st):
    b=x['json']['body']['messages']
    print(i, [m['content'].count('\\') for m in b])
print('#####CTX')
its=V['130'][1]
fieldcount=Counter()
for k in [k for k,x in its.items() if '\\' in x['text']]:
    t=its[k]['text']
    for m in re.finditer(r'\\',t):
        # find enclosing line's header
        ls=t.rfind('\n',0,m.start())+1; le=t.find('\n',m.start()); line=t[ls:le]
        # walk back to find field header
        pre=t[:m.start()]
        hdrs=re.findall(r"\n(THE ANSWER IN FULL|THE ANSWER|THE SIDE'S OTHER LINES|THE JUDGES' GRADES|WHAT THE PRESS SAYS|PRESSED VERSE|- [A-Z]\d+\.\d+ \(\w+\))",pre)
        fieldcount[(k[0],hdrs[-1][:30] if hdrs else None)]+=1
print(fieldcount)
k='B86';t=its[k]['text'];i=t.find('\\');print(t[max(0,i-400):i+300])
print('#####BS2')
BS=[]
for v in ['127','128','129','130']:
    its=V[v][1]; cnt=Counter()
    for k,x in its.items():
        if x['rule']!='E-ANS': continue
        t=x['text']
        for m in re.finditer(r'\\(.?)',t):
            pre=t[:m.start()]
            hdrs=re.findall(r"\n(THE ANSWER IN FULL|THE ANSWER|THE SIDE'S OTHER LINES|THE JUDGES' GRADES|WHAT THE PRESS SAYS|PRESSED VERSE)",pre)
            cnt[(hdrs[-1] if hdrs else None, m.group(1))]+=1
            if v=='130': BS.append((k,hdrs[-1] if hdrs else None,m.group(1),t[max(0,m.start()-60):m.start()+40].replace('\n','\\n')))
    print(v,dict(cnt))
json.dump(BS,open('bs130.json','w'))
print(len(BS)); 
for b in BS[:6]: print(b)
print([b for b in BS if b[1]=="THE ANSWER IN FULL" or b[1]=="THE SIDE'S OTHER LINES"][:5])
