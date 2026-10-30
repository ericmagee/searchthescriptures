import json,hashlib,sys,collections
# usage: check_part.py part.jsonl md5s.tsv   (md5s.tsv: id<TAB>md5<TAB>count per line)
recs=[json.loads(l) for l in open(sys.argv[1],encoding='utf-8') if l.strip()]
by=collections.defaultdict(list)
for r in recs: by[r['i']].append((r['n'],r['t']))
exp={}
for l in open(sys.argv[2]):
  if l.strip(): i,h,k=l.split('\t'); exp[int(i)]=(h.strip(),int(k))
bad=[]
for i,(h,k) in exp.items():
  rows=sorted(by.get(i,[]))
  s='\n'.join(f'{n}\t{t}' for n,t in rows)
  if len(rows)!=k or hashlib.md5(s.encode('utf-8')).hexdigest()!=h: bad.append(i)
extra=set(by)-set(exp)
print('ids',len(exp),'lines',len(recs),'bad',bad,'extra',sorted(extra))
