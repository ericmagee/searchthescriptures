import hashlib
v=open('v171.txt',encoding='utf-8').read()
assert hashlib.md5(v.encode()).hexdigest()=='2b0edad6ed8a6e0d623115c80f11b99a'
E=open('entries172.txt',encoding='utf-8').read()
a="None of the four is shown by a run yet.\n"
assert v.count(a)==1
v=v.replace(a,a+E)
o="- Live flow: s206 (n8n version 00f22045, 455 nodes; Shared Library 932,112 characters, sha 765d25b6242481f3)."
assert v.count(o)==1
v=v.replace(o,"- Live flow: s207 (n8n version 9a6d6d51, 455 nodes; Shared Library 957,634 characters).")
o2="(ASKs 287 to 290, one write)."
assert v.count(o2)==1
v=v.replace(o2,o2+" s207 = s206 + pkgCQL rev 2 + pkgKRB rev 2 + pkgBNS + pkgFBD rev 2 + pkgRHD + pkgPIN + pkgVBC2 rev 2 + pkgFBA rev 3 + pkgKDA rev 3 + pkgKDG rev 4e + pkgRLG + pkgPWR rev 2 (ASKs 293 to 306, one write).")
open('engine_manual_v172_draft.txt','w',encoding='utf-8').write(v)
print(len(v),hashlib.md5(v.encode()).hexdigest())
