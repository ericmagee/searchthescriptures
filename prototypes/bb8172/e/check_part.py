import json,hashlib,sys,collections,glob
# usage: check_part.py data/gate.txt data/part*.jsonl   gate: id:md5prefix12:count space-separated
exp={}
for tok in open(sys.argv[1]).read().split():
  i,h,k=tok.split(':'); exp[int(i)]=(h,int(k))
by=collections.defaultdict(list); n=0
for f in sys.argv[2:]:
  for l in open(f,encoding='utf-8'):
    if l.strip(): r=json.loads(l); by[r['i']].append((r['n'],r['t'])); n+=1
bad=[];missing=[]
for i,(h,k) in exp.items():
  if i not in by: missing.append(i); continue
  rows=sorted(by[i]); s='\n'.join(f'{a}\t{t}' for a,t in rows)
  if len(rows)!=k or hashlib.md5(s.encode('utf-8')).hexdigest()[:12]!=h: bad.append(i)
print('gate ids',len(exp),'lines read',n,'ids read',len(by),'bad',bad,'missing',missing,'extra',sorted(set(by)-set(exp)))
