# ASK 534 rev 2 (W2): apply CHANGE 3a (raise nothing when the sentence adds more than CAP verses to the verses the line names) to W4's step-2 replay items.
# Inputs: ask534/w4/replay/out_replay534.json, out_fallback534.json. Genealogy = Matthew 1:2-16, Luke 3:23-38.
import json,re,sys
from collections import defaultdict
R='/mnt/project-files/ask534/w4/replay/'
def items():
  for fn in ['out_replay534.json','out_fallback534.json']:
    for r in json.load(open(R+fn)):
      for i in r.get('new_items',[]):
        m=re.match(r'.+ \d+:(\d+)(?:-(\d+))?$',i['verse']);s=re.match(r'.+ \d+:(\d+)-(\d+)$',i['sentence'])
        v1,v2=int(m[1]),int(m[2] or m[1]);a,z=int(s[1]),int(s[2])
        g=bool(re.match(r'Matthew 1:([2-9]|1[0-6])$',i['verse']) or re.match(r'Luke 3:(2[3-9]|3\d)$',i['verse']))
        yield r['run'],r.get('judgment',r.get('seat')),i,(z-a+1)-(v2-v1+1),g
for cap in (1,2,3):
  T=defaultdict(lambda:[0,0,0,0])
  for run,j,i,add,g in items():
    t=T[run];t[0]+=1;t[1]+=g
    if add<=cap:t[2]+=1;t[3]+=g
  print('CAP',cap,'| '+' | '.join(f'{k}: {v[0]} -> {v[2]} (genealogy {v[1]} -> {v[3]})' for k,v in T.items()))
print('ITEMS at CAP 2 (kept/dropped):')
for run,j,i,add,g in items():
  print(('KEEP ' if add<=2 else 'DROP ')+run,j,i['label'],'|',i['verse'],'in',i['sentence'],'| adds',add,'| GEN' if g else '')
