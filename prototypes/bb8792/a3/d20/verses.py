# Attach the KJV text of every verse the judge cites (from JUDGE TEXT TO CHECK) to each d18 input, pulled live by REST.
import re,json,sys,urllib.request,urllib.parse,glob,os
K=open('../s5/fetch.sh').read().split("K='")[1].split("'")[0]
B='https://bhffmkginddovmdcpnty.supabase.co/rest/v1'
def get(q):
    req=urllib.request.Request(B+'/'+q,headers={'apikey':K,'Authorization':'Bearer '+K})
    return json.load(urllib.request.urlopen(req,timeout=60))
BOOKS=sorted({r['book'] for r in get('kjv_verses?select=book&verse=eq.1&chapter=eq.1')},key=len,reverse=True)
bk='|'.join(re.escape(b) for b in BOOKS)
def refs(text):
    out=[]; book=None
    for m in re.finditer(r'(?:\b('+bk+r')\s+)?(\d+):(\d+)(?:-(\d+))?((?:,\s*\d+(?:-\d+)?(?![:\d]))*)',text):
        if m.group(1): book=m.group(1)
        if not book: continue
        c=int(m.group(2)); a=int(m.group(3)); z=int(m.group(4) or a)
        out.append((book,c,a,z))
        for x in re.findall(r',\s*(\d+)(?:-(\d+))?',m.group(5) or ''):
            out.append((book,c,int(x[0]),int(x[1] or x[0])))
    seen=[]; [seen.append(r) for r in out if r not in seen]; return seen
RULE=("A judge's claim about what a verse says counts only if the verse's words below say it. "
      "If they do not, the claim is unsupported.\n")
for f in sorted(glob.glob('../d18/in/*.txt')):
    t=open(f).read(); b=os.path.basename(f)
    jt=t.split('JUDGE TEXT TO CHECK:\n',1)[1].split('\nTHE ',1)[0]
    rs=refs(jt); lines=[]
    for book,c,a,z in rs:
        q=f"kjv_verses?select=verse,text&book=eq.{urllib.parse.quote(book)}&chapter=eq.{c}&verse=gte.{a}&verse=lte.{z}&order=verse"
        for v in get(q): lines.append(f"{book} {c}:{v['verse']} {v['text']}")
    block='THE VERSES THE JUDGE CITES, from the KJV:\n'+('\n'.join(lines) if lines else '(none cited)')+'\n\n'
    assert t.count('\nROUND LABELS:')==1
    t=t.replace('\nROUND LABELS:','\n'+block+'ROUND LABELS:',1)
    a_old='Do not guess at a reason it did not write.\n'; assert t.count(a_old)==1
    t=t.replace(a_old,a_old+RULE)
    open('in/'+b,'w').write(t); print(b,len(lines),'verses:',', '.join(f'{x[0]} {x[1]}:{x[2]}-{x[3]}' for x in rs)[:160])
