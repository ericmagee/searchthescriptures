import json,re,sys
rows=json.load(open('dec530.json'))
STOP=set('that this these those with from which whom what when where their there than then also into upon such have been were will would shall should could being does each very more most some only link links chain round rounds verse verses text says said stated state states before after because under over about against other another rows row stands stand holds hold named names the and for not but his her him its they them was are is be by of to in on at as an or a so no nor it he she who all any one two answer answers side defender challenger fails fail shows show given gives give read reads reading line lines'.split())
def stem(w):
    w=w.lower()
    for s in ('ings','ing','edly','ed','es','s','ly'):
        if len(w)>len(s)+3 and w.endswith(s): return w[:-len(s)]
    return w
def cw(t): return {stem(w) for w in re.findall(r"[A-Za-z]+",t) if len(w)>3 and w.lower() not in STOP}
def grab(ln,a,b):
    m=re.search(a+r'\s*(.*?)\s*(?='+b+r'|$)',ln,re.S); return m.group(1) if m else ''
out=[]
for r in rows:
    ln=r['ln'].replace('\\"','"')
    dec=grab(ln,r'DECIDES\s*[\[\(]L4[\]\)]\s*:',r'--\s*FROM')
    meets=grab(ln,r'--\s*MEETS\s*:',r'--\s*WHY IT FAILS')
    why=grab(ln,r'--\s*WHY IT FAILS\s*:',r'\n|--\s*GROUND|$')
    mq=' '.join(re.findall(r'["“]([^"”]{3,})["”]',meets)) or meets
    shared=(cw(dec)|cw(why))&cw(mq)
    out.append(dict(j=r['j'],seat=r['seat'],head=ln[:50],dec=dec[:200],mq=mq[:200],shared=sorted(shared),n=len(shared)))
json.dump(out,open('m530.out.json','w'),indent=1)
fire=[o for o in out if o['n']<2]
print('lines',len(out),'word-test fails (<2 shared)',len(fire))
for o in fire: print(o['j'],o['seat'],o['head'],'|',o['shared'],'\n   DEC:',o['dec'][:150],'\n   MQ:',o['mq'][:150])
