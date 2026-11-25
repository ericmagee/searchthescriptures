# Parse an ASK AAR row draft and print md5 of each column as Postgres to_jsonb(row)->jsonb_each value::text would render it.
import re,json,sys,hashlib
COORD='session_01H1X3AL5KfKYMoT4F8yvitF'
def jtxt(v):
    # Postgres jsonb text: keys ordered by (len bytes, bytes); separators ", " ": "; non-ascii raw
    if isinstance(v,dict):
        ks=sorted(v,key=lambda k:(len(k.encode()),k.encode()))
        return '{'+', '.join(json.dumps(k,ensure_ascii=False)+': '+jtxt(v[k]) for k in ks)+'}'
    if isinstance(v,list): return '['+', '.join(jtxt(x) for x in v)+']'
    return json.dumps(v,ensure_ascii=False)
def tok(s):
    i=0;out=[]
    while True:
        while s[i] in ' ,\n\t': i+=1
        if s[i]==')': return out,i
        if s.startswith('to_jsonb(',i):
            m=re.match(r'to_jsonb\(\$(\w*)\$',s[i:]);d='$'+m.group(1)+'$';a=i+len(m.group(0));j=s.index(d,a);v=s[a:j];i=j+len(d)
            assert s.startswith('::text)',i),s[i:i+20]; i+=7; out.append(('J',v)); continue
        if s[i]=='$':
            m=re.match(r'\$(\w*)\$',s[i:]);d=m.group(0);j=s.index(d,i+len(d));v=s[i+len(d):j];i=j+len(d)
            if s.startswith('::jsonb',i): i+=7; out.append(('J',json.loads(v)))
            else: out.append(('T',v))
            continue
        if s[i]=="'":
            j=s.index("'",i+1); v=s[i+1:j]; i=j+1
            if s.startswith('::jsonb',i): i+=7; out.append(('J',json.loads(v)))
            else: out.append(('T',v))
            continue
        if s.startswith('ARRAY[',i):
            j=s.index(']',i); out.append(('J',re.findall(r"'([^']*)'",s[i:j]))); i=j+1
            if s.startswith('::text[]',i): i+=8
            continue
        if s.startswith("current_setting('truth.session_id')",i): out.append(('T',COORD)); i+=len("current_setting('truth.session_id')"); continue
        if s.startswith('NULL',i): out.append(('N',None)); i+=4; continue
        if s[i]=='(':
            dep=0;j=i
            while True:
                dep+= s[j]=='('; dep-= s[j]==')'
                if dep==0: break
                j+=1
            out.append(('S',s[i:j+1])); i=j+1; continue
        m=re.match(r'-?\d+',s[i:]); assert m, s[i:i+60]; out.append(('I',int(m.group(0)))); i+=len(m.group(0))
src=open(sys.argv[1]).read()
k=src.index('INSERT INTO ask_aar_snapshots'); cols=[c.strip() for c in re.search(r'\(([^)]*)\)\s*VALUES\s*\(',src[k:]).group(1).split(',')]
a=src.index('VALUES (',k)+8; vals,_=tok(src[a:])
assert len(cols)==len(vals),(len(cols),len(vals))
res={}
for c,(t,v) in zip(cols,vals):
    if t=='T': s=json.dumps(v,ensure_ascii=False)
    elif t=='J': s=jtxt(v)
    elif t=='I': s=str(v)
    elif t=='N': s='null'
    else: s='SUBQ'
    res[c]=hashlib.md5(s.encode()).hexdigest() if s!='SUBQ' else 'SUBQ'
# builders
b=src.index('INSERT INTO ask_aar_builders'); bs=src[b:]
seats=re.search(r"ARRAY\[([^\]]*)\]",bs).group(1); seats=re.findall(r"'([^']*)'",seats)
m=re.search(r'\$j\$(.*?)\$j\$::jsonb',bs,re.S); bsrc=json.loads(m.group(1))
res['B.builder_seats']=hashlib.md5(jtxt(seats).encode()).hexdigest(); res['B.sources']=hashlib.md5(jtxt(bsrc).encode()).hexdigest()
print(json.dumps(res))
