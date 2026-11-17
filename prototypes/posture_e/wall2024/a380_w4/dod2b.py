import json,re
R=json.load(open('res380.json'))
pairs=[]
for x in R:
  d=x['d']
  for j in d['J']:
    for l in re.findall(r'\[AUDIT v21: ALTERNATE TRIED -- [^\n]*',j.get('verdict_raw') or ''):
      m=re.search(r'SEAT: ([^;]+);.*?; REMOVED FOR: (.*)\]$',l)
      if m: pairs.append((x['tok'],j.get('id'),m.group(1),m.group(2)))
U={}
for t,jid,s,c in pairs: U.setdefault((t,jid,s),c)
print('clauses',len(pairs),'distinct (row,seat)',len(U))
ca=cb=cd=cn=0
for (t,jid,s),c in U.items():
  x=[y for y in R if y['tok']==t][0];b=x['b'].split('\n')
  drm=[q for q in (x['d']['r'].get('drv_removed') or []) if q.get('seat')==s]
  sl=[l for l in b if re.match(r'^- .+ was not counted: ',l) and l.split(' was not counted')[0][2:].lower().replace(' ','') in (s.lower(),)]
  # match by name via nm: compare against any seat line whose reason text
  low=x['b'].split('## Alternate judges')[1] if '## Alternate judges' in x['b'] else ''
  seatl=[l for l in low.split('\n') if ' was not counted: ' in l]
  hit=[l for l in seatl if c in l]
  if drm: cd+=1;src='drv_removed line'
  elif hit: cb+=1;src='b (clause)'
  elif seatl: ca+=1;src='a (judge line)'
  else: cn+=1;src='NONE'
  print(' ',t,jid,s,'->',src,'| clause:',c[:70])
print('source a',ca,'source b',cb,'drv_removed',cd,'none',cn)
