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
# step 2: insert the ASK 311 entries after the WRITTEN AS s207 line
E=open('entries173.txt',encoding='utf-8').read().rstrip('\n')
L2=t.split('\n')
idx=[i for i,x in enumerate(L2) if x.startswith('  - WRITTEN AS s207 (')]
assert len(idx)==1
L2[idx[0]+1:idx[0]+1]=E.split('\n')
t='\n'.join(L2)
open('engine_manual_v173_draft.txt','w',encoding='utf-8').write(t)
print('draft',len(t),hashlib.md5(t.encode()).hexdigest(),'placeholders',t.count('{'))
# step 3: write facts (W4 Wall 6632; fetchback writes_s208, updatedAt 2026-11-15T03:38:40.953Z = 21:38 CST 11-14)
F={'{SNAME}':'s208','{PRESS}':'21:38 CST','{SAVE}':'21:38 CST','{VERSION}':'1f6e5c21','{LIBSHA}':'f2fc5e0776f9e945'}
for k,v in F.items():
    assert t.count(k)==1,(k,t.count(k)); t=t.replace(k,v)
o1="- Live flow: s207 (n8n version 9a6d6d51, 455 nodes; Shared Library 957,634 characters, sha 3deca1e26d8109bc)."
n1="- Live flow: s208 (n8n version 1f6e5c21, 455 nodes; Shared Library 944,510 characters, sha f2fc5e0776f9e945)."
assert t.count(o1)==1; t=t.replace(o1,n1)
o2="(ASKs 293 to 306, one write). `derive_debate_outcome`"
n2="(ASKs 293 to 306, one write). s208 = s207 - pkgFBD rev 2 - pkgFBA rev 3 - pkgKDA rev 3 - pkgKDG rev 4e + pkgNSG rev 2 + pkgNRC + pkgOVS rev 3 + pkgKWV + pkgVNV rev 2 (ASK 311, one write; Ruling 383). `derive_debate_outcome`"
assert t.count(o2)==1; t=t.replace(o2,n2)
open('engine_manual_v173_draft.txt','w',encoding='utf-8').write(t)
print('final',len(t),hashlib.md5(t.encode()).hexdigest())
# step 4: K-W cure form in the rule table (pkgKWV)
o3="RESPONSE: STANDS WITHOUT IT because <a layer, [L1]-[L3]>;"
n3="RESPONSE: STANDS WITHOUT IT because <a layer, [L1]-[L3], or a verse quoted with its reference in three or more exact words of that verse as served this run>;"
assert t.count(o3)==1; t=t.replace(o3,n3)
open('engine_manual_v173_draft.txt','w',encoding='utf-8').write(t)
print('final2',len(t),hashlib.md5(t.encode()).hexdigest())
