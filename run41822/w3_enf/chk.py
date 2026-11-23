import json,re,collections
calls={c['id']:c for c in json.load(open('calls.json'))}
R=json.load(open('/mnt/project-files/run41822/results.json'))
def flat(o):
    if isinstance(o,str): return o
    if isinstance(o,dict): return '\n'.join(flat(v) for v in o.values())
    if isinstance(o,list): return '\n'.join(flat(v) for v in o)
    return ''
def N(s): return re.sub(r'\s+',' ',re.sub(r'[“”"‘’\'`*_\[\]]','',s)).strip().lower()
RN=N(flat(R))
ALLOW={'E-ANS':{'MEETS','MISSES'},'E-COL':{'BROKEN','STANDS','UNDERDETERMINED'},'E-HOLD':{'BROKEN','STANDS','UNDERDETERMINED'},'E-KEY':{'BROKEN','STANDS'},'E-PREM':{'COUNTED','SPARED','VOID'},'E-SYN':{'TRUE','OVERSTATED'},'E-VOID':{'VOID','NOT VOID'},'E-RES':{'FOLLOWS','DOES NOT FOLLOW'},'E-B7':{'SAME GROUND','DIFFERENT GROUND'}}
out=[];stat=collections.Counter()
for cid,c in calls.items():
    p=c['prompt_sent']
    if not p.startswith('RULE ONE VERSE'): continue
    body=p[p.index('[THE ROUNDS IN FULL'):]; PN=N(body)
    it={}
    ms=list(re.finditer(r'^ITEM (\w+) \((E-[A-Z0-9]+)',body,re.M))
    for a,m in enumerate(ms):
        it[m.group(1)]=(m.group(2),body[m.start():ms[a+1].start() if a+1<len(ms) else len(body)])
    for ln in c['full_reply'].split('\n'):
        ln=ln.strip()
        if not ln or ln.startswith('ENGAGE'): 
            if ln.startswith('ENGAGE'): stat['engage']+=1
            continue
        m=re.match(r'ENFORCER: (\w+)\.(\d+) -- (AGREE|DISAGREE|NO ANSWER) -- RIGHT: ([A-Z ]+?) -- (.*)$',ln)
        if not m: out.append((cid,'FORM',ln[:200])); stat['form']+=1; continue
        iid,k,ad,right,sent=m.groups(); rule,txt=it.get(iid,('?',''))
        stat[(rule,ad,right)]+=1
        fl=[]
        if rule in ALLOW and right not in ALLOW[rule]: fl.append('RIGHT-NOT-ALLOWED')
        main=sent.split(' -- CARRIED BY')[0]
        qs=re.findall(r'[“"]([^“”"]{3,})[”"]',main)
        if not qs: fl.append('NO-QUOTE')
        for q in qs:
            for part in re.split(r'\.\.\.|…',q):
                n=N(part).strip(' .,;:')
                if len(n.split())>=4 and n not in PN:
                    fl.append(('QUOTE-NOT-IN-ITEMS' if n in RN else 'QUOTE-NOT-IN-RECORD')+':'+part[:60])
        cb=re.search(r'-- CARRIED BY: (.*)$',sent)
        need=(rule=='E-COL' and ((ad=='DISAGREE' and right=='STANDS') or (ad=='AGREE' and right=='BROKEN'))) or (rule=='E-HOLD' and ad=='DISAGREE' and right=='UNDERDETERMINED')
        if need and not cb: fl.append('NO-CARRIED-BY')
        if cb:
            ref=re.match(r'((?:[1-3] )?[A-Z][a-z]+(?: [a-z]+)? \d+:\d+(?:-\d+)?)',cb.group(1)); cq=re.findall(r'[“"]([^“”"]+)[”"]',cb.group(1))
            if cq and len(cq[0].split())<6: fl.append('CARRIED-BY-UNDER-6-WORDS')
            if cq and N(cq[0]).strip(' .') not in PN and N(cq[0]).strip(' .') not in RN: fl.append('CARRIED-BY-NOT-IN-RECORD')
            if ref:
                line=re.search(r'THE LINE: (.*)',txt); head=line.group(1) if line else ''
                hv=head.split(' -- ')[0]; g=re.search(r'GROUND: \[L1\] ((?:[1-3] )?[A-Z][a-z]+ \d+:\d+)',head)
                if ref.group(1) in hv or (g and g.group(1)==ref.group(1)): fl.append('CARRIED-BY-IS-PRESSED-VERSE')
        if rule=='E-PREM' and right=='COUNTED' and not main.lstrip().startswith('('): fl.append('COUNTED-NO-KIND')
        for f in fl: stat['FLAG '+f.split(':')[0]]+=1
        out.append((cid,rule,iid+'.'+k,ad,right,fl,sent))
json.dump(out,open('lines.json','w'))
for k,v in sorted(stat.items(),key=str): print(k,v)
