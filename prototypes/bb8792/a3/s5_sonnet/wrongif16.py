import json, glob, os, sys
sys.path.insert(0, '..'); from wrongif import check
UD='../cut/units/'
tu = dict(l.split('\t') for l in open('calls.tsv').read().splitlines())
fires=[]; n=0
for f in sorted(glob.glob('out/*.json')):
    b=os.path.basename(f)[:-5]; unit,rule,r=b.rsplit('__',2); n+=1
    text=open(UD+unit+'.txt').read()
    msg=check(open(f).read(), rule, text)
    t=int(tu.get(f,'0'))
    if t!=3: msg=(msg+'; ' if msg else '')+'tool_uses %d'%t
    if msg: fires.append((b,msg))
print('outputs', n, 'tool log rows', len(tu), 'fires', len(fires))
for x in fires: print(x)
