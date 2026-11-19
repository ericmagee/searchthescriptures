import json,re,sys
def blocks(f):
    out={};cur=None
    for l in open(f,encoding='utf8'):
        m=re.match(r'^=== (ODV1-\S+)',l)
        if m: cur=m.group(1);out[cur]={};continue
        m=re.match(r'^(OLD|NEW) (.*)$',l.rstrip('\n'))
        if m and cur: out[cur][m.group(1)]=json.loads(m.group(2))
    return out
a=blocks(sys.argv[1]);b=blocks(sys.argv[2])
for r in a:
  for k in ('OLD','NEW'):
    want=a[r][k];j=b[r][k][0]['json']
    hit=[key for key,v in j.items() if v==want]
    print(r,k,'match in field',hit)
