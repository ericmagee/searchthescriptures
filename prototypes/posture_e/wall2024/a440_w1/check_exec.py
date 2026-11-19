#!/usr/bin/env python3
"""ASK 440 run validation, n8n part (W1): items 468 and 475 (N3), and item 11 (455 a, since ASK 479) on the engine execution of the run.
Usage: python3 -I check_exec.py <engine_execution.json>   (the full execution with data, as get_workflow_execution returns it)
Read only. Prints one line per B round and the pkgLAYB count in the run data (node code is not searched)."""
import json,sys
X=json.load(open(sys.argv[1]))
def find_rd(o):
  if isinstance(o,dict):
    if 'runData' in o and isinstance(o['runData'],dict): return o['runData']
    for v in o.values():
      r=find_rd(v)
      if r is not None: return r
  return None
rd=find_rd(X)
if rd is None: sys.exit('no runData in this file')
def items(node):
  out=[]
  for run in rd.get(node,[]) or []:
    for br in ((run.get('data') or {}).get('main') or []):
      for it in br or []: out.append(it.get('json',{}))
  return out
ok=True
for R in ['D2','C2','D3','C3','D4','C4']:
  b=items(R+'B Build'); x=items(R+'B Extract')
  if not b: print(R,'NOT RUN'); ok=False; continue
  has=[('lay_check' in i) for i in b]
  lc=[i.get('lay_check') for i in b]
  first=[((i.get('bar') or {}).get('layers') or {}).get('first') if isinstance(i.get('bar'),dict) else None for i in x]
  resend=[bool(i.get('resend')) for i in x]
  line='%s Build items %d, lay_check key on all: %s, non-null %d; Extract items %d, bar.layers.first non-null %d, resend %d'%(R,len(b),all(has),sum(v is not None for v in lc),len(x),sum(v is not None for v in first),sum(resend))
  if not all(has): ok=False
  print(line)
s=json.dumps(rd)
n=s.count('pkgLAYB:')
print('pkgLAYB: in run data:',n)
print('468/475 VERDICT:', 'EXERCISED' if ok and n==0 else 'CHECK BY HAND')
# Item 11, 455 (a) (W2 9549 B1): with the deepseek rows inactive (ASK 479), Resolve Seats' deepseek field must carry the luna row.
def dig(o,k):
  if isinstance(o,dict):
    if k in o: return o[k]
    for v in o.values():
      r=dig(v,k)
      if r is not None: return r
  elif isinstance(o,list):
    for v in o:
      r=dig(v,k)
      if r is not None: return r
  return None
rs=items('Resolve Seats')
am=[(dig(i.get('deepseek'),'api_model') if i.get('deepseek') is not None else dig(i,'deepseek')) for i in rs]
am=[a if isinstance(a,str) else (dig(a,'api_model') if a is not None else None) for a in am]
print('Resolve Seats items %d, deepseek.api_model: %s'%(len(rs),sorted(set(map(str,am)))))
print('455 (a) VERDICT:', 'EXERCISED (luna)' if rs and all(a=='openai/gpt-6-luna' for a in am) else ('NOT RUN' if not rs else 'CHECK BY HAND'))
