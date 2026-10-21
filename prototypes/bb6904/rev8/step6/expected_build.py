# BB-6904 step 6 (7227), the verifier's own build: items 1, 2 and 5 of patch_rev8.py (item 3, section G, held out) applied to every
# Code node of the baseline workflow. A draft's nodes are then compared to these by md5. The removal A to C is checked by verify_removal.py.
# Usage: python3 -I expected_build.py <patch_rev8.py> <baseline workflow json> <out json> [--item3]
# --item3 (7230, approved 09:34): the two item 3 anchors are applied too, after the others (the composed order).
import json,sys,hashlib
P,BASE,OUT=sys.argv[1:4];WITH3='--item3' in sys.argv
src=open(P).read();head=src[:src.index('src=open(sys.argv[1])')]
ns={'sys':sys};exec(compile(head,P,'exec'),ns);A=ns['A']
HELD={"if(RF)throw new Error(","refused by the provider: '+RF+';"}   # item 3 (section G), not approved
A2=[(o,n) for o,n in A if o not in HELD]
assert len(A)-len(A2)==2,'item 3 anchors not found as expected'
if WITH3:A2=A2+[(o,n) for o,n in A if o in HELD]
d=json.load(open(BASE));w=d.get('workflow',d);res={}
for nd in w['nodes']:
    js=(nd.get('parameters') or {}).get('jsCode')
    if js is None:continue
    out=js;applied=0
    for o,n in A2:
        c=out.count(o)
        if c==0:continue
        if c!=1:sys.exit('REFUSED: %s: anchor occurs %d times: %r'%(nd['name'],c,o[:60]))
        out=out.replace(o,n);applied+=1
    res[nd['name']]={'applied':applied,'before_md5':hashlib.md5(js.encode()).hexdigest(),'after_md5':hashlib.md5(out.encode()).hexdigest(),'after':out}
json.dump(res,open(OUT,'w'))
for k,v in sorted(res.items()):
    if v['applied']:print('%-34s anchors %2d  before %s  after %s'%(k,v['applied'],v['before_md5'][:8],v['after_md5'][:8]))
print('patched nodes:',sum(1 for v in res.values() if v['applied']),'anchors held out (item 3):',len(A)-len(A2))
