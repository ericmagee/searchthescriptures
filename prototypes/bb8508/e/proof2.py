import json,re,sys
ORD=['cr1','gr1','cr2','gr2','cr3','dr3']
def parse(lab):
  m=re.match(r'(.+) (\d+):(\d+)(?:-(\d+))?$',lab); return m.group(1),int(m.group(2)),list(range(int(m.group(3)),int(m.group(4) or m.group(3))+1))
def explicit(text,b,c,v):
  out=[]
  for m in re.finditer(re.escape(b)+r'\.?\s+'+str(c)+r':(\d+)(?:\s?[–—-]\s?(\d+))?((?:\s?,\s?\d+(?!\s*:))*)',text):
    a=int(m.group(1)); e=int(m.group(2) or a); ex=[int(x) for x in re.findall(r'\d+',m.group(3) or '')]
    if a<=v<=e or v in ex: out.append(m.start())
  return out
def bare(text,c,v):
  out=[]
  for m in re.finditer(r'(?<![A-Za-z]\s)(?<![\d:A-Za-z])'+str(c)+r':(\d+)(?:\s?[–—-]\s?(\d+))?',text):
    a=int(m.group(1)); e=int(m.group(2) or a)
    if a<=v<=e: out.append(m.start())
  return out
for run in sys.argv[1:]:
  F=json.load(open('F_%s.json'%run)); L=open('new_%s.txt'%run).read().split('\n'); n=0; flags=[]
  for l in L:
    for side,(press,ans) in {'cited in [DR1]':(['gr1','gr2'],['cr2','cr3']),'cited in [CR1]':(['cr1','cr2','cr3'],['gr2','dr3'])}.items():
      if not l.startswith(side): continue
      for lab in [x.strip() for x in l.split('): ',1)[1].split(', ') if x.strip() and x.strip()!='none']:
        n+=1; b,c,vs=parse(lab)
        first=[k for k in press if any(explicit(F[k],b,c,v) for v in vs)]
        if not first: flags.append(('NO EXPLICIT SOURCE',lab)); continue
        fi=ORD.index(first[0]); later=[k for k in ans if ORD.index(k)>fi]
        ex=[(k,F[k][max(0,p-40):p+30].replace('\n',' ')) for k in later for v in vs for p in explicit(F[k],b,c,v)]
        br=[(k,F[k][max(0,p-60):p+12].replace('\n',' ')) for k in later for v in vs for p in bare(F[k],c,v)]
        if ex: flags.append(('FALSE: named explicitly later',lab,ex[:2]))
        elif br: flags.append(('REVIEW: bare mention later',lab,br[:2]))
    if l.startswith('premise') and 'NOT NAMED: none' not in l and 'no verse carried' not in l: flags.append(('PREMISE',l))
  print('=====',run,'entries',n); [print(' ',f) for f in flags]
