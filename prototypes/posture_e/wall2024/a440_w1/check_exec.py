#!/usr/bin/env python3
"""ASK 440 run validation, n8n part (W1): items 468 and 475 (N3) on the engine execution of the run.
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
