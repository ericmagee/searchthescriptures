import hashlib
v=open('engine_manual_v171_draft.txt',encoding='utf-8').read()
assert hashlib.md5(v.encode()).hexdigest()=='0c268523e5c9def2dfe15dea95237897'
a="    - Limits: the LINK-ROUND FORMAT CHECK note is cut at line 1891 but not here (0 times in the 37113 enforcer prompts). Not shown by a run.\n"
assert v.count(a)==1
w=("  - WRITTEN AS s206 (ASKs 287, 288, 289 rev 2 and 290 together; n8n version 00f22045, 2026-11-14 17:06 CST): exactly 3 nodes differ from s205. "
   "Alternate Merge 3,072 to 5,068; Build Save Body 81,554 to 79,980 (pkgACL2 and pkgORD2); Shared Library 931,428 to 932,112 (pkgEAL rev 2 +590 and pkgCLN2 +94, each as built alone on s205), library sha 765d25b6242481f3. "
   "Each length is the graded length. None of the four is shown by a run yet.\n")
v=v.replace(a,a+w)
o="- Live flow: s205 (n8n version 7d290a06, 455 nodes; Shared Library 931,428 characters, sha a894ff926b24be72)."
assert v.count(o)==1
v=v.replace(o,"- Live flow: s206 (n8n version 00f22045, 455 nodes; Shared Library 932,112 characters, sha 765d25b6242481f3).")
o2="+ pkgORD rev 2 (s205)."
assert v.count(o2)==1
v=v.replace(o2,"+ pkgORD rev 2 (s205). s206 = s205 + pkgACL2 + pkgORD2 + pkgEAL rev 2 + pkgCLN2 (ASKs 287 to 290, one write).")
open('engine_manual_v171_draft.txt','w',encoding='utf-8').write(v)
print(len(v),hashlib.md5(v.encode()).hexdigest())
