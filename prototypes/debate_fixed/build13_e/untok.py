import sys,hashlib
s=open(sys.argv[1],encoding='utf-8').read()
s=s.replace('§B','\\').replace('§Q','"').replace('§N','\n')
open(sys.argv[2],'w',encoding='utf-8').write(s)
print(sys.argv[2],len(s),hashlib.md5(s.encode()).hexdigest())
