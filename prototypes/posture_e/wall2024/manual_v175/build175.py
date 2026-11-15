import hashlib,sys
src=open('v174.txt',encoding='utf-8').read()
assert hashlib.md5(src.encode()).hexdigest()=='d79d469e48895a063bccc5e233828bd7'
anchor='  - Limits: the defender\'s own citation of Deuteronomy 22 is not touched.\n\n## 6. Rounds'
assert src.count(anchor)==1
e=open('entry175.txt',encoding='utf-8').read()
c=src.replace(anchor,'  - Limits: the defender\'s own citation of Deuteronomy 22 is not touched.\n'+e+'\n## 6. Rounds')
open('engine_manual_v175_draft.txt','w',encoding='utf-8').write(c)
print(len(src),len(c),hashlib.md5(c.encode()).hexdigest())
