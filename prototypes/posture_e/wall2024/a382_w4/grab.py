# grab an MCP SQL result from this session's transcript by a unique marker; decode the dictionary form (words|books|rows) into rows in id order
import json,sys,re
marker,out=sys.argv[1],sys.argv[2]
for line in open('/root/.claude/projects/-home-user/86d59483-62fd-5fa0-b8c4-6322500f4823.jsonl',encoding='utf-8'):
  if marker not in line or 'untrusted-data' not in line: continue
  o=json.loads(line);s=json.dumps(o)
  def walk(x):
    if isinstance(x,str):
      if marker in x: yield x
    elif isinstance(x,dict):
      for v in x.values(): yield from walk(v)
    elif isinstance(x,list):
      for v in x: yield from walk(v)
  for t in walk(o):
    if '"result"' not in t: continue
    r=json.loads(t)['result'];a=r.index('\n[');b=r.rindex(']\n')
    rec=json.loads(r[a+1:b+1])[0]
    W,B=rec['words'].split('|'),rec['books'].split('|');rows=[]
    for tok in rec['rows'].split(' '):
      q=list(map(int,tok.split('.')));rows.append({'kjv_word':W[q[0]],'book':B[q[1]],'chapter':q[2],'verse':q[3],'word_position':q[4]})
    json.dump(rows,open(out,'w'));print(out,len(rows));sys.exit()
print('not found')
