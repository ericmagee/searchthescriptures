# Step (c): enforcer inputs from the frozen d20 K-S2 input, judge text = arm C collision lines, plus the GROUND-check line. Verses pulled live by REST.
import re,json,os,urllib.request,urllib.parse
T=open('../d20/in/C_25eae673__K-S2.txt').read()
head=T.split('THE VERSES THE JUDGE CITES, from the KJV:\n')[0]
labels_line='ROUND LABELS:'+T.split('ROUND LABELS:')[1].split('\n')[0]+'\n\n'
reply=T[T.index('Reply with exactly one JSON object'):]
J='Judge only the reasons the judge wrote. Do not guess at a reason it did not write.\n'
assert head.count(J)==1
head=head.replace(J,J+'Check the GROUND the judge wrote on each line. If a line has no GROUND, say so in "why".\n')
K=open('../s5/fetch.sh').read().split("K='")[1].split("'")[0]
B='https://bhffmkginddovmdcpnty.supabase.co/rest/v1'
def get(q):
    req=urllib.request.Request(B+'/'+q,headers={'apikey':K,'Authorization':'Bearer '+K}); return json.load(urllib.request.urlopen(req,timeout=60))
BOOKS=sorted({r['book'] for r in get('kjv_verses?select=book&verse=eq.1&chapter=eq.1')},key=len,reverse=True)
bk='|'.join(re.escape(b) for b in BOOKS)
def refs(text):
    out=[];book=None
    for m in re.finditer(r'(?:\b('+bk+r')\s+)?(\d+):(\d+)(?:-(\d+))?((?:,\s*\d+(?:-\d+)?(?![:\d]))*)',text):
        if m.group(1): book=m.group(1)
        if not book: continue
        c=int(m.group(2));a=int(m.group(3));z=int(m.group(4) or a); out.append((book,c,a,z))
        for x in re.findall(r',\s*(\d+)(?:-(\d+))?',m.group(5) or ''): out.append((book,c,int(x[0]),int(x[1] or x[0])))
    s=[];[s.append(r) for r in out if r not in s];return s
L=re.compile(r'^\W*D\d+(?:\s+vs\.?\s+C\d+)?(?:\s*\([^)\n]*\))?\s*\**\s*(?::|--|—)\s*\**\s*(?:--\s*)?(STANDS|UNDERDETERMINED|WITHDRAWN|DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN)')
rounds={x['run_token'].split('-')[1]:x for x in json.load(open('../s5/rounds.json'))}
COL={'CR1':'claude_r1','CR2':'claude_r2','CR3':'engine_r3','DR1':'engine_r1','DR2':'engine_r2','DR3':'challenger_r3'}
ORDER=['CR1','CR2','CR3','DR1','DR2','DR3']
os.makedirs('in',exist_ok=True)
for run in ['30196','30268','30304']:
  for r in '123':
    t=open(f'../g1/deepseek/out/{run}__C__r{r}.txt').read()
    jt='\n'.join(l for l in t.split('\n') if L.match(l))
    vs=[]
    for book,c,a,z in refs(jt):
        q=f"kjv_verses?select=verse,text&book=eq.{urllib.parse.quote(book)}&chapter=eq.{c}&verse=gte.{a}&verse=lte.{z}&order=verse"
        for v in get(q): vs.append(f"{book} {c}:{v['verse']} {v['text']}")
    labs=sorted({a+b for a,b in re.findall(r'[\[(]?\b(CR|DR)([123])\b',jt)},key=ORDER.index)
    rb='\n\n'.join(f'=== [{l}] ===\n{rounds[run][COL[l]]}' for l in labs) or '(none named)'
    out=head+'THE VERSES THE JUDGE CITES, from the KJV:\n'+('\n'.join(vs) or '(none cited)')+'\n\n'+labels_line+'JUDGE TEXT TO CHECK:\n'+jt+'\n\n\nTHE ROUNDS THE JUDGE TEXT NAMES, whole:\n'+rb+'\n\n'+reply
    open(f'in/{run}C{r}__K-S2.txt','w').write(out)
    print(run,r,'lines',jt.count('\n')+1,'verses',len(vs),'rounds',labs,'chars',len(out))
