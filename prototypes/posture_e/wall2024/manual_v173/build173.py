# v173 draft builder: removal step (Ruling 383, operator "approved" 20:34 CST 11-14)
import hashlib,sys
L=open('v172.txt',encoding='utf-8').read().split('\n')
# 1-based inclusive ranges to remove (v172 line numbers)
cut=[(1223,1227),(1246,1251),(1270,1275),(1276,1281),(1282,1287)]
# sanity: each range starts at the expected heading
starts={1223:'THE DG-8 FORBIDDEN LIST',1246:'A SEND-BACK CANNOT SET MEETS OR STANDS ON DG-8',1270:'E-ASSUME TESTS ITS FACTS AGAINST THE DG-8',1276:'THREE DOCTRINE TESTS',1282:'A DEFENDER LINK THAT RESTS ON THE GENNAO'}
for a,s in starts.items():
    assert s in L[a-1], (a,L[a-1][:80])
for a,b in cut:
    assert L[b].startswith('  - '), (b+1,L[b][:60])  # next line is a new entry
drop=set(i for a,b in cut for i in range(a-1,b))
out=[x for i,x in enumerate(L) if i not in drop]
t='\n'.join(out)
open('v173_step1_removal.txt','w',encoding='utf-8').write(t)
print(len('\n'.join(L)),'->',len(t),hashlib.md5(t.encode()).hexdigest())
# step 1b: the 294 limit line names the removed packages
old="it does not test the keystone against the DG-8 list (that is 296 and 300)."
new="it does not test the keystone against the record's guards; no judge path does (WHO IS BOUND)."
assert t.count(old)==1
t=t.replace(old,new)
open('v173_step1_removal.txt','w',encoding='utf-8').write(t)
print('step1b',len(t),hashlib.md5(t.encode()).hexdigest())
