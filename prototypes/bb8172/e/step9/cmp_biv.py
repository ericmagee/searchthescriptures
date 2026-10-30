import json,sys
from texts import C3,QR,SV,CL
def prompt(f):
    o=json.load(open(f))[0]['json']; vb=o['verdictBody']
    msgs=vb.get('messages') or []
    return '\n'.join(m['content'] if isinstance(m['content'],str) else json.dumps(m['content']) for m in msgs)
b=prompt('biv_out_base.json'); n=prompt('biv_out_new.json')
fail=0
def ok(c,m):
    global fail; print(('PASS ' if c else 'FAIL ')+m); fail+=(not c)
for k,s in [('C3',C3),('QR',QR),('SV',SV),('CL',CL)]: ok(n.count(s)==1 and b.count(s)==0, k+' once in served prompt (evaluated), absent before')
i=n.find('PRE-CHECK -- decides nothing'); j=n.find('COUNTING RULE -- BINDING')
ok(i>0 and j>i and n.count('PRE-CHECK -- decides nothing')==1, 'block once, before COUNTING RULE')
ok('DEFENDER LIST [CR3] item 1: absent from its quote: three, timing' in n, 'block carries computed 29609 [CR3] item 1 line')
blk=n[i:j]; r=n.replace(' '+C3+' '+QR,'',1).replace(' '+SV+' '+CL,'',1).replace(blk,'',1)
print('len base',len(b),'new',len(n),'new-minus-inserts',len(r))
ok(r.replace('\n\n\n\n','\n\n')==b or r==b, 'served prompt minus inserts == base prompt')
print('ALL PASS' if not fail else 'FAILED %d'%fail)
