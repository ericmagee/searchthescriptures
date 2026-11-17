import json,re
L=json.load(open('labels.json'));lab=L['labels'] if isinstance(L['labels'],dict) else json.loads(L['labels'].replace("'",'"'))
lr=json.load(open('labrows.json'));r=json.load(open('results.json'))
VER=r'(CONFIRMED|NOT A CONTRADICTION|NOT CONFIRMED|WITHDRAWN|[A-Z][A-Z ]+?)'
def parse(t):
  out={}
  for l in (t or '').split('\n'):
    m=re.match(r'^\W*([A-Z]+(?:-[A-Z]+)*)\s*:\s*(\w+)\s*--\s*(DEFENDER|CHALLENGER)\s*--\s*LINK\s*(\w+)\s*--\s*([A-Z][A-Z ]+?)\s*(?:--|$)',l)
    if m: out[(m.group(2),m.group(3),m.group(4))]=m.group(5).strip()
  return out
P={k:(parse(v.get('content')) if 'content' in v else None) for k,v in r.items()}
rows=[]
for x in lr:
  it=x['item'].split();lbl,side,link=it[0],it[1],it[3] if len(it)>3 else '?'
  cells={}
  for ver in ('old','new'):
    for t in ('0','0.6'):
      ks=[k for k in P if k.startswith(x['ex']+'|'+x['seat']+'|'+side+'|') and k.endswith('|'+ver+'|'+t)]
      if not ks: cells[ver+t]='-';continue
      p=P[ks[0]];cells[ver+t]='ERR' if p is None else p.get((lbl,side,link),'absent')
  rows.append((x['id'],lab.get(str(x['id'])),x['ex'],x['seat'][:5],x['item'],cells))
for row in rows: print(row[0],row[1],row[2],row[3],row[4],'|',' / '.join(f"{k}:{v}" for k,v in row[5].items()))
